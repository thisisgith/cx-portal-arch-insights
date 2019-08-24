/* tslint:disable */
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpParams } from "@angular/common/http";
import { BaseService as __BaseService } from "../../core/base-service";
import { map as __map, filter as __filter } from 'rxjs/operators';
import { Observable as __Observable } from 'rxjs';
import { RccConfiguration as __Configuration } from "../rcc-configuration";
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { RccData } from "../models/rcc-data";
import { RccGridData, RccAssetGridData, } from './../models/rcc-grid-data';
import { RccAssetDetails ,RccAssetDetailsReqData, RccAssetSelectReq, RccAssetFilterResponse, RccAssetFilterDetailsResponse } from './../models/rcc-asset-details';

@Injectable({
	providedIn: "root"
})
class RccService extends __BaseService {
	
	static readonly getViolationCount = '/api/customerportal/compliance/v1/service/summary-filters';
	static readonly getAssetCount = '/api/customerportal/compliance/v1/service/severity-ostype-detail';
	static readonly getGridData = '/api/customerportal/compliance/v1/service/violation-summary';
	static readonly getAssetGridData = '/api/customerportal/compliance/v1/service/filter-asset-detail';
	static readonly getRccPolicyRuleDetailsData = '/api/customerportal/compliance/v1/service/policy-rule-details';
	static readonly getRccViolationDetailsData = '/api/customerportal/compliance/v1/service/violation-details';
	static readonly getAssetSummaryData = '/api/customerportal/compliance/v1/service/fetch-violation-details';
	static readonly getRccAssetFilterData = '/api/customerportal/compliance/v1/service/fetch-violation-details-filter';

	constructor(config: __Configuration, http: HttpClient) {
		super(config, http);
	}

	getViolationCount(queryParamMapObj: object): __Observable<any> {
		let url = `${this.rootUrl}${RccService.getViolationCount}`;
		return this.invokeHTTPGet<RccData>(url, queryParamMapObj).pipe(
			__map(_r => _r.body)
		);
	}

	getAssetCount(queryParamMapObj: object): __Observable<any> {
		let url = `${this.rootUrl}${RccService.getAssetCount}`;
		return this.invokeHTTPGet<RccData>(url, queryParamMapObj).pipe(
			__map(_r => _r.body)
		);
	}

	getGridData(queryParamMapObj: object): __Observable<any> {
		let url = `${this.rootUrl}${RccService.getGridData}`;
		return this.invokeHTTPGet<RccGridData>(url, queryParamMapObj).pipe(
			__map(_r => _r.body)
		);
	}

	getAssetGridData(queryParamMapObj: object): __Observable<any> {
		let url = `${this.rootUrl}${RccService.getAssetGridData}`;
		return this.invokeHTTPGet<RccAssetGridData>(url, queryParamMapObj).pipe(
			__map(_r => _r.body)
		);
	}
	getRccPolicyRuleDetailsData(queryParamMapObj: object): __Observable<any> {
		let url = `${this.rootUrl}${RccService.getRccPolicyRuleDetailsData}`;
		return this.invokeHTTPGet<RccAssetGridData>(url, queryParamMapObj).pipe(
			__map(_r => _r.body)
		);
	}

	getRccViolationDetailsData(queryParamMapObj: object): __Observable<any> {
		let url = `${this.rootUrl}${RccService.getRccViolationDetailsData}`;
		return this.invokeHTTPGet<RccAssetGridData>(url, queryParamMapObj).pipe(
			__map(_r => _r.body)
		);
	}

	getAssetSummaryData(queryParamMapObj: RccAssetSelectReq): __Observable<any> {
		return this.invokeHTTPGet<RccAssetDetails>(
			`${this.rootUrl}${RccService.getAssetSummaryData}`,
			queryParamMapObj
		).pipe(
			__map(_r => _r.body)
		);
	}

	getRccAssetFilterData(queryParamMapObj: RccAssetSelectReq): __Observable<any> {
		return this.invokeHTTPGet<RccAssetFilterResponse>(
			`${this.rootUrl}${RccService.getRccAssetFilterData}`,
			queryParamMapObj
		).pipe(
			__map(_r => _r.body)
		);
	}

	invokeHTTPGet<T>(url: string, queryParamMapObj: object): __Observable<any> {
		let __params = this.getQueryParams(queryParamMapObj);
		let __headers = new HttpHeaders();
		let __body: any = null;
		let req = new HttpRequest<any>(
			'GET',
			url,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});


		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<T>;
			})
		);
	}

	public getQueryParams(queryParamMapObj: object) {
		let __params = this.newParams();
		for (let item in queryParamMapObj) {
			if (queryParamMapObj[item])
				__params = __params.append(item, queryParamMapObj[item]);
		}
		return __params;
	}

	public appendQueryParams(queryParamMapObj: object) {
		let __params = this.newParams();
		for (let item in queryParamMapObj) {
			if (queryParamMapObj[item] !== null && queryParamMapObj[item] !== "") {
				__params = __params.append(item, queryParamMapObj[item]);
			}
		}
		return __params;
	}
}
export { RccService };
