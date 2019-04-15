import { Component, Optional } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { MicroMockService } from '@cui-x-views/mock';

import { environment } from '@environment';

/**
 * Main Header Component
 */
@Component({
	selector: 'app-header',
	styleUrls: ['./header.component.scss'],
	templateUrl: './header.component.html',
})
export class HeaderComponent {

	/**
	 * Whether we show the mocking interface
	 */
	public mocking = environment.mock;

	constructor (
		private logger: LogService,
		@Optional() private mockService: MicroMockService,
	) {
		this.logger.debug('HeaderComponent Created!');
	}

	/**
	 * Open the settings for the mock component
	 */
	public openMockModal () {
		this.mockService.promptMockSettings();
	}
}
