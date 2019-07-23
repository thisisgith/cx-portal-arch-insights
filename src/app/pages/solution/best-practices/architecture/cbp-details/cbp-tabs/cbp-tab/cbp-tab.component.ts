import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * CBP exceptions tab Component
 */
@Component({
	selector: 'cbp-tab',
	styleUrls: ['./cbp-tab.component.scss'],
	templateUrl: './cbp-tab.component.html',
})
export class CbpTabComponent {

	@Input('cbpDetails') public cbpDetails: any;
	constructor (private logger: LogService) {
	}
}
