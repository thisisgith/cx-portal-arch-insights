import { Component, Input } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Component to display when no results are found
 */
@Component({
	selector: 'app-no-results',
	styleUrls: ['./no-results.component.scss'],
	templateUrl: './no-results.component.html',
})
export class NoResultsComponent {
	/** search query text */
	@Input('query') public query: string;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('NoResultsComponent Created!');
	}
}
