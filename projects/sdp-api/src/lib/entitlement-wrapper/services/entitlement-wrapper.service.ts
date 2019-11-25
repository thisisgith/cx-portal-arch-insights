/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { EntitlementWrapperConfiguration as __Configuration } from '../entitlement-wrapper-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { UserEntitlement } from '../models/user-entitlement';

/**
 * Entitlement Wrapper APIs to get the user profile, accounts, roles and Methods from SAAdmin and EB APIs. Provides more granular APIs to authorize the requests with the given user, comapny id , role and methods.
 */
@Injectable({
  providedIn: 'root',
})
class EntitlementWrapperService extends __BaseService {
  static readonly userAccountsPath = '/v1/entitlement/user/accounts';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `EntitlementWrapperService.UserAccountsParams` containing the following parameters:
   *
   * - `accountType`: Account Type
   *   ALL - provides all the accounts user associated
   *   HOLDING - provides only partner accounts
   *   CUSTOMER - provides only customer accounts
   *   VIRTUAL - provides smartaccounts where user associated to virtual account role only
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return OK
   */
  userAccountsResponse(params: EntitlementWrapperService.UserAccountsParams): __Observable<__StrictHttpResponse<UserEntitlement>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.accountType != null) __params = __params.set('accountType', params.accountType.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxportal/cxpp-entitlement-wrapper/v1/entitlement/user/accounts`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UserEntitlement>;
      })
    );
  }

  /**
   * @param params The `EntitlementWrapperService.UserAccountsParams` containing the following parameters:
   *
   * - `accountType`: Account Type
   *   ALL - provides all the accounts user associated
   *   HOLDING - provides only partner accounts
   *   CUSTOMER - provides only customer accounts
   *   VIRTUAL - provides smartaccounts where user associated to virtual account role only
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return OK
   */
  userAccounts(params: EntitlementWrapperService.UserAccountsParams): __Observable<UserEntitlement> {
    return this.userAccountsResponse(params).pipe(
      __map(_r => _r.body as UserEntitlement)
    );
  }
}

module EntitlementWrapperService {

  /**
   * Parameters for userAccounts
   */
  export interface UserAccountsParams {

    /**
     * Account Type
     * ALL - provides all the accounts user associated
     * HOLDING - provides only partner accounts
     * CUSTOMER - provides only customer accounts
     * VIRTUAL - provides smartaccounts where user associated to virtual account role only
     */
    accountType?: 'ALL' | 'CUSTOMER' | 'HOLDING' | 'VIRTUAL';

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }
}

export { EntitlementWrapperService }
