/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { DiagnosticsConfiguration as __Configuration } from '../diagnostics-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { ScanResultsResponse } from '../models/scan-results-response';
import { BugImpactedAssetsResponse } from '../models/bug-impacted-assets-response';
import { CriticalBugsCount } from '../models/critical-bugs-count';
import { CriticalBugsResponse } from '../models/critical-bugs-response';
@Injectable({
  providedIn: 'root',
})
class DiagnosticsService extends __BaseService {
  static readonly headScanResultsPath = '/scan-results';
  static readonly getScanResultsPath = '/scan-results';
  static readonly getCriticalBugsAssetsPath = '/critical-bugs/assets';
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
      this.rootUrl + `/customerportal/diagnostics/v1/scan-results`,
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
      this.rootUrl + `/customerportal/diagnostics/v1/scan-results`,
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
   * Impacted assets of a bug
   * @param params The `DiagnosticsService.GetCriticalBugsAssetsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `cdetId`: The CDET id
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * @return successful operation
   */
  getCriticalBugsAssetsResponse(params: DiagnosticsService.GetCriticalBugsAssetsParams): __Observable<__StrictHttpResponse<BugImpactedAssetsResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.cdetId || []).forEach(val => {if (val != null) __params = __params.append('cdetId', val.toString())});
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/diagnostics/v1/critical-bugs/assets`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<BugImpactedAssetsResponse>;
      })
    );
  }

  /**
   * Impacted assets of a bug
   * @param params The `DiagnosticsService.GetCriticalBugsAssetsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `cdetId`: The CDET id
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * @return successful operation
   */
  getCriticalBugsAssets(params: DiagnosticsService.GetCriticalBugsAssetsParams): __Observable<BugImpactedAssetsResponse> {
    return this.getCriticalBugsAssetsResponse(params).pipe(
      __map(_r => _r.body as BugImpactedAssetsResponse)
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
      this.rootUrl + `/customerportal/diagnostics/v1/critical-bugs/state/count`,
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
   * - `title`: Security Advisory title
   *
   * - `state`: State of the bugs
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `serialNumber`: A serial number is a unique number used for identification
   *
   * - `search`: Searchable fields - severity, title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `rows`: Number of rows of data per page
   *
   * - `publishedOn`: The date on which the Advisory was published
   *
   * - `page`: The page number of the response
   *
   * - `lastUpdatedDateRange`: A date range in the format of <fromDateInMillis>,<toDateInMillis>. fromDateInMillis is inclusive and toDateInMillis is exclusive. <toDateInMillis> format supported to filter advisories having lastUpdatedDateRange till particular date. Use <fromDateInMillis> format to filter advisories having lastUpdatedDateRange from a particular date.
   *
   * - `lastUpdated`: The date on which the Advisory was last updated. Currently this field in unavailable.
   *
   * - `id`: ID of the Bug
   *
   * - `fields`: Requested fields in the response. Id field is by default
   *
   * - `cdetsId`: ID of the Bug
   *
   * @return successful operation
   */
  getCriticalBugsResponse(params: DiagnosticsService.GetCriticalBugsParams): __Observable<__StrictHttpResponse<CriticalBugsResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.title != null) __params = __params.set('title', params.title.toString());
    (params.state || []).forEach(val => {if (val != null) __params = __params.append('state', val.toString())});
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    (params.serialNumber || []).forEach(val => {if (val != null) __params = __params.append('serialNumber', val.toString())});
    if (params.search != null) __params = __params.set('search', params.search.toString());
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.publishedOn != null) __params = __params.set('publishedOn', params.publishedOn.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.lastUpdatedDateRange || []).forEach(val => {if (val != null) __params = __params.append('lastUpdatedDateRange', val.toString())});
    if (params.lastUpdated != null) __params = __params.set('lastUpdated', params.lastUpdated.toString());
    (params.id || []).forEach(val => {if (val != null) __params = __params.append('id', val.toString())});
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    (params.cdetsId || []).forEach(val => {if (val != null) __params = __params.append('cdetsId', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/diagnostics/v1/critical-bugs`,
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
   * - `title`: Security Advisory title
   *
   * - `state`: State of the bugs
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `serialNumber`: A serial number is a unique number used for identification
   *
   * - `search`: Searchable fields - severity, title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `rows`: Number of rows of data per page
   *
   * - `publishedOn`: The date on which the Advisory was published
   *
   * - `page`: The page number of the response
   *
   * - `lastUpdatedDateRange`: A date range in the format of <fromDateInMillis>,<toDateInMillis>. fromDateInMillis is inclusive and toDateInMillis is exclusive. <toDateInMillis> format supported to filter advisories having lastUpdatedDateRange till particular date. Use <fromDateInMillis> format to filter advisories having lastUpdatedDateRange from a particular date.
   *
   * - `lastUpdated`: The date on which the Advisory was last updated. Currently this field in unavailable.
   *
   * - `id`: ID of the Bug
   *
   * - `fields`: Requested fields in the response. Id field is by default
   *
   * - `cdetsId`: ID of the Bug
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
   * Parameters for getCriticalBugsAssets
   */
  export interface GetCriticalBugsAssetsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * The CDET id
     */
    cdetId: Array<string>;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * Number of rows of data per page
     */
    rows?: number;

    /**
     * The page number of the response
     */
    page?: number;
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
     * Security Advisory title
     */
    title?: string;

    /**
     * State of the bugs
     */
    state?: Array<'new' | 'resolved' | 'verified' | 'duplicate' | 'closed'>;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * A serial number is a unique number used for identification
     */
    serialNumber?: Array<string>;

    /**
     * Searchable fields - severity, title. Applied only when the length of this parameter is more than 3 characters.
     */
    search?: string;

    /**
     * Number of rows of data per page
     */
    rows?: number;

    /**
     * The date on which the Advisory was published
     */
    publishedOn?: string;

    /**
     * The page number of the response
     */
    page?: number;

    /**
     * A date range in the format of <fromDateInMillis>,<toDateInMillis>. fromDateInMillis is inclusive and toDateInMillis is exclusive. <toDateInMillis> format supported to filter advisories having lastUpdatedDateRange till particular date. Use <fromDateInMillis> format to filter advisories having lastUpdatedDateRange from a particular date.
     */
    lastUpdatedDateRange?: Array<string>;

    /**
     * The date on which the Advisory was last updated. Currently this field in unavailable.
     */
    lastUpdated?: string;

    /**
     * ID of the Bug
     */
    id?: Array<string>;

    /**
     * Requested fields in the response. Id field is by default
     */
    fields?: Array<string>;

    /**
     * ID of the Bug
     */
    cdetsId?: Array<string>;
  }
}

export { DiagnosticsService }
