/* tslint:disable */
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from "@angular/common/http";
import { BaseService as __BaseService } from "../../core/base-service";
import { map as __map, filter as __filter } from 'rxjs/operators';
import { Observable as __Observable } from 'rxjs';
import { RccConfiguration as __Configuration } from "../rcc-configuration";
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { RccAssetDetails ,RccAssetDetailsReqData, RccAssetSelectReq, RccAssetFilterResponse, RccAssetFilterDetailsResponse } from './../models/rcc-asset-details';

@Injectable({
  providedIn: 'root'
})
class RccAssetDetailsService extends __BaseService{

  constructor(config: __Configuration, http: HttpClient) {
		super(config, http);
	}
/*Api on asset table row clicked */
GetAssetFilterSummaryData(params:RccAssetSelectReq){
	let __params = this.newParams();
	let __headers = new HttpHeaders();
	let __body: any = null;
	if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
	if (params.policyGroupName != null) __params = __params.set('policyGroupName', params.policyGroupName.toString());
	if (params.policyName != null) __params = __params.set('policyName', params.policyName.toString());
	if (params.pageIndex != null) __params = __params.set('pageIndex', params.pageIndex.toString());
	if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
	if (params.sortBy != null) __params = __params.set('sort', params.sortBy.toString());
	//if (params.hostName != null) __params = __params.set('hostName', params.hostName.toString());
	if (params.serialNumber != null) __params = __params.set('serialNumber', params.serialNumber.toString());
	if (params.severity != null) __params = __params.set('severity', params.severity.toString());
	if (params.sortOrder != null) __params = __params.set('sortOrder', params.sortOrder.toString());
	//__params = params;
	let req = new HttpRequest<any>(
		'GET',
		'https://violationaudit.sdp11-idev.csco.cloud/compliance/violationaudit/api/fetch-violation-details',
		__body,
		{
			headers: __headers,
			params: __params,
			responseType: 'json',
		});
	
	return this.http.request<any>(req).pipe(
		__filter(_r => _r instanceof HttpResponse),
		__map((_r) => {
			return _r  as __StrictHttpResponse<any>;
		})
	);
	}
	/*Api on asset table filters to load */

GetAssetFilterData(params:RccAssetSelectReq){

	let __params = this.newParams();
	let __headers = new HttpHeaders();
	let __body: any = null;
	if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
	if (params.policyGroupName != null) __params = __params.set('policyGroupName', params.policyGroupName.toString());
	if (params.policyName != null) __params = __params.set('policyName', params.policyName.toString());
	if (params.pageIndex != null) __params = __params.set('pageIndex', params.pageIndex.toString());
	if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
	if (params.sortBy != null) __params = __params.set('sort', params.sortBy.toString());
	//if (params.hostName != null) __params = __params.set('hostName', params.hostName.toString());
	if (params.serialNumber != null) __params = __params.set('serialNumber', params.serialNumber.toString());
	if (params.severity != null) __params = __params.set('severity', params.severity.toString());
	if (params.sortOrder != null) __params = __params.set('sortOrder', params.sortOrder.toString());
	//__params = params;
	let req = new HttpRequest<any>(
		'GET',
		'https://violationaudit.sdp11-idev.csco.cloud/compliance/violationaudit/api/fetch-violation-details-filter',
		__body,
		{
			headers: __headers,
			params: __params,
			responseType: 'json',
		});
	
	return this.http.request<any>(req).pipe(
		__filter(_r => _r instanceof HttpResponse),
		__map((_r) => {
			return _r  as __StrictHttpResponse<any>;
		})
	);
	}

	getAssetSummaryData (params: RccAssetSelectReq): __Observable<any>{
		return this.GetAssetFilterSummaryData(params).pipe(
		  __map(_r => _r.body  as  RccAssetDetails)
		);
	}
	getRccAssetFilterData(params:RccAssetSelectReq): __Observable<any> {
		return this.GetAssetFilterData(params).pipe(
		  __map(_r => _r.body as RccAssetFilterResponse)
		);
	}
}

 export { RccAssetDetailsService }