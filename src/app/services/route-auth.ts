
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { environment } from '@environment';
/**
 * Service which helps in refreshing notes list if a new note is added
 */
@Injectable({
	providedIn: 'root',
})
export class RouteAuthService {
	public hasRccPermission;
	private rccPath = '/api/customerportal/compliance/v1/service/checkOptInStatus';
	constructor (private http: HttpClient, private logger: LogService) { }

	/**
	 * Check Rcc permission
	 * @param customerId  customer id of logged in customer
	 * @returns Observable with response data.
	 */
	public checkRccPermission (customerId) {
		const req = new HttpRequest<any>(
			'GET',
			`${environment.sdpServiceOrigin}${this.rccPath}?customerId=${customerId}`,
		);

		return this.http.request<any>(req)
			.pipe(
				map((res: any) => res.body),
				map(res => {
					this.hasRccPermission = res;
					return res;
				}),
				catchError(err => {
					this.hasRccPermission = false;
					this.logger.error('Rcc Route Permission Check' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);
	}
}
