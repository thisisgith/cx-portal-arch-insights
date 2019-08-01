/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { DefaultResponseModel } from '../models/default-response-model';
import { IERegistrationRequestModel } from '../models/ieregistration-request-model';
import { IERegistrationResponseModel } from '../models/ieregistration-response-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointIERegistrationAPIService extends __BaseService {
  static readonly createIERegistrationUsingPOSTPath = '/register/ie';
  static readonly getIERegistrationUsingGETPath = '/registration/ie/{customerId}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param ieRegistrationRequestModel ieRegistrationRequestModel
   * @return OK
   */
  createIERegistrationUsingPOSTResponse(ieRegistrationRequestModel: IERegistrationRequestModel): __Observable<__StrictHttpResponse<DefaultResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = ieRegistrationRequestModel;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/customerportal/controlpoint/v1/register/ie`,
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
   * @param ieRegistrationRequestModel ieRegistrationRequestModel
   * @return OK
   */
  createIERegistrationUsingPOST(ieRegistrationRequestModel: IERegistrationRequestModel): __Observable<DefaultResponseModel> {
    return this.createIERegistrationUsingPOSTResponse(ieRegistrationRequestModel).pipe(
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
      this.rootUrl + `/api/customerportal/controlpoint/v1/registration/ie/${customerId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
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
