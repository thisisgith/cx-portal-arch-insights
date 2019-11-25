import { Component, OnInit } from '@angular/core';
import { RouteAuthService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
import { map, catchError } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
/**
 * Component representing a nav bar for insights pages
 */
@Component({
	selector: 'insight-tabs',
	styleUrls: ['./insight-tabs.component.scss'],
	templateUrl: './insight-tabs.component.html',
})
export class InsightTabsComponent implements OnInit {
	public customerId;
	public hasPermission = false;
	public cxLevel: number;
	public enableArchitectureTab = false;
	public enableConfigurationTab = false;
	public enableSystemEventsTab = false;
	private destroy$ = new Subject();

	constructor (
		private logger: LogService,
		private routeAuthService: RouteAuthService,
		private router: Router,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.cxLevel = _.get(user, ['service', 'cxLevel'], 0);
	}

	/**
	 * initialization hook
	 */
	public ngOnInit (): void {
		this.canActivate();
	}

	/**
	 * canActivate method execution
	 * @returns can activate boolean value
	 */
	public canActivate () {
		this.routeAuthService.checkArchitecturePermissions()
			.pipe(
				map((response: any) => {
					if (response) {
						this.enableArchitectureTab = _.get(response, 'architectureReviewUIEnabled');
						this.enableConfigurationTab = _.get(response, 'configurationUIEnabled');
						this.enableSystemEventsTab = _.get(response, 'syslogUIEnabled');
					}
				}),
				catchError(err => {
					this.enableArchitectureTab = false;
					this.enableConfigurationTab = false;
					this.enableSystemEventsTab = false;
					this.logger.error('insights canActivate() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of();
				}),
			)
			.subscribe();
	}

	/**
	 * ngOnDestroy
	 */

	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
