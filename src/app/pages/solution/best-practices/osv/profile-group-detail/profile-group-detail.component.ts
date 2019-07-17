import { Component } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

@Component({
	selector: 'app-profile-group-detail',
	styleUrls: ['./profile-group-detail.component.scss'],
	templateUrl: './profile-group-detail.component.html',
})
export class ProfileGroupDetailComponent {

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('ProfileGroupDetailComponent Created!');
	}
}
