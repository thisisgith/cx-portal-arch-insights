/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { EntitlementConfiguration as __Configuration } from '../entitlement-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter, tap } from 'rxjs/operators';

import { User } from '../models/user';
import { Affiliation } from '../models/affiliation';
import { ServiceInfoResponse } from '../models/service-info-response';
@Injectable({
  providedIn: 'root',
})
class EntitlementService extends __BaseService {
  static readonly getUserPath = '/user';
  static readonly getUserAffiliationPath = '/user/party/affiliation/{customerId}';
  static readonly getServiceInfoPath = '/party/service-info/{customerId}';
  static readonly getServiceInfoBySerialPath = '/party/service-info/product/{serialNumber}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  getNewUser(): __Observable<__StrictHttpResponse<User>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let reqz = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxportal/cxpp-entitlement-wrapper/v1/entitlement/user/accounts?accountType=CUSTOMER`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(reqz).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<User>;
      }),
      tap(_r => {
        console.log('BRAND NEW API: ', _r)
      })
    );
  }

  /**
   * Returns information for this user (identified by the request credentials once the user logs in to the portal via ccoId). This includes the user's role and party affiliation
   * @return successful operation
   */
  getUserResponse(): __Observable<__StrictHttpResponse<User>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/entitlement/v1/user`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<User>;
      })
    );
  }

  /**
   * Returns information for this user (identified by the request credentials once the user logs in to the portal via ccoId). This includes the user's role and party affiliation
   * @return successful operation
   */
  getUserz(): __Observable<User> {
    return this.getUserResponse().pipe(
      __map(_r => _r.body as User)
    );
  }

  getUser(): __Observable<User> {
    return this.getUserResponse().pipe(
      __map(_r => {
        // TODO: Undo temp changes
        const mockCompanyList = {
          companyList: [
            {
              companyName: 'Verizon',
              companyId: 100117,
              domainIdentifier: 'verizon.com',
              accountType: 'CUSTOMER',
              roleList: [
                {
                  roleName: 'AccountAdmin',
                  roleDisplayName: 'Smart Account Administrator',
                  tenant: 'SMARTACC',
                  tenantDisplayName: 'Smart Account Management',
                  attribType: null,
                  attribValue: null,
                  attribName: null
                }
              ]
            },
            {
              companyName: 'Presidio Networked Solutions',
              companyId: 100527,
              domainIdentifier: 'presidio.com',
              accountType: 'HOLDING',
              roleList: [
                {
                  roleName: 'AccountAdmin',
                  roleDisplayName: 'Smart Account Administrator',
                  tenant: 'SMARTACC',
                  tenantDisplayName: 'Smart Account Management',
                  attribType: null,
                  attribValue: null,
                  attribName: null
                }
              ]
            },
            {
              companyName: 'CISCO SYSTEMS INC - CREDIT CARD',
              companyId: 293532,
              domainIdentifier: 'ppadmin.cisco.com',
              accountType: 'HOLDING',
              roleList: [
                {
                  roleName: 'AccountAdmin',
                  roleDisplayName: 'Smart Account Administrator',
                  tenant: 'SMARTACC',
                  tenantDisplayName: 'Smart Account Management',
                  attribType: null,
                  attribValue: null,
                  attribName: null
                },
                {
                  roleName: 'AccountApprover',
                  roleDisplayName: 'Smart Account Approver',
                  tenant: 'SMARTACC',
                  tenantDisplayName: 'Smart Account Management',
                  attribType: null,
                  attribValue: null,
                  attribName: null
                }
              ]
            },
            {
              companyName: 'AMDOCS BCS INC',
              companyId: 294166,
              domainIdentifier: 'cxpartner-stage.cisco.com',
              accountType: 'CUSTOMER',
              roleList: [
                {
                  roleName: 'AccountApprover',
                  roleDisplayName: 'Smart Account Approver',
                  tenant: 'SMARTACC',
                  tenantDisplayName: 'Smart Account Management',
                  attribType: null,
                  attribValue: null,
                  attribName: null
                },
                {
                  roleName: 'AccountAdmin',
                  roleDisplayName: 'Smart Account Administrator',
                  tenant: 'SMARTACC',
                  tenantDisplayName: 'Smart Account Management',
                  attribType: null,
                  attribValue: null,
                  attribName: null
                }
              ]
            }
          ]
        }
        return {
          accessLevel: 2,
          ..._r.body,
          ...mockCompanyList
        } as User;
      })
    );
  }

  /**
   * Prior to granting access to party data the user - party affiliation must be verified
   * @param customerId The partyId to be verified for the requesting user
   * @return successful operation
   */
  getUserAffiliationResponse(customerId: string): __Observable<__StrictHttpResponse<Affiliation>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/entitlement/v1/user/party/affiliation/${customerId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Affiliation>;
      })
    );
  }

  /**
   * Prior to granting access to party data the user - party affiliation must be verified
   * @param customerId The partyId to be verified for the requesting user
   * @return successful operation
   */
  getUserAffiliation(customerId: string): __Observable<Affiliation> {
    return this.getUserAffiliationResponse(customerId).pipe(
      __map(_r => _r.body as Affiliation)
    );
  }

  /**
   * Returns solution, use case and the max CX level for the identified customer. The requesting user must be affiliated to the party otherwise the request is rejected
   * @param customerId The partyId to be verified for the requesting user
   * @return successful operation
   */
  getServiceInfoResponse(customerId: string): __Observable<__StrictHttpResponse<ServiceInfoResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/entitlement/v1/party/service-info/${customerId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ServiceInfoResponse>;
      })
    );
  }

  /**
   * Returns solution, use case and the max CX level for the identified customer. The requesting user must be affiliated to the party otherwise the request is rejected
   * @param customerId The partyId to be verified for the requesting user
   * @return successful operation
   */
  getServiceInfo(customerId: string): __Observable<ServiceInfoResponse> {
    return this.getServiceInfoResponse(customerId).pipe(
      __map(_r => _r.body as ServiceInfoResponse)
    );
  }

  /**
   * Returns solution, use case and the CX level for the product identified by serialNumber and productId
   * @param params The `EntitlementService.GetServiceInfoBySerialParams` containing the following parameters:
   *
   * - `serialNumber`: The transaction id for the request.
   *
   * - `productId`: The transaction id for the request.
   *
   * @return successful operation
   */
  getServiceInfoBySerialResponse(params: EntitlementService.GetServiceInfoBySerialParams): __Observable<__StrictHttpResponse<ServiceInfoResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    if (params.productId != null) __params = __params.set('productId', params.productId.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/entitlement/v1/party/service-info/product/${params.serialNumber}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ServiceInfoResponse>;
      })
    );
  }

  /**
   * Returns solution, use case and the CX level for the product identified by serialNumber and productId
   * @param params The `EntitlementService.GetServiceInfoBySerialParams` containing the following parameters:
   *
   * - `serialNumber`: The transaction id for the request.
   *
   * - `productId`: The transaction id for the request.
   *
   * @return successful operation
   */
  getServiceInfoBySerial(params: EntitlementService.GetServiceInfoBySerialParams): __Observable<ServiceInfoResponse> {
    return this.getServiceInfoBySerialResponse(params).pipe(
      __map(_r => _r.body as ServiceInfoResponse)
    );
  }
}

module EntitlementService {

  /**
   * Parameters for getServiceInfoBySerial
   */
  export interface GetServiceInfoBySerialParams {

    /**
     * The transaction id for the request.
     */
    serialNumber: string;

    /**
     * The transaction id for the request.
     */
    productId?: string;
  }
}

export { EntitlementService }
