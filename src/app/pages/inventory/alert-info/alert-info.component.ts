import {
	Component,
	DoCheck,
	ElementRef,
	EventEmitter,
	Input,
	KeyValueDiffer,
	KeyValueDiffers,
	OnDestroy,
	OnInit,
	Output,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import * as _ from 'lodash';
import { Subscription, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AlertData } from '@interfaces';

/**
 * Interface representing a row in the table
 */
export interface Row {
	key: string;
	selected: boolean;
	data: AlertData;
}

/**
 * Interface representing the options necessary to compile a gauge
 */
export interface Gauge {
	title: string;
	color: string;
	percent?: number;
	count?: number;
	selected?: boolean;
}

/**
 * Interface representing the options for creating a column in a table
 */
export interface Column {
	key: string;
	name: string;
	sortable?: boolean;
	sorting?: boolean;
	sortDirection?: string;
	template?: TemplateRef<{ }>;
	width?: string;
}

/**
 * Interface representing the available and required options for the AlertInfoComponent
 */
export interface AlertInfoOptions {
	key: string;
	title?: string;
	gauges?: Gauge[];
	data: AlertData[];
	table: Column[];
}

/**
 * Component representing the drop downs for an individually selected
 * alert. Uses the AlertInfoOptions interface
 *
 * @example
 * <alert-info [options]="{
 * 	key: string,
 * 	gauges: Gauge[],
 * 	data: AlertData[],
 * 	table: Column[],
 * 	title: string,
 * }"
 * (onSelect)="onSelect($event)">
 * </alert-info>
 */
@Component({
	selector: 'alert-info',
	styleUrls: ['./alert-info.component.scss'],
	templateUrl: './alert-info.component.html',
})
export class AlertInfoComponent implements OnInit, OnDestroy, DoCheck {

	/**
	 * The options able to pass to the component
	 */
	@Input() public options: AlertInfoOptions;

	/**
	 * Used for listening when a row is selected and returns the row
	 */
	@Output() public onSelect  = new EventEmitter();

	/**
	 * The rows used for building the table
	 */
	public rows: Row[];

	/**
	 * The setup for the search options
	 */
	public searchOptions = {
		debounce: 1500,
		max: 100,
		min: 3,
		pattern: /^[a-zA-Z ]*$/,
	};

	/**
	 * Represents our search form used for validation
	 */
	public searchForm: FormGroup;

	/**
	 * Our search input form control
	 */
	public search: FormControl = new FormControl('');

	/**
	 * Element Reference to our search input
	 */
	@ViewChild('searchInput') public searchInput: ElementRef;

	/**
	 * Used to keep a copy of our data during initialization, so we can always retrieve it
	 */
	private cachedData = [];

	/**
	 * The subscription we attach to our search input during initialization for debouncing
	 */
	private searchSubscribe: Subscription;

	/**
	 * KeyValueDiffer used to detect when changes have been made to our options,
	 * so we can then adjust
	 *
	 * @TODO Figure out how to remove the 'any; reference
	 * in the KeyValueDiffer or if it is even possible
	 */
	private _objDiffs: { [key: string]: KeyValueDiffer<string, any> } = { };

	/**
	 * The index of our filtered gauge, used for keeping track so we can filter and
	 * search at the same time
	 */
	private filteredGauge: number;

	constructor (
		private keyValueDiffers: KeyValueDiffers,
	) { }

	/**
	 * Filters the table data based on an optional query (or the searchInput) and/or
	 * the selection from the filter gauge
	 * @param query optional search param
	 */
	private filter (query?: string) {
		let filteredData = [];
		if (this.search.valid || query) {
			filteredData = _.filter(this.cachedData, d => {
				const searchIn = Object.keys(d)
					.reduce((res, value) =>
						(value !== 'id') ? res + d[value] : res, '');

				return _.includes(_.lowerCase(searchIn), _.lowerCase(this.search.value || query));
			});
		} else {
			filteredData = _.cloneDeep(this.cachedData);
		}

		if (this.filteredGauge) {
			filteredData = _.filter(filteredData, d =>
				_.get(d, 'severity') === this.filteredGauge);
		}

		this.options.data = filteredData;
		this.buildRows();
	}

	/**
	 * Handles toggling which gauge we're filtering by
	 * @param gauge the selected gauge object (from options.gauges)
	 * @param index the index of the gauge in the array, used for severity calculations
	 */
	public gaugeFilter (gauge: Gauge, index: number) {
		_.each(this.options.gauges, g => {
			if (g.title !== gauge.title) {
				g.selected = false;
			}
		});
		gauge.selected = !gauge.selected;

		this.filteredGauge = gauge.selected ? (index + 1) : undefined;
		this.filter();
	}

	/**
	 * Function used to sort the data inside the table
	 * @param column the column to sort the data by
	 */
	public onSort (column) {
		if (column.sortable) {
			_.each(this.options.table, t => {
				t.sorting = false;
			});
			column.sortDirection = (column.sortDirection === 'asc') ? 'desc' : 'asc';
			column.sorting = true;
			this.buildRows();
		}
	}

	/**
	 * Function used to select a row (setting a boolean) and then emitting the selection
	 * @param row the row we've selected
	 */
	public onRowSelect (row: Row) {
		_.each(this.rows, (r: Row) => {
			if (!_.isEqual(r, row)) {
				r.selected = false;
			}
		});
		row.selected = !row.selected;
		this.onSelect.emit(row);
	}

	/**
	 * Handler for performing a search
	 * @param query search string
	 */
	public doSearch (query: string) {
		if (query) {
			this.filter(query);
		}
	}

	/**
	 * Builds the search debounce subscription
	 */
	private searchSubscription () {
		this.searchSubscribe = fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(map((evt: KeyboardEvent) => (<HTMLInputElement> evt.target).value))
			.pipe(debounceTime(this.searchOptions.debounce))
			.pipe(distinctUntilChanged())
			.subscribe((query: string) => this.doSearch(query));
	}

	/**
	 * Used to initialize our rows by first sorting the data and then adding them to the rows
	 */
	private buildRows () {
		const sortingColumn = _.find(this.options.table, { sorting: true });

		if (sortingColumn) {
			this.options.data = _.orderBy(
				this.options.data,
				[sortingColumn.key],
				[sortingColumn.sortDirection || 'asc'],
			);
		}

		this.rows = _.map(this.options.data,
			(data: AlertData) =>
				({ data, key: this.options.key, selected: false }));
	}

	/**
	 * On Init
	 * Will build our keyValueDiffs for the options as well as do the initial table sorting
	 * and create our search input
	 */
	public ngOnInit () {
		this._objDiffs.options = this.keyValueDiffers.find(this.options || { })
			.create();

		if (this.options) {
			this.cachedData = this.options.data;
			this.buildRows();
		}

		this.searchForm = new FormGroup({
			search: this.search,
		});

		this.searchSubscription();
	}

	/**
	 * Handler for destroying subscriptions
	 */
	public ngOnDestroy () {
		_.invoke(this.searchSubscribe, 'unsubscribe');
	}

	/**
	 * Handler for updating options
	 * Will keep a check out to see if options has changed and if so, will reset our search/filter
	 * and override our caching then sort the new data if necessary
	 */
	public ngDoCheck () {
		const changes = this._objDiffs.options.diff(this.options);
		if (changes) {
			changes.forEachChangedItem(item => {
				if (
					item.key === 'title' &&
					item.currentValue !== item.previousValue
				) {
					this.search.reset();
					this.filteredGauge = undefined;
					this.cachedData = this.options.data;
					this.searchSubscription();
					this.buildRows();
				}
			});
		}
	}
}
