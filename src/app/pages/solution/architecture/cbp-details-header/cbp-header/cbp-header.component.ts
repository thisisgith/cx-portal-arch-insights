import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * CBP Rules Header Component
 */
@Component({
	selector: 'cbp-header',
	styleUrls: ['./cbp-header.component.scss'],
	templateUrl: './cbp-header.component.html',
})
export class CbpHeaderComponent {

	@Input('cbpDetails') public cbpDetails: any = null;
	constructor (private logger: LogService) {

	}
}
