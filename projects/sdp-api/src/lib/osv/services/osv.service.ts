/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { OSVConfiguration as __Configuration } from '../osv-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { SoftwareGroupsResponse } from '../models/software-group-response';
import { SoftwareVersionsResponse } from '../models/software-versions-response';
import { AssetRecommendationsResponse } from '../models/asset-recommendations-response';
import { AssetsResponse } from '../models/assets-response';
import { SummaryResponse } from '../models/summary-response';
import { SoftwareGroupVersionsResponse } from '../models/software-group-version-response';
import { SoftwareGroupAssetsResponse } from '../models/software-group-asset-response';

@Injectable({
	providedIn: 'root',
})
class OSVService extends __BaseService {
	static readonly getSummaryPath = '/customerportal/osv-ui/v1/summary';
	static readonly getSoftwareGroupsPath = '/customerportal/osv-ui/v1/profiles';
	static readonly getSoftwareVersionsPath = '/customerportal/osv-ui/v1/versions';
	static readonly getAssetDetailsPath = '/customerportal/osv-ui/v1/assetDetails';
	static readonly getAssetsPath = '/customerportal/osv-ui/v1/assets';
	static readonly updateAssetPath = '/customerportal/osv-ui/v1/updateAsset';
	static readonly getSoftwareGroupVersionsPath = '/customerportal/osv-ui/v1/profileVersions';
	static readonly getSoftwareGroupAssetsPath = '/customerportal/osv-ui/v1/profileAssets';
	static readonly getSoftwareGroupRecommendationPath = '/customerportal/osv-ui/v1/profileRecommendations';

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
	 * @param params The `OSVService.GetSoftwareGroupsParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `pageIndex` : PageNumber
	 * - `pageSize` : number of records to be fetched per page
	 * - `sort` : Sorting to be done on which column
	 * - `sortOrder` : Sorting Order
	 * - `filter`:	filter to be applied
	 *
	 * @return successful operation
	 */
	getSoftwareGroupsResponse (params: OSVService.GetSoftwareGroupsParams): __Observable<__StrictHttpResponse<SoftwareGroupsResponse>> {
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
			this.rootUrl + `${OSVService.getSoftwareGroupsPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<SoftwareGroupsResponse>;
			})
		);
	}

	/**
	 * Sotware Profile of devices
	 * @param params The `OSVService.GetSoftwareGroupsParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `pageIndex` : PageNumber
	 * - `pageSize` : number of records to be fetched per page
	 * - `sort` : Sorting to be done on which column
	 * - `sortOrder` : Sorting Order
	 * - `filter`:	filter to be applied
	 * @return successful operation
	 */
	getSoftwareGroups (params: OSVService.GetSoftwareGroupsParams): __Observable<SoftwareGroupsResponse> {
		return this.getSoftwareGroupsResponse(params).pipe(
			__map(_r => _r.body as SoftwareGroupsResponse)
		);
	}


	/**
	 * Sotware Versions of devices.
	 * @param params The `OSVService.GetSoftwarVersionsParams` containing the following parameters:
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `pageIndex` : PageNumber
	 * - `pageSize` : number of records to be fetched per page
	 * - `sort` : Sorting to be done on which column
	 * - `sortOrder` : Sorting Order
	 * @return successful operation
	 */
	getSoftwareVersionsResponse (params: OSVService.GetSoftwarVersionsParams): __Observable<__StrictHttpResponse<SoftwareVersionsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		if (params.pageIndex != null) __params = __params.set('pageIndex', params.pageIndex.toString());
		if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
		if (params.sort != null) __params = __params.set('sort', params.sort.toString());
		if (params.sortOrder != null) __params = __params.set('sortOrder', params.sortOrder.toString());
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
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `pageIndex` : PageNumber
	 * - `pageSize` : number of records to be fetched per page
	 * - `sort` : Sorting to be done on which column
	 * - `sortOrder` : Sorting Order
	 * @return successful operation
	 */
	getSoftwareVersions (params: OSVService.GetSoftwarVersionsParams): __Observable<SoftwareVersionsResponse> {
		return this.getSoftwareVersionsResponse(params).pipe(
			__map(_r => _r.body as SoftwareVersionsResponse)
		);
	}

	/**
	 * Basic Recommendations of asset
	 * @param params The `OSVService.GetAssetDetailsParams` containing the following parameters:
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `id`: Unique identifier of a asset.
	 * - `pid`: Product Id of the Asset
	 * - `pf`: Product Family of Asset
	 * - `swType`: Software Type of Asset
	 * - `swVersions`: Software Version of Asset
	 * - `image`: image of the asset
	 * @return successful operation
	 */
	getAssetDetailsResponse (params: OSVService.GetAssetDetailsParams): __Observable<__StrictHttpResponse<AssetRecommendationsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		if (params.id != null) __params = __params.set('id', params.id.toString());
		if (params.pid != null) __params = __params.set('pid', params.pid.toString());
		if (params.pf != null) __params = __params.set('pf', params.pf.toString());
		if (params.swType != null) __params = __params.set('swType', params.swType.toString());
		if (params.swVersions != null) __params = __params.set('swVersions', params.swVersions.toString());
		if (params.image != null) __params = __params.set('image', params.image.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${OSVService.getAssetDetailsPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});
		console.log("req>>", req);
		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<AssetRecommendationsResponse>;
			})
		);
	}

	/**
	 * Basic Recommendations of asset
	 * @param params The `OSVService.GetAssetDetailsParams` containing the following parameters:
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `id`: Unique identifier of a asset.
	 * - `pid`: Product Id of the Asset
	 * - `pf`: Product Family of Asset
	 * - `swType`: Software Type of Asset
	 * - `swVersions`: Software Version of Asset
	 * - `image`: image of the asset
	 * @return successful operation
	 */
	getAssetDetails (params: OSVService.GetAssetDetailsParams): __Observable<AssetRecommendationsResponse> {
		return this.getAssetDetailsResponse(params).pipe(
			__map(_r => _r.body as AssetRecommendationsResponse)
		);
	}

	/**
	 * Basic Recommendations of asset
	 * @param params The `OSVService.GetAssetsParams` containing the following parameters:
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `pageIndex` : PageNumber
	 * - `pageSize` : number of records to be fetched per page
	 * - `sort` : Sorting to be done on which column
	 * - `sortOrder` : Sorting Order
	 * - `filter`:	filter to be applied	 * @return successful operation
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
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `pageIndex` : PageNumber
	 * - `pageSize` : number of records to be fetched per page
	 * - `sort` : Sorting to be done on which column
	 * - `sortOrder` : Sorting Order
	 * - `filter`:	filter to be applied	 * @return successful operation
	 */
	getAssets (params: OSVService.GetAssetsParams): __Observable<AssetsResponse> {
		return this.getAssetsResponse(params).pipe(
			__map(_r => _r.body as AssetsResponse)
		);
	}

	/**
	 * Basic Recommendations of asset
	 *
	 * @return successful operation
	 */
	updateAssetResponse (assetDetails: OSVService.GetAssetsParams): __Observable<__StrictHttpResponse<any>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;
		__body = assetDetails;
		let req = new HttpRequest<any>(
			'PUT',
			this.rootUrl + `${OSVService.updateAssetPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<any>;
			})
		);
	}

	/**
	 * Update Asset Optimal Version
	 * @return successful operation
	 */
	updateAsset (params: OSVService.AssetDetailsPostData): __Observable<any> {
		return this.updateAssetResponse(params).pipe(
			__map(_r => _r.body as any)
		);
	}

	/**
	 * Software Group Versions
	 * @param params The `OSVService.GetSoftwareGroupAssetsParams` containing the following parameters:
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `profileName` : unique identifier of software group
	 * - `sort` : sort column
	 * - `sortOrder` : sort order
	 * - `pageIndex` : pageIndex
	 * - `pageSize` : number of results per page
	 * @return successful operation
	 */
	getSoftwareGroupVersionsResponse (params: OSVService.GetSoftwareGroupAssetsParams): __Observable<__StrictHttpResponse<SoftwareGroupVersionsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		if (params.profileName != null) __params = __params.set('profileName', params.profileName.toString());
		if (params.pageIndex != null) __params = __params.set('pageIndex', params.pageIndex.toString());
		if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
		if (params.sort != null) __params = __params.set('sort', params.sort.toString());
		if (params.sortOrder != null) __params = __params.set('sortOrder', params.sortOrder.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${OSVService.getSoftwareGroupVersionsPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<SoftwareGroupVersionsResponse>;
			})
		);
	}

	/**
	 * Profile Versions
	 * @param params The `OSVService.GetSoftwareGroupAssetsParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `profileName` : unique identifier of software group
	 * - `sort` : sort column
	 * - `sortOrder` : sort order
	 * - `pageIndex` : pageIndex
	 * - `pageSize` : number of results per page
	 *
	 * @return successful operation
	 */
	getSoftwareGroupVersions (params: OSVService.GetSoftwareGroupAssetsParams): __Observable<SoftwareGroupVersionsResponse> {
		return this.getSoftwareGroupVersionsResponse(params).pipe(
			__map(_r => _r.body as SoftwareGroupVersionsResponse)
		);
	}

	/**
	 * Software Group Assets
	 * @param params The `OSVService.GetSoftwareGroupAssetsParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `profileName` : unique identifier of software group
	 * - `sort` : sort column
	 * - `sortOrder` : sort order
	 * - `pageIndex` : pageIndex
	 * - `pageSize` : number of results per page
	 *
	 * @return successful operation
	 */
	getSoftwareGroupAssetsResponse (params: OSVService.GetSoftwareGroupAssetsParams): __Observable<__StrictHttpResponse<SoftwareGroupAssetsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		if (params.profileName != null) __params = __params.set('profileName', params.profileName.toString());
		if (params.pageIndex != null) __params = __params.set('pageIndex', params.pageIndex.toString());
		if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
		if (params.sort != null) __params = __params.set('sort', params.sort.toString());
		if (params.sortOrder != null) __params = __params.set('sortOrder', params.sortOrder.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${OSVService.getSoftwareGroupAssetsPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<SoftwareGroupAssetsResponse>;
			})
		);
	}

	/**
	 * Software Group Assets
	 * @param params The `OSVService.GetSoftwareGroupAssetsParams` containing the following parameters:
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `profileName` : unique identifier of software group
	 * - `sort` : sort column
	 * - `sortOrder` : sort order
	 * - `pageIndex` : pageIndex
	 * - `pageSize` : number of results per page	 
	 * @return successful operation
	 */
	getSoftwareGroupAssets (params: OSVService.GetSoftwareGroupAssetsParams): __Observable<SoftwareGroupAssetsResponse> {
		return this.getSoftwareGroupAssetsResponse(params).pipe(
			__map(_r => _r.body as SoftwareGroupAssetsResponse)
		);
	}

	/**
 * Software Group Assets
 * @param params The `OSVService.GetSoftwareGroupDetailsParam` containing the following parameters:
 *
 * - `customerId`: Unique identifier of a Cisco customer.
 * - `profileName` : unique identifier of software group
 *
 * @return successful operation
 */
	getSoftwareGroupRecommendationsResponse (params: OSVService.GetSoftwareGroupDetailsParam): __Observable<__StrictHttpResponse<AssetRecommendationsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		if (params.profileName != null) __params = __params.set('profileName', params.profileName.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${OSVService.getSoftwareGroupRecommendationPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<AssetRecommendationsResponse>;
			})
		);
	}

	/**
	 * Software Group Assets
	 * @param params The `OSVService.GetSoftwareGroupDetailsParam` containing the following parameters:
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `profileName` : unique identifier of software group	
	 * @return successful operation
	 */
	getSoftwareGroupRecommendations (params: OSVService.GetSoftwareGroupDetailsParam): __Observable<AssetRecommendationsResponse> {
		return this.getSoftwareGroupRecommendationsResponse(params).pipe(
			__map(_r => _r.body as AssetRecommendationsResponse)
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
	export interface GetSoftwareGroupsParams {

		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
		/**
		 * pageNumber to be fetched.
		 */
		pageIndex: number;
		/**
		 * No of rows to be fetched per page.
		 */
		pageSize: number;
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
	 * Parameters for GetAssetDetailsParams
	 */
	export interface GetAssetDetailsParams {
		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
		/**
		 * Unique identifier of a Asset.
		 */
		id: string;
		/**
		 * unique productid
		 */
		pid: string;
		/**
		 * product family
		 */
		pf: string;
		/**
		 * Software Type
		 */
		swType: string;
		/**
		 * software version
		 */
		swVersions: string;
		/**
		 * image
		 */
		image: string;

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

	/**
	 * Body for UpdateAsset
	 */
	export interface AssetDetailsPostData {
		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
		/**
		 * Unique identifier of a asset.
		 */
		id: string;
		/**
		 * Optimal Version Accepted by customer.
		 */
		optimalVersion: string;

	}

	/**
	 * Parameters for GetSoftwareGroupDetailsParam
	 */
	export interface GetSoftwareGroupDetailsParam {
		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
		/**
		 * Unique identifier of a Software Group.
		 */
		profileName: string;
	}

	/**
	 * Parameters for GetSoftwareGroupAssetsParams
	 */
	export interface GetSoftwareGroupAssetsParams {
		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
		/**
		 * Unique identifier of a Software Group.
		 */
		profileName: string;
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
}

export { OSVService }
