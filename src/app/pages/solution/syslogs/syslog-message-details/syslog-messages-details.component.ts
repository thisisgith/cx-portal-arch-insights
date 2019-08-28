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

/**
 * Syslogpanelgrid component
 */

@Component({
	selector: 'syslog-message-details',
	styleUrls: ['./syslog-messages-details.component.scss'],
	templateUrl: './syslog-messages-details.component.html',
})
export class SyslogMessagesDetailsComponent implements OnChanges, OnDestroy {
	@Input('asset') public asset: SyslogPanelGridData;
	@ViewChild('innertableref', { static: true }) public innertableref: TemplateRef<{ }>;
	@ViewChild('numbervalueref', { static: true }) public numbervalueref: TemplateRef<{ }>;
	@Input('selectedFilter') public selectedFilter: any;
	public tableOptions: CuiTableOptions;
	public innerTableOptions: CuiTableOptions;
	public selectDropDown = {
		assets: { },
		productFamily: '',
		productID: '',
		selectedFilters : { },
		Software: '',
		timePeriod: '',
	};

	public customerId;
	public tableData: DeviceDetailsdata[] = [];
	public tableOffset = 0;
	public productIdItems: ProductId[];
	public softwareItems: SoftwareList[];
	public productFamily: ProductFamily[];
	public totalItems = 0;
	public tableLimit = 10;
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

	// tslint:disable-next-line: no-any
	public timePeriod: any[] = [{
		name: '1 day',
		value: 1,
	},
	{
		name: '7 days',
		value: 7,
	},
	{
		name: '15 days',
		value: 15,
	},
	{
		name: '30 days',
		value: 30,
	}];
	constructor (
		private logger: LogService,
		public syslogsService: SyslogsService,
		private userResolve: UserResolve,
	) {
		this.logger.debug('SyslogMessagesDetailsComponent Created!');
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
			dynamicData: false,
			// tslint:disable-next-line: object-literal-sort-keys
			columns: [
				{
					key: 'serialNumber',
					name: 'NO',
				},
				{
					key: 'SyslogMsgDesc',
					name: 'Message Text',
				},
				{
					key: 'MessageCount',
					name: 'Count',

				},
			],
		});
	}
	/**
	 * Used to load the table grid
	 * Cui table values
	 */
	public tableInitialization () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			dynamicData: false,
			// tslint:disable-next-line: object-literal-sort-keys
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

			padding: 'regular',
			rowWellColor: 'black',
			rowWellTemplate : this.innertableref,
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
				this.tableData = this.marshalTableDataForInerGrid(data.responseData);
				this.tableConfig.totalItems = this.tableData.length;
			});
	}

	/***
	 * To push the new serialNumber property for No c
	 * @param innerData comtains the table data
	 * @returns marshalled table data
	 */
	public marshalTableDataForInerGrid (innerData) {
		for (const messageObject of innerData) {
			for (const i in messageObject.MessageDescObject) {
				if (messageObject.MessageDescObject) {
					messageObject.MessageDescObject[i].serialNumber = parseInt(i, 10) + 1;
				}
			}
		}

		return innerData;
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
						// tslint:disable-next-line: ter-max-len
						this.logger.error('syslog-messages-details.component : getPanelGridData() ' +
							`:: Error : (${err.status}) ${err.message}`);

						return of({ });
					}),
				)
				.subscribe((data: SyslogPanelGridData) => {
					this.tableData = this.marshalTableDataForInerGrid(data.responseData);
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
			this.syslogsService.getPanelFilterData(tableRowData)
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
