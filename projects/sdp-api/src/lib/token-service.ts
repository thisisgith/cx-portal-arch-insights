import { Inject, Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AsyncSubject, Observable, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
	private tokens: {
		[key: string]: ITokenSubject;
	} = {};

	constructor(
		@Optional() @Inject('ENVIRONMENT') private environment: any = { },
		private http: HttpClient
	) {
	}

	/**
	 * Fetch an APIX bearer token.
	 * @param clientId The APIX clientId
	 * @returns Observable
	 */
	private fetchToken (clientId: string): Observable<string> {
		// Using AsyncSubject so we send last value and only after
		// execution completes. This way there can be multiple
		// subscribers that register after we initiate the request
		// and it only triggers one request to the backend.
		this.tokens[clientId] = {
			subject: <AsyncSubject<string>> new AsyncSubject(),
		}

		return this.http.get(
			this.getTokenUrl(clientId),
			{ withCredentials: true })
			.pipe(mergeMap((response: ITokenResponse) => {
					// Set the value and trigger notification.
					const token = this.tokens[clientId];
					token.subject.next(response.token);
					token.subject.complete();
					token.expiration = response.expiration;
					token.dateCreated = Date.now();

					return token.subject;
				}
			));
	}

	/**
	 * Fetch an APIX bearer token.
	 * @param clientId The APIX clientId
	 * @returns Observable
	 */
	public getToken (clientId: string): Observable<string> {
		const token = this.tokens[clientId];
		if (token && !this.isTokenExpired(token)) {
			return token.subject.asObservable();
		}

		return this.fetchToken(clientId);
	}

	/**
	 * Get the request URL for acquiring a token.
	 * @param clientId The APIX clientId
	 * @returns string
	 */
	private getTokenUrl (clientId: string): string {
		const ciscoTokenUrl = _.get(this.environment, ['auth', 'ciscoTokenUrl']);
		if (!ciscoTokenUrl) {
			throw new Error('No auth.ciscoTokenUrl in ENVIRONMENT');
		}

		return ciscoTokenUrl.replace('{INSERT_CLIENT_ID}', clientId);
	}

	/**
	 * Return true if the token has expired so we can get another one.
	 * @param token The token, expiration, date
	 * @returns boolean - true if the token has expired; false if not
	 */
	private isTokenExpired (token: ITokenSubject) {
		if (!token.dateCreated) {
			// We are already in the process of fetching a token.
			return false;
		}

		const secondsElapsed = (Date.now() - token.dateCreated) / 1000;

		return secondsElapsed > Number(token.expiration);
	}
}

export interface ITokenResponse {
	token: string;
	expiration: string;
}

export interface ITokenSubject {
	subject: AsyncSubject<string>;
	expiration?: string;
	dateCreated?: number;
}
