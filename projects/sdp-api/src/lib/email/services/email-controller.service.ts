/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { EmailConfiguration as __Configuration } from '../email-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { EmailEntitySchema } from '../models/email-entity-schema';
import { EmailRequest } from '../models/email-request';

/**
 * Common service to send email
 */
@Injectable({
  providedIn: 'root',
})
class EmailControllerService extends __BaseService {
  static readonly fetchByFiltersUsingGETPath = '/v1/list';
  static readonly sendEmailUsingPOSTPath = '/v1/send';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param params The `EmailControllerService.FetchByFiltersUsingGETParams` containing the following parameters:
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * - `to`: To
   *
   * - `status`: Email Status
   *
   * - `sender`: Sender
   *
   * - `offset`: Pagination: offset
   *
   * - `limit`: Pagination: number of expected results
   *
   * - `from`: From
   *
   * - `emailId`: Email Id
   *
   * @return Successfully retrieved results
   */
  fetchByFiltersUsingGETResponse(params: EmailControllerService.FetchByFiltersUsingGETParams): __Observable<__StrictHttpResponse<Array<EmailEntitySchema>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    if (params.XMasheryHandshake != null) __headers = __headers.set('X-Mashery-Handshake', params.XMasheryHandshake.toString());
    if (params.to != null) __params = __params.set('to', params.to.toString());
    if (params.status != null) __params = __params.set('status', params.status.toString());
    if (params.sender != null) __params = __params.set('sender', params.sender.toString());
    if (params.offset != null) __params = __params.set('offset', params.offset.toString());
    if (params.limit != null) __params = __params.set('limit', params.limit.toString());
    if (params.from != null) __params = __params.set('from', params.from.toString());
    if (params.emailId != null) __params = __params.set('emailId', params.emailId.toString());
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/email/v1/list`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<EmailEntitySchema>>;
      })
    );
  }

  /**
   * @param params The `EmailControllerService.FetchByFiltersUsingGETParams` containing the following parameters:
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * - `to`: To
   *
   * - `status`: Email Status
   *
   * - `sender`: Sender
   *
   * - `offset`: Pagination: offset
   *
   * - `limit`: Pagination: number of expected results
   *
   * - `from`: From
   *
   * - `emailId`: Email Id
   *
   * @return Successfully retrieved results
   */
  fetchByFiltersUsingGET(params: EmailControllerService.FetchByFiltersUsingGETParams): __Observable<Array<EmailEntitySchema>> {
    return this.fetchByFiltersUsingGETResponse(params).pipe(
      __map(_r => _r.body as Array<EmailEntitySchema>)
    );
  }

  /**
   * @param params The `EmailControllerService.SendEmailUsingPOSTParams` containing the following parameters:
   *
   * - `emailRequest`: JSON Body for the Group Training Request
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully sent email
   */
  sendEmailUsingPOSTResponse(params: EmailControllerService.SendEmailUsingPOSTParams): __Observable<__StrictHttpResponse<string>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    __headers = __headers.append("Content-Type", "application/json");
    __body = params.emailRequest;
    if (params.XMasheryHandshake != null) __headers = __headers.set('X-Mashery-Handshake', params.XMasheryHandshake.toString());
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/email/v1/send`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text',
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<string>;
      })
    );
  }

  /**
   * @param params The `EmailControllerService.SendEmailUsingPOSTParams` containing the following parameters:
   *
   * - `emailRequest`: JSON Body for the Group Training Request
   *
   * - `X-Mashery-Handshake`: Mashery user credential header
   *
   * @return Successfully sent email
   */
  sendEmailUsingPOST(params: EmailControllerService.SendEmailUsingPOSTParams): __Observable<string> {
    return this.sendEmailUsingPOSTResponse(params).pipe(
      __map(_r => _r.body as string)
    );
  }
}

module EmailControllerService {

  /**
   * Parameters for fetchByFiltersUsingGET
   */
  export interface FetchByFiltersUsingGETParams {

    /**
     * Mashery user credential header
     */
    XMasheryHandshake: string;

    /**
     * To
     */
    to?: string;

    /**
     * Email Status
     */
    status?: 'Sent' | 'Failed';

    /**
     * Sender
     */
    sender?: string;

    /**
     * Pagination: offset
     */
    offset?: string;

    /**
     * Pagination: number of expected results
     */
    limit?: string;

    /**
     * From
     */
    from?: string;

    /**
     * Email Id
     */
    emailId?: string;
  }

  /**
   * Parameters for sendEmailUsingPOST
   */
  export interface SendEmailUsingPOSTParams {

    /**
     * JSON Body for the Group Training Request
     */
    emailRequest: EmailRequest;

    /**
     * Mashery user credential header
     */
    XMasheryHandshake: string;
  }
}

export { EmailControllerService }
