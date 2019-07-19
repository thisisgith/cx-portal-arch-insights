/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { PolicyResponseModel } from '../models/policy-response-model';
import { DevicePolicyResponseModel } from '../models/device-policy-response-model';
import { DevicePolicyRequestModel } from '../models/device-policy-request-model';
import { DevicePolicyUpdateRequestModel } from '../models/device-policy-update-request-model';
import { DevicePolicyStatusResponseModel } from '../models/device-policy-status-response-model';
import { DefaultResponseModel } from '../models/default-response-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointDevicePolicyAPIService extends __BaseService {
  static readonly getAllPolicyUsingGETPath = '/policies/{customerId}';
  static readonly createDevicePolicyUsingPOSTPath = '/policy';
  static readonly updateDevicePolicyUsingPATCHPath = '/policy';
  static readonly getPolicyStatusUsingGETPath = '/policy/status/{policyId}';
  static readonly deletePolicyUsingDELETEPath = '/policy/{policyId}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param customerId customerId
   * @return OK
   */
  getAllPolicyUsingGETResponse(customerId: string): __Observable<__StrictHttpResponse<Array<PolicyResponseModel>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policies/${customerId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<PolicyResponseModel>>;
      })
    );
  }

  /**
   * @param customerId customerId
   * @return OK
   */
  getAllPolicyUsingGET(customerId: string): __Observable<Array<PolicyResponseModel>> {
    return this.getAllPolicyUsingGETResponse(customerId).pipe(
      __map(_r => _r.body as Array<PolicyResponseModel>)
    );
  }

  /**
   * @param devicePolicyRequestModel devicePolicyRequestModel
   * @return OK
   */
  createDevicePolicyUsingPOSTResponse(devicePolicyRequestModel: DevicePolicyRequestModel): __Observable<__StrictHttpResponse<DevicePolicyResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = devicePolicyRequestModel;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policy`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DevicePolicyResponseModel>;
      })
    );
  }

  /**
   * @param devicePolicyRequestModel devicePolicyRequestModel
   * @return OK
   */
  createDevicePolicyUsingPOST(devicePolicyRequestModel: DevicePolicyRequestModel): __Observable<DevicePolicyResponseModel> {
    return this.createDevicePolicyUsingPOSTResponse(devicePolicyRequestModel).pipe(
      __map(_r => _r.body as DevicePolicyResponseModel)
    );
  }

  /**
   * @param devicePolicyUpdateRequestModel devicePolicyUpdateRequestModel
   * @return OK
   */
  updateDevicePolicyUsingPATCHResponse(devicePolicyUpdateRequestModel: DevicePolicyUpdateRequestModel): __Observable<__StrictHttpResponse<DevicePolicyResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = devicePolicyUpdateRequestModel;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policy`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DevicePolicyResponseModel>;
      })
    );
  }

  /**
   * @param devicePolicyUpdateRequestModel devicePolicyUpdateRequestModel
   * @return OK
   */
  updateDevicePolicyUsingPATCH(devicePolicyUpdateRequestModel: DevicePolicyUpdateRequestModel): __Observable<DevicePolicyResponseModel> {
    return this.updateDevicePolicyUsingPATCHResponse(devicePolicyUpdateRequestModel).pipe(
      __map(_r => _r.body as DevicePolicyResponseModel)
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
      this.rootUrl + `/api/customerportal/controlpoint/v1/policy/status/${policyId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
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
  deletePolicyUsingDELETEResponse(policyId: string): __Observable<__StrictHttpResponse<DefaultResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policy/${policyId}`,
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
