import { Component, Input } from '@angular/core';

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
}
