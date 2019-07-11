/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { DefaultResponseModel } from '../models/default-response-model';
import { DevicePolicyRequestModel } from '../models/device-policy-request-model';
import { DevicePolicyUpdateRequestModel } from '../models/device-policy-update-request-model';
import { DevicePolicyStatusResponseModel } from '../models/device-policy-status-response-model';
import { DevicePolicyResponseModel } from '../models/device-policy-response-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointDevicePolicyAPIService extends __BaseService {
  static readonly createDevicePolicyUsingPOSTPath = '/v1/policy';
  static readonly updateDevicePolicyUsingPATCHPath = '/v1/policy';
  static readonly getPolicyStatusUsingGETPath = '/v1/policy/status/{policyId}';
  static readonly getDevicePolicyUsingGETPath = '/v1/policy/{policyId}';
  static readonly deletePolicyUsingDELETEPath = '/v1/policy/{policyId}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param devicePolicyRequestModel devicePolicyRequestModel
   * @return OK
   */
  createDevicePolicyUsingPOSTResponse(devicePolicyRequestModel: DevicePolicyRequestModel): __Observable<__StrictHttpResponse<DefaultResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = devicePolicyRequestModel;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/v1/policy`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
//        withCredentials: true,
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DefaultResponseModel>;
      })
    );
  }

  /**
   * @param devicePolicyRequestModel devicePolicyRequestModel
   * @return OK
   */
  createDevicePolicyUsingPOST(devicePolicyRequestModel: DevicePolicyRequestModel): __Observable<DefaultResponseModel> {
    return this.createDevicePolicyUsingPOSTResponse(devicePolicyRequestModel).pipe(
      __map(_r => _r.body as DefaultResponseModel)
    );
  }

  /**
   * @param devicePolicyUpdateRequestModel devicePolicyUpdateRequestModel
   * @return OK
   */
  updateDevicePolicyUsingPATCHResponse(devicePolicyUpdateRequestModel: DevicePolicyUpdateRequestModel): __Observable<__StrictHttpResponse<DefaultResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = devicePolicyUpdateRequestModel;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/v1/policy`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
//        withCredentials: true,
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DefaultResponseModel>;
      })
    );
  }

  /**
   * @param devicePolicyUpdateRequestModel devicePolicyUpdateRequestModel
   * @return OK
   */
  updateDevicePolicyUsingPATCH(devicePolicyUpdateRequestModel: DevicePolicyUpdateRequestModel): __Observable<DefaultResponseModel> {
    return this.updateDevicePolicyUsingPATCHResponse(devicePolicyUpdateRequestModel).pipe(
      __map(_r => _r.body as DefaultResponseModel)
    );
  }

  /**
   * @param policyId policyId
   * @return OK
   */
  getPolicyStatusUsingGETResponse(policyId: string): __Observable<__StrictHttpResponse<DevicePolicyStatusResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/v1/policy/status/${policyId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
//        withCredentials: true,
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DevicePolicyStatusResponseModel>;
      })
    );
  }

  /**
   * @param policyId policyId
   * @return OK
   */
  getPolicyStatusUsingGET(policyId: string): __Observable<DevicePolicyStatusResponseModel> {
    return this.getPolicyStatusUsingGETResponse(policyId).pipe(
      __map(_r => _r.body as DevicePolicyStatusResponseModel)
    );
  }

  /**
   * @param policyId policyId
   * @return OK
   */
  getDevicePolicyUsingGETResponse(policyId: string): __Observable<__StrictHttpResponse<DevicePolicyResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/v1/policy/${policyId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
//        withCredentials: true,
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DevicePolicyResponseModel>;
      })
    );
  }

  /**
   * @param policyId policyId
   * @return OK
   */
  getDevicePolicyUsingGET(policyId: string): __Observable<DevicePolicyResponseModel> {
    return this.getDevicePolicyUsingGETResponse(policyId).pipe(
      __map(_r => _r.body as DevicePolicyResponseModel)
    );
  }

  /**
   * @param policyId policyId
   * @return OK
   */
  deletePolicyUsingDELETEResponse(policyId: string): __Observable<__StrictHttpResponse<DefaultResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/v1/policy/${policyId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
//        withCredentials: true,
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DefaultResponseModel>;
      })
    );
  }

  /**
   * @param policyId policyId
   * @return OK
   */
  deletePolicyUsingDELETE(policyId: string): __Observable<DefaultResponseModel> {
    return this.deletePolicyUsingDELETEResponse(policyId).pipe(
      __map(_r => _r.body as DefaultResponseModel)
    );
  }
}

module ControlPointDevicePolicyAPIService {
}

export { ControlPointDevicePolicyAPIService }
