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
import { ContactSupportResponse } from '../models/contact-support-response';

/**
 * Common service to send email
 */
@Injectable({
	providedIn: 'root',
})
class EmailControllerService extends __BaseService {
	static readonly getEmailsByFilterPath = '/list';
	static readonly sendEmailPath = '/send';
	static readonly contactSupportPath = '/customerportal/criticalBugs/v1/mail/sendEmail';

	constructor (
		config: __Configuration,
		http: HttpClient
	) {
		super(config, http);
	}

	/**
	 * @param params The `EmailControllerService.GetEmailsByFilterParams` containing the following parameters:
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
	getEmailsByFilterResponse (params: EmailControllerService.GetEmailsByFilterParams): __Observable<__StrictHttpResponse<Array<EmailEntitySchema>>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		if (params.to != null) __params = __params.set('to', params.to.toString());
		if (params.status != null) __params = __params.set('status', params.status.toString());
		if (params.sender != null) __params = __params.set('sender', params.sender.toString());
		if (params.offset != null) __params = __params.set('offset', params.offset.toString());
		if (params.limit != null) __params = __params.set('limit', params.limit.toString());
		if (params.from != null) __params = __params.set('from', params.from.toString());
		if (params.emailId != null) __params = __params.set('emailId', params.emailId.toString());
		let req = new HttpRequest<any>(
			'GET',
			this.rootUrl + `/customerportal/email/v1/list`,
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
	 * @param params The `EmailControllerService.GetEmailsByFilterParams` containing the following parameters:
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
	getEmailsByFilter (params: EmailControllerService.GetEmailsByFilterParams): __Observable<Array<EmailEntitySchema>> {
		return this.getEmailsByFilterResponse(params).pipe(
			__map(_r => _r.body as Array<EmailEntitySchema>)
		);
	}

	/**
	 * @param emailRequest JSON Body for the Group Training Request
	 * @return Successfully sent email
	 */
	sendEmailResponse (emailRequest: EmailRequest): __Observable<__StrictHttpResponse<string>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;

		__headers = __headers.append("Content-Type", "application/json");
		__body = emailRequest;
		let req = new HttpRequest<any>(
			'POST',
			this.rootUrl + `/customerportal/email/v1/send`,
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
	 * @param emailRequest JSON Body for the Group Training Request
	 * @return Successfully sent email
	 */
	sendEmail (emailRequest: EmailRequest): __Observable<string> {
		return this.sendEmailResponse(emailRequest).pipe(
			__map(_r => _r.body as string)
		);
	}

	/**
	   * Contact Support Response
	   * @param params The `EmailControllerService.ContactSupportParams` containing the following parameters:
	   * @return successful operation
	   */
	contactSupportResponse (contactSupportParams: EmailControllerService.ContactSupportParams): __Observable<__StrictHttpResponse<ContactSupportResponse>> {
		let __params = this.newParams();
		let __headers = new HttpHeaders();
		let __body: any = null;
		__body = contactSupportParams;
		let req = new HttpRequest<any>(
			'POST',
			this.rootUrl + `${EmailControllerService.contactSupportPath}`,
			__body,
			{
				headers: __headers,
				params: __params,
				responseType: 'json',
			});

		return this.http.request<any>(req).pipe(
			__filter(_r => _r instanceof HttpResponse),
			__map((_r) => {
				return _r as __StrictHttpResponse<ContactSupportResponse>;
			})
		);
	}

	/**
	 * Contact Support
	 * @param params The `EmailControllerService.ContactSupportParams` containing the following parameters:
	 *
	 * @return successful operation
	 */
	contactSupport (params: EmailControllerService.ContactSupportParams): __Observable<ContactSupportResponse> {
		return this.contactSupportResponse(params).pipe(
			__map(_r => _r.body as ContactSupportResponse)
		);
	}
}

module EmailControllerService {

	/**
	 * Parameters for getEmailsByFilter
	 */
	export interface GetEmailsByFilterParams {

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
	   * Params for contact support
	   */
	export interface ContactSupportParams {
		/**
		 * subject of the email.
		 */
		subject: string;
		/**
		 * message of email.
		 */
		body: string;
		/**
		 * reciepients email addresses in cc
		 */
		cc: string;
	}
}

export { EmailControllerService }
