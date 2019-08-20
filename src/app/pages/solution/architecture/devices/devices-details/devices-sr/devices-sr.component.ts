import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Devices Switch Redundancy Component
 */
@Component({
	selector: 'devices-sr',
	styleUrls: ['./devices-sr.component.scss'],
	templateUrl: './devices-sr.component.html',
})
export class DevicesSrComponent {

	@Input('deviceDetails') public deviceDetails: any = null;
	constructor (
		private logger: LogService,
	) {
		
	}
}
