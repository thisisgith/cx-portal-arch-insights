import {
	Component,
	TemplateRef,
	OnInit,
	ViewChild,
	Input,
	SimpleChanges,
} from '@angular/core';

import { DatePipe } from '@angular/common';

import { LogService } from '@cisco-ngx/cui-services';

import * as _ from 'lodash-es';
import {
	FieldNoticeBulletin,
	SecurityAdvisoryBulletin,
	FieldNotice,
	SecurityAdvisory,
	ProductAlertsService,
	Asset,
	SecurityAdvisoryResponse,
	SecurityAdvisoryBulletinResponse,
	FieldNoticeResponse,
	ProductAlertsPagination as Pagination,
	FieldNoticeBulletinResponse,
} from '@sdp-api';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { forkJoin, of } from 'rxjs';
import {
	map,
	mergeMap,
	catchError,
} from 'rxjs/operators';

/** Our current customerId */
const customerId = '2431199';

/** Interface representing an advisory tab */
interface Tab {
	data?: {
		notice: FieldNotice[] | SecurityAdvisory[];
		bulletin: FieldNoticeBulletin[] | SecurityAdvisoryBulletin[];
		pagination: Pagination;
	};
	params?: {
		notice:
			ProductAlertsService.GetFieldNoticeParams |
			ProductAlertsService.GetSecurityAdvisoriesParams;
		bulletin:
			ProductAlertsService.GetFieldNoticeBulletinParams |
			ProductAlertsService.GetPSIRTBulletinParams;
	};
	loading: boolean;
	moreLoading: boolean;
	disabled?: boolean;
	key: string;
	selected: boolean;
	table?: CuiTableOptions;
	template: TemplateRef<{ }>;
	title: string;
}

/**
 * Details Advisories Component
 */
@Component({
	selector: 'details-advisories',
	styleUrls: ['./details-advisories.component.scss'],
	templateUrl: './details-advisories.component.html',
})
export class DetailsAdvisoriesComponent implements OnInit {

	@Input('asset') public asset: Asset;
	@ViewChild('security', { static: true }) private securityTemplate: TemplateRef<{ }>;
	@ViewChild('impact', { static: true }) private impactTemplate: TemplateRef<{ }>;
	@ViewChild('fieldNoticeID', { static: true }) private fieldNoticeIDTemplate: TemplateRef<{ }>;
	@ViewChild('fieldNotices', { static: true }) private fieldNoticesTemplate: TemplateRef<{ }>;
	@ViewChild('bugs', { static: true }) private bugsTemplate: TemplateRef<{ }>;

	public tabs: Tab[];
	public visibleTab: TemplateRef<{ }>;
	public isLoading = true;

	constructor (
		private logger: LogService,
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

		this.visibleTab = tab.template;
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
				_.set(advisoryTab, ['data', 'notice'], response.data);

				advisoryTab.params.bulletin.securityAdvisoryInstanceId =
					_.map(response.data, 'advisoryId');

				return this.getSecurityAdvisoryBulletins();
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
				if (!append) {
					_.set(advisoryTab, ['data', 'bulletin'], response.data);
				} else {
					advisoryTab.data.bulletin = _.concat(advisoryTab.data.bulletin, response.data);
				}

				_.set(advisoryTab, ['data', 'pagination'], response.Pagination);

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
				_.set(fieldTab, ['data', 'notice'], response.data);

				fieldTab.params.bulletin.fieldNoticeId =
					_.map(response.data, 'fieldNoticeId');

				return this.getFieldNoticeBulletins();
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
				const bulletins = _.map(response.data,
					(bulletin: SecurityAdvisoryBulletin) => {
						const newBulletin = _.cloneDeep(bulletin);

						newBulletin.bulletinTitle = _.trim(
							_.replace(newBulletin.bulletinTitle, /FN[0-9]{1,5}[ \t]+-/, ''));

						return newBulletin;
					});

				if (!append) {
					_.set(fieldTab, ['data', 'bulletin'], bulletins);
				} else {
					fieldTab.data.bulletin = _.concat(fieldTab.data.bulletin, bulletins);
				}

				_.set(fieldTab, ['data', 'pagination'], response.Pagination);

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
	 * Initializes our data sets
	 */
	private initializeData () {
		this.isLoading = true;

		const obs = _.compact(_.map(this.tabs, (tab: Tab) => {
			if (_.get(tab.params, ['notice', 'managedNeId'])) {
				return (tab.key === 'security') ?
					this.getSecurityAdvisories() : this.getFieldNotices();
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

		tab.params.bulletin.page = tab.params.bulletin.page += 1;

		let obs;

		if (tab.key === 'security') {
			obs = this.getSecurityAdvisoryBulletins(true);
		}

		if (tab.key === 'field') {
			obs = this.getFieldNoticeBulletins(true);
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
						customerId,
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
					striped: false,
					wrapText: true,
				}),
				template: this.securityTemplate,
				title: I18n.get('_SecurityAdvisories_'),
			},
			{
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
						customerId,
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
					striped: false,
					wrapText: true,
				}),
				template: this.fieldNoticesTemplate,
				title: I18n.get('_FieldNotices_'),
			},
			{
				disabled: true,
				key: 'bugs',
				loading: true,
				moreLoading: false,
				selected: false,
				template: this.bugsTemplate,
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
