/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ProductAlertsConfiguration as __Configuration } from '../product-alerts-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { VulnerabilityResponse } from '../models/vulnerability-response';
import { SecurityAdvisoryResponse } from '../models/security-advisory-response';
import { SecurityAdvisorySummary } from '../models/security-advisory-summary';
import { SecurityAdvisoryBulletinResponse } from '../models/security-advisory-bulletin-response';
import { FieldNoticeResponse } from '../models/field-notice-response';
import { FieldNoticeBulletinResponse } from '../models/field-notice-bulletin-response';
import { HardwareEOLResponse } from '../models/hardware-eolresponse';
import { HardwareEOLBulletinResponse } from '../models/hardware-eolbulletin-response';
import { SoftwareEOLResponse } from '../models/software-eolresponse';
import { SofwareEOLBulletinResponse } from '../models/sofware-eolbulletin-response';
@Injectable({
  providedIn: 'root',
})
class ProductAlertsService extends __BaseService {
  static readonly getVulnerabilityCountsPath = '/vulnerabilities/count';
  static readonly headSecurityAdvisoriesPath = '/security-advisories';
  static readonly getSecurityAdvisoriesPath = '/security-advisories';
  static readonly getSecurityAdvisorySummaryPath = '/security-advisories/summary';
  static readonly getSecurityAdvisoryListPath = '/security-advisories/list';
  static readonly headSecurityAdvisoryBulletinsPath = '/security-advisory-bulletins';
  static readonly getPSIRTBulletinPath = '/security-advisory-bulletins';
  static readonly headFieldNoticesPath = '/field-notices';
  static readonly getFieldNoticePath = '/field-notices';
  static readonly headFieldNoticeBulletinsPath = '/field-notice-bulletins';
  static readonly getFieldNoticeBulletinPath = '/field-notice-bulletins';
  static readonly headHardwareEolPath = '/hardware-eol';
  static readonly getHardwareEoxPath = '/hardware-eol';
  static readonly headHardwareEolBulletinsPath = '/hardware-eol-bulletins';
  static readonly getHardwareEoxBulletinPath = '/hardware-eol-bulletins';
  static readonly headSoftwareEolPath = '/software-eol';
  static readonly getSoftwareEoxPath = '/software-eol';
  static readonly headSoftwareEolBulletinsPath = '/software-eol-bulletins';
  static readonly getSoftwareEoxBulletinPath = '/software-eol-bulletins';
  static readonly getTopSecurityAdvisoriesPath = '/security-advisories/top';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * The Vulnerabilities count API retrieves counts for product vulnerabilities. This includes counts for security advisories, field notices, and bugs.
   * @param params The `ProductAlertsService.GetVulnerabilityCountsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `serialNumber`: The recognized/validated Serial Number
   *
   * @return successful operation
   */
  getVulnerabilityCountsResponse(params: ProductAlertsService.GetVulnerabilityCountsParams): __Observable<__StrictHttpResponse<VulnerabilityResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.serialNumber || []).forEach(val => {if (val != null) __params = __params.append('serialNumber', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/product-alerts/v1/vulnerabilities/count`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<VulnerabilityResponse>;
      })
    );
  }

  /**
   * The Vulnerabilities count API retrieves counts for product vulnerabilities. This includes counts for security advisories, field notices, and bugs.
   * @param params The `ProductAlertsService.GetVulnerabilityCountsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `serialNumber`: The recognized/validated Serial Number
   *
   * @return successful operation
   */
  getVulnerabilityCounts(params: ProductAlertsService.GetVulnerabilityCountsParams): __Observable<VulnerabilityResponse> {
    return this.getVulnerabilityCountsResponse(params).pipe(
      __map(_r => _r.body as VulnerabilityResponse)
    );
  }

  /**
   * Fetches meta information about the security-advisories API.
   * @param customerId Unique identifier of a Cisco customer.
   */
  headSecurityAdvisoriesResponse(customerId: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (customerId != null) __params = __params.set('customerId', customerId.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/api/customerportal/product-alerts/v1/security-advisories`,
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
   * Fetches meta information about the security-advisories API.
   * @param customerId Unique identifier of a Cisco customer.
   */
  headSecurityAdvisories(customerId: string): __Observable<null> {
    return this.headSecurityAdvisoriesResponse(customerId).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * The Security Advisories API retrieves security vulnerability information along with Common Vulnerability and Exposure (CVE) identifiers, and Common Vulnerability Scoring System (CVSS) for devices associated with customer ID. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain security advisory information for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetSecurityAdvisoriesParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vulnerabilityStatus`: The vulnerability status of a Network element.For Example:- Vulnerable, Potentially Vulnerable, and Not Vulnerable.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `neInstanceId`: CDX should provide a way to uniquely identify IB records, regardless of non-unique or invalid vendor-supplied identity strings
   *
   * - `managedNeId`: CDX should indicate the physical|logical hierarchy of the product (chassis to card, server to client, etc
   *
   * - `fields`: Requested fields in the response.
   *
   * - `advisoryId`: Internally generated ID for a security advisory
   *
   * @return successful operation
   */
  getSecurityAdvisoriesResponse(params: ProductAlertsService.GetSecurityAdvisoriesParams): __Observable<__StrictHttpResponse<SecurityAdvisoryResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.vulnerabilityStatus || []).forEach(val => {if (val != null) __params = __params.append('vulnerabilityStatus', val.toString())});
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.neInstanceId || []).forEach(val => {if (val != null) __params = __params.append('neInstanceId', val.toString())});
    (params.managedNeId || []).forEach(val => {if (val != null) __params = __params.append('managedNeId', val.toString())});
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    (params.advisoryId || []).forEach(val => {if (val != null) __params = __params.append('advisoryId', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/product-alerts/v1/security-advisories`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SecurityAdvisoryResponse>;
      })
    );
  }

  /**
   * The Security Advisories API retrieves security vulnerability information along with Common Vulnerability and Exposure (CVE) identifiers, and Common Vulnerability Scoring System (CVSS) for devices associated with customer ID. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain security advisory information for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetSecurityAdvisoriesParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vulnerabilityStatus`: The vulnerability status of a Network element.For Example:- Vulnerable, Potentially Vulnerable, and Not Vulnerable.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `neInstanceId`: CDX should provide a way to uniquely identify IB records, regardless of non-unique or invalid vendor-supplied identity strings
   *
   * - `managedNeId`: CDX should indicate the physical|logical hierarchy of the product (chassis to card, server to client, etc
   *
   * - `fields`: Requested fields in the response.
   *
   * - `advisoryId`: Internally generated ID for a security advisory
   *
   * @return successful operation
   */
  getSecurityAdvisories(params: ProductAlertsService.GetSecurityAdvisoriesParams): __Observable<SecurityAdvisoryResponse> {
    return this.getSecurityAdvisoriesResponse(params).pipe(
      __map(_r => _r.body as SecurityAdvisoryResponse)
    );
  }

  /**
   * Generates the total number of security advisoeries and the count by severity
   * @param customerId Unique identifier of a Cisco customer.
   * @return OK
   */
  getSecurityAdvisorySummaryResponse(customerId: string): __Observable<__StrictHttpResponse<SecurityAdvisorySummary>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (customerId != null) __params = __params.set('customerId', customerId.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/product-alerts/v1/security-advisories/summary`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SecurityAdvisorySummary>;
      })
    );
  }

  /**
   * Generates the total number of security advisoeries and the count by severity
   * @param customerId Unique identifier of a Cisco customer.
   * @return OK
   */
  getSecurityAdvisorySummary(customerId: string): __Observable<SecurityAdvisorySummary> {
    return this.getSecurityAdvisorySummaryResponse(customerId).pipe(
      __map(_r => _r.body as SecurityAdvisorySummary)
    );
  }

  /**
   * Generates the total number of security advisoeries and the count by severity
   * @param params The `ProductAlertsService.GetSecurityAdvisoryListParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * @return OK
   */
  getSecurityAdvisoryListResponse(params: ProductAlertsService.GetSecurityAdvisoryListParams): __Observable<__StrictHttpResponse<SecurityAdvisoryResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/product-alerts/v1/security-advisories/list`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SecurityAdvisoryResponse>;
      })
    );
  }

  /**
   * Generates the total number of security advisoeries and the count by severity
   * @param params The `ProductAlertsService.GetSecurityAdvisoryListParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * @return OK
   */
  getSecurityAdvisoryList(params: ProductAlertsService.GetSecurityAdvisoryListParams): __Observable<SecurityAdvisoryResponse> {
    return this.getSecurityAdvisoryListResponse(params).pipe(
      __map(_r => _r.body as SecurityAdvisoryResponse)
    );
  }

  /**
   * Fetches meta information about the security-advisories API.
   * @param params The `ProductAlertsService.HeadSecurityAdvisoryBulletinsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `rows`: Number of rows of data per page.
   */
  headSecurityAdvisoryBulletinsResponse(params: ProductAlertsService.HeadSecurityAdvisoryBulletinsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/api/customerportal/product-alerts/v1/security-advisory-bulletins`,
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
   * Fetches meta information about the security-advisories API.
   * @param params The `ProductAlertsService.HeadSecurityAdvisoryBulletinsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `rows`: Number of rows of data per page.
   */
  headSecurityAdvisoryBulletins(params: ProductAlertsService.HeadSecurityAdvisoryBulletinsParams): __Observable<null> {
    return this.headSecurityAdvisoryBulletinsResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * The security-advisory-bulletins API retrieves security advisory bulletin details for one or more security advisory IDs associated with the devices. All request parameters are optional.
   * If no security advisory ID is provided in the request, the response will contain security advisory bulletin information of all active security advisories.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetPSIRTBulletinParams` containing the following parameters:
   *
   * - `X-CSI-CCOID`: X-CSI-CCOID
   *
   * - `Authorization`:
   *
   * - `sort`: ASC (ascending) or DESC (descending)
   *
   * - `severity`: Severity
   *
   * - `securityImpactRating`: The Security Impact Rating (SIR) for Cisco Security Advisories
   *
   * - `securityAdvisoryInstanceId`: Internally generated ID for a security advisory.
   *
   * - `rows`: Number of rows of data per page
   *
   * - `publicReleaseIndicator`: Public Release Indicator
   *
   * - `page`: The page number of the response
   *
   * - `fields`: Receive only requested fields in the response
   *
   * - `cvssTemporalScore`: Common Vulnerability Scoring System (CVSS) Temporal Score
   *
   * - `cvssBaseScore`: Common Vulnerability Scoring System (CVSS) Base Score
   *
   * - `alertStatusCode`: Alert Status Code
   *
   * - `advisoryId`: Published identifier of security advisory.
   *
   * @return successful operation
   */
  getPSIRTBulletinResponse(params: ProductAlertsService.GetPSIRTBulletinParams): __Observable<__StrictHttpResponse<SecurityAdvisoryBulletinResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.XCSICCOID != null) __headers = __headers.set('X-CSI-CCOID', params.XCSICCOID.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    (params.severity || []).forEach(val => {if (val != null) __params = __params.append('severity', val.toString())});
    (params.securityImpactRating || []).forEach(val => {if (val != null) __params = __params.append('securityImpactRating', val.toString())});
    (params.securityAdvisoryInstanceId || []).forEach(val => {if (val != null) __params = __params.append('securityAdvisoryInstanceId', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    (params.publicReleaseIndicator || []).forEach(val => {if (val != null) __params = __params.append('publicReleaseIndicator', val.toString())});
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    (params.cvssTemporalScore || []).forEach(val => {if (val != null) __params = __params.append('cvssTemporalScore', val.toString())});
    (params.cvssBaseScore || []).forEach(val => {if (val != null) __params = __params.append('cvssBaseScore', val.toString())});
    (params.alertStatusCode || []).forEach(val => {if (val != null) __params = __params.append('alertStatusCode', val.toString())});
    (params.advisoryId || []).forEach(val => {if (val != null) __params = __params.append('advisoryId', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/product-alerts/v1/security-advisory-bulletins`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SecurityAdvisoryBulletinResponse>;
      })
    );
  }

  /**
   * The security-advisory-bulletins API retrieves security advisory bulletin details for one or more security advisory IDs associated with the devices. All request parameters are optional.
   * If no security advisory ID is provided in the request, the response will contain security advisory bulletin information of all active security advisories.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetPSIRTBulletinParams` containing the following parameters:
   *
   * - `X-CSI-CCOID`: X-CSI-CCOID
   *
   * - `Authorization`:
   *
   * - `sort`: ASC (ascending) or DESC (descending)
   *
   * - `severity`: Severity
   *
   * - `securityImpactRating`: The Security Impact Rating (SIR) for Cisco Security Advisories
   *
   * - `securityAdvisoryInstanceId`: Internally generated ID for a security advisory.
   *
   * - `rows`: Number of rows of data per page
   *
   * - `publicReleaseIndicator`: Public Release Indicator
   *
   * - `page`: The page number of the response
   *
   * - `fields`: Receive only requested fields in the response
   *
   * - `cvssTemporalScore`: Common Vulnerability Scoring System (CVSS) Temporal Score
   *
   * - `cvssBaseScore`: Common Vulnerability Scoring System (CVSS) Base Score
   *
   * - `alertStatusCode`: Alert Status Code
   *
   * - `advisoryId`: Published identifier of security advisory.
   *
   * @return successful operation
   */
  getPSIRTBulletin(params: ProductAlertsService.GetPSIRTBulletinParams): __Observable<SecurityAdvisoryBulletinResponse> {
    return this.getPSIRTBulletinResponse(params).pipe(
      __map(_r => _r.body as SecurityAdvisoryBulletinResponse)
    );
  }

  /**
   * Fetches meta information about the field-notices API.
   * @param customerId Unique identifier of a Cisco customer.
   */
  headFieldNoticesResponse(customerId: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (customerId != null) __params = __params.set('customerId', customerId.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/api/customerportal/product-alerts/v1/field-notices`,
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
   * Fetches meta information about the field-notices API.
   * @param customerId Unique identifier of a Cisco customer.
   */
  headFieldNotices(customerId: string): __Observable<null> {
    return this.headFieldNoticesResponse(customerId).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * The Field Notices API retrieves all active field notices vulnerability details on devices associated with a customer ID. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain field notices information for all device IDs associated with the customer.
   * This API supports filtering, pagination and sorting. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetFieldNoticeParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vulnerabilityStatus`: The vulnerability status of a Network element. For Example:- Vulnerable, Potentially Vulnerable, and Not Vulnerable.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `serialNumber`: The recognized/validated Serial Number
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `neInstanceId`: CDX should provide a way to uniquely identify IB records, regardless of non-unique or invalid vendor-supplied identity strings
   *
   * - `managedNeId`: CDX should indicate the physical|logical hierarchy of the product (chassis to card, server to client, etc
   *
   * - `fields`: Requested fields in the response.
   *
   * @return successful operation
   */
  getFieldNoticeResponse(params: ProductAlertsService.GetFieldNoticeParams): __Observable<__StrictHttpResponse<FieldNoticeResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.vulnerabilityStatus || []).forEach(val => {if (val != null) __params = __params.append('vulnerabilityStatus', val.toString())});
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    (params.serialNumber || []).forEach(val => {if (val != null) __params = __params.append('serialNumber', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.neInstanceId || []).forEach(val => {if (val != null) __params = __params.append('neInstanceId', val.toString())});
    (params.managedNeId || []).forEach(val => {if (val != null) __params = __params.append('managedNeId', val.toString())});
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/product-alerts/v1/field-notices`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<FieldNoticeResponse>;
      })
    );
  }

  /**
   * The Field Notices API retrieves all active field notices vulnerability details on devices associated with a customer ID. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain field notices information for all device IDs associated with the customer.
   * This API supports filtering, pagination and sorting. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetFieldNoticeParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `vulnerabilityStatus`: The vulnerability status of a Network element. For Example:- Vulnerable, Potentially Vulnerable, and Not Vulnerable.
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `serialNumber`: The recognized/validated Serial Number
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `neInstanceId`: CDX should provide a way to uniquely identify IB records, regardless of non-unique or invalid vendor-supplied identity strings
   *
   * - `managedNeId`: CDX should indicate the physical|logical hierarchy of the product (chassis to card, server to client, etc
   *
   * - `fields`: Requested fields in the response.
   *
   * @return successful operation
   */
  getFieldNotice(params: ProductAlertsService.GetFieldNoticeParams): __Observable<FieldNoticeResponse> {
    return this.getFieldNoticeResponse(params).pipe(
      __map(_r => _r.body as FieldNoticeResponse)
    );
  }

  /**
   * Fetches meta information about the field notices API.
   * @param params The `ProductAlertsService.HeadFieldNoticeBulletinsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `rows`: Number of rows of data per page.
   */
  headFieldNoticeBulletinsResponse(params: ProductAlertsService.HeadFieldNoticeBulletinsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/api/customerportal/product-alerts/v1/field-notice-bulletins`,
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
   * Fetches meta information about the field notices API.
   * @param params The `ProductAlertsService.HeadFieldNoticeBulletinsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `rows`: Number of rows of data per page.
   */
  headFieldNoticeBulletins(params: ProductAlertsService.HeadFieldNoticeBulletinsParams): __Observable<null> {
    return this.headFieldNoticeBulletinsResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * The field-notice-bulletins API retrieves field notice bulletin details for one or more field notice ID associated with the devices. All request parameters are optional.
   * If no device ID is provided in the request, the response will contain field notice bulletin information of all field notices for device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetFieldNoticeBulletinParams` containing the following parameters:
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * - `fieldNoticeTypeCode`: FieldNotice Type Code
   *
   * - `fieldNoticeId`: The Cisco.com bulletin number for Field Notices
   *
   * - `distributionCode`: Distribution Code
   *
   * - `bulletinFirstPublished`: Date when the bulletin was first published to Cisco.com.
   *
   * @return successful operation
   */
  getFieldNoticeBulletinResponse(params: ProductAlertsService.GetFieldNoticeBulletinParams): __Observable<__StrictHttpResponse<FieldNoticeBulletinResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    (params.fieldNoticeTypeCode || []).forEach(val => {if (val != null) __params = __params.append('fieldNoticeTypeCode', val.toString())});
    (params.fieldNoticeId || []).forEach(val => {if (val != null) __params = __params.append('fieldNoticeId', val.toString())});
    (params.distributionCode || []).forEach(val => {if (val != null) __params = __params.append('distributionCode', val.toString())});
    if (params.bulletinFirstPublished != null) __params = __params.set('bulletinFirstPublished', params.bulletinFirstPublished.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/product-alerts/v1/field-notice-bulletins`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<FieldNoticeBulletinResponse>;
      })
    );
  }

  /**
   * The field-notice-bulletins API retrieves field notice bulletin details for one or more field notice ID associated with the devices. All request parameters are optional.
   * If no device ID is provided in the request, the response will contain field notice bulletin information of all field notices for device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetFieldNoticeBulletinParams` containing the following parameters:
   *
   * - `sort`: Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
   *
   * - `rows`: Number of rows of data per page.
   *
   * - `page`: Page number of the response
   *
   * - `fields`: Requested fields in the response.
   *
   * - `fieldNoticeTypeCode`: FieldNotice Type Code
   *
   * - `fieldNoticeId`: The Cisco.com bulletin number for Field Notices
   *
   * - `distributionCode`: Distribution Code
   *
   * - `bulletinFirstPublished`: Date when the bulletin was first published to Cisco.com.
   *
   * @return successful operation
   */
  getFieldNoticeBulletin(params: ProductAlertsService.GetFieldNoticeBulletinParams): __Observable<FieldNoticeBulletinResponse> {
    return this.getFieldNoticeBulletinResponse(params).pipe(
      __map(_r => _r.body as FieldNoticeBulletinResponse)
    );
  }

  /**
   * Fetches meta information about the hardware-eol API.
   * @param customerId Unique identifier of a Cisco customer.
   */
  headHardwareEolResponse(customerId: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (customerId != null) __params = __params.set('customerId', customerId.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/api/customerportal/product-alerts/v1/hardware-eol`,
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
   * Fetches meta information about the hardware-eol API.
   * @param customerId Unique identifier of a Cisco customer.
   */
  headHardwareEol(customerId: string): __Observable<null> {
    return this.headHardwareEolResponse(customerId).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * The Hardware End-Of-Life API retrieves end of life details for a specific hardware device. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain end of life information for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetHardwareEoxParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: ASC (ascending) or DESC (descending)
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * - `neInstanceId`: The unique, generated ID of the network element
   *
   * - `managedNeId`: The unique, generated ID of the network element
   *
   * - `fields`: Receive only requested fields in the response
   *
   * @return successful operation
   */
  getHardwareEoxResponse(params: ProductAlertsService.GetHardwareEoxParams): __Observable<__StrictHttpResponse<HardwareEOLResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.neInstanceId || []).forEach(val => {if (val != null) __params = __params.append('neInstanceId', val.toString())});
    (params.managedNeId || []).forEach(val => {if (val != null) __params = __params.append('managedNeId', val.toString())});
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/product-alerts/v1/hardware-eol`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<HardwareEOLResponse>;
      })
    );
  }

  /**
   * The Hardware End-Of-Life API retrieves end of life details for a specific hardware device. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain end of life information for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetHardwareEoxParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: ASC (ascending) or DESC (descending)
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * - `neInstanceId`: The unique, generated ID of the network element
   *
   * - `managedNeId`: The unique, generated ID of the network element
   *
   * - `fields`: Receive only requested fields in the response
   *
   * @return successful operation
   */
  getHardwareEox(params: ProductAlertsService.GetHardwareEoxParams): __Observable<HardwareEOLResponse> {
    return this.getHardwareEoxResponse(params).pipe(
      __map(_r => _r.body as HardwareEOLResponse)
    );
  }

  /**
   * Fetches meta information about the HW EOL Bulletins API.
   * @param params The `ProductAlertsService.HeadHardwareEolBulletinsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `rows`: Number of rows of data per page.
   */
  headHardwareEolBulletinsResponse(params: ProductAlertsService.HeadHardwareEolBulletinsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/api/customerportal/product-alerts/v1/hardware-eol-bulletins`,
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
   * Fetches meta information about the HW EOL Bulletins API.
   * @param params The `ProductAlertsService.HeadHardwareEolBulletinsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `rows`: Number of rows of data per page.
   */
  headHardwareEolBulletins(params: ProductAlertsService.HeadHardwareEolBulletinsParams): __Observable<null> {
    return this.headHardwareEolBulletinsResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * The hardware-eol-bulletins API retrieves end of life bulletin details for specific hardware device based on the hardware end of life ID associated with the devices. All request parameters are optional.
   * If no hardware end of life ID is provided in the request, the response will contain end of life bulletin information on all hardware end of life and for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetHardwareEoxBulletinParams` containing the following parameters:
   *
   * - `sort`: ASC (ascending) or DESC (decending)
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * - `lastShipDate`: The last-possible ship date that can be requested of Cisco and/or its contract manufacturers. Actual ship date is dependent on lead time. GMT date format YYYY-MM-DD
   *
   * - `lastDateOfSupport`: The last date to receive applicable service and support for the product as entitled by active service contracts or by warranty terms and conditions. After this date, all support services for the product are unavailable, and the product becomes obsolete. GMT date format YYYY-MM-DD
   *
   * - `hwEolInstanceId`: The unique identifier for hardware end-of-life entry in a data store.
   *
   * - `fields`: Receive only requested fields in the response
   *
   * - `eoSwMaintenanceReleasesDate`: The last date that Cisco Engineering may release any final software maintenance releases or bug fixes. After this date, Cisco Engineering will no longer develop, repair, maintain, or test the product software. GMT date format YYYY-MM-DD
   *
   * - `eoServiceContractRenewalDate`: The last date to extend or renew a service contract for the product. GMT date format YYYY-MM-DD
   *
   * - `eoSaleDate`: The last date to order the product through Cisco point-of-sale mechanisms. The product is no longer for sale after this date. GMT date format YYYY-MM-DD
   *
   * - `eoRoutineFailureAnalysisDate`: The last-possible date a routine failure analysis may be performed to determine the cause of hardware product failure or defect. GMT date format YYYY-MM-DD
   *
   * - `eoNewServiceAttachmentDate`: For equipment and software that is not covered by a service-and-support contract, this is the last date to order a new service-and-support contract or add the equipment and/or software to an existing service-and-support contract. GMT date format YYYY-MM-DD
   *
   * - `eoLifeAnnouncementDate`: The date the document that announces the end-of-sale and end-of-life of a product is distributed to the general public. GMT date format YYYY-MM-DD
   *
   * - `bulletinProductId`: Cisco product published at the time of EOL announcement.
   *
   * - `bulletinNumber`: The Cisco.com bulletin number for an End-of-Life bulletin and Field Notices.
   *
   * @return successful operation
   */
  getHardwareEoxBulletinResponse(params: ProductAlertsService.GetHardwareEoxBulletinParams): __Observable<__StrictHttpResponse<HardwareEOLBulletinResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    if (params.lastShipDate != null) __params = __params.set('lastShipDate', params.lastShipDate.toString());
    if (params.lastDateOfSupport != null) __params = __params.set('lastDateOfSupport', params.lastDateOfSupport.toString());
    (params.hwEolInstanceId || []).forEach(val => {if (val != null) __params = __params.append('hwEolInstanceId', val.toString())});
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    if (params.eoSwMaintenanceReleasesDate != null) __params = __params.set('eoSwMaintenanceReleasesDate', params.eoSwMaintenanceReleasesDate.toString());
    if (params.eoServiceContractRenewalDate != null) __params = __params.set('eoServiceContractRenewalDate', params.eoServiceContractRenewalDate.toString());
    if (params.eoSaleDate != null) __params = __params.set('eoSaleDate', params.eoSaleDate.toString());
    if (params.eoRoutineFailureAnalysisDate != null) __params = __params.set('eoRoutineFailureAnalysisDate', params.eoRoutineFailureAnalysisDate.toString());
    if (params.eoNewServiceAttachmentDate != null) __params = __params.set('eoNewServiceAttachmentDate', params.eoNewServiceAttachmentDate.toString());
    if (params.eoLifeAnnouncementDate != null) __params = __params.set('eoLifeAnnouncementDate', params.eoLifeAnnouncementDate.toString());
    (params.bulletinProductId || []).forEach(val => {if (val != null) __params = __params.append('bulletinProductId', val.toString())});
    (params.bulletinNumber || []).forEach(val => {if (val != null) __params = __params.append('bulletinNumber', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/product-alerts/v1/hardware-eol-bulletins`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<HardwareEOLBulletinResponse>;
      })
    );
  }

  /**
   * The hardware-eol-bulletins API retrieves end of life bulletin details for specific hardware device based on the hardware end of life ID associated with the devices. All request parameters are optional.
   * If no hardware end of life ID is provided in the request, the response will contain end of life bulletin information on all hardware end of life and for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetHardwareEoxBulletinParams` containing the following parameters:
   *
   * - `sort`: ASC (ascending) or DESC (decending)
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * - `lastShipDate`: The last-possible ship date that can be requested of Cisco and/or its contract manufacturers. Actual ship date is dependent on lead time. GMT date format YYYY-MM-DD
   *
   * - `lastDateOfSupport`: The last date to receive applicable service and support for the product as entitled by active service contracts or by warranty terms and conditions. After this date, all support services for the product are unavailable, and the product becomes obsolete. GMT date format YYYY-MM-DD
   *
   * - `hwEolInstanceId`: The unique identifier for hardware end-of-life entry in a data store.
   *
   * - `fields`: Receive only requested fields in the response
   *
   * - `eoSwMaintenanceReleasesDate`: The last date that Cisco Engineering may release any final software maintenance releases or bug fixes. After this date, Cisco Engineering will no longer develop, repair, maintain, or test the product software. GMT date format YYYY-MM-DD
   *
   * - `eoServiceContractRenewalDate`: The last date to extend or renew a service contract for the product. GMT date format YYYY-MM-DD
   *
   * - `eoSaleDate`: The last date to order the product through Cisco point-of-sale mechanisms. The product is no longer for sale after this date. GMT date format YYYY-MM-DD
   *
   * - `eoRoutineFailureAnalysisDate`: The last-possible date a routine failure analysis may be performed to determine the cause of hardware product failure or defect. GMT date format YYYY-MM-DD
   *
   * - `eoNewServiceAttachmentDate`: For equipment and software that is not covered by a service-and-support contract, this is the last date to order a new service-and-support contract or add the equipment and/or software to an existing service-and-support contract. GMT date format YYYY-MM-DD
   *
   * - `eoLifeAnnouncementDate`: The date the document that announces the end-of-sale and end-of-life of a product is distributed to the general public. GMT date format YYYY-MM-DD
   *
   * - `bulletinProductId`: Cisco product published at the time of EOL announcement.
   *
   * - `bulletinNumber`: The Cisco.com bulletin number for an End-of-Life bulletin and Field Notices.
   *
   * @return successful operation
   */
  getHardwareEoxBulletin(params: ProductAlertsService.GetHardwareEoxBulletinParams): __Observable<HardwareEOLBulletinResponse> {
    return this.getHardwareEoxBulletinResponse(params).pipe(
      __map(_r => _r.body as HardwareEOLBulletinResponse)
    );
  }

  /**
   * Fetches meta information about the software-eol API.
   * @param customerId Unique identifier of a Cisco customer.
   */
  headSoftwareEolResponse(customerId: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (customerId != null) __params = __params.set('customerId', customerId.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/api/customerportal/product-alerts/v1/software-eol`,
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
   * Fetches meta information about the software-eol API.
   * @param customerId Unique identifier of a Cisco customer.
   */
  headSoftwareEol(customerId: string): __Observable<null> {
    return this.headSoftwareEolResponse(customerId).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * The Software End-Of-Life API retrieves system software end of life details for a specific hardware device. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain system software end of life information for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetSoftwareEoxParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: ASC (ascending) or DESC (descending)
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * - `neInstanceId`: The unique, generated ID of the network element
   *
   * - `managedNeId`: The unique, generated ID of the network element.
   *
   * - `fields`: Receive only requested fields in the response
   *
   * @return successful operation
   */
  getSoftwareEoxResponse(params: ProductAlertsService.GetSoftwareEoxParams): __Observable<__StrictHttpResponse<SoftwareEOLResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    (params.neInstanceId || []).forEach(val => {if (val != null) __params = __params.append('neInstanceId', val.toString())});
    (params.managedNeId || []).forEach(val => {if (val != null) __params = __params.append('managedNeId', val.toString())});
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/product-alerts/v1/software-eol`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SoftwareEOLResponse>;
      })
    );
  }

  /**
   * The Software End-Of-Life API retrieves system software end of life details for a specific hardware device. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain system software end of life information for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetSoftwareEoxParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: ASC (ascending) or DESC (descending)
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * - `neInstanceId`: The unique, generated ID of the network element
   *
   * - `managedNeId`: The unique, generated ID of the network element.
   *
   * - `fields`: Receive only requested fields in the response
   *
   * @return successful operation
   */
  getSoftwareEox(params: ProductAlertsService.GetSoftwareEoxParams): __Observable<SoftwareEOLResponse> {
    return this.getSoftwareEoxResponse(params).pipe(
      __map(_r => _r.body as SoftwareEOLResponse)
    );
  }

  /**
   * Fetches meta information about the SW EOL bulletins API.
   * @param params The `ProductAlertsService.HeadSoftwareEolBulletinsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `rows`: Number of rows of data per page.
   */
  headSoftwareEolBulletinsResponse(params: ProductAlertsService.HeadSoftwareEolBulletinsParams): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    let req = new HttpRequest<any>(
      'HEAD',
      this.rootUrl + `/api/customerportal/product-alerts/v1/software-eol-bulletins`,
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
   * Fetches meta information about the SW EOL bulletins API.
   * @param params The `ProductAlertsService.HeadSoftwareEolBulletinsParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `rows`: Number of rows of data per page.
   */
  headSoftwareEolBulletins(params: ProductAlertsService.HeadSoftwareEolBulletinsParams): __Observable<null> {
    return this.headSoftwareEolBulletinsResponse(params).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * The software-eol-bulletin API retrieves end of life bulleting details for specific hardware device based on the software end of life ID associated with the devices. All request parameters are optional.
   * If no software end of life ID is provided in the request, the response will contain end of life bulleting information of all software end of life and for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetSoftwareEoxBulletinParams` containing the following parameters:
   *
   * - `swEolInstanceId`: The unique identifier for software end-of-life entry in a data store.
   *
   * - `sort`: ASC (ascending) or DESC (decending)
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * - `lastShipDate`: The last-possible ship date that can be requested of Cisco and/or its contract manufacturers. Actual ship date is dependent on lead time. GMT date format YYYY-MM-DD
   *
   * - `lastDateOfSupport`: The last date to receive applicable service and support for the product as entitled by active service contracts or by warranty terms and conditions. After this date, all support services for the product are unavailable, and the product becomes obsolete. GMT date format YYYY-MM-DD
   *
   * - `fields`: Receive only requested fields in the response
   *
   * - `eoVulnerabilitySecuritySupport`: The last date that Cisco Engineering may release a planned maintenance release or scheduled software remedy for a security vulnerability issue. GMT date format YYYY-MM-DD
   *
   * - `eoSwMaintenanceReleasesDate`: The last date that Cisco Engineering may release any final software maintenance releases or bug fixes. After this date, Cisco Engineering will no longer develop, repair, maintain, or test the product software. GMT date format YYYY-MM-DD
   *
   * - `eoServiceContractRenewalDate`: The last date to extend or renew a service contract for the product. GMT date format YYYY-MM-DD
   *
   * - `eoSaleDate`: The last date to order the product through Cisco point-of-sale mechanisms. The product is no longer for sale after this date. GMT date format YYYY-MM-DD
   *
   * - `eoRoutineFailureAnalysisDate`: The last-possible date a routine failure analysis may be performed to determine the cause of hardware product failure or defect. GMT date format YYYY-MM-DD
   *
   * - `eoNewServiceAttachmentDate`: For equipment and software that is not covered by a service-and-support contract, this is the last date to order a new service-and-support contract or add the equipment and/or software to an existing service-and-support contract. GMT date format YYYY-MM-DD
   *
   * - `eoLifeAnnouncementDate`: The date the document that announces the end-of-sale and end-of-life of a product is distributed to the general public. GMT date format YYYY-MM-DD
   *
   * - `bulletinNumber`: The Cisco.com bulletin number for an End-of-Life bulletin.
   *
   * @return successful operation
   */
  getSoftwareEoxBulletinResponse(params: ProductAlertsService.GetSoftwareEoxBulletinParams): __Observable<__StrictHttpResponse<SofwareEOLBulletinResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    (params.swEolInstanceId || []).forEach(val => {if (val != null) __params = __params.append('swEolInstanceId', val.toString())});
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    if (params.lastShipDate != null) __params = __params.set('lastShipDate', params.lastShipDate.toString());
    if (params.lastDateOfSupport != null) __params = __params.set('lastDateOfSupport', params.lastDateOfSupport.toString());
    (params.fields || []).forEach(val => {if (val != null) __params = __params.append('fields', val.toString())});
    if (params.eoVulnerabilitySecuritySupport != null) __params = __params.set('eoVulnerabilitySecuritySupport', params.eoVulnerabilitySecuritySupport.toString());
    if (params.eoSwMaintenanceReleasesDate != null) __params = __params.set('eoSwMaintenanceReleasesDate', params.eoSwMaintenanceReleasesDate.toString());
    if (params.eoServiceContractRenewalDate != null) __params = __params.set('eoServiceContractRenewalDate', params.eoServiceContractRenewalDate.toString());
    if (params.eoSaleDate != null) __params = __params.set('eoSaleDate', params.eoSaleDate.toString());
    if (params.eoRoutineFailureAnalysisDate != null) __params = __params.set('eoRoutineFailureAnalysisDate', params.eoRoutineFailureAnalysisDate.toString());
    if (params.eoNewServiceAttachmentDate != null) __params = __params.set('eoNewServiceAttachmentDate', params.eoNewServiceAttachmentDate.toString());
    if (params.eoLifeAnnouncementDate != null) __params = __params.set('eoLifeAnnouncementDate', params.eoLifeAnnouncementDate.toString());
    (params.bulletinNumber || []).forEach(val => {if (val != null) __params = __params.append('bulletinNumber', val.toString())});
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/product-alerts/v1/software-eol-bulletins`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SofwareEOLBulletinResponse>;
      })
    );
  }

  /**
   * The software-eol-bulletin API retrieves end of life bulleting details for specific hardware device based on the software end of life ID associated with the devices. All request parameters are optional.
   * If no software end of life ID is provided in the request, the response will contain end of life bulleting information of all software end of life and for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetSoftwareEoxBulletinParams` containing the following parameters:
   *
   * - `swEolInstanceId`: The unique identifier for software end-of-life entry in a data store.
   *
   * - `sort`: ASC (ascending) or DESC (decending)
   *
   * - `rows`: Number of rows of data per page
   *
   * - `page`: The page number of the response
   *
   * - `lastShipDate`: The last-possible ship date that can be requested of Cisco and/or its contract manufacturers. Actual ship date is dependent on lead time. GMT date format YYYY-MM-DD
   *
   * - `lastDateOfSupport`: The last date to receive applicable service and support for the product as entitled by active service contracts or by warranty terms and conditions. After this date, all support services for the product are unavailable, and the product becomes obsolete. GMT date format YYYY-MM-DD
   *
   * - `fields`: Receive only requested fields in the response
   *
   * - `eoVulnerabilitySecuritySupport`: The last date that Cisco Engineering may release a planned maintenance release or scheduled software remedy for a security vulnerability issue. GMT date format YYYY-MM-DD
   *
   * - `eoSwMaintenanceReleasesDate`: The last date that Cisco Engineering may release any final software maintenance releases or bug fixes. After this date, Cisco Engineering will no longer develop, repair, maintain, or test the product software. GMT date format YYYY-MM-DD
   *
   * - `eoServiceContractRenewalDate`: The last date to extend or renew a service contract for the product. GMT date format YYYY-MM-DD
   *
   * - `eoSaleDate`: The last date to order the product through Cisco point-of-sale mechanisms. The product is no longer for sale after this date. GMT date format YYYY-MM-DD
   *
   * - `eoRoutineFailureAnalysisDate`: The last-possible date a routine failure analysis may be performed to determine the cause of hardware product failure or defect. GMT date format YYYY-MM-DD
   *
   * - `eoNewServiceAttachmentDate`: For equipment and software that is not covered by a service-and-support contract, this is the last date to order a new service-and-support contract or add the equipment and/or software to an existing service-and-support contract. GMT date format YYYY-MM-DD
   *
   * - `eoLifeAnnouncementDate`: The date the document that announces the end-of-sale and end-of-life of a product is distributed to the general public. GMT date format YYYY-MM-DD
   *
   * - `bulletinNumber`: The Cisco.com bulletin number for an End-of-Life bulletin.
   *
   * @return successful operation
   */
  getSoftwareEoxBulletin(params: ProductAlertsService.GetSoftwareEoxBulletinParams): __Observable<SofwareEOLBulletinResponse> {
    return this.getSoftwareEoxBulletinResponse(params).pipe(
      __map(_r => _r.body as SofwareEOLBulletinResponse)
    );
  }

  /**
   * The Security Advisories API retrieves security vulnerability information along with Common Vulnerability and Exposure (CVE) identifiers, and Common Vulnerability Scoring System (CVSS) for devices associated with customer ID. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain security advisory information for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetTopSecurityAdvisoriesParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Sorting details. Default sort severity, count, date (newest)
   *
   * - `rows`: No of rows in a page
   *
   * - `page`: Page number
   *
   * @return successful operation
   */
  getTopSecurityAdvisoriesResponse(params: ProductAlertsService.GetTopSecurityAdvisoriesParams): __Observable<__StrictHttpResponse<SecurityAdvisoryResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    (params.sort || []).forEach(val => {if (val != null) __params = __params.append('sort', val.toString())});
    if (params.rows != null) __params = __params.set('rows', params.rows.toString());
    if (params.page != null) __params = __params.set('page', params.page.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/product-alerts/v1/security-advisories/top`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SecurityAdvisoryResponse>;
      })
    );
  }

  /**
   * The Security Advisories API retrieves security vulnerability information along with Common Vulnerability and Exposure (CVE) identifiers, and Common Vulnerability Scoring System (CVSS) for devices associated with customer ID. All request parameters are optional other than customerId.
   * If no device ID is provided in the request, the response will contain security advisory information for all device IDs associated with the customer.
   * This API supports filtering, pagination, sorting and chunked transfer encoding. Refer to General API Feature section to see examples of how to take advantage of these features in order to optimize and manipulate the response.
   * @param params The `ProductAlertsService.GetTopSecurityAdvisoriesParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * - `sort`: Sorting details. Default sort severity, count, date (newest)
   *
   * - `rows`: No of rows in a page
   *
   * - `page`: Page number
   *
   * @return successful operation
   */
  getTopSecurityAdvisories(params: ProductAlertsService.GetTopSecurityAdvisoriesParams): __Observable<SecurityAdvisoryResponse> {
    return this.getTopSecurityAdvisoriesResponse(params).pipe(
      __map(_r => _r.body as SecurityAdvisoryResponse)
    );
  }
}

module ProductAlertsService {

  /**
   * Parameters for getVulnerabilityCounts
   */
  export interface GetVulnerabilityCountsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * The recognized/validated Serial Number
     */
    serialNumber?: Array<string>;
  }

  /**
   * Parameters for getSecurityAdvisories
   */
  export interface GetSecurityAdvisoriesParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * The vulnerability status of a Network element.For Example:- Vulnerable, Potentially Vulnerable, and Not Vulnerable.
     */
    vulnerabilityStatus?: Array<string>;

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

    /**
     * CDX should provide a way to uniquely identify IB records, regardless of non-unique or invalid vendor-supplied identity strings
     */
    neInstanceId?: Array<number>;

    /**
     * CDX should indicate the physical|logical hierarchy of the product (chassis to card, server to client, etc
     */
    managedNeId?: Array<string>;

    /**
     * Requested fields in the response.
     */
    fields?: Array<string>;

    /**
     * Internally generated ID for a security advisory
     */
    advisoryId?: Array<number>;
  }

  /**
   * Parameters for getSecurityAdvisoryList
   */
  export interface GetSecurityAdvisoryListParams {

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
   * Parameters for headSecurityAdvisoryBulletins
   */
  export interface HeadSecurityAdvisoryBulletinsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Number of rows of data per page.
     */
    rows?: number;
  }

  /**
   * Parameters for getPSIRTBulletin
   */
  export interface GetPSIRTBulletinParams {

    /**
     * X-CSI-CCOID
     */
    XCSICCOID: string;
    Authorization: string;

    /**
     * ASC (ascending) or DESC (descending)
     */
    sort?: Array<string>;

    /**
     * Severity
     */
    severity?: Array<string>;

    /**
     * The Security Impact Rating (SIR) for Cisco Security Advisories
     */
    securityImpactRating?: Array<string>;

    /**
     * Internally generated ID for a security advisory.
     */
    securityAdvisoryInstanceId?: Array<number>;

    /**
     * Number of rows of data per page
     */
    rows?: number;

    /**
     * Public Release Indicator
     */
    publicReleaseIndicator?: Array<string>;

    /**
     * The page number of the response
     */
    page?: number;

    /**
     * Receive only requested fields in the response
     */
    fields?: Array<string>;

    /**
     * Common Vulnerability Scoring System (CVSS) Temporal Score
     */
    cvssTemporalScore?: Array<string>;

    /**
     * Common Vulnerability Scoring System (CVSS) Base Score
     */
    cvssBaseScore?: Array<string>;

    /**
     * Alert Status Code
     */
    alertStatusCode?: Array<string>;

    /**
     * Published identifier of security advisory.
     */
    advisoryId?: Array<string>;
  }

  /**
   * Parameters for getFieldNotice
   */
  export interface GetFieldNoticeParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * The vulnerability status of a Network element. For Example:- Vulnerable, Potentially Vulnerable, and Not Vulnerable.
     */
    vulnerabilityStatus?: Array<string>;

    /**
     * Supported sort criteria are either ‘asc’ for ascending or ‘desc’ for descending.
     */
    sort?: Array<string>;

    /**
     * The recognized/validated Serial Number
     */
    serialNumber?: Array<string>;

    /**
     * Number of rows of data per page.
     */
    rows?: number;

    /**
     * Page number of the response
     */
    page?: number;

    /**
     * CDX should provide a way to uniquely identify IB records, regardless of non-unique or invalid vendor-supplied identity strings
     */
    neInstanceId?: Array<number>;

    /**
     * CDX should indicate the physical|logical hierarchy of the product (chassis to card, server to client, etc
     */
    managedNeId?: Array<string>;

    /**
     * Requested fields in the response.
     */
    fields?: Array<string>;
  }

  /**
   * Parameters for headFieldNoticeBulletins
   */
  export interface HeadFieldNoticeBulletinsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Number of rows of data per page.
     */
    rows?: number;
  }

  /**
   * Parameters for getFieldNoticeBulletin
   */
  export interface GetFieldNoticeBulletinParams {

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

    /**
     * Requested fields in the response.
     */
    fields?: Array<string>;

    /**
     * FieldNotice Type Code
     */
    fieldNoticeTypeCode?: Array<string>;

    /**
     * The Cisco.com bulletin number for Field Notices
     */
    fieldNoticeId?: Array<number>;

    /**
     * Distribution Code
     */
    distributionCode?: Array<string>;

    /**
     * Date when the bulletin was first published to Cisco.com.
     */
    bulletinFirstPublished?: string;
  }

  /**
   * Parameters for getHardwareEox
   */
  export interface GetHardwareEoxParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * ASC (ascending) or DESC (descending)
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

    /**
     * The unique, generated ID of the network element
     */
    neInstanceId?: Array<string>;

    /**
     * The unique, generated ID of the network element
     */
    managedNeId?: Array<string>;

    /**
     * Receive only requested fields in the response
     */
    fields?: Array<string>;
  }

  /**
   * Parameters for headHardwareEolBulletins
   */
  export interface HeadHardwareEolBulletinsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Number of rows of data per page.
     */
    rows?: number;
  }

  /**
   * Parameters for getHardwareEoxBulletin
   */
  export interface GetHardwareEoxBulletinParams {

    /**
     * ASC (ascending) or DESC (decending)
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

    /**
     * The last-possible ship date that can be requested of Cisco and/or its contract manufacturers. Actual ship date is dependent on lead time. GMT date format YYYY-MM-DD
     */
    lastShipDate?: string;

    /**
     * The last date to receive applicable service and support for the product as entitled by active service contracts or by warranty terms and conditions. After this date, all support services for the product are unavailable, and the product becomes obsolete. GMT date format YYYY-MM-DD
     */
    lastDateOfSupport?: string;

    /**
     * The unique identifier for hardware end-of-life entry in a data store.
     */
    hwEolInstanceId?: Array<number>;

    /**
     * Receive only requested fields in the response
     */
    fields?: Array<string>;

    /**
     * The last date that Cisco Engineering may release any final software maintenance releases or bug fixes. After this date, Cisco Engineering will no longer develop, repair, maintain, or test the product software. GMT date format YYYY-MM-DD
     */
    eoSwMaintenanceReleasesDate?: string;

    /**
     * The last date to extend or renew a service contract for the product. GMT date format YYYY-MM-DD
     */
    eoServiceContractRenewalDate?: string;

    /**
     * The last date to order the product through Cisco point-of-sale mechanisms. The product is no longer for sale after this date. GMT date format YYYY-MM-DD
     */
    eoSaleDate?: string;

    /**
     * The last-possible date a routine failure analysis may be performed to determine the cause of hardware product failure or defect. GMT date format YYYY-MM-DD
     */
    eoRoutineFailureAnalysisDate?: string;

    /**
     * For equipment and software that is not covered by a service-and-support contract, this is the last date to order a new service-and-support contract or add the equipment and/or software to an existing service-and-support contract. GMT date format YYYY-MM-DD
     */
    eoNewServiceAttachmentDate?: string;

    /**
     * The date the document that announces the end-of-sale and end-of-life of a product is distributed to the general public. GMT date format YYYY-MM-DD
     */
    eoLifeAnnouncementDate?: string;

    /**
     * Cisco product published at the time of EOL announcement.
     */
    bulletinProductId?: Array<string>;

    /**
     * The Cisco.com bulletin number for an End-of-Life bulletin and Field Notices.
     */
    bulletinNumber?: Array<string>;
  }

  /**
   * Parameters for getSoftwareEox
   */
  export interface GetSoftwareEoxParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * ASC (ascending) or DESC (descending)
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

    /**
     * The unique, generated ID of the network element
     */
    neInstanceId?: Array<string>;

    /**
     * The unique, generated ID of the network element.
     */
    managedNeId?: Array<string>;

    /**
     * Receive only requested fields in the response
     */
    fields?: Array<string>;
  }

  /**
   * Parameters for headSoftwareEolBulletins
   */
  export interface HeadSoftwareEolBulletinsParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Number of rows of data per page.
     */
    rows?: number;
  }

  /**
   * Parameters for getSoftwareEoxBulletin
   */
  export interface GetSoftwareEoxBulletinParams {

    /**
     * The unique identifier for software end-of-life entry in a data store.
     */
    swEolInstanceId?: Array<number>;

    /**
     * ASC (ascending) or DESC (decending)
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

    /**
     * The last-possible ship date that can be requested of Cisco and/or its contract manufacturers. Actual ship date is dependent on lead time. GMT date format YYYY-MM-DD
     */
    lastShipDate?: string;

    /**
     * The last date to receive applicable service and support for the product as entitled by active service contracts or by warranty terms and conditions. After this date, all support services for the product are unavailable, and the product becomes obsolete. GMT date format YYYY-MM-DD
     */
    lastDateOfSupport?: string;

    /**
     * Receive only requested fields in the response
     */
    fields?: Array<string>;

    /**
     * The last date that Cisco Engineering may release a planned maintenance release or scheduled software remedy for a security vulnerability issue. GMT date format YYYY-MM-DD
     */
    eoVulnerabilitySecuritySupport?: string;

    /**
     * The last date that Cisco Engineering may release any final software maintenance releases or bug fixes. After this date, Cisco Engineering will no longer develop, repair, maintain, or test the product software. GMT date format YYYY-MM-DD
     */
    eoSwMaintenanceReleasesDate?: string;

    /**
     * The last date to extend or renew a service contract for the product. GMT date format YYYY-MM-DD
     */
    eoServiceContractRenewalDate?: string;

    /**
     * The last date to order the product through Cisco point-of-sale mechanisms. The product is no longer for sale after this date. GMT date format YYYY-MM-DD
     */
    eoSaleDate?: string;

    /**
     * The last-possible date a routine failure analysis may be performed to determine the cause of hardware product failure or defect. GMT date format YYYY-MM-DD
     */
    eoRoutineFailureAnalysisDate?: string;

    /**
     * For equipment and software that is not covered by a service-and-support contract, this is the last date to order a new service-and-support contract or add the equipment and/or software to an existing service-and-support contract. GMT date format YYYY-MM-DD
     */
    eoNewServiceAttachmentDate?: string;

    /**
     * The date the document that announces the end-of-sale and end-of-life of a product is distributed to the general public. GMT date format YYYY-MM-DD
     */
    eoLifeAnnouncementDate?: string;

    /**
     * The Cisco.com bulletin number for an End-of-Life bulletin.
     */
    bulletinNumber?: Array<string>;
  }

  /**
   * Parameters for getTopSecurityAdvisories
   */
  export interface GetTopSecurityAdvisoriesParams {

    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;

    /**
     * Sorting details. Default sort severity, count, date (newest)
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
  }
}

export { ProductAlertsService }
