import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * CBP assets with exception tab Component
 */
@Component({
	selector: 'cbp-awe-tab',
	styleUrls: ['./cbp-awe-tab.component.scss'],
	templateUrl: './cbp-awe-tab.component.html',
})
export class CbpAweTabComponent {

	@Input('cbpDetails') public cbpDetails: any;
	public tabIndex = 3;
	constructor (private logger: LogService) {

	}
}
