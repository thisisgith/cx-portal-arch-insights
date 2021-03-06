import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SetupIEStateService } from '../setup-ie-state.service';
import * as _ from 'lodash-es';

/**
 * Parameters for the getAuthToken public method
 */
export interface GetAuthTokenParams {
	userId: string;
	password: string;
}

/**
 * Parameters for the installAndRegisterDNAC public method
 */
export interface InstallAndRegisterDNACParams {
	dnacIP: string;
	username: string;
	password: string;
}

/**
 * Parameters for the Change Password public method
 */
export interface ChangePasswordParams {
	old_password: string;
	new_password: string;
}

/**
 * Parameters for the Change DNAC Credentials public method
 */
export interface ChangeDNACCredentialsParams {
	type: string;
	ipAddress: string;
	username: string;
	password: string;
}

/**
 * Parameters for the installAndRegisterDNAC public method
 */
export interface RegisterParams {
	oldPassword: string;
	password: string;
	proxyHost?: string;
	proxyPort?: string;
	proxyUser?: string;
	proxyPassword?: string;
}

/**
 * Service that calls Collector APIs
 */
@Injectable({
	providedIn: 'root',
})
export class RegisterCollectorService {
	private collectorIP: string;
	private baseUrl = '/ie-commonapi/services/';
	constructor (
		private http: HttpClient,
		private state: SetupIEStateService,
	) {
		const currentState = this.state.getState() || { };
		this.collectorIP = currentState.collectorIP;
	}

	/**
	 * Get Auth Token
	 * @param params GetAuthTokenParams
	 * @returns Observable
	 */
	public getAuthToken (params: GetAuthTokenParams) {
		return this.http.post(
			`https://${this.collectorIP}${this.baseUrl}authToken`,
			params,
			{ responseType: 'text' },
		);
	}

	/**
	 * Install and Register DNAC
	 * @param params InstallAndRegisterDNACParams
	 * @returns Observable
	 */
	public installAndRegisterDNAC (params: InstallAndRegisterDNACParams) {
		const state = this.state.getState() || { };
		const token = state.collectorToken;

		return this.http.post(
			`https://${this.collectorIP}${this.baseUrl}installAndRegisterDNAC`,
			params,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				responseType: 'text',
			},
		);
	}

	/**
	 * Register CX Collector using certificate
	 * @param body InstallAndRegisterDNACParams
	 * @param file string
	 * @returns Observable
	 */
	public registerOnline (body: RegisterParams, file: Blob) {
		const formData = new FormData();
		formData.append('otherDetails', JSON.stringify(_.omitBy(body, _.isNil)));
		if (file) {
			formData.append('file', file, 'register.zip');
		}

		return this.http.post(
			`https://${this.collectorIP}${this.baseUrl}registerOnline`,
			formData,
			{ responseType: 'text' },
		);
	}

	/**
	 * Get Registration Status
	 * @returns Observable
	 */
	public getStatus () {
		const state = this.state.getState() || { };
		const token = state.collectorToken;

		return this.http.get(
			`https://${this.collectorIP}${this.baseUrl}status`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
	}

	/**
	 * Change Password of Collector
	 * @param data ChangePasswordParams
	 * @param CollectorIP Ip Address
	 * @returns Observable
	 */
	public changePassword (data: ChangePasswordParams, CollectorIP: string) {

		return this.http.post(
			`https://${CollectorIP}${this.baseUrl}changeCXCAdminCredential`,
			data,
			{ responseType: 'text',
			},
		);
	}

	/**
	 * Change Credentials of DNAC
	 * @param data ChangeDNACCredentials
	 * @param CollectorIP Ip Address
	 * @param token for authorization
	 * @returns Observable
	 */
	public changeDNACCredentials (data: [ChangeDNACCredentialsParams], CollectorIP: string, token: string) {

		return this.http.put(
			`https://${CollectorIP}${this.baseUrl}updateControllers`,
			data,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
				responseType: 'text',
			},
		);
	}

	/**
	 * Get Authorization token for Day N
	 * @param CollectorIP IP address for Collector
	 * @param CollPassword password for Collector
	 * @returns Observable
	 */
	public getAuthTokenDayN (CollectorIP: string, CollPassword: string) {

		const body = {
			userId: 'cxcadmin',
			password: CollPassword,
		};

		return this.http.post(
			`https://${CollectorIP}${this.baseUrl}authToken`,
			body,
			{
				responseType: 'text',
			},
		);
	}
}
