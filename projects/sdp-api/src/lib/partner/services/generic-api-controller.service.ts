/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { PartnerConfiguration as __Configuration } from '../partner-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CustomerInfo } from '../models/customer-info';
import { Response } from '../models/response';
import { DigitalAssets } from '../models/digital-assets';
import { SpecializationDetails } from '../models/specialization-details';
import { CompanyInfoList } from '../models/company-info-list';

/**
 * REST APIs to fetch Customer information
 */
@Injectable({
  providedIn: 'root',
})
class GenericApiControllerService extends __BaseService {
  static readonly getCustomerListOldUsingGETPath = '/v1/customers/{partnerId}';
  static readonly updateDigitalAssetsUsingPUTPath = '/v1/digitalAssets/count';
  static readonly getPartnerSpecializationLevelUsingGETPath = '/v1/internal/specialization';
  static readonly getPartnerListUsingGETPath = '/v1/{customerId}/partners';
  static readonly getCustomerListUsingGETPath = '/v1/{partnerId}/customers';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param partnerId partnerId
   * @return OK
   */
  getCustomerListOldUsingGETResponse(partnerId: string): __Observable<__StrictHttpResponse<Array<Array<CustomerInfo>>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/customers/${partnerId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<Array<CustomerInfo>>>;
      })
    );
  }

  /**
   * @param partnerId partnerId
   * @return OK
   */
  getCustomerListOldUsingGET(partnerId: string): __Observable<Array<Array<CustomerInfo>>> {
    return this.getCustomerListOldUsingGETResponse(partnerId).pipe(
      __map(_r => _r.body as Array<Array<CustomerInfo>>)
    );
  }

  /**
   * @param digitalAssets digitalAssets
   * @return Successfully updated the digital Assets for a  Customer
   */
  updateDigitalAssetsUsingPUTResponse(digitalAssets: DigitalAssets): __Observable<__StrictHttpResponse<Response>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = digitalAssets;
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/digitalAssets/count`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Response>;
      })
    );
  }

  /**
   * @param digitalAssets digitalAssets
   * @return Successfully updated the digital Assets for a  Customer
   */
  updateDigitalAssetsUsingPUT(digitalAssets: DigitalAssets): __Observable<Response> {
    return this.updateDigitalAssetsUsingPUTResponse(digitalAssets).pipe(
      __map(_r => _r.body as Response)
    );
  }

  /**
   * @param params The `GenericApiControllerService.GetPartnerSpecializationLevelUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `level`: level
   *
   * @return OK
   */
  getPartnerSpecializationLevelUsingGETResponse(params: GenericApiControllerService.GetPartnerSpecializationLevelUsingGETParams): __Observable<__StrictHttpResponse<Array<SpecializationDetails>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.level != null) __params = __params.set('level', params.level.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/internal/specialization`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<SpecializationDetails>>;
      })
    );
  }

  /**
   * @param params The `GenericApiControllerService.GetPartnerSpecializationLevelUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `level`: level
   *
   * @return OK
   */
  getPartnerSpecializationLevelUsingGET(params: GenericApiControllerService.GetPartnerSpecializationLevelUsingGETParams): __Observable<Array<SpecializationDetails>> {
    return this.getPartnerSpecializationLevelUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<SpecializationDetails>)
    );
  }

  /**
   * @param customerId customerId
   * @return Successfully Fetched list of partners for a given customer Id
   */
  getPartnerListUsingGETResponse(customerId: string): __Observable<__StrictHttpResponse<CompanyInfoList>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/${customerId}/partners`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CompanyInfoList>;
      })
    );
  }

  /**
   * @param customerId customerId
   * @return Successfully Fetched list of partners for a given customer Id
   */
  getPartnerListUsingGET(customerId: string): __Observable<CompanyInfoList> {
    return this.getPartnerListUsingGETResponse(customerId).pipe(
      __map(_r => _r.body as CompanyInfoList)
    );
  }

  /**
   * @param partnerId partnerId
   * @return Successfully Fetched list of customers for a given partner Id
   */
  getCustomerListUsingGETResponse(partnerId: string): __Observable<__StrictHttpResponse<CompanyInfoList>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/${partnerId}/customers`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CompanyInfoList>;
      })
    );
  }

  /**
   * @param partnerId partnerId
   * @return Successfully Fetched list of customers for a given partner Id
   */
  getCustomerListUsingGET(partnerId: string): __Observable<CompanyInfoList> {
    return this.getCustomerListUsingGETResponse(partnerId).pipe(
      __map(_r => _r.body as CompanyInfoList)
    );
  }
}

module GenericApiControllerService {

  /**
   * Parameters for getPartnerSpecializationLevelUsingGET
   */
  export interface GetPartnerSpecializationLevelUsingGETParams {

    /**
     * partnerId
     */
    partnerId?: string;

    /**
     * level
     */
    level?: string;
  }
}

export { GenericApiControllerService }
