/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { PartnerConfiguration as __Configuration } from '../partner-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CompanyDetails } from '../models/company-details';
import { UserDetails } from '../models/user-details';
import { Response } from '../models/response';

/**
 * REST APIs to fetch partner profile information
 */
@Injectable({
  providedIn: 'root',
})
class PartnerProfileControllerService extends __BaseService {
  static readonly fetchCompanyProfileUsingGETPath = '/v1/partner/profile';
  static readonly fetchUserProfileUsingGETPath = '/v1/partner/profile/user';
  static readonly uploadProfilePictureUsingPOSTPath = '/v1/partner/profile/user/picture';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `PartnerProfileControllerService.FetchCompanyProfileUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Company Details Successfully Fetched
   */
  fetchCompanyProfileUsingGETResponse(params: PartnerProfileControllerService.FetchCompanyProfileUsingGETParams): __Observable<__StrictHttpResponse<CompanyDetails>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.partnerId != null) __params = __params.set('partnerId', params.partnerId.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/partner/profile`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CompanyDetails>;
      })
    );
  }

  /**
   * @param params The `PartnerProfileControllerService.FetchCompanyProfileUsingGETParams` containing the following parameters:
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Company Details Successfully Fetched
   */
  fetchCompanyProfileUsingGET(params: PartnerProfileControllerService.FetchCompanyProfileUsingGETParams): __Observable<CompanyDetails> {
    return this.fetchCompanyProfileUsingGETResponse(params).pipe(
      __map(_r => _r.body as CompanyDetails)
    );
  }

  /**
   * @param Authorization Mashery user credential header
   * @return User Details Successfully Fetched
   */
  fetchUserProfileUsingGETResponse(Authorization?: string): __Observable<__StrictHttpResponse<UserDetails>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (Authorization != null) __headers = __headers.set('Authorization', Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/partner/profile/user`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UserDetails>;
      })
    );
  }

  /**
   * @param Authorization Mashery user credential header
   * @return User Details Successfully Fetched
   */
  fetchUserProfileUsingGET(Authorization?: string): __Observable<UserDetails> {
    return this.fetchUserProfileUsingGETResponse(Authorization).pipe(
      __map(_r => _r.body as UserDetails)
    );
  }

  /**
   * @param params The `PartnerProfileControllerService.UploadProfilePictureUsingPOSTParams` containing the following parameters:
   *
   * - `profilePicture`: profilePicture
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully uploaded picture to URI <URI_VALUE>
   */
  uploadProfilePictureUsingPOSTResponse(params: PartnerProfileControllerService.UploadProfilePictureUsingPOSTParams): __Observable<__StrictHttpResponse<Response>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let __formData = new FormData();
    __body = __formData;

    __headers = __headers.append("Content-Type", "multipart/form-data");
   if(params.profilePicture !== null && typeof params.profilePicture !== "undefined") { __formData.append('profilePicture', params.profilePicture as string | Blob);}
   if(params.partnerId !== null && typeof params.partnerId !== "undefined") { __formData.append('partnerId', params.partnerId as string | Blob);}
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/partner/profile/user/picture`,
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
   * @param params The `PartnerProfileControllerService.UploadProfilePictureUsingPOSTParams` containing the following parameters:
   *
   * - `profilePicture`: profilePicture
   *
   * - `partnerId`: partnerId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully uploaded picture to URI <URI_VALUE>
   */
  uploadProfilePictureUsingPOST(params: PartnerProfileControllerService.UploadProfilePictureUsingPOSTParams): __Observable<Response> {
    return this.uploadProfilePictureUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as Response)
    );
  }
}

module PartnerProfileControllerService {

  /**
   * Parameters for fetchCompanyProfileUsingGET
   */
  export interface FetchCompanyProfileUsingGETParams {

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
   * Parameters for uploadProfilePictureUsingPOST
   */
  export interface UploadProfilePictureUsingPOSTParams {

    /**
     * profilePicture
     */
    profilePicture: Blob;

    /**
     * partnerId
     */
    partnerId?: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }
}

export { PartnerProfileControllerService }
