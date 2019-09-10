import { Component, Input, OnChanges, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import {
	SyslogsService,
	DeviceDetailsdata,
	ProductId,
	SoftwareList,
	ProductFamily,
	SyslogPanelGridData,
	SyslogPanelFilterData,
} from '@sdp-api';
import { catchError, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { I18n } from '@cisco-ngx/cui-utils';
import { UserResolve } from '@utilities';
import { MarshalTableData } from '../syslogs.utils';

/**
 * Syslogpanelgrid component
 */

@Component({
	selector: 'syslog-message-details',
	styleUrls: ['./syslog-messages-details.component.scss'],
	templateUrl: './syslog-messages-details.component.html',
})
export class SyslogMessagesDetailsComponent implements OnChanges, OnDestroy {
	@Input('asset') public asset: any;
	@ViewChild('innerTableRef', { static: true }) public innerTableRef: TemplateRef<{ }>;
	@Input('selectedFilter') public selectedFilter: any;
	public tableOptions: CuiTableOptions;
	public innerTableOptions: CuiTableOptions;
	public selectDropDown = {
		assets: { },
		customerId: '',
		productFamily: '',
		productID: '',
		selectedFilters : { },
		Software: '',
		timePeriod: '',
	};

	public customerId;
	public tableData: DeviceDetailsdata[] = [];
	public productIdItems: ProductId[];
	public softwareItems: SoftwareList[];
	public productFamily: ProductFamily[];
	public pagerLimit = 5;
	public destroy$ = new Subject();
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
	public panelDataParam = {
		customerId: '',
		selectedFilters: '',
		selectedRowData: '',
	};

	public timePeriod: any[] = [{
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
	 * @param changes onchanges data
	 * Onchanges lifecycle hook
	 */
	public ngOnChanges () {
		this.loadSyslogPaneldata(this.asset);
		this.loadSyslogPanelFilter(this.asset);
		this.selectDropDown.timePeriod = this.selectedFilter.days;
	}

	/**
	 * Used to load the table grid
	 * OnInit lifecycle hook
	 */

	public ngOnInit () {
		this.tableInitialization();
		this.innerTableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'serialNumber',
					name: I18n.get('_SyslogNumber_'),
				},
				{
					key: 'SyslogMsgDesc',
					name: I18n.get('_Syslog_SyslogMessageText_'),
				},
				{
					key: 'MessageCount',
					name: I18n.get('_SyslogCount_'),

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
					key: 'DeviceHost',
					name: I18n.get('_SyslogAsset_'),
					sortable: true,
				},
				{
					key: 'ProductId',
					name: I18n.get('_ProductID_'),
					sortable: true,
				},
				{
					key: 'ProductFamily',
					name: I18n.get('_ProductFamily_'),
					sortable: true,
				},
				{
					key: 'SoftwareType',
					name: I18n.get('_Software_'),
					sortable: true,
				},
				{
					key: 'SoftwareVersion',
					name: I18n.get('_SoftwareVersion_'),
					sortable: true,
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
	 * Used to  Filter the table grid
	 */

	public onSelection () {
		this.selectDropDown.assets = this.asset;
		this.selectDropDown.selectedFilters = this.selectedFilter;
		this.selectDropDown.customerId = this.customerId;
		this.syslogsService
			.getPanelFilterGridData(
				this.selectDropDown)
			.pipe(takeUntil(this.destroy$),
			catchError(err => {
				this.logger.error('syslog-messages-details.component : getPanelFilterGridData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
			)
			.subscribe((data: SyslogPanelGridData) => {
				this.tableData = MarshalTableData.marshalTableDataForInerGrid(data.responseData);
				this.tableConfig.totalItems = this.tableData.length;
			});
	}

	/**
	 * Used to  get the table grid
	 * @param tableRowData gives table row info
	 */

	public loadSyslogPaneldata (tableRowData) {
		if (this.asset) {
			this.panelDataParam = {
				customerId: this.customerId,
				selectedFilters: this.selectedFilter,
				selectedRowData : tableRowData,
			};

			this.syslogsService.getPanelGridData(this.panelDataParam)
				.pipe(
					takeUntil(this.destroy$),
					catchError(err => {
						this.logger
						.error('syslog-messages-details.component : getPanelGridData() ' +
							`:: Error : (${err.status}) ${err.message}`);

						return of({ });
					}),
				)
				.subscribe((data: SyslogPanelGridData) => {
					this.tableData = MarshalTableData
					.marshalTableDataForInerGrid(data.responseData);
					this.tableConfig.totalItems = this.tableData.length;
				});

		}
	}

	/**
	 * Used to  get the filter data grid
	 * @param tableRowData gives table row info
	 */

	public loadSyslogPanelFilter (tableRowData) {
		if (this.asset) {
			const paramFilterData = {
				customerId: this.customerId,
				selectedRowData : tableRowData,
			};
			this.syslogsService.getPanelFilterData(paramFilterData)
				.pipe(takeUntil(this.destroy$),
				catchError(err => {
					this.logger.error('syslog-messages-details.component : getPanelFilterData() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
				)
				.subscribe((data: SyslogPanelFilterData) => {
					this.productFamily = data.responseData[2].ProductFamily;
					this.productIdItems = data.responseData[0].ProductId;
					this.softwareItems = data.responseData[1].SoftwareType;
				});
		}
	}
	/**
	 * Determines whether pager updated on
	 * @param pageInfo contains page info
	 */
	public onPagerUpdated (pageInfo: any) {
		this.tableConfig.tableOffset = pageInfo.page;
		this.paginationConfig.pageNum = pageInfo.page + 1;
	}

	/**
	 * on destroy
	 */

	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
