
import { Component } from '@angular/core';

import {
	Router,
	Event as RouterEvent,
	NavigationStart,
	NavigationEnd,
	NavigationError,
	NavigationCancel,
} from '@angular/router';
import { environment } from '@environment';
import { setOptions } from 'highcharts';
import { UserResolve } from '@utilities';
import { User } from '@interfaces';
import { AppService } from 'src/app/app.service';
import * as _ from 'lodash-es';

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
		private userResolve: UserResolve,
		private appService: AppService,
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

				if (event instanceof NavigationEnd) {
					const url = event.urlAfterRedirects;

					this.appService.addRouteToList(url);
				}
			},
		);

		this.userResolve.getUser()
		.subscribe((user: User) => {
			const { ccoId, emailAddress } = _.get(user, ['info', 'individual'],
				{ ccoId: '', emailAddress: '' });

			if (ccoId) {
				_.set(window, ['cisco', 'user'], {
					cpr: {
						pf_auth_email: emailAddress,
						pf_auth_uid: ccoId,
					},
					email: emailAddress,
					userId: ccoId,
					userIdLC: _.toLower(ccoId),
				});

				if (environment.production) {
					// Metrics
					_.set(window, 'NTPT_PGEXTRA', 'status=LoggedIn');
					_.set(window, 'NTPT_IMGSRC_CUSTOM',
						'//cisco-tags.cisco.com/tag/auth/ntpagetag.gif');
				}
			}
		});
	}
}
