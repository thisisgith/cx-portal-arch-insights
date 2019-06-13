import {
	ChangeDetectorRef,
	Component,
	ViewChild,
} from '@angular/core';
import { SearchType } from '@interfaces';

import { products } from './products.const';
import { SpecialSearchComponent } from './special-search/special-search.component';

/**
 * Main Search Component
 */
@Component({
	selector: 'app-search',
	styleUrls: ['./search.component.scss'],
	templateUrl: './search.component.html',
})
export class SearchComponent {
	@ViewChild(SpecialSearchComponent, { static: false }) set content
		(component: SpecialSearchComponent) {
			this.specialSearch = component;
			this.cdr.detectChanges();
		}
	public specialSearch: SpecialSearchComponent;
	public products = products;

	public searchText = '';
	public selectedSearch: string;
	public searchType: SearchType;

	public status = {
		hidden: true,
	};

	constructor (private cdr: ChangeDetectorRef) { }

	/**
	 * Fires when the user makes a new search (hits enter or selects from typeahead)
	 * @param search the search text and type
	 */
	public onSearchChange (search: { name: string, type: SearchType }) {
		this.status.hidden = false;
		this.selectedSearch = search.name;
		this.searchType = search.type;
	}

	/**
	 * Close search results modal on click
	 */
	public onClose () {
		this.status.hidden = true;
		this.searchText = '';
	}
}
