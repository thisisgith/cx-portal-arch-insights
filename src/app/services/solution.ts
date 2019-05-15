import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';

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
}
