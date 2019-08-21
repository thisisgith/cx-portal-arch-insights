/* tslint:disable */
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse, HttpParams } from "@angular/common/http";
import { BaseService as __BaseService } from "../../core/base-service";
import { map as __map, filter as __filter } from 'rxjs/operators';
import { Observable as __Observable } from 'rxjs';
import { RccConfiguration as __Configuration } from "../rcc-configuration";
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { RccData } from "../models/rcc-data";
import { RccGridData, RccAssetGridData } from './../models/rcc-grid-data';
@Injectable({
	providedIn: "root"
})
class RccService extends __BaseService {
	constructor(config: __Configuration, http: HttpClient) {
		super(config, http);
	}

	getViolationCount(): __Observable<any> {
		let url = `https://violation.sdp11-idev.csco.cloud/compliance/violation/api/summary-filters`;
		return this.invokeHTTPGet<RccData>(url, { customerId: "90019449" }).pipe(
			__map(_r => _r.body)
		);
	}

	getAssetCount(): __Observable<any> {
		let url = `https://compliancewrapper.sdp11-idev.csco.cloud/v1/service/severity-ostype-detail`;
		return this.invokeHTTPGet<RccData>(url, { customerId: "90019449" }).pipe(
			__map(_r => _r.body)
		);
	}

	getGridData(queryParamMapObj: object): __Observable<any> {
		let url = `https://violation.sdp11-idev.csco.cloud/compliance/violation/api/violation-summary`;
		// let url = 'https://api-stage.cisco.com/api/customerportal/compliance/v1/service/violation-summary'
		return this.invokeHTTPGet<RccGridData>(url, queryParamMapObj).pipe(
			__map(_r => _r.body)
		);
	}

	getAssetGridData(queryParamMapObj: object): __Observable<any> {
		let url = `https://compliancewrapper.sdp11-idev.csco.cloud/v1/service/filter-asset-detail`;
		return this.invokeHTTPGet<RccAssetGridData>(url, queryParamMapObj).pipe(
			__map(_r => _r.body)
		);
	}
	getRccPolicyRuleDetailsData(queryParamMapObj: object): __Observable<any> {
		let url = `https://violation.sdp11-idev.csco.cloud/compliance/violation/api/policy-rule-details`;
		return this.invokeHTTPGet<RccAssetGridData>(url, queryParamMapObj).pipe(
			__map(_r => _r.body)
		);
	}

	getRccViolationDetailsData(queryParamMapObj: object): __Observable<any> {
		let url = `https://violation.sdp11-idev.csco.cloud/compliance/violation/api/violation-details`;
		return this.invokeHTTPGet<RccAssetGridData>(url, queryParamMapObj).pipe(
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
