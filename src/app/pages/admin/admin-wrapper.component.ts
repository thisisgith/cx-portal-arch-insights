import { Component, OnInit } from '@angular/core';
import {
	ControlPointIEHealthStatusAPIService, IEHealthStatusResponseModel,
} from '@sdp-api';
import { User } from '@interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { AppStatusColorPipe } from './settings/app-status-color.pipe';

import { empty, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';
import { DEFAULT_DATACENTER } from '@constants';

/**
 * Admin Component
 */
@Component({
	providers: [AppStatusColorPipe],
	selector: 'admin-wrapper',
	styleUrls: ['./admin-wrapper.component.scss'],
	templateUrl: './admin-wrapper.component.html',
})
export class AdminWrapperComponent implements OnInit {
	public routerPath;
	private destroyed$: Subject<void> = new Subject<void>();
	public user: User;
	private customerId: string;
	public isValidAdmin = false;
	public erroredAppsNum = 0;
	public admin = 'accountadmin';

	constructor (
		private router: Router,
		private route: ActivatedRoute,
		public appService: AppService,
		private controlPointIEHealthStatusAPIService: ControlPointIEHealthStatusAPIService,
		private appStatusColorPipe: AppStatusColorPipe,
		private userResolve: UserResolve,
	) {
		this.routerPath = _.get(this, 'route.snapshot.routeConfig.path', 'settings');
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
		const cxLevel = _.get(this.user, ['service', 'cxLevel']);
		const isAdmin = _.get(this.user, ['info', 'individual', 'role']);
		if (isAdmin) {
			this.isValidAdmin = (isAdmin.toLowerCase()
			=== this.admin  && cxLevel > 1) ? true : false;
		}
		this.userResolve.getUserSteps()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe(step => {
			if (!step) {
				this.userResolve.setUserSelectedDataCenter(DEFAULT_DATACENTER);
			}
		});
	}

	/**
	 * Sets health status info given customerId.
	 * @param {String} customerId - Customer ID string
	 * @returns observable
	 */
	public getIEHealthStatusData (customerId: string) {
		return this.controlPointIEHealthStatusAPIService.getIEHealthStatusUsingGET(customerId)
			.pipe(
				catchError(() => empty()),
				takeUntil(this.destroyed$),
			);
	}

	/**
	 * Determines number of apps that are not running
	 * Sets erroredAppsNum to some value
	 * @param response IEHealthStatusResponseModel
	 */
	public setErroredAppsNum (response: IEHealthStatusResponseModel) {
		const component_details = _.get(response, ['component_details']);

		const erroredApps = _.filter(component_details, app => {
			const status = _.get(app, ['status']);

			// Use result form color pipe to determine service up or down
			if (this.appStatusColorPipe.transform(status) === 'text-danger') {
				return app;
			}
		});
		this.erroredAppsNum = erroredApps.length;

		const ieStatus = _.get(response, 'ieStatus');
		this.erroredAppsNum = this.appStatusColorPipe.transform(ieStatus) === 'text-danger' ?
			this.erroredAppsNum + 1 : this.erroredAppsNum;

		const dnacStatus = _.get(response, ['dnac_details', 0, 'status']);
		this.erroredAppsNum = this.appStatusColorPipe.transform(dnacStatus) === 'text-danger' ?
			this.erroredAppsNum + 1 : this.erroredAppsNum;
	}

	/**
	 * Function which instanstiates the settings page to the initial view
	 */
	public ngOnInit () {
		this.getIEHealthStatusData(this.customerId)
			.subscribe(response => {
				const firstResponse = _.get(response, [0]);

				this.setErroredAppsNum(firstResponse);
			});
	}

	/**
	 * Goes back to the previous page
	 */
	public goBack () {
		let lastRoute = this.appService.popRoute();
		lastRoute = lastRoute ? lastRoute : '';

		while (lastRoute.includes('admin')) {
			lastRoute = this.appService.popRoute();
			lastRoute = lastRoute ? lastRoute : '';
		}

		if (lastRoute.includes('setup-ie')) {
			lastRoute = '';
		}

		this.router.navigateByUrl(lastRoute);
	}
}
