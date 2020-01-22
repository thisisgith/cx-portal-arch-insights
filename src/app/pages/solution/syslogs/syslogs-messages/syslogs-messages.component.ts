import {
	Component,
	OnInit,
	OnDestroy,
	ViewChild,
	TemplateRef,
	OnChanges,
	SimpleChanges,
	Input,
	Output,
	EventEmitter,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions, CuiToastComponent } from '@cisco-ngx/cui-components';
import { SyslogsService, SyslogGridData, SyslogFilter, SyslogResponseData } from '@sdp-api';
import { Subject, of, Subscription } from 'rxjs';
import { takeUntil, catchError, map } from 'rxjs/operators';
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
	@Input() public searchVal;
	@Output() public  searchUpdate = new EventEmitter();

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
	public syslogGridResponse: SyslogResponseData;
	public tableData: SyslogGridData[] = [];
	public pageLimit = 10;
	public pageNum = 1;
	public selectedAsset;
	public tableStartIndex = 0;
	public tableEndIndex = 10;
	public sortField = 'timeStamp';
	public sortOrder = 'desc';
	public alert: any = { };
	public showSyslogsDetails = false;
	public lastUpdateTime: string;

	@ViewChild(CuiToastComponent, { static: true }) public toasts: CuiToastComponent;
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
		const useCaseChange = _.get(changes, ['useCase', 'previousValue']);
		const clear = _.get(changes, ['clearSearch', 'currentValue']);

		if (currentFilter && !changes.sysFilter.firstChange) {
			this.syslogsParams.syslogSeverity = currentFilter.severity;
			this.syslogsParams.days = currentFilter.timeRange;
			this.syslogsParams.pageNo = 1;
			this.tableOffset = 0;
			this.getSyslogsData();
		}
		if (useCaseChange) {
			this.getSyslogsData();
		}
		if (clear === '') {
			this.searchVal = '';
		}
	}
	/**
	 * initilize grid and graph
	 * @returns grid and graph data
	 */
	public ngOnInit () {
		this.messageGridInit();
		this.getSyslogsData();
		this.searchVal = '';
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
					width: '10%',
				},
				{
					key: 'msgDesc',
					name: I18n.get('_SyslogsEventMessage_'),
					sortable: true,
					title: 'msgDesc',
					width: '55%',
				},
				{
					key: 'deviceHost',
					name: I18n.get('_SyslogSystem_'),
					sortable: true,
					width: '20%',

				},
				{
					name: I18n.get('_SyslogsDate_'),
					sortable: true,
					template: this.dateFilterTemplate,
					width: '15%',
				},

			],
			dynamicData: true,
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
			.pipe(takeUntil(this.destroy$),
			  map((gridData: SyslogResponseData) => {
				this.tableData = gridData.responseData;
				this.totalItems = gridData.count;
				this.lastUpdateTime = gridData.lastUpdateTime;
				this.tableStartIndex = (this.tableOffset * 10) + 1;
				this.tableEndIndex = (this.tableLimit * this.syslogsParams.pageNo);
				if (this.tableEndIndex > this.totalItems) {
					this.tableEndIndex = this.totalItems;
				}
				this.loading = false;
			}), catchError(err => {
				this.loading = false;
				_.invoke(this.alert, 'show',  I18n.get('_SyslogsGenericError_'), 'danger');
				this.logger.error('syslogs-details.component : getGridData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}))
			.subscribe();
	}

	/**
	 * Keys down function
	 * @param event contains eventdata
	 */
	public keyDownFunction (event) {
		if (event.keyCode === 13) {
			this.searchUpdate.emit(this.searchVal);
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
		this.showSyslogsDetails = true;
	}
	/**
	 * Determines whether pager updated on
	 * @param pageInfo contains page info
	 */
	public onPagerUpdated (pageInfo: any) {
		this.tableOffset = pageInfo.page;
		this.tableStartIndex = (pageInfo.page * pageInfo.limit);
		this.tableEndIndex = (pageInfo.page * pageInfo.limit) + 10;
		this.syslogsParams.pageNo = pageInfo.page + 1;
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
		this.syslogsParams.sortField = this.sortField;
		this.syslogsParams.sortOrder = event.sortDirection;
		this.syslogsParams.pageNo = 1;
		this.tableOffset = 0;
		this.getSyslogsData();
	}

	private getSortKey = sortKey => {
		switch (sortKey) {
			case 'Severity':
				return 'syslogSeverity';
			case 'Event Message':
				return 'syslogMsgDesc';
			case 'System':
				return 'deviceHost';
			case 'Date and Time':
				return 'timeStamp';
			default:
				return 'syslogSeverity';
		}
	}
	/**
	 * Close syslogs panel
	 */
	public onSyslogPanelClose () {
		this.showSyslogsDetails = false;
	}

	/**
	 * Success toast
	 * @param event event
	 */
	public onShowSuccess (event) {
		this.toasts.autoHide = 3000;
		this.toasts.addToast('success', 'Event Type:',
		I18n.get('_SyslogSuccessMessage_', event));
	}
	/**
	 * on destroy
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
