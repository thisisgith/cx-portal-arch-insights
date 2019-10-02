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
	static readonly getSyslogCountPath = '/customerportal/syslog/v1/messages-assets/count';
	static readonly getSysGridDataPath = '/customerportal/syslog/v1/message/details';
	static readonly getDeviceGridDataPath = '/customerportal/syslog/v1/asset/details';
	static readonly getSysPanelGridDataPath = '/customerportal/syslog/v1/syslog-view/details';
	static readonly getSysPanelFilterPath = '/customerportal/syslog/v1/syslog-view/filters';
	static readonly getsysPanelFilterGridPath = '/customerportal/syslog/v1/syslog-view/details';
	static readonly getDevicePanelDetailsPath = '/customerportal/syslog/v1/asset/messages';
	static readonly getDeviceHeaderDetailsPath = '/customerportal/syslog/v1/asset/viewDetails';
	constructor (config: __Configuration, http: HttpClient) {
		super(config, http);
	}
	/**
	 * Syslogs count
	 * @returns syslogcount
	 */
	public syslogsCount (customerId) {
		let __params = this.newParams();
		__params=__params.set('companyId',customerId);
		let __headers = new HttpHeaders();
		let __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+ `${SyslogsService.getSyslogCountPath}`,
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
		__params=__params.set('companyId',syslogParams.customerId);
		__params=__params.set('pageNo', <any>syslogParams.pageNo);
		__params=__params.set('size',<any>syslogParams.size);
		__params=__params.set('severity',<any>syslogParams.severity);
		__params=__params.set('days',<any>syslogParams.days);
		__params=__params.set('catalog',syslogParams.catalog);
		__params=__params.set('includeMsgType',syslogParams.includeMsgType);
		__params=__params.set('excludeMsgType',syslogParams.excludeMsgType);
		__params=__params.set('globalSearch',syslogParams.search);
		let __headers = new HttpHeaders();
		const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+ `${SyslogsService.getSysGridDataPath}`,
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
		__params=__params.set('companyId',syslogParams.customerId);
		__params=__params.set('pageNo',<any>syslogParams.pageNo);
		__params=__params.set('size',<any>syslogParams.size);
		__params=__params.set('severity',<any>syslogParams.severity);
		__params=__params.set('days',<any>syslogParams.days);
		__params=__params.set('catalog',syslogParams.catalog);
		__params=__params.set('asset',syslogParams.asset);
		__params=__params.set('searchData',syslogParams.search);
		let __headers = new HttpHeaders();
		const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+ `${SyslogsService.getDeviceGridDataPath}`,
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
		let __params = this.newParams();
		__params=__params.set('days',syslogPanelParams.selectedFilters.days);
		__params=__params.set('msgType',syslogPanelParams.selectedRowData.MsgType);
		__params=__params.set('companyId',syslogPanelParams.customerId);
		__params=__params.set('catalog',syslogPanelParams.selectedFilters.catalog);

        const __headers = new HttpHeaders();
        const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+ `${SyslogsService.getSysPanelGridDataPath}`,
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
		let __params = this.newParams();
		__params=__params.set('msgType',syslogPanelParams.selectedRowData.MsgType);
		__params=__params.set('filterTypes','ProductId,SoftwareType,ProductFamily');
		__params=__params.set('companyId',syslogPanelParams.customerId)
		
        const __headers = new HttpHeaders();
        const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+ `${SyslogsService.getSysPanelFilterPath}`,
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
		let __params = this.newParams();
		__params=__params.set('days',SyslogFilterParam.timePeriod);
		__params=__params.set('msgType',SyslogFilterParam.assets.MsgType);
		__params=__params.set('productFamily',SyslogFilterParam.productFamily);
		__params=__params.set('productId',SyslogFilterParam.productID);
		__params=__params.set('severity',SyslogFilterParam.selectedFilters.severity);
		__params=__params.set('software',SyslogFilterParam.Software);
		__params=__params.set('companyId',SyslogFilterParam.customerId)
        const __headers = new HttpHeaders();
        const __body: any = null;
		const req = new HttpRequest<any>(
			'GET',
			this.rootUrl+ `${SyslogsService.getsysPanelFilterGridPath}`,
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
			__params=__params.set('companyId',deviceDetails.customerId);
			__params=__params.set('fromSeverity','0');
			__params=__params.set('toSeverity', deviceDetails.severity);
			__params=__params.set('days', deviceDetails.days);
			__params=__params.set('device', deviceDetails.deviceHost);
			__params=__params.set('includeMsgType', deviceDetails.includeMsgType);
			__params=__params.set('excludeMsgType', deviceDetails.excludeMsgType);
			__params=__params.set('catalog', deviceDetails.catalog);
			let __headers = new HttpHeaders();
			let __body: any = null;
			const req = new HttpRequest<any>(
				'GET',
				this.rootUrl+ `${SyslogsService.getDevicePanelDetailsPath}`,
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
			__params=__params.set('customerId',customerId);
			__params=__params.set('deviceIp',tableRowData.DeviceIp);
			let __headers = new HttpHeaders();
			let __body: any = null;
			const req = new HttpRequest<any>(
				'GET',
				this.rootUrl+ `${SyslogsService.getDeviceHeaderDetailsPath}`,
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
	assetList?:Array<string>;
}
}
export { SyslogsService };
