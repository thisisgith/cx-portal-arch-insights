import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AsyncSubject, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { environment } from '@environment';

/**
 * APIx token response format
 */
export interface ITokenResponse {
	token: string;
	expiration: string;
}

/**
 * APIx token format
 */
export interface ITokenSubject {
	subject: AsyncSubject<string>;
	expiration?: string;
	dateCreated?: number;
}

/**
 * Service which contains all calls to our search service
 */
@Injectable({
	providedIn: 'root',
})
export class APIxService {
	/** Public to enable unit testing */
	public tokens: {
		[key: string]: ITokenSubject;
	} = { };

	constructor (private http: HttpClient) { }

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
		};

		return this.http.get(
			`${environment.auth.ciscoTokenUrl}/${clientId}`,
			{ withCredentials: true })
			.pipe(mergeMap((response: ITokenResponse) => {
				// Set the value and trigger notification.
				const token = this.tokens[clientId];
				token.subject.next(response.token);
				token.subject.complete();
				token.expiration = response.expiration;
				token.dateCreated = Date.now();

				return token.subject;
			}));
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
