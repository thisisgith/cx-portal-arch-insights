import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SetupIEStateService } from '../setup-ie-state.service';

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
 * Parameters for the installAndRegisterDNAC public method
 */
export interface RegisterParams {
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
		return this.http.post(
			`https://${this.collectorIP}${this.baseUrl}installAndRegisterDNAC`,
			params,
			{ responseType: 'text' },
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
		formData.append('otherDetails', JSON.stringify(body));
		formData.append('file', file);

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
}
