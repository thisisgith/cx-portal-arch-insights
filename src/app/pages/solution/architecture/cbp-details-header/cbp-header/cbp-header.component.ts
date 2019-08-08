import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { IException } from '@sdp-api';

/**
 * CBP Rules Header Component
 */
@Component({
	selector: 'cbp-header',
	styleUrls: ['./cbp-header.component.scss'],
	templateUrl: './cbp-header.component.html',
})
export class CbpHeaderComponent {

	@Input('cbpDetails') public cbpDetails: IException = null;
	constructor (private logger: LogService) {

	}
}
