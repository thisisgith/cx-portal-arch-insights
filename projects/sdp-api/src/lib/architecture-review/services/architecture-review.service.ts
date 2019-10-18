/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ArchitectureReviewConfiguration as __Configuration } from '../architecture-review-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable, Observable, BehaviorSubject } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
class ArchitectureReviewService extends __BaseService {

  static readonly getDevicesListResponsePath = '/customerportal/archinsights/v1/dnac/devicedetails';
  static readonly getDnacListResponsePath = '/customerportal/archinsights/v1/dnac/details';
  static readonly getDevicesCountResponsePath = '/customerportal/archinsights/v1/dnac/devicecount';
  static readonly getDnacCountResponsePath = '/customerportal/archinsights/v1/dnac/count';
  static readonly getDevicesSDAResponsePath = '/customerportal/archinsights/v1/dnac/deviceinsight';
  static readonly getnonOptimalLinksResponsePath = '/customerportal/archinsights/v1/dnac/deviceinsight/nonoptimallinks';
  static readonly getSDAReadinessCountResponse = '/customerportal/archinsights/v1/dnac/devicecompliance';
  static readonly getCollectionIdResponsePath = '/customerportal/archinsights/v1/collectiondetails';

  private collectionId = new BehaviorSubject<any>({});

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
  getDevicesListResponse(params: any): __Observable<__StrictHttpResponse<any>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.page != null) __params = __params.set('page', params.page.toString());
    if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
    if (params.filterBy != null) __params = __params.set('filterBy', params.filterBy.toString());
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.collectionId != null) __params = __params.set('collectionId', params.collectionId.toString());
    if (params.searchText != null) __params = __params.set('searchText', params.searchText.toString());
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());


    // (params.contractNumber || []).forEach(val => {if (val != null) __params = __params.append('contractNumber', val.toString())});
    let req = new HttpRequest<any>(
	  'GET',
	  this.rootUrl + `${ArchitectureReviewService.getDevicesListResponsePath}`,
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
  getDevicesList(params: any): __Observable<any> {
    return this.getDevicesListResponse(params).pipe(
      __map(_r => { return _r.body})
    );
  }

  getDnacList(params:any): __Observable<any> {
    return this.getDnacListResponse(params).pipe(
      __map(_r => {
        return _r.body;
      })
    );
  }

  getDnacListResponse(params:any): __Observable<__StrictHttpResponse<any>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.page != null) __params = __params.set('page', params.page);
    if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize);
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.collectionId != null) __params = __params.set('collectionId', params.collectionId.toString());
    if (params.searchText != null) __params = __params.set('searchText', params.searchText.toString());
    if (params.dnacIP != null) __params = __params.set('dnacIP', params.dnacIP.toString());

    let req = new HttpRequest<any>(
	  'GET',
	  this.rootUrl + `${ArchitectureReviewService.getDnacListResponsePath}`,
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

  getCollectionDetails(params:any): __Observable<any> {
    return this.getCollectionDetailsResponse(params).pipe(
      __map(_r => {
        this.collectionId.next({ collection : _r.body});
        return _r.body;
      })
    );
  }

  getCollectionDetailsResponse(params:any): __Observable<__StrictHttpResponse<any>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());

    let req = new HttpRequest<any>(
	  'GET',
	  this.rootUrl + `${ArchitectureReviewService.getCollectionIdResponsePath}`,
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

  getCollectionId(): Observable<any> {
    return this.collectionId.asObservable();
  }
  
  // Devices count of High and Medium Severity
  getDevicesCount(params: any): __Observable<any> {
    return this.getDevicesCountResponse(params).pipe(
      __map(_r => _r.body)
    );
  }

  getDevicesCountResponse(params: any): __Observable<__StrictHttpResponse<any>> {

    let __headers = new HttpHeaders();
    let __body: any = null;
    let __params = this.newParams();
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.collectionId != null) __params = __params.set('collectionId', params.collectionId.toString());

    let req = new HttpRequest<any>(
	  'GET',
	  this.rootUrl + `${ArchitectureReviewService.getDevicesCountResponsePath}`,
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

    // Devices count of High and Medium Severity
    getSDAReadinessCount(params: any): __Observable<any> {
      return this.getSDAReadinessCountResponse(params).pipe(
        __map(_r => _r.body)
      );
    }

    getSDAReadinessCountResponse(params: any): __Observable<__StrictHttpResponse<any>> {

      let __headers = new HttpHeaders();
      let __body: any = null;
      let __params = this.newParams();
      if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
      if (params.collectionId != null) __params = __params.set('collectionId', params.collectionId.toString());
      let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `${ArchitectureReviewService.getSDAReadinessCountResponse}`,
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
  getDnacCount(params:any): __Observable<any> {
    return this.getDnacCountResponse(params).pipe(
      __map(_r => _r.body)
    );
  }

  getDnacCountResponse(params:any): __Observable<__StrictHttpResponse<any>> {
    let __headers = new HttpHeaders();
    let __body: any = null;
    let __params = this.newParams();
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.collectionId != null) __params = __params.set('collectionId', params.collectionId.toString());

    let req = new HttpRequest<any>(
      'GET',
	  this.rootUrl + `${ArchitectureReviewService.getDnacCountResponsePath}`,
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
  getDevicesSDA(params: ArchitectureReviewService.getDevicesSDAParams): __Observable<any> {
    return this.getDevicesSDAResponse(params).pipe(
      __map(_r => _r.body)
    );
  }

  /**
   * This function is used to get the asset details
   * @param body This parameter containes array of assets
   * @returns only body part of the HTTp response
   */
  getOptimalLinks(params: ArchitectureReviewService.getDevicesSDAParams): __Observable<any> {
    return this.getOptimalLinksResponse(params).pipe(
      __map(_r => _r.body)
    );
  }


  getOptimalLinksResponse(params: ArchitectureReviewService.getDevicesSDAParams): __Observable<__StrictHttpResponse<any>> {

    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = params.body;

    if (params.page != null) __params = __params.set('page', params.page.toString());
    if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
	if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
	if (params.deviceIp != null) __params = __params.set('deviceIp', params.deviceIp.toString());
  if (params.collectionId != null) __params = __params.set('collectionId', params.collectionId.toString());
    let req = new HttpRequest<any>(
      'GET',
	  this.rootUrl + `${ArchitectureReviewService.getnonOptimalLinksResponsePath}`,
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
   * This Function is used to get the asset detail by adding headers, params and body while sending the request
   * @param body This Parameter contains array of Assets
   * @returns Entire HTTP response is returned
   */
  getDevicesSDAResponse(params: ArchitectureReviewService.getDevicesSDAParams): __Observable<__StrictHttpResponse<any>> {

    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = params.body;

    if (params.page != null) __params = __params.set('page', params.page.toString());
    if (params.pageSize != null) __params = __params.set('pageSize', params.pageSize.toString());
	if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
	if (params.deviceIp != null) __params = __params.set('deviceIp', params.deviceIp.toString());
  if (params.collectionId != null) __params = __params.set('collectionId', params.collectionId.toString());

    let req = new HttpRequest<any>(
      'GET',
	  this.rootUrl + `${ArchitectureReviewService.getDevicesSDAResponsePath}`,
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

module ArchitectureReviewService {

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
  export interface getDevicesSDAParams {

    /**
     * Page which is requested.
     */
    page?: number;

    /**
     * unique identifier of a cisco customer
     */
    customerId?: string;

    /**
     * Number of records in a page
     */
    pageSize?: number;

    /**
     * The Id's of the Assets Affected . Example:- 2689444; 91488861, 92246411
     */
	 body?: Array<string>;

   deviceIp?: string;
   collectionId?: string;
  }

}

export { ArchitectureReviewService }
