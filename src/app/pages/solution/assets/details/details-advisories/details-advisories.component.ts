import {
	Component,
	TemplateRef,
	OnInit,
	ViewChild,
	Input,
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
} from '@sdp-api';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { Subscription, forkJoin, fromEvent, of, Subject } from 'rxjs';
import {
	map,
	mergeMap,
	debounceTime,
	catchError,
	distinctUntilChanged,
	switchMap,
} from 'rxjs/operators';

/** Our current customerId */
const customerId = '2431199';

/** Interface representing an advisory tab */
interface Tab {
	data?: {
		notice: FieldNotice[] | SecurityAdvisory[];
		bulletin: FieldNoticeBulletin[] | SecurityAdvisoryBulletin[];
	};
	params?: {
		notice:
			ProductAlertsService.GetFieldNoticeParams |
			ProductAlertsService.GetSecurityAdvisoriesParams;
		bulletin:
			ProductAlertsService.GetFieldNoticeBulletinParams |
			ProductAlertsService.GetPSIRTBulletinParams;
	};
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

		return this.productAlertsService.getSecurityAdvisories(advisoryTab.params.notice)
		.pipe(
			mergeMap((response: SecurityAdvisoryResponse) => {
				_.set(advisoryTab, ['data', 'notice'], response.data);

				advisoryTab.params.bulletin.securityAdvisoryInstanceId =
					_.map(response.data, 'advisoryId');

				return this.getSecurityAdvisoryBulletins();
			}),
			catchError(err => {
				this.logger.error('details-advisories.component : getSecurityAdvisories() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Retrieves the security advisory bulletins
	 * @returns the data
	 */
	private getSecurityAdvisoryBulletins () {
		const advisoryTab = _.find(this.tabs, { key: 'security' });

		return this.productAlertsService.getPSIRTBulletin(advisoryTab.params.bulletin)
		.pipe(
			map((response: SecurityAdvisoryBulletinResponse) => {
				_.set(advisoryTab, ['data', 'bulletin'], response.data);
			}),
			catchError(err => {
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

		return this.productAlertsService.getFieldNotice(fieldTab.params.notice)
		.pipe(
			mergeMap((response: FieldNoticeResponse) => {
				_.set(fieldTab, ['data', 'notice'], response.data);

				fieldTab.params.bulletin.fieldNoticeId =
					_.map(response.data, 'fieldNoticeId');

				return this.getFieldNoticeBulletins();
			}),
			catchError(err => {
				this.logger.error('details-advisories.component : getFieldNoticeBulletins() ' +
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
			map((response: SecurityAdvisoryBulletinResponse) => {
				_.set(fieldTab, ['data', 'bulletin'], response.data);
			}),
			catchError(err => {
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
		forkJoin(
			this.getSecurityAdvisories(),
			this.getFieldNotices(),
		)
		.subscribe(() => {
			this.isLoading = false;
		});
	}

	/** Initializes our advisory tabs */
	private initializeTabs () {
		const datePipe = new DatePipe('en-US');

		this.tabs = [
			{
				key: 'security',
				params: {
					bulletin: {
						page: 1,
						rows: 10,
					},
					notice: {
						customerId,
						managedNeId: [this.asset.managedNeId],
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
						},
						{
							key: 'bulletinTitle',
							name: I18n.get('_Title_'),
							sortable: false,
							value: 'bulletinTitle',
						},
						{
							name: I18n.get('_LastUpdated_'),
							render: item => item.bulletinFirstPublished ?
								datePipe.transform(
									new Date(item.bulletinFirstPublished), 'yyyy MMM dd') :
									I18n.get('_Never_'),
							sortable: false,
						},
					],
					wrapText: true,
				}),
				template: this.securityTemplate,
				title: '_SecurityAdvisories_',
			},
			{
				key: 'field',
				params: {
					bulletin: {
						page: 1,
						rows: 10,
					},
					notice: {
						customerId,
						managedNeId: [this.asset.managedNeId],
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
						},
						{
							key: 'bulletinTitle',
							name: I18n.get('_Title_'),
							sortable: false,
							value: 'bulletinTitle',
						},
						{
							name: I18n.get('_LastUpdated_'),
							render: item => item.bulletinLastUpdated ?
								datePipe.transform(
									new Date(item.bulletinLastUpdated), 'yyyy MMM dd') :
									I18n.get('_Never_'),
							sortable: false,
						},
					],
					wrapText: true,
				}),
				template: this.fieldNoticesTemplate,
				title: '_FieldNotices_',
			},
			{
				disabled: true,
				key: 'bugs',
				selected: false,
				template: this.bugsTemplate,
				title: '_CriticalBugs_',
			},
		];

		this.selectTab(_.find(this.tabs, 'selected'));
	}

	/** Function used to initialize the component */
	public ngOnInit () {
		this.initializeTabs();
		this.initializeData();
	}
}
