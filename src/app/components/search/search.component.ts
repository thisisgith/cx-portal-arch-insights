import {
	Component,
} from '@angular/core';
import { SearchResults } from '@services';
import { SearchType } from '@interfaces';

import { products } from './products.const';

/**
 * Main Search Component
 */
@Component({
	selector: 'app-search',
	styleUrls: ['./search.component.scss'],
	templateUrl: './search.component.html',
})
export class SearchComponent {
	public products = products;

	public searchResults: SearchResults;
	public searchText = '';
	public generalQuery: string;

	public status = {
		hidden: true,
	};

	/**
	 * Fires when the user makes a new search (hits enter or selects from typeahead)
	 * @param search the search text and type
	 */
	public onSearchChange (search: { name: string, type: SearchType }) {
		this.status.hidden = false;
		this.generalQuery = search.name;
	}

	/**
	 * Close search results modal on click
	 */
	public onClose () {
		this.status.hidden = true;
		this.searchText = '';
	}
}
