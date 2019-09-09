import {
	Component,
	OnInit,
	OnDestroy,
	ViewChild,
	TemplateRef,
	OnChanges,
	SimpleChanges,
	Input,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { SyslogsService, SyslogGridData, SyslogFilter } from '@sdp-api';
import { Subject, of, Subscription } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';

/**
 * syslog Component
 */
@Component({
	selector: 'syslogs-details',
	styleUrls: ['./syslogs-messages.component.scss'],
	templateUrl: './syslogs-messages.component.html',
})
export class SyslogsMessagesComponent implements OnInit, OnChanges, OnDestroy {
	@Input() public sysFilter;
	public customerId;
	public countSubscripion: Subscription;
	public gridSubscripion: Subscription;
	public totalSyslogsCount = { };
	public tableOptions: CuiTableOptions;
	public tableLimit = 10;
	public pagerLimit = 10;
	public tableOffset = 0;
	public loading = false;
	public totalItems = 0;
	public tableData: SyslogGridData[] = [];
	public pageLimit = 10;
	public pageNum = 1;
	public msgInclude = '';
	public msgExclude = '';
	public lastMsgType;
	public selectedAsset;
	public showAssetPanel = false;
	public fullscreen = false;
	public searchVal = '';
	public tableStartIndex = 0;
	public tableEndIndex = 10;
	public showAssetDetails = false;
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
			catalog: 'Cisco',
			customerId: this.customerId,
			days: 1,
			pageNo: this.pageNum,
			severity: 3,
			size: this.pageLimit,
		};
	}
	/**
	 * grid column template of syslogs grid
	 */
	@ViewChild('icdecTemplate', { static: true }) private icDecTemplate: TemplateRef<any>;
	@ViewChild('actionTemplate', { static: true }) private actionTemplate: TemplateRef<any>;
	public filters: SyslogFilter[];
	public filtered = false;
	public allAssetsSelected = false;
	public status = {
		inventoryLoading: true,
		isLoading: true,
	};
	public syslogsParams: SyslogsService.GetSyslogsParams = {
		customerId: this.customerId,
		pageNo: this.pageNum,
		size: this.pageLimit,
	};
	public selected;
	public destroy$ = new Subject();
	/**
	 * on changes
	 * @param changes contains filterobj
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentFilter = _.get(changes, ['sysFilter', 'currentValue']);
		if (currentFilter && !changes.sysFilter.firstChange) {
			this.syslogsParams = {
				catalog: currentFilter.catalog,
				customerId: this.customerId,
				days: currentFilter.timeRange,
				excludeMsgType: this.msgExclude.toUpperCase(),
				includeMsgType: this.msgInclude.toUpperCase(),
				pageNo: this.pageNum,
				search: this.searchVal,
				severity: currentFilter.severity,
				size: this.pageLimit,
			};
			this.getSyslogsData();
		}

	}
	/**
	 * initilize grid and graph
	 * @returns grid and graph data
	 */
	public ngOnInit () {
		this.messageGridInit();
		this.getSyslogsData();
	}
	/**
	 * Messages grid init
	 */
	public messageGridInit () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'MsgType',
					name: I18n.get('_SyslogMessageGrid_'),
					sortable: true,
				},
				{
					key: 'SyslogSeverity',
					name: I18n.get('_Severity_'),
					sortable: true,
				},
				{
					key: 'IcDesc',
					name: I18n.get('_SyslogDetailedDescription_'),
					sortable: true,
					template: this.icDecTemplate,

				},
				{
					key: 'Recommendation',
					name: I18n.get('_SyslogRecommendation_'),
					sortable: true,
					template: this.actionTemplate,
				},
				{
					key: 'deviceCount',
					name: I18n.get('__SyslogDeviceCount__'),
					sortable: true,
				},
			],
			dynamicData: false,
			singleSelect: true,
			striped: false,
		});
	}

	/**
	 * Gets syslogs data
	 */
	public getSyslogsData () {
		this.loading = true;
		this.tableData = [];
		this.gridSubscripion = this.syslogsService
			.getGridData(this.syslogsParams)
			.pipe(
				catchError(err => {
					this.logger.error('syslogs-details.component : getDeviceGridData() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of([]);
				}),
				takeUntil(this.destroy$),
			)
			.subscribe(gridData => {
				this.tableData = gridData;
				this.totalItems = gridData.length;
				this.tableEndIndex = 10;
				if (this.tableEndIndex > this.totalItems) {
					this.tableEndIndex = this.totalItems ;
				}
			}, catchError(err => {
				this.logger.error('syslogs-details.component : getDeviceGridData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}));
		this.loading = false;
	}

	/**
	 * Keys down function
	 * @param event contains eventdata
	 */
	public keyDownFunction (event) {
		if (event.keyCode === 13) {
			this.syslogsParams.includeMsgType = this.msgInclude.toUpperCase();
			this.syslogsParams.excludeMsgType = this.msgExclude.toUpperCase();
			this.syslogsParams.search = this.searchVal;
			this.getSyslogsData();
		}
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
		this.showAssetPanel = false;
		this.showAssetDetails = false;
	}
	/**
	 * Determines whether pager updated on
	 * @param pageInfo contains page info
	 */
	public onPagerUpdated (pageInfo: any) {
		this.tableOffset = pageInfo.page;
		this.tableStartIndex = (pageInfo.page * pageInfo.limit);
		this.tableEndIndex = (pageInfo.page * pageInfo.limit) + 10 ;
		if (this.tableEndIndex > this.totalItems) {
			this.tableEndIndex = this.totalItems ;
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
