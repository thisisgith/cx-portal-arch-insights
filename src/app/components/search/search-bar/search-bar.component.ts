import {
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnInit,
	OnDestroy,
	Output,
	ViewChild,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { SearchType, SearchEnum } from '@interfaces';
import { SearchService } from '@services';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash';

/** Limit on number of typeahead results */
const TYPEAHEAD_LIMIT = 7;
/**
 * Component representing actual search input bar with typeahead
 */
@Component({
	selector: 'app-search-bar',
	styleUrls: ['./search-bar.component.scss'],
	templateUrl: './search-bar.component.html',
})
export class SearchBarComponent implements OnInit, OnDestroy {
	@ViewChild('searchInput', { static: true, read: ElementRef }) public searchInput:
		ElementRef<any>;
	@Input('searchText') public searchText: string;
	@Output('searchTextChange') public searchTextChange = new EventEmitter<string>();
	@Output('searchChange') public searchChange = new EventEmitter<{
		text: string;
		type: SearchType;
		generalSearch: string;
	}>();

	public typeaheadItems: {
		name: string;
		keyHover?: boolean;
	}[];
	public options = {
		max: 500,
		pattern: /^[a-zA-Z0-9\s\-\/\(\).]*$/,
	};
	private focused = false;

	/** -1 means no keyboard item is hovered */
	public keyHoverIndex = -1;

	private destroy$ = new Subject();
	private search$ = new Subject<string>();

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

		this.search$.pipe(
			debounceTime(200),
			switchMap(text => this.fetchData(text)),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			const hits = _.get(result, ['responses', 0, 'hits', 'hits']);
			if (hits) {
				this.typeaheadItems = hits.map(hit => ({
					name: _.get(hit, ['_source', 'cdc_displaytext'], ''),
				}));
			} else {
				this.typeaheadItems = null;
			}
		});
	}

	/**
	 * OnDestroy Lifecycle Hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Fired when user updates search. Update typeahead options.
	 * @param value the current text input
	 */
	public onSearch (value: string) {
		this.searchText = value;
		this.searchTextChange.emit(value);
		this.search$.next(value);
	}

	/**
	 * Fired when the input box is focused
	 * will trigger typeahead search if there's a value in it.
	 */
	public onFocus () {
		this.focused = true;
		if (this.searchText) {
			this.search$.next(this.searchText);
		}
	}

	/**
	 * Fired when the input box is blurred
	 * will trigger typeahead search if there's a value in it.
	 */
	public onBlur () {
		this.focused = false;
	}

	/**
	 * Listener for all key events
	 * detect the Enter key and update the selection if pressed
	 * detect up/down arrow keys and update highlighted option
	 * @param event incoming keyboard event
	 */
	@HostListener('document:keyup', ['$event'])
	public keyHandler (event: KeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				if (this.focused) {
					const hovered = _.find(this.typeaheadItems, { keyHover: true });
					if (hovered) {
						this.onSearchSelect(hovered.name, true);
					} else {
						this.onSearchSelect();
					}
				}
				break;
			case 'ArrowUp':
				this.moveKeyHover(-1);
				break;
			case 'ArrowDown':
				this.moveKeyHover(1);
				break;
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
			 this.keyHoverIndex = -1;
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
		const typeaheadItem = _.find(this.typeaheadItems, { name: this.searchText });
		if (typeahead || typeaheadItem) {
			type = {
				name: SearchEnum.product,
				value: typeaheadItem,
			};
		} else {
			type = this.service.determineType(this.searchText);
		}
		let generalSearch = this.searchText;
		if (type.name === SearchEnum.contract) {
			generalSearch = 'contract';
		}

		this.searchChange.emit({
			generalSearch,
			type,
			text: this.searchText,
		});
		this.typeaheadItems = null;
		this.keyHoverIndex = -1;
		this.searchInput.nativeElement.blur();
	}

	/**
	 * Fetch typeahead results from API
	 * @param query { string } search term
	 * @returns Observable with typeahead results
	 */
	private fetchData (query: string) {
		return this.service.fetchTypeahead({
			bizcontext: 'ENT',
			h: TYPEAHEAD_LIMIT,
			locale: 'enus',
			q: query,
		});
	}

	/**
	 * Move keyboard hover index. Fires when arrow keys are pressed.
	 * @param amt the amount to move the index
	 */
	private moveKeyHover (amt: number) {
		if (!this.focused) {
			return;
		}
		this.keyHoverIndex += amt;
		if (this.keyHoverIndex < -1
			|| (this.keyHoverIndex > _.get(this.typeaheadItems, 'length') - 1)) {
			this.keyHoverIndex = -1;
		}

		if (this.typeaheadItems) {
			this.typeaheadItems.forEach((o, idx) => {
				o.keyHover = (this.keyHoverIndex === idx);
			});
		}
	}
}
