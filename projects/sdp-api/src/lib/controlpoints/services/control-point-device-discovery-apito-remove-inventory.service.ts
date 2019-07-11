/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { RemoveDevicesResponseModel } from '../models/remove-devices-response-model';
import { RemoveDevicesRequestModel } from '../models/remove-devices-request-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointDeviceDiscoveryAPIToRemoveInventoryService extends __BaseService {
  static readonly removeDevicesUsingPOSTPath = '/v1/remove/devices';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param removeDevicesRequestModel removeDevicesRequestModel
   * @return OK
   */
  removeDevicesUsingPOSTResponse(removeDevicesRequestModel: RemoveDevicesRequestModel): __Observable<__StrictHttpResponse<RemoveDevicesResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = removeDevicesRequestModel;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/v1/remove/devices`,
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
        return _r as __StrictHttpResponse<RemoveDevicesResponseModel>;
      })
    );
  }

  /**
   * @param removeDevicesRequestModel removeDevicesRequestModel
   * @return OK
   */
  removeDevicesUsingPOST(removeDevicesRequestModel: RemoveDevicesRequestModel): __Observable<RemoveDevicesResponseModel> {
    return this.removeDevicesUsingPOSTResponse(removeDevicesRequestModel).pipe(
      __map(_r => _r.body as RemoveDevicesResponseModel)
    );
  }
}

module ControlPointDeviceDiscoveryAPIToRemoveInventoryService {
}

export { ControlPointDeviceDiscoveryAPIToRemoveInventoryService }
