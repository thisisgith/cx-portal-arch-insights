import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Devices SDA Product Compatiblity Tab Component
 */
@Component({
	selector: 'devices-sda-tab',
	styleUrls: ['./devices-sda-tab.component.scss'],
	templateUrl: './devices-sda-tab.component.html',
})
export class DevicesSdaTabComponent {

	@Input('deviceDetails') public deviceDetails: any = null;
	public tabIndex: number = 0;
	constructor (
		private logger: LogService,
	) {
		
	}
}
