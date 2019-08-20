import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Devices Switch Redundancy Tab Component
 */
@Component({
	selector: 'devices-sr-tab',
	styleUrls: ['./devices-sr-tab.component.scss'],
	templateUrl: './devices-sr-tab.component.html',
})
export class DevicesSrTabComponent {

	@Input('deviceDetails') public deviceDetails: any = null;
	public tabIndex: number = 2;
	constructor(
		private logger: LogService,
	) {

	}
}
