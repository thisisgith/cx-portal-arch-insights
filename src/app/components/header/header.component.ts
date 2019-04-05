import { Component } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Main Header Component
 */
@Component({
	selector: 'app-header',
	styleUrls: ['./header.component.scss'],
	templateUrl: './header.component.html',
})
export class HeaderComponent {

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('HeaderComponent Created!');
	}
}
