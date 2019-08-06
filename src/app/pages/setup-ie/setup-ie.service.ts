import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '@services';
import { ControlPointIERegistrationAPIService } from '@sdp-api';
import { map, mergeMap, take } from 'rxjs/operators';
import { UserResolve } from '@utilities';

/**
 * Service for anything pertaining to the Setup Wizard
 */
@Injectable()
export class SetupIEService {
	private customerId: string;
	constructor (
		@Inject('ENVIRONMENT') private env,
		private cpService: ControlPointIERegistrationAPIService,
		private http: HttpClient,
		private userResolve: UserResolve,
		private utils: UtilsService,
	) {
	}

	/**
	 * Pings a given endpoint
	 * @param url {string}
	 * @returns Observable
	 */
	public ping (url: string) {
		return this.http.get(
			`${url}${this.env.ieSetup.pingURL}`,
			{ responseType: 'text' },
		);
	}

	/**
	 * Checks if current user has DNAC setup
	 * @returns hasDNAC
	 */
	public checkForDNAC () {
		return this.userResolve.getCustomerId()
			.pipe(
				mergeMap(customerId => this.cpService.getDnacStatusUsingGET(customerId)),
				map(response => {
					if (response.dnacInstalled) {
						localStorage.removeItem(this.env.ieSetup.DNAC_LS_KEY);

						return true;
					}
					this.utils.setLocalStorage(this.env.ieSetup.DNAC_LS_KEY, { noDNAC: true });

					return false;
				}),
				take(1),
			);
	}

	/**
	 * Tries to execute a request given an url
	 * @param url url
	 * @returns Observable
	 */
	public downloadFromUrl (url: string) {
		return this.http.get(url, { responseType: 'blob' });
	}
}
