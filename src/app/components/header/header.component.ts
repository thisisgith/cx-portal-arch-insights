import { Component } from '@angular/core';
import { MicroMockService } from '@cui-x-views/mock';

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
		private mockService: MicroMockService,
	) { }

	/**
	 * Open the settings for the mock component
	 */
	public openMockModal () {
		this.mockService.promptMockSettings();
	}
}
