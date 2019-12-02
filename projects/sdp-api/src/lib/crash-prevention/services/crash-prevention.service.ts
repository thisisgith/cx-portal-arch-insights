/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { CrashPreventionConfiguration as __Configuration } from '../crash-prevention-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { IDeviceInfo } from '@sdp-api';
import { IProductFamily } from '../models/productfamily-info';
import { IListdevice } from '../models/listdevice-info';
import { Icomparison } from '../models/comparison-info';

@Injectable({
  providedIn: 'root',
})
class CrashPreventionService extends __BaseService {
  static readonly getComparisonPath = '/customerportal/fingerprint/v1/compare-devices/';
  static readonly getProductPath = '/customerportal/fingerprint/v1/list-product-families/';
  static readonly getListdevicePath = '/customerportal/fingerprint/v1/list-devices/';
  static readonly getDeviceInfoPath = '/customerportal/fingerprint/v1/device-details/';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }


  /**API to get all the fingerPrintdetails
   * @param params The `CrashPreventionService.GetComparisonParams` containing the following parameters:
   *
   * - `customerId`: Unique identifier of a Cisco customer.
   *
   * @return successful operation
   */
  getIComparisonResponse(params: CrashPreventionService.GetComparisonParams): __Observable<__StrictHttpResponse<Icomparison>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __params = __params.set('deviceId1', params.deviceId1);
	__params = __params.set('deviceId2', params.deviceId2);
	if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
	if (params.solution != null) __params = __params.set('solution', params.solution.toString());

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `${ CrashPreventionService.getComparisonPath}`+ params.customerId,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Icomparison>;
      })
    );
  }


  /**
   * API to get all fingerPrint details device information
   * @param params The `CrashPreventionService.GetDeviceParams` containing the following parameters:
   *
   *  - `customerId`: Unique identifier of a Cisco customer.
   */
  getDeviceInfoResponse(params: CrashPreventionService.GetDeviceParams): __Observable<__StrictHttpResponse<IDeviceInfo>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
	let pfURL: string = '';

	if (params.useCase != null) __params = __params.set('useCase', params.useCase.toString());
	if (params.solution != null) __params = __params.set('solution', params.solution.toString());
    if (params.customerId != null && params.customerId != '') {
      pfURL = this.rootUrl + `${CrashPreventionService.getDeviceInfoPath}` + params.customerId + '/' + btoa(params.deviceId) + '/';
    }
    let req = new HttpRequest<any>(
      'GET',
      pfURL,
      __body,
      {
		headers: __headers,
		params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<IDeviceInfo>;

      })
    );
  }


  /**
   * API to get all fingerPrint details ProductFamily  information
   * @param params The `CrashPreventionService.GetDeviceParams` containing the following parameters:
   *
   *  - `customerId`: Unique identifier of a Cisco customer.:
   *
   */
  getProductFamilyResponse(params: CrashPreventionService.GetProductFamilyParams): __Observable<__StrictHttpResponse<IProductFamily>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let pfURL: string = '';

    if (params.customerId != null && params.customerId != '') {
      pfURL = this.rootUrl + `${ CrashPreventionService.getProductPath}` + params.customerId + '/' ;
    }
    let req = new HttpRequest<any>(
      'GET',
      pfURL,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<IProductFamily>;
      })
    );
  }


  /**
   * API to get all fingerPrint details List of device  information
   * @param params The `CrashPreventionService.GetDeviceParams` containing the following parameters:
   *
   *  - `customerId`: Unique identifier of a Cisco customer.:
   *
   */
  getlistdeviceResponse(params: CrashPreventionService.GetlistdeviceParams): __Observable<__StrictHttpResponse<IListdevice>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let pfURL: string = '';

    if (params.customerId != null && params.customerId != '') {
      pfURL = this.rootUrl + `${CrashPreventionService.getListdevicePath}` + params.customerId + '/' + btoa(params.productId) + '/';
    }

    let req = new HttpRequest<any>(
      'GET',
      pfURL,

      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<IListdevice>;
      })
    );
  }

  /**
   * @param params The `CrashPreventionService.GetHardwareParams` containing the following parameters:
   *
   * @return successful operation
   */
  getComparison(params: CrashPreventionService.GetComparisonParams): __Observable<Icomparison> {
    return this.getIComparisonResponse(params).pipe(
      __map(_r => _r.body as Icomparison)
    );
  }

  getDeviceInfo(params: CrashPreventionService.GetDeviceParams): __Observable<IDeviceInfo> {
    return this.getDeviceInfoResponse(params).pipe(
      __map(_r => _r.body as IDeviceInfo)

    );
  }

  getProductFamily(params: CrashPreventionService.GetProductFamilyParams): __Observable<IProductFamily> {
    return this.getProductFamilyResponse(params).pipe(
      __map(_r => _r.body as IProductFamily)
    );
  }

  getListdevice(params: CrashPreventionService.GetlistdeviceParams): __Observable<IListdevice> {
    return this.getlistdeviceResponse(params).pipe(
      __map(_r => _r.body as IListdevice)
    );
  }


}

module CrashPreventionService {
  /**
   * Parameters for comparisonview
   */
  export interface GetComparisonParams {
    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;
    deviceId1: string;
	deviceId2: string;
	solution?: string;
	useCase?: string;
  }

  /**
   * Parameters for getDevice
   */
  export interface GetDeviceParams {
    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;
	deviceId?: any;
	solution?: string;
	useCase?: string;
  }
  export interface GetProductFamilyParams {
    /**
     * Unique identifier of a Cisco customer.
     */
	customerId: string;
	productFamilies: string;
	productFamily: string;
    productId: string;
  }
  export interface GetlistdeviceParams {
    /**
     * Unique identifier of a Cisco customer.
     */
    customerId: string;
    productId: string;
  }
}
export { CrashPreventionService }
