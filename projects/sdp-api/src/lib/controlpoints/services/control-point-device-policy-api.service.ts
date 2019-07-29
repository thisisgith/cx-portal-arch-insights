/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { PolicyResponseModel } from '../models/policy-response-model';
import { PoliciesGroupByDayInAMonthModel } from '../models/policies-group-by-day-in-amonth-model';
import { DevicePolicyResponseModel } from '../models/device-policy-response-model';
import { DevicePolicyRequestModel } from '../models/device-policy-request-model';
import { DevicePolicyUpdateRequestModel } from '../models/device-policy-update-request-model';
import { DeviceDetailsByPage } from '../models/device-details-by-page';
import { DevicePolicyStatusResponseModel } from '../models/device-policy-status-response-model';
import { DefaultResponseModel } from '../models/default-response-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointDevicePolicyAPIService extends __BaseService {
  static readonly getAllPolicyUsingGETPath = '/policies/{customerId}';
  static readonly getAllPolicyForGivenMonthUsingGETPath = '/policies/{customerId}/{month}/{year}';
  static readonly createDevicePolicyUsingPOSTPath = '/policy';
  static readonly updateDevicePolicyUsingPATCHPath = '/policy';
  static readonly getDevicesForPolicyCreationUsingGETPath = '/policy/devices/{customerId}';
  static readonly getDevicesForPolicyCreationUsingGET1Path = '/policy/devices/{customerId}/{pageNumber}/{rowsPerPage}';
  static readonly getDevicesForGivenPolicyUsingGETPath = '/policy/devices/{customerId}/{policyId}';
  static readonly getDevicesForGivenPolicyUsingGET1Path = '/policy/devices/{customerId}/{policyId}/{pageNumber}/{rowsPerPage}';
  static readonly getPolicyStatusUsingGETPath = '/policy/status/{policyId}';
  static readonly deletePolicyUsingDELETEPath = '/policy/{customerId}/{policyId}';

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
  getAllPolicyUsingGETResponse(customerId: string): __Observable<__StrictHttpResponse<Array<PolicyResponseModel>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policies/${customerId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<PolicyResponseModel>>;
      })
    );
  }

  /**
   * @param customerId customerId
   * @return OK
   */
  getAllPolicyUsingGET(customerId: string): __Observable<Array<PolicyResponseModel>> {
    return this.getAllPolicyUsingGETResponse(customerId).pipe(
      __map(_r => _r.body as Array<PolicyResponseModel>)
    );
  }

  /**
   * @param params The `ControlPointDevicePolicyAPIService.GetAllPolicyForGivenMonthUsingGETParams` containing the following parameters:
   *
   * - `year`: year
   *
   * - `month`: month
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getAllPolicyForGivenMonthUsingGETResponse(params: ControlPointDevicePolicyAPIService.GetAllPolicyForGivenMonthUsingGETParams): __Observable<__StrictHttpResponse<Array<PoliciesGroupByDayInAMonthModel>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;




    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policies/${params.customerId}/${params.month}/${params.year}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<PoliciesGroupByDayInAMonthModel>>;
      })
    );
  }

  /**
   * @param params The `ControlPointDevicePolicyAPIService.GetAllPolicyForGivenMonthUsingGETParams` containing the following parameters:
   *
   * - `year`: year
   *
   * - `month`: month
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getAllPolicyForGivenMonthUsingGET(params: ControlPointDevicePolicyAPIService.GetAllPolicyForGivenMonthUsingGETParams): __Observable<Array<PoliciesGroupByDayInAMonthModel>> {
    return this.getAllPolicyForGivenMonthUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<PoliciesGroupByDayInAMonthModel>)
    );
  }

  /**
   * @param devicePolicyRequestModel devicePolicyRequestModel
   * @return OK
   */
  createDevicePolicyUsingPOSTResponse(devicePolicyRequestModel: DevicePolicyRequestModel): __Observable<__StrictHttpResponse<DevicePolicyResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = devicePolicyRequestModel;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policy`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DevicePolicyResponseModel>;
      })
    );
  }

  /**
   * @param devicePolicyRequestModel devicePolicyRequestModel
   * @return OK
   */
  createDevicePolicyUsingPOST(devicePolicyRequestModel: DevicePolicyRequestModel): __Observable<DevicePolicyResponseModel> {
    return this.createDevicePolicyUsingPOSTResponse(devicePolicyRequestModel).pipe(
      __map(_r => _r.body as DevicePolicyResponseModel)
    );
  }

  /**
   * @param devicePolicyUpdateRequestModel devicePolicyUpdateRequestModel
   * @return OK
   */
  updateDevicePolicyUsingPATCHResponse(devicePolicyUpdateRequestModel: DevicePolicyUpdateRequestModel): __Observable<__StrictHttpResponse<DevicePolicyResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = devicePolicyUpdateRequestModel;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policy`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DevicePolicyResponseModel>;
      })
    );
  }

  /**
   * @param devicePolicyUpdateRequestModel devicePolicyUpdateRequestModel
   * @return OK
   */
  updateDevicePolicyUsingPATCH(devicePolicyUpdateRequestModel: DevicePolicyUpdateRequestModel): __Observable<DevicePolicyResponseModel> {
    return this.updateDevicePolicyUsingPATCHResponse(devicePolicyUpdateRequestModel).pipe(
      __map(_r => _r.body as DevicePolicyResponseModel)
    );
  }

  /**
   * @param params The `ControlPointDevicePolicyAPIService.GetDevicesForPolicyCreationUsingGETParams` containing the following parameters:
   *
   * - `rowsPerPage`: rowsPerPage
   *
   * - `pageNumber`: pageNumber
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getDevicesForPolicyCreationUsingGETResponse(params: ControlPointDevicePolicyAPIService.GetDevicesForPolicyCreationUsingGETParams): __Observable<__StrictHttpResponse<DeviceDetailsByPage>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;




    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policy/devices/${params.customerId}`,
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
   * @param params The `ControlPointDevicePolicyAPIService.GetDevicesForPolicyCreationUsingGETParams` containing the following parameters:
   *
   * - `rowsPerPage`: rowsPerPage
   *
   * - `pageNumber`: pageNumber
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getDevicesForPolicyCreationUsingGET(params: ControlPointDevicePolicyAPIService.GetDevicesForPolicyCreationUsingGETParams): __Observable<DeviceDetailsByPage> {
    return this.getDevicesForPolicyCreationUsingGETResponse(params).pipe(
      __map(_r => _r.body as DeviceDetailsByPage)
    );
  }

  /**
   * @param params The `ControlPointDevicePolicyAPIService.GetDevicesForPolicyCreationUsingGET1Params` containing the following parameters:
   *
   * - `rowsPerPage`: rowsPerPage
   *
   * - `pageNumber`: pageNumber
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getDevicesForPolicyCreationUsingGET1Response(params: ControlPointDevicePolicyAPIService.GetDevicesForPolicyCreationUsingGET1Params): __Observable<__StrictHttpResponse<DeviceDetailsByPage>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;




    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policy/devices/${params.customerId}/${params.pageNumber}/${params.rowsPerPage}`,
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
   * @param params The `ControlPointDevicePolicyAPIService.GetDevicesForPolicyCreationUsingGET1Params` containing the following parameters:
   *
   * - `rowsPerPage`: rowsPerPage
   *
   * - `pageNumber`: pageNumber
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getDevicesForPolicyCreationUsingGET1(params: ControlPointDevicePolicyAPIService.GetDevicesForPolicyCreationUsingGET1Params): __Observable<DeviceDetailsByPage> {
    return this.getDevicesForPolicyCreationUsingGET1Response(params).pipe(
      __map(_r => _r.body as DeviceDetailsByPage)
    );
  }

  /**
   * @param params The `ControlPointDevicePolicyAPIService.GetDevicesForGivenPolicyUsingGETParams` containing the following parameters:
   *
   * - `rowsPerPage`: rowsPerPage
   *
   * - `policyId`: policyId
   *
   * - `pageNumber`: pageNumber
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getDevicesForGivenPolicyUsingGETResponse(params: ControlPointDevicePolicyAPIService.GetDevicesForGivenPolicyUsingGETParams): __Observable<__StrictHttpResponse<DeviceDetailsByPage>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;





    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policy/devices/${params.customerId}/${params.policyId}`,
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
   * @param params The `ControlPointDevicePolicyAPIService.GetDevicesForGivenPolicyUsingGETParams` containing the following parameters:
   *
   * - `rowsPerPage`: rowsPerPage
   *
   * - `policyId`: policyId
   *
   * - `pageNumber`: pageNumber
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getDevicesForGivenPolicyUsingGET(params: ControlPointDevicePolicyAPIService.GetDevicesForGivenPolicyUsingGETParams): __Observable<DeviceDetailsByPage> {
    return this.getDevicesForGivenPolicyUsingGETResponse(params).pipe(
      __map(_r => _r.body as DeviceDetailsByPage)
    );
  }

  /**
   * @param params The `ControlPointDevicePolicyAPIService.GetDevicesForGivenPolicyUsingGET1Params` containing the following parameters:
   *
   * - `rowsPerPage`: rowsPerPage
   *
   * - `policyId`: policyId
   *
   * - `pageNumber`: pageNumber
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getDevicesForGivenPolicyUsingGET1Response(params: ControlPointDevicePolicyAPIService.GetDevicesForGivenPolicyUsingGET1Params): __Observable<__StrictHttpResponse<DeviceDetailsByPage>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;





    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policy/devices/${params.customerId}/${params.policyId}/${params.pageNumber}/${params.rowsPerPage}`,
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
   * @param params The `ControlPointDevicePolicyAPIService.GetDevicesForGivenPolicyUsingGET1Params` containing the following parameters:
   *
   * - `rowsPerPage`: rowsPerPage
   *
   * - `policyId`: policyId
   *
   * - `pageNumber`: pageNumber
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  getDevicesForGivenPolicyUsingGET1(params: ControlPointDevicePolicyAPIService.GetDevicesForGivenPolicyUsingGET1Params): __Observable<DeviceDetailsByPage> {
    return this.getDevicesForGivenPolicyUsingGET1Response(params).pipe(
      __map(_r => _r.body as DeviceDetailsByPage)
    );
  }

  /**
   * @param policyId policyId
   * @return OK
   */
  getPolicyStatusUsingGETResponse(policyId: string): __Observable<__StrictHttpResponse<DevicePolicyStatusResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policy/status/${policyId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DevicePolicyStatusResponseModel>;
      })
    );
  }

  /**
   * @param policyId policyId
   * @return OK
   */
  getPolicyStatusUsingGET(policyId: string): __Observable<DevicePolicyStatusResponseModel> {
    return this.getPolicyStatusUsingGETResponse(policyId).pipe(
      __map(_r => _r.body as DevicePolicyStatusResponseModel)
    );
  }

  /**
   * @param params The `ControlPointDevicePolicyAPIService.DeletePolicyUsingDELETEParams` containing the following parameters:
   *
   * - `policyId`: policyId
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  deletePolicyUsingDELETEResponse(params: ControlPointDevicePolicyAPIService.DeletePolicyUsingDELETEParams): __Observable<__StrictHttpResponse<DefaultResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/api/customerportal/controlpoint/v1/policy/${params.customerId}/${params.policyId}`,
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
   * @param params The `ControlPointDevicePolicyAPIService.DeletePolicyUsingDELETEParams` containing the following parameters:
   *
   * - `policyId`: policyId
   *
   * - `customerId`: customerId
   *
   * @return OK
   */
  deletePolicyUsingDELETE(params: ControlPointDevicePolicyAPIService.DeletePolicyUsingDELETEParams): __Observable<DefaultResponseModel> {
    return this.deletePolicyUsingDELETEResponse(params).pipe(
      __map(_r => _r.body as DefaultResponseModel)
    );
  }
}

module ControlPointDevicePolicyAPIService {

  /**
   * Parameters for getAllPolicyForGivenMonthUsingGET
   */
  export interface GetAllPolicyForGivenMonthUsingGETParams {

    /**
     * year
     */
    year: string;

    /**
     * month
     */
    month: string;

    /**
     * customerId
     */
    customerId: string;
  }

  /**
   * Parameters for getDevicesForPolicyCreationUsingGET
   */
  export interface GetDevicesForPolicyCreationUsingGETParams {

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

  /**
   * Parameters for getDevicesForPolicyCreationUsingGET1
   */
  export interface GetDevicesForPolicyCreationUsingGET1Params {

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

  /**
   * Parameters for getDevicesForGivenPolicyUsingGET
   */
  export interface GetDevicesForGivenPolicyUsingGETParams {

    /**
     * rowsPerPage
     */
    rowsPerPage: string;

    /**
     * policyId
     */
    policyId: string;

    /**
     * pageNumber
     */
    pageNumber: string;

    /**
     * customerId
     */
    customerId: string;
  }

  /**
   * Parameters for getDevicesForGivenPolicyUsingGET1
   */
  export interface GetDevicesForGivenPolicyUsingGET1Params {

    /**
     * rowsPerPage
     */
    rowsPerPage: string;

    /**
     * policyId
     */
    policyId: string;

    /**
     * pageNumber
     */
    pageNumber: string;

    /**
     * customerId
     */
    customerId: string;
  }

  /**
   * Parameters for deletePolicyUsingDELETE
   */
  export interface DeletePolicyUsingDELETEParams {

    /**
     * policyId
     */
    policyId: string;

    /**
     * customerId
     */
    customerId: string;
  }
}

export { ControlPointDevicePolicyAPIService }
