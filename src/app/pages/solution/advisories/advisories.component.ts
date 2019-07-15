import {
	Component,
	OnInit,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { I18n } from '@cisco-ngx/cui-utils';
import { Subscription } from 'rxjs';
import * as _ from 'lodash-es';
import { VisualFilter } from '@interfaces';

/** Our current customerId */
// const customerId = '2431199';

/** Interface for a tab */
interface Tab {
	disabled?: boolean;
	key: string;
	label: string;
	template: TemplateRef<{ }>;
	selected?: boolean;
	filtered?: boolean;
	filters?: VisualFilter[];
	pagination?: {
		countStr: string;
		total: number;
	};
}

/**
 * Advisories Component
 */
@Component({
	selector: 'app-advisories',
	styleUrls: ['./advisories.component.scss'],
	templateUrl: './advisories.component.html',
})
export class AdvisoriesComponent implements OnInit {

	public status = {
		filterCollapse: false,
		isLoading: true,
		loading: {

		},
	};
	public search: FormControl = new FormControl('');
	public searchForm: FormGroup;
	private searchSubscribe: Subscription;
	public filterCollapse = false;
	public searchOptions = {
		debounce: 1500,
		max: 100,
		min: 3,
		pattern: /^[a-zA-Z ]*$/,
	};
	public paginationCount = 4;
	public pagination = {
		total: 5,
	};

	public tabs: Tab[] = [];

	public fullscreen = false;

	@ViewChild('securityContent', { static: true }) private securityTemplate: TemplateRef<{ }>;
	@ViewChild('fieldContent', { static: true }) private fieldTemplate: TemplateRef<{ }>;
	@ViewChild('bugContent', { static: true }) private bugTemplate: TemplateRef<{ }>;
	@ViewChild('totalFilter', { static: true }) private totalFilterTemplate: TemplateRef<{ }>;
	@ViewChild('pieChartFilter', { static: true }) private pieChartFilterTemplate: TemplateRef<{ }>;
	@ViewChild('verticalBarChartFilter', { static: true })
		private verticalBarChartFilterTemplate: TemplateRef<{ }>;

	/**
	 * Returns the currently selected tab
	 * @returns the tab
	 */
	get selectedTab () {
		return _.find(this.tabs, 'selected');
	}

	/**
	 * Returns the current selected visual filters
	 * @returns the selected visual filters
	 */
	get selectedFilters () {
		return _.filter(this.selectedTab.filters, 'selected');
	}

	/**
	 * Initializes the tabs
	 */
	private buildTabs () {
		this.tabs = [
			{
				filters: [
					{
						key: 'total',
						loading: true,
						selected: true,
						seriesData: [],
						template: this.totalFilterTemplate,
						title: I18n.get('_Total_'),
					},
					{
						key: 'impact',
						loading: true,
						selected: true,
						seriesData: [],
						template: this.pieChartFilterTemplate,
						title: I18n.get('_Impact_'),
					},
					{
						key: 'lastUpdate',
						loading: true,
						selected: true,
						seriesData: [],
						template: this.verticalBarChartFilterTemplate,
						title: I18n.get('_LastUpdated_'),
					},
				],
				key: 'security',
				label: I18n.get('_SecurityAdvisories_'),
				selected: true,
				template: this.securityTemplate,
			},
			{
				filters: [
					{
						key: 'total',
						loading: true,
						selected: true,
						seriesData: [],
						template: this.totalFilterTemplate,
						title: I18n.get('_Total_'),
					},
					{
						key: 'lastUpdate',
						loading: true,
						selected: true,
						seriesData: [],
						template: this.verticalBarChartFilterTemplate,
						title: I18n.get('_LastUpdated_'),
					},
				],
				key: 'field',
				label: I18n.get('_FieldNotices_'),
				template: this.fieldTemplate,
			},
			{
				disabled: true,
				filters: [
					{
						key: 'total',
						loading: true,
						selected: true,
						seriesData: [],
						template: this.totalFilterTemplate,
						title: I18n.get('_Total_'),
					},
					{
						key: 'state',
						loading: true,
						selected: true,
						seriesData: [],
						template: this.pieChartFilterTemplate,
						title: I18n.get('_State_'),
					},
				],
				key: 'bugs',
				label: I18n.get('_CriticalBugs_'),
				template: this.bugTemplate,
			},
		];
	}

	/**
	 * Returns the selected sub filters
	 * @param key the key to match to the filter
	 * @returns the array of filters
	 */
	public getSelectedSubFilters (key: string) {
		const tab = this.selectedTab;
		const filter = _.find(tab.filters, { key });

		if (filter) {
			return _.filter(filter.seriesData, 'selected');
		}
	}

	/**
	 * Adds a subfilter to the given filer
	 * @param subfilter the subfilter selected
	 * @param filter the filter we selected the subfilter on
	 */
	public onSubfilterSelect (subfilter: string, filter: VisualFilter) {
		const tab = this.selectedTab;
		const sub = _.find(filter.seriesData, { filter: subfilter });
		if (sub) {
			sub.selected = !sub.selected;
		}

		filter.selected = _.some(filter.seriesData, 'selected');

		const totalFilter = _.find(tab.filters, { key: 'total' });
		if (filter.selected) {
			totalFilter.selected = false;
			tab.filtered = true;
		} else {
			const total = _.reduce(tab.filters, (memo, f) => {
				if (!memo) {
					return _.some(f.seriesData, 'selected');
				}

				return memo;
			}, false);

			totalFilter.selected = !total;
			tab.filtered = total;
		}
	}

	/**
	 * Reroutes to a specific tab
	 * @param event the index of the tab we've selected
	 */
	public selectTab (event: number) {
		_.each(this.tabs, (tab: Tab) => {
			if (tab !== this.tabs[event]) {
				tab.selected = false;
			}
		});

		this.tabs[event].selected = true;
	}

	/** Initializer Function */
	public ngOnInit () {
		this.buildTabs();
		this.searchForm = new FormGroup({
			search: this.search,
		});
	}
}
