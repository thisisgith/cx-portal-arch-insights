import { Component } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * RiskMitigation Component
 */
@Component({
	selector: 'app-risk-mitigation',
	styleUrls: ['./risk-mitigation.component.scss'],
	templateUrl: './risk-mitigation.component.html',
})
export class RiskMitigationComponent {

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('RiskMitigationComponent Created!');
	}
}
