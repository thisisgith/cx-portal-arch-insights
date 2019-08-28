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
import { SyslogPanelGridData } from './../models/syslogpanel-data';
import { SyslogPanelFilterData } from '../models/syslogpanelfilter-data';
import { SyslogDeviceData } from './../models/syslog-device-data';
import { SyslogDevicePanelOuter } from '../models/syslogdevicepanel-data';
import { SyslogPanelIPSer } from '../models/syslogdeviceheaderdetails-data';
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
			this.rootUrl+'/api/customerportal/syslog/v1/message/details?pageNo='+syslogParams.pageNo+'&size='+syslogParams.size+'&severity='+syslogParams.severity+'&days='+syslogParams.days+'&catalog='+syslogParams.catalog+'&includeMsgType='+syslogParams.includeMsgType+'&excludeMsgType='+syslogParams.excludeMsgType+'&globalSearch='+syslogParams.search+"&companyId="+syslogParams.customerId,
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
			this.rootUrl+'/api/customerportal/syslog/v1/asset/details?pageNo='+syslogParams.pageNo+'&size='+syslogParams.size+'&severity='+syslogParams.severity+'&days='+syslogParams.days+'&catalog='+syslogParams.catalog+'&asset='+syslogParams.asset+"&searchData="+syslogParams.search+"&companyId="+syslogParams.customerId,
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
	 * Get  of syslogspanel service
	 */
	sysPanelGridData(syslogPanelParams){
		const __params = this.newParams();
        const __headers = new HttpHeaders(); 
        const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+'/api/customerportal/syslog/v1/syslog-view/details?days='+syslogPanelParams.selectedFilters.days+'&msgType='+syslogPanelParams.selectedRowData.MsgType+"&companyId="+syslogPanelParams.customerId,
			__body,
			{
			  headers: __headers, 
			  params: __params,
			  responseType: 'json',
			});
			 
			return this.http.request<any>(req).pipe(
				__filter(_r => _r instanceof HttpResponse),
				__map((_r) => {
				  return _r as __StrictHttpResponse<SyslogPanelGridData>;
				})
			  );
		}

	getPanelGridData(syslogPanelParams):  __Observable<SyslogPanelGridData>{
		return this.sysPanelGridData(syslogPanelParams).pipe(
			__map(_r => _r.body as SyslogPanelGridData)
		  );

	}
	/**
	 * Get  of syslogspanelfilterdata service
	 */
	sysPanelFilterData(syslogPanelParams){
		const __params = this.newParams();
        const __headers = new HttpHeaders();
        const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+'/api/customerportal/syslog/v1/syslog-view/filters?msgType='+syslogPanelParams.MsgType+"&filterTypes=ProductId&filterTypes=SoftwareType&filterTypes=ProductFamily",
			__body,
			{
			  headers: __headers, 
			  params: __params,
			  responseType: 'json',
			});
			 
			return this.http.request<any>(req).pipe(
				__filter(_r => _r instanceof HttpResponse),
				__map((_r) => {
				  return _r as __StrictHttpResponse<SyslogPanelFilterData>;
				})
			  );
	}
	getPanelFilterData(syslogPanelParams):  __Observable<SyslogPanelFilterData>{
		return this.sysPanelFilterData(syslogPanelParams).pipe(
			__map(_r => _r.body as SyslogPanelFilterData)
		  );

	}
	sysPanelFilterGridData(SyslogFilterParam){
		this.convertNullToEmpty(SyslogFilterParam)
		const __params = this.newParams();
        const __headers = new HttpHeaders(); 
        const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+'/api/customerportal/syslog/v1/syslog-view/details?days='+SyslogFilterParam.timePeriod+"&msgType="+SyslogFilterParam.assets.MsgType+"&productFamily="+SyslogFilterParam.productFamily+"&productId="+SyslogFilterParam.productID+"&severity="+SyslogFilterParam.selectedFilters.severity+"&software="+SyslogFilterParam.Software,
			__body,
			{
			  headers: __headers, 
			  params: __params,
			  responseType: 'json',
			});
			 
			return this.http.request<any>(req).pipe(
				__filter(_r => _r instanceof HttpResponse),
				__map((_r) => {
				  return _r as __StrictHttpResponse<SyslogPanelGridData>;
				})
			  );
		}
		getPanelFilterGridData(SyslogFilterParam):  __Observable<SyslogPanelGridData>{
			return this.sysPanelFilterGridData(SyslogFilterParam).pipe(
				__map(_r => _r.body as SyslogPanelGridData)
			  );
	
		}

		public devicePanelDetails (deviceDetails) {
			let __params = this.newParams();
			let __headers = new HttpHeaders();
			let __body: any = null;
			const req = new HttpRequest<any>(
				'GET',
				this.rootUrl+'/api/customerportal/syslog/v1/asset/messages?fromSeverity=0'+'&toSeverity='+deviceDetails.severity+'&days='+deviceDetails.days+'&device='+deviceDetails.deviceHost+'&includeMsgType='+deviceDetails.includeMsgType+'&excludeMsgType='+deviceDetails.excludeMsgType+'&catalog='+deviceDetails.catalog+'&companyId='+deviceDetails.customerId,
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
				  return <__StrictHttpResponse<SyslogDevicePanelOuter>>_r;
				}),
			  );
		}
		public getdevicePanelDetails (devicedata): __Observable<SyslogDevicePanelOuter[]> {
			return this.devicePanelDetails(devicedata).pipe(
			  __map(_r => <SyslogDevicePanelOuter[]>_r.body),
			);
		  }

		  public deviceHeaderDetails (tableRowData,customerId) {
			let __params = this.newParams();
			let __headers = new HttpHeaders();
			let __body: any = null;
			const req = new HttpRequest<any>(
				'GET',
				this.rootUrl+'/api/customerportal/syslog/v1/asset/viewDetails?deviceIp='+tableRowData.DeviceIp+"&customerId="+customerId,
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
				  return <__StrictHttpResponse<SyslogPanelIPSer>>_r;
				}),
			  );
		}
		public getDeviceHeaderDetails (tableRowData,customerId): __Observable<SyslogPanelIPSer> {
			return this.deviceHeaderDetails(tableRowData,customerId).pipe(
			  __map(_r => <SyslogPanelIPSer>_r.body),
			);
		  }


		  public convertNullToEmpty(selectParams){
			  let objectKeys= Object.keys(selectParams)
			  for(let objectValue of objectKeys){
				if (selectParams.hasOwnProperty(objectValue)) {
					if(selectParams[objectValue] === null){
						selectParams[objectValue] = '';
					}
				 }
			  }
		  }
		  public searchAllGridData (searchVal) {
			let __params = this.newParams();
			let __headers = new HttpHeaders();
			const __body: any = null;
			const req = new HttpRequest<any>(
				'GET',
				this.rootUrl+'/api/customerportal/syslog/v1/message/globalSearch?searchData='+searchVal,
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
		public getSeachAllData (searchVal): __Observable<SyslogGridData[]> {
			return this.searchAllGridData(searchVal).pipe(
			  __map(_r => <SyslogGridData[]> _r.body),
			);
		  }
}

module SyslogsService {
export interface GetSyslogsParams {

	/**
     * Unique identifier of a Cisco customer.
     */
	customerId?: string;

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
	deviceHost?:string;
	catalogList?:Array<string>;
	severityList?:Array<string>;
    search?:string;
}
}
export { SyslogsService };