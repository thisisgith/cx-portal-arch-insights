import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AfmResponse, AfmSearchParams, AfmConnectivity } from '../models/afm';
import { AfmConfiguration } from '../afm-configuration';
import { catchError, map as __map } from 'rxjs/operators';
import { BaseService } from '../../core/base-service';
/**
 *
 * Afm Service class which will used as service for am componet
 * it has a rest calls retrive information
 * @export
 * @class AfmService
 * @extends {BaseService}
 */
@Injectable({
	providedIn: 'root',
})

export class AfmService extends BaseService {

	// public afmRootUrl = 'https://cpp-api.sdp11-idev.csco.cloud/afm';
	public afmRootUrl = 'http://localhost:8088';

	private alarmsPath = `${this.afmRootUrl}/v1/fault/alarms`;
	private tacCasesPath = `${this.afmRootUrl}/v1/fault/taccases`;
	private searchPath = `${this.afmRootUrl}/v1/fault/search`;
	private afmConnectivityPath = `${this.afmRootUrl}/v1/fault/connectivity`;
	private eventPath = `${this.afmRootUrl}/v1/fault/event`;
	private ignoreEventPath = `${this.afmRootUrl}/v1/fault/ignoreevent`;
	private revertIgnoreEventPath = `${this.afmRootUrl}/v1/fault/revertignoreevent`;
	private timeRangePath = `${this.afmRootUrl}/v1/fault/timerangefilter`;

	// private alarmsPath = `${this.rootUrl}/api/customerportal/afm/v1/fault/alarms`;
	// private tacCasesPath = `${this.rootUrl}/api/customerportal/afm/v1/fault/taccases`;
	// private searchPath = `${this.rootUrl}/api/customerportal/afm/v1/fault/search`;
	// private afmConnectivityPath = `${this.rootUrl}/api/customerportal/afm/v1/fault/connectivity`;
	// private eventPath = `${this.rootUrl}/api/customerportal/afm/v1/fault/event`;
	// private ignoreEventPath = `${this.rootUrl}/api/customerportal/afm/v1/fault/ignoreevent`;
	// private revertIgnoreEventPath =
	// `${this.rootUrl}/api/customerportal/afm/v1/fault/revertignoreevent`;
	// private timeRangePath = `${this.rootUrl}/api/customerportal/afm/v1/fault/timerangefilter`;

	constructor (config: AfmConfiguration, http: HttpClient) {
		super(config, http);
	}

	/**
	 * it will give all alarm details
	 *
	 * @param afmSearchParams - is a object which will store searchParams
	 * search info to send to rest call
	 * @returns AfmResponse
	 * @memberof AfmService
	 */
	public getAfmAlarms (afmSearchParams: AfmSearchParams): Observable<AfmResponse> {
		return this.http.post<AfmResponse>(this.alarmsPath, afmSearchParams)
			.pipe(__map(response => response), catchError(this.erroHandler));
	}

	/**
	 * It will give event details which will
	 * @param afmSearchParams - AfmSearchParams
	 * @returns AfmResponse
	 *
	 */
	public getAfmEvents (afmSearchParams: AfmSearchParams): Observable<AfmResponse> {
		return this.http.post<AfmResponse>(this.eventPath, afmSearchParams)
			.pipe(__map(response => response), catchError(this.erroHandler));
	}

	/**
	 * This service method will ignore the event
	 *
	 * @param afmSearchParams AfmSearchParams
	 * @returns Observable<AfmConnectivity>
	 * @memberof AfmService
	 */
	public ignoreEvent (afmSearchParams: AfmSearchParams): Observable<AfmResponse> {
		return this.http.post<AfmResponse>(this.ignoreEventPath, afmSearchParams)
			.pipe(__map(response => response), catchError(this.erroHandler));
	}

	/**
	 * This service method will revert the ignored event
	 *
	 * @param afmSearchParams AfmSearchParams
	 * @returns Observable<AfmConnectivity>
	 * @memberof AfmService
	 */
	public revertIgnoreEvent (afmSearchParams: AfmSearchParams): Observable<AfmResponse> {
		return this.http.post<AfmResponse>(this.revertIgnoreEventPath, afmSearchParams)
			.pipe(__map(response => response), catchError(this.erroHandler));
	}

	/**
	 * it will give all tac case details
	 * @param afmSearchParams AfmSearchParams
	 * @returns Observable<AfmResponse> will give
	 * @memberof AfmService
	 */
	public getTacCases (afmSearchParams: AfmSearchParams): Observable<AfmResponse> {
		return this.http.post<AfmResponse>(this.tacCasesPath, afmSearchParams)
			.pipe(__map(response => response), catchError(this.erroHandler));
	}

	/**
	 * it will give alarm details based on search params
	 * @param afmSearchParams AfmSearchParams
	 * @returns Observable<AfmResponse>
	 * @memberof AfmService
	 */

	public getAfmSearchFilterInfo (afmSearchParams: AfmSearchParams): Observable<AfmResponse> {
		return this.http.post<AfmResponse>(this.searchPath, afmSearchParams)
			.pipe(__map(response => response), catchError(this.erroHandler));
	}

	/**
	 * it will get the connectivity status information
	 *
	 * @param afmSearchParams - AfmSearchParams
	 * @returns Observable<AfmConnectivity>
	 * @memberof AfmService
	 */

	private checkAfmConnectivityStatus (afmSearchParams: AfmSearchParams):
		Observable<AfmConnectivity> {
		return this.http.post<AfmResponse>(this.afmConnectivityPath, afmSearchParams)
			.pipe(__map(response => response), catchError(this.erroHandler));
	}

	/**
	 * it will give alarm details based on Time Range params
	 * @param afmSearchParams AfmSearchParams
	 * @returns Observable<AfmResponse>
	 * @memberof AfmService
	 */

	public getTimeRangeFilteredEvents (afmSearchParams: AfmSearchParams): Observable<AfmResponse> {
		return this.http.post<AfmResponse>(this.timeRangePath, afmSearchParams)
			.pipe(__map(response => response), catchError(this.erroHandler));
	}

	/**
	 *
	 * Handling error
	 * @param error - HttpErrorResponse
	 * @returns error
	 * @memberof AfmService
	 */
	private erroHandler (error: HttpErrorResponse) {
		// return Observable.throw(error.message || 'Server Error');
		let errorMessage = '';
		if (error.error instanceof ErrorEvent) {
			// Get client-side error
			errorMessage = error.error.message;
		} else {
			// Get server-side error
			errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
		}

		return Observable.throw(errorMessage);
	}
}
