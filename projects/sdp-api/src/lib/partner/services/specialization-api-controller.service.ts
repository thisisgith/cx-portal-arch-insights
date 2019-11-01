/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { PartnerConfiguration as __Configuration } from '../partner-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { SpecializationInfoDetails } from '../models/specialization-info-details';
import { ArchitectureSpecialization } from '../models/architecture-specialization';
import { Paragraph } from '../models/paragraph';

/**
 * REST APIs to fetch details regarding specialization!
 */
@Injectable({
  providedIn: 'root',
})
class SpecializationApiControllerService extends __BaseService {
  static readonly getSpecializationInfoListUsingGETPath = '/v1/specialization';
  static readonly getArchitectureSpecializationDetailsUsingGETPath = '/v1/specialization/architecture/content';
  static readonly getSpecializationDetailsUsingGETPath = '/v1/specialization/content';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `SpecializationApiControllerService.GetSpecializationInfoListUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched details regarding specialization for a partnerId
   */
  getSpecializationInfoListUsingGETResponse(params: SpecializationApiControllerService.GetSpecializationInfoListUsingGETParams): __Observable<__StrictHttpResponse<Array<SpecializationInfoDetails>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/specialization`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SpecializationInfoDetails>>;
      })
    );
  }

  /**
   * @param params The `SpecializationApiControllerService.GetSpecializationInfoListUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched details regarding specialization for a partnerId
   */
  getSpecializationInfoListUsingGET(params: SpecializationApiControllerService.GetSpecializationInfoListUsingGETParams): __Observable<Array<SpecializationInfoDetails>> {
    return this.getSpecializationInfoListUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<SpecializationInfoDetails>)
    );
  }

  /**
   * @param Authorization Mashery user credential header
   * @return Successfully fetched details regarding architecture specialization
   */
  getArchitectureSpecializationDetailsUsingGETResponse(Authorization?: string): __Observable<__StrictHttpResponse<ArchitectureSpecialization>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (Authorization != null) __headers = __headers.set('Authorization', Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/specialization/architecture/content`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ArchitectureSpecialization>;
      })
    );
  }

  /**
   * @param Authorization Mashery user credential header
   * @return Successfully fetched details regarding architecture specialization
   */
  getArchitectureSpecializationDetailsUsingGET(Authorization?: string): __Observable<ArchitectureSpecialization> {
    return this.getArchitectureSpecializationDetailsUsingGETResponse(Authorization).pipe(
      __map(_r => _r.body as ArchitectureSpecialization)
    );
  }

  /**
   * @param Authorization Mashery user credential header
   * @return Successfully fetched details regarding specialization
   */
  getSpecializationDetailsUsingGETResponse(Authorization?: string): __Observable<__StrictHttpResponse<Array<Paragraph>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (Authorization != null) __headers = __headers.set('Authorization', Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/specialization/content`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<Paragraph>>;
      })
    );
  }

  /**
   * @param Authorization Mashery user credential header
   * @return Successfully fetched details regarding specialization
   */
  getSpecializationDetailsUsingGET(Authorization?: string): __Observable<Array<Paragraph>> {
    return this.getSpecializationDetailsUsingGETResponse(Authorization).pipe(
      __map(_r => _r.body as Array<Paragraph>)
    );
  }
}

module SpecializationApiControllerService {

  /**
   * Parameters for getSpecializationInfoListUsingGET
   */
  export interface GetSpecializationInfoListUsingGETParams {

    /**
     * partnerId
     */
    partnerId: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }
}

export { SpecializationApiControllerService }
