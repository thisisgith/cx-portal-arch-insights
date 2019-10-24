import {
	Component,
	OnInit,
	ViewChild,
	TemplateRef,
	OnDestroy,
	ElementRef,
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
	RacetrackSolution,
	RacetrackTechnology,
} from '@sdp-api';
import { of, forkJoin, Subject, fromEvent, Subscription } from 'rxjs';
import * as _ from 'lodash-es';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
	map,
	catchError,
	switchMap,
	debounceTime,
	distinctUntilChanged,
	takeUntil,
} from 'rxjs/operators';
import { VisualFilter, AdvisoryType } from '@interfaces';
import { LogService } from '@cisco-ngx/cui-services';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsPanelStackService, RacetrackInfoService } from '@services';
import { HttpResponse } from '@angular/common/http';

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
	searchForm?: FormGroup;
	searchInput?: ElementRef;
	searchTemplate?: TemplateRef<{ }>;
	searchSubscribe?: Subscription;
	selectedSubfilters?: SelectedSubfilter[];
	contentContainerHeight?: string;
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
	public searchOptions = {
		debounce: 600,
		max: 100,
		min: 3,
		pattern: /^[a-zA-Z0-9\s\-\/\(\).]*$/,
	};
	public activeIndex = 0;
	private destroy$ = new Subject();
	public tabs: Tab[] = [];
	private routeParam: string;
	private customerId: string;
	public fullscreen = false;
	public selectedAdvisory: {
		advisory: CriticalBug | FieldNoticeAdvisory | SecurityAdvisoryInfo;
		type: AdvisoryType;
		id: string;
	};
	public contentContainerHeight: string;
	public activeTab: number;
	private selectedSolutionName: string;
	private selectedTechnologyName: string;

	@ViewChild('impactTemplate', { static: true }) private impactTemplate: TemplateRef<{ }>;
	@ViewChild('impactedCountTemplate', { static: true })
		private impactedCountTemplate: TemplateRef<{ }>;
	@ViewChild('impactedAssetsTemplate', { static: true })
		private impactedAssetsTemplate: TemplateRef<{ }>;
	@ViewChild('potentiallyImpactedAssetsTemplate', { static: true })
		private potentiallyImpactedAssetsTemplate: TemplateRef<{ }>;
	@ViewChild('content', { static: true }) private contentTemplate: TemplateRef<{ }>;
	@ViewChild('totalFilter', { static: true }) private totalFilterTemplate: TemplateRef<{ }>;
	@ViewChild('pieChartFilter', { static: true }) private pieChartFilterTemplate: TemplateRef<{ }>;
	@ViewChild('titleTemplate', { static: true }) private titleTemplate: TemplateRef<{ }>;
	@ViewChild('versionTemplate', { static: true }) private versionTemplate: TemplateRef<{ }>;
	@ViewChild('stateTemplate', { static: true }) private stateTemplate: TemplateRef<{ }>;
	@ViewChild('lastUpdatedTemplate', { static: true })
		private lastUpdatedTemplate: TemplateRef<{ }>;
	@ViewChild('columnChartFilter', { static: true })
		private columnChartFilterTemplate: TemplateRef<{ }>;

	@ViewChild('securitySearchTemplate', { static: true })
		private securitySearchTemplate: TemplateRef<{ }>;
	@ViewChild('fieldSearchTemplate', { static: true })
		private fieldSearchTemplate: TemplateRef<{ }>;
	@ViewChild('bugsSearchTemplate', { static: true })
		private bugsSearchTemplate: TemplateRef<{ }>;
	@ViewChild('securitySearchInput', { static: false }) set securityContent (content: ElementRef) {
		if (content) {
			const tab = _.find(this.tabs, { key: 'security' });
			tab.searchInput = content;
			this.searchSubscription(tab);
		}
	}
	@ViewChild('fieldSearchInput', { static: false }) set fieldContent (content: ElementRef) {
		if (content) {
			const tab = _.find(this.tabs, { key: 'field' });
			tab.searchInput = content;
			this.searchSubscription(tab);
		}
	}
	@ViewChild('bugsSearchInput', { static: false }) set bugsContent (content: ElementRef) {
		if (content) {
			const tab = _.find(this.tabs, { key: 'bug' });
			tab.searchInput = content;
			this.searchSubscription(tab);
		}
	}
	@ViewChild('contentContainer', { static: false }) private contentContainer: ElementRef;

	constructor (
		private diagnosticsService: DiagnosticsService,
		private logger: LogService,
		private productAlertsService: ProductAlertsService,
		public route: ActivatedRoute,
		public router: Router,
		private detailsPanelStackService: DetailsPanelStackService,
		private racetrackInfoService: RacetrackInfoService,
	) {
		this.routeParam = _.get(this.route, ['snapshot', 'params', 'advisory'], 'security');

		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}

	/**
	 * Will adjust the browsers query params to preserve the current state
	 */
	private adjustQueryParams () {
		const queryParams =
			_.omit(_.cloneDeep(this.selectedTab.params),
				['customerId', 'rows', 'solution', 'useCase']);

		this.selectedTab.filtered = !_.isEmpty(_.omit(queryParams, ['sort', 'page']));

		this.router.navigate([`/solution/advisories/${this.routeParam}`], {
			queryParams,
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
						key: 'severity',
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
						title: I18n.get('_Updated_'),
					},
				],
				key: 'security',
				label: I18n.get('_SecurityAdvisories_'),
				loading: true,
				options: new CuiTableOptions({
					bordered: true,
					columns: [
						{
							key: 'severity',
							name: I18n.get('_Impact_'),
							sortable: true,
							sortDirection: 'asc',
							sorting: true,
							template: this.impactTemplate,
							width: '100px',
						},
						{
							key: 'title',
							name: I18n.get('_Title_'),
							sortable: true,
							template: this.titleTemplate,
						},
						{
							key: 'version',
							name: I18n.get('_Version_'),
							sortable: true,
							template: this.versionTemplate,
						},
						{
							key: 'lastUpdated',
							name: I18n.get('_Updated_'),
							sortable: true,
							template: this.lastUpdatedTemplate,
						},
						{
							key: 'assetsImpacted',
							name: `${I18n.get('_AffectedSystems_')}
								(${I18n.get('_PotentiallyAffected_')})`,
							sortable: true,
							template: this.impactedCountTemplate,
						},
					],
					dynamicData: true,
					hover: true,
					singleSelect: true,
					striped: false,
					wrapText: true,
				}),
				params: {
					customerId: this.customerId,
					page: 1,
					rows: 10,
					sort: ['severity:ASC'],
				},
				route: 'security',
				searchTemplate: this.securitySearchTemplate,
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
						title: I18n.get('_Updated_'),
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
							sortDirection: 'asc',
							sorting: true,
							value: 'id',
							width: '100px',
						},
						{
							key: 'title',
							name: I18n.get('_Title_'),
							sortable: true,
							value: 'title',
						},
						{
							key: 'version',
							name: I18n.get('_Version_'),
							sortable: true,
							template: this.versionTemplate,
						},
						{
							key: 'lastUpdated',
							name: I18n.get('_Updated_'),
							sortable: true,
							template: this.lastUpdatedTemplate,
						},
						{
							key: 'assetsImpacted',
							name: I18n.get('_AffectedHardware_'),
							sortable: true,
							template: this.impactedAssetsTemplate,
						},
						{
							key: 'assetsPotentiallyImpacted',
							name: I18n.get('_PotentiallyAffectedHardware_'),
							sortable: true,
							template: this.potentiallyImpactedAssetsTemplate,
						},
					],
					dynamicData: true,
					hover: true,
					multipleSort: true,
					singleSelect: true,
					striped: false,
					tableSort: false,
					wrapText: true,
				}),
				params: {
					customerId: this.customerId,
					page: 1,
					rows: 10,
					sort: ['id:ASC'],
				},
				route: 'field-notices',
				searchTemplate: this.fieldSearchTemplate,
				selected: this.routeParam === 'field-notices',
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
				label: I18n.get('_PriorityBugs_'),
				loading: true,
				options: new CuiTableOptions({
					bordered: true,
					columns: [
						{
							key: 'id',
							name: I18n.get('_BugID_'),
							render: item => item.id || I18n.get('_NA_'),
							sortable: true,
							sorting: false,
							value: 'id',
							width: '100px',
						},
						{
							key: 'severity',
							name: I18n.get('_Severity_'),
							render: item =>
								item.severity ? _.capitalize(item.severity) : I18n.get('_NA_'),
							sortable: true,
							sortDirection: 'asc',
							sorting: true,
							value: 'severity',
						},
						{
							key: 'title',
							name: I18n.get('_Title_'),
							sortable: true,
							value: 'title',
						},
						{
							key: 'state',
							name: I18n.get('_State_'),
							sortable: true,
							template: this.stateTemplate,
						},
						{
							key: 'lastUpdated',
							name: I18n.get('_Updated_'),
							sortable: true,
							template: this.lastUpdatedTemplate,
						},
						{
							key: 'assetsImpacted',
							name: I18n.get('_AffectedSystems_'),
							render: item => item.assetsImpacted || 0,
							sortable: true,
							value: 'assetsImpacted',
						},
					],
					dynamicData: true,
					hover: true,
					multipleSort: true,
					singleSelect: true,
					striped: false,
					tableSort: false,
					wrapText: true,
				}),
				params: {
					customerId: this.customerId,
					page: 1,
					rows: 10,
					sort: ['severity:ASC'],
				},
				route: 'bugs',
				searchTemplate: this.bugsSearchTemplate,
				selected: this.routeParam === 'bugs',
				selectedSubfilters: [],
				subject: new Subject(),
				template: this.contentTemplate,
			},
		];

		_.each(this.tabs, tab => {
			tab.searchForm = new FormGroup({
				search: new FormControl('',
					[
						Validators.minLength(this.searchOptions.min),
						Validators.maxLength(this.searchOptions.max),
						Validators.pattern(this.searchOptions.pattern),
					]),
			});
		});

		this.activeIndex = _.findIndex(this.tabs, 'selected');

		this.buildSecurityAdvisoriesSubject();
		this.buildFieldNoticesSubject();
		this.buildBugsSubject();
	}

	/**
	 * Handler for performing a search
	 * @param tab tab to perform query for
	 */
	public doSearch (tab: Tab) {
		const query = tab.searchForm.controls.search.value;
		if (tab.searchForm.valid && query) {
			this.logger.debug('advisories.component :: doSearch()' +
				` :: Searching for ${query} in ${tab.key}`);
			_.set(tab, ['params', 'search'], query);
			tab.filtered = true;
			this.adjustQueryParams();
			tab.subject.next();
		} else if (!query && tab.filtered) {
			_.unset(tab, ['params', 'search']);
			this.adjustQueryParams();
			tab.subject.next();
		}
	}

	/**
	 * Builds the search debounce subscription for Security Advisories
	 * @param tab tab to perform search
	 * @returns Search Subscription
	 */
	private searchSubscription (tab) {
		fromEvent(tab.searchInput.nativeElement, 'keyup')
		.pipe(
			map((evt: KeyboardEvent) => (<HTMLInputElement> evt.target).value),
			debounceTime(this.searchOptions.debounce),
			distinctUntilChanged(),
			takeUntil(this.destroy$),
		)
		.subscribe(() => this.doSearch(tab));
	}

	/**
	 * Gets the summary data for the advisories pie chart
	 * @returns the summary data for the advisories pie chart
	 */
	private getSeverityCount () {
		const securityTab = _.find(this.tabs, { key: 'security' });
		const impactFilter = _.find(securityTab.filters, { key: 'severity' });

		return this.productAlertsService.getSecurityAdvisorySeverityCount({
			customerId: this.customerId,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		})
		.pipe(
			map((data: SecurityAdvisorySeverityCountResponse) => {
				impactFilter.seriesData = _.compact(_.map(data, (count, severity) => {
					if (count) {
						return {
							filter: severity,
							label: I18n.get(`_${_.startCase(severity)}_`),
							selected: false,
							value: count,
						};
					}
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
		if (column.sortable) {
			const tab = this.selectedTab;
			tab.params.sort = [`${column.key}:${column.sortDirection.toUpperCase()}`];
			this.adjustQueryParams();
			tab.subject.next();
		}
	}

	/**
	 * Gets the info for the Last Updated bar chart on the advisories tab
	 * @returns the info for the Last Updated bar chart on the advisories tab
	 */
	private getAdvisoriesLastUpdated () {
		const securityTab = _.find(this.tabs, { key: 'security' });
		const lastUpdateFilter =
			_.find(securityTab.filters, { key: 'lastUpdate' });

		return this.productAlertsService.getSecurityAdvisoryLastUpdatedCount({
			customerId: this.customerId,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		})
			.pipe(
				map((data: AdvisoriesByLastUpdatedCount) => {
					const series = [];

					const sub30 = _.get(data, 'gt-0-lt-30-days');
					const sub30Value = _.get(sub30, 'numericValue', 0);

					if (sub30Value) {
						series.push({
							filter: 'gt-0-lt-30-days',
							filterValue: [`${
								_.get(sub30, 'fromTimestampInMillis')},${
									_.get(sub30, 'toTimestampInMillis')}`],
							label: `< 30 ${I18n.get('_Days_')}`,
							selected: false,
							value: sub30Value,
						});
					}

					const sub60 = _.get(data, 'gt-30-lt-60-days');
					const sub60Value = _.get(sub60, 'numericValue', 0);

					if (sub60Value) {
						series.push({
							filter: 'gt-30-lt-60-days',
							filterValue: [`${
								_.get(sub60, 'fromTimestampInMillis')},${
									_.get(sub60, 'toTimestampInMillis')}`],
							label: `30 - 60 ${I18n.get('_Days_')}`,
							selected: false,
							value: sub60Value,
						});
					}

					const sub90 = _.get(data, 'gt-60-lt-90-days');
					const sub90Value = _.get(sub90, 'numericValue', 0);

					if (sub90Value) {
						series.push({
							filter: 'gt-60-lt-90-days',
							filterValue: [`${
								_.get(sub90, 'fromTimestampInMillis')},${
									_.get(sub90, 'toTimestampInMillis')}`],
							label: `61 - 90 ${I18n.get('_Days_')}`,
							selected: false,
							value: sub90Value,
						});
					}

					const furtherOut = _.get(data, 'further-out');
					const furtherOutValue = _.get(furtherOut, 'numericValue', 0);

					if (furtherOutValue) {
						series.push({
							filter: 'further-out',
							filterValue: [`,${
									_.get(furtherOut, 'toTimestampInMillis')}`],
							label: _.toLower(I18n.get('_FurtherOut_')),
							selected: false,
							value: furtherOutValue,
						});
					}

					lastUpdateFilter.seriesData = series;
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

		return this.productAlertsService.getFieldNoticesLastUpdatedCount({
			customerId: this.customerId,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		})
		.pipe(
			map((data: FieldNoticeUpdatedResponse) => {
				const series = [];

				const sub30 = _.get(data, 'gt-0-lt-30-days');
				const sub30Value = _.get(sub30, 'numericValue', 0);

				if (sub30Value) {
					series.push({
						filter: 'gt-0-lt-30-days',
						filterValue: [`${
							_.get(sub30, 'fromTimestampInMillis')},${
								_.get(sub30, 'toTimestampInMillis')}`],
						label: `< 30 ${I18n.get('_Days_')}`,
						selected: false,
						value: sub30Value,
					});
				}

				const sub60 = _.get(data, 'gt-30-lt-60-days');
				const sub60Value = _.get(sub60, 'numericValue', 0);

				if (sub60Value) {
					series.push({
						filter: 'gt-30-lt-60-days',
						filterValue: [`${
							_.get(sub60, 'fromTimestampInMillis')},${
								_.get(sub60, 'toTimestampInMillis')}`],
						label: `30 - 60 ${I18n.get('_Days_')}`,
						selected: false,
						value: sub60Value,
					});
				}

				const sub90 = _.get(data, 'gt-60-lt-90-days');
				const sub90Value = _.get(sub90, 'numericValue', 0);

				if (sub90Value) {
					series.push({
						filter: 'gt-60-lt-90-days',
						filterValue: [`${
							_.get(sub90, 'fromTimestampInMillis')},${
								_.get(sub90, 'toTimestampInMillis')}`],
						label: `61 - 90 ${I18n.get('_Days_')}`,
						selected: false,
						value: sub90Value,
					});
				}

				const furtherOut = _.get(data, 'further-out');
				const furtherOutValue = _.get(furtherOut, 'numericValue', 0);

				if (furtherOutValue) {
					series.push({
						filter: 'further-out',
						filterValue: [`,${
								_.get(furtherOut, 'toTimestampInMillis')}`],
						label: _.toLower(I18n.get('_FurtherOut_')),
						selected: false,
						value: furtherOutValue,
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

		return this.diagnosticsService.getCriticalBugsStateCount({
			customerId: this.customerId,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		})
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

		return forkJoin([
			this.productAlertsService.headAdvisoriesFieldNoticesResponse({
				customerId: this.customerId,
				solution: this.selectedSolutionName,
				useCase: this.selectedTechnologyName,
			})
			.pipe(
				map((response: HttpResponse<null>) => {
					totalFieldNoticesFilter.seriesData = [{
						value: _.toNumber(response.headers.get('X-API-RESULT-COUNT')) || 0,
					}];
					totalFieldNoticesFilter.loading = false;
				}),
				catchError(err => {
					totalFieldNoticesFilter.seriesData = [{ value: 0 }];
					totalFieldNoticesFilter.loading = false;
					this.logger.error('advisories.component : getTotals(): field-notices ' +
					`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			),
			this.productAlertsService.headAdvisoriesSecurityAdvisoriesResponse({
				customerId: this.customerId,
				solution: this.selectedSolutionName,
				useCase: this.selectedTechnologyName,
			})
			.pipe(
				map((response: HttpResponse<null>) => {
					totalAdvisoryFilter.seriesData = [{
						value: _.toNumber(response.headers.get('X-API-RESULT-COUNT')) || 0,
					}];
					totalAdvisoryFilter.loading = false;
				}),
				catchError(err => {
					totalAdvisoryFilter.seriesData = [{ value: 0 }];
					totalAdvisoryFilter.loading = false;
					this.logger.error('advisories.component : getTotals(): security-advisories ' +
					`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			),
			this.diagnosticsService.headCriticalBugsResponse({
				customerId: this.customerId,
				solution: this.selectedSolutionName,
				useCase: this.selectedTechnologyName,
			})
			.pipe(
				map((response: HttpResponse<null>) => {
					totalBugsFilter.seriesData = [{
						value: _.toNumber(response.headers.get('X-API-RESULT-COUNT')) || 0,
					}];
					totalBugsFilter.loading = false;
				}),
				catchError(err => {
					totalBugsFilter.seriesData = [{ value: 0 }];
					totalBugsFilter.loading = false;
					this.logger.error('advisories.component : getTotals(): bugs ' +
					`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			),
		]);
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

		const selectedSubfilters = _.map(_.filter(filter.seriesData, 'selected'), 'filter');

		let val;
		let key;
		if (filter.key !== 'lastUpdate') {
			key = filter.key;
			val = selectedSubfilters;
		} else if (filter.key === 'lastUpdate') {
			val = selectedSubfilters;
			key = 'lastUpdatedDateRange';
		}

		if (filter.selected) {
			_.set(tab, ['params', key], val);
		} else {
			_.unset(tab, ['params', key]);
		}
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
		if (this.activeIndex !== event) {
			this.detailsPanelStackService.reset();
			const selectedTab = this.tabs[event];
			_.each(this.tabs, (tab: Tab) => {
				if (tab !== selectedTab) {
					tab.selected = false;
				}
			});
			this.selectedAdvisory = null;
			this.activeIndex = event;
			selectedTab.selected = true;
			this.routeParam = selectedTab.route;
			this.adjustQueryParams();
		}
	}

	/**
	 * Fetches the field notices
	 * @returns an observable for fetching field notices
	 */
	private fetchFieldNotices () {
		const tab = _.find(this.tabs, { key: 'field' });
		tab.loading = true;
		tab.pagination = null;
		if (_.size(tab.data) && this.contentContainer) {
			tab.contentContainerHeight =
				`${this.contentContainer.nativeElement.offsetHeight}px`;
		}
		tab.data = [];

		const params = _.omit(_.cloneDeep(tab.params), ['lastUpdatedDateRange']);
		params.solution = this.selectedSolutionName;
		params.useCase = this.selectedTechnologyName;

		const lastUpdate = _.get(tab, ['params', 'lastUpdatedDateRange']);
		if (lastUpdate) {
			const rangeValue = _.head(lastUpdate);
			const lastUpdateFilter = _.find(tab.filters, { key: 'lastUpdate' });
			const rangeFilter = _.find(_.get(lastUpdateFilter, 'seriesData', []),
				{ filter: rangeValue });

			if (rangeFilter && rangeFilter.filterValue) {
				_.set(params, 'lastUpdatedDateRange', rangeFilter.filterValue);
			} else {
				_.unset(tab.params, 'lastUpdatedDateRange');
				this.adjustQueryParams();
			}
		}

		return this.productAlertsService.getAdvisoriesFieldNotices(params)
		.pipe(
			map((response: FieldNoticeAdvisoryResponse) => {
				tab.data = _.get(response, 'data', []);
				tab.pagination = this.buildPagination(_.get(response, 'Pagination', { }));
				tab.loading = false;
				_.unset(tab, 'contentContainerHeight');
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
		tab.pagination = null;
		if (_.size(tab.data) && this.contentContainer) {
			tab.contentContainerHeight =
				`${this.contentContainer.nativeElement.offsetHeight}px`;
		}
		tab.data = [];

		const params = _.cloneDeep(tab.params);
		params.solution = this.selectedSolutionName;
		params.useCase = this.selectedTechnologyName;

		return this.diagnosticsService.getCriticalBugs(params)
		.pipe(
			map((response: CriticalBugsResponse) => {
				tab.data = _.get(response, 'data', []);
				tab.pagination = this.buildPagination(_.get(response, 'Pagination', { }));
				tab.loading = false;
				_.unset(tab, 'contentContainerHeight');
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
		tab.pagination = null;
		if (_.size(tab.data) && this.contentContainer) {
			tab.contentContainerHeight =
				`${this.contentContainer.nativeElement.offsetHeight}px`;
		}
		tab.data = [];

		const params = _.omit(_.cloneDeep(tab.params), ['lastUpdatedDateRange']);
		params.solution = this.selectedSolutionName;
		params.useCase = this.selectedTechnologyName;

		if (params.sort) {
			const [field, dir] = _.split(params.sort[0], ':');

			if (field.includes('lastUpdated')) {
				params.sort.push(`publishedOn:${dir}`);
			}
		}

		const lastUpdate = _.get(tab, ['params', 'lastUpdatedDateRange']);
		if (lastUpdate) {
			const rangeValue = _.head(lastUpdate);
			const lastUpdateFilter = _.find(tab.filters, { key: 'lastUpdate' });
			const rangeFilter = _.find(_.get(lastUpdateFilter, 'seriesData', []),
				{ filter: rangeValue });

			if (rangeFilter && rangeFilter.filterValue) {
				_.set(params, 'lastUpdatedDateRange', rangeFilter.filterValue);
			} else {
				_.unset(tab.params, 'lastUpdatedDateRange');
				this.adjustQueryParams();
			}
		}

		return this.productAlertsService.getAdvisoriesSecurityAdvisories(params)
			.pipe(
				map((response: SecurityAdvisoriesResponse) => {
					tab.data = _.get(response, 'data', []);
					_.each(tab.data, d => d.severity = _.startCase(d.severity));
					tab.pagination = this.buildPagination(_.get(response, 'Pagination', { }));
					tab.loading = false;
					_.unset(tab, 'contentContainerHeight');
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
			takeUntil(this.destroy$),
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
			this.detailsPanelStackService.reset(true);
			this.selectedAdvisory = {
				advisory: row,
				id: _.get(row, 'id'),
				type: this.selectedTab.key,
			};
		} else {
			this.selectedAdvisory = null;
			this.detailsPanelStackService.reset();
		}
	}

	/**
	 * Called on 360 details panel close button click
	 */
	public onPanelClose () {
		const row = _.get(this.selectedAdvisory, 'advisory');
		if (row) {
			row.active = false;
		}
		this.selectedAdvisory = null;
	}

	/**
	 * Builds our field notices subject for cancellable http requests
	 */
	private buildFieldNoticesSubject () {
		const tab = _.find(this.tabs, { key: 'field' });
		tab.subject.pipe(
			switchMap(() => this.fetchFieldNotices()),
			takeUntil(this.destroy$),
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
			takeUntil(this.destroy$),
		)
		.subscribe();
	}

	/**
	 * Selects all the sub filters based on a list of parameters
	 * @param tab the tab to iterate over
	 * @param params the array list of params
	 * @param key the key to search for in the filters
	 */
	private selectSubFilters (tab: Tab, params: string[], key: string) {
		const filter = _.find(tab.filters, { key });

		if (filter) {
			_.each(filter.seriesData, d => {
				if (params.indexOf(d.filter) > -1) {
					this.onSubfilterSelect(d.filter, filter, false);
				}
			});
		}
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
			map(() => _.map(this.tabs, (tab: Tab) => {
				if (tab.key === 'security') {
					const sev = _.get(tab, ['params', 'severity']);
					if (sev) {
						this.selectSubFilters(tab, sev, 'severity');
					}

					const lastUpdate = _.get(tab, ['params', 'lastUpdatedDateRange']);
					if (lastUpdate) {
						this.selectSubFilters(tab, lastUpdate, 'lastUpdate');
					}
				}

				if (tab.key === 'field') {
					const lastUpdate = _.get(tab, ['params', 'lastUpdatedDateRange']);
					if (lastUpdate) {
						this.selectSubFilters(tab, lastUpdate, 'lastUpdate');
					}
				}

				if (tab.key === 'bug') {
					const state = _.get(tab, ['params', 'state']);
					if (state) {
						this.selectSubFilters(tab, state, 'state');
					}
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
			this.adjustQueryParams();
			tab.subject.next();
		}
	}

	/** Initializer Function */
	public ngOnInit () {
		if (window.Cypress) {
			window.loading = true;
		}
		this.buildTabs();

		this.route.queryParams.subscribe(params => {
			const tab = this.selectedTab;

			if (params.page) {
				const page = _.toSafeInteger(params.page);
				tab.params.page = (page < 1) ? 1 : page;
			}

			if (params.search &&
				params.search.length >= this.searchOptions.min &&
				params.search.length <= this.searchOptions.max &&
				this.searchOptions.pattern.test(params.search)) {
				tab.params.search = params.search;
				tab.searchForm.controls.search.setValue(params.search);
			}

			if (params.sort) {
				const sort = _.split(params.sort, ':');
				_.each(tab.options.columns, c => {
					if (sort.length === 2 &&
						c.sortable &&
						c.key &&
						c.key.toLowerCase() === sort[0].toLowerCase()) {
						c.sorting = true;
						c.sortDirection = sort[1].toLowerCase();
						tab.params.sort = _.castArray(`${sort[0]}:${sort[1].toUpperCase()}`);
					} else {
						c.sorting = false;
					}
				});
			}

			switch (tab.key) {
				case 'security': {
					if (params.severity) {
						_.set(tab, ['params', 'severity'], _.castArray(params.severity));
					}
					if (params.lastUpdatedDateRange) {
						_.set(tab, ['params', 'lastUpdatedDateRange'],
							_.castArray(params.lastUpdatedDateRange));
					}
					break;
				}
				case 'field': {
					if (params.lastUpdatedDateRange) {
						_.set(tab, ['params', 'lastUpdatedDateRange'],
							_.castArray(params.lastUpdatedDateRange));
					}
					break;
				}
				case 'bug': {
					if (params.state) {
						_.set(tab, ['params', 'state'], _.castArray(params.state));
					}
				}
			}

			tab.filtered = !_.isEmpty(
				_.omit(_.cloneDeep(tab.params), ['customerId', 'rows', 'page', 'sort']));
		});

		this.racetrackInfoService.getCurrentSolution()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((solution: RacetrackSolution) => {
			this.selectedSolutionName = _.get(solution, 'name');
		});

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((technology: RacetrackTechnology) => {
			if (this.selectedTechnologyName !== _.get(technology, 'name')) {
				this.selectedTechnologyName = _.get(technology, 'name');
				this.loadData();
			}
		});
	}

	/**
	 * Cancel all subjects
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Clears all filters for the currently selected tab
	 */
	public clearFilters () {
		const tab = this.selectedTab;
		_.each(tab.filters, (filter: VisualFilter) => {
			filter.selected = (filter.key === 'total') ? true : false;
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});

		tab.params = _.assignIn(
			_.pick(
				_.cloneDeep(tab.params), ['customerId', 'rows', 'sort']),
				{ page: 1 });

		tab.searchForm.controls.search.setValue('');
		tab.selectedSubfilters = [];
		tab.filtered = false;
		this.adjustQueryParams();
		tab.subject.next();
	}
}
