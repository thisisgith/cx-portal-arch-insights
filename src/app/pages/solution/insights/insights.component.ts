import { Component } from '@angular/core';
import { RouteAuthService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
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
	constructor (private routeAuthService: RouteAuthService, private route: ActivatedRoute) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.cxLevel = _.get(user, ['service', 'cxLevel'], 0);
	}
	/**
	 * ngOnInit method execution
	 */
	public ngOnInit (): void {
		this.hasPermission = this.routeAuthService.hasRccPermission;
	}
}
