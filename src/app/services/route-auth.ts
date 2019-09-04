
import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { Observable as __Observable } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import { environment } from '@environment';

/**
 * Constrains the http to not expand the response type with `| null`
 */
export type StrictHttpResponse<T> = HttpResponse<T> & {
	readonly body: T;
};

/**
 * Service which helps in refreshing notes list if a new note is added
 */
@Injectable({
	providedIn: 'root',
})
export class RouteAuthService {
	public hasRccPermission;
	private rccPath = '/customerportal/compliance/v1/service/checkOptInStatus';
	public rootUrl = environment.sdpServiceOrigin + environment.sdpServiceBasePath;
	constructor (private http: HttpClient, private logger: LogService) { }

	/**
	 * Check Rcc permission
	 * @param customerId  customer id of logged in customer
	 * @returns Observable with response data.
	 */

	public checkPermissions (customerId: any): __Observable<any> {
		return this.invokeHTTPGet<any>(
			`${this.rootUrl}${this.rccPath}?customerId=${customerId}`)
			.pipe(
				__map(_r => _r.body),
				__map(_r => this.hasRccPermission = _r),
			);
	}

	/**
	 * invoke HTTP get
	 * @param url is a string
	 * @returns Observable with response data.
	 */
	public invokeHTTPGet<T> (url: string): __Observable<any> {
		const __headers = new HttpHeaders();
		const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			url,
			__body,
			{
				headers: __headers,
				responseType: 'json',
			});

		return this.http.request<any>(req)
		.pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map(_r => (<StrictHttpResponse<T>> _r)),
		);
	}
}
