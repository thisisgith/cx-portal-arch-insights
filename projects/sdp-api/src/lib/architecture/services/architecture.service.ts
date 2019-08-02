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
  getCBPSeverityResponse(params: ArchitectureService.GetCBPSeverityParams): __Observable<__StrictHttpResponse<any>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.severityObj != null) __params = __params.set('severityObj', params.severityObj.toString());
    // (params.contractNumber || []).forEach(val => {if (val != null) __params = __params.append('contractNumber', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      'https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/exceptionassets',
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
        return _r as __StrictHttpResponse<ContractDeviceCountsResponse>;
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
  getCBPSeverityList(params: ArchitectureService.GetCBPSeverityParams): __Observable<ContractDeviceCountsResponse> {
    return this.getCBPSeverityResponse(params).pipe(
      __map(_r => _r.body as ContractDeviceCountsResponse)
    );
  }

  getAllAssetsWithExceptions(): __Observable<any> {
    return this.getAllAssetsWithExceptionsResponse().pipe(
      __map(_r => {

        this.AssetsExceptionsCount.next({ count: _r.body.TotalCounts });
        return _r.body as ContractDeviceCountsResponse;
      })

    );
  }

  getMessage(): Observable<any> {
    return this.AssetsExceptionsCount.asObservable();
  }

  getAllAssetsWithExceptionsResponse(): __Observable<__StrictHttpResponse<any>> {

    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/exceptionassets`,
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

  //high Severity exceptions
  getHighSeverityExceptions(): __Observable<any> {
    return this.getHighSeverityExceptionsResponse().pipe(
      __map(_r => _r.body as ContractDeviceCountsResponse)
    );
  }

  getHighSeverityExceptionsResponse(): __Observable<__StrictHttpResponse<any>> {

    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/cbprules?severity=High`,
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

  //medium Severity exceptions
  getMediumSeverityExceptions(): __Observable<any> {
    return this.getMediumSeverityExceptionsResponse().pipe(
      __map(_r => _r.body as ContractDeviceCountsResponse)
    );
  }

  getMediumSeverityExceptionsResponse(): __Observable<__StrictHttpResponse<any>> {

    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/cbprules?severity=Medium`,
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
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/cbprulescount`,
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
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/assetsexceptioncount`,
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
  getAllCBPRulesDetails(): __Observable<any> {
    return this.getAllCBPRulesDetailsResponse().pipe(
      __map(_r => {
        console.log(_r.body);
        let arr = [];
        arr.push(parseInt(_r.body.High));
        arr.push(parseInt(_r.body.Medium));
        console.log(arr);
        this.CBPRiskCount.next({ CBPRisk: arr });
        return _r.body as ContractDeviceCountsResponse;
      })
    );
  }

  getCBPRiskArray(): Observable<any> {
    return this.CBPRiskCount.asObservable();
  }

  getAllCBPRulesDetailsResponse(): __Observable<__StrictHttpResponse<any>> {

    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/cbprules`,
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

  public setAssetsExceptionCountSubjectObj(obj: any) {
    this.AssetsExceptionsCount.next({ severityObj: obj });
  }
  public getAssetsExceptionCountSubjectObj(): Observable<any> {
    return this.AssetsExceptionsCount.asObservable();
  }

  /**
   * This function is used to get the asset details
   * @param body This parameter containes array of assets 
   * @returns only body part of the HTTp response
   */
  getAllCBPDeviceAffected(body: any): __Observable<any> {
    return this.getAllCBPDeviceAffectedResponse(body).pipe(
      __map(_r => _r.body)
    );
  }

  /**
   * This Function is used to get the asset detail by adding headers, params and body while sending the request
   * @param body This Parameter contains array of Assets
   * @returns Entire HTTP response is returned 
   */
  getAllCBPDeviceAffectedResponse(body: any): __Observable<__StrictHttpResponse<any>> {

    let __headers = new HttpHeaders();
    let __body: any = body;


    let req = new HttpRequest<any>(
      'POST',
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/affecteddevicedetails`,
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

  /**
   * This function is used to get the Exceptions details
   * @param body This Parameter contains array of Exceptions
   * @returns only body part of the HTTp response
   */
  getAllCBPExceptionDetails(body: any): __Observable<any> {
    return this.getAllCBPExceptionDetailsResponse(body).pipe(
      __map(_r => _r.body)
    );
  }

  /**
   * This Function is used to get the Exceptions detail by adding headers, params and body while sending the request
   * @param body This Parameter contains array of Exceptions
   * @returns Entire HTTP response is returned 
   */
  getAllCBPExceptionDetailsResponse(body: any): __Observable<__StrictHttpResponse<any>> {

    let __headers = new HttpHeaders();
    let __body: any = body;

    let req = new HttpRequest<any>(
      'POST',
      `https://cp-archinsights-api.sdp11-idev.csco.cloud/archinsights/v1/cbpexceptiondetails`,
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

}

export { ArchitectureService }
