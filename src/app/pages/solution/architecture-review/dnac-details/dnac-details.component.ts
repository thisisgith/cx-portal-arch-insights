import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * DNAC Details Component
 */
@Component({
	selector: 'dnac-details',
	styleUrls: ['./dnac-details.component.scss'],
	templateUrl: './dnac-details.component.html',
})
export class DnacDetailsComponent {

	@Input('dnacDetails') public dnacDetails: any = null;
	constructor (private logger: LogService) {
	}
}
