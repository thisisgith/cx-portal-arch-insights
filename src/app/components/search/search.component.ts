import {
	ChangeDetectorRef,
	Component,
	ViewChild,
} from '@angular/core';
import { SearchContext, SearchType, SearchEnum } from '@interfaces';

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

	public searchText = '';
	public selectedSearch: string;
	public searchType: SearchType;
	public generalSearch: string;
	public searchContext: string;
	public hideSpecialSearch = false;
	public hideGeneralSearch = false;

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
		/** Set search context right away for the general searches fired in parallel */
		if (search.type.name === SearchEnum.contract) {
			this.searchContext = SearchContext.contract;
		} else if (search.type.name === SearchEnum.sn) {
			this.searchContext = SearchContext.serialno;
		} else {
			this.searchContext = null;
		}
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
			this.searchType.name = SearchEnum.default;
			this.generalSearch = this.searchText;
			this.searchContext = null;
		}
	}

	/**
	 * Toggles the general search visibility.
	 * @param event Event object
	 * @param event.hide If true, hides general search. If false, displays it.
	 * @param event.searchString If provided, overwrites the general search string.
	 */
	public toggleGeneralSearch (
		event: { hide: boolean, searchString?: string, context?: SearchContext },
	) {
		this.hideGeneralSearch = event.hide;
		if (event.searchString) {
			this.generalSearch = event.searchString;
		}
		if (event.context) {
			this.searchContext = event.context;
		} else {
			this.searchContext = null;
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
