/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { OrgUserConfiguration as __Configuration } from '../org-user-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { OrgUserResponse } from '../models/org-user-response';
@Injectable({
  providedIn: 'root',
})
class OrgUserService extends __BaseService {
  static readonly getUserByTokenPath = '/v1/user';
  static readonly getUserV2Path = '/v2/user';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Returns information for this user (identified by ccoId). This incldues the user's role and party affiliation
   * @param params The `OrgUserService.GetUserByTokenParams` containing the following parameters:
   *
   * - `saId`:
   *
   * - `vaId`:
   *
   * @return successful operation
   */
  getUserByTokenResponse(params: OrgUserService.GetUserByTokenParams): __Observable<__StrictHttpResponse<OrgUserResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.saId != null) __headers = __headers.set('saId', params.saId.toString());
    if (params.vaId != null) __headers = __headers.set('vaId', params.vaId.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/cxportal/entitlement/v1/user`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OrgUserResponse>;
      })
    );
  }

  /**
   * Returns information for this user (identified by ccoId). This incldues the user's role and party affiliation
   * @param params The `OrgUserService.GetUserByTokenParams` containing the following parameters:
   *
   * - `saId`:
   *
   * - `vaId`:
   *
   * @return successful operation
   */
  getUserByToken(params: OrgUserService.GetUserByTokenParams): __Observable<OrgUserResponse> {
    return this.getUserByTokenResponse(params).pipe(
      __map(_r => _r.body as OrgUserResponse)
    );
  }

  /**
   * Returns information for this user (identified by ccoId). This incldues the user's role and party affiliation
   * @param params The `OrgUserService.GetUserV2Params` containing the following parameters:
   *
   * - `vaId`:
   *
   * - `saId`:
   *
   * - `customerId`:
   *
   * - `CX-Context`:
   *
   * @return successful operation
   */
  getUserV2Response(params: OrgUserService.GetUserV2Params): __Observable<__StrictHttpResponse<OrgUserResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.vaId != null) __headers = __headers.set('vaId', params.vaId.toString());
    if (params.saId != null) __headers = __headers.set('saId', params.saId.toString());
    if (params.customerId != null) __headers = __headers.set('customerId', params.customerId.toString());
    if (params.CXContext != null) __headers = __headers.set('CX-Context', params.CXContext.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/cxportal/entitlement/v2/user`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<OrgUserResponse>;
      })
    );
  }

  /**
   * Returns information for this user (identified by ccoId). This incldues the user's role and party affiliation
   * @param params The `OrgUserService.GetUserV2Params` containing the following parameters:
   *
   * - `vaId`:
   *
   * - `saId`:
   *
   * - `customerId`:
   *
   * - `CX-Context`:
   *
   * @return successful operation
   */
  getUserV2(params: OrgUserService.GetUserV2Params): __Observable<OrgUserResponse> {
    return this.getUserV2Response(params).pipe(
      __map(_r => _r.body as OrgUserResponse)
    );
  }
}

module OrgUserService {

  /**
   * Parameters for getUserByToken
   */
  export interface GetUserByTokenParams {
    saId: number;
    vaId?: number;
  }

  /**
   * Parameters for getUserV2
   */
  export interface GetUserV2Params {
    vaId: number;
    saId: string;
    customerId: string;
    CXContext?: any;
  }
}

export { OrgUserService }
