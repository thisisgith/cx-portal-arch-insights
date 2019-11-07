/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { ControlPointsConfiguration as __Configuration } from '../control-points-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { PartnerViewDetailsResponseModel } from '../models/partner-view-details-response-model';
import { RoleDetailsResponseModel } from '../models/role-details-response-model';
import { SAUserResponseModel } from '../models/sauser-response-model';
import { SAMappingForPartnerCCOResponseModel } from '../models/samapping-for-partner-ccoresponse-model';
import { UserUpdateResponseModel } from '../models/user-update-response-model';
import { UserUpdateRequest } from '../models/user-update-request';
import { VADetailsResponseModel } from '../models/vadetails-response-model';
import { UserValidationResponseModel } from '../models/user-validation-response-model';
import { UserValidationRequestModel } from '../models/user-validation-request-model';
import { HADetailsResponseModel } from '../models/hadetails-response-model';
@Injectable({
  providedIn: 'root',
})
class ControlPointUserManagementAPIService extends __BaseService {
  static readonly getPartnerViewsMasterListUsingGETPath = '/users/partner/views/{companyAccountId}';
  static readonly getListRolesForGivenUserUsingGETPath = '/users/roles/{companyAccountId}';
  static readonly getUserDetailsListForGivenSAUsingGETPath = '/users/sa/{saAccountId}';
  static readonly getSaMappingsForPartnerCCOUsingGETPath = '/users/samapping/{ccoId}';
  static readonly updateUsersUsingPOSTPath = '/users/update/role';
  static readonly getVAListForGivenSACUsingGETPath = '/users/va/{saAccountId}';
  static readonly validateNewlyAddedUserUsingPOSTPath = '/users/validate';
  static readonly getUserHADetailsUsingGETPath = '/users/validate/ha/{ccoId}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param companyAccountId companyAccountId
   * @return OK
   */
  getPartnerViewsMasterListUsingGETResponse(companyAccountId: string): __Observable<__StrictHttpResponse<PartnerViewDetailsResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/controlpoint/v1/users/partner/views/${companyAccountId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<PartnerViewDetailsResponseModel>;
      })
    );
  }

  /**
   * @param companyAccountId companyAccountId
   * @return OK
   */
  getPartnerViewsMasterListUsingGET(companyAccountId: string): __Observable<PartnerViewDetailsResponseModel> {
    return this.getPartnerViewsMasterListUsingGETResponse(companyAccountId).pipe(
      __map(_r => _r.body as PartnerViewDetailsResponseModel)
    );
  }

  /**
   * @param companyAccountId companyAccountId
   * @return OK
   */
  getListRolesForGivenUserUsingGETResponse(companyAccountId: string): __Observable<__StrictHttpResponse<RoleDetailsResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/controlpoint/v1/users/roles/${companyAccountId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<RoleDetailsResponseModel>;
      })
    );
  }

  /**
   * @param companyAccountId companyAccountId
   * @return OK
   */
  getListRolesForGivenUserUsingGET(companyAccountId: string): __Observable<RoleDetailsResponseModel> {
    return this.getListRolesForGivenUserUsingGETResponse(companyAccountId).pipe(
      __map(_r => _r.body as RoleDetailsResponseModel)
    );
  }

  /**
   * @param saAccountId saAccountId
   * @return OK
   */
  getUserDetailsListForGivenSAUsingGETResponse(saAccountId: string): __Observable<__StrictHttpResponse<SAUserResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/controlpoint/v1/users/sa/${saAccountId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SAUserResponseModel>;
      })
    );
  }

  /**
   * @param saAccountId saAccountId
   * @return OK
   */
  getUserDetailsListForGivenSAUsingGET(saAccountId: string): __Observable<SAUserResponseModel> {
    return this.getUserDetailsListForGivenSAUsingGETResponse(saAccountId).pipe(
      __map(_r => _r.body as SAUserResponseModel)
    );
  }

  /**
   * @param ccoId ccoId
   * @return OK
   */
  getSaMappingsForPartnerCCOUsingGETResponse(ccoId: string): __Observable<__StrictHttpResponse<SAMappingForPartnerCCOResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/controlpoint/v1/users/samapping/${ccoId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<SAMappingForPartnerCCOResponseModel>;
      })
    );
  }

  /**
   * @param ccoId ccoId
   * @return OK
   */
  getSaMappingsForPartnerCCOUsingGET(ccoId: string): __Observable<SAMappingForPartnerCCOResponseModel> {
    return this.getSaMappingsForPartnerCCOUsingGETResponse(ccoId).pipe(
      __map(_r => _r.body as SAMappingForPartnerCCOResponseModel)
    );
  }

  /**
   * @param requestModel requestModel
   * @return OK
   */
  updateUsersUsingPOSTResponse(requestModel: Array<UserUpdateRequest>): __Observable<__StrictHttpResponse<UserUpdateResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = requestModel;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/customerportal/controlpoint/v1/users/update/role`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UserUpdateResponseModel>;
      })
    );
  }

  /**
   * @param requestModel requestModel
   * @return OK
   */
  updateUsersUsingPOST(requestModel: Array<UserUpdateRequest>): __Observable<UserUpdateResponseModel> {
    return this.updateUsersUsingPOSTResponse(requestModel).pipe(
      __map(_r => _r.body as UserUpdateResponseModel)
    );
  }

  /**
   * @param saAccountId saAccountId
   * @return OK
   */
  getVAListForGivenSACUsingGETResponse(saAccountId: string): __Observable<__StrictHttpResponse<VADetailsResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/controlpoint/v1/users/va/${saAccountId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<VADetailsResponseModel>;
      })
    );
  }

  /**
   * @param saAccountId saAccountId
   * @return OK
   */
  getVAListForGivenSACUsingGET(saAccountId: string): __Observable<VADetailsResponseModel> {
    return this.getVAListForGivenSACUsingGETResponse(saAccountId).pipe(
      __map(_r => _r.body as VADetailsResponseModel)
    );
  }

  /**
   * @param requestModel requestModel
   * @return OK
   */
  validateNewlyAddedUserUsingPOSTResponse(requestModel: UserValidationRequestModel): __Observable<__StrictHttpResponse<UserValidationResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = requestModel;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/customerportal/controlpoint/v1/users/validate`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UserValidationResponseModel>;
      })
    );
  }

  /**
   * @param requestModel requestModel
   * @return OK
   */
  validateNewlyAddedUserUsingPOST(requestModel: UserValidationRequestModel): __Observable<UserValidationResponseModel> {
    return this.validateNewlyAddedUserUsingPOSTResponse(requestModel).pipe(
      __map(_r => _r.body as UserValidationResponseModel)
    );
  }

  /**
   * @param ccoId ccoId
   * @return OK
   */
  getUserHADetailsUsingGETResponse(ccoId: string): __Observable<__StrictHttpResponse<HADetailsResponseModel>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/customerportal/controlpoint/v1/users/validate/ha/${ccoId}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<HADetailsResponseModel>;
      })
    );
  }

  /**
   * @param ccoId ccoId
   * @return OK
   */
  getUserHADetailsUsingGET(ccoId: string): __Observable<HADetailsResponseModel> {
    return this.getUserHADetailsUsingGETResponse(ccoId).pipe(
      __map(_r => _r.body as HADetailsResponseModel)
    );
  }
}

module ControlPointUserManagementAPIService {
}

export { ControlPointUserManagementAPIService }
