/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ArchitectureConfiguration as __Configuration } from '../architecture-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { ContractDeviceCountsResponse } from '../models/contract-device-counts-response';

@Injectable({
  providedIn: 'root',
})
class ArchitectureService extends __BaseService {

  
  static readonly getContractCountsPath = '/api/customerportal/contracts/v1/device/count';

  static readonly getAllCBPRules = '/cparchinsights/getAllCBPRules';
 

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
  getContractCountsResponse(params: ArchitectureService.GetContractCountsParams): __Observable<__StrictHttpResponse<ContractDeviceCountsResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.contractNumber || []).forEach(val => {if (val != null) __params = __params.append('contractNumber', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/contracts/v1/device/count`,
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
  getContractCounts(params: ArchitectureService.GetContractCountsParams): __Observable<ContractDeviceCountsResponse> {
    return this.getContractCountsResponse(params).pipe(
      __map(_r => _r.body as ContractDeviceCountsResponse)
    );
  }

  getAllCBPRules(): __Observable<any> {
    return this.getAllCBPRulesResponse().pipe(
      __map(_r => _r.body as ContractDeviceCountsResponse)
    );
  }

  getAllCBPRulesResponse(): __Observable<__StrictHttpResponse<any>> {
   
    let __headers = new HttpHeaders();
    let __body: any = null;
    
    let req = new HttpRequest<any>(
      'GET',
      `https://api-stage.cisco.com/cparchinsights/getAllCBPRules`,
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
  export interface GetContractCountsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * The number of the service contract. Example:- 2689444; 91488861, 92246411
     */
    contractNumber?: Array<string>;
  }

 
}

export { ArchitectureService }
