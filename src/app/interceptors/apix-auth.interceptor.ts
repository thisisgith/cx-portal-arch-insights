import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { APIxService } from '@services';
import { environment } from '@environment';
import { ApixIdentityService } from './apix-identity.service';
import { OriginType } from '@constants';

/**
 * Intercepts http requests to add auth headers APIx requests.
 */
@Injectable({
	providedIn: 'root',
})
export class ApixAuthInterceptor implements HttpInterceptor {
	constructor (
		private apixService: APIxService,
		private apixIdentityService: ApixIdentityService,
		private logger: LogService,
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

		return next.handle(req);
	}
}
