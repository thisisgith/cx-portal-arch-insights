/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { LicenseDataResponseModel } from '../models/license-data-response-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointLicenseAPIService extends __BaseService {
  static readonly getLicenseUsingGETPath = '/license/{customerId}/{hostName}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `ControlPointLicenseAPIService.GetLicenseUsingGETParams` containing the following parameters:
   *
   * - `hostName`: hostName
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getLicenseUsingGETResponse(params: ControlPointLicenseAPIService.GetLicenseUsingGETParams): __Observable<__StrictHttpResponse<LicenseDataResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/controlpoint/v1/license/${params.customerId}/${params.hostName}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<LicenseDataResponseModel>;
      })
    );
  }

  /**
   * @param params The `ControlPointLicenseAPIService.GetLicenseUsingGETParams` containing the following parameters:
   *
   * - `hostName`: hostName
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getLicenseUsingGET(params: ControlPointLicenseAPIService.GetLicenseUsingGETParams): __Observable<LicenseDataResponseModel> {
    return this.getLicenseUsingGETResponse(params).pipe(
      __map(_r => _r.body as LicenseDataResponseModel)
    );
  }
}

module ControlPointLicenseAPIService {

  /**
   * Parameters for getLicenseUsingGET
   */
  export interface GetLicenseUsingGETParams {

    /**
     * hostName
     */
    hostName: string;

    /**
     * customerId
     */
    customerId: string;
  }
}

export { ControlPointLicenseAPIService }
