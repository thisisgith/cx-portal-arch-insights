/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { PartnerConfiguration as __Configuration } from '../partner-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { ApiResponse } from '../models/api-response';
import { Response } from '../models/response';
import { ContractNotes } from '../models/contract-notes';
import { ContractNotesRequest } from '../models/contract-notes-request';

/**
 * REST APIs related to user contract notes!
 */
@Injectable({
  providedIn: 'root',
})
class UserContractNotesControllerService extends __BaseService {
  static readonly getContractNotesUsingGETPath = '/v1/user/contract/notes';
  static readonly createContractNotesUsingPOSTPath = '/v1/user/contract/notes';
  static readonly modifyContractNotesUsingPUTPath = '/v1/user/contract/notes';
  static readonly deleteContractNotesUsingDELETEPath = '/v1/user/contract/notes/{documentId}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `UserContractNotesControllerService.GetContractNotesUsingGETParams` containing the following parameters:
   *
   * - `contractNumber`: contractNumber
   *
   * - `size`: size
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched the notes
   */
  getContractNotesUsingGETResponse(params: UserContractNotesControllerService.GetContractNotesUsingGETParams): __Observable<__StrictHttpResponse<ApiResponse>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.contractNumber != null) __params = __params.set('contractNumber', params.contractNumber.toString());
    if (params.size != null) __params = __params.set('size', params.size.toString());
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/user/contract/notes`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ApiResponse>;
      })
    );
  }

  /**
   * @param params The `UserContractNotesControllerService.GetContractNotesUsingGETParams` containing the following parameters:
   *
   * - `contractNumber`: contractNumber
   *
   * - `size`: size
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully fetched the notes
   */
  getContractNotesUsingGET(params: UserContractNotesControllerService.GetContractNotesUsingGETParams): __Observable<ApiResponse> {
    return this.getContractNotesUsingGETResponse(params).pipe(
      __map(_r => _r.body as ApiResponse)
    );
  }

  /**
   * @param params The `UserContractNotesControllerService.CreateContractNotesUsingPOSTParams` containing the following parameters:
   *
   * - `notes`: notes
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully created a new note
   */
  createContractNotesUsingPOSTResponse(params: UserContractNotesControllerService.CreateContractNotesUsingPOSTParams): __Observable<__StrictHttpResponse<Response>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = params.notes;
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/user/contract/notes`,
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
   * @param params The `UserContractNotesControllerService.CreateContractNotesUsingPOSTParams` containing the following parameters:
   *
   * - `notes`: notes
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully created a new note
   */
  createContractNotesUsingPOST(params: UserContractNotesControllerService.CreateContractNotesUsingPOSTParams): __Observable<Response> {
    return this.createContractNotesUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as Response)
    );
  }

  /**
   * @param params The `UserContractNotesControllerService.ModifyContractNotesUsingPUTParams` containing the following parameters:
   *
   * - `notes`: notes
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully update the note
   */
  modifyContractNotesUsingPUTResponse(params: UserContractNotesControllerService.ModifyContractNotesUsingPUTParams): __Observable<__StrictHttpResponse<Response>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = params.notes;
    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'PUT',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/user/contract/notes`,
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
   * @param params The `UserContractNotesControllerService.ModifyContractNotesUsingPUTParams` containing the following parameters:
   *
   * - `notes`: notes
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully update the note
   */
  modifyContractNotesUsingPUT(params: UserContractNotesControllerService.ModifyContractNotesUsingPUTParams): __Observable<Response> {
    return this.modifyContractNotesUsingPUTResponse(params).pipe(
      __map(_r => _r.body as Response)
    );
  }

  /**
   * @param params The `UserContractNotesControllerService.DeleteContractNotesUsingDELETEParams` containing the following parameters:
   *
   * - `documentId`: documentId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully deleted the note
   */
  deleteContractNotesUsingDELETEResponse(params: UserContractNotesControllerService.DeleteContractNotesUsingDELETEParams): __Observable<__StrictHttpResponse<Response>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    if (params.Authorization != null) __headers = __headers.set('Authorization', params.Authorization.toString());
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/cxpp-partner-info/partnerInfo/v1/user/contract/notes/${params.documentId}`,
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
   * @param params The `UserContractNotesControllerService.DeleteContractNotesUsingDELETEParams` containing the following parameters:
   *
   * - `documentId`: documentId
   *
   * - `Authorization`: Mashery user credential header
   *
   * @return Successfully deleted the note
   */
  deleteContractNotesUsingDELETE(params: UserContractNotesControllerService.DeleteContractNotesUsingDELETEParams): __Observable<Response> {
    return this.deleteContractNotesUsingDELETEResponse(params).pipe(
      __map(_r => _r.body as Response)
    );
  }
}

module UserContractNotesControllerService {

  /**
   * Parameters for getContractNotesUsingGET
   */
  export interface GetContractNotesUsingGETParams {

    /**
     * contractNumber
     */
    contractNumber: string;

    /**
     * size
     */
    size?: number;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for createContractNotesUsingPOST
   */
  export interface CreateContractNotesUsingPOSTParams {

    /**
     * notes
     */
    notes: ContractNotes;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for modifyContractNotesUsingPUT
   */
  export interface ModifyContractNotesUsingPUTParams {

    /**
     * notes
     */
    notes: ContractNotesRequest;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }

  /**
   * Parameters for deleteContractNotesUsingDELETE
   */
  export interface DeleteContractNotesUsingDELETEParams {

    /**
     * documentId
     */
    documentId: string;

    /**
     * Mashery user credential header
     */
    Authorization?: string;
  }
}

export { UserContractNotesControllerService }
