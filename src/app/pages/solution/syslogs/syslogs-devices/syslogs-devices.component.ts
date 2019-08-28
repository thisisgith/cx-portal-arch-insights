import {
	Component,
	OnInit,
	OnDestroy,
	SimpleChanges,
	Input,
	OnChanges,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { SyslogsService,
	SyslogDeviceData,
	SyslogDeviceDetailsdata,
	SyslogFilter,
	SyslogPanelIPSer } from '@sdp-api';
import { Subject, of, Subscription } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';

/**
 * syslog Component
 */
@Component({
	selector: 'syslogs-devices',
	styleUrls: ['./syslogs-devices.component.scss'],
	templateUrl: './syslogs-devices.component.html',
})
export class SyslogsDevicesComponent implements OnInit, OnChanges, OnDestroy {
	@Input() public assetFilter;
	public customerId;
	public gridSubscripion: Subscription;
	public fullResponse: SyslogDeviceData;
	public tableOptions: CuiTableOptions;
	public tableLimit = 10;
	public pagerLimit = 10;
	public tableOffset = 0;
	public loading = false;
	public totalItems = 0;
	public tableData: SyslogDeviceDetailsdata[] = [];
	public pageNum = 1;
	public severity = 3;
	public timeRange = 1;
	public catalog = '';
	public selectedAsset;
	public showAssetPanel = false;
	public fullscreen = false;
	public assetType = '';
	public filters: SyslogFilter[];
	public searchVal = '';
	public tableStartIndex = 0;
	public tableEndIndex = 0;
	public showAsset360 = false;
	public syslogsParams: SyslogsService.GetSyslogsParams = {
		customerId: this.customerId,
		pageNo: this.pageNum,
		size: this.pagerLimit,
	};
	public selected;
	public destroy$ = new Subject();
	public deviceHeaderValues: SyslogPanelIPSer;
	public notScaned = true;
	public serialNumberStatus = true;
	constructor (
		private logger: LogService,
		public syslogsService: SyslogsService,
		private userResolve: UserResolve,
	) {
		this.logger.debug('BestpracticesComponent Created!');
		this.userResolve.getCustomerId()
		.pipe(
		takeUntil(this.destroy$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
		});
		this.syslogsParams = {
			asset: '',
			catalog: 'Cisco',
			customerId: this.customerId,
			days: 1,
			pageNo: this.pageNum,
			severity: 3,
			size: this.pagerLimit,
		};
	}
	get dropdownActions () {
		return _.filter([
			this.selected
				? {
					label: `${I18n.get('_ExportSelected_')} (${
						this.selected
						})`,
				}
				: undefined,
			{
				label: I18n.get('_ExportAll_'),
			},
		]);
	}
	/**
	 * on changes
	 * @param changes contains filterobj
	 */
	public ngOnChanges (changes: SimpleChanges) {
		// changes.prop contains the old and the new value...
		const currentFilter = _.get(changes, ['assetFilter', 'currentValue']);
		if (currentFilter && !changes.assetFilter.firstChange) {
			this.syslogsParams = {
				asset: this.assetFilter.asset,
				catalog: this.assetFilter.catalog,
				customerId: this.customerId,
				days: this.assetFilter.timeRange,
				pageNo: this.pageNum,
				search: this.searchVal,
				severity: this.assetFilter.severity,
				size: this.pagerLimit,
			};
			this.getAssetData();
		}

	}
	/**
	 * initilize grid and graph
	 * @returns grid and graph data
	 */
	public ngOnInit () {
		this.deviceGridInit();
		this.getAssetData();
	}
	/**
	 * Devices grid init
	 */
	public deviceGridInit () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			dynamicData: false,
			singleSelect: true,
			// tslint:disable-next-line: object-literal-sort-keys
			columns: [
				{
					key: 'DeviceHost',
					name: I18n.get('_Assets_'),
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
				{
					key: 'syslogCount',
					name: I18n.get('_SyslogUniqueSyslogCount_'),
					sortable: true,
				},
			],
		});
	}

	/**
	 * Gets asset data
	 */
	public getAssetData () {
		// tslint:disable-next-line: ban-comma-operator
		this.gridSubscripion = this.syslogsService
			.getDeviceGridData(this.syslogsParams)
			.pipe(takeUntil(this.destroy$))
			.subscribe(gridData => {
				this.tableData = gridData.responseData;
				this.totalItems = gridData.responseData.length;
			}),
			catchError(err => {
				this.logger.error('syslogs-devices.component : getDeviceGridData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			});
	}
	/**
	 * Determines whether table row selection on
	 * @param tableRowData contains table row data
	 */
	public onTableRowSelection (tableRowData: any) {
		if (tableRowData.active) {
			this.selectedAsset = tableRowData;
		} else {
			this.selectedAsset = undefined;
		}

		this.sysLogHeaderDetails(tableRowData, this.customerId);
	}

	/**
	 * Sys log header details
	 * @param tableRowData contains row data
	 * @param customerId contains customerid
	 */
	public sysLogHeaderDetails (tableRowData, customerId) {
		this.syslogsService.getDeviceHeaderDetails(tableRowData, customerId)
		.subscribe(data => {
			this.deviceHeaderValues = data;
			if (this.deviceHeaderValues.lastScan === null) {
				this.notScaned = false;
			}
			if (this.deviceHeaderValues.serialNumber === '' || this.deviceHeaderValues.serialNumber === null) {
				this.serialNumberStatus = false;
			}
		});
	}
	/**
	 * Determines whether panel close on
	 */
	public onPanelClose () {
		this.selectedAsset = undefined;
		this.showAssetPanel = false;
		this.showAsset360 = false;
	}
	/**
	 * Determines whether pager updated on
	 * @param pageInfo contains page info
	 */
	public onPagerUpdated (pageInfo: any) {
		this.tableOffset = pageInfo.page;
	}
	/**
	 * Redirects to asset360
	 */
	public redirectToAsset360 () {
		this.showAsset360 = true;
	}
	/**
	 * Searchs all
	 * @param event contains seach input data
	 */
	public searchAll (event) {
		if (event.keyCode === 13) {
			this.syslogsParams.search = this.searchVal;
			this.getAssetData();
		}
	}
	/**
	 * on destroy
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
