import { Component } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Optimal Software Component
 */
@Component({
	selector: 'app-osv',
	styleUrls: ['./osv.component.scss'],
	templateUrl: './osv.component.html',
})
export class OsvComponent {

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('OsvComponent Created!');
	}
}
