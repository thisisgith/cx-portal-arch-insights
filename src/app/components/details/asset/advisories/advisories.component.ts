import {
	Component,
	TemplateRef,
	OnInit,
	ViewChild,
	Input,
	SimpleChanges,
	OnChanges,
	OnDestroy,
	EventEmitter,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

import * as _ from 'lodash-es';
import {
	CriticalBug,
	CriticalBugsResponse,
	DiagnosticsService,
	FieldNoticeAdvisory,
	ProductAlertsPagination,
	DiagnosticsPagination,
	ProductAlertsService,
	SecurityAdvisoryInfo,
	SecurityAdvisoriesResponse,
	FieldNoticeAdvisoryResponse,
	NetworkElement,
	RacetrackSolution,
	RacetrackTechnology,
} from '@sdp-api';
import { CuiTableOptions, CuiTableColumnOption } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { of, Subject } from 'rxjs';
import {
	map,
	catchError,
	switchMap,
	takeUntil,
} from 'rxjs/operators';
import { AdvisoryType, ModSystemAsset, ModHardwareAsset } from '@interfaces';
import { RacetrackInfoService } from '@services';

/** Interface representing an advisory tab */
interface Tab {
	data?: SecurityAdvisoryInfo[] | FieldNoticeAdvisory[] | CriticalBug[];
	pagination?: ProductAlertsPagination | DiagnosticsPagination;
	params?: ProductAlertsService.GetAdvisoriesSecurityAdvisoriesParams |
	ProductAlertsService.GetAdvisoriesFieldNoticesParams |
	DiagnosticsService.GetCriticalBugsParams;
	loading: boolean;
	moreLoading: boolean;
	disabled?: boolean;
	key: string;
	selected: boolean;
	subject?: Subject<{ }>;
	table?: CuiTableOptions;
	title: string;
}

/**
 * Details Advisories Component
 */
@Component({
	selector: 'asset-details-advisories',
	styleUrls: ['./advisories.component.scss'],
	templateUrl: './advisories.component.html',
})
export class AssetDetailsAdvisoriesComponent
	implements OnInit, OnChanges, OnDestroy {

	@Input('systemAsset') public systemAsset: ModSystemAsset;
	@Input('hardwareAsset') public hardwareAsset: ModHardwareAsset;
	@Input('element') public element: NetworkElement;
	@Input('customerId') public customerId: string;
	@Input('reload') public reload: EventEmitter<boolean> = new EventEmitter();
	@ViewChild('impact', { static: true }) private impactTemplate: TemplateRef<{ }>;
	@ViewChild('fieldNoticeID', { static: true }) private fieldNoticeIDTemplate: TemplateRef<{ }>;
	@ViewChild('bugID', { static: true }) private bugIDTemplate: TemplateRef<{ }>;
	@ViewChild('lastUpdated', { static: true }) private lastUpdatedTemplate: TemplateRef<{ }>;
	@ViewChild('cdetsHealine', { static: true }) private cdetsHeadline: TemplateRef<{ }>;
	@ViewChild('cdetsStatusTemplate', { static: true }) private cdetsStatusTemplate: TemplateRef<{ }>;
	@ViewChild('severityTemplate', { static: true }) private severityTemplate: TemplateRef<{ }>;

	public tabs: Tab[];
	public isLoading = true;
	public selectedAdvisory: {
		type: AdvisoryType;
		id: string;
	};
	private destroyed$: Subject<void> = new Subject<void>();
	private selectedSolutionName: string;
	private selectedTechnologyName: string;

	constructor (
		private logger: LogService,
		private diagnosticsService: DiagnosticsService,
		private productAlertsService: ProductAlertsService,
		private racetrackInfoService: RacetrackInfoService,
	) { }

	get selectedTab (): Tab {
		return _.find(this.tabs, 'selected');
	}

	/**
	 * Sets the active tab
	 * @param tab the tab to select
	 */
	public selectTab (tab: Tab) {
		_.each(this.tabs, (t: Tab) => {
			if (t !== tab) {
				t.selected = false;
			}
		});
		tab.selected = true;
	}

	/**
	 * Retrieves the security advisories
	 * @param append appends the values
	 * @returns the data
	 */
	private getSecurityAdvisories (append = false) {
		const tab = _.find(this.tabs, { key: 'security' });
		tab.loading = true;

		const params = _.cloneDeep(tab.params);
		params.solution = this.selectedSolutionName;
		params.useCase = this.selectedTechnologyName;

		if (params.sort) {
			const [field, dir] = _.split(params.sort[0], ':');

			if (field.includes('lastUpdated')) {
				params.sort.push(`publishedOn:${dir}`);
			}
		}

		return this.productAlertsService.getAdvisoriesSecurityAdvisories(params)
		.pipe(
			map((response: SecurityAdvisoriesResponse) => {
				this.setTabData(tab, append, response);
				tab.loading = false;
			}),
			catchError(err => {
				tab.loading = false;
				this.logger.error('asset-details:advisories.component : getSecurityAdvisories() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Retrieves the field notices
	 * @param append appends the values
	 * @returns the data
	 */
	private getFieldNotices (append = false) {
		const tab = _.find(this.tabs, { key: 'field' });
		tab.loading = true;

		const params = _.cloneDeep(tab.params);
		params.solution = this.selectedSolutionName;
		params.useCase = this.selectedTechnologyName;

		return this.productAlertsService.getAdvisoriesFieldNotices(params)
		.pipe(
			map((response: FieldNoticeAdvisoryResponse) => {
				this.setTabData(tab, append, response);
				tab.loading = false;
			}),
			catchError(err => {
				tab.loading = false;
				this.logger.error('asset-details:advisories.component : getFieldNotices() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Retrieves the bugs
	 * @param append appends the values
	 * @returns the data
	 */
	private getBugs (append = false) {
		const tab = _.find(this.tabs, { key: 'bug' });
		tab.loading = true;

		const params = _.cloneDeep(tab.params);
		params.solution = this.selectedSolutionName;
		params.useCase = this.selectedTechnologyName;

		return this.diagnosticsService.getCriticalBugs(params)
		.pipe(
			map((response: CriticalBugsResponse) => {
				_.each(response.data, (bug: CriticalBug) => {
					_.set(bug, 'severity', _.capitalize(_.get(bug, 'severity', '')));
				});
				this.setTabData(tab, append, response);
				tab.loading = false;
			}),
			catchError(err => {
				tab.loading = false;

				this.logger.error('asset-details:advisories.component : getBugs() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Sets the data on the tab
	 * @param tab the tab to use
	 * @param append to append the data
	 * @param response the response to parse
	 */
	private setTabData (tab: Tab,
		append: boolean,
		response: CriticalBugsResponse | FieldNoticeAdvisoryResponse | SecurityAdvisoriesResponse) {
		const data = _.get(response, 'data', []);
		if (!append) {
			_.set(tab, 'data', data);
		} else {
			_.set(tab, 'data',
				_.concat(_.get(tab, 'data', []), data));
		}
		_.set(tab, 'pagination', _.get(response, 'Pagination', { }));
	}

	/**
	 * Initializes our data sets
	 */
	private initializeData () {
		this.isLoading = true;

		_.map(this.tabs, (tab: Tab) => {
			if (_.get(tab, ['params', 'serialNumber']) && tab.key === 'bug') {
				tab.subject.next();
			} else if (_.get(tab, ['params', 'neInstanceId'])) {
				tab.subject.next();
			} else if (_.get(tab, ['params', 'hwInstanceId'])) {
				tab.subject.next();
			} else {
				tab.loading = false;
			}
		});
	}

	/**
	 * Loads more data if necessary
	 */
	public loadMore () {
		const tab = this.selectedTab;
		tab.moreLoading = true;
		if (window.Cypress) {
			window.loading = true;
		}

		_.set(tab.params, 'page', _.get(tab.params, 'page') + 1);

		let obs;

		if (tab.key === 'security') {
			obs = this.getSecurityAdvisories(true);
		}

		if (tab.key === 'field') {
			obs = this.getFieldNotices(true);
		}

		if (tab.key === 'bug') {
			obs = this.getBugs(true);
		}

		obs.subscribe(
			() => {
				tab.moreLoading = false;
				if (window.Cypress) {
					window.loading = false;
				}
			},
		);
	}

	/** Initializes our advisory tabs */
	private initializeTabs () {
		this.tabs = [
			{
				data: [],
				key: 'security',
				loading: true,
				moreLoading: false,
				params: {
					customerId: this.customerId,
					neInstanceId: _.get(this.element, 'neInstanceId') ?
						[this.element.neInstanceId] : null,
					page: 1,
					rows: 10,
					sort: ['severity:ASC'],
				},
				selected: true,
				subject: new Subject(),
				table: new CuiTableOptions({
					bordered: false,
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
							autoId: 'AdvisoryTitle',
							key: 'title',
							name: I18n.get('_Title_'),
							sortable: true,
							value: 'title',
						},
						{
							autoId: 'AdvisoryLastUpdated',
							key: 'lastUpdated',
							name: I18n.get('_LastUpdated_'),
							sortable: true,
							template: this.lastUpdatedTemplate,
							width: '125px',
						},
					],
					hover: true,
					padding: 'compressed',
					singleSelect: true,
					striped: false,
					wrapText: true,
				}),
				title: I18n.get('_SecurityAdvisories_'),
			},
			{
				data: [],
				key: 'field',
				loading: true,
				moreLoading: false,
				params: {
					customerId: this.customerId,
					hwInstanceId: _.get(this.hardwareAsset, 'hwInstanceId') ?
						[this.hardwareAsset.hwInstanceId] : null,
					page: 1,
					rows: 10,
					sort: ['lastUpdated:DESC'],
				},
				selected: false,
				subject: new Subject(),
				table: new CuiTableOptions({
					bordered: false,
					columns: [
						{
							key: 'id',
							name: I18n.get('_ID_'),
							sortable: true,
							template: this.fieldNoticeIDTemplate,
							width: '100px',
						},
						{
							autoId: 'AdvisoryTitle',
							key: 'title',
							name: I18n.get('_Title_'),
							sortable: true,
							value: 'title',
						},
						{
							autoId: 'FieldNoticeLastUpdated',
							key: 'lastUpdated',
							name: I18n.get('_LastUpdated_'),
							sortable: true,
							sortDirection: 'desc',
							sorting: true,
							template: this.lastUpdatedTemplate,
							width: '125px',
						},
					],
					hover: true,
					padding: 'compressed',
					singleSelect: true,
					striped: false,
					wrapText: true,
				}),
				title: I18n.get('_FieldNotices_'),
			},
			{
				data: [],
				key: 'bug',
				loading: true,
				moreLoading: false,
				params: {
					customerId: this.customerId,
					page: 1,
					rows: 10,
					serialNumber: _.get(this.hardwareAsset, 'serialNumber') ?
						[this.hardwareAsset.serialNumber] : null,
					sort: ['severity:ASC'],
				},
				selected: false,
				subject: new Subject(),
				table: new CuiTableOptions({
					bordered: false,
					columns: [
						{
							key: 'id',
							name: I18n.get('_ID_'),
							sortable: true,
							template: this.bugIDTemplate,
							value: 'id',
							width: '110px',
						},
						{
							key: 'severity',
							name: I18n.get('_Severity_'),
							sortable: true,
							sortDirection: 'asc',
							sorting: true,
							template: this.severityTemplate,
							value: 'severity',
							width: '110px',
						},
						{
							key: 'title',
							name: I18n.get('_Title_'),
							sortable: true,
							template: this.cdetsHeadline,
							value: 'title',
						},
						{
							key: 'state',
							name: I18n.get('_Status_'),
							template: this.cdetsStatusTemplate,
							sortable: false,
						},
					],
					hover: true,
					padding: 'compressed',
					singleSelect: true,
					striped: false,
					wrapText: true,
				}),
				title: I18n.get('_PriorityBugs_'),
			},
		];

		this.buildSecuritySubject();
		this.buildFieldNoticesSubject();
		this.buildBugsSubject();

		this.selectTab(_.find(this.tabs, 'selected'));
	}

	/**
	 * Builds our security subject for cancellable http requests
	 */
	private buildSecuritySubject () {
		const tab = _.find(this.tabs, { key: 'security' });
		tab.subject.pipe(
			switchMap(() => this.getSecurityAdvisories()),
		)
		.subscribe();
	}

	/**
	 * Builds our security subject for cancellable http requests
	 */
	private buildFieldNoticesSubject () {
		const tab = _.find(this.tabs, { key: 'field' });
		tab.subject.pipe(
			switchMap(() => this.getFieldNotices()),
		)
		.subscribe();
	}

	/**
	 * Builds our security subject for cancellable http requests
	 */
	private buildBugsSubject () {
		const tab = _.find(this.tabs, { key: 'bug' });
		tab.subject.pipe(
			switchMap(() => this.getBugs()),
		)
		.subscribe();
	}

	/**
	 * Resets the data
	 */
	private clear () {
		this.tabs = [];
	}

	/**
	 * Refreshes and loads the date
	 */
	private refresh () {
		if ((this.hardwareAsset || this.element) && this.customerId) {
			this.clear();
			this.initializeTabs();
			this.initializeData();
		}
	}

	/** Function used to initialize the component */
	public ngOnInit () {
		this.reload
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((toReload: boolean) => {
			if (toReload) {
				this.refresh();
			}
		});

		this.racetrackInfoService.getCurrentSolution()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((solution: RacetrackSolution) => {
			this.selectedSolutionName = _.get(solution, 'name');
		});

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((technology: RacetrackTechnology) => {
			if (this.selectedTechnologyName !== _.get(technology, 'name')) {
				this.selectedTechnologyName = _.get(technology, 'name');
				this.refresh();
			}
		});
	}

	/** Function used to destroy the component */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Row selection handler
	 * @param row the clicked row
	 */
	public onRowSelect (row: SecurityAdvisoryInfo | FieldNoticeAdvisory | CriticalBug) {
		const id = _.get(row, 'id');
		if (_.get(row, 'active', false) && id) {
			const type = this.selectedTab.key;
			if (type === 'bug') {
				this.selectedAdvisory = { id, type: 'bug' };
			} else if (type === 'field') {
				this.selectedAdvisory = { id, type: 'field' };
			} else if (type === 'security') {
				this.selectedAdvisory = { id, type: 'security' };
			}
		} else {
			this.selectedAdvisory = null;
		}
	}

	/**
	 * Column Sort Handler
	 * @param options the selected column
	 */
	public onColumnSort (options: CuiTableColumnOption) {
		const tab = this.selectedTab;

		_.set(tab, ['params', 'sort'], [`${options.key}:${options.sortDirection.toUpperCase()}`]);
		_.set(tab, ['params', 'page'], 1);
		_.set(tab, ['params', 'rows'], 10);

		tab.subject.next();
	}

	/**
	 * Called on 360 details panel close button click
	 */
	public onPanelClose () {
		this.selectedAdvisory = null;
		_.each(_.get(this.selectedTab, ['data', 'info'], []), row => {
			row.active = false;
		});
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentAsset = _.get(changes, ['hardwareAsset', 'currentValue']);
		if (currentAsset && !changes.hardwareAsset.firstChange) {
			this.refresh();
		}
	}
}
