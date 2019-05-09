import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { I18n, Language } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Service which contains all calls uses for initialization
 */
@Injectable({
	providedIn: 'root',
})
export class AppService {

	public i18nLoaded = false;

	constructor (
		private http: HttpClient,
		private logger: LogService,
	) { }

	/**
	 * Fetches locale specific as well as the en-US i18n files and loads them into our dictionary
	 * @param force force fresh load
	 * @param language optional language parameter
	 * @returns promise representing the i18n fetch
	 */
	public loadI18n (force: boolean = false, language: string = 'en-US'): Observable<void> {
		if (this.i18nLoaded && !force) {
			return of();
		}

		this.logger.debug('app.service : loadI18n() :: Loading i18n files');
		const preferredLanguage = language || Language.getPreferred();
		const observables = [
			this.getI18n('assets/i18n/en-US.json'),
		];

		if (preferredLanguage !== 'en-US') {
			observables.push(this.getI18n(`assets/i18n/${preferredLanguage}.json`));
		}

		return forkJoin(observables)
		.pipe(
			map(
				([enUS, preferred]) => {
					if (preferred) {
						I18n.injectDictionary(preferred);
					}
					if (enUS) {
						I18n.injectDictionary(enUS, false);
					}

					this.i18nLoaded = true;
				},
			),
		);
	}

	/**
	 * Getter function which will return an API call to get the i18n files
	 *
	 * @ignore
	 * @param path Path of the i18n JSON file
	 * @returns The observable representing the HTTP GET call
	 */
	private getI18n (path: string): Observable<object | { }> {
		return this.http.get(path)
		.pipe(
			catchError((error: HttpErrorResponse) => {
				this.logger.error(
					`app.service : getI18n() :: Error fetching json file at ${
						path} (${error.statusText})`);

				return of({ });
			}),
		);
	}
}
