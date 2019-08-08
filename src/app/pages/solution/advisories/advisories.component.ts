import {
	Component,
	OnInit,
	ViewChild,
	TemplateRef,
	OnDestroy,
} from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	CriticalBug,
	CriticalBugsCount,
	CriticalBugsResponse,
	DiagnosticsService,
	FieldNoticeAdvisory,
	FieldNoticeAdvisoryResponse,
	FieldNoticeUpdatedResponse,
	ProductAlertsPagination,
	DiagnosticsPagination,
	ProductAlertsService,
	SecurityAdvisorySeverityCountResponse,
	AdvisoriesByLastUpdatedCount,
	SecurityAdvisoriesResponse,
	SecurityAdvisoryInfo,
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
} from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { VisualFilter, AdvisoryType } from '@interfaces';
import { LogService } from '@cisco-ngx/cui-services';
import { ActivatedRoute, Router } from '@angular/router';

/** Interface for a tab */
interface Tab {
	data?:
		SecurityAdvisoryInfo[] |
		FieldNoticeAdvisory[] |
		CriticalBug[];
	disabled?: boolean;
	key: string;
	label: string;
	loading: boolean;
	template: TemplateRef<{ }>;
	selected?: boolean;
	filtered?: boolean;
	filters?: VisualFilter[];
	options?: CuiTableOptions;
	pagination?: ProductAlertsPagination | DiagnosticsPagination;
	params?:
		ProductAlertsService.GetAdvisoriesSecurityAdvisoriesParams |
		DiagnosticsService.GetCriticalBugsParams |
		ProductAlertsService.GetAdvisoriesFieldNoticesParams;
	route: string;
	subject?: Subject<{ }>;
	selectedSubfilters?: SelectedSubfilter[];
}

/** Interface for selected subfilters */
interface SelectedSubfilter {
	subfilter: VisualFilter['seriesData'];
	filter: string;
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
	public activeIndex = 0;

	public tabs: Tab[] = [];
	private routeParam: string;
	private customerId: string;

	public fullscreen = false;
	public selectedAdvisory: {
		advisory: CriticalBug | FieldNoticeAdvisory | SecurityAdvisoryInfo;
		type: AdvisoryType;
		id: string;
	};
	public activeTab: number;
	@ViewChild('impactTemplate', { static: true }) private impactTemplate: TemplateRef<{ }>;
	@ViewChild('impactedCountTemplate', { static: true })
		private impactedCountTemplate: TemplateRef<{ }>;
	@ViewChild('content', { static: true }) private contentTemplate: TemplateRef<{ }>;
	@ViewChild('totalFilter', { static: true }) private totalFilterTemplate: TemplateRef<{ }>;
	@ViewChild('pieChartFilter', { static: true }) private pieChartFilterTemplate: TemplateRef<{ }>;
	@ViewChild('columnChartFilter', { static: true })
		private columnChartFilterTemplate: TemplateRef<{ }>;

	constructor (
		private diagnosticsService: DiagnosticsService,
		private logger: LogService,
		private productAlertsService: ProductAlertsService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.route.queryParamMap.subscribe(params => {
			this.routeParam = params.get('tab') || 'security';
		});

		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}

	/**
	 * Will adjust the browsers query params to preserve the current state
	 */
	private adjustQueryParams () {
		const queryParams =
			_.omit(_.cloneDeep(this.selectedTab.params), ['customerId', 'rows', 'page']);
		queryParams.tab = this.selectedTab.key;
		this.router.navigate([], {
			queryParams,
			relativeTo: this.route,
		});
	}

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
						template: this.columnChartFilterTemplate,
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
							sortDirection: null,
							sorting: false,
							template: this.impactTemplate,
						},
						{
							key: 'title',
							name: I18n.get('_Title_'),
							sortable: false,
							value: 'title',
						},
						{
							name: `${I18n.get('_ImpactedAsset_')}
								(${I18n.get('_PotentiallyImpacted_')})`,
							sortable: false,
							template: this.impactedCountTemplate,
						},
						{
							key: 'lastUpdated',
							name: I18n.get('_LastUpdated_'),
							render: item => item.lastUpdated ?
								datePipe.transform(
									new Date(item.lastUpdated), 'yyyy MMM dd') :
									I18n.get('_Never_'),
							sortable: false,
							value: 'lastUpdated',
						},
						{
							key: 'version',
							name: I18n.get('_Version_'),
							sortable: false,
							value: 'version',
						},
					],
					dynamicData: true,
					padding: 'loose',
					singleSelect: true,
					striped: false,
					wrapText: true,
				}),
				params: {
					customerId: this.customerId,
					page: 1,
					rows: 10,
				},
				route: 'security',
				selected: this.routeParam === 'security',
				selectedSubfilters: [],
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
						template: this.columnChartFilterTemplate,
						title: I18n.get('_LastUpdated_'),
					},
				],
				key: 'field',
				label: I18n.get('_FieldNotices_'),
				loading: true,
				options: new CuiTableOptions({
					bordered: true,
					columns: [
						{
							key: 'id',
							name: I18n.get('_ID_'),
							sortable: true,
							sortDirection: null,
							sorting: false,
							value: 'id',
						},
						{
							key: 'title',
							name: I18n.get('_Title_'),
							sortable: false,
							value: 'title',
						},
						{
							key: 'assetsImpacted',
							name: I18n.get('_VulnerableAssets_'),
							sortable: false,
							value: 'assetsImpacted',
						},
						{
							key: 'assetsPotentiallyImpacted',
							name: I18n.get('_PotentiallyVulnerableAssets_'),
							sortable: false,
							value: 'assetsPotentiallyImpacted',
						},
						{
							key: 'lastUpdated',
							name: I18n.get('_LastUpdated_'),
							render: item => item.lastUpdated ?
								datePipe.transform(
									new Date(item.lastUpdated), 'yyyy MMM dd') :
								I18n.get('_Never_'),
							sortable: false,
							value: 'lastUpdated',
						},
						{
							key: 'version',
							name: I18n.get('_Version_'),
							sortable: false,
							value: 'version',
						},
					],
					dynamicData: true,
					padding: 'loose',
					singleSelect: true,
					striped: false,
					wrapText: true,
				}),
				params: {
					customerId: this.customerId,
					page: 1,
					rows: 10,
				},
				route: 'field-notices',
				selected: this.routeParam === 'field',
				selectedSubfilters: [],
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
						key: 'state',
						loading: true,
						selected: false,
						seriesData: [],
						template: this.pieChartFilterTemplate,
						title: I18n.get('_State_'),
					},
				],
				key: 'bug',
				label: I18n.get('_CriticalBugs_'),
				loading: true,
				options: new CuiTableOptions({
					bordered: true,
					columns: [
						{
							key: 'id',
							name: I18n.get('_ID_'),
							sortable: true,
							sortDirection: null,
							sorting: false,
							value: 'id',
						},
						{
							key: 'title',
							name: I18n.get('_Title_'),
							sortable: false,
							value: 'title',
						},
						{
							key: 'assetsImpacted',
							name: I18n.get('_ImpactedAssets_'),
							sortable: false,
							value: 'assetsImpacted',
						},
						{
							key: 'state',
							name: I18n.get('_State_'),
							render: item =>
								item.state ? _.capitalize(item.state) : I18n.get('_NA_'),
							sortable: false,
						},
						{
							key: 'lastUpdated',
							name: I18n.get('_LastUpdated_'),
							render: item => item.lastUpdated ?
								datePipe.transform(
									new Date(item.lastUpdated), 'yyyy MMM dd') :
								I18n.get('_Never_'),
							sortable: false,
						},
					],
					dynamicData: true,
					padding: 'loose',
					singleSelect: true,
					striped: false,
					wrapText: true,
				}),
				params: {
					customerId: this.customerId,
					page: 1,
					rows: 10,
				},
				route: 'bugs',
				selected: this.routeParam === 'bug',
				selectedSubfilters: [],
				subject: new Subject(),
				template: this.contentTemplate,
			},
		];

		this.activeIndex = _.findIndex(this.tabs, 'selected');

		this.buildSecurityAdvisoriesSubject();
		this.buildFieldNoticesSubject();
		this.buildBugsSubject();
		this.loadData();
	}

	/**
	 * Gets the summary data for the advisories pie chart
	 * @returns the summary data for the advisories pie chart
	 */
	private getSeverityCount () {
		const securityTab = _.find(this.tabs, { key: 'security' });
		const impactFilter = _.find(securityTab.filters, { key: 'impact' });

		return this.productAlertsService.getSecurityAdvisorySeverityCount(this.customerId)
		.pipe(
			map((data: SecurityAdvisorySeverityCountResponse) => {
				impactFilter.seriesData = _.map(data, (count, severity) => ({
					filter: severity,
					label: I18n.get(`_${_.startCase(severity)}_`),
					selected: false,
					value: count,
				}));

				impactFilter.loading = false;
			}),
			catchError(err => {
				impactFilter.loading = false;
				this.logger.error('advisories.component : getSeverityCount() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Sets the params for sorting
	 * @param column column to set sorting
	 */
	public onColumnSort (column) {
		const tab = this.selectedTab;
		_.set(tab, ['params', 'sort'], [column.sortDirection]);
		tab.subject.next();
	}

	/**
	 * Gets the info for the Last Updated bar chart on the advisories tab
	 * @returns the info for the Last Updated bar chart on the advisories tab
	 */
	private getAdvisoriesLastUpdated () {
		const securityTab = _.find(this.tabs, { key: 'security' });
		const lastUpdateFilter =
			_.find(securityTab.filters, { key: 'lastUpdate' });

		return this.productAlertsService.getSecurityAdvisoryLastUpdatedCount(this.customerId)
			.pipe(
				map((data: AdvisoriesByLastUpdatedCount) => {
					lastUpdateFilter.seriesData = [
						{
							filter: 'gt-0-lt-30-days',
							label: '< 30d',
							selected: false,
							value: _.get(data, 'gt-0-lt-30-days'),
						},
						{
							filter: 'gt-30-lt-60-days',
							label: '30 - 60d',
							selected: false,
							value: _.get(data, 'gt-30-lt-60-days'),
						},
						{
							filter: 'gt-60-lt-90-days',
							label: '60 - 90d',
							selected: false,
							value: _.get(data, 'gt-60-lt-90-days'),
						},
						{
							filter: 'gt-90-days',
							label: _.lowerCase(I18n.get('_FurtherOut_')),
							selected: false,
							value: _.get(data, 'further-out'),
						},
					];
					lastUpdateFilter.loading = false;
				}),
				catchError(err => {
					lastUpdateFilter.loading = false;
					this.logger.error('advisories.component : getAdvisoriesLastUpdated() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);
	}

	/**
	 * Gets the info for the Last Updated bar chart on the field notices tab
	 * @returns the info for the Last Updated bar chart on the field notices tab
	 */
	private getFieldNoticesLastUpdated () {
		const fieldNoticesTab = _.find(this.tabs, { key: 'field' });
		const lastUpdateFilter =
			_.find(fieldNoticesTab.filters, { key: 'lastUpdate' });

		return this.productAlertsService.getFieldNoticesLastUpdatedCount(this.customerId)
		.pipe(
			map((data: FieldNoticeUpdatedResponse) => {
				const series = [];

				const sub30 = _.get(data, 'gt-0-lt-30-days', 0);

				if (sub30 && sub30 > 0) {
					series.push({
						filter: 'gt-0-lt-30-days',
						label: `< 30 ${I18n.get('_Days_')}`,
						selected: false,
						value: sub30,
					});
				}

				const sub60 = _.get(data, 'gt-30-lt-60-days', 0);

				if (sub60 && sub60 > 0) {
					series.push({
						filter: 'gt-30-lt-60-days',
						label: `30 - 60 ${I18n.get('_Days_')}`,
						selected: false,
						value: sub60,
					});
				}

				const sub90 = _.get(data, 'gt-60-lt-90-days', 0);

				if (sub90 && sub90 > 0) {
					series.push({
						filter: 'gt-60-lt-90-days',
						label: `61 - 90 ${I18n.get('_Days_')}`,
						selected: false,
						value: sub90,
					});
				}

				const furtherOut = _.get(data, 'further-out', 0);

				if (furtherOut && furtherOut > 0) {
					series.push({
						filter: 'further-out',
						label: _.toLower(I18n.get('_FurtherOut_')),
						selected: false,
						value: furtherOut,
					});
				}

				lastUpdateFilter.seriesData = series;
				lastUpdateFilter.loading = false;
			}),
			catchError(err => {
				lastUpdateFilter.loading = false;
				this.logger.error('advisories.component : getFieldNoticesLastUpdated() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Gets the info for the Bug States pie chart on the critical bugs tab
	 * @returns the info for the Bug States pie chart on the critical bugs tab
	 */
	private getBugStates () {
		const bugsTab = _.find(this.tabs, { key: 'bug' });
		const bugStateFilter = _.find(bugsTab.filters, { key: 'state' });

		return this.diagnosticsService.getCriticalBugsStateCount(this.customerId)
		.pipe(
			map((data: CriticalBugsCount) => {
				const series = [];

				const newCount = _.get(data, 'new', 0);

				if (newCount > 0) {
					series.push({
						filter: 'new',
						label: I18n.get('_New_'),
						selected: false,
						value: newCount,
					});
				}

				const resolved = _.get(data, 'resolved', 0);

				if (resolved > 0) {
					series.push({
						filter: 'resolved',
						label: I18n.get('_Resolved_'),
						selected: false,
						value: resolved,
					});
				}

				const verified = _.get(data, 'verified', 0);

				if (verified > 0) {
					series.push({
						filter: 'verified',
						label: I18n.get('_Verified_'),
						selected: false,
						value: verified,
					});
				}

				const duplicate = _.get(data, 'duplicate', 0);

				if (duplicate > 0) {
					series.push({
						filter: 'duplicate',
						label: I18n.get('_Duplicate_'),
						selected: false,
						value: duplicate,
					});
				}

				const closed = _.get(data, 'closed', 0);

				if (closed > 0) {
					series.push({
						filter: 'closed',
						label: I18n.get('_Closed_'),
						selected: false,
						value: closed,
					});
				}

				bugStateFilter.seriesData = series;
				bugStateFilter.loading = false;
			}),
			catchError(err => {
				bugStateFilter.loading = false;
				this.logger.error('advisories.component : getBugStates() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the advisory counts for the visual filter
	 * @returns the advisory counts
	 */
	private getTotals () {
		const securityTab = _.find(this.tabs, { key: 'security' });
		const fieldNoticesTab = _.find(this.tabs, { key: 'field' });
		const bugsTab = _.find(this.tabs, { key: 'bug' });

		const totalAdvisoryFilter = _.find(securityTab.filters, { key: 'total' });
		const totalFieldNoticesFilter = _.find(fieldNoticesTab.filters, { key: 'total' });
		const totalBugsFilter = _.find(bugsTab.filters, { key: 'total' });

		return this.productAlertsService.getVulnerabilityCounts({ customerId: this.customerId })
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
	public getAllSelectedSubFilters () {
		const tab = this.selectedTab;

		return _.reduce(tab.filters, (memo, filter) => {
			if (filter.seriesData) {
				const selected = _.map(_.filter(filter.seriesData, 'selected'),
				f => ({ filter, subfilter: f }));

				return _.concat(memo, selected);
			}

			return memo;
		}, []);
	}

	/**
	 * Adds a subfilter to the given filer
	 * @param subfilter the subfilter selected
	 * @param filter the filter we selected the subfilter on
	 * @param reload if we're reloading the call
	 */
	public onSubfilterSelect (subfilter: string, filter: VisualFilter, reload: boolean = true) {
		const tab = this.selectedTab;
		const sub = _.find(filter.seriesData, { filter: subfilter });

		if (sub) {
			const selected = !sub.selected;
			_.each(filter.seriesData, (s: { selected: boolean }) => _.set(s, 'selected', false));
			sub.selected = selected;
		}

		filter.selected = _.some(filter.seriesData, 'selected');

		tab.selectedSubfilters = this.getAllSelectedSubFilters();

		tab.params[filter.key] = _.map(_.filter(filter.seriesData, 'selected'), 'filter');
		tab.params.page = 1;

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

		if (reload) {
			this.adjustQueryParams();
			tab.subject.next();
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

		this.activeIndex = event;
		this.tabs[event].selected = true;
		this.router.navigate([`/solution/advisories/${this.tabs[event].route}`]);
		this.adjustQueryParams();
	}

	/**
	 * Fetches the field notices
	 * @returns an observable for fetching field notices
	 */
	private fetchFieldNotices () {
		const tab = _.find(this.tabs, { key: 'field' });
		tab.params.page = tab.params.page;
		tab.loading = true;
		tab.data = [];

		return this.productAlertsService.getAdvisoriesFieldNotices(tab.params)
		.pipe(
			map((response: FieldNoticeAdvisoryResponse) => {
				tab.data = _.get(response, 'data', []);
				tab.pagination = this.buildPagination(_.get(response, 'Pagination', { }));
				tab.loading = false;
			}),
			catchError(err => {
				tab.pagination = null;
				tab.loading = false;
				this.logger.error('advisories.component : fetchFieldNotices() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the bugs
	 * @returns an observable for fetching bugs
	 */
	private fetchBugs () {
		const tab = _.find(this.tabs, { key: 'bug' });
		tab.loading = true;
		tab.data = [];

		return this.diagnosticsService.getCriticalBugs(tab.params)
		.pipe(
			map((response: CriticalBugsResponse) => {
				tab.data = _.get(response, 'data', []);
				tab.pagination = this.buildPagination(_.get(response, 'Pagination', { }));

				tab.loading = false;
			}),
			catchError(err => {
				tab.pagination = null;
				tab.loading = false;
				this.logger.error('advisories.component : fetchBugs() ' +
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
		tab.data = [];

		return this.productAlertsService.getAdvisoriesSecurityAdvisories(tab.params)
			.pipe(
				map((response: SecurityAdvisoriesResponse) => {
					tab.data = _.get(response, 'data', []);
					tab.pagination = this.buildPagination(_.get(response, 'Pagination', { }));

					tab.loading = false;
				}),
				catchError(err => {
					tab.pagination = null;
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
	private buildPagination (
		pagination: ProductAlertsPagination | DiagnosticsPagination) {
		const rows = _.get(pagination, 'rows', 10);
		const page = _.get(pagination, 'page', 1);
		const total = _.get(pagination, 'total', 0);
		const first = (rows * (page - 1)) + 1;
		let last = (rows * page);
		if (last > total) {
			last = total;
		}

		return {
			page,
			rows,
			total,
			countStr: `${first}-${last}`,
		};
	}

	/**
	 * Builds our security subject for cancellable http requests
	 */
	private buildSecurityAdvisoriesSubject () {
		const tab = _.find(this.tabs, { key: 'security' });
		tab.subject.pipe(
			switchMap(() => this.fetchSecurityAdvisories()),
		)
		.subscribe();
	}

	/**
	 * Row selection handler
	 * @param row the clicked row
	 */
	public onRowSelect (row:
			SecurityAdvisoryInfo |
			FieldNoticeAdvisory |
			CriticalBug) {
		if (_.get(row, 'active', false)) {
			this.selectedAdvisory = {
				advisory: row,
				id: _.get(row, 'id'),
				type: this.selectedTab.key,
			};
		} else {
			this.selectedAdvisory = null;
		}
	}

	/**
	 * Called on 360 details panel close button click
	 */
	public onPanelClose () {
		this.selectedAdvisory = null;
	}

	/**
	 * Builds our field notices subject for cancellable http requests
	 */
	private buildFieldNoticesSubject () {
		const tab = _.find(this.tabs, { key: 'field' });
		tab.subject.pipe(
			switchMap(() => this.fetchFieldNotices()),
		)
		.subscribe();
	}

	/**
	 * Builds our bugs subject for cancellable http request
	 */
	private buildBugsSubject () {
		const tab = _.find(this.tabs, { key: 'bug' });
		tab.subject.pipe(
			switchMap(() => this.fetchBugs()),
		)
		.subscribe();
	}

	/**
	 * Load data for the filters and table
	 */
	private loadData () {
		this.status.isLoading = true;
		forkJoin(
			this.getSeverityCount(),
			this.getAdvisoriesLastUpdated(),
			this.getFieldNoticesLastUpdated(),
			this.getBugStates(),
			this.getTotals(),
		)
		.pipe(
			map(() => _.map(this.tabs, tab => {

				if (this.selectedTab.key === 'security') {
					if (this.selectedTab.impact) {
						this.onSubfilterSelect(this.selectedTab.impact,
												_.find(this.selectedTab.filters,
												{ key: 'impact' }));
					}
					if (this.selectedTab.lastUpdate) {
						this.onSubfilterSelect(this.selectedTab.lastUpdate,
												_.find(this.selectedTab.filters,
												{ key: 'lastUpdate' }));
					}
				}

				if (this.selectedTab.key === 'field' && this.selectedTab.lastUpdate) {
					this.onSubfilterSelect(this.selectedTab.lastUpdate,
											_.find(this.selectedTab.filters,
											{ key: 'lastUpdate' }));
				}

				if (this.selectedTab.key === 'bug' && this.selectedTab.state) {
					this.onSubfilterSelect(this.selectedTab.state,
											_.find(this.selectedTab.filters,
											{ key: 'state' }));
				}

				tab.subject.next();
			})),
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
	public onPageChanged (event: any, tab: Tab) {
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

		this.route.queryParams.subscribe(params => {
			if (params.tab) {
				const tab = _.find(this.tabs, { key: params.tab });
				if (tab) {
					tab.selected = true;
				}
			}

			switch (this.selectedTab.key) {
				case 'security': {
					if (params.impact) {
						this.selectedTab.impact = params.impact;
					}
					if (params.lastUpdate) {
						this.selectedTab.lastUpdate = params.lastUpdate;
					}
					break;
				}
				case 'field': {
					if (params.lastUpdate) {
						this.selectedTab.lastUpdate = params.lastUpdate;
					}
					break;
				}
				case 'bug': {
					if (params.state) {
						this.selectedTab.state = params.state;
					}
				}
			}
		});
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
		const tab = this.selectedTab;
		_.each(tab.filters, (filter: VisualFilter) => {
			filter.selected = false;
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});

		tab.params = {
			customerId: this.customerId,
			page: 1,
			rows: 10,
		};
		tab.selectedSubfilters = [];
		tab.filtered = false;
		this.adjustQueryParams();
		tab.subject.next();
	}
}
