import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
const contractRegex = /somecontract/;

/**
 * Service with utils for the personal search module
 * HTTP calls are contained in a different service under @cui-x/sdp-api
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
		if (query.match(contractRegex)) {
			return 'contract';
		}
		if (query.match(serialRegex)) {
			return 'sn';
		}

		return 'default';
	}
}
