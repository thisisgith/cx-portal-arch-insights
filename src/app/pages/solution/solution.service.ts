import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { LogService } from '@cisco-ngx/cui-services';
import { Observable } from 'rxjs';

/**
 * Interface representing a Webinar from the Interactive Webinars results
 */
export interface Webinar {
	title: string;
	summary: string;
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

	constructor (
		private http: HttpClient,
		private logger: LogService,
	) {
		const origin = environment.origin || window.location.origin;
		this.webinarUrl = `${origin}${environment.services.solution.webinar}`;
	}

	/**
	 * Performs a query against the webinars api
	 * @returns Webinar results
	 */
	public queryWebinars (): Observable<WebinarResults> {
		return this.http.get<WebinarResults>(`${this.webinarUrl}`);
	}
}
