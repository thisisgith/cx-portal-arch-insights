import { Component } from '@angular/core';
import { RouteAuthService } from 'src/app/services';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';
import { LogService } from '@cisco-ngx/cui-services';
/**
 * Component representing a nav bar for insights pages
 */
@Component({
	selector: 'insight-tabs',
	styleUrls: ['./insight-tabs.component.scss'],
	templateUrl: './insight-tabs.component.html',
})
export class InsightTabsComponent {
	public customerId;
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
}
