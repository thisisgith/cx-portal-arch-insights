import { Component } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Details Header Component
 */
@Component({
	selector: 'details-header',
	styleUrls: ['./details-header.component.scss'],
	templateUrl: './details-header.component.html',
})
export class DetailsHeaderComponent {

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('DetailsHeaderComponent Created!');
	}
}
