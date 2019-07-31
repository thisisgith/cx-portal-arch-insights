/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { IEStatusResponseModel } from '../models/iestatus-response-model';
import { DevicePolicyResponseModel } from '../models/device-policy-response-model';
import { DefaultResponseModel } from '../models/default-response-model';
import { IERegistrationUpdateRequestModel } from '../models/ieregistration-update-request-model';

/**
 * Control Point API Controller
 */
@Injectable({
  providedIn: 'root',
})
class ControlPointApiControllerService extends __BaseService {
  static readonly getIERegistrationStatusUsingGETPath = '/ie/status/{customerId}';
  static readonly getDevicePolicyUsingGETPath = '/policy/{policyId}';
  static readonly updateIERegistrationUsingPOSTPath = '/registration/ie/status';

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
  getIERegistrationStatusUsingGETResponse(customerId: string): __Observable<__StrictHttpResponse<Array<IEStatusResponseModel>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/controlpoint/v1/ie/status/${customerId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<IEStatusResponseModel>>;
      })
    );
  }

  /**
   * @param customerId customerId
   * @return OK
   */
  getIERegistrationStatusUsingGET(customerId: string): __Observable<Array<IEStatusResponseModel>> {
    return this.getIERegistrationStatusUsingGETResponse(customerId).pipe(
      __map(_r => _r.body as Array<IEStatusResponseModel>)
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
      this.rootUrl + `/controlpoint/v1/policy/${policyId}`,
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
   * @param policyId policyId
   * @return OK
   */
  getDevicePolicyUsingGET(policyId: string): __Observable<DevicePolicyResponseModel> {
    return this.getDevicePolicyUsingGETResponse(policyId).pipe(
      __map(_r => _r.body as DevicePolicyResponseModel)
    );
  }

  /**
   * @param ieRegistrationUpdateRequestModel ieRegistrationUpdateRequestModel
   * @return OK
   */
  updateIERegistrationUsingPOSTResponse(ieRegistrationUpdateRequestModel: IERegistrationUpdateRequestModel): __Observable<__StrictHttpResponse<DefaultResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = ieRegistrationUpdateRequestModel;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/controlpoint/v1/registration/ie/status`,
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
   * @param ieRegistrationUpdateRequestModel ieRegistrationUpdateRequestModel
   * @return OK
   */
  updateIERegistrationUsingPOST(ieRegistrationUpdateRequestModel: IERegistrationUpdateRequestModel): __Observable<DefaultResponseModel> {
    return this.updateIERegistrationUsingPOSTResponse(ieRegistrationUpdateRequestModel).pipe(
      __map(_r => _r.body as DefaultResponseModel)
    );
  }
}

module ControlPointApiControllerService {
}

export { ControlPointApiControllerService }
