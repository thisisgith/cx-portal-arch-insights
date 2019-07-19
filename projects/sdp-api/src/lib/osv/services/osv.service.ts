/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { OSVConfiguration as __Configuration } from '../osv-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { RiskCountResponse } from '../models/risk-count-response';
@Injectable({
	providedIn: 'root',
})
class OSVService extends __BaseService {
	static readonly getRoleCountPath = '/risk/device/count';

	constructor (
		config: __Configuration,
		http: HttpClient
	) {
		super(config, http);
	}

	/**
	 * The Device roles set by DNAC.
	 * @param params The `OSVService.GetRoleCountParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * - `role`: The device role
	 *
	 * @return successful operation
	 */
	getRoleCountResponse (params: OSVService.GetRoleCountParams): __Observable<__StrictHttpResponse<RiskCountResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		(params.role || []).forEach(val => { if (val != null) __params = __params.append('role', val.toString()) });
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `/api/customerportal/osv/v1${OSVService.getRoleCountPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<RiskCountResponse>;
			})
		);
	}

	/**
	 * The Device roles set by DNAC.
	 * @param params The `OSVService.GetRoleCountParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * - `role`: The device role
	 *
	 * @return successful operation
	 */
	getRoleCount (params: OSVService.GetRoleCountParams): __Observable<RiskCountResponse> {
		return this.getRoleCountResponse(params).pipe(
			__map(_r => _r.body as RiskCountResponse)
		);
	}
}

module OSVService {
	/**
	 * Parameters for getRoleCount
	 */
	export interface GetRoleCountParams {

		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;

		/**
		 * The device role
		 */
		role?: Array<string>;
	}
}

export { OSVService }
