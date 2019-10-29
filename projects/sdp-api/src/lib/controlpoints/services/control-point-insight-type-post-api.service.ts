/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { InsightTypeRequestModel } from '../models/insight-type-request-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointInsightTypePostAPIService extends __BaseService {
  static readonly saveInsightTypeUsingPOSTPath = '/settings/insight';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param InsightTypeRequestModel InsightTypeRequestModel
   * @return OK
   */
  saveInsightTypeUsingPOSTResponse(InsightTypeRequestModel: InsightTypeRequestModel): __Observable<__StrictHttpResponse<InsightTypeRequestModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = InsightTypeRequestModel;
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
        return _r as __StrictHttpResponse<InsightTypeRequestModel>;
      })
    );
  }

  /**
   * @param InsightTypeRequestModel InsightTypeRequestModel
   * @return OK
   */
  saveInsightTypeUsingPOST(InsightTypeRequestModel: InsightTypeRequestModel): __Observable<InsightTypeRequestModel> {
    return this.saveInsightTypeUsingPOSTResponse(InsightTypeRequestModel).pipe(
      __map(_r => _r.body as InsightTypeRequestModel)
    );
  }
}

module ControlPointInsightTypePostAPIService {
}

export { ControlPointInsightTypePostAPIService }
