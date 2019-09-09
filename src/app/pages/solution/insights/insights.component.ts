import { Component } from '@angular/core';
import { RouteAuthService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';
import { flatMap, map, catchError } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { of } from 'rxjs';
/**
 * InsightsComponent
 */
@Component({
	styleUrls: ['./insights.component.scss'],
	templateUrl: './insights.component.html',
})
export class InsightsComponent {
	public customerId;
	public hasPermission = false;
	public cxLevel: number;
	constructor (
		private logger: LogService,
		private routeAuthService: RouteAuthService,
		private route: ActivatedRoute,
		private router: Router,
		private userResolve: UserResolve) {
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
						this.router.navigateByUrl('/solution/insights/risk-mitigation');
					}
				}),
				catchError(err => {
					if (this.router.url === '/solution/insights/compliance') {
						this.router.navigateByUrl('/solution/insights/risk-mitigation');
					}
					this.logger.error('insights canActivate() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of();
				}),
			)
			.subscribe();
	}
}
