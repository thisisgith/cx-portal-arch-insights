/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { Observable as __Observable } from 'rxjs';
import { SyslogsConfiguration as __Configuration } from '../syslogs-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { SyslogData } from '../models/syslog-data';
import { SyslogGridData } from './../models/syslog-grid-data';
import { Syslog360GridData } from './../models/syslog360-data';
import { Syslog360FilterData } from '../models/syslog360filter-data';
import { SyslogDeviceData } from './../models/syslog-device-data';
import { SyslogDevice360Outer } from '../models/syslogdevice360-data';
@Injectable({
	providedIn: 'root',
})
class SyslogsService extends __BaseService {
	constructor (config: __Configuration, http: HttpClient) {
		super(config, http);
	}
	/**
	 * Syslogs count
	 * @returns syslogcount
	 */
	public syslogsCount (customerId) {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+'/api/customerportal/syslog/v1/messages-assets/count?companyId='+customerId,
			__body,
			{
			  headers: __headers,
			  params: __params,
			  responseType: 'json',
			});

		  return this.http.request<any>(req)
		  .pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
			  return <__StrictHttpResponse<SyslogData>>_r;
			}),
		  );
	}
	/**
	 * Gets syslogs count
	 * @returns syslogs count
	 */
	public getSyslogsCount (customerId): __Observable<SyslogData> {
		return this.syslogsCount(customerId).pipe(
		  __map(_r => <SyslogData>_r.body),
		);
	  }

	/**
	 * Syslog grid data
	 * @param syslogParams contains syslog prams
	 * @returns syslog grid data
	 */
	public sysGridData (syslogParams:SyslogsService.GetSyslogsParams) {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+'/api/customerportal/syslog/v1/message/details?pageNo='+syslogParams.pageNo+'&size='+syslogParams.size+'&severity='+syslogParams.severity+'&days='+syslogParams.days+'&catalog='+syslogParams.catalog+'&includeMsgType='+syslogParams.includeMsgType+'&excludeMsgType='+syslogParams.excludeMsgType+"&companyId="+syslogParams.customerId,
			__body,
			{
			  headers: __headers,
			  params: __params,
			  responseType: 'json',
			});
		  return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
			  return <__StrictHttpResponse<SyslogGridData[]>>_r;
			}),
		  );
	}
	public getGridData (syslogParams): __Observable<SyslogGridData[]> {
		return this.sysGridData(syslogParams).pipe(
		  __map(_r => <SyslogGridData[]> _r.body),
		);
	  }
	  public deviceGridData (syslogParams:SyslogsService.GetSyslogsParams) {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+'/api/customerportal/syslog/v1/asset/details?pageNo='+syslogParams.pageNo+'&size='+syslogParams.size+'&severity='+syslogParams.severity+'&days='+syslogParams.days+'&catalog='+syslogParams.catalog+'&asset='+syslogParams.asset+'&companyId='+syslogParams.customerId,
			__body,
			{
			  headers: __headers,
			  params: __params,
			  responseType: 'json',
			});
		  return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
			  return <__StrictHttpResponse<SyslogDeviceData>>_r;
			}),
		  );
	}
	  public getDeviceGridData (syslogParams): __Observable<SyslogDeviceData> {
		return this.deviceGridData(syslogParams).pipe(
		  __map(_r => <SyslogDeviceData> _r.body),
		);
	  }
	   /**
	 * Get  of syslogs360 service
	 */
	  /**
	 * Get  of syslogs360 service
	 */
	sys360GridData(syslog360Params, customerId){
		const __params = this.newParams();
        const __headers = new HttpHeaders(); 
        const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+"/api/customerportal/syslog/v1/syslog-view/details?days=90&msgType="+syslog360Params.MsgType+"&companyId="+customerId,
			__body,
			{
			  headers: __headers, 
			  params: __params,
			  responseType: 'json',
			});
			 
			return this.http.request<any>(req).pipe(
				__filter(_r => _r instanceof HttpResponse),
				__map((_r) => {
				  return _r as __StrictHttpResponse<Syslog360GridData>;
				})
			  );
		}

	get360GridData(syslog360Params,customerId):  __Observable<Syslog360GridData>{
		return this.sys360GridData(syslog360Params, customerId).pipe(
			__map(_r => _r.body as Syslog360GridData)
		  );

	}
	/**
	 * Get  of syslogs360filterdata service
	 */
	sys360FilterData(syslog360Params){
		const __params = this.newParams();
        const __headers = new HttpHeaders();
        const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+"/api/customerportal/syslog/v1/syslog-view/filters?msgType="+syslog360Params.MsgType+"&filterTypes=ProductId&filterTypes=SoftwareType&filterTypes=ProductFamily",
			__body,
			{
			  headers: __headers, 
			  params: __params,
			  responseType: 'json',
			});
			 
			return this.http.request<any>(req).pipe(
				__filter(_r => _r instanceof HttpResponse),
				__map((_r) => {
				  return _r as __StrictHttpResponse<Syslog360FilterData>;
				})
			  );
	}
	get360FilterData(syslog360Params):  __Observable<Syslog360FilterData>{
		return this.sys360FilterData(syslog360Params).pipe(
			__map(_r => _r.body as Syslog360FilterData)
		  );

	}
	sys360FilterGridData(SyslogFilterParam,syslogParams){
		const __params = this.newParams();
        const __headers = new HttpHeaders(); 
        const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+"/api/customerportal/syslog/v1/syslog-view/details?days=90&msgType="+syslogParams.MsgType+"&productFamily="+SyslogFilterParam.productFamily+"&productId="+SyslogFilterParam.productID+"&severity=3"+"&software="+SyslogFilterParam.Software,
			__body,
			{
			  headers: __headers, 
			  params: __params,
			  responseType: 'json',
			});
			 
			return this.http.request<any>(req).pipe(
				__filter(_r => _r instanceof HttpResponse),
				__map((_r) => {
				  return _r as __StrictHttpResponse<Syslog360GridData>;
				})
			  );
		}
		get360FilterGridData(SyslogFilterParam,syslogParams):  __Observable<Syslog360GridData>{
			return this.sys360FilterGridData(SyslogFilterParam,syslogParams).pipe(
				__map(_r => _r.body as Syslog360GridData)
			  );
	
		}

		public device360details (devicedetailsdata, customerId) {
			let __params = this.newParams();
			let __headers = new HttpHeaders();
			let __body: any = null;
			const req = new HttpRequest<any>(
				'GET',
				this.rootUrl+'/api/customerportal/syslog/v1/asset/messages?fromSeverity=1&toSeverity=7&days=100&device='+devicedetailsdata.DeviceHost+"&companyId="+customerId,
				__body,
				{
				  headers: __headers,
				  params: __params,
				  responseType: 'json',
				});
	
			  return this.http.request<any>(req)
			  .pipe(
				__filter(_r => _r instanceof HttpResponse),
				__map((_r) => {
				  return <__StrictHttpResponse<SyslogDevice360Outer>>_r;
				}),
			  );
		}
		public getdevice360details (devicedata, customerId): __Observable<SyslogDevice360Outer[]> {
			return this.device360details(devicedata, customerId).pipe(
			  __map(_r => <SyslogDevice360Outer[]>_r.body),
			);
		  }
}

module SyslogsService {
export interface GetSyslogsParams {

	/**
     * Unique identifier of a Cisco customer.
     */
	customerId: string;

	/**
     * Number of rows of data per page
     */
	size?: number;

	/**
     * The device role
     */
	role?: Array<string>;

	/**
     * The page number of the response
     */
	pageNo?: number;

	/**
     * The coverage
     */
	coverage?: Array<'covered' | 'uncovered' | 'unknown' | 'expired'>;

	/**
     * The contract numbers
     */
	contractNumber?: Array<string>;
	days?: number;
	timeRange?:Array<string>;
	severity?: number;
	catalog?: string;
	includeMsgType?: string;
	excludeMsgType?: string;
	asset?:string;
}
}
export { SyslogsService };

