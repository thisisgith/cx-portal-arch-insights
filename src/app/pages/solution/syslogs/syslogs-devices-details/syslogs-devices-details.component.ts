import { Component, Input, ViewChild,
	TemplateRef, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { SyslogsService, SyslogDevicePanelOuter } from '@sdp-api';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { UserResolve } from '@utilities';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { MarshalTableData } from '../syslogs.utils';

/**
 * Device view component
 */
@Component({
	selector: 'syslogs-devices-details',
	styleUrls: ['./syslogs-devices-details.component.scss'],
	templateUrl: './syslogs-devices-details.component.html',
})
export class SyslogsDeviceDetailsComponent implements OnChanges, OnDestroy {
	@ViewChild('recommendation', { static: true }) public recommendation: TemplateRef <{ }>;
	@ViewChild('innerTableRef', { static: true }) public innerTableRef: TemplateRef<{ }>;
	@ViewChild('messageType', { static: true }) public messageType: TemplateRef<{ }>;
	@ViewChild('innerMessageType', { static: true }) public innerMessageType: TemplateRef<{ }>;
	@Input('asset') public asset: any;
	@Input('selectedFilter') public selectedFilter: any;
	public tableOptions: CuiTableOptions;
	public innerTableOptions: CuiTableOptions;
	public tableData: SyslogDevicePanelOuter[];
	public destroy$ = new Subject();
	public customerId;
	public includeMsgFilter = '';
	public excludeMsgFilter = '';
	public selectedSeverity = '';
	public selectedTimeRange = '';
	public selectedCatalog = '';
	public tableStartIndex = 0;
	public tableEndIndex = 10;
	public deviceDetailsParams: SyslogsService.GetSyslogsParams = { };
	public loading = false;
	public tableConfig = {
		tableLimit: 10,
		tableOffset: 0,
		totalItems: 10,
	};
	public paginationConfig = {
		pageLimit: 10,
		pageNum: 1,
		pagerLimit: 10,
	};

	public severityList = [
		{
			name: I18n.get('_SyslogSeverity0_'),
			value: '0',
		},
		{
			name: I18n.get('_SyslogSeverity1_'),
			value: 1,
		},
		{
			name: I18n.get('_SyslogSeverity2_'),
			value: 2,
		},
		{
			name: I18n.get('_SyslogSeverity3_'),
			value: 3,
		},
		{
			name: I18n.get('_SyslogSeverity4_'),
			value: 4,
		},
		{
			name: I18n.get('_SyslogSeverity5_'),
			value: 5,
		},
		{
			name: I18n.get('_SyslogSeverity6_'),
			value: 6,
		},
		{
			name: I18n.get('_SyslogSeverity7_'),
			value: 7,
		},
	];
	public timeRangeList = [{
		name: I18n.get('_SyslogDay1_'),
		value: 1,
	},
	{
		name: I18n.get('_SyslogDays7_'),
		value: 7,
	},
	{
		name: I18n.get('_SyslogDays15_'),
		value: 15,
	},
	{
		name: I18n.get('_SyslogDays30_'),
		value: 30,
	}];
	public catalogList = [
		{
			name: I18n.get('_SyslogCiscoCatalog_'),
			value: 'Cisco',
		},
		{
			name: I18n.get('_SyslogOthers_'),
			value: 'Others',
		},
	];
	constructor (
		private logger: LogService,
		public syslogsService: SyslogsService,
		private userResolve: UserResolve,
	) {
		this.userResolve.getCustomerId()
			.pipe(
			takeUntil(this.destroy$),
			)
			.subscribe((id: string) => {
				this.customerId = id;
			});
	}

	/**
	 * Used to load the table grid
	 * @param changes contains changes
	 * Onchanges lifecycle hook
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentFilter = _.get(changes, ['selectedFilter', 'currentValue']);
		const currentAsset = _.get(changes, ['asset', 'currentValue']);
		if (currentFilter) {
			this.selectedTimeRange = currentFilter.days;
			this.selectedSeverity = currentFilter.severity;
			this.selectedCatalog = currentFilter.catalog;
		}
		this.deviceDetailsParams = {
			catalog: this.selectedCatalog,
			customerId: this.customerId,
			days: +this.selectedTimeRange,
			deviceHost: currentAsset.DeviceHost,
			excludeMsgType: this.excludeMsgFilter,
			includeMsgType: this.includeMsgFilter,
			severity: +this.selectedSeverity,
		};
		this.SyslogDevicePanelData();
	}

	/**
	 * Used to load the table grid
	 * OnInit lifecycle hook
	 */

	public ngOnInit () {
		this.tableInitialization();
		this.SyslogDevicePanelData();
		this.innerTableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'serialNumber',
					name: I18n.get('_SyslogNumber_'),
				},
				{
					name:  I18n.get('_Syslog_SyslogMessageText_'),
					template: this.innerMessageType,
				},
				{
					key: 'MessageCount',
					name:  I18n.get('_SyslogCount_'),

				},
			],
			dynamicData: false,
		});
	}
	/**
	 * Used to load the table grid
	 * Cui table values
	 */
	public tableInitialization () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					// key: 'MsgType',
					name: I18n.get('_SyslogMessageGrid_'),
					sortable: true,
					template: this.messageType,
				},
				{
					key: 'SyslogSeverity',
					name: I18n.get('_Severity_'),
					sortable: true,
				},
				{
					key: 'MessageCount',
					name: I18n.get('_SyslogCount_'),
					sortable: true,
				},
				{
					name: I18n.get('_SyslogRecommendations_'),
					sortable: true,
					template: this.recommendation,
				},
			],

			dynamicData: false,
			padding: 'regular',
			rowWellColor: 'black',
			rowWellTemplate : this.innerTableRef,
			singleSelect: true,
			striped: false,
			wrapText: false,
		});
	}
	/**
	 * Response from the network
	 * @param gridData event values from input
	 * Onchanges lifecycle hook
	 */
	public SyslogDevicePanelData () {
		this.loading = true;
		this.tableData = [];
		this.syslogsService.getdevicePanelDetails(this.deviceDetailsParams)
		.pipe(takeUntil(this.destroy$),
		catchError(err => {
			this.loading = false;
			this.logger.error('syslog-messages-details.component : getdevicePanelDetails() ' +
				`:: Error : (${err.status}) ${err.message}`);

			return of({ });
		}),
		)
		.subscribe((response: SyslogDevicePanelOuter[]) => {
			this.tableData = MarshalTableData.marshalTableDataForInerGrid(response);
			this.tableConfig.totalItems = response.length;
			this.loading = false;
			this.tableEndIndex = 10;
			if (this.tableEndIndex > this.tableConfig.totalItems) {
				this.tableEndIndex = this.tableConfig.totalItems;
			}
		});
	}
	/**
	 * Keys down function
	 * @param event contains eventdata
	 */
	public keyDownFunction (event) {
		if (event.keyCode === 13) {
			this.deviceDetailsParams.includeMsgType = this.includeMsgFilter;
			this.deviceDetailsParams.excludeMsgType = this.excludeMsgFilter;
			this.SyslogDevicePanelData();
		}
	}
	/**
	 * Determines whether selection on
	 */
	public onSelection () {
		this.deviceDetailsParams.severity = +this.selectedSeverity;
		this.deviceDetailsParams.days = +this.selectedTimeRange;
		this.deviceDetailsParams.catalog = this.selectedCatalog;
		this.SyslogDevicePanelData();
	}

	/**Determain the Pagination
 	* @param pageInfo input for page info
	 */

	 public onPagerUpdated (pageInfo: any) {
		this.tableConfig.tableOffset = pageInfo.page;
		this.paginationConfig.pageNum = pageInfo.page + 1;
		this.tableStartIndex = (pageInfo.page * pageInfo.limit) ;
		this.tableEndIndex = (pageInfo.page * pageInfo.limit) + 10 ;
		if (this.tableEndIndex > this.tableConfig.totalItems) {
			this.tableEndIndex = this.tableConfig.totalItems ;
		}
	 }
	/**
	 * on destroy
	 */

	public ngOnDestroy ( ) {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
