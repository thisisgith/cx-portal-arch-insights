/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { PartnerConfiguration as __Configuration } from '../partner-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { IPaginationResponse } from '../models/ipagination-response';
import { EmployeeCertificateInfoDetail } from '../models/employee-certificate-info-detail';

/**
 * REST APIs to fetch certificate Information
 */
@Injectable({
  providedIn: 'root',
})
class EmployeeCertificationControllerService extends __BaseService {
  static readonly fetchEmployeeCertificationUsingGETPath = '/v1/certificates';
  static readonly getCertificationInfoByFilterUsingGETPath = '/v1/certificates/count';
  static readonly getCertificationStatusUsingGETPath = '/v1/certificates/count/status';
  static readonly getEmployeeCertificationDetailsUsingGETPath = '/v1/certificates/employees';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `EmployeeCertificationControllerService.FetchEmployeeCertificationUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Get Certification info
   */
  fetchEmployeeCertificationUsingGETResponse(params: EmployeeCertificationControllerService.FetchEmployeeCertificationUsingGETParams): __Observable<__StrictHttpResponse<IPaginationResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/certificates`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<IPaginationResponse>;
      })
    );
  }

  /**
   * @param params The `EmployeeCertificationControllerService.FetchEmployeeCertificationUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Get Certification info
   */
  fetchEmployeeCertificationUsingGET(params: EmployeeCertificationControllerService.FetchEmployeeCertificationUsingGETParams): __Observable<IPaginationResponse> {
    return this.fetchEmployeeCertificationUsingGETResponse(params).pipe(
      __map(_r => _r.body as IPaginationResponse)
    );
  }

  /**
   * @param params The `EmployeeCertificationControllerService.GetCertificationInfoByFilterUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Get Certification info
   */
  getCertificationInfoByFilterUsingGETResponse(params: EmployeeCertificationControllerService.GetCertificationInfoByFilterUsingGETParams): __Observable<__StrictHttpResponse<IPaginationResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/certificates/count`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<IPaginationResponse>;
      })
    );
  }

  /**
   * @param params The `EmployeeCertificationControllerService.GetCertificationInfoByFilterUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Get Certification info
   */
  getCertificationInfoByFilterUsingGET(params: EmployeeCertificationControllerService.GetCertificationInfoByFilterUsingGETParams): __Observable<IPaginationResponse> {
    return this.getCertificationInfoByFilterUsingGETResponse(params).pipe(
      __map(_r => _r.body as IPaginationResponse)
    );
  }

  /**
   * @param params The `EmployeeCertificationControllerService.GetCertificationStatusUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `aggregationKey`: aggregationKey
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Get Certification info
   */
  getCertificationStatusUsingGETResponse(params: EmployeeCertificationControllerService.GetCertificationStatusUsingGETParams): __Observable<__StrictHttpResponse<IPaginationResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.aggregationKey != null) __params = __params.set('aggregationKey', params.aggregationKey.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/certificates/count/status`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<IPaginationResponse>;
      })
    );
  }

  /**
   * @param params The `EmployeeCertificationControllerService.GetCertificationStatusUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `aggregationKey`: aggregationKey
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Get Certification info
   */
  getCertificationStatusUsingGET(params: EmployeeCertificationControllerService.GetCertificationStatusUsingGETParams): __Observable<IPaginationResponse> {
    return this.getCertificationStatusUsingGETResponse(params).pipe(
      __map(_r => _r.body as IPaginationResponse)
    );
  }

  /**
   * @param params The `EmployeeCertificationControllerService.GetEmployeeCertificationDetailsUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `certificationDesc`: certificationDesc
   *
   * - `certificationCode`: certificationCode
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Get Employee list for a particular certification
   */
  getEmployeeCertificationDetailsUsingGETResponse(params: EmployeeCertificationControllerService.GetEmployeeCertificationDetailsUsingGETParams): __Observable<__StrictHttpResponse<Array<EmployeeCertificateInfoDetail>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.certificationDesc != null) __params = __params.set('certificationDesc', params.certificationDesc.toString());
    if (params.certificationCode != null) __params = __params.set('certificationCode', params.certificationCode.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/certificates/employees`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<EmployeeCertificateInfoDetail>>;
      })
    );
  }

  /**
   * @param params The `EmployeeCertificationControllerService.GetEmployeeCertificationDetailsUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `certificationDesc`: certificationDesc
   *
   * - `certificationCode`: certificationCode
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Get Employee list for a particular certification
   */
  getEmployeeCertificationDetailsUsingGET(params: EmployeeCertificationControllerService.GetEmployeeCertificationDetailsUsingGETParams): __Observable<Array<EmployeeCertificateInfoDetail>> {
    return this.getEmployeeCertificationDetailsUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<EmployeeCertificateInfoDetail>)
    );
  }
}

module EmployeeCertificationControllerService {

  /**
   * Parameters for fetchEmployeeCertificationUsingGET
   */
  export interface FetchEmployeeCertificationUsingGETParams {

    /**
     * partnerId
     */
    partnerId: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for getCertificationInfoByFilterUsingGET
   */
  export interface GetCertificationInfoByFilterUsingGETParams {

    /**
     * partnerId
     */
    partnerId: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for getCertificationStatusUsingGET
   */
  export interface GetCertificationStatusUsingGETParams {

    /**
     * partnerId
     */
    partnerId: string;

    /**
     * aggregationKey
     */
    aggregationKey: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for getEmployeeCertificationDetailsUsingGET
   */
  export interface GetEmployeeCertificationDetailsUsingGETParams {

    /**
     * partnerId
     */
    partnerId: string;

    /**
     * certificationDesc
     */
    certificationDesc: string;

    /**
     * certificationCode
     */
    certificationCode: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }
}

export { EmployeeCertificationControllerService }
