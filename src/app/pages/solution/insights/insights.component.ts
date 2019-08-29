import { Component } from '@angular/core';
import { RccService } from '@sdp-api';
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
	constructor (private rccService: RccService, private route: ActivatedRoute) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}
	/**
	 * ngOnInit method execution
	 */
	public ngOnInit (): void {
		this.rccService.checkPermissions({ customerId: this.customerId })
		.subscribe(response => {
			if (response) {
				this.hasPermission = true;
			} else {
				this.hasPermission = false;
			}
		});
	}
}
