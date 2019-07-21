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
import { DeploymentStatusCountResponse } from '../models/deployment-status-response';
import { SoftwareProfilesResponse } from '../models/software-profiles-response';
import { SoftwareVersionsResponse } from '../models/software-versions-response';
import { DERecommendationsResponse } from '../models/de-recommendations-response';
import { BasicRecommendationsResponse } from '../models/basic-recommendations-response';

@Injectable({
	providedIn: 'root',
})
class OSVService extends __BaseService {
	static readonly getRiskCountPath = '/risk/count';
	static readonly getDeviceCountPath = '/device/count';
	static readonly getDeploymentStatusCountPath = '/deploymentstatus/count';
	static readonly getDERecommendationsCountPath = '/derecommendations/count';
	static readonly getSoftwareProfilesPath = '/softwareprofiles';
	static readonly getSoftwareVersionsPath = '/softwareversions';
	static readonly getBasicRecommendationsCountPath = '/basicrecommendations';

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

	/**
	 * Deployment Status Count for Devices.
	 * @param params The `OSVService.GetDeploymentStatusCountParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getDeploymentStatusCountResponse (params: OSVService.GetDeploymentStatusCountParams): __Observable<__StrictHttpResponse<DeploymentStatusCountResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `/api/customerportal/osv/v1${OSVService.getDeploymentStatusCountPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<DeploymentStatusCountResponse>;
			})
		);
	}

	/**
	 * Deployment Status Count for Devices.
	 * @param params The `OSVService.GetDeploymentStatusCountParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getDeploymentStatusCount (params: OSVService.GetDeploymentStatusCountParams): __Observable<DeploymentStatusCountResponse> {
		return this.getDeploymentStatusCountResponse(params).pipe(
			__map(_r => _r.body as DeploymentStatusCountResponse)
		);
	}


	/**
	 * Sotware Profile of devices.
	 * @param params The `OSVService.GetSoftwarProfilesParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getSoftwareProfilesResponse (params: OSVService.GetSoftwarProfilesParams): __Observable<__StrictHttpResponse<SoftwareProfilesResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `/api/customerportal/osv/v1${OSVService.getSoftwareProfilesPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<SoftwareProfilesResponse>;
			})
		);
	}

	/**
	 * Sotware Profile of devices
	 * @param params The `OSVService.GetSoftwarProfilesParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getSoftwareProfiles (params: OSVService.GetSoftwarProfilesParams): __Observable<SoftwareProfilesResponse> {
		return this.getSoftwareProfilesResponse(params).pipe(
			__map(_r => _r.body as SoftwareProfilesResponse)
		);
	}


	/**
	 * Sotware Versions of devices.
	 * @param params The `OSVService.GetSoftwarVersionsParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getSoftwareVersionsResponse (params: OSVService.GetSoftwarVersionsParams): __Observable<__StrictHttpResponse<SoftwareVersionsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `/api/customerportal/osv/v1${OSVService.getSoftwareVersionsPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<SoftwareVersionsResponse>;
			})
		);
	}

	/**
	 * Sotware Versions of devices.
	 * @param params The `OSVService.GetSoftwarVersionsParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getSoftwareVersions (params: OSVService.GetSoftwarVersionsParams): __Observable<SoftwareVersionsResponse> {
		return this.getSoftwareVersionsResponse(params).pipe(
			__map(_r => _r.body as SoftwareVersionsResponse)
		);
	}

	/**
	 * DE Recommendations counts  of devices
	 * @param params The `OSVService.GetDERecommendationsParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getDERecommendationsResponse (params: OSVService.GetDERecommendationsParams): __Observable<__StrictHttpResponse<DERecommendationsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `/api/customerportal/osv/v1${OSVService.getDERecommendationsCountPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<DERecommendationsResponse>;
			})
		);
	}

	/**
	 * DE Recommendations counts  of devices
	 * @param params The `OSVService.GetDERecommendationsParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getDERecommendations (params: OSVService.GetDERecommendationsParams): __Observable<DERecommendationsResponse> {
		return this.getDERecommendationsResponse(params).pipe(
			__map(_r => _r.body as DERecommendationsResponse)
		);
	}

	/**
	 * Basic Recommendations of asset
	 * @param params The `OSVService.GetBasicRecommendationsParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getBasicRecommendationsResponse (params: OSVService.GetBasicRecommendationsParams): __Observable<__StrictHttpResponse<BasicRecommendationsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `/api/customerportal/osv/v1${OSVService.getBasicRecommendationsCountPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<BasicRecommendationsResponse>;
			})
		);
	}

	/**
	 * Basic Recommendations of asset
	 * @param params The `OSVService.GetBasicRecommendationsParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getBasicRecommendations (params: OSVService.GetBasicRecommendationsParams): __Observable<BasicRecommendationsResponse> {
		return this.getBasicRecommendationsResponse(params).pipe(
			__map(_r => _r.body as BasicRecommendationsResponse)
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
	 * Parameters for getDeviceCount
	 */
	export interface GetDeviceCountParams {

		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
	}

	/**
	 * Parameters for GetDeploymentStatusCountParams
	 */
	export interface GetDeploymentStatusCountParams {

		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
	}

	/**
	 * Parameters for GetSoftwareProfileParams
	 */
	export interface GetSoftwarProfilesParams {

		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
	}

	/**
	 * Parameters for GetSoftwarVersionsParams
	 */
	export interface GetSoftwarVersionsParams {

		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
	}


	/**
	 * Parameters for GetDERecommendationsParams
	 */
	export interface GetDERecommendationsParams {

		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
	}

	/**
	 * Parameters for GetBasicRecommendationsParams
	 */
	export interface GetBasicRecommendationsParams {
		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
	}
}

export { OSVService }
