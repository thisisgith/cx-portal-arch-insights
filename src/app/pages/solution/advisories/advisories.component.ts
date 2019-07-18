import {
	Component,
	OnInit,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { I18n } from '@cisco-ngx/cui-utils';
import { Subscription, of, forkJoin } from 'rxjs';
import * as _ from 'lodash-es';
import { VisualFilter } from '@interfaces';
import { ProductAlertsService, SecurityAdvisorySummary, VulnerabilityResponse } from '@sdp-api';
import { catchError, map } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';
import { StrictHttpResponse } from 'projects/sdp-api/src/lib/core/strict-http-response';

/** Our current customerId */
const customerId = '2431199';

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

/** Interface for advisory summary data */
interface AdvisorySummaryItem {
	alertSeverity?: string;
	alertCount?: number;
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

	constructor (
		private productAlertsService: ProductAlertsService,
		private logger: LogService,
	) { }

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
						selected: false,
						seriesData: [],
						template: this.pieChartFilterTemplate,
						title: I18n.get('_Impact_'),
					},
					{
						key: 'lastUpdate',
						loading: true,
						selected: false,
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
						selected: false,
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
						selected: false,
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
		this.loadData();
	}

	/**
	 * Function used to load all of the data
	 */
	private loadData () {
		this.status.isLoading = true;
		forkJoin(
			this.getAdvisoriesSummary(),
			this.getAdvisoriesLastUpdated(),
			this.getFieldNoticesLastUpdated(),
			this.getBugStates(),
			this.getTotals(),
		)
		.subscribe(() => {
			this.status.isLoading = false;

			if (window.Cypress) {
				window.loading = false;
			}

			this.logger.debug('advisories.component : loadData() :: Finished Loading');
		});
	}

	/**
	 * Gets the summary data for the advisories pie chart
	 * @returns the summary data for the advisories pie chart
	 */
	private getAdvisoriesSummary () {
		const securityTab = _.find(this.tabs, { key: 'security' });
		const impactFilter =
			_.find(securityTab.filters, { key: 'impact' });

		return this.productAlertsService.getSecurityAdvisorySummaryResponse(customerId)
		.pipe(
			map((data: StrictHttpResponse<SecurityAdvisorySummary>) => {
				const body = _.get(data, 'body');

				const summaries = _.get(body, 'advisorySummary');
				impactFilter.seriesData = _.map(summaries, (s: AdvisorySummaryItem) => ({
					filter: _.get(s, 'alertSeverity'),
					label: _.capitalize(_.get(s, 'alertSeverity')),
					selected: false,
					value: _.get(s, 'alertCount'),
				}));

				impactFilter.loading = false;
			}),
			catchError(err => {
				// totalFilter.loading = false;
				impactFilter.loading = false;
				this.logger.error('advisories.component : getAdvisoriesSummary() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Gets the info for the Last Updated bar chart on the advisories tab
	 * @returns the info for the Last Updated bar chart on the advisories tab
	 */
	private getAdvisoriesLastUpdated () {
		const securityTab = _.find(this.tabs, { key: 'security' });
		const lastUpdateFilter =
			_.find(securityTab.filters, { key: 'lastUpdate' });

		// TODO: implement using endpoint once it exists
		lastUpdateFilter.seriesData = [
			{
				filter: 'gt-0-lt-30-days',
				label: '< 30 Days',
				selected: false,
				value: 5,
			},
			{
				filter: 'gt-30-lt-60-days',
				label: '30 - 60 Days',
				selected: false,
				value: 6,
			},
			{
				filter: 'gt-60-lt-90-days',
				label: '60 - 90 Days',
				selected: false,
				value: 7,
			},
			{
				filter: 'gt-90-days',
				label: 'further out',
				selected: false,
				value: 8,
			},
		];
		lastUpdateFilter.loading = false;

		return lastUpdateFilter.seriesData;
	}

	/**
	 * Gets the info for the Last Updated bar chart on the field notices tab
	 * @returns the info for the Last Updated bar chart on the field notices tab
	 */
	private getFieldNoticesLastUpdated () {
		const fieldNoticesTab = _.find(this.tabs, { key: 'field' });
		const lastUpdateFilter =
			_.find(fieldNoticesTab.filters, { key: 'lastUpdate' });

		// TODO: implement using endpoint once it exists
		lastUpdateFilter.seriesData = [
			{
				filter: 'gt-0-lt-30-days',
				label: '< 30 Days',
				selected: false,
				value: 5,
			},
			{
				filter: 'gt-30-lt-60-days',
				label: '30 - 60 Days',
				selected: false,
				value: 6,
			},
			{
				filter: 'gt-60-lt-90-days',
				label: '60 - 90 Days',
				selected: false,
				value: 7,
			},
			{
				filter: 'gt-90-days',
				label: 'further out',
				selected: false,
				value: 8,
			},
		];
		lastUpdateFilter.loading = false;

		return lastUpdateFilter.seriesData;
	}

	/**
	 * Gets the info for the Bug States pie chart on the critical bugs tab
	 * @returns the info for the Bug States pie chart on the critical bugs tab
	 */
	private getBugStates () {
		const bugsTab = _.find(this.tabs, { key: 'bugs' });
		const bugStateFilter = _.find(bugsTab.filters, { key: 'state' });

		// TODO: implement using endpoint once it exists
		bugStateFilter.seriesData = [
			{
				filter: 'New',
				label: 'New',
				selected: false,
				value: 1,
			},
			{
				filter: 'Closed',
				label: 'Closed',
				selected: false,
				value: 1,
			},
			{
				filter: 'Duplicate',
				label: 'Duplicate',
				selected: false,
				value: 1,
			},
			{
				filter: 'Verified',
				label: 'Verified',
				selected: false,
				value: 1,
			},
			{
				filter: 'Resolved',
				label: 'Resolved',
				selected: false,
				value: 1,
			},
		];
		bugStateFilter.loading = false;

		return bugStateFilter.seriesData;
	}

	/**
	 * Fetches the advisory counts for the visual filter
	 * @returns the advisory counts
	 */
	private getTotals () {
		const securityTab = _.find(this.tabs, { key: 'security' });
		const fieldNoticesTab = _.find(this.tabs, { key: 'field' });
		const bugsTab = _.find(this.tabs, { key: 'bugs' });

		const totalAdvisoryFilter = _.find(securityTab.filters, { key: 'total' });
		const totalFieldNoticesFilter = _.find(fieldNoticesTab.filters, { key: 'total' });
		const totalBugsFilter = _.find(bugsTab.filters, { key: 'total' });

		return this.productAlertsService.getVulnerabilityCounts({ customerId })
		.pipe(
			map((data: VulnerabilityResponse) => {
				totalAdvisoryFilter.seriesData = [{
					value: _.get(data, 'security-advisories', 0),
				}];
				totalAdvisoryFilter.loading = false;

				totalFieldNoticesFilter.seriesData = [{
					value: _.get(data, 'field-notices', 0),
				}];
				totalFieldNoticesFilter.loading = false;

				totalBugsFilter.seriesData = [{
					value: _.get(data, 'bugs', 0),
				}];
				totalBugsFilter.loading = false;
			}),
			catchError(err => {
				totalAdvisoryFilter.loading = false;
				totalFieldNoticesFilter.loading = false;
				totalBugsFilter.loading = false;
				this.logger.error('advisories.component : getTotals() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
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

	/**
	 * Clears all filters for the currently selected tab
	 */
	public clearFilters () {
		_.each(this.selectedTab.filters, (filter: VisualFilter) => {
			filter.selected = false;
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});
	}
}
