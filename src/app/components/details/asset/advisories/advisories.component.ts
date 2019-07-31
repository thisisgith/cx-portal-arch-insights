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
	FieldNotice,
	FieldNoticeBulletin,
	FieldNoticeBulletinResponse,
	FieldNoticeResponse,
	ProductAlertsPagination as Pagination,
	ProductAlertsService,
	SecurityAdvisory,
	SecurityAdvisoryBulletin,
	SecurityAdvisoryBulletinResponse,
	SecurityAdvisoryResponse,
} from '@sdp-api';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { forkJoin, of, Subject } from 'rxjs';
import {
	map,
	mergeMap,
	catchError,
	takeUntil,
} from 'rxjs/operators';
import { UserResolve } from '@utilities';
import { AdvisoryType } from '@interfaces';

/** Interface representing an advisory tab */
interface Tab {
	data?: {
		notice?: FieldNotice[] | SecurityAdvisory[];
		bulletin?: FieldNoticeBulletin[] | SecurityAdvisoryBulletin[] | CriticalBug[];
		pagination?: Pagination;
	};
	params?: {
		notice:
			ProductAlertsService.GetFieldNoticeParams |
			ProductAlertsService.GetSecurityAdvisoriesParams;
		bulletin:
			ProductAlertsService.GetFieldNoticeBulletinParams |
			ProductAlertsService.GetPSIRTBulletinParams;
	} |
	DiagnosticsService.GetCriticalBugsParams;
	loading: boolean;
	moreLoading: boolean;
	disabled?: boolean;
	key: string;
	selected: boolean;
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
	@ViewChild('impact', { static: true }) private impactTemplate: TemplateRef<{ }>;
	@ViewChild('fieldNoticeID', { static: true }) private fieldNoticeIDTemplate: TemplateRef<{ }>;

	public tabs: Tab[];
	public isLoading = true;
	public selectedAdvisory: {
		type: AdvisoryType;
		id: string;
	};
	private customerId: string;
	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		private logger: LogService,
		private diagnosticsService: DiagnosticsService,
		private productAlertsService: ProductAlertsService,
		private userResolve: UserResolve,
	) {
		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
		});
	}

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
	 * @returns the data
	 */
	private getSecurityAdvisories () {
		const advisoryTab = _.find(this.tabs, { key: 'security' });
		advisoryTab.loading = true;

		return this.productAlertsService.getSecurityAdvisories(advisoryTab.params.notice)
		.pipe(
			mergeMap((response: SecurityAdvisoryResponse) => {
				const data = _.get(response, 'data', []);
				_.set(advisoryTab, ['data', 'notice'], data);

				advisoryTab.params.bulletin.securityAdvisoryInstanceId =
					_.map(data, 'advisoryId');

				if (data.length) {
					return this.getSecurityAdvisoryBulletins();
				}

				return of({ });
			}),
			catchError(err => {
				advisoryTab.loading = false;
				this.logger.error('details-advisories.component : getSecurityAdvisories() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Retrieves the security advisory bulletins
	 * @param append appends the values
	 * @returns the data
	 */
	private getSecurityAdvisoryBulletins (append = false) {
		const advisoryTab = _.find(this.tabs, { key: 'security' });

		return this.productAlertsService.getPSIRTBulletin(advisoryTab.params.bulletin)
		.pipe(
			map((response: SecurityAdvisoryBulletinResponse) => {
				const data = _.get(response, 'data', []);
				if (!append) {
					_.set(advisoryTab, ['data', 'bulletin'], data);
				} else {
					_.set(advisoryTab, ['data', 'bulletin'],
						_.concat(_.get(advisoryTab, ['data', 'bulletin'], []), data));
				}

				_.set(advisoryTab, ['data', 'pagination'], _.get(response, 'Pagination', { }));

				advisoryTab.loading = false;
			}),
			catchError(err => {
				advisoryTab.loading = false;
				this.logger.error('details-advisories.component : getSecurityAdvisoryBulletins() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Retrieves the field notices
	 * @returns the data
	 */
	private getFieldNotices () {
		const fieldTab = _.find(this.tabs, { key: 'field' });
		fieldTab.loading = true;

		return this.productAlertsService.getFieldNotice(fieldTab.params.notice)
		.pipe(
			mergeMap((response: FieldNoticeResponse) => {
				const data = _.get(response, 'data', []);
				_.set(fieldTab, ['data', 'notice'], data);

				fieldTab.params.bulletin.fieldNoticeId =
					_.map(data, 'fieldNoticeId');

				if (data.length) {
					return this.getFieldNoticeBulletins();
				}

				return of({ });
			}),
			catchError(err => {
				fieldTab.loading = false;
				this.logger.error('details-advisories.component : getFieldNotices() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Retrieves the field notice bulletins
	 * @param append appends the values
	 * @returns the data
	 */
	private getFieldNoticeBulletins (append = false) {
		const fieldTab = _.find(this.tabs, { key: 'field' });

		return this.productAlertsService.getFieldNoticeBulletin(fieldTab.params.bulletin)
		.pipe(
			map((response: FieldNoticeBulletinResponse) => {
				const data = _.get(response, 'data', []);

				const bulletins = _.map(data,
					(bulletin: SecurityAdvisoryBulletin) => {
						const newBulletin = _.cloneDeep(bulletin);

						newBulletin.bulletinTitle = _.trim(
							_.replace(newBulletin.bulletinTitle, /FN[0-9]{1,5}[ \t]+-/, ''));

						return newBulletin;
					});

				if (!append) {
					_.set(fieldTab, ['data', 'bulletin'], bulletins);
				} else {
					_.set(fieldTab, ['data', 'bulletin'],
						_.concat(_.get(fieldTab, ['data', 'bulletin'], []), bulletins));
				}

				_.set(fieldTab, ['data', 'pagination'], _.get(response, 'Pagination', { }));

				fieldTab.loading = false;
			}),
			catchError(err => {
				fieldTab.loading = false;

				this.logger.error('details-advisories.component : getFieldNoticeBulletins() ' +
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
		const bugTab = _.find(this.tabs, { key: 'bug' });

		return this.diagnosticsService.getCriticalBugs(bugTab.params)
		.pipe(
			map((response: CriticalBugsResponse) => {
				const data = _.get(response, 'data', []);

				if (!append) {
					_.set(bugTab, ['data', 'bulletin'], data);
				} else {
					_.set(bugTab, ['data', 'bulletin'],
						_.concat(_.get(bugTab, ['data', 'bulletin'], []), data));
				}

				_.set(bugTab, ['data', 'pagination'], _.get(response, 'Pagination', { }));

				bugTab.loading = false;
			}),
			catchError(err => {
				bugTab.loading = false;

				this.logger.error('details-advisories.component : getBugs() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Initializes our data sets
	 */
	private initializeData () {
		this.isLoading = true;

		const obs = _.compact(_.map(this.tabs, (tab: Tab) => {
			if (_.get(tab.params, ['notice', 'managedNeId'])) {
				return (tab.key === 'security') ?
					this.getSecurityAdvisories() : this.getFieldNotices();
			}
			if (_.get(tab.params, 'serialNumber')) {
				return this.getBugs();
			}
		}));

		forkJoin(obs)
		.subscribe(
		null,
		null,
		() => {
			this.isLoading = false;

			_.each(this.tabs, (tab: Tab) => {
				tab.loading = false;
			});
		});
	}

	/**
	 * Loads more data if necessary
	 */
	public loadMore () {
		const tab = this.selectedTab;
		tab.moreLoading = true;

		let page = _.get(tab.params, ['bulletin', 'page']);
		if (page) {
			_.set(tab.params, ['bulletin', 'page'], page += 1);
		} else {
			page = _.get(tab.params, 'page');
			_.set(tab.params, 'page', page += 1);
		}

		let obs;

		if (tab.key === 'security') {
			obs = this.getSecurityAdvisoryBulletins(true);
		}

		if (tab.key === 'field') {
			obs = this.getFieldNoticeBulletins(true);
		}

		if (tab.key === 'bug') {
			obs = this.getBugs(true);
		}

		obs.subscribe(
			() => {
				tab.moreLoading = false;
			},
		);
	}

	/** Initializes our advisory tabs */
	private initializeTabs () {
		const datePipe = new DatePipe('en-US');

		this.tabs = [
			{
				data: { },
				key: 'security',
				loading: true,
				moreLoading: false,
				params: {
					bulletin: {
						page: 1,
						rows: 10,
						sort: ['bulletinFirstPublished:DESC'],
					},
					notice: {
						customerId: this.customerId,
						managedNeId: this.asset.managedNeId ? [this.asset.managedNeId] : null,
						vulnerabilityStatus: ['POTVUL', 'VUL'],
					},
				},
				selected: true,
				table: new CuiTableOptions({
					bordered: false,
					columns: [
						{
							name: I18n.get('_Impact_'),
							sortable: false,
							template: this.impactTemplate,
							width: '100px',
						},
						{
							autoId: 'AdvisoryTitle',
							key: 'bulletinTitle',
							name: I18n.get('_Title_'),
							sortable: false,
							value: 'bulletinTitle',
						},
						{
							autoId: 'AdvisoryLastUpdated',
							name: I18n.get('_LastUpdated_'),
							render: item => item.bulletinFirstPublished ?
								datePipe.transform(
									new Date(item.bulletinFirstPublished), 'yyyy MMM dd') :
									I18n.get('_Never_'),
							sortable: false,
							sortDirection: 'desc',
							sorting: true,
							width: '125px',
						},
					],
					padding: 'compressed',
					singleSelect: true,
					striped: false,
					wrapText: true,
				}),
				title: I18n.get('_SecurityAdvisories_'),
			},
			{
				data: { },
				key: 'field',
				loading: true,
				moreLoading: false,
				params: {
					bulletin: {
						page: 1,
						rows: 10,
						sort: ['bulletinLastUpdated:DESC'],
					},
					notice: {
						customerId: this.customerId,
						managedNeId: this.asset.managedNeId ? [this.asset.managedNeId] : null,
						vulnerabilityStatus: ['POTVUL', 'VUL'],
					},
				},
				selected: false,
				table: new CuiTableOptions({
					bordered: false,
					columns: [
						{
							name: I18n.get('_ID_'),
							sortable: false,
							template: this.fieldNoticeIDTemplate,
							width: '100px',
						},
						{
							autoId: 'AdvisoryTitle',
							key: 'bulletinTitle',
							name: I18n.get('_Title_'),
							sortable: false,
							value: 'bulletinTitle',
						},
						{
							autoId: 'AdvisoryLastUpdated',
							name: I18n.get('_LastUpdated_'),
							render: item => item.bulletinLastUpdated ?
								datePipe.transform(
									new Date(item.bulletinLastUpdated), 'yyyy MMM dd') :
									I18n.get('_Never_'),
							sortable: false,
							sortDirection: 'desc',
							sorting: true,
							width: '125px',
						},
					],
					padding: 'compressed',
					singleSelect: true,
					striped: false,
					wrapText: true,
				}),
				title: I18n.get('_FieldNotices_'),
			},
			{
				data: { },
				key: 'bug',
				loading: true,
				moreLoading: false,
				params: {
					customerId: this.customerId,
					serialNumber: this.asset.serialNumber ? [this.asset.serialNumber] : null,
				},
				selected: false,
				table: new CuiTableOptions({
					bordered: false,
					columns: [
						{
							key: 'id',
							name: I18n.get('_ID_'),
							sortable: false,
							value: 'id',
							width: '100px',
						},
						{
							key: 'title',
							name: I18n.get('_Title_'),
							sortable: false,
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
					padding: 'compressed',
					singleSelect: true,
					striped: false,
					wrapText: true,
				}),
				title: I18n.get('_CriticalBugs_'),
			},
		];

		this.selectTab(_.find(this.tabs, 'selected'));
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
		if (this.asset) {
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
	public onRowSelect (row: SecurityAdvisoryBulletin | FieldNoticeBulletin | CriticalBug) {
		if (_.get(row, 'active', false)) {
			const type = this.selectedTab.key;
			if (type === 'bug') {
				this.selectedAdvisory = { id: _.get(row, 'id'), type: 'bug' };
			} else if (type === 'field') {
				this.selectedAdvisory = { id: _.get(row, 'fieldNoticeId'), type: 'field' };
			} else if (type === 'security') {
				this.selectedAdvisory = {
					id: _.get(row, 'securityAdvisoryInstanceId'), type: 'security' };
			}
		} else {
			this.selectedAdvisory = null;
		}
	}

	/**
	 * Called on 360 details panel close button click
	 */
	public onPanelClose () {
		this.selectedAdvisory = null;
		_.each(_.get(this.selectedTab, ['data', 'bulletin'], []), row => {
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
