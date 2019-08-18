/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { RiskMitigationConfiguration as __Configuration } from '../risk-mitigation-configuration';
import { Observable as __Observable, from } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { RiskAssets } from '../models/risk-assets';
import { HighCrashRisk, HighCrashRiskPagination, HighCrashRiskDeviceCount } from '../models/high-crash-risk';
import { CrashCount } from '../models/crash-count';

@Injectable({
	providedIn: 'root',
})

class RiskMitigationService extends __BaseService {
	static GetAssetsParams: any;
	static readonly getAllCrashesDataPath = '/api/customerportal/rmc/rmc/v1/crash-count/';
	static readonly getHighCrashRiskDeviceCountDataPath =
	'/api/customerportal/fingerprint/v1/crash-risk-device-count/';
	static readonly getDeviceDetailsPath =
	'/api/customerportal/rmc/rmc/v1/crash-detail/';
	static readonly getSearchedDataPath =
	'/api/customerportal/rmc/rmc/v1/crash-detail/';
	static readonly getFingerPrintDeviceDetailsDataPath =
		'/api/customerportal/fingerprint/v1/crash-risk-devices/';
	static readonly getCrashHistoryForDevicePath =
		'/api/customerportal/rmc/rmc/v1/device-frequent-crash-detail/';

	constructor(
		config: __Configuration,
		http: HttpClient,
	) {
		super(config, http);
	}


	getAllCrashesDataResponse(params: RiskMitigationService.GetAssetsParams): __Observable<__StrictHttpResponse<CrashCount>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;


		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${RiskMitigationService.getAllCrashesDataPath}` + params.customerId,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<CrashCount>;
			})
		);
	}



	getHighCrashRiskDeviceCount(params:  RiskMitigationService.GetAssetsParams): __Observable<__StrictHttpResponse<HighCrashRiskDeviceCount>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;


		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl+`${RiskMitigationService.getHighCrashRiskDeviceCountDataPath}`+params.customerId,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<HighCrashRiskDeviceCount>;
			})
		);
	}

	getDevicesResponse(params: RiskMitigationService.GetAssetsParams): __Observable<__StrictHttpResponse<RiskAssets>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;


		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${RiskMitigationService.getDeviceDetailsPath}`+params.customerId + '?timePeriod=' + params.timePeriod,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<RiskAssets>;
			})
		);
	}

	getSearchData(params: RiskMitigationService.GetAssetsParams): __Observable<__StrictHttpResponse<RiskAssets>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;
		let req:any;

		req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${RiskMitigationService.getSearchedDataPath}`+ params.customerId+'?timePeriod='
			+ params.time+'&searchQuery='+params.search,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});


		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<RiskAssets>;
			})
		);
	}

	getFingerPrintDeviceDetailsResponse(params:HighCrashRiskPagination): __Observable<__StrictHttpResponse<HighCrashRisk>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;


		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${RiskMitigationService.getFingerPrintDeviceDetailsDataPath}` + params.customerId
			+'?page='+params.page+'&size='+params.size,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<HighCrashRisk>;
			})
		);
	}

	getCrashHistoryForDeviceResponse(params: RiskMitigationService.GetAssetsParams): __Observable<__StrictHttpResponse<RiskAssets>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;


		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${RiskMitigationService.getCrashHistoryForDevicePath}` + params.customerId + '/' + params.neInstanceId,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<RiskAssets>;
			})
		);
	}


	getAllCrashesData(params: RiskMitigationService.GetAssetsParams): __Observable<CrashCount> {
		return this.getAllCrashesDataResponse(params).pipe(
			__map(_r => _r.body as any)
		);
	}

	getDeviceDetails(params: RiskMitigationService.GetAssetsParams): __Observable<RiskAssets> {
		return this.getDevicesResponse(params).pipe(
			__map(_r => _r.body as RiskAssets)
		);
	}

	getFingerPrintDeviceDetailsData(params: HighCrashRiskPagination): __Observable<HighCrashRisk> {
		return this.getFingerPrintDeviceDetailsResponse(params).pipe(
			__map(_r => _r.body as HighCrashRisk)
		);
	}
	getHighCrashRiskDeviceCountData(params: RiskMitigationService.GetAssetsParams): __Observable<HighCrashRiskDeviceCount> {
		return this.getHighCrashRiskDeviceCount(params).pipe(
			__map(_r => _r.body as HighCrashRiskDeviceCount)
		);
	}

	getCrashHistoryForDevice(params: RiskMitigationService.GetAssetsParams): __Observable<RiskAssets> {
		return this.getCrashHistoryForDeviceResponse(params).pipe(
			__map(_r => _r.body as RiskAssets)
		);
	}
	getSearchedData(params: any): __Observable<RiskAssets> {
		return this.getSearchData(params).pipe(
			__map(_r => _r.body as RiskAssets)
		);
	}
}

module RiskMitigationService {
	export interface GetAssetsParams {
		sortDirection: string;
		key: string;
		customerId: any;
		neInstanceId: any;
		timePeriod: string;
		time: string;
		search: string;
	}
}

export { RiskMitigationService }

