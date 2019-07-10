/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { IEStatusResponseModel } from '../models/iestatus-response-model';
import { IERegistrationResponseModel } from '../models/ieregistration-response-model';
import { IERegistrationRequestModel } from '../models/ieregistration-request-model';
import { DefaultResponseModel } from '../models/default-response-model';
import { IERegistrationUpdateRequestModel } from '../models/ieregistration-update-request-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointIERegistrationAPIService extends __BaseService {
  static readonly getIERegistrationStatusUsingGETPath = '/v1/ie/status/{customerId}';
  static readonly createIERegistrationUsingPOSTPath = '/v1/register/ie';
  static readonly updateIERegistrationUsingPOSTPath = '/v1/registration/ie/status';
  static readonly getIERegistrationUsingGETPath = '/v1/registration/ie/{customerId}';

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
      this.rootUrl + `/v1/ie/status/${customerId}`,
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
   * @param ieRegistrationRequestModel ieRegistrationRequestModel
   * @return OK
   */
  createIERegistrationUsingPOSTResponse(ieRegistrationRequestModel: IERegistrationRequestModel): __Observable<__StrictHttpResponse<IERegistrationResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = ieRegistrationRequestModel;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/v1/register/ie`,
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
        return _r as __StrictHttpResponse<IERegistrationResponseModel>;
      })
    );
  }

  /**
   * @param ieRegistrationRequestModel ieRegistrationRequestModel
   * @return OK
   */
  createIERegistrationUsingPOST(ieRegistrationRequestModel: IERegistrationRequestModel): __Observable<IERegistrationResponseModel> {
    return this.createIERegistrationUsingPOSTResponse(ieRegistrationRequestModel).pipe(
      __map(_r => _r.body as IERegistrationResponseModel)
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
    __body = ieRegistrationUpdateRequestModel;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/v1/registration/ie/status`,
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
   * @param ieRegistrationUpdateRequestModel ieRegistrationUpdateRequestModel
   * @return OK
   */
  updateIERegistrationUsingPOST(ieRegistrationUpdateRequestModel: IERegistrationUpdateRequestModel): __Observable<DefaultResponseModel> {
    return this.updateIERegistrationUsingPOSTResponse(ieRegistrationUpdateRequestModel).pipe(
      __map(_r => _r.body as DefaultResponseModel)
    );
  }

  /**
   * @param customerId customerId
   * @return OK
   */
  getIERegistrationUsingGETResponse(customerId: string): __Observable<__StrictHttpResponse<Array<IERegistrationResponseModel>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/v1/registration/ie/${customerId}`,
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
        return _r as __StrictHttpResponse<Array<IERegistrationResponseModel>>;
      })
    );
  }

  /**
   * @param customerId customerId
   * @return OK
   */
  getIERegistrationUsingGET(customerId: string): __Observable<Array<IERegistrationResponseModel>> {
    return this.getIERegistrationUsingGETResponse(customerId).pipe(
      __map(_r => _r.body as Array<IERegistrationResponseModel>)
    );
  }
}

module ControlPointIERegistrationAPIService {
}

export { ControlPointIERegistrationAPIService }
