import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * DNAC Header Component
 */
@Component({
	selector: 'dnac-details-header',
	styleUrls: ['./dnac-details-header.component.scss'],
	templateUrl: './dnac-details-header.component.html',
})
export class DnacDetailsHeaderComponent {

	@Input('dnacDetails') public dnacDetails: any = null;
	constructor (private logger: LogService) {
		
	}
}
