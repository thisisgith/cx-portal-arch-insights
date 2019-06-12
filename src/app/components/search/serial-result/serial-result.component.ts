import { Component } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * A Component to house the search results by serial number
 */
@Component({
	selector: 'app-serial-result',
	styleUrls: ['./serial-result.component.scss'],
	templateUrl: './serial-result.component.html',
})
export class SerialResultComponent {

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('SerialResultComponent Created!');
	}
}
