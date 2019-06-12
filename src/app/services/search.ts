import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environment';
import { LogService } from '@cisco-ngx/cui-services';
import { SearchType } from '@interfaces';

/**
 * Regex for a serial number match
 */
const serialRegex = /^[0-9a-zA-Z-]{3,}$/;
/**
 * Regex for a case number match
 */
const caseRegex = /\b6\d{8}\b/;
/**
 * Regex for a RMA match
 */
const rmaRegex = /^8\d{8}$/;
/** TODO get contract regex */
// const contractRegex = '';

/**
 * Interface representing the Search Results
 */
export interface SearchResults {
	cdcSearch: {
		domain: string;
		search: {
			uri: string;
			title: string;
		}[];
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
	) { }

	/**
	 * Determine the special query type from a query string (case, product, etc.)
	 * @param query the query
	 * @returns query type
	 */
	public determineType (query: string): SearchType {
		if (query.match(caseRegex)) {
			return 'case';
		}
		if (query.match(rmaRegex)) {
			return 'rma';
		}
		// TODO add contract match
		if (query.match(serialRegex)) {
			return 'sn';
		}

		return 'default';
	}

	/**
	 * TODO this will be in a real sdp service under cui-x-staging once the swagger
	 * is ironed out and we generate the whole thing
	 *
	 * Performs a query against the search api
	 * @param query The query to search for
	 * @returns Search Results
	 */
	public search (query: string): Observable<SearchResults> {
		this.logger.debug(`Search query :: ${query}`);

		return this.http.get<SearchResults>(`${
			environment.sdpOrigin }${environment.services.search}`);
	}
}
