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
import { SyslogsService, SyslogDeviceData, SyslogDeviceDetailsdata, SyslogFilter } from '@sdp-api';
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
	public severity = 7;
	public timeRange = 1;
	public catalog = '';
	public selectedAsset;
	public showAsset360 = false;
	public fullscreen = false;
	public assetType = '';
	public filters: SyslogFilter[];
	public searchVal = '';
	public syslogsParams: SyslogsService.GetSyslogsParams = {
		customerId: this.customerId,
		pageNo: this.pageNum,
		size: this.pagerLimit,
	};
	public selected;
	public destroy$ = new Subject();
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
			catalog: '',
			customerId: this.customerId,
			days: 1,
			pageNo: this.pageNum,
			severity: 7,
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
					name: I18n.get('_UniqueSyslogCount_'),
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

	}

	/**
	 * Determines whether panel close on
	 */
	public onPanelClose () {
		this.selectedAsset = undefined;
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
	 * on destroy
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
