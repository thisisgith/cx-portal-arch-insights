import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, mergeMap, retryWhen } from 'rxjs/operators';
import {
	AcceptFormResponse,
	ImageDownloadUrlResponse,
	MetadataResponse,
} from '@interfaces';
import * as _ from 'lodash-es';

/** AuthTokenResponse Interface */
export interface AuthTokenResponse {
	expiration: string;
	token: string;
}

/** Used for mocking API calls */
export type ASDResponse = AuthTokenResponse | MetadataResponse | ImageDownloadUrlResponse;

/** Accept K9 Request Params */
export interface AcceptK9RequestParams {
	[key: string]: string;
	business_div_function: 'COMM_OR_CIVIL' | 'GOV_OR_MIL';
	confirmation: 'Confirm_Checked';
	download_session_id: string;
	gov_mil_defense_contractor?: 'Yes' | 'No';
	user_action: 'Accepted';
}

/** Accept EULA Request Params */
export interface AcceptEULARequestParams {
	[key: string]: string;
	download_session_id: string;
	user_action: 'Accepted';
}

/** Path used with getMetadata method */
export const GET_METADATA_PATH = '/metadata/udi/PID%3A+CAAPL-BCSP-1.0-K9VID%3A+V01%2C+SN%3A+' +
	'00000001/mdf_id/286324649/software_type_id/286324666/current_release/0.0.1';
/** Path used with getDownloadURL method */
export const GET_DOWNLOAD_PATH = '/downloads/udi/PID%3A+CAAPL-BCSP-1.0-K9VID%3A+V01%2C+SN%3A' +
	'+00000001/mdf_id/286324649/metadata_trans_id/<metadata_trans_id>/image_guids/<ImageGUID>';
/** Path used with acceptK9 method */
export const ACCEPT_K9_PATH = '/compliance/k9';
/** Path used with acceptEULA method */
export const ACCEPT_EULA_PATH = '/compliance/eula';

/**
 * ASD API Service
 * - for CX Collector OVA image download
 * - for accepting k9 and eula
 */
@Injectable({
	providedIn: 'root',
})
export class ASDAPIService {
	private authToken: string;
	private asdAuthURL = this.env.ieSetup.asdAuthURL;
	private asdBaseURL = this.env.ieSetup.asdBaseURL;
	public get accessToken () {
		return _.get(this.authToken && this.authToken.match(/Bearer\s(.*)/), '[1]');
	}

	constructor (
		@Inject('ENVIRONMENT') private env,
		private http: HttpClient,
	) { }

	/**
	 * Gets Auth Token
	 * @returns Observable
	 */
	public getAuthToken () {
		if (this.authToken) {
			return of(this.authToken);
		}

		const getTokenObservable = this.http.get<AuthTokenResponse>(
			this.asdAuthURL,
			{ withCredentials: true },
		);

		return this.requestOrMock<AuthTokenResponse>(getTokenObservable, 'auth')
			.pipe(map(response => {
				this.authToken = `Bearer ${(<AuthTokenResponse> response).token}`;

				return this.authToken;
			}));
	}

	/**
	 * Gets Auth Token
	 * @returns Observable
	 */
	public getMetadata () {

		return this.getAuthToken()
			.pipe(
				mergeMap(authToken => {
					const getMetadataObservable = this.http.get<MetadataResponse>(
						`${this.asdBaseURL}${GET_METADATA_PATH}`,
						{ headers: { Authorization: authToken } },
					);

					return this.requestOrMock<MetadataResponse>(getMetadataObservable, 'meta');
				}),
				retryWhen(this.getRetryFn.bind(this)),
			);
	}

	/**
	 * Gets Download URL
	 * @param metadataTransId - string
	 * @param imageGuid - string
	 * @returns Observable
	 */
	public getDownloadURL (metadataTransId: string, imageGuid: string) {
		return this.getAuthToken()
			.pipe(
				mergeMap(authToken => {
					const getUrlObservable = this.http.get<ImageDownloadUrlResponse>(
							`${this.asdBaseURL}${
								GET_DOWNLOAD_PATH
									.replace(/<metadata_trans_id>/, metadataTransId)
									.replace(/<ImageGUID>/, imageGuid)
							}`,
							{ headers: { Authorization: authToken } },
						)
						.pipe(
							retryWhen(this.getRetryFn.bind(this)),
						);

					return this.requestOrMock<ImageDownloadUrlResponse>(getUrlObservable, 'url');
				}),
			);
	}

	/**
	 * Accepts the K9 Agreement
	 * @param bizDivFn - 'COMM_OR_CIVIL' | 'GOV_OR_MIL'
	 * @param downloadSessionId - string
	 * @param govMilCountryYesNo - 'yes' | 'no'
	 * @returns Observable
	 */
	public acceptK9 (
		bizDivFn: 'COMM_OR_CIVIL' | 'GOV_OR_MIL',
		downloadSessionId: string,
		govMilCountryYesNo?: 'Yes' | 'No',
	) {
		const fromObject: AcceptK9RequestParams = {
			business_div_function: bizDivFn,
			confirmation: 'Confirm_Checked',
			download_session_id: downloadSessionId,
			user_action: 'Accepted',
		};
		if (bizDivFn === 'GOV_OR_MIL') {
			fromObject.gov_mil_defense_contractor = govMilCountryYesNo;
		}
		const params = new HttpParams({ fromObject });

		return this.getAuthToken()
			.pipe(
				mergeMap(authToken => this.http.post<AcceptFormResponse>(
						`${this.asdBaseURL}${ ACCEPT_K9_PATH }`,
						null,
						{ params, headers: { Authorization: authToken } },
					)
					.pipe(
						retryWhen(this.getRetryFn.bind(this)),
					),
				),
			);
	}

	/**
	 * Accepts the EULA Agreement
	 * @param downloadSessionId - string
	 * @returns Observable
	 */
	public acceptEULA (downloadSessionId: string) {
		const fromObject: AcceptEULARequestParams = {
			download_session_id: downloadSessionId,
			user_action: 'Accepted',
		};
		const params = new HttpParams({ fromObject });

		return this.getAuthToken()
			.pipe(
				mergeMap(authToken => this.http.post<AcceptFormResponse>(
						`${this.asdBaseURL}${ ACCEPT_EULA_PATH }`,
						null,
						{ params, headers: { Authorization: authToken } },
					)
					.pipe(
						retryWhen(this.getRetryFn.bind(this)),
					),
				),
			);
	}

	/**
	 * Method called when an error occurs
	 * @param errors - Observable errors that occur
	 * @returns Function
	 */
	private getRetryFn (errors) {
		return errors.pipe(
				mergeMap((err: HttpErrorResponse, i: number) => {
					if (i < 1 && err.status === 401) {
						// try once to get a new bearer token
						this.authToken = null;

						return this.getAuthToken();
					}

					return throwError(err);
				}),
			);
	}

	/**
	 * Mocks api calls when an environment flag is set
	 * @param actual - Observable
	 * @param caller - 'auth' | 'meta' | 'url'
	 * @returns Observable
	 */
	private requestOrMock<T extends ASDResponse> (
		actual: Observable<T>,
		caller: 'auth' | 'meta' | 'url',
	): Observable<ASDResponse> {
		if (!window.Cypress && this.env.ieSetup.mockASD) {
			return new Observable<ASDResponse>(observer => {
				// only import the whole @mock library if we are not in production
				Promise.all([
					import('src/environments/mock/asd/getImageDownloadUrl'),
					import('src/environments/mock/asd/getMetadata'),
					import('src/environments/mock/asd/getToken'),
				])
				.then(([
					{ ASDImageDownloadUrlScenarios },
					{ ASDMetadataScenarios },
					{ ASDTokenScenarios },
				]) => {
					switch (caller) {
						case 'auth':
							return observer.next(ASDTokenScenarios[0].scenarios.GET[0].response.body);
						case 'meta':
							return observer.next(ASDMetadataScenarios[0].scenarios.GET[0].response.body);
						case 'url':
							return observer.next(ASDImageDownloadUrlScenarios[0].scenarios.GET[2].response.body);
					}
				});
			});
		}

		return actual;
	}
}
