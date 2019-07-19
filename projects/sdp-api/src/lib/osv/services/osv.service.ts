/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { OSVConfiguration as __Configuration } from '../osv-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { RiskCountResponse } from '../models/risk-count-response';
import { DeviceCountResponse } from '../models/device-count-response';

@Injectable({
	providedIn: 'root',
})
class OSVService extends __BaseService {
	static readonly getRiskCountPath = '/risk/count';
	static readonly getDeviceCountPath = '/device/count';

	constructor (
		config: __Configuration,
		http: HttpClient
	) {
		super(config, http);
	}

	/**
	 * Risk Count for Devices.
	 * @param params The `OSVService.GetRiskCountParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getRiskCountResponse (params: OSVService.GetRiskCountParams): __Observable<__StrictHttpResponse<RiskCountResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `/api/customerportal/osv/v1${OSVService.getRiskCountPath}`,
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
	 * Risk Count for Devices.
	 * @param params The `OSVService.GetRiskCountParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getRiskCount (params: OSVService.GetRiskCountParams): __Observable<RiskCountResponse> {
		return this.getRiskCountResponse(params).pipe(
			__map(_r => _r.body as RiskCountResponse)
		);
	}

	/**
	 * Risk Count for Devices.
	 * @param params The `OSVService.GetRiskCountParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getDeviceCountResponse (params: OSVService.GetDeviceCountParams): __Observable<__StrictHttpResponse<DeviceCountResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `/api/customerportal/osv/v1${OSVService.getDeviceCountPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<DeviceCountResponse>;
			})
		);
	}

	/**
	 * Risk Count for Devices.
	 * @param params The `OSVService.GetRiskCountParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getDeviceCount (params: OSVService.GetDeviceCountParams): __Observable<DeviceCountResponse> {
		return this.getDeviceCountResponse(params).pipe(
			__map(_r => _r.body as DeviceCountResponse)
		);
	}
}

module OSVService {
	/**
	 * Parameters for getRiskCount
	 */
	export interface GetRiskCountParams {

		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
	}

	/**
	 * Parameters for getDeviceCoutn
	 */
	export interface GetDeviceCountParams {

		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
	}
}

export { OSVService }
