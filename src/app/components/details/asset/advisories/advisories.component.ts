import {
	Component,
	TemplateRef,
	OnInit,
	ViewChild,
	Input,
	SimpleChanges,
	OnChanges,
	OnDestroy,
} from '@angular/core';

import { DatePipe } from '@angular/common';

import { LogService } from '@cisco-ngx/cui-services';

import * as _ from 'lodash-es';
import {
	Asset,
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
} from '@sdp-api';
import { CuiTableOptions, CuiTableColumnOption } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { of, Subject } from 'rxjs';
import {
	map,
	catchError,
	switchMap,
} from 'rxjs/operators';
import { AdvisoryType } from '@interfaces';

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

	@Input('asset') public asset: Asset;
	@Input('element') public element: NetworkElement;
	@Input('customerId') public customerId: string;
	@ViewChild('impact', { static: true }) private impactTemplate: TemplateRef<{ }>;
	@ViewChild('fieldNoticeID', { static: true }) private fieldNoticeIDTemplate: TemplateRef<{ }>;
	@ViewChild('bugID', { static: true }) private bugIDTemplate: TemplateRef<{ }>;

	public tabs: Tab[];
	public isLoading = true;
	public selectedAdvisory: {
		type: AdvisoryType;
		id: string;
	};
	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		private logger: LogService,
		private diagnosticsService: DiagnosticsService,
		private productAlertsService: ProductAlertsService,
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

		return this.productAlertsService.getAdvisoriesSecurityAdvisories(tab.params)
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

		return this.productAlertsService.getAdvisoriesFieldNotices(tab.params)
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

		return this.diagnosticsService.getCriticalBugs(tab.params)
		.pipe(
			map((response: CriticalBugsResponse) => {
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
		const datePipe = new DatePipe('en-US');

		this.tabs = [
			{
				data: [],
				key: 'security',
				loading: true,
				moreLoading: false,
				params: {
					customerId: this.customerId,
					neInstanceId: this.element.neInstanceId ? [this.element.neInstanceId] : null,
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
							render: item => {
								const date = item.lastUpdated ? item.lastUpdated : item.publishedOn;
								if (date) {
									return datePipe.transform(new Date(date), 'yyyy MMM dd');
								}

								return I18n.get('_Never_');
							},
							sortable: false,
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
					neInstanceId: this.element.neInstanceId ? [this.element.neInstanceId] : null,
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
							autoId: 'AdvisoryLastUpdated',
							key: 'lastUpdated',
							name: I18n.get('_LastUpdated_'),
							render: item => {
								const date = item.lastUpdated ? item.lastUpdated : item.publishedOn;
								if (date) {
									return datePipe.transform(new Date(date), 'yyyy MMM dd');
								}

								return I18n.get('_Never_');
							},
							sortable: true,
							sortDirection: 'desc',
							sorting: true,
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
					serialNumber: this.asset.serialNumber ? [this.asset.serialNumber] : null,
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
							width: '100px',
						},
						{
							key: 'title',
							name: I18n.get('_Title_'),
							sortable: true,
							value: 'title',
						},
						{
							key: 'state',
							name: I18n.get('_Status_'),
							render: item =>
								item.state ? _.capitalize(item.state) : I18n.get('_NA_'),
							sortable: false,
						},
						{
							name: I18n.get('_LastUpdated_'),
							render: item => item.lastUpdated ?
								datePipe.transform(
									new Date(item.lastUpdated), 'yyyy MMM dd') :
									I18n.get('_Never_'),
							sortable: false,
							sortDirection: 'desc',
							sorting: true,
							width: '125px',
						},
					],
					hover: true,
					padding: 'compressed',
					singleSelect: true,
					striped: false,
					wrapText: true,
				}),
				title: I18n.get('_CriticalBugs_'),
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
		if (this.asset && this.customerId) {
			this.clear();
			this.initializeTabs();
			this.initializeData();
		}
	}

	/** Function used to initialize the component */
	public ngOnInit () {
		this.refresh();
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
		const currentAsset = _.get(changes, ['asset', 'currentValue']);
		if (currentAsset && !changes.asset.firstChange) {
			this.refresh();
		}
	}
}
