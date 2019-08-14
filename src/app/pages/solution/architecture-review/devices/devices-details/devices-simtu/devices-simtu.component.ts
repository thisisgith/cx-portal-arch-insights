import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Devices Switch Interface MTU Component
 */
@Component({
	selector: 'devices-simtu',
	styleUrls: ['./devices-simtu.component.scss'],
	templateUrl: './devices-simtu.component.html',
})
export class DevicesSimtuComponent {

	@Input('deviceDetails') public deviceDetails: any = null;
	constructor(
		private logger: LogService,
	) {

	}
}
