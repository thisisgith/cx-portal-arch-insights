import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Interface representing the Device in the insight results
 */
export interface Device {
	model: string;
	swVersion: string;
	cxLevel: number;
}

/**
 * Interface to represent a Top Result returned from a search query
 */
export interface Result {
	type: string;
	title: string;
	summary: string;
	link: string;
	answered?: string;
	start?: string;
}

/**
 * Interface to represent the Insight result returned from a search query
 */
export interface Insight {
	bug?: {
		description: string;
		details: string;
	};
	fix?: {
		description: string;
		details: string;
		download: string;
	};
	workaround?: {
		description: string;
		details: string;
	};
	devices: Device[];
}

/**
 * Interface representing the Search Results
 */
export interface SearchResults {
	highlightTerms?: string[];
	insight?: Insight;
	results: Result[];
}

/**
 * Service which contains all calls to our search service
 */
@Injectable({
	providedIn: 'root',
})
export class SearchService {

	private serviceUrl: string;

	constructor (
		private http: HttpClient,
		private logger: LogService,
	) {
		const origin = environment.origin || window.location.origin;
		this.serviceUrl = `${origin}${environment.services.search}`;
	}

	/**
	 * Performs a query against the search api
	 * @param query The query to search for
	 * @returns Search Results
	 */
	public search (query: string): Observable<SearchResults> {
		this.logger.debug(`Search query :: ${query}`);

		return this.http.get<SearchResults>(`${this.serviceUrl}`);
	}
}
