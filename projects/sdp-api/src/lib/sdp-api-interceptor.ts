import { Inject, Injectable, Optional } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { TokenService } from './token-service';

import * as _ from 'lodash';

/**
 * Intercepts http requests to add auth headers to SDP API requests.
 */
@Injectable({
	providedIn: 'root',
})
export class SdpApiInterceptor implements HttpInterceptor {
	private origin;
	private clientId;

	constructor (
		@Optional() @Inject('ENVIRONMENT') public environment: any = { },
		private tokenService: TokenService,
	) {
		this.origin = _.get(environment, 'services.sdp.origin');
		this.clientId = _.get(environment, 'services.sdp.clientId');
	}

	/**
	 * Interceptor
	 * @param req the request
	 * @param next next
	 * @returns handler
	 */
	public intercept (
		req: HttpRequest<any>,
		next: HttpHandler,
	): Observable<HttpEvent<any>> {
		let url: URL;
		try {
			url = new URL(req.url);
		} catch (err) {
			return next.handle(req);
		}

		if (url.origin !== this.origin) {
			return next.handle(req);
		}

		return this.tokenService.getToken(this.clientId).pipe(mergeMap(token => {
			return next.handle(req.clone({
				headers: req.headers.set('authorization',`Bearer ${token}`)
			}));
		}))
	}
}
