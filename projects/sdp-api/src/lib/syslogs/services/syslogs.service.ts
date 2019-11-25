/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { Observable as __Observable } from 'rxjs';
import { SyslogsConfiguration as __Configuration } from '../syslogs-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { SyslogData } from '../models/syslog-data';
import { SyslogPanelGridData } from './../models/syslogpanel-data';
import { SyslogFullResponse } from '@sdp-api';
@Injectable({
	providedIn: 'root',
})
class SyslogsService extends __BaseService {
	static readonly getSyslogCountPath = '/customerportal/syslog/v1/messages-assets/count';
	static readonly getSysGridDataPath = '/customerportal/syslog/v1/syslogs';
	static readonly getSysPanelGridDataPath = '/customerportal/syslog/v1/syslogDetails';
	constructor (config: __Configuration, http: HttpClient) {
		super(config, http);
	}
	/**
	 * Syslogs count
	 * @returns syslogcount
	 */
	public syslogsCount (countParams) {
		let __headers = new HttpHeaders();
		let __body: any = countParams;
		const req = new HttpRequest<any>(
			'POST',
			this.rootUrl+ `${SyslogsService.getSyslogCountPath}`,
			__body,
			{
			  headers: __headers,
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
	public getSyslogsCount (countParams): __Observable<SyslogData> {
		return this.syslogsCount(countParams).pipe(
		  __map(_r => <SyslogData>_r.body),
		);
	  }

	/**
	 * Syslog grid data
	 * @param syslogParams contains syslog prams
	 * @returns syslog grid data
	 */
	public sysGridData (syslogParams:SyslogsService.GetSyslogsParams) {
        let __headers = new HttpHeaders();
		const __body: any = syslogParams;
		const req = new HttpRequest<any>(
			'POST',
			this.rootUrl+ `${SyslogsService.getSysGridDataPath}`,
			__body,
			{
			  headers: __headers,
			  responseType: 'json',
			});
		  return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
			  return <__StrictHttpResponse<SyslogFullResponse>>_r;
			}),
		  );
	}
	public getGridData (syslogParams): __Observable<SyslogFullResponse> {
		return this.sysGridData(syslogParams).pipe(
		  __map(_r => <SyslogFullResponse> _r.body),
		);
	  }
	  /**
	 * Get  of syslogspanel service
	 */
	sysPanelGridData(syslogPanelParams){
	    const __headers = new HttpHeaders();
        const __body: any = syslogPanelParams;
		const req = new HttpRequest<any>(
			'POST',
			this.rootUrl+ `${SyslogsService.getSysPanelGridDataPath}`,
			__body,
			{
			  headers: __headers,
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
		/**
		 * The contract numbers
		 */
		contractNumber?: Array<string>;
		days?: number;
		timeRange?:Array<string>;
		syslogSeverity?: number;
		catalog?: string;
		asset?:string;
		deviceHost?:string;
		catalogList?:Array<string>;
		severityList?:Array<string>;
		afmSeverity?:string;
		afmSeverityList?:Array<string>;
		localSearch?:string;
		assetList?:Array<string>;
		systemFilter?: string;
		sortField?: string;
		sortOrder?: string;
		vaId?: string;
		contractLevel?: string;
		useCase?: string;
		solution?: string;
		excludeMsgType?: string;
		includeMsgType?: string;
		severity?: number;
		search?:string;
		faults?:string;
		faultsList?:Array<string>;
	}
}
export { SyslogsService };
