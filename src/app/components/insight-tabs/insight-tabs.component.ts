import { Component, OnInit } from '@angular/core';
import { RouteAuthService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';
import { LogService } from '@cisco-ngx/cui-services';
import { flatMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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

	constructor (
		private logger: LogService,
		private routeAuthService: RouteAuthService,
		private router: Router,
		private userResolve: UserResolve,
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
		this.userResolve.getCustomerId()
			.pipe(flatMap(id => this.routeAuthService.checkPermissions(id)),
				map((response: boolean) => {

					if (response) {
						this.hasPermission = response;
					} else if (this.router.url === '/solution/insights/compliance') {
						this.router.navigateByUrl('/solution/insights/osv');
					}
				}),
				catchError(err => {
					if (this.router.url === '/solution/insights/compliance') {
						this.router.navigateByUrl('/solution/insights/osv');
					}
					this.logger.error('insights canActivate() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of();
				}),
			)
			.subscribe();
	}
}
