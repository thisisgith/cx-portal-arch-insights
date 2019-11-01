/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { PartnerConfiguration as __Configuration } from '../partner-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { ContractResponse } from '../models/contract-response';
import { CustomerContact } from '../models/customer-contact';
import { Response } from '../models/response';
import { CustomerContactRequest } from '../models/customer-contact-request';
import { ContractInfoDetail } from '../models/contract-info-detail';
import { DigitalAssetsInfo } from '../models/digital-assets-info';

/**
 * REST APIs to fetch Customer Contracts information
 */
@Injectable({
  providedIn: 'root',
})
class ContractControllerService extends __BaseService {
  static readonly getAssetRatingInfoUsingGETPath = '/v1/customer/asset-rating/count';
  static readonly fetchCustomerContractsUsingGETPath = '/v1/customer/contracts';
  static readonly fetchAllContactsForContractUsingGETPath = '/v1/customer/contracts/contacts';
  static readonly addCustomerContactUsingPOSTPath = '/v1/customer/contracts/contacts';
  static readonly updateCustomerContactUsingPUTPath = '/v1/customer/contracts/contacts';
  static readonly deleteCustomerContactUsingDELETEPath = '/v1/customer/contracts/contacts/{contactId}';
  static readonly fetchContractsByFilterUsingGETPath = '/v1/customer/contracts/count';
  static readonly fetchContractsDetailsUsingGETPath = '/v1/customer/contracts/{contractId}';
  static readonly fetchDigitalAssetsInfoForCustomerUsingGETPath = '/v1/customer/digital-assets';
  static readonly getPortalAccessEnabledCustomersUsingGETPath = '/v1/customer/portal-access';
  static readonly getPortalAccessInfoUsingGETPath = '/v1/customer/portal-access/count';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `ContractControllerService.GetAssetRatingInfoUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched asset rating information
   */
  getAssetRatingInfoUsingGETResponse(params: ContractControllerService.GetAssetRatingInfoUsingGETParams): __Observable<__StrictHttpResponse<{}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/customer/asset-rating/count`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{}>;
      })
    );
  }

  /**
   * @param params The `ContractControllerService.GetAssetRatingInfoUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched asset rating information
   */
  getAssetRatingInfoUsingGET(params: ContractControllerService.GetAssetRatingInfoUsingGETParams): __Observable<{}> {
    return this.getAssetRatingInfoUsingGETResponse(params).pipe(
      __map(_r => _r.body as {})
    );
  }

  /**
   * @param params The `ContractControllerService.FetchCustomerContractsUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully Fetched Contract Details
   */
  fetchCustomerContractsUsingGETResponse(params: ContractControllerService.FetchCustomerContractsUsingGETParams): __Observable<__StrictHttpResponse<ContractResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/customer/contracts`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ContractResponse>;
      })
    );
  }

  /**
   * @param params The `ContractControllerService.FetchCustomerContractsUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully Fetched Contract Details
   */
  fetchCustomerContractsUsingGET(params: ContractControllerService.FetchCustomerContractsUsingGETParams): __Observable<ContractResponse> {
    return this.fetchCustomerContractsUsingGETResponse(params).pipe(
      __map(_r => _r.body as ContractResponse)
    );
  }

  /**
   * @param params The `ContractControllerService.FetchAllContactsForContractUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `contractId`: contractId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully Fetched All contacts for given contract
   */
  fetchAllContactsForContractUsingGETResponse(params: ContractControllerService.FetchAllContactsForContractUsingGETParams): __Observable<__StrictHttpResponse<Array<CustomerContact>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.contractId != null) __params = __params.set('contractId', params.contractId.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/customer/contracts/contacts`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CustomerContact>>;
      })
    );
  }

  /**
   * @param params The `ContractControllerService.FetchAllContactsForContractUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `contractId`: contractId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully Fetched All contacts for given contract
   */
  fetchAllContactsForContractUsingGET(params: ContractControllerService.FetchAllContactsForContractUsingGETParams): __Observable<Array<CustomerContact>> {
    return this.fetchAllContactsForContractUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<CustomerContact>)
    );
  }

  /**
   * @param params The `ContractControllerService.AddCustomerContactUsingPOSTParams` containing the following parameters:
   *
   * - `customerContactRequest`: customerContactRequest
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully added the Customer contact
   */
  addCustomerContactUsingPOSTResponse(params: ContractControllerService.AddCustomerContactUsingPOSTParams): __Observable<__StrictHttpResponse<Response>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = params.customerContactRequest;
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/customer/contracts/contacts`,
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
   * @param params The `ContractControllerService.AddCustomerContactUsingPOSTParams` containing the following parameters:
   *
   * - `customerContactRequest`: customerContactRequest
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully added the Customer contact
   */
  addCustomerContactUsingPOST(params: ContractControllerService.AddCustomerContactUsingPOSTParams): __Observable<Response> {
    return this.addCustomerContactUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as Response)
    );
  }

  /**
   * @param params The `ContractControllerService.UpdateCustomerContactUsingPUTParams` containing the following parameters:
   *
   * - `customerContactRequest`: customerContactRequest
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully updated the Customer contact
   */
  updateCustomerContactUsingPUTResponse(params: ContractControllerService.UpdateCustomerContactUsingPUTParams): __Observable<__StrictHttpResponse<Response>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = params.customerContactRequest;
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/customer/contracts/contacts`,
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
   * @param params The `ContractControllerService.UpdateCustomerContactUsingPUTParams` containing the following parameters:
   *
   * - `customerContactRequest`: customerContactRequest
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully updated the Customer contact
   */
  updateCustomerContactUsingPUT(params: ContractControllerService.UpdateCustomerContactUsingPUTParams): __Observable<Response> {
    return this.updateCustomerContactUsingPUTResponse(params).pipe(
      __map(_r => _r.body as Response)
    );
  }

  /**
   * @param params The `ContractControllerService.DeleteCustomerContactUsingDELETEParams` containing the following parameters:
   *
   * - `contactId`: contactId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully deleted the contract
   */
  deleteCustomerContactUsingDELETEResponse(params: ContractControllerService.DeleteCustomerContactUsingDELETEParams): __Observable<__StrictHttpResponse<Response>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/customer/contracts/contacts/${params.contactId}`,
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
   * @param params The `ContractControllerService.DeleteCustomerContactUsingDELETEParams` containing the following parameters:
   *
   * - `contactId`: contactId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully deleted the contract
   */
  deleteCustomerContactUsingDELETE(params: ContractControllerService.DeleteCustomerContactUsingDELETEParams): __Observable<Response> {
    return this.deleteCustomerContactUsingDELETEResponse(params).pipe(
      __map(_r => _r.body as Response)
    );
  }

  /**
   * @param params The `ContractControllerService.FetchContractsByFilterUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched Aggregation List
   */
  fetchContractsByFilterUsingGETResponse(params: ContractControllerService.FetchContractsByFilterUsingGETParams): __Observable<__StrictHttpResponse<{}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/customer/contracts/count`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{}>;
      })
    );
  }

  /**
   * @param params The `ContractControllerService.FetchContractsByFilterUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched Aggregation List
   */
  fetchContractsByFilterUsingGET(params: ContractControllerService.FetchContractsByFilterUsingGETParams): __Observable<{}> {
    return this.fetchContractsByFilterUsingGETResponse(params).pipe(
      __map(_r => _r.body as {})
    );
  }

  /**
   * @param params The `ContractControllerService.FetchContractsDetailsUsingGETParams` containing the following parameters:
   *
   * - `contractId`: Contract Id
   *
   * - `partnerId`: Partner Id (TODO to take from token)
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully Fetched Contract Detailed
   */
  fetchContractsDetailsUsingGETResponse(params: ContractControllerService.FetchContractsDetailsUsingGETParams): __Observable<__StrictHttpResponse<ContractInfoDetail>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/customer/contracts/${params.contractId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ContractInfoDetail>;
      })
    );
  }

  /**
   * @param params The `ContractControllerService.FetchContractsDetailsUsingGETParams` containing the following parameters:
   *
   * - `contractId`: Contract Id
   *
   * - `partnerId`: Partner Id (TODO to take from token)
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully Fetched Contract Detailed
   */
  fetchContractsDetailsUsingGET(params: ContractControllerService.FetchContractsDetailsUsingGETParams): __Observable<ContractInfoDetail> {
    return this.fetchContractsDetailsUsingGETResponse(params).pipe(
      __map(_r => _r.body as ContractInfoDetail)
    );
  }

  /**
   * @param params The `ContractControllerService.FetchDigitalAssetsInfoForCustomerUsingGETParams` containing the following parameters:
   *
   * - `customerId`: Customer Id
   *
   * - `partnerId`: Partner Id (TODO to take from token)
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched digital assets information for the given customer
   */
  fetchDigitalAssetsInfoForCustomerUsingGETResponse(params: ContractControllerService.FetchDigitalAssetsInfoForCustomerUsingGETParams): __Observable<__StrictHttpResponse<DigitalAssetsInfo>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.customerId != null) __params = __params.set('customerId', params.customerId.toString());
    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/customer/digital-assets`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DigitalAssetsInfo>;
      })
    );
  }

  /**
   * @param params The `ContractControllerService.FetchDigitalAssetsInfoForCustomerUsingGETParams` containing the following parameters:
   *
   * - `customerId`: Customer Id
   *
   * - `partnerId`: Partner Id (TODO to take from token)
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched digital assets information for the given customer
   */
  fetchDigitalAssetsInfoForCustomerUsingGET(params: ContractControllerService.FetchDigitalAssetsInfoForCustomerUsingGETParams): __Observable<DigitalAssetsInfo> {
    return this.fetchDigitalAssetsInfoForCustomerUsingGETResponse(params).pipe(
      __map(_r => _r.body as DigitalAssetsInfo)
    );
  }

  /**
   * @param params The `ContractControllerService.GetPortalAccessEnabledCustomersUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched asset rating information
   */
  getPortalAccessEnabledCustomersUsingGETResponse(params: ContractControllerService.GetPortalAccessEnabledCustomersUsingGETParams): __Observable<__StrictHttpResponse<Array<{}>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/customer/portal-access`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<{}>>;
      })
    );
  }

  /**
   * @param params The `ContractControllerService.GetPortalAccessEnabledCustomersUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched asset rating information
   */
  getPortalAccessEnabledCustomersUsingGET(params: ContractControllerService.GetPortalAccessEnabledCustomersUsingGETParams): __Observable<Array<{}>> {
    return this.getPortalAccessEnabledCustomersUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<{}>)
    );
  }

  /**
   * @param params The `ContractControllerService.GetPortalAccessInfoUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched portal access customer count details
   */
  getPortalAccessInfoUsingGETResponse(params: ContractControllerService.GetPortalAccessInfoUsingGETParams): __Observable<__StrictHttpResponse<{}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/customer/portal-access/count`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{}>;
      })
    );
  }

  /**
   * @param params The `ContractControllerService.GetPortalAccessInfoUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched portal access customer count details
   */
  getPortalAccessInfoUsingGET(params: ContractControllerService.GetPortalAccessInfoUsingGETParams): __Observable<{}> {
    return this.getPortalAccessInfoUsingGETResponse(params).pipe(
      __map(_r => _r.body as {})
    );
  }
}

module ContractControllerService {

  /**
   * Parameters for getAssetRatingInfoUsingGET
   */
  export interface GetAssetRatingInfoUsingGETParams {

    /**
     * partnerId
     */
    partnerId: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for fetchCustomerContractsUsingGET
   */
  export interface FetchCustomerContractsUsingGETParams {

    /**
     * partnerId
     */
    partnerId: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for fetchAllContactsForContractUsingGET
   */
  export interface FetchAllContactsForContractUsingGETParams {

    /**
     * partnerId
     */
    partnerId: string;

    /**
     * contractId
     */
    contractId: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for addCustomerContactUsingPOST
   */
  export interface AddCustomerContactUsingPOSTParams {

    /**
     * customerContactRequest
     */
    customerContactRequest: CustomerContactRequest;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for updateCustomerContactUsingPUT
   */
  export interface UpdateCustomerContactUsingPUTParams {

    /**
     * customerContactRequest
     */
    customerContactRequest: CustomerContactRequest;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for deleteCustomerContactUsingDELETE
   */
  export interface DeleteCustomerContactUsingDELETEParams {

    /**
     * contactId
     */
    contactId: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for fetchContractsByFilterUsingGET
   */
  export interface FetchContractsByFilterUsingGETParams {

    /**
     * partnerId
     */
    partnerId: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for fetchContractsDetailsUsingGET
   */
  export interface FetchContractsDetailsUsingGETParams {

    /**
     * Contract Id
     */
    contractId: string;

    /**
     * Partner Id (TODO to take from token)
     */
    partnerId?: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for fetchDigitalAssetsInfoForCustomerUsingGET
   */
  export interface FetchDigitalAssetsInfoForCustomerUsingGETParams {

    /**
     * Customer Id
     */
    customerId: string;

    /**
     * Partner Id (TODO to take from token)
     */
    partnerId?: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for getPortalAccessEnabledCustomersUsingGET
   */
  export interface GetPortalAccessEnabledCustomersUsingGETParams {

    /**
     * partnerId
     */
    partnerId: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for getPortalAccessInfoUsingGET
   */
  export interface GetPortalAccessInfoUsingGETParams {

    /**
     * partnerId
     */
    partnerId: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }
}

export { ContractControllerService }
