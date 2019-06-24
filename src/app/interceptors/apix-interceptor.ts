import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { APIxService } from '@services';
import { environment } from '@environment';

import * as _ from 'lodash-es';

/**
 * Enum of possible APIx origin types
 */
enum OriginType {
	sdp = 'sdp',
	rma = 'rma',
	none = 'none',
}

/**
 * Intercepts http requests to add auth headers APIx requests.
 */
@Injectable({
	providedIn: 'root',
})
export class APIxInterceptor implements HttpInterceptor {
	private sdp = environment.services.sdp;
	private rma = environment.services.rma;
	private originRegex: RegExp;
	private sdpRegex: RegExp;
	private rmaRegex: RegExp;

	constructor (
		private apixService: APIxService,
		private logger: LogService,
	) {
		if (this.sdp.origin === this.rma.origin) {
			this.originRegex = new RegExp(`^${this.sdp.origin}`);
		} else {
			this.originRegex = new RegExp(`^${this.sdp.origin}|^${this.rma.origin}`);
		}
		this.sdpRegex = new RegExp(`^${
			_.values(this.sdp.paths)
			.join('|^')
		}`);
		this.rmaRegex = new RegExp(`^${
			_.values(this.rma.paths)
			.join('|^')
		}`);
	}

	/**
	 * Tests the origin and path to determine if it's an APIx
	 * request, and if so what specific type of APIx request it is.
	 * @param url Intercepted url object
	 * @returns Type of APIx request, which determines what clientId to use
	 */
	private testOrigin (url): OriginType {
		if (this.originRegex.test(url.origin)) {
			if (this.sdpRegex.test(url.pathname)) {
				return OriginType.sdp;
			}
			if (this.rmaRegex.test(url.pathname)) {
				return OriginType.rma;
			}
		}

		return OriginType.none;
	}

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
			switch (this.testOrigin(url)) {
				case OriginType.sdp:
					clientId = this.sdp.clientId;
					break;
				case OriginType.rma:
					clientId = this.rma.clientId;
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
