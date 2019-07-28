/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { OSVConfiguration as __Configuration } from '../osv-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { SoftwareProfilesResponse } from '../models/software-profiles-response';
import { SoftwareVersionsResponse } from '../models/software-versions-response';
import { BasicRecommendationsResponse } from '../models/basic-recommendations-response';
import { AssetsResponse } from '../models/assets-response';
import { SummaryResponse } from '../models/summary-response';

@Injectable({
	providedIn: 'root',
})
class OSVService extends __BaseService {
	static readonly getSummaryPath = '/api/dev/customerportal/osv-ui/v1/summary';
	static readonly getSoftwareProfilesPath = '/api/dev/customerportal/osv-ui/v1/profiles';
	static readonly getSoftwareVersionsPath = '/api/dev/customerportal/osv-ui/v1/versions';
	static readonly getBasicRecommendationsCountPath = '/api/dev/customerportal/osv-ui/v1/basicrecommendations';
	static readonly getAssetsPath = '/api/dev/customerportal/osv-ui/v1/assets';

	constructor (
		config: __Configuration,
		http: HttpClient
	) {
		super(config, http);
	}

	/**
	 * Summary Count.
	 * @param params The `OSVService.GetSummaryParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getSummaryResponse (params: OSVService.GetSummaryParams): __Observable<__StrictHttpResponse<SummaryResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${OSVService.getSummaryPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<SummaryResponse>;
			})
		);
	}

	/**
	 * Summary Count for Devices.
	 * @param params The `OSVService.GetSummaryParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getSummary (params: OSVService.GetSummaryParams): __Observable<SummaryResponse> {
		return this.getSummaryResponse(params).pipe(
			__map(_r => _r.body as SummaryResponse)
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
			this.rootUrl + `${OSVService.getSoftwareProfilesPath}`,
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
		if (params.pageIndex != null) __params = __params.set('pageIndex', params.pageIndex.toString());
		if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${OSVService.getSoftwareVersionsPath}`,
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
			this.rootUrl + `${OSVService.getBasicRecommendationsCountPath}`,
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

	/**
	 * Basic Recommendations of asset
	 * @param params The `OSVService.GetAssetsParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getAssetsResponse (params: OSVService.GetAssetsParams): __Observable<__StrictHttpResponse<AssetsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		if (params.pageIndex != null) __params = __params.set('pageIndex', params.pageIndex.toString());
		if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
		if (params.sort != null) __params = __params.set('sort', params.sort.toString());
		if (params.sortOrder != null) __params = __params.set('sortOrder', params.sortOrder.toString());
		if (params.filter != null) __params = __params.set('filter', params.filter.toString());

		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${OSVService.getAssetsPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<AssetsResponse>;
			})
		);
	}

	/**
	 * Basic list of assets
	 * @param params The `OSVService.GetAssetsParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 *
	 * @return successful operation
	 */
	getAssets (params: OSVService.GetAssetsParams): __Observable<AssetsResponse> {
		return this.getAssetsResponse(params).pipe(
			__map(_r => _r.body as AssetsResponse)
		);
	}
}

module OSVService {
	/**
	 * Parameters for getRiskCount
	 */
	export interface GetSummaryParams {

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
		/**
		 * pageNumber to be fetched.
		 */
		page: number;
		/**
		 * No of rows to be fetched per page.
		 */
		rows: number;
	}

	/**
	 * Parameters for GetSoftwarVersionsParams
	 */
	export interface GetSoftwarVersionsParams {

		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
		/**
		 * page Number.
		 */
		pageIndex?: number;
		/**
		 * number of records per page.
		 */
		pageSize?: number;
		/**
		 * sort by field.
		 */
		sort?: string;
		/**
		 * sortorder.
		 */
		sortOrder?: string;
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
	/**
	 * Parameters for GetAssetsParams
	 */
	export interface GetAssetsParams {
		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
		/**
		 * page Number.
		 */
		pageIndex?: number;
		/**
		 * number of records per page.
		 */
		pageSize?: number;
		/**
		 * sort by field.
		 */
		sort?: string;
		/**
		 * sortorder.
		 */
		sortOrder?: string;
		/**
		 * filter.
		 */
		filter?: string;

	}
}

export { OSVService }
