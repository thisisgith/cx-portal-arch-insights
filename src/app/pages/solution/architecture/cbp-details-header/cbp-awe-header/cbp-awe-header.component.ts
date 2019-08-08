import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { IAsset } from '@sdp-api';

/**
 * CBP Assets with Exception Header Component
 */
@Component({
	selector: 'cbp-awe-header',
	styleUrls: ['./cbp-awe-header.component.scss'],
	templateUrl: './cbp-awe-header.component.html',
})
export class CbpAweHeaderComponent {

	@Input('cbpDetails') public cbpDetails: IAsset = null;
	constructor (private logger: LogService) {

	}
}
