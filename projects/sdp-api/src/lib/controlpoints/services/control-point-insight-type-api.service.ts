/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { InsightTypeResponseModel } from '../models/insight-type-response-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointInsightTypeAPIService extends __BaseService {
  static readonly getInsightTypeUsingGETPath = '/settings/insight/{customerId}/{insightType}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `ControlPointInsightTypeAPIService.GetInsightTypeUsingGETParams` containing the following parameters:
   *
   * - `insightType`: insightType
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getInsightTypeUsingGETResponse(params: ControlPointInsightTypeAPIService.GetInsightTypeUsingGETParams): __Observable<__StrictHttpResponse<Array<InsightTypeResponseModel>>> {
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
        return _r as __StrictHttpResponse<Array<InsightTypeResponseModel>>;
      })
    );
  }

  /**
   * @param params The `ControlPointInsightTypeAPIService.GetInsightTypeUsingGETParams` containing the following parameters:
   *
   * - `insightType`: insightType
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getInsightTypeUsingGET(params: ControlPointInsightTypeAPIService.GetInsightTypeUsingGETParams): __Observable<Array<InsightTypeResponseModel>> {
    return this.getInsightTypeUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<InsightTypeResponseModel>)
    );
  }
}

module ControlPointInsightTypeAPIService {

  /**
   * Parameters for getInsightTypeUsingGET
   */
  export interface GetInsightTypeUsingGETParams {

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

export { ControlPointInsightTypeAPIService }
