import { Component } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Main Inventory Page Component
 */
@Component({
	selector: 'app-inventory',
	styleUrls: ['./inventory.component.scss'],
	templateUrl: './inventory.component.html',
})
export class InventoryComponent {

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('InventoryComponent Created!');
	}
}
