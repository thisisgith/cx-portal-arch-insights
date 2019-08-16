/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ArchitectureConfiguration as __Configuration } from '../architecture-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { Observable, Subject } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { ContractDeviceCountsResponse } from '../models/contract-device-counts-response';

@Injectable({
  providedIn: 'root',
})
class ArchitectureService extends __BaseService {


  static readonly getContractCountsPath = '/api/customerportal/contracts/v1/device/count';

  static readonly getAllCBPRules = '/cparchinsights/getAllCBPRules';

  private AssetsExceptionsCount = new Subject<any>();

  private CBPRiskCount = new Subject<any>();

  private AssetsExceptionsCountSubject = new Subject<any>();

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * The contract-details API retrieves details of specific contracts owned by customers or partners. This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/contracts/contract-details
   * @param params The `ArchitectureService.GetContractCountsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `contractNumber`: The number of the service contract. Example:- 2689444; 91488861, 92246411
   *
   * @return successful operation
   */
  getCBPSeverityResponse(params: any): __Observable<__StrictHttpResponse<any>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;    
    
    if (params.page != null) __params = __params.set('page', params.page.toString());
    if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
    if (params.severity != null) __params = __params.set('severity', params.severity.toString());
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    
    // (params.contractNumber || []).forEach(val => {if (val != null) __params = __params.append('contractNumber', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      'https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/cbprules', 
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
        //        withCredentials: true,
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<any>;
      })
    );
  }

  /**
   * The contract-details API retrieves details of specific contracts owned by customers or partners. This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/contracts/contract-details
   * @param params The `ArchitectureService.GetContractCountsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `contractNumber`: The number of the service contract. Example:- 2689444; 91488861, 92246411
   *
   * @return successful operation
   */
  getCBPSeverityList(params: any): __Observable<any> {
    return this.getCBPSeverityResponse(params).pipe(
      __map(_r => { return _r.body})
    );
  }

  getAllAssetsWithExceptions(params:any): __Observable<any> {
    return this.getAllAssetsWithExceptionsResponse(params).pipe(
      __map(_r => {

        this.AssetsExceptionsCount.next({ count: _r.body.TotalCounts });
        return _r.body;
      })
    );
  }

  getAllAssetsWithExceptionsResponse(params:any): __Observable<__StrictHttpResponse<any>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.page != null) __params = __params.set('page', params.page);
    if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize);
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    
    let req = new HttpRequest<any>(
      'GET',
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/assets/exceptions`,
      __body,
      
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<any>;
      })
    );
  }
  // Exceptions count of High and Medium Severity
  getExceptionsCount(): __Observable<any> {
    return this.getExceptionsCountResponse().pipe(
      __map(_r => _r.body as ContractDeviceCountsResponse)
    );
  }

  getExceptionsCountResponse(): __Observable<__StrictHttpResponse<any>> {

    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/cbprules/count`,
      __body,
      {
        headers: __headers,
        responseType: 'json',
        //        withCredentials: true,
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<any>;
      })
    );

  }

  // count of all exceptions

  getAssetsExceptionsCount(): __Observable<any> {
    return this.getAssetsExceptionsCountResponse().pipe(
      __map(_r => _r.body as ContractDeviceCountsResponse)
    );
  }

  getAssetsExceptionsCountResponse(): __Observable<__StrictHttpResponse<any>> {

    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/assets/exceptions/count`,
      __body,
      {
        headers: __headers,
        responseType: 'json',
        //        withCredentials: true,
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<any>;
      })
    );

  }

 // All Exceptions Listing
  getAllCBPRulesDetails(params:any): __Observable<any> {
    return this.getAllCBPRulesDetailsResponse(params).pipe(
      __map(_r => {
        return _r.body as ContractDeviceCountsResponse;
      })
    );
  }

  getCBPRiskArray(): Observable<any> {
    return this.CBPRiskCount.asObservable();
  }

  getAllCBPRulesDetailsResponse(params:any): __Observable<__StrictHttpResponse<any>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.page != null) __params = __params.set('page', params.page);
    if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize);
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());

    let req = new HttpRequest<any>(
      'GET',
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/cbprules`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
        //        withCredentials: true,
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<any>;
      })
    );
  }

  public setAssetsExceptionCountSubjectObj(severity:any){
    this.AssetsExceptionsCount.next({ severityType: severity });
  }
  public getAssetsExceptionCountSubjectObj(): Observable<any> {
    return this.AssetsExceptionsCount.asObservable();
  }

  /**
   * This function is used to get the asset details
   * @param body This parameter containes array of assets 
   * @returns only body part of the HTTp response
   */
  getAllCBPDeviceAffected(params: ArchitectureService.getAllCBPDeviceAffectedParams): __Observable<any> {
    return this.getAllCBPDeviceAffectedResponse(params).pipe(
      __map(_r => _r.body)
    );
  }

  /**
   * This Function is used to get the asset detail by adding headers, params and body while sending the request
   * @param body This Parameter contains array of Assets
   * @returns Entire HTTP response is returned 
   */
  getAllCBPDeviceAffectedResponse(params: ArchitectureService.getAllCBPDeviceAffectedParams): __Observable<__StrictHttpResponse<any>> {

    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = params.body;

    if (params.page != null) __params = __params.set('page', params.page.toString());
    if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
    //if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());

    let req = new HttpRequest<any>(
      'POST',
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/assets/exceptions/devicedetails`,
      __body,
      {
        headers: __headers,
        params : __params,
        responseType: 'json',
        //        withCredentials: true,
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<any>;
      })
    );
  }

  /**
   * This function is used to get the Exceptions details
   * @param body This Parameter contains array of Exceptions
   * @returns only body part of the HTTp response
   */
  getAllCBPExceptionDetails(params: ArchitectureService.getAllCBPExceptionDetailsParams): __Observable<any> {
    return this.getAllCBPExceptionDetailsResponse(params).pipe(
      __map(_r => _r.body)
    );
  }

  /**
   * This Function is used to get the Exceptions detail by adding headers, params and body while sending the request
   * @param body This Parameter contains array of Exceptions
   * @returns Entire HTTP response is returned 
   */
  getAllCBPExceptionDetailsResponse(params: ArchitectureService.getAllCBPExceptionDetailsParams): __Observable<__StrictHttpResponse<any>> {

    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = params.body;

    if (params.page != null) __params = __params.set('page', params.page.toString());
    if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
    //if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());

    let req = new HttpRequest<any>(
      'POST',
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/cbprules/exceptiondetails`,
      __body,
      {
        headers: __headers,
        params : __params,
        responseType: 'json',
        //        withCredentials: true,
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<any>;
      })
    );
  }

}

module ArchitectureService {

  /**
   * Parameters for getContractCounts
   */
  export interface GetCBPSeverityParams {

    // /**
    //  * Unique identifier of a Cisco customer.
    //  */
    // customerId: string;

    severityObj: Object;
    // /**
    //  * The number of the service contract. Example:- 2689444; 91488861, 92246411
    //  */
    // contractNumber?: Array<string>;
  }

  /**
   * Parameters for getAllCBPDeviceAffected
   */
  export interface getAllCBPDeviceAffectedParams {

    /**
     * Page which is requested.
     */
    page: number;

    /**
     * Number of records in a page
     */
    pageSize: number;

    /**
     * The Id's of the Assets Affected . Example:- 2689444; 91488861, 92246411
     */
     body :Array<string>;
  }

  /**
   * Parameters for getAllCBPExceptionDetails
   */
  export interface getAllCBPExceptionDetailsParams {

    /**
     * Page which is requested.
     */
    page: number;

    /**
     * Number of records in a page
     */
    pageSize: number;

    /**
     * The Id's of the Devices with Exceptions . Example:- 2689444; 91488861, 92246411
     */
     body :Array<string>;
  }

}

export { ArchitectureService }
