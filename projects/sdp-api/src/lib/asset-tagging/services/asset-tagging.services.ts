/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { AssetTaggingConfiguration as __Configuration } from '../asset-tagging-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable, BehaviorSubject, Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { DeviceDetails } from '../models/device-detail';
import { PolicyGroupDetails } from '../models/policy-group-details';
import { PolicyGroupList } from '../models/policy-group-list';
import { PolicyMapping } from '../models/policy-mapping';

@Injectable({
	providedIn: 'root',
})

class AssetTaggingService extends __BaseService {

	static readonly getAllTagsPath = '/v1/tag-to-device-api';
	static readonly getTagsAssociatedWithPolicyPath = '/v1/tag-policy-mapping-api';
	static readonly getAsset360TagsPath = '/v1/device-tag-api';
	static readonly getPoliciesPath = '/v1/all-policies-api';
	static readonly getPolicyMappingPath = '/v1/save-tag-policy-mapping-api';
	private tags = new BehaviorSubject<any>({});

	constructor (
		config: __Configuration,
		http: HttpClient
	) {
		super(config, http);
	}

	public set Tags(body) {
		this.tags.next(body);
	}
	
	getSelectedTags():__Observable<any> {
		return this.tags.asObservable();
	  }
	  
	/**
	 * All Tags.
	 * @param params The `AssetTaggingService.GetParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `deviceId` : Unique device identifier (optional)
	 *
	 * @return successful operation
	 */
	getAllTagsResponse (params: AssetTaggingService.GetParams): __Observable<__StrictHttpResponse<DeviceDetails>> {
		let __headers = new HttpHeaders();
		let __body: any = null;

		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${AssetTaggingService.getAllTagsPath}`+'/'+ params.customerId.toString(),
			__body,
			{
				headers: __headers,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<DeviceDetails>;
			})
		);
	}

	/**
	 * Tags associated with policies.
	 * @param params The `AssetTaggingService.GetParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `deviceId` : Unique device identifier (optional)
	 *
	 * @return successful operation
	 */
	getAllTags (params: AssetTaggingService.GetParams): __Observable<DeviceDetails> {
		return this.getAllTagsResponse(params).pipe(
			__map(_r => _r.body as DeviceDetails)
		);
	}

	/**
	 * Get Tags Associated with policies.
	 * @param params The `AssetTaggingService.GetParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `deviceId` : Unique device identifier (optional)
	 *
	 * @return successful operation
	 */
	getTagsAssociatedWithPolicyResponse (params: AssetTaggingService.GetParams): __Observable<__StrictHttpResponse<PolicyGroupDetails>> {
		let __headers = new HttpHeaders();
		let __body: any = null;

		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${AssetTaggingService.getTagsAssociatedWithPolicyPath}`+'/'+ params.customerId.toString(),
			__body,
			{
				headers: __headers,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<PolicyGroupDetails>;
			})
		);
	}

	/**
	 * Get Tags Associated with policies.
	 * @param params The `AssetTaggingService.GetParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `deviceId` : Unique device identifier (optional)
	 *
	 * @return successful operation
	 */
	getTagsAssociatedWithPolicy (params: AssetTaggingService.GetParams): __Observable<PolicyGroupDetails> {
		return this.getTagsAssociatedWithPolicyResponse(params).pipe(
			__map(_r => _r.body as PolicyGroupDetails)
		);
	}

	/**
	 * Get Tags for Asset 360 fly-out.
	 * @param params The `AssetTaggingService.GetParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `deviceId` : Unique device identifier (optional)
	 *
	 * @return successful operation
	 */
	getAsset360TagsResponse (params: AssetTaggingService.GetParams): __Observable<__StrictHttpResponse<DeviceDetails>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.deviceId != null) __params = __params.set('deviceId', params.deviceId.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${AssetTaggingService.getAsset360TagsPath}`+'/'+ params.customerId.toString(),
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<DeviceDetails>;
			})
		);
	}

	/**
	 * Get Tags for Asset 360 fly-out.
	 * @param params The `AssetTaggingService.GetParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `deviceId` : Unique device identifier (optional)
	 *
	 * @return successful operation
	 */
	getAsset360Tags (params: AssetTaggingService.GetParams): __Observable<DeviceDetails> {
		return this.getAsset360TagsResponse(params).pipe(
			__map(_r => _r.body as DeviceDetails)
		);
	}

	/**
	 * Get Policies.
	 * @param params The `AssetTaggingService.GetParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `deviceId` : Unique device identifier (optional)
	 *
	 * @return successful operation
	 */
	getPolicyResponse (params: AssetTaggingService.GetParams): __Observable<__StrictHttpResponse<PolicyGroupList>> {
		let __headers = new HttpHeaders();
		let __body: any = null;

		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${AssetTaggingService.getPoliciesPath}`+'/'+ params.customerId.toString(),
			__body,
			{
				headers: __headers,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<PolicyGroupList>;
			})
		);
	}

	/**
	 * Get Policies.
	 * @param params The `AssetTaggingService.GetParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `deviceId` : Unique device identifier (optional)
	 *
	 * @return successful operation
	 */
	getPolicy (params: AssetTaggingService.GetParams): __Observable<PolicyGroupList> {
		return this.getPolicyResponse(params).pipe(
			__map(_r => _r.body as PolicyGroupList)
		);
	}

	/**
	 * Submit the policy mapping.
	 * @param params The `AssetTaggingService.PostParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `body` : Contains the policy mapping
	 *
	 * @return successful operation
	 */
	postPolicyMappingResponse (params: AssetTaggingService.PostParams): __Observable<__StrictHttpResponse<any>> {
		let __headers = new HttpHeaders();
		let __body: any = params.body;

		let req = new HttpRequest<any>(
			'POST',
			this.rootUrl + `${AssetTaggingService.getPolicyMappingPath}`+'/'+ params.customerId.toString(),
			__body,
			{
				headers: __headers,
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
	 * Submit the policy mapping.
	 * @param params The `AssetTaggingService.PostParams` containing the following parameters:
	 *
	 * - `customerId`: Unique identifier of a Cisco customer.
	 * - `body` : Contains the policy mapping
	 *
	 * @return successful operation
	 */
	postPolicyMapping (params: AssetTaggingService.PostParams): __Observable<any> {
		return this.postPolicyMappingResponse(params).pipe(
			__map(_r => _r.body as any)
		);
	}
}


module AssetTaggingService {
	/**
	 * Parameters for get Calls
	 */
	export interface GetParams {
		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
		/**
		 * Id of the device (Optional)
		 */
		deviceId ?: string;
	}

		/**
	 * Parameters for get Calls
	 */
	export interface PostParams {
		/**
		 * Unique identifier of a Cisco customer.
		 */
		customerId: string;
		/**
		 * Contains the policy mapping 
		 */
		body : PolicyMapping;
	}

}
export { AssetTaggingService }
