import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { IException } from '@sdp-api';
/**
 * CBP Summary Component
 */
@Component({
	selector: 'cbp-summary',
	styleUrls: ['./cbp-summary.component.scss'],
	templateUrl: './cbp-summary.component.html',
})
export class CbpSummaryComponent {

	@Input('cbpDetails') public cbpDetails: IException;

	constructor (private logger: LogService) {
	}
}
