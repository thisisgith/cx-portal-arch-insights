/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { stat } from 'fs';

@Injectable({
  providedIn: 'root',
})
class ControlPointAdminComplienceService extends __BaseService {

    static readonly getLeftSideTagsResponsePath = '/customerportal/asset-tagging/v1/tag-to-device-api';
    static getRightSideTagsResponsePath = '/customerportal/asset-tagging/v1/tag-policy-mapping-api';
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
  getLeftSideTags(param): __Observable<any> {
    return this.getLeftSideTagsResponse(param).pipe(
      __map(_r => _r.body as any)
    );
  }


  /**
   * @param requestModel requestModel
   * @return OK
   */
  getLeftSideTagsResponse(param): __Observable<__StrictHttpResponse<any>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + ControlPointAdminComplienceService.getLeftSideTagsResponsePath+'/'+param,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<any>;
      })
    );
  }

  /**
   * @param requestModel requestModel
   * @return OK
   */
  getRightSideTags(param): __Observable<any> {
    return this.getRightSideTagsResponse(param).pipe(
      __map(_r => _r.body as any)
    );
  }


  /**
   * @param requestModel requestModel
   * @return OK
   */
  getRightSideTagsResponse(param): __Observable<__StrictHttpResponse<any>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + ControlPointAdminComplienceService.getRightSideTagsResponsePath+'/'+param,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<any>;
      })
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

export { ControlPointAdminComplienceService }
