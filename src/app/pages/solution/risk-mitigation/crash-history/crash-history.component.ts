import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { RiskAsset } from '@sdp-api';

/**
 * Main component for the Crash History Component
 */
@Component({
	host: {
		'[class.fullscreen]': 'fullscreen',
		'[class.hidden]': 'hidden',
	},
	selector: 'app-crash-history',
	styleUrls: ['./crash-history.component.scss'],
	templateUrl: './crash-history.component.html',
})
export class CrashHistoryComponent {
	@Input('asset') public asset: RiskAsset;

	/**
	 * Initializes the component
	 */
	public ngOnInit () {
	// console.log(this.asset);
	}
	constructor (
		private logger: LogService,
	) {
		this.logger.debug('CrashHistoryComponent Created!');

	}
}
