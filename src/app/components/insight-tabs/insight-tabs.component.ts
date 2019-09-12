import { Component, OnInit } from '@angular/core';
import { RouteAuthService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
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
		private routeAuthService: RouteAuthService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.cxLevel = _.get(user, ['service', 'cxLevel'], 0);
	}

	/**
	 * initialization hook
	 */
	public ngOnInit (): void {
		this.hasPermission = this.routeAuthService.hasRccPermission;
	}
}
