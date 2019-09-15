import { Component } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * InsightsComponent
 */
@Component({
	styleUrls: ['./insights.component.scss'],
	templateUrl: './insights.component.html',
})
export class InsightsComponent {
	constructor (
		private logger: LogService,
	) {
		this.logger.debug('Insight Tabs componenent created');
	}
}
