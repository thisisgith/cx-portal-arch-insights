/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ContractsConfiguration as __Configuration } from '../contracts-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CoverageResponse } from '../models/coverage-response';
import { CoverageCountResponse } from '../models/coverage-count-response';
import { DeviceContractResponse } from '../models/device-contract-response';
@Injectable({
  providedIn: 'root',
})
class ContractsService extends __BaseService {
  static readonly headApiCustomerportalContractsV1ProductsCoveragesPath = '/api/customerportal/contracts/v1/products/coverages';
  static readonly getDevicesAndCoveragePath = '/api/customerportal/contracts/v1/products/coverages';
  static readonly getTopCoverageExpirationPath = '/api/customerportal/contracts/v1/products/coverages/top';
  static readonly getContractDetailsPath = '/api/customerportal/contracts/v1/details';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Returns the total number of products that have coverage information along with query metadata (e.g. rows/page).
   * @param params The `ContractsService.HeadApiCustomerportalContractsV1ProductsCoveragesParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `coverage`: Unique identifier of a Cisco customer.
   */
  headApiCustomerportalContractsV1ProductsCoveragesResponse(params: ContractsService.HeadApiCustomerportalContractsV1ProductsCoveragesParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.coverage != null) __params = __params.set('coverage', params.coverage.toString());
    if (params.contractNumber != null) __params = __params.set('contractNumber', params.contractNumber.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/api/customerportal/contracts/v1/products/coverages`,
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
   * @param params The `ContractsService.HeadApiCustomerportalContractsV1ProductsCoveragesParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `coverage`: Unique identifier of a Cisco customer.
   */
  headApiCustomerportalContractsV1ProductsCoverages(params: ContractsService.HeadApiCustomerportalContractsV1ProductsCoveragesParams): __Observable<null> {
    return this.headApiCustomerportalContractsV1ProductsCoveragesResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * The not-covered API retrieves details of all devices in the inventory that are not covered by any Cisco service contracts.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/collections/import-inventory-file
   * @param params The `ContractsService.GetDevicesAndCoverageParams` containing the following parameters:
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
  getDevicesAndCoverageResponse(params: ContractsService.GetDevicesAndCoverageParams): __Observable<__StrictHttpResponse<CoverageResponse>> {
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
      this.rootUrl + `/api/customerportal/contracts/v1/products/coverages`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CoverageResponse>;
      })
    );
  }
  /**
   * The not-covered API retrieves details of all devices in the inventory that are not covered by any Cisco service contracts.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/collections/import-inventory-file
   * @param params The `ContractsService.GetDevicesAndCoverageParams` containing the following parameters:
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
  getDevicesAndCoverage(params: ContractsService.GetDevicesAndCoverageParams): __Observable<CoverageResponse> {
    return this.getDevicesAndCoverageResponse(params).pipe(
      __map(_r => _r.body as CoverageResponse)
    );
  }

  /**
   * The not-covered API retrieves details of all devices in the inventory that are not covered by any Cisco service contracts.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/collections/import-inventory-file
   * @param params The `ContractsService.GetTopCoverageExpirationParams` containing the following parameters:
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
  getTopCoverageExpirationResponse(params: ContractsService.GetTopCoverageExpirationParams): __Observable<__StrictHttpResponse<CoverageCountResponse>> {
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
      this.rootUrl + `/api/customerportal/contracts/v1/products/coverages/top`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CoverageCountResponse>;
      })
    );
  }
  /**
   * The not-covered API retrieves details of all devices in the inventory that are not covered by any Cisco service contracts.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/collections/import-inventory-file
   * @param params The `ContractsService.GetTopCoverageExpirationParams` containing the following parameters:
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
  getTopCoverageExpiration(params: ContractsService.GetTopCoverageExpirationParams): __Observable<CoverageCountResponse> {
    return this.getTopCoverageExpirationResponse(params).pipe(
      __map(_r => _r.body as CoverageCountResponse)
    );
  }

  /**
   * The contract-details API retrieves details of specific contracts owned by customers or partners.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/contracts/contract-details
   * @param params The `ContractsService.GetContractDetailsParams` containing the following parameters:
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
  getContractDetailsResponse(params: ContractsService.GetContractDetailsParams): __Observable<__StrictHttpResponse<DeviceContractResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.inventoryName != null) __params = __params.set('inventoryName', params.inventoryName.toString());
    if (params.serialNumber!= null) __params = __params.set('serialNumber', params.serialNumber.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    (params.contractNumber || []).forEach(val => {if (val != null) __params = __params.append('contractNumber', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/contracts/v1/details`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DeviceContractResponse>;
      })
    );
  }
  /**
   * The contract-details API retrieves details of specific contracts owned by customers or partners.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response. https://sdp.cisco.com/api/v1/contracts/contract-details
   * @param params The `ContractsService.GetContractDetailsParams` containing the following parameters:
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
  getContractDetails(params: ContractsService.GetContractDetailsParams): __Observable<DeviceContractResponse> {
    return this.getContractDetailsResponse(params).pipe(
      __map(_r => _r.body as DeviceContractResponse)
    );
  }
}

module ContractsService {

  /**
   * Parameters for headApiCustomerportalContractsV1ProductsCoverages
   */
  export interface HeadApiCustomerportalContractsV1ProductsCoveragesParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * The contract number
     */
    contractNumber?: string;

    /**
     * Unique identifier of a Cisco customer.
     */
    coverage: 'covered' | 'not-covered' | 'unknown';
  }

  /**
   * Parameters for getDevicesAndCoverage
   */
  export interface GetDevicesAndCoverageParams {

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
   * Parameters for getTopCoverageExpiration
   */
  export interface GetTopCoverageExpirationParams {

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
   * Parameters for getContractDetails
   */
  export interface GetContractDetailsParams {

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

    /**
     * The serial number to search on. Example - FOX1306GFKH
     */
     serialNumber?: Array<string>;
  }
}

export { ContractsService }
