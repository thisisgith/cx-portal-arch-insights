import { Component } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Main Policies component
 */
@Component({
	selector: 'app-policies',
	styleUrls: ['./policies.component.scss'],
	templateUrl: './policies.component.html',
})
export class PoliciesComponent {

	public scans = [
		{
			enabled: true,
			message: '2,258 devices scanned daily at 1:30am UTC',
		},
		{
			enabled: true,
			message: '105 devices are scanned weekly on Tuesday 3:00am UTC',
		},
		{
			enabled: true,
			message: '2,258 devices are scanned daily at 1:30am UTC',
		},
		{
			enabled: false,
			message: '12 devices cannot be scanned at any time',
		},
	];

	public collections = [
		{
			message: 'Network runs collection every month on the 26th at 5:30am UTC',
		},
	];

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('PoliciesComponent Created!');
	}
}
