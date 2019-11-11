/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ArchitectureConfiguration as __Configuration } from '../architecture-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { ContractDeviceCountsResponse } from '../models/contract-device-counts-response';


@Injectable({
  providedIn: 'root',
})
class ArchitectureService extends __BaseService {

  static readonly getContractCountsPath = '/customerportal/contracts/v1/device/count';
  static readonly getCBPSeverityResponsePath = '/customerportal/archinsights/v1/cbprules';
  static readonly getAllAssetsWithExceptionsResponsePath = '/customerportal/archinsights/v1/assets/exceptions';
  static readonly getExceptionsCountResponsePath = '/customerportal/archinsights/v1/cbprules/count';
  static readonly getAssetsExceptionsCountResponsePath = '/customerportal/archinsights/v1/assets/exceptions/count';
  static readonly getAllCBPDeviceAffectedResponsePath = '/customerportal/archinsights/v1/assets/exceptions/devicedetails';
  static readonly getAllCBPExceptionDetailsResponsePath = '/customerportal/archinsights/v1/cbprules/exceptiondetails';

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
    if (params.searchText != null) __params = __params.set('searchText', params.searchText.toString());
    if (params.collectionId != null) __params = __params.set('collectionId', params.collectionId.toString());

    let req = new HttpRequest<any>(
	  'GET',
	  this.rootUrl + `${ArchitectureService.getCBPSeverityResponsePath}`,
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
    if (params.searchText != null) __params = __params.set('searchText', params.searchText.toString());
    if (params.collectionId != null) __params = __params.set('collectionId', params.collectionId.toString());

    let req = new HttpRequest<any>(
	  'GET',
	  this.rootUrl + `${ArchitectureService.getAllAssetsWithExceptionsResponsePath}`,
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
  getExceptionsCount(params: any): __Observable<any> {
    return this.getExceptionsCountResponse(params).pipe(
      __map(_r => _r.body as ContractDeviceCountsResponse)
    );
  }

  getExceptionsCountResponse(params: any): __Observable<__StrictHttpResponse<any>> {

    let __headers = new HttpHeaders();
    let __body: any = null;
    let __params = this.newParams();
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.collectionId != null) __params = __params.set('collectionId', params.collectionId.toString());

    let req = new HttpRequest<any>(
	  'GET',
	  this.rootUrl + `${ArchitectureService.getExceptionsCountResponsePath}`,
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

  // count of all exceptions

  getAssetsExceptionsCount(params:any): __Observable<any> {
    return this.getAssetsExceptionsCountResponse(params).pipe(
      __map(_r => _r.body as ContractDeviceCountsResponse)
    );
  }

  getAssetsExceptionsCountResponse(params:any): __Observable<__StrictHttpResponse<any>> {

    let __headers = new HttpHeaders();
    let __body: any = null;
    let __params = this.newParams();
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.collectionId != null) __params = __params.set('collectionId', params.collectionId.toString());


    let req = new HttpRequest<any>(
      'GET',
	  this.rootUrl + `${ArchitectureService.getAssetsExceptionsCountResponsePath}`,
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
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.collectionId != null) __params = __params.set('collectionId', params.collectionId.toString());


    let req = new HttpRequest<any>(
      'POST',
	  this.rootUrl + `${ArchitectureService.getAllCBPDeviceAffectedResponsePath}`,
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
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.collectionId != null) __params = __params.set('collectionId', params.collectionId.toString());

    let req = new HttpRequest<any>(
	  'POST',
	  this.rootUrl + `${ArchitectureService.getAllCBPExceptionDetailsResponsePath}`,
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
     * unique identifier of a cisco customer
     */
    customerId: string;

    /**
     * Number of records in a page
     */
    pageSize: number;

    /**
     * The Id's of the Assets Affected . Example:- 2689444; 91488861, 92246411
     */
     body :Array<string>;

     collectionId: string;
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
     * unique identifier of a cisco customer
     */
    customerId: string;

    /**
     * The Id's of the Devices with Exceptions . Example:- 2689444; 91488861, 92246411
     */
     body :Array<string>;

     collectionId: string;

  }

}

export { ArchitectureService }
