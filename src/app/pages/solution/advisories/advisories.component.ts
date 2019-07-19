import {
	Component,
	OnInit,
	ViewChild,
	TemplateRef,
	OnDestroy,
} from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	ProductAlertsService,
	SecurityAdvisory,
	SecurityAdvisoryImpactCountResponse,
	SecurityAdvisoryImpactedInfoAndCount,
	ProductAlertsPagination as Pagination,
	FieldNoticeResponse,
	FieldNoticeBulletinResponse,
	FieldNoticeBulletin,
	SecurityAdvisorySummary,
	VulnerabilityResponse,
} from '@sdp-api';
import { of, forkJoin, Subject } from 'rxjs';
import * as _ from 'lodash-es';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { FormGroup, FormControl } from '@angular/forms';
import {
	map,
	catchError,
	switchMap,
	mergeMap,
} from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FromNowPipe } from '@cisco-ngx/cui-pipes';
import { DatePipe } from '@angular/common';
import { VisualFilter } from '@interfaces';
import { LogService } from '@cisco-ngx/cui-services';
import { StrictHttpResponse } from 'projects/sdp-api/src/lib/core/strict-http-response';

/** Interface for a tab */
interface Tab {
	data: SecurityAdvisoryImpactedInfoAndCount[]; // add more types as they copme
	disabled?: boolean;
	key: string;
	label: string;
	loading: boolean;
	template: TemplateRef<{ }>;
	selected?: boolean;
	filtered?: boolean;
	filters?: VisualFilter[];
	options?: CuiTableOptions;
	pagination?: {
		rows: number;
		page: number;
		countStr: string;
		total: number;
	};
	params?: ProductAlertsService.GetTopSecurityAdvisoriesParams |
	{
		notice: ProductAlertsService.GetFieldNoticeParams;
		bulletin: ProductAlertsService.GetFieldNoticeBulletinParams;
	};
	subject?: Subject<{ }>;
}

/** Our current customerId */
const customerId = '2431199';

/** Interface for advisory summary data */
interface AdvisorySummaryItem {
	alertSeverity?: string;
	alertCount?: number;
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
export class AdvisoriesComponent implements OnInit, OnDestroy {
	public status = {
		filterCollapse: false,
		isLoading: true,
	};
	public search: FormControl = new FormControl('');
	public searchForm: FormGroup;
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
	public selectedAdvisory: SecurityAdvisory;
	public securityAdvisories: SecurityAdvisoryImpactedInfoAndCount[];
	public activeTab: number;
	@ViewChild('impactTemplate', { static: true }) private impactTemplate: TemplateRef<{ }>;
	@ViewChild('impactedCountTemplate', { static: true })
		private impactedCountTemplate: TemplateRef<{ }>;
	@ViewChild('content', { static: true }) private contentTemplate: TemplateRef<{ }>;
	@ViewChild('totalFilter', { static: true }) private totalFilterTemplate: TemplateRef<{ }>;
	@ViewChild('pieChartFilter', { static: true }) private pieChartFilterTemplate: TemplateRef<{ }>;
	@ViewChild('verticalBarChartFilter', { static: true })
		private verticalBarChartFilterTemplate: TemplateRef<{ }>;

	constructor (
			private logger: LogService,
			private route: ActivatedRoute,
			private router: Router,
			private fromNow: FromNowPipe,
			private productAlertsService: ProductAlertsService,
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
		const datePipe = new DatePipe('en-us');
		this.tabs = [
			{
				data: [],
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
				loading: true,
				options: new CuiTableOptions({
					bordered: true,
					columns: [
						{
							name: I18n.get('_Impact_'),
							sortable: true,
							sortDirection: 'asc',
							template: this.impactTemplate,
						},
						{
							key: 'headline',
							name: I18n.get('_Title_'),
							sortable: false,
							value: 'headline',
						},
						{
							name:
								`${I18n.get('_ImpactedAsset_')} \
								(${I18n.get('_PotentiallyImpacted_')})`,
							sortable: false,
							template: this.impactedCountTemplate,
						},
						{
							key: 'revisedDate',
							name: I18n.get('_LastUpdated_'),
							render: item => item.revisedDate ?
								datePipe.transform(
									new Date(item.revisedDate), 'yyyy MMM dd') :
									I18n.get('_Never_'),
							sortable: false,
							value: 'revisedDate',
						},
						{
							name: I18n.get('_Version_'),
							sortable: false,
						},
					],
					dynamicData: true,
					padding: 'loose',
					striped: false,
					wrapText: true,
				}),
				params: {
					customerId,
					page: 1,
					rows: 10,
				},
				selected: true,
				subject: new Subject(),
				template: this.contentTemplate,
			},
			{
				data: [],
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
				loading: false,
				options: new CuiTableOptions({
					bordered: true,
					columns: [
						{
							key: 'fieldNoticeId',
							name: I18n.get('_ID_'),
							sortable: true,
							sortDirection: 'asc',
							value: 'fieldNoticeId',
						},
						{
							key: 'bulletinTitle',
							name: I18n.get('_Title_'),
							sortable: false,
							value: 'bulletinTitle',
						},
						{
							name: `${I18n.get('_VulnerableAssets_')}`,
							sortable: false,
						},
						{
							name: `${I18n.get('_PotentiallyVulnerableAssets_')}`,
							sortable: false,
						},
						{
							key: 'bulletinLastUpdated',
							name: I18n.get('_LastUpdated_'),
							render: item => item.bulletinLastUpdated ?
								datePipe.transform(
									new Date(item.bulletinLastUpdated), 'yyyy MMM dd') :
								I18n.get('_Never_'),
							sortable: true,
							value: 'bulletinLastUpdated',
						},
						{
							name: I18n.get('_Version_'),
							sortable: false,
						},
					],
					dynamicData: true,
					padding: 'loose',
					striped: false,
					wrapText: true,
				}),
				params: {
					bulletin: { },
					notice: {
						customerId,
						page: 1,
						rows: 10,
						vulnerabilityStatus: ['POTVUL', 'VUL'],
					},
					page: 1,
					rows: 10,
				},
				subject: new Subject(),
				template: this.contentTemplate,
			},
			{
				data: [],
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
						selected: false,
						seriesData: [],
						template: this.pieChartFilterTemplate,
						title: I18n.get('_State_'),
					},
				],
				key: 'bugs',
				label: I18n.get('_CriticalBugs_'),
				loading: false,
				params: {
					customerId,
					page: 1,
					rows: 10,
				},
				subject: new Subject(),
				template: this.contentTemplate,
			},
		];

		this.buildSecurityAdvisoriesSubject();
		this.buildFieldNoticesSubject();
		this.loadData();
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

	/**
	 * Fetches the field notices
	 * @returns an observable for fetching field notices
	 */
	private fetchFieldNotices () {
		const tab = _.find(this.tabs, { key: 'field' });
		tab.params.notice.page = tab.params.page;
		tab.loading = true;

		return this.productAlertsService.getFieldNotice(tab.params.notice)
		.pipe(
			mergeMap((response: FieldNoticeResponse) => {
				tab.data = response.data;
				const page = tab.params.notice.page;
				const rows = tab.params.notice.rows;
				tab.params.bulletin.fieldNoticeId = _.uniq(_.map(response.data, 'fieldNoticeId')
					.splice((page - 1) * rows, page * rows));
				tab.pagination = this.buildPagination(response.Pagination);

				return tab.params.bulletin.fieldNoticeId ? this.getFieldNoticeBulletins() :
					of({ });
			}),
			catchError(err => {
				tab.loading = false;
				this.logger.error('advisories.component : fetchFieldNotices() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Retrieves the field notice bulletins
	 * @returns the data
	 */
	private getFieldNoticeBulletins () {
		const fieldTab = _.find(this.tabs, { key: 'field' });

		return this.productAlertsService.getFieldNoticeBulletin(fieldTab.params.bulletin)
		.pipe(
			map((response: FieldNoticeBulletinResponse) => {

				const bulletins = _.reduce(response.data,
					(obj: any, bulletin: FieldNoticeBulletin) => {
						const newBulletin = _.cloneDeep(bulletin);
						const id = _.get(newBulletin, 'fieldNoticeId');
						newBulletin.bulletinTitle = _.trim(
							_.replace(newBulletin.bulletinTitle, /FN[0-9]{1,5}[ \t]+-/, ''));

						return {
							...obj,
							[id]: _.omit(newBulletin, ['fieldNoticeId']),
						};
					}, { });

				fieldTab.data = _.map(fieldTab.data, notice => {
					const id = _.get(notice, 'fieldNoticeId');

					return { ...notice, ...bulletins[id] };
				});

				fieldTab.loading = false;
			}),
			catchError(err => {
				fieldTab.loading = false;

				this.logger.error('advisories.component : getFieldNoticeBulletins() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches advisories
	 * @returns an observable for fetching advisories
	 */
	private fetchSecurityAdvisories () {
		const tab = _.find(this.tabs, { key: 'security' });
		tab.loading = true;

		return this.productAlertsService.getTopSecurityAdvisories(tab.params)
			.pipe(
				map((results: SecurityAdvisoryImpactCountResponse) => {
					tab.data = results.data;
					tab.pagination = this.buildPagination(results.Pagination);
					tab.loading = false;
				}),
				catchError(err => {
					this.logger.error('advisories.component : fetchSecurityAdvisories() ' +
						`:: Error : (${err.status}) ${err.message}`);
					tab.loading = false;

					return of({ });
				}),
			);
	}

	/**
	 * Constructs the pagination
	 * @param pagination Pagination object
	 * @returns custom pagination object
	 */
	private buildPagination (pagination: Pagination) {
		const first = (pagination.rows * (pagination.page - 1)) + 1;
		let last = (pagination.rows * pagination.page);
		if (last > pagination.total) {
			last = pagination.total;
		}

		return {
			countStr: `${first}-${last}`,
			page: pagination.page,
			rows: pagination.rows,
			total: pagination.total,
		};
	}

	/**
	 * Builds our advisories subject for cancellable http requests
	 */
	private buildSecurityAdvisoriesSubject () {
		const tab = _.find(this.tabs, { key: 'security' });
		tab.subject.pipe(
			switchMap(() => this.fetchSecurityAdvisories()),
		)
		.subscribe();
	}

	/**
	 * Builds our advisories subject for cancellable http requests
	 */
	private buildFieldNoticesSubject () {
		const tab = _.find(this.tabs, { key: 'field' });
		tab.subject.pipe(
			switchMap(() => this.fetchFieldNotices()),
		)
		.subscribe();
	}

	/**
	 * Load data for the filters and table
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
		.pipe(
			map(() => _.map(this.tabs, tab => tab.subject.next())),
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
	 * Page change handler
	 * @param event the event emitted
	 * @param tab tab to change page on
	 */
	public onPageChanged (event: any, tab) {
		if (event.page + 1 !== tab.params.page) {
			tab.params.page = (event.page + 1);
			tab.subject.next();
		}
	}

	/** Initializer Function */
	public ngOnInit () {
		if (window.Cypress) {
			window.loading = true;
		}
		this.buildTabs();
		this.searchForm = new FormGroup({
			search: this.search,
		});
		this.loadData();
	}

	/**
	 * Cancel all subjects
	 */
	public ngOnDestroy () {
		_.every(this.tabs, tab => _.invoke(tab.subject, 'unsubscribe'));
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
