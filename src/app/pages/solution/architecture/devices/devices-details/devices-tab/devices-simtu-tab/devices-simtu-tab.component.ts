import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Devices Switch Interface MTU Tab Component
 */
@Component({
	selector: 'devices-simtu-tab',
	styleUrls: ['./devices-simtu-tab.component.scss'],
	templateUrl: './devices-simtu-tab.component.html',
})
export class DevicesSimtuTabComponent {

	@Input('deviceDetails') public deviceDetails: any = null;
	public tabIndex: number = 3;
	constructor (
		private logger: LogService,
	) {
		
	}
}
