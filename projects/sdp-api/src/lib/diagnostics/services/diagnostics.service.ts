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
  static readonly headCriticalBugsPath = '/critical-bugs';
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
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `solution`: The solution name, should be from the enum list of values
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
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
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
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `solution`: The solution name, should be from the enum list of values
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
   * @param params The `DiagnosticsService.GetCriticalBugsStateCountParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * @return successful operation
   */
  getCriticalBugsStateCountResponse(params: DiagnosticsService.GetCriticalBugsStateCountParams): __Observable<__StrictHttpResponse<CriticalBugsCount>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
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
   * @param params The `DiagnosticsService.GetCriticalBugsStateCountParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * @return successful operation
   */
  getCriticalBugsStateCount(params: DiagnosticsService.GetCriticalBugsStateCountParams): __Observable<CriticalBugsCount> {
    return this.getCriticalBugsStateCountResponse(params).pipe(
      __map(_r => _r.body as CriticalBugsCount)
    );
  }

  /**
   * Provides details about critical bugs attached to assets
   * @param params The `DiagnosticsService.HeadCriticalBugsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `title`: Security Advisory title
   *
   * - `swVersion`: The version of the softwareType running on the device
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `severity`: Severity of the Bug
   *
   * - `search`: Searchable fields - severity, title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `publishedOn`: The date on which the Advisory was published
   *
   * - `lastUpdated`: The date on which the Advisory was last updated. Currently this field in unavailable.
   *
   * - `ipAddress`: A numerical label assigned to each device (For example, computer, printer) participating in a computer network that uses the Internet Protocol for communication
   *
   * - `hostname`: Hostnames are human-readable nicknames that correspond to the address of a device connected to a network
   */
  headCriticalBugsResponse(params: DiagnosticsService.HeadCriticalBugsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
    if (params.title != null) __params = __params.set('title', params.title.toString());
    (params.swVersion || []).forEach(val => {if (val != null) __params = __params.append('swVersion', val.toString())});
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.severity != null) __params = __params.set('severity', params.severity.toString());
    if (params.search != null) __params = __params.set('search', params.search.toString());
    if (params.publishedOn != null) __params = __params.set('publishedOn', params.publishedOn.toString());
    if (params.lastUpdated != null) __params = __params.set('lastUpdated', params.lastUpdated.toString());
    (params.ipAddress || []).forEach(val => {if (val != null) __params = __params.append('ipAddress', val.toString())});
    (params.hostname || []).forEach(val => {if (val != null) __params = __params.append('hostname', val.toString())});
    let req = new HttpRequest<any>(
      'HEAD',
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
        return _r as __StrictHttpResponse<null>;
      })
    );
  }

  /**
   * Provides details about critical bugs attached to assets
   * @param params The `DiagnosticsService.HeadCriticalBugsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `title`: Security Advisory title
   *
   * - `swVersion`: The version of the softwareType running on the device
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `severity`: Severity of the Bug
   *
   * - `search`: Searchable fields - severity, title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `publishedOn`: The date on which the Advisory was published
   *
   * - `lastUpdated`: The date on which the Advisory was last updated. Currently this field in unavailable.
   *
   * - `ipAddress`: A numerical label assigned to each device (For example, computer, printer) participating in a computer network that uses the Internet Protocol for communication
   *
   * - `hostname`: Hostnames are human-readable nicknames that correspond to the address of a device connected to a network
   */
  headCriticalBugs(params: DiagnosticsService.HeadCriticalBugsParams): __Observable<null> {
    return this.headCriticalBugsResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Provides details about critical bugs attached to assets
   * @param params The `DiagnosticsService.GetCriticalBugsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vaId`: Smart Account Identifier. This Id defines the smart account admin unique identifier
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `title`: Security Advisory title
   *
   * - `swVersion`: The version of the softwareType running on the device
   *
   * - `state`: State of the bugs
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `severity`: Severity of the Bug
   *
   * - `serialNumber`: A serial number is a unique number used for identification
   *
   * - `search`: Searchable fields - severity, title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `saId`: Smart Account Identifier. This Id defines the smart account admin unique identifier
   *
   * - `rows`: Number of rows of data per page
   *
   * - `publishedOn`: The date on which the Advisory was published
   *
   * - `page`: The page number of the response
   *
   * - `lastUpdated`: The date on which the Advisory was last updated. Currently this field in unavailable.
   *
   * - `ipAddress`: A numerical label assigned to each device (For example, computer, printer) participating in a computer network that uses the Internet Protocol for communication
   *
   * - `hostname`: Hostnames are human-readable nicknames that correspond to the address of a device connected to a network
   *
   * - `fields`: Requested fields in the response. Id field is by default
   *
   * - `cxLevel`: A customer support level
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
    (params.vaId || []).forEach(val => {if (val != null) __params = __params.append('vaId', val.toString())});
    if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
    if (params.title != null) __params = __params.set('title', params.title.toString());
    (params.swVersion || []).forEach(val => {if (val != null) __params = __params.append('swVersion', val.toString())});
    (params.state || []).forEach(val => {if (val != null) __params = __params.append('state', val.toString())});
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.severity != null) __params = __params.set('severity', params.severity.toString());
    (params.serialNumber || []).forEach(val => {if (val != null) __params = __params.append('serialNumber', val.toString())});
    if (params.search != null) __params = __params.set('search', params.search.toString());
    if (params.saId != null) __params = __params.set('saId', params.saId.toString());
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.publishedOn != null) __params = __params.set('publishedOn', params.publishedOn.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    if (params.lastUpdated != null) __params = __params.set('lastUpdated', params.lastUpdated.toString());
    (params.ipAddress || []).forEach(val => {if (val != null) __params = __params.append('ipAddress', val.toString())});
    (params.hostname || []).forEach(val => {if (val != null) __params = __params.append('hostname', val.toString())});
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    if (params.cxLevel != null) __params = __params.set('cxLevel', params.cxLevel.toString());
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
   * - `vaId`: Smart Account Identifier. This Id defines the smart account admin unique identifier
   *
   * - `useCase`: Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
   *
   * - `title`: Security Advisory title
   *
   * - `swVersion`: The version of the softwareType running on the device
   *
   * - `state`: State of the bugs
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `solution`: The solution name, should be from the enum list of values
   *
   * - `severity`: Severity of the Bug
   *
   * - `serialNumber`: A serial number is a unique number used for identification
   *
   * - `search`: Searchable fields - severity, title. Applied only when the length of this parameter is more than 3 characters.
   *
   * - `saId`: Smart Account Identifier. This Id defines the smart account admin unique identifier
   *
   * - `rows`: Number of rows of data per page
   *
   * - `publishedOn`: The date on which the Advisory was published
   *
   * - `page`: The page number of the response
   *
   * - `lastUpdated`: The date on which the Advisory was last updated. Currently this field in unavailable.
   *
   * - `ipAddress`: A numerical label assigned to each device (For example, computer, printer) participating in a computer network that uses the Internet Protocol for communication
   *
   * - `hostname`: Hostnames are human-readable nicknames that correspond to the address of a device connected to a network
   *
   * - `fields`: Requested fields in the response. Id field is by default
   *
   * - `cxLevel`: A customer support level
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
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;

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
   * Parameters for getCriticalBugsStateCount
   */
  export interface GetCriticalBugsStateCountParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;
  }

  /**
   * Parameters for headCriticalBugs
   */
  export interface HeadCriticalBugsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * Security Advisory title
     */
    title?: string;

    /**
     * The version of the softwareType running on the device
     */
    swVersion?: Array<string>;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;

    /**
     * Severity of the Bug
     */
    severity?: 'notice' | 'info' | 'warning' | 'ok' | 'error' | 'high' | 'low' | 'critical';

    /**
     * Searchable fields - severity, title. Applied only when the length of this parameter is more than 3 characters.
     */
    search?: string;

    /**
     * The date on which the Advisory was published
     */
    publishedOn?: string;

    /**
     * The date on which the Advisory was last updated. Currently this field in unavailable.
     */
    lastUpdated?: string;

    /**
     * A numerical label assigned to each device (For example, computer, printer) participating in a computer network that uses the Internet Protocol for communication
     */
    ipAddress?: Array<string>;

    /**
     * Hostnames are human-readable nicknames that correspond to the address of a device connected to a network
     */
    hostname?: Array<string>;
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
     * Smart Account Identifier. This Id defines the smart account admin unique identifier
     */
    vaId?: Array<number>;

    /**
     * Usecase value could be as exact or in values ( network-assurance | device-onboarding | sw-image-management | network-segmentation | access-policy )
     */
    useCase?: string;

    /**
     * Security Advisory title
     */
    title?: string;

    /**
     * The version of the softwareType running on the device
     */
    swVersion?: Array<string>;

    /**
     * State of the bugs
     */
    state?: Array<'new' | 'resolved' | 'verified' | 'duplicate' | 'closed'>;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * The solution name, should be from the enum list of values
     */
    solution?: string;

    /**
     * Severity of the Bug
     */
    severity?: 'notice' | 'info' | 'warning' | 'ok' | 'error' | 'high' | 'low' | 'critical';

    /**
     * A serial number is a unique number used for identification
     */
    serialNumber?: Array<string>;

    /**
     * Searchable fields - severity, title. Applied only when the length of this parameter is more than 3 characters.
     */
    search?: string;

    /**
     * Smart Account Identifier. This Id defines the smart account admin unique identifier
     */
    saId?: number;

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
     * The date on which the Advisory was last updated. Currently this field in unavailable.
     */
    lastUpdated?: string;

    /**
     * A numerical label assigned to each device (For example, computer, printer) participating in a computer network that uses the Internet Protocol for communication
     */
    ipAddress?: Array<string>;

    /**
     * Hostnames are human-readable nicknames that correspond to the address of a device connected to a network
     */
    hostname?: Array<string>;

    /**
     * Requested fields in the response. Id field is by default
     */
    fields?: Array<string>;

    /**
     * A customer support level
     */
    cxLevel?: string;

    /**
     * ID of the Bug
     */
    cdetsId?: Array<string>;
  }
}

export { DiagnosticsService }
