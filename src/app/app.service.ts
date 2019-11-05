import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { I18n, Language } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import { RacetrackResponse, RacetrackService } from '@sdp-api';
import { RacetrackInfoService } from '@services';
import { UserResolve } from '@utilities';

import * as _ from 'lodash-es';

/**
 * Service which contains all calls uses for initialization
 */
@Injectable({
	providedIn: 'root',
})
export class AppService {

	public i18nLoaded = false;
	private routeStack: string[] = [];

	constructor (
		private http: HttpClient,
		private logger: LogService,
		private racetrackService: RacetrackService,
		private racetrackInfoService: RacetrackInfoService,
		private userResolve: UserResolve,
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

	/**
	 * Fetch the current racetrack, solution and technology at application start
	 * (selects first from list for each)
	 * @param customerId customerId for whom to fetch information
	 */
	public initializeRacetrack (customerId: string) {

		this.racetrackService.getRacetrack({ customerId })
		.subscribe((results: RacetrackResponse) => {
			this.racetrackInfoService.sendRacetrack(results);
			const solutions = results.solutions;
			const topSolution = _.head(solutions);
			this.racetrackInfoService.sendCurrentSolution(topSolution);
			const topTechnology = _.head(_.get(topSolution, 'technologies', []));
			if (topTechnology) {
				this.racetrackInfoService.sendCurrentTechnology(topTechnology);
				this.racetrackInfoService.sendCurrentAdoptionPercentage(
					topTechnology.usecase_adoption_percentage);
			}
		},
		err => {
			this.logger.error('app.service : initializeRacetrack() ' +
				`:: Error : (${err.status}) ${err.message}`);
		});
	}

	/**
	 * Fetch user information and cache locally
	 * @returns Observable with fetched user info
	 */
	public initializeUser () {
		return this.userResolve.resolve();
	}

	/**
	 * Returns last route from routeStack
	 * @returns string of route url
	 */
	public getLastRoute () {
		return this.routeStack[this.routeStack.length - 1];
	}

	/**
	 * Pops off last item from routeStack
	 * @returns string of route url
	 */
	public popRoute () {
		return this.routeStack.pop();
	}

	/**
	 * Adds item to routeStack
	 * @param path string of loaded route
	 */
	public addRouteToList (path: string) {
		const lastPath = this.routeStack[this.routeStack.length - 1];

		// Don't store same path if current path = last path
		if (lastPath !== path) {
			this.routeStack.push(path);
		}
	}
}
