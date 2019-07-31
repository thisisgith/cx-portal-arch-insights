/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { DiagnosticsConfiguration as __Configuration } from '../diagnostics-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { ScanResultsResponse } from '../models/scan-results-response';
import { CriticalBugsCount } from '../models/critical-bugs-count';
import { CriticalBugsResponse } from '../models/critical-bugs-response';
@Injectable({
  providedIn: 'root',
})
class DiagnosticsService extends __BaseService {
  static readonly headScanResultsPath = '/scan-results';
  static readonly getScanResultsPath = '/scan-results';
  static readonly getCriticalBugsStateCountPath = '/critical-bugs/state/count';
  static readonly getCriticalBugsPath = '/critical-bugs';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Fetches meta information about the Diagnostics Scan results.
   * @param params The `DiagnosticsService.HeadScanResultsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   */
  headScanResultsResponse(params: DiagnosticsService.HeadScanResultsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/diagnostics/v1/scan-results`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }

  /**
   * Fetches meta information about the Diagnostics Scan results.
   * @param params The `DiagnosticsService.HeadScanResultsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   */
  headScanResults(params: DiagnosticsService.HeadScanResultsParams): __Observable<null> {
    return this.headScanResultsResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Diagnostics Scan Results
   * @param params The `DiagnosticsService.GetScanResultsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `severity`: Severity
   *
   * - `serialNumber`: A serial number is a unique number used for identification.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `productId`: The alphanumeric identifier used by customers to order Cisco products. Examples:- CISCO2921/K9 ; WS-C3750X-24S-S ; WS-X6748-GE-TX
   *
   * - `problemId`: Problem Id
   *
   * - `page`: Page number of the response
   *
   * - `issueId`: Issue Id
   *
   * - `fields`: Requested fields in the response.
   *
   * - `deviceId`: Device ID
   *
   * - `alertId`: Alert Id
   *
   * @return successful operation
   */
  getScanResultsResponse(params: DiagnosticsService.GetScanResultsParams): __Observable<__StrictHttpResponse<ScanResultsResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    (params.severity || []).forEach(val => {if (val != null) __params = __params.append('severity', val.toString())});
    (params.serialNumber || []).forEach(val => {if (val != null) __params = __params.append('serialNumber', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    (params.productId || []).forEach(val => {if (val != null) __params = __params.append('productId', val.toString())});
    (params.problemId || []).forEach(val => {if (val != null) __params = __params.append('problemId', val.toString())});
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.issueId || []).forEach(val => {if (val != null) __params = __params.append('issueId', val.toString())});
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    (params.deviceId || []).forEach(val => {if (val != null) __params = __params.append('deviceId', val.toString())});
    (params.alertId || []).forEach(val => {if (val != null) __params = __params.append('alertId', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/diagnostics/v1/scan-results`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ScanResultsResponse>;
      })
    );
  }

  /**
   * Diagnostics Scan Results
   * @param params The `DiagnosticsService.GetScanResultsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `severity`: Severity
   *
   * - `serialNumber`: A serial number is a unique number used for identification.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `productId`: The alphanumeric identifier used by customers to order Cisco products. Examples:- CISCO2921/K9 ; WS-C3750X-24S-S ; WS-X6748-GE-TX
   *
   * - `problemId`: Problem Id
   *
   * - `page`: Page number of the response
   *
   * - `issueId`: Issue Id
   *
   * - `fields`: Requested fields in the response.
   *
   * - `deviceId`: Device ID
   *
   * - `alertId`: Alert Id
   *
   * @return successful operation
   */
  getScanResults(params: DiagnosticsService.GetScanResultsParams): __Observable<ScanResultsResponse> {
    return this.getScanResultsResponse(params).pipe(
      __map(_r => _r.body as ScanResultsResponse)
    );
  }

  /**
   * Provides number of critical bugs in each state
   * @param customerId Unique identifier of a Cisco customer.
   * @return successful operation
   */
  getCriticalBugsStateCountResponse(customerId: string): __Observable<__StrictHttpResponse<CriticalBugsCount>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (customerId != null) __params = __params.set('customerId', customerId.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/diagnostics/v1/critical-bugs/state/count`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CriticalBugsCount>;
      })
    );
  }

  /**
   * Provides number of critical bugs in each state
   * @param customerId Unique identifier of a Cisco customer.
   * @return successful operation
   */
  getCriticalBugsStateCount(customerId: string): __Observable<CriticalBugsCount> {
    return this.getCriticalBugsStateCountResponse(customerId).pipe(
      __map(_r => _r.body as CriticalBugsCount)
    );
  }

  /**
   * Provides details about critical bugs attached to assets
   * @param params The `DiagnosticsService.GetCriticalBugsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `state`: State of the bugs
   *
   * - `serialNumber`: A serial number is a unique number used for identification
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * - `id`: ID of the Bug
   *
   * @return successful operation
   */
  getCriticalBugsResponse(params: DiagnosticsService.GetCriticalBugsParams): __Observable<__StrictHttpResponse<CriticalBugsResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.state || []).forEach(val => {if (val != null) __params = __params.append('state', val.toString())});
    (params.serialNumber || []).forEach(val => {if (val != null) __params = __params.append('serialNumber', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    if (params.id != null) __params = __params.set('id', params.id.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/diagnostics/v1/critical-bugs`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CriticalBugsResponse>;
      })
    );
  }

  /**
   * Provides details about critical bugs attached to assets
   * @param params The `DiagnosticsService.GetCriticalBugsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `state`: State of the bugs
   *
   * - `serialNumber`: A serial number is a unique number used for identification
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * - `id`: ID of the Bug
   *
   * @return successful operation
   */
  getCriticalBugs(params: DiagnosticsService.GetCriticalBugsParams): __Observable<CriticalBugsResponse> {
    return this.getCriticalBugsResponse(params).pipe(
      __map(_r => _r.body as CriticalBugsResponse)
    );
  }
}

module DiagnosticsService {

  /**
   * Parameters for headScanResults
   */
  export interface HeadScanResultsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * Number of rows of data per page.
     */
    rows?: number;

    /**
     * Page number of the response
     */
    page?: number;
  }

  /**
   * Parameters for getScanResults
   */
  export interface GetScanResultsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * Severity
     */
    severity?: Array<string>;

    /**
     * A serial number is a unique number used for identification.
     */
    serialNumber?: Array<string>;

    /**
     * Number of rows of data per page.
     */
    rows?: number;

    /**
     * The alphanumeric identifier used by customers to order Cisco products. Examples:- CISCO2921/K9 ; WS-C3750X-24S-S ; WS-X6748-GE-TX
     */
    productId?: Array<string>;

    /**
     * Problem Id
     */
    problemId?: Array<string>;

    /**
     * Page number of the response
     */
    page?: number;

    /**
     * Issue Id
     */
    issueId?: Array<string>;

    /**
     * Requested fields in the response.
     */
    fields?: Array<string>;

    /**
     * Device ID
     */
    deviceId?: Array<string>;

    /**
     * Alert Id
     */
    alertId?: Array<string>;
  }

  /**
   * Parameters for getCriticalBugs
   */
  export interface GetCriticalBugsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * State of the bugs
     */
    state?: Array<'new' | 'resolved' | 'verified' | 'duplicate' | 'closed'>;

    /**
     * A serial number is a unique number used for identification
     */
    serialNumber?: Array<string>;

    /**
     * Number of rows of data per page
     */
    rows?: number;

    /**
     * The page number of the response
     */
    page?: number;

    /**
     * ID of the Bug
     */
    id?: string;
  }
}

export { DiagnosticsService }
