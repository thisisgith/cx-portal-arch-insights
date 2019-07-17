
import { Component } from '@angular/core';

import {
	Router,
	Event as RouterEvent,
	NavigationStart,
	NavigationEnd,
	NavigationError,
	NavigationCancel,
} from '@angular/router';

import { setOptions } from 'highcharts';

/**
 * Base application component which handles loading i18n as well as navigation
 * spinners
 */
@Component({
	selector: 'app-root',
	styleUrls: ['./app.component.scss'],
	templateUrl: './app.component.html',
})
export class AppComponent {

	/**
	 * Object used to represent status variables for the application
	 */
	public status = {
		loading: true,
	};

	constructor (
		private router: Router,
	) {
		setOptions({ lang: { thousandsSep: ',' } });

		this.router.events.subscribe(
			(event: RouterEvent): void => {
				if (event instanceof NavigationStart) {
					this.status.loading = true;
					if (window.Cypress) { window.loading = true; }
				}

				if (event instanceof NavigationEnd
						|| event instanceof NavigationCancel
						|| event instanceof NavigationError) {
					this.status.loading = false;
					if (window.Cypress) { window.loading = false; }
				}
			},
		);
	}
}
