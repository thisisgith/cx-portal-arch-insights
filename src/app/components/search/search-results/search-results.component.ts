import { Component } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

/**
 * Main SearchResults Component
 */
@Component({
	selector: 'app-search-results',
	styleUrls: ['./search-results.component.scss'],
	templateUrl: './search-results.component.html',
})
export class SearchResultsComponent {

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('SearchResultsComponent Created!');
	}
}
