import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Devices L3 Access Switching Tab Component
 */
@Component({
	selector: 'devices-l3-tab',
	styleUrls: ['./devices-l3-tab.component.scss'],
	templateUrl: './devices-l3-tab.component.html',
})
export class DevicesL3TabComponent {

	@Input('deviceDetails') public deviceDetails: any = null;
	public tabIndex: number = 1;
	constructor(
		private logger: LogService,
	) {

	}
}
