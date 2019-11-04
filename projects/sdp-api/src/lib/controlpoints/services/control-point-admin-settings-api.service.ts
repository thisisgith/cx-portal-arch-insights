/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { DefaultResponseModel } from '../models/default-response-model';
import { UserPreferenceRequestModel } from '../models/user-preference-request-model';
import { UserPreferenceResponseModel } from '../models/user-preference-response-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointAdminSettingsAPIService extends __BaseService {
  static readonly createUserPreferenceDetailsUsingPOSTPath = '/settings/insight';
  static readonly getUserPreferenceDetailsUsingGETPath = '/settings/insight/{customerId}/{insightType}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param requestModel requestModel
   * @return OK
   */
  createUserPreferenceDetailsUsingPOSTResponse(requestModel: UserPreferenceRequestModel): __Observable<__StrictHttpResponse<DefaultResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = requestModel;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/customerportal/controlpoint/v1/settings/insight`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DefaultResponseModel>;
      })
    );
  }

  /**
   * @param requestModel requestModel
   * @return OK
   */
  createUserPreferenceDetailsUsingPOST(requestModel: UserPreferenceRequestModel): __Observable<DefaultResponseModel> {
    return this.createUserPreferenceDetailsUsingPOSTResponse(requestModel).pipe(
      __map(_r => _r.body as DefaultResponseModel)
    );
  }

  /**
   * @param params The `ControlPointAdminSettingsAPIService.GetUserPreferenceDetailsUsingGETParams` containing the following parameters:
   *
   * - `insightType`: insightType
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getUserPreferenceDetailsUsingGETResponse(params: ControlPointAdminSettingsAPIService.GetUserPreferenceDetailsUsingGETParams): __Observable<__StrictHttpResponse<UserPreferenceResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/controlpoint/v1/settings/insight/${params.customerId}/${params.insightType}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UserPreferenceResponseModel>;
      })
    );
  }

  /**
   * @param params The `ControlPointAdminSettingsAPIService.GetUserPreferenceDetailsUsingGETParams` containing the following parameters:
   *
   * - `insightType`: insightType
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getUserPreferenceDetailsUsingGET(params: ControlPointAdminSettingsAPIService.GetUserPreferenceDetailsUsingGETParams): __Observable<UserPreferenceResponseModel> {
    return this.getUserPreferenceDetailsUsingGETResponse(params).pipe(
      __map(_r => _r.body as UserPreferenceResponseModel)
    );
  }
}

module ControlPointAdminSettingsAPIService {

  /**
   * Parameters for getUserPreferenceDetailsUsingGET
   */
  export interface GetUserPreferenceDetailsUsingGETParams {

    /**
     * insightType
     */
    insightType: string;

    /**
     * customerId
     */
    customerId: string;
  }
}

export { ControlPointAdminSettingsAPIService }
