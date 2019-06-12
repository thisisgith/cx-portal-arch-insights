import {
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { SearchType } from '@interfaces';
import { SearchService } from '@services';

/**
 * Component representing actual search input bar with typeahead
 */
@Component({
	selector: 'app-search-bar',
	styleUrls: ['./search-bar.component.scss'],
	templateUrl: './search-bar.component.html',
})
export class SearchBarComponent implements OnInit {
	@ViewChild('searchInput', { static: true, read: ElementRef }) public searchInput:
		ElementRef<any>;
	@Input('items') public items: {
		name: string;
	}[];
	@Input('searchText') public searchText: string;
	@Output('searchTextChange') public searchTextChange = new EventEmitter<string>();
	@Output('searchChange') public searchChange = new EventEmitter<{
		name: string;
		type: SearchType;
	}>();

	public typeaheadItems: {
		name: string;
	}[];
	public options = {
		max: 100,
		pattern: /^[a-zA-Z0-9\s]*$/,
	};

	constructor (
		private element: ElementRef,
		private logger: LogService,
		private service: SearchService,
	) {
		this.logger.debug('SearchBarComponent Created!');
	}

	/**
	 * OnInit Lifecycle Hook
	 */
	public ngOnInit () {
		this.searchText = '';
	}

	/**
	 * Fired when user updates search. Update typeahead options.
	 * @param value the current text input
	 */
	public onSearch (value: string) {
		this.searchText = value;
		this.searchTextChange.emit(value);
		if (!this.searchText) {
			this.typeaheadItems = null;

			return;
		}
		this.typeaheadItems = this.items.filter(
			item => item.name
				.toLowerCase()
				.includes(this.searchText.toLowerCase()),
		);
	}

	/**
	 * Listener to detect the Enter key and update the selection if pressed
	 * @param event incoming keyboard event
	 */
	@HostListener('document:keyup', ['$event'])
	public keyHandler (event: KeyboardEvent) {
		if (event.key === 'Enter'
			&& this.searchInput.nativeElement === document.activeElement) {
			this.onSearchSelect();
		}
	}

	/**
	 * Listener to detect a click outside the dropdown and close it.
	 * @param event incoming click event
	 */
	 @HostListener('document:click', ['$event'])
	 public clickHandler (event: Event) {
		 if (!this.element.nativeElement.contains(event.target)) {
			 this.typeaheadItems = null;
	 		this.searchInput.nativeElement.blur();
		 }
	 }

	/**
	 * Fired when the user hits 'enter' or selects a typeahead option
	 * @param text optionally set searchText (for clicking)
	 * @param typeahead whether this was triggered by a typeahead solution or not
	 */
	public onSearchSelect (text?: string, typeahead = false) {
		if (text) {
			this.searchText = text;
		}
		if (!this.searchText) {
			return;
		}
		let type: SearchType;
		if (typeahead || this.items.find(o => o.name === this.searchText)) {
			type = 'product';
		} else {
			type = this.service.determineType(this.searchText);
		}
		this.searchChange.emit({
			type,
			name: this.searchText,
		});
		this.typeaheadItems = null;
		this.searchInput.nativeElement.blur();
	}
}
