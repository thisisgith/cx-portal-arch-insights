import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

@Component({
	selector: 'devices-tab',
	styleUrls: ['./devices-tab.component.scss'],
	templateUrl: './devices-tab.component.html',
})
export class DevicesTabComponent {

	@Input('deviceDetails') public deviceDetails: any = null;
	@Input('tabIndex') public  tabIndex: number = 0;
	constructor (
		private logger: LogService,
	) {
		
	}
}
