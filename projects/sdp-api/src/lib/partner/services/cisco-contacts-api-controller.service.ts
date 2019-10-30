/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { PartnerConfiguration as __Configuration } from '../partner-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { Json } from '../models/json';
import { CiscoContact } from '../models/cisco-contact';

/**
 * REST APIs to fetch details regarding Cisco contacts!
 */
@Injectable({
  providedIn: 'root',
})
class CiscoContactsApiControllerService extends __BaseService {
  static readonly generateWebexTokenUsingGETPath = '/v1/cisco-contacts/webex-token';
  static readonly getCiscoContactsUsingGETPath = '/v1/cisco-contacts/{partnerId}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param Authorization Mashery user credential header
   * @return Successfully generated the guest login webex token
   */
  generateWebexTokenUsingGETResponse(Authorization?: string): __Observable<__StrictHttpResponse<Json>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (Authorization != null) __headers = __headers.set('Authorization', Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/cisco-contacts/webex-token`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Json>;
      })
    );
  }

  /**
   * @param Authorization Mashery user credential header
   * @return Successfully generated the guest login webex token
   */
  generateWebexTokenUsingGET(Authorization?: string): __Observable<Json> {
    return this.generateWebexTokenUsingGETResponse(Authorization).pipe(
      __map(_r => _r.body as Json)
    );
  }

  /**
   * @param params The `CiscoContactsApiControllerService.GetCiscoContactsUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched the cisco contacts for a given partner id
   */
  getCiscoContactsUsingGETResponse(params: CiscoContactsApiControllerService.GetCiscoContactsUsingGETParams): __Observable<__StrictHttpResponse<Array<CiscoContact>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/cisco-contacts/${params.partnerId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CiscoContact>>;
      })
    );
  }

  /**
   * @param params The `CiscoContactsApiControllerService.GetCiscoContactsUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched the cisco contacts for a given partner id
   */
  getCiscoContactsUsingGET(params: CiscoContactsApiControllerService.GetCiscoContactsUsingGETParams): __Observable<Array<CiscoContact>> {
    return this.getCiscoContactsUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<CiscoContact>)
    );
  }
}

module CiscoContactsApiControllerService {

  /**
   * Parameters for getCiscoContactsUsingGET
   */
  export interface GetCiscoContactsUsingGETParams {

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

export { CiscoContactsApiControllerService }
