import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserResolve } from '@utilities';
import { map, flatMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { RouteAuthService } from 'src/app/services';
import { LogService } from '@cisco-ngx/cui-services';

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
	constructor (private routeAuthService: RouteAuthService,
		private userResolve: UserResolve,
		private router: Router,
		private logger: LogService) { }
	/**
	 * ngOnInit method execution
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
					} else {
						this.router.navigateByUrl('/solution/insights/risk-mitigation');
					}
				}),
				catchError(err => {
					this.router.navigateByUrl('/solution/insights/risk-mitigation');
					this.logger.error('assets.component : checkScan() ' +
				`:: Error : (${err.status}) ${err.message}`);

					return of();
				}),
			);
	}
}
