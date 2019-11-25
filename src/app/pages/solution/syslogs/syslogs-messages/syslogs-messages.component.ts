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
import { SyslogsService, SyslogGridData, SyslogFilter, SyslogFullResponse } from '@sdp-api';
import { Subject, of, Subscription } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';
import { DetailsPanelStackService } from '@services';

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
	@Input() public solution;
	@Input() public useCase;
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
	public syslogGridResponse: SyslogFullResponse;
	public tableData: SyslogGridData[] = [];
	public pageLimit = 10;
	public pageNum = 1;
	public selectedAsset;
	public showAssetPanel = false;
	public fullscreen = false;
	public searchVal = '';
	public tableStartIndex = 0;
	public tableEndIndex = 10;
	public showAssetDetails = false;
	public sortField = 'timeStamp';
	public sortOrder = 'asc';
	public movetoAfmClicked = false;
	public moveToFaultParams = { };
	constructor (
		private logger: LogService,
		public syslogsService: SyslogsService,
		private userResolve: UserResolve,
		private detailsPanelStackService: DetailsPanelStackService,
		) {
		this.userResolve.getCustomerId()
		.pipe(
		takeUntil(this.destroy$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
		});
		this.syslogsParams = {
			contractLevel: '',
			customerId: this.customerId,
			days: 1,
			localSearch: '',
			pageNo : 1,
			size : 10,
			solution: this.solution,
			sortField: this.sortField,
			sortOrder : this.sortOrder,
			syslogSeverity : 0,
			systemFilter: '',
			useCase: this.useCase,
			vaId: '',
		};
	}
	/**
	 * grid column template of syslogs grid
	 */
	@ViewChild('severityColors', { static: true }) public severityColorsTemplate: TemplateRef<{ }>;
	@ViewChild('dateFilter', { static: true }) public dateFilterTemplate: TemplateRef<{ }>;
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
			this.syslogsParams.syslogSeverity = currentFilter.severity;
			this.syslogsParams.days = currentFilter.timeRange;
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
					key: 'syslogSeverity',
					name: I18n.get('_Severity_'),
					sortable: true,
					template: this.severityColorsTemplate,
				},
				{
					key: 'msgDesc',
					name: I18n.get('_SyslogsEventMessage_'),
					sortable: true,
				},
				{
					key: 'deviceHost',
					name: I18n.get('_SyslogSystem_'),
					sortable: true,

				},
				{
					name: I18n.get('_SyslogsDate_'),
					sortable: true,
					template: this.dateFilterTemplate,
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
			.pipe(takeUntil(this.destroy$))
			.subscribe(gridData => {
				this.tableData = gridData.responseData;
				this.totalItems = gridData.count;
				this.tableEndIndex = 10;
				if (this.tableEndIndex > this.totalItems) {
					this.tableEndIndex = this.totalItems;
				}
				this.loading = false;
			}, catchError(err => {
				this.loading = false;
				this.logger.error('syslogs-details.component : getGridData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}));
	}

	/**
	 * Keys down function
	 * @param event contains eventdata
	 */
	public keyDownFunction (event) {
		if (event.keyCode === 13) {
			this.syslogsParams.localSearch = this.searchVal;
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
		this.detailsPanelStackService.reset();
		_.set(this.selectedAsset, 'active', false);
		this.selectedAsset = undefined;
		this.showAssetPanel = false;
		this.showAssetDetails = false;
	}

	/**
	 * Handles the hidden event from details-panel
	 * @param hidden false if details slideout is open
	 */
	public handleHidden (hidden: boolean) {
		if (hidden) {
			this.onPanelClose();
		}
	}

	/**
	 * Determines whether pager updated on
	 * @param pageInfo contains page info
	 */
	public onPagerUpdated (pageInfo: any) {
		this.tableOffset = pageInfo.page;
		this.tableStartIndex = (pageInfo.page * pageInfo.limit);
		this.tableEndIndex = (pageInfo.page * pageInfo.limit) + 10;
		this.getSyslogsData();
	}
	/**
	 * this will sort the records absed on column
	 *
	 * @param event - click event CuiTableOptions column info
	 * @memberof SyslogsMessageComponent
	 */
	public onTableSortingChanged (event) {
		this.sortField = this.getSortKey(event.name);
		this.sortOrder = event.sortDirection;
		this.getSyslogsData();
	}

	private getSortKey = sortKey => {
		switch (sortKey) {
			case 'Severity':
				return 'syslogSeverity';
			case 'Event Message':
				return 'msgDesc';
			case 'Systems':
				return 'deviceHost';
			case 'Date and Time':
				return 'timestamp';
			default:
				return 'syslogSeverity';
		}
	}

	/**
	 * toggles add note section
	 */
	public toggleAddNote () {
		this.movetoAfmClicked = !this.movetoAfmClicked;
	}
	/**
	 * on destroy
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
