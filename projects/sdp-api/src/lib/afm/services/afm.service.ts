import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AfmResponse, AfmSearchParams } from '../models/afm';
import { AfmConfiguration } from '../afm-configuration';
import { catchError, map as __map } from 'rxjs/operators';
import { BaseService } from '../../core/base-service';

/**
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

	private alarmsPath = `${this.rootUrl}/customerportal/afm/v1/fault/alarms`;
	private tacCasesPath = `${this.rootUrl}/customerportal/afm/v1/fault/taccases`;
	private searchPath = `${this.rootUrl}/customerportal/afm/v1/fault/search`;
	private eventPath = `${this.rootUrl}/customerportal/afm/v1/fault/event`;
	private ignoreEventPath = `${this.rootUrl}/customerportal/afm/v1/fault/ignoreevent`;
	private revertIgnoreEventPath =
	`${this.rootUrl}/customerportal/afm/v1/fault/revertignoreevent`;
	private timeRangePath = `${this.rootUrl}/customerportal/afm/v1/fault/timerangefilter`;
	private exportAllPath =  `${this.rootUrl}/customerportal/afm/v1/fault/exportall/`;

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
	 * Export the all records
	 *
	 * @param afmSearchParams AfmSearchParams
	 * @returns AfmResponse object it will return
	 * @memberof AfmService
	 */
	public exportAllRecords (afmSearchParams: AfmSearchParams): Observable<AfmResponse> {
		return this.http.post<AfmResponse>(this.exportAllPath, afmSearchParams)
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
		let errorMessage = '';
		if (error.error && error.error.status) {
			errorMessage = error.error.message;
			errorMessage = `Error Code: ${error.error.status} - error : ${error.error.error}
			- Message: ${error.error.message}`;
		} else {
			errorMessage = `Error Code: ${error.status} \nMessage: ${error.message}`;
		}

		const response: AfmResponse = {
			eventList : [],
			pagination: {
				total : 0,
			},
			status : 'Exception',
			statusMessage: errorMessage,
		};

		return of(response);
	}
}
