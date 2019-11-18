/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { RiskMitigationConfiguration as __Configuration } from '../risk-mitigation-configuration';
import { Observable as __Observable, from } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { RiskAssets, CrashHistoryDeviceCount, CrashHistoryDeviceList } from '../models/risk-assets';
import { HighCrashRisk, HighCrashRiskPagination, HighCrashRiskDeviceCount, BarGraphValues } from '../models/high-crash-risk';
import { CrashCount } from '../models/crash-count';

@Injectable({
	providedIn: 'root',
})

class RiskMitigationService extends __BaseService {
	static GetAssetsParams: any;
	static readonly getAllCrashesDataPath = '/customerportal/rmc/v1/crash-count/';
	static readonly getHighCrashRiskDeviceCountDataPath =
	'/customerportal/fingerprint/v1/crash-risk-device-count/';
	static readonly getDeviceDetailsPath =
	'/customerportal/rmc/v1/crash-detail/';
	static readonly getSearchedDataPath =
	'/customerportal/rmc/v1/crash-detail/';
	static readonly getFingerPrintDeviceDetailsDataPath =
		'/customerportal/fingerprint/v1/crash-risk-devices/';
	static readonly getCrashHistoryForDevicePath =
		'/customerportal/rmc/v1/device-frequent-crash-detail/';
	static readonly getTotalAssestCountPath =
		'/customerportal/inventory/v1/role/device/count'


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
		if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
		if (params.solution != null) __params = __params.set('solution', params.solution.toString());

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
		if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
		if (params.solution != null) __params = __params.set('solution', params.solution.toString());

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
		if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
		if (params.solution != null) __params = __params.set('solution', params.solution.toString());
		if(params.timePeriod){
			__params = __params.set('timePeriod', params.timePeriod.toString());
		 }
		 if(params.searchQuery){
			__params = __params.set('searchQuery', params.searchQuery.toString());
		 }

		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${RiskMitigationService.getDeviceDetailsPath}`+params.customerId,
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

		if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
		if (params.solution != null) __params = __params.set('solution', params.solution.toString());

		req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${RiskMitigationService.getSearchedDataPath}`+ params.customerId,
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

		if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());

		 if (params.page != null)
		 __params = __params.set('page', params.page.toString());
		 if (params.size != null)
		 __params = __params.set('size', params.size.toString());
		 if(params.search && params.search != ''){
			__params = __params.set('search', params.search.toString());
		 }
		 if(params.sort && params.sort != ''){
			__params = __params.set('sort', params.sort.toString());
		 }
		 if(params.globalRiskRank && params.globalRiskRank != ''){
		 __params = __params.set('globalRiskRank', params.globalRiskRank);
		 }
		if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
		if (params.solution != null) __params = __params.set('solution', params.solution.toString());


		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${RiskMitigationService.getFingerPrintDeviceDetailsDataPath}` + params.customerId,
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

	getCrashHistoryForDeviceResponse(params: CrashHistoryDeviceCount): __Observable<__StrictHttpResponse<CrashHistoryDeviceList>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;
		if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
		if (params.solution != null) __params = __params.set('solution', params.solution.toString());


		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${RiskMitigationService.getCrashHistoryForDevicePath}` + params.customerId + '?deviceId=' + params.neInstanceId,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<CrashHistoryDeviceList>;
			})
		);
	}

	getTotalAssestCountResponse(params: CrashHistoryDeviceCount): __Observable<__StrictHttpResponse<BarGraphValues >> {
		let __params = this.newParams();
		__params = __params.set('customerId', params.customerId.toString())
		__params = __params.set('useCase',params.useCase);
		__params = __params.set('solution',params.solution);

		let __headers = new HttpHeaders();
		let __body: any = null;
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `${RiskMitigationService.getTotalAssestCountPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<BarGraphValues>;
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

	getCrashHistoryForDevice(params: CrashHistoryDeviceCount): __Observable<CrashHistoryDeviceList> {
		return this.getCrashHistoryForDeviceResponse(params).pipe(
			__map(_r => _r.body as CrashHistoryDeviceList)
		);
	}
	getSearchedData(params: any): __Observable<RiskAssets> {
		return this.getSearchData(params).pipe(
			__map(_r => _r.body as RiskAssets)
		);
	}
	getTotalAssestCount(params: any): __Observable<BarGraphValues[] > {
		return this.getTotalAssestCountResponse(params).pipe(
			__map(_r => _r.body as BarGraphValues[] )
		);
	}

}

module RiskMitigationService {
	export interface GetAssetsParams {
		sortDirection?: string;
		key?: string;
		customerId?: any;
		neInstanceId?: any;
		timePeriod?: string;
		time?: string;
		searchQuery?: string;
		solution?: string;
		useCase?: string;
	}
}

export { RiskMitigationService }

