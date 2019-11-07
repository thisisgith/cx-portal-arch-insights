/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { DeviceDetailsByPage } from '../models/device-details-by-page';
@Injectable({
  providedIn: 'root',
})
class ControlPointDeviceDiscoveryAPIService extends __BaseService {
  static readonly getDevicesUsingGETPath = '/devices/{customerId}/{solution}/{useCase}/{pageNumber}/{rowsPerPage}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `ControlPointDeviceDiscoveryAPIService.GetDevicesUsingGETParams` containing the following parameters:
   *
   * - `useCase`: useCase
   *
   * - `solution`: solution
   *
   * - `rowsPerPage`: rowsPerPage
   *
   * - `pageNumber`: pageNumber
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getDevicesUsingGETResponse(params: ControlPointDeviceDiscoveryAPIService.GetDevicesUsingGETParams): __Observable<__StrictHttpResponse<DeviceDetailsByPage>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;






    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/controlpoint/v1/devices/${params.customerId}/${params.solution}/${params.useCase}/${params.pageNumber}/${params.rowsPerPage}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DeviceDetailsByPage>;
      })
    );
  }

  /**
   * @param params The `ControlPointDeviceDiscoveryAPIService.GetDevicesUsingGETParams` containing the following parameters:
   *
   * - `useCase`: useCase
   *
   * - `solution`: solution
   *
   * - `rowsPerPage`: rowsPerPage
   *
   * - `pageNumber`: pageNumber
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getDevicesUsingGET(params: ControlPointDeviceDiscoveryAPIService.GetDevicesUsingGETParams): __Observable<DeviceDetailsByPage> {
    return this.getDevicesUsingGETResponse(params).pipe(
      __map(_r => _r.body as DeviceDetailsByPage)
    );
  }
}

module ControlPointDeviceDiscoveryAPIService {

  /**
   * Parameters for getDevicesUsingGET
   */
  export interface GetDevicesUsingGETParams {

    /**
     * useCase
     */
    useCase: string;

    /**
     * solution
     */
    solution: string;

    /**
     * rowsPerPage
     */
    rowsPerPage: string;

    /**
     * pageNumber
     */
    pageNumber: string;

    /**
     * customerId
     */
    customerId: string;
  }
}

export { ControlPointDeviceDiscoveryAPIService }
