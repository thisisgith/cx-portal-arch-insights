import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { Observable } from 'rxjs';
import { Webinar } from '@interfaces';

/**
 * HTTP error response interface
 */
export interface ErrorResponse {
	status: number; // int32
	message: string;
	reason: {
		errorCode?: string;
		errorInfo?: string;
	};
}

/**
 * Interface representing racetrack pitstop object
 */
export interface RacetrackPitstop {
	name: string;
	description: string;
	isComplete: boolean;
	pitstopActions: RacetrackPitstopAction[];
}

/**
 * Interface representing racetrack pitstop action
 */
export interface RacetrackPitstopAction {
	name: string;
	description: string;
	manualCheckAllowed?: boolean;
	isComplete: boolean;
	updateMethod?: 'MANUAL' | 'AUTO';
	isCompleteAuto?: boolean;
	isCompleteManual?: boolean;
	isManaualOverride?: boolean;
}

/**
 * Interface representing Racetrack API response
 */
export interface RacetrackResponseObject {
	customerId: string;
	solutions: RacetrackSolution[];
}

/**
 * Interface representing racetrack solution
 */
export interface RacetrackSolution {
	name: string;
	description: string;
	technologies: RacetrackTechnology[];
}

/**
 * Interface representing racetrack technology
 */
export interface RacetrackTechnology {
	name: string;
	description: string;
	currentPitstop: string;
	pitstops: RacetrackPitstop[];
}

/**
 * Interface representing a list of Webinar Results
 */
export interface WebinarResults {
	webinars: Webinar[];
}

/**
 * Service which contains all calls to our solution service
 */
@Injectable({
	providedIn: 'root',
})
export class SolutionService {

	private webinarUrl: string;
	private racetrackUrl: string;

	constructor (
		private http: HttpClient,
	) {
		const origin = environment.origin || window.location.origin;
		this.webinarUrl = `${origin}${environment.services.solution.webinar}`;
		this.racetrackUrl = `${origin}${environment.services.solution.racetrack}`;
	}

	/**
	 * Performs a query against the webinars api
	 * @returns Webinar results
	 */
	public queryWebinars (): Observable<WebinarResults> {
		return this.http.get<WebinarResults>(this.webinarUrl);
	}

	/**
	 * Performs a query against the racetrack API
	 * @returns racetrack results
	 */
	public queryRacetrack (): Observable<RacetrackResponseObject> {
		return this.http.get<RacetrackResponseObject>(this.racetrackUrl);
	}
}
