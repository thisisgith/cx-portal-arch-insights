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
	public generalSearch: string;
	public hideSpecialSearch = false;

	public status = {
		hidden: true,
	};

	constructor (private cdr: ChangeDetectorRef) { }

	/**
	 * Fires when the user makes a new search (hits enter or selects from typeahead)
	 * @param search the search text and type
	 */
	public onSearchChange (search: { text: string, type: SearchType, generalSearch: string }) {
		this.status.hidden = false;
		this.selectedSearch = search.text;
		this.searchType = search.type;
		this.generalSearch = search.generalSearch;
	}

	/**
	 * Listen to special search component's "hide" event emitter
	 * Hides it when emits true
	 * @param hide whether to hide the component
	 */
	public onHide (hide: boolean) {
		this.hideSpecialSearch = hide;
		// This will trigger a new search on the plain searchText if it was changed to something
		// else by the special search view
		if (hide) {
			this.generalSearch = this.searchText;
		}
	}

	/**
	 * Close search results modal on click
	 */
	public onClose () {
		this.status.hidden = true;
		this.searchText = '';
	}
}
