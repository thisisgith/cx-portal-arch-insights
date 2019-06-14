/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ContractsConfiguration as __Configuration } from '../contracts-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CoveredResponse } from '../models/covered-response';
import { CoverageExpirationResponse } from '../models/coverage-expiration-response';
import { ContractsResponse } from '../models/contracts-response';
@Injectable({
  providedIn: 'root',
})
class ContractsService extends __BaseService {
  static readonly headCoveragePath = '/api/v1/contracts/products/coverages';
  static readonly getCoveragePath = '/api/v1/contracts/products/coverages';
  static readonly getCoverageExpirationPath = '/api/v1/contracts/products/coverages/top';
  static readonly getContractsPath = '/api/v1/contracts';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Returns the total number of products that have coverage information along with query metadata (e.g. rows/page).
   * @param params The `ContractsService.HeadCoverageParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `coverage`: Unique identifier of a Cisco customer.
   */
  headCoverageResponse(params: ContractsService.HeadCoverageParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.coverage != null) __params = __params.set('coverage', params.coverage.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/api/v1/contracts/products/coverages`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * Returns the total number of products that have coverage information along with query metadata (e.g. rows/page).
   * @param params The `ContractsService.HeadCoverageParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `coverage`: Unique identifier of a Cisco customer.
   */
  headCoverage(params: ContractsService.HeadCoverageParams): __Observable<null> {
    return this.headCoverageResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * The not-covered API retrieves details of all devices in the inventory that are not covered by any Cisco service contracts.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/collections/import-inventory-file
   * @param params The `ContractsService.GetCoverageParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Sorting details
   *
   * - `rows`: No of rows in a page
   *
   * - `page`: Page number
   *
   * - `inventoryName`: The name of inventory given by customers.
   *
   * - `fields`: Filter fields
   *
   * - `coverageExpiry`: Returns the list of products with coverage expirations within the specified time period < <today+90 GMT>
   *
   * - `coverage`: Unique identifier of a Cisco customer.
   *
   * - `contractNumber`: The contract number
   *
   * @return successful operation
   */
  getCoverageResponse(params: ContractsService.GetCoverageParams): __Observable<__StrictHttpResponse<CoveredResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    if (params.inventoryName != null) __params = __params.set('inventoryName', params.inventoryName.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    if (params.coverageExpiry != null) __params = __params.set('coverageExpiry', params.coverageExpiry.toString());
    if (params.coverage != null) __params = __params.set('coverage', params.coverage.toString());
    (params.contractNumber || []).forEach(val => {if (val != null) __params = __params.append('contractNumber', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/v1/contracts/products/coverages`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CoveredResponse>;
      })
    );
  }
  /**
   * The not-covered API retrieves details of all devices in the inventory that are not covered by any Cisco service contracts.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/collections/import-inventory-file
   * @param params The `ContractsService.GetCoverageParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Sorting details
   *
   * - `rows`: No of rows in a page
   *
   * - `page`: Page number
   *
   * - `inventoryName`: The name of inventory given by customers.
   *
   * - `fields`: Filter fields
   *
   * - `coverageExpiry`: Returns the list of products with coverage expirations within the specified time period < <today+90 GMT>
   *
   * - `coverage`: Unique identifier of a Cisco customer.
   *
   * - `contractNumber`: The contract number
   *
   * @return successful operation
   */
  getCoverage(params: ContractsService.GetCoverageParams): __Observable<CoveredResponse> {
    return this.getCoverageResponse(params).pipe(
      __map(_r => _r.body as CoveredResponse)
    );
  }

  /**
   * The not-covered API retrieves details of all devices in the inventory that are not covered by any Cisco service contracts.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/collections/import-inventory-file
   * @param params The `ContractsService.GetCoverageExpirationParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Sorting details
   *
   * - `rows`: No of rows in a page
   *
   * - `page`: Page number
   *
   * - `inventoryName`: The name of inventory given by customers.
   *
   * - `coverageExpiry`: Returns the list of products with coverage expirations within the specified time period < <today+90 GMT>. The value of coverageExpiry is a date computed by the client
   *
   * @return successful operation
   */
  getCoverageExpirationResponse(params: ContractsService.GetCoverageExpirationParams): __Observable<__StrictHttpResponse<CoverageExpirationResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    if (params.inventoryName != null) __params = __params.set('inventoryName', params.inventoryName.toString());
    if (params.coverageExpiry != null) __params = __params.set('coverageExpiry', params.coverageExpiry.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/v1/contracts/products/coverages/top`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CoverageExpirationResponse>;
      })
    );
  }
  /**
   * The not-covered API retrieves details of all devices in the inventory that are not covered by any Cisco service contracts.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/collections/import-inventory-file
   * @param params The `ContractsService.GetCoverageExpirationParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Sorting details
   *
   * - `rows`: No of rows in a page
   *
   * - `page`: Page number
   *
   * - `inventoryName`: The name of inventory given by customers.
   *
   * - `coverageExpiry`: Returns the list of products with coverage expirations within the specified time period < <today+90 GMT>. The value of coverageExpiry is a date computed by the client
   *
   * @return successful operation
   */
  getCoverageExpiration(params: ContractsService.GetCoverageExpirationParams): __Observable<CoverageExpirationResponse> {
    return this.getCoverageExpirationResponse(params).pipe(
      __map(_r => _r.body as CoverageExpirationResponse)
    );
  }

  /**
   * The contract-details API retrieves details of specific contracts owned by customers or partners.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/contracts/contract-details
   * @param params The `ContractsService.GetContractsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `inventoryName`: The name of inventory given by customers.
   *
   * - `fields`: Filter fields
   *
   * - `contractNumber`: The number of the service contract.   Example:- 2689444; 91488861, 92246411
   *
   * @return successful operation
   */
  getContractsResponse(params: ContractsService.GetContractsParams): __Observable<__StrictHttpResponse<ContractsResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.inventoryName != null) __params = __params.set('inventoryName', params.inventoryName.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    (params.contractNumber || []).forEach(val => {if (val != null) __params = __params.append('contractNumber', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/v1/contracts`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ContractsResponse>;
      })
    );
  }
  /**
   * The contract-details API retrieves details of specific contracts owned by customers or partners.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/contracts/contract-details
   * @param params The `ContractsService.GetContractsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `inventoryName`: The name of inventory given by customers.
   *
   * - `fields`: Filter fields
   *
   * - `contractNumber`: The number of the service contract.   Example:- 2689444; 91488861, 92246411
   *
   * @return successful operation
   */
  getContracts(params: ContractsService.GetContractsParams): __Observable<ContractsResponse> {
    return this.getContractsResponse(params).pipe(
      __map(_r => _r.body as ContractsResponse)
    );
  }
}

module ContractsService {

  /**
   * Parameters for headCoverage
   */
  export interface HeadCoverageParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    coverage: 'covered' | 'not-covered' | 'unknown';
  }

  /**
   * Parameters for getCoverage
   */
  export interface GetCoverageParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Sorting details
     */
    sort?: Array<string>;

    /**
     * No of rows in a page
     */
    rows?: number;

    /**
     * Page number
     */
    page?: number;

    /**
     * The name of inventory given by customers.
     */
    inventoryName?: string;

    /**
     * Filter fields
     */
    fields?: Array<string>;

    /**
     * Returns the list of products with coverage expirations within the specified time period < <today+90 GMT>
     */
    coverageExpiry?: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    coverage?: 'covered' | 'not-covered' | 'unknown';

    /**
     * The contract number
     */
    contractNumber?: Array<number>;
  }

  /**
   * Parameters for getCoverageExpiration
   */
  export interface GetCoverageExpirationParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Sorting details
     */
    sort?: Array<string>;

    /**
     * No of rows in a page
     */
    rows?: number;

    /**
     * Page number
     */
    page?: number;

    /**
     * The name of inventory given by customers.
     */
    inventoryName?: string;

    /**
     * Returns the list of products with coverage expirations within the specified time period < <today+90 GMT>. The value of coverageExpiry is a date computed by the client
     */
    coverageExpiry?: string;
  }

  /**
   * Parameters for getContracts
   */
  export interface GetContractsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * The name of inventory given by customers.
     */
    inventoryName?: string;

    /**
     * Filter fields
     */
    fields?: Array<string>;

    /**
     * The number of the service contract.   Example:- 2689444; 91488861, 92246411
     */
    contractNumber?: Array<number>;
  }
}

export { ContractsService }
