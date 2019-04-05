import {
	Component,
	OnInit,
} from '@angular/core';

import {
	Router,
	Event as RouterEvent,
	NavigationStart,
	NavigationEnd,
	NavigationError,
	NavigationCancel,
} from '@angular/router';

import { Observable, of, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { I18n, Language } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Base application component which handles loading i18n as well as navigation
 * spinners
 */
@Component({
	selector: 'app-root',
	styleUrls: ['./app.component.scss'],
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

	public status = {
		i18n: false,
		loading: true,
	};

	/**
	 * Options represent those used by cui-header
	 */
	public headerOptions = {
		compressed: true,
		menuToggleButton: false,
		showBrandingLogo: true,
		title: '',
	};

	constructor (
		private http: HttpClient,
		private router: Router,
		private logger: LogService,
	) {
		this.router.events.subscribe(
			(event: RouterEvent): void => {
				if (event instanceof NavigationStart) {
					this.status.loading = true;
				}

				if (event instanceof NavigationEnd
						|| event instanceof NavigationCancel
						|| event instanceof NavigationError) {
					this.status.loading = false;
				}
			},
		);
	}

	/**
	 * Begins the process of loading the page
	 */
	public ngOnInit () {
		this.loadI18n();
	}

	/**
	 * Fetches locale specific as well as the en-US i18n files and loads them into our dictionary
	 *
	 * @ignore
	 */
	private loadI18n () {
		const preferredLanguage = Language.getPreferred();
		const observables = [
			this.getI18n('assets/i18n/en-US.json'),
		];

		if (preferredLanguage !== 'en-US') {
			observables.push(this.getI18n(`assets/i18n/${Language.getPreferred()}.json`));
		}

		forkJoin(observables)
		.subscribe(
			([enUS, preferred]) => {
				if (preferred) {
					I18n.injectDictionary(preferred);
				}
				if (enUS) {
					I18n.injectDictionary(enUS, false);
				}

				this.status.i18n = true;
				this.headerOptions.title = I18n.get('_ApplicationName_');
			},
			() => {
				this.logger.error('loadI18n() :: Failed to instantiate i18n files');
			},
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
					`getI18n() :: Error fetching json file at ${path} (${error.statusText})`);

				return of({ });
			}),
		);
	}
}
