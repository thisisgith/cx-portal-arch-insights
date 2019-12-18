import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { mergeMap, switchMap, filter, take, finalize, catchError } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { APIxService } from '@services';
import { environment } from '@environment';
import { ApixIdentityService } from './apix-identity.service';
import { OriginType } from '@constants';
import { ProfileService } from '@cisco-ngx/cui-auth';
import * as _ from 'lodash-es';

/**
 * Intercepts http requests to add auth headers APIx requests.
 */
@Injectable({
	providedIn: 'root',
})
export class ApixAuthInterceptor implements HttpInterceptor {
	public isRefershingCwayToken = false;
	public cwayTokenSubject = new BehaviorSubject<string>(null);
	public cwayToken: string;
	constructor (
		private apixService: APIxService,
		private apixIdentityService: ApixIdentityService,
		private logger: LogService,
		private profileService: ProfileService,
	) { }
	/**
	 * Intercepts all HTTP requests and attaches an APIx bearer token
	 * to the header if it's an APIx request.
	 * @param req the request
	 * @param next HttpHandler
	 * @returns A continued HTTP request
	 */
	public intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		try {
			const url = new URL(req.url, environment.origin);
			let clientId: string;
			switch (this.apixIdentityService.testOrigin(url)) {
				case OriginType.SDP:
					clientId = environment.sdpServiceClientId;
					break;
				case OriginType.RMA:
					clientId = environment.rmaServiceClientId;
					break;
			}

			if (clientId) {
				return this.apixService
					.getToken(clientId)
					.pipe(mergeMap(token => next.handle(req.clone({
						headers: req.headers.set('authorization', `Bearer ${token}`),
					}))));
			}
		} catch (err) {
			this.logger.error(err);
		}

		/**
		 * Token refresh logic for cway - apollo API calls
		 */
		const matchUrl = new URL(req.url, environment.origin);
		if (this.apixIdentityService.testOrigin(matchUrl) === OriginType.APOLLO) {
			return next.handle(req.clone({
				headers: req.headers.set('authorization', this.cwayToken ? this.cwayToken :
				_.get(this.profileService, ['CISCO', 'bearerToken'])),
			}))
				.pipe(
					catchError((err: HttpErrorResponse) => {
						if (err.status === 401 || err.status === 500) {
							/**
							 * Once the API call is failed with the status 401/500 error then fetch the latest token
							 */
							if (!this.isRefershingCwayToken) {
								/**
								 * Make @isRefershingCwayToken flag as true to avoid multiple times the cway token
								 * is being called during multiple service calls getting failed sequentially
								 */
								this.isRefershingCwayToken = true;
								this.cwayTokenSubject.next(null);
								/**
								 * Call the cway token API to fetch the latest token
								 */

								return this.apixService
									.fetchCwayToken()
									.pipe(switchMap(token => {
										/**
										 * @cwayToken always holds the latest token
										 */
										this.cwayToken = token;
										/**
										 * Set the latest token into the profile service to use this for further more calls
										 * attchements, settings etc...
										 */
										_.set(this.profileService, ['ciscoWindow', 'cisco', 'bearerToken'], token);
										_.set(this.profileService, ['CISCO', 'bearerToken'], token);
										/**
										 * Call the account service whenever getting the 401 error to avoid the account details being
										 * removed after 1 hour
										 */

										return this.apixService
											.fetchAccountInfo()
											.pipe(
												switchMap(() => {
													/**
													 * Set the latest token into the subject @cwayTokenSubject
													 * for reminaing failed services to consume
													 */
													this.cwayTokenSubject.next(token);

													return next.handle(req.clone({
														headers: req.headers.set('authorization', token),
													}));
												}),
									);
									/**
									 * Make @isRefershingCwayToken flag as false at the end so that
									 * the next set of failed calls should be served by fetching the
									 * latest token and repeat the same
									 */
									}), finalize(() => this.isRefershingCwayToken = false,
									));
							}
							/**
							 * Once the @isRefershingCwayToken flag becomes true, if two or more Apollo API'S getting
							 * failed then it should be handled here
							 */

							return this.cwayTokenSubject
									.pipe(
										/**
										 * Should filter the null token and wait until the token will be available
										 */
										filter(token => token !== null),
										/**
										 * Once the token is available, it wil be used for the queued failed service calls
										 */
										take(1),
										switchMap(token =>
											/**
											 * Failed service calls can be served here
											 */

											 next.handle(req.clone({
												headers: req.headers.set('authorization', token),
											})),
										));
						}

						return throwError(err);
					},
					));
		}

		return next.handle(req);
	}
}
