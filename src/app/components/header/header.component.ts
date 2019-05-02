import { Component, Optional } from '@angular/core';
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
		@Optional() private mockService: MicroMockService,
	) { }

	/**
	 * Open the settings for the mock component
	 */
	public openMockModal () {
		this.mockService.promptMockSettings();
	}
}
