import { Component } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Related RMA list Component
 */
@Component({
	selector: 'app-related-rma',
	styleUrls: ['./related-rma.component.scss'],
	templateUrl: './related-rma.component.html',
})
export class RelatedRmaComponent {

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('RelatedRmaComponent Created!');
	}
}
