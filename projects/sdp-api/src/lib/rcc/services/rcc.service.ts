/* tslint:disable */
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from "@angular/common/http";
import { BaseService as __BaseService } from "../../core/base-service";
import { map as __map, filter as __filter } from 'rxjs/operators';
import { Observable as __Observable } from 'rxjs';
import { RccConfiguration as __Configuration } from "../rcc-configuration";
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { RccData, RccPolicyViolationData, RccCustomer, violationGridParams, assetGridParams, RccCustomerCollector } from "../models/rcc-data";
import { RccGridData, RccAssetGridData } from './../models/rcc-grid-data';
import { RccAssetDetails, RccAssetFilterReq, RccAssetSelectReq, RccAssetFilterResponse, RccAssetFilterDetailsResponse } from './../models/rcc-asset-details';

@Injectable({
	providedIn: "root"
})
class RccService extends __BaseService {

	static readonly optInDetail = '/customerportal/compliance/v1/service/optInDetail';
	static readonly getScheduleTime = '/customerportal/controlpoint/v1/collectionPolicy/nextSchedule/{customerId}';
	static readonly getViolationCount = '/customerportal/compliance/v1/service/summary-filters';
	static readonly getAssetCount = '/customerportal/compliance/v1/service/severity-ostype-detail';
	static readonly getGridData = '/customerportal/compliance/v1/service/violation-summary';
	static readonly getAssetGridData = '/customerportal/compliance/v1/service/filter-asset-detail';
	static readonly getRccPolicyRuleDetailsData = '/customerportal/compliance/v1/service/policy-rule-details';
	static readonly getRccViolationDetailsData = '/customerportal/compliance/v1/service/violation-details';
	static readonly getAssetSummaryData = '/customerportal/compliance/v1/service/fetch-violation-details';
	static readonly getRccAssetFilterData = '/customerportal/compliance/v1/service/fetch-violation-details-filter';

	constructor (config: __Configuration, http: HttpClient) {
		super(config, http);
	}
	
	optInDetail(queryParamMapObj: RccCustomer): __Observable<any> {
		return this.invokeHTTPGet<RccData>(
			`${this.rootUrl}${RccService.optInDetail}`,
			queryParamMapObj)
			.pipe(
				__map(_r => _r.body)
			);
	}

	getScheduleTime(pathParam: RccCustomerCollector): __Observable<any> {
		let url = this.appendPathParams(pathParam, RccService.getScheduleTime);
		return this.invokeHTTPGet<RccData>(
			`${this.rootUrl}${url}`,
			{ })
			.pipe(
				__map(_r => _r.body)
			);
	}

	getViolationCount(queryParamMapObj: RccCustomer): __Observable<any> {
		return this.invokeHTTPGet<RccData>(
			`${this.rootUrl}${RccService.getViolationCount}`,
			queryParamMapObj)
			.pipe(
				__map(_r => _r.body)
			);
	}

	getAssetCount(queryParamMapObj: RccCustomer): __Observable<any> {
		return this.invokeHTTPGet<RccData>(
			`${this.rootUrl}${RccService.getAssetCount}`,
			queryParamMapObj)
			.pipe(
				__map(_r => _r.body)
			);
	}

	getGridData(queryParamMapObj: violationGridParams): __Observable<any> {
		return this.invokeHTTPGet<RccGridData>(
			`${this.rootUrl}${RccService.getGridData}`,
			queryParamMapObj)
			.pipe(
				__map(_r => _r.body)
			);
	}

	getAssetGridData (queryParamMapObj: assetGridParams): __Observable<any> {
		return this.invokeHTTPGet<RccAssetGridData>(
			`${this.rootUrl}${RccService.getAssetGridData}`,
			queryParamMapObj)
			.pipe(
				__map(_r => _r.body)
			);
	}

	getRccPolicyRuleDetailsData(queryParamMapObj: RccPolicyViolationData): __Observable<any> {
		return this.invokeHTTPGet<RccAssetGridData>(
			`${this.rootUrl}${RccService.getRccPolicyRuleDetailsData}`,
			queryParamMapObj)
			.pipe(
				__map(_r => _r.body)
			);
	}

	getRccViolationDetailsData(queryParamMapObj: RccPolicyViolationData): __Observable<any> {
		return this.invokeHTTPGet<RccAssetGridData>(
			`${this.rootUrl}${RccService.getRccViolationDetailsData}`,
			queryParamMapObj)
			.pipe(
				__map(_r => _r.body)
			);
	}

	getAssetSummaryData(queryParamMapObj: RccAssetSelectReq): __Observable<any> {
		return this.invokeHTTPGet<RccAssetDetails>(
			`${this.rootUrl}${RccService.getAssetSummaryData}`,
			queryParamMapObj)
			.pipe(
				__map(_r => _r.body)
			);
	}

	getRccAssetFilterData(queryParamMapObj: RccAssetFilterReq): __Observable<any> {
		return this.invokeHTTPGet<RccAssetFilterResponse>(
			`${this.rootUrl}${RccService.getRccAssetFilterData}`,
			queryParamMapObj)
			.pipe(
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

	public appendPathParams(pathParamMapObj: object, url: string) {
		for (let item in pathParamMapObj) {
			if (pathParamMapObj[item] !== null && pathParamMapObj[item] !== "") {
				const key:string = "{" + item + "}"; 
				url = url.replace(key, pathParamMapObj[item])
			}
		}
		return url;
	}
}
export { RccService };
