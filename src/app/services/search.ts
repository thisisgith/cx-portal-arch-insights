import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Interface representing the Search Results
 */
export interface SearchResults {
	highlightTerms?: string[];
	insight?: {
		bug?: {
			description: string;
			details: string;
		};
		devices: {
			cxLevel: number;
			model: string;
			swVersion: string;
		}[];
		fix?: {
			description: string;
			details: string;
			download: string;
		};
		workaround?: {
			description: string;
			details: string;
		};
	};
	results?: {
		answered?: string;
		link: string;
		start?: string;
		summary: string;
		title: string;
		type: string;
	}[];
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

		return this.http.get<SearchResults>(this.serviceUrl);
	}
}
