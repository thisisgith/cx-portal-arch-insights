import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { LogService } from '@cisco-ngx/cui-services';
import { SearchType, SearchEnum } from '@interfaces';
import { environment } from '@environment';

import { Observable, Subject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Regex for a serial number match
 */
const serialRegex = /^[0-9a-zA-Z-]{3,}$/;
/**
 * Regex for a case number match
 */
const caseRegex = /\b(?:SR)?6\d{8}\b/;
/**
 * Regex for a RMA match
 */
const rmaRegex = /^8\d{8}$/;
/** Regex for contract match
 * 2 followed by 8 digits or 9 followed by 7 digits
 */
const contractRegex = /^2\d{8}|9\d{7}$/;

/**
 * Origin to call for product typeahead results
 */
const typeaheadOrigin = environment.typeaheadServiceOrigin;
/**
 * Url to call for product typeahead results
 */
const typeaheadUrl = '/esps/search/suggest/cdcpr01zad';

/**
 * Service with utils for the personal search module
 * HTTP calls are contained in a different service under @sdp-api
 * With the exception of the typeahead http call (different source)
 */
@Injectable({
	providedIn: 'root',
})
export class SearchService {

	private serviceUrl: string;
	public close$ = new Subject();

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
		let value = query.match(caseRegex);
		if (value && value[0]) {
			return {
				name: SearchEnum.case,
				value: value[0],
			};
		}

		value = query.match(rmaRegex);

		if (value && value[0]) {
			return {
				name: SearchEnum.rma,
				value: value[0],
			};
		}

		value = query.match(contractRegex);

		if (value && value[0]) {
			return {
				name: SearchEnum.contract,
				value: value[0],
			};
		}

		// Serial Number matches the most strings and needs to be checked last
		value = query.match(serialRegex);

		if (value && value[0]) {
			return {
				name: SearchEnum.sn,
				value: value[0],
			};
		}

		return {
			name: SearchEnum.default,
		};
	}

	/**
	 * Fetch product typeahead results.
	 * @param params { TypeaheadParams } query params
	 * @returns Observable with results
	 */
	public fetchTypeahead (params: TypeaheadParams): Observable<TypeaheadResponse> {
		const urlParams = new HttpParams()
			.set('q', params.q)
			.set('locale', params.locale)
			.set('bizcontext', params.bizcontext)
			.set('h', params.h.toString());

		return this.http.get<TypeaheadResponse>(`${typeaheadOrigin}${typeaheadUrl}`, {
			params: urlParams,
		})
			.pipe(
				catchError(err => {
					this.logger.error(`Error fetching typehead, Err: ${err}`);

					return of(null);
				}),
			);
	}

	/**
	 * Fire signal to close the main search modal
	 */
	public close () {
		this.close$.next();
	}
}

/**
 * Interface representing typeahead query params
 * TODO possibly support more locales in the future Only en-US for now
 */
export interface TypeaheadParams {
	q: string;
	locale: 'enus';
	bizcontext: 'ENT';
	h: number;
}

/**
 * Interface representing typeahead response
 */
export interface TypeaheadResponse {
	responses?: {
		hits: {
			hits: {
				'_source': {
					cdc_displaytext: string;
					cdc_displaytext1: string;
					cdc_submittext: string;
					cdc_category_name: string;
				};
				fields: {
					search_type: string[];
				};
			}[];
		};
	}[];
}
