import { Component } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Main Sidebar Component
 */
@Component({
	selector: 'app-sidebar',
	styleUrls: ['./sidebar.component.scss'],
	templateUrl: './sidebar.component.html',
})
export class SidebarComponent {

	constructor (
				private logger: LogService,
		) {
		this.logger.debug('SidebarComponent Created!');
	}
}
