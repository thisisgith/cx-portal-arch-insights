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
import { MachineRecommendationsResponse } from '../models/machine-recommendations-response';
import { SoftwareGroup } from '../models/software-group';
import { ProfileRecommendationsResponse } from '../models/profile-recommendations-response';

@Injectable({
	providedIn: 'root',
})
class OSVService extends __BaseService {
	static readonly getSummaryPath = '/customerportal/osv-ui/v1/summary';
	static readonly getSoftwareGroupsPath = '/customerportal/osv-ui/v1/profiles';
	static readonly getSoftwareVersionsPath = '/customerportal/osv-ui/v1/versions';
	static readonly getAssetDetailsPath = '/customerportal/osv-ui/v1/assetDetails';
	static readonly getAssetsPath = '/customerportal/osv-ui/v1/assets';
	static readonly updateProfilePath = '/customerportal/osv-ui/v1/updateProfile';
	static readonly cancelUpdateProfilePath = '/customerportal/osv-ui/v1/cancelUpdateProfile';
	static readonly getSoftwareGroupVersionsPath = '/customerportal/osv-ui/v1/profileVersions';
	static readonly getSoftwareGroupAssetsPath = '/customerportal/osv-ui/v1/profileAssets';
	static readonly getSoftwareGroupRecommendationPath = '/customerportal/osv-ui/v1/profileRecommendations';
	static readonly getMachineRecommendationsPath = '/customerportal/osv-ui/v1/machineRecommendations';

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
	 * - `solution`: selected solution filter.
	 * - `useCase`: selected useCase .
	 *
	 * @return successful operation
	 */
	getSummaryResponse (params: OSVService.GetSummaryParams): __Observable<__StrictHttpResponse<SummaryResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		if (params.solution != null) __params = __params.set('solution', params.solution.toString());
		if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
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
	 * - `solution`: selected solution
	 * - `useCase`: selected useCase
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
	 * - `search`:	search to be applied
	 * - `solution` : solution filter selected
	 * - `useCase` : useCase selected
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
		if (params.search != null) __params = __params.set('search', params.search.toString());
		if (params.solution != null) __params = __params.set('solution', params.solution.toString());
		if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
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
	 * - `search`:	search to be applied
	 * - `solution` : solution filter selected
	 * - `useCase` : useCase selected

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
	 * - `search` : search to be applied
	 * - `solution` : solution filter selected
	 * - `useCase` : useCase selected

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
		if (params.search != null) __params = __params.set('search', params.search.toString());
		if (params.solution != null) __params = __params.set('solution', params.solution.toString());
		if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
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
	 * - `search` : search to be applied
	 * - `solution` : solution filter selected
	 * - `useCase` : useCase selected

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
	 * - `profileName`: profileName that assets is grouped with.
	 * - `pid`: Product Id of the Asset
	 * - `pf`: Product Family of Asset
	 * - `swType`: Software Type of Asset
	 * - `swVersion`: Software Version of Asset
	 * - `image`: image of the asset
	 * - `postDate` : postDate
	 * @return successful operation
	 */
	getAssetDetailsResponse (params: OSVService.GetAssetDetailsParams): __Observable<__StrictHttpResponse<AssetRecommendationsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		 __params = __params.set('profileName', params.profileName);
		 __params = __params.set('pid', params.pid);
		 __params = __params.set('pf', params.pf);
		 __params = __params.set('swType', params.swType);
		 __params = __params.set('swVersion', params.swVersion);
		 __params = __params.set('image', params.image);
		__params = __params.set('postDate', params.postDate);
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${OSVService.getAssetDetailsPath}`,
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
	 * Basic Recommendations of asset
	 * @param params The `OSVService.GetAssetDetailsParams` containing the following parameters:
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `profileName`: profileName that assets is grouped with.
	 * - `pid`: Product Id of the Asset
	 * - `pf`: Product Family of Asset
	 * - `swType`: Software Type of Asset
	 * - `swVersion`: Software Version of Asset
	 * - `image`: image of the asset
	 * - `postDate` : postDate 
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
	 * - `search`:	search to be applied	 * @return successful operation
 	 * - `solution` : solution filter selected
	 * - `useCase` : useCase selected

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
		if (params.search != null) __params = __params.set('search', params.search.toString());
		if (params.solution != null) __params = __params.set('solution', params.solution.toString());
		if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());

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
	 * - `search`:	search to be applied	 * @return successful operation
	 * - `solution` : solution filter selected
	 * - `useCase` : useCase selected

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
	updateProfileResponse (body: OSVService.UpdateProfileParams): __Observable<__StrictHttpResponse<any>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;
		__body = body;
		let req = new HttpRequest<any>(
			'PUT',
			this.rootUrl + `${OSVService.updateProfilePath}`,
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
	 * Update Profile Optimal Version
	 * @return successful operation
	 */
	updateProfile (params: OSVService.UpdateProfileParams): __Observable<any> {
		return this.updateProfileResponse(params).pipe(
			__map(_r => _r.body as any)
		);
	}

	/**
 * Basic Recommendations of asset
 *
 * @return successful operation
 */
	cancelUpdateProfileResponse (body: OSVService.UpdateProfileParams): __Observable<__StrictHttpResponse<SoftwareGroup>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;
		__body = body;
		let req = new HttpRequest<any>(
			'PUT',
			this.rootUrl + `${OSVService.cancelUpdateProfilePath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<SoftwareGroup>;
			})
		);
	}

	/**
	 * Update Profile Optimal Version
	 * @return successful operation
	 */
	cancelUpdateProfile (params: OSVService.UpdateProfileParams): __Observable<SoftwareGroup> {
		return this.updateProfileResponse(params).pipe(
			__map(_r => _r.body as SoftwareGroup)
		);
	}

	/**
	 * Software Group Versions
	 * @param params The `OSVService.GetSoftwareGroupAssetsParams` containing the following parameters:
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `id` : unique identifier of software group
	 * - `profileName` - profileName
	 * - `sort` : sort column
	 * - `sortOrder` : sort order
	 * - `pageIndex` : pageIndex
	 * - `pageSize` : number of results per page
	 * - `solution` : solution filter selected
	 * - `useCase` : useCase selected
	 * @return successful operation
	 */
	getSoftwareGroupVersionsResponse (params: OSVService.GetSoftwareGroupAssetsParams): __Observable<__StrictHttpResponse<SoftwareGroupVersionsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		__params = __params.set('id', params.id);
		__params = __params.set('profileName', params.profileName);
		if (params.pageIndex != null) __params = __params.set('pageIndex', params.pageIndex.toString());
		if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
		if (params.sort != null) __params = __params.set('sort', params.sort.toString());
		if (params.sortOrder != null) __params = __params.set('sortOrder', params.sortOrder.toString());
		if (params.solution != null) __params = __params.set('solution', params.solution.toString());
		if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
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
	 * - `id` : unique identifier of software group
	 * - `profileName` : profileName
	 * - `sort` : sort column
	 * - `sortOrder` : sort order
	 * - `pageIndex` : pageIndex
	 * - `pageSize` : number of results per page
     * - `solution` : solution filter selected
	 * - `useCase` : useCase selected

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
	 * - `id` : unique identifier of software group
	 * - `profileName` : profileName
	 * - `sort` : sort column
	 * - `sortOrder` : sort order
	 * - `pageIndex` : pageIndex
	 * - `pageSize` : number of results per page
	 * - `solution` : solution filter selected
	 * - `useCase` : useCase selected

	 *
	 * @return successful operation
	 */
	getSoftwareGroupAssetsResponse (params: OSVService.GetSoftwareGroupAssetsParams): __Observable<__StrictHttpResponse<SoftwareGroupAssetsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		 __params = __params.set('id', params.id);
		 __params = __params.set('profileName', params.profileName);
		if (params.pageIndex != null) __params = __params.set('pageIndex', params.pageIndex.toString());
		if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
		if (params.sort != null) __params = __params.set('sort', params.sort.toString());
		if (params.sortOrder != null) __params = __params.set('sortOrder', params.sortOrder.toString());
		if (params.solution != null) __params = __params.set('solution', params.solution.toString());
		if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
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
	 * - `id` : unique identifier of software group 
	 * - `profileName` : unique identifier of software group
	 * - `sort` : sort column
	 * - `sortOrder` : sort order
	 * - `pageIndex` : pageIndex
	 * - `pageSize` : number of results per page
 	 * - `solution` : solution filter selected
	 * - `useCase` : useCase selected
 
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
	getSoftwareGroupRecommendationsResponse (params: OSVService.GetSoftwareGroupDetailsParam): __Observable<__StrictHttpResponse<ProfileRecommendationsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		__params = __params.set('profileName', params.profileName);
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
				return _r as __StrictHttpResponse<ProfileRecommendationsResponse>;
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
	getSoftwareGroupRecommendations (params: OSVService.GetSoftwareGroupDetailsParam): __Observable<ProfileRecommendationsResponse> {
		return this.getSoftwareGroupRecommendationsResponse(params).pipe(
			__map(_r => _r.body as ProfileRecommendationsResponse)
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
	getMachineRecommendationsResponse (params: OSVService.GetSoftwareGroupDetailsParam): __Observable<__StrictHttpResponse<MachineRecommendationsResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
		__params = __params.set('profileName', params.profileName);
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${OSVService.getMachineRecommendationsPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<MachineRecommendationsResponse>;
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
	getMachineRecommendations (params: OSVService.GetSoftwareGroupDetailsParam): __Observable<MachineRecommendationsResponse> {
		return this.getMachineRecommendationsResponse(params).pipe(
			__map(_r => _r.body as MachineRecommendationsResponse)
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
		/**
		 * selection solution filter.
		 */
		solution: string;
		/**
		 * selected useCase.
		 */
		useCase: string;
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
		/**
		 * filter.
		 */
		search?: string;
		/**
		 * selection solution filter.
		 */
		solution: string;
		/**
		 * selected useCase.
		 */
		useCase: string;	
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
		/**
		 * search.
		 */
		search?: string;
		/**
		 * selection solution filter.
		 */
		solution: string;
		/**
		 * selected useCase.
		 */
		useCase: string;
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
		profileName: string;
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
		swVersion: string;
		/**
		 * image
		 */
		image: string;
		/**
		 * post date
		 */
		postDate: string;

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
		/**
		 * search.
		 */
		search?: string;
		/**
		 * selection solution filter.
		 */
		solution: string;
		/**
		 * selected useCase.
		 */
		useCase: string;
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
		id: string;
		/**
		 * profileName
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
		/**
		 * selection solution filter.
		 */
		solution: string;
		/**
		 * selected useCase.
		 */
		useCase: string;
	}

	/**
	 * Parameters for updating Profile
	 */
	export interface UpdateProfileParams {
		/**
				 * Unique identifier of a Cisco customer.
				 */
		customerId: string;
		/**
		 * Unique identifier of a Software Group.
		 */
		profileName: string;
		/**
		 * optimal version to be updated
		 */
		optimalVersion: string;
	}
}

export { OSVService }
