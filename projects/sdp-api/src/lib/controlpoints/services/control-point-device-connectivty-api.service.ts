/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { DevicesConnectivityResponseModel } from '../models/devices-connectivity-response-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointDeviceConnectivtyAPIService extends __BaseService {
  static readonly getDevicesConnectivityUsingGETPath = '/v1/device/connectivity/{customerId}/{serialNumber}/{productId}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `ControlPointDeviceConnectivtyAPIService.GetDevicesConnectivityUsingGETParams` containing the following parameters:
   *
   * - `serialNumber`: serialNumber
   *
   * - `productId`: productId
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getDevicesConnectivityUsingGETResponse(params: ControlPointDeviceConnectivtyAPIService.GetDevicesConnectivityUsingGETParams): __Observable<__StrictHttpResponse<DevicesConnectivityResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;




    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/controlpoint/v1/device/connectivity/${params.customerId}/${params.serialNumber}/${params.productId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DevicesConnectivityResponseModel>;
      })
    );
  }

  /**
   * @param params The `ControlPointDeviceConnectivtyAPIService.GetDevicesConnectivityUsingGETParams` containing the following parameters:
   *
   * - `serialNumber`: serialNumber
   *
   * - `productId`: productId
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getDevicesConnectivityUsingGET(params: ControlPointDeviceConnectivtyAPIService.GetDevicesConnectivityUsingGETParams): __Observable<DevicesConnectivityResponseModel> {
    return this.getDevicesConnectivityUsingGETResponse(params).pipe(
      __map(_r => _r.body as DevicesConnectivityResponseModel)
    );
  }
}

module ControlPointDeviceConnectivtyAPIService {

  /**
   * Parameters for getDevicesConnectivityUsingGET
   */
  export interface GetDevicesConnectivityUsingGETParams {

    /**
     * serialNumber
     */
    serialNumber: string;

    /**
     * productId
     */
    productId: string;

    /**
     * customerId
     */
    customerId: string;
  }
}

export { ControlPointDeviceConnectivtyAPIService }
