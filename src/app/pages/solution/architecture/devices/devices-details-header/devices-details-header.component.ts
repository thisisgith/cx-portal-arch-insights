import { Component, Input } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Devices Header Component
 */
@Component({
	selector: 'devices-details-header',
	styleUrls: ['./devices-details-header.component.scss'],
	templateUrl: './devices-details-header.component.html',
})
export class DevicesDetailsHeaderComponent {

	@Input('deviceDetails') public deviceDetails: any = null;
	constructor(private logger: LogService, ) {

	}
}
