/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { IEHealthStatusResponseModel } from '../models/iehealth-status-response-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointIEHealthStatusAPIService extends __BaseService {
  static readonly getIEHealthStatusUsingGETPath = '/ie/health-status/{customerId}';

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
  getIEHealthStatusUsingGETResponse(customerId: string): __Observable<__StrictHttpResponse<Array<IEHealthStatusResponseModel>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/controlpoint/v1/ie/health-status/${customerId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<IEHealthStatusResponseModel>>;
      })
    );
  }

  /**
   * @param customerId customerId
   * @return OK
   */
  getIEHealthStatusUsingGET(customerId: string): __Observable<Array<IEHealthStatusResponseModel>> {
    return this.getIEHealthStatusUsingGETResponse(customerId).pipe(
      __map(_r => _r.body as Array<IEHealthStatusResponseModel>)
    );
  }
}

module ControlPointIEHealthStatusAPIService {
}

export { ControlPointIEHealthStatusAPIService }
