import { Component } from '@angular/core';
import { RouteAuthService } from 'src/app/services';
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
	constructor (private routeAuthService: RouteAuthService) {}
	/**
	 * ngOnInit method execution
	 */
	public ngOnInit (): void {
		this.hasPermission = this.routeAuthService.hasRccPermission;
	}
}
