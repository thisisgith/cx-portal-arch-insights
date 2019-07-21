import { Component } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * SoftwareProfileDetail Component
 */
@Component({
	selector: 'app-software-profile-detail',
	styleUrls: ['./software-profile-detail.component.scss'],
	templateUrl: './software-profile-detail.component.html',
})
export class SoftwarProfileDetailComponent {

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('SoftwareProfileDetailComponent Created!');
	}
}
