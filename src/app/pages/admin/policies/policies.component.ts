import { Component } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

@Component({
	selector: 'app-policies',
	styleUrls: ['./policies.component.scss'],
	templateUrl: './policies.component.html',
})
export class PoliciesComponent {

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('PoliciesComponent Created!');
	}
}
