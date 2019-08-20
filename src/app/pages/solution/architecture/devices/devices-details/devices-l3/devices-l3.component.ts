import { Component, Input } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';


/**
 * Devices L3 Access Switching Component
 */
@Component({
	selector: 'devices-l3',
	styleUrls: ['./devices-l3.component.scss'],
	templateUrl: './devices-l3.component.html',
})
export class DevicesL3Component {

	@Input('deviceDetails') public deviceDetails: any = null;
	constructor(
		private logger: LogService,
	) {

	}
}
