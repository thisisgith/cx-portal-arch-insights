import { Component, TemplateRef, ViewChild } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { I18n } from '@cisco-ngx/cui-utils';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import {
	Alarm,
	AfmSearchParams,
	AfmPagination,
	AfmService,
	AfmConnectivity,
	AfmFilter,
	AfmResponse,
} from '@sdp-api';
import * as _ from 'lodash-es';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserResolve } from '@utilities';
import { takeUntil } from 'rxjs/operators';

/**
 * AfmComponet which shows in Insight view for Fault Management tab
 *
 * @export
 * @class AfmComponent
 */
@Component({
	selector: 'app-afm',
	styleUrls: ['./afm.component.scss'],
	templateUrl: './afm.component.html',
})
export class AfmComponent {

	public showAlarmDetails = false;
	public selectedAsset: Alarm;
	public syslogEvent: string;
	public filters: AfmFilter[];
	public ignoreStatus: string;
	private alarmInfo: Alarm;
	public searchParams: AfmSearchParams;
	public pagination: AfmPagination;
	public afmSearchInput = '';
	public afmConnectionStatus: AfmConnectivity;
	public search: FormControl = new FormControl('');
	public searchForm: FormGroup;
	public filtered = true;
	public fullscreen = false;
	public tableOptions: CuiTableOptions;
	public tableLimit = 10;
	public tableOffset = 0;
	public loading: boolean;
	public tableData: Alarm[] = [];
	public tablePanelData: Alarm;
	private destroyed$: Subject<void> = new Subject<void>();
	public paginationCount;
	public aggregationCount: Map<string, number> = new Map();
	public statusErrorMessage = '';
	private destroy$ = new Subject();

	public searchOptions = {
		debounce: 1500,
		max: 100,
		min: 0,
	};

	private AFM_CONSTANT = {
		ALARM: 'ALARM',
		CHATS: 'CHATS',
		DAY1: 'Day1',
		DAYS30: 'Days30',
		DAYS7: 'Days7',
		DAYS90: 'Days90',
		EXCEPTION: 'Exception',
		FAIL: 'FAIL',
		IGNORE_EVENT: 'IGNORE_EVENT',
		SEARCH: 'SEARCH',
		SUCCESS: 'SUCCESS',
		TAC: 'TAC',
	};

	public headerCount = {
		totalAlarmCount: 0,
		totalIgnoreEventCount: 0,
		totalTacCaseCount: 0,
	};

	@ViewChild('timeRangeFilter', { static: true }) private timeRangeFilterTemplate:
		TemplateRef<{ }>;
	@ViewChild('faultICTemplate', { static: true }) private faultICTemplate: TemplateRef<{ }>;
	@ViewChild('syslogTemplate', { static: true }) private syslogTemplate: TemplateRef<{ }>;
	@ViewChild('severityColors', { static: true }) public severityColorsTemplate: TemplateRef<{ }>;
	@ViewChild('dateFilterPipe', { static: true }) public dateFilterTemplate: TemplateRef<{ }>;

	constructor (private logger: LogService,
		private afmService: AfmService,
		private userResolve: UserResolve) {
		this.logger.debug('AFM Component Created!');
		this.searchParams = new Object();
		this.searchParams.pageNumber = 1;
		this.searchParams.pageSize = this.tableLimit;
		this.searchParams.firstTimeLoading = true;
		this.searchParams.headerFilterType = this.AFM_CONSTANT.ALARM;
		this.userResolve.getCustomerId()
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe((id: string) => {
				this.searchParams.customerId = id;
			});
		if (!this.searchParams.customerId) {
			this.searchParams.customerId = '7293498';
		}
	}

	/**
	 * Returns the built actions
	 * @returns the actions
	 */
	public dropdownActions: Object = [
		{
			label: I18n.get('_AfmExportAll_'),
			onClick: () => this.exportAllEvents(),
		},
	];

	private getSortKey = sortKey => {
		switch (sortKey) {
			case 'Syslog Event':
				return 'syslogMsg.keyword';
			case 'Fault IC':
				return 'faultIC.keyword';
			case 'Serial Number':
				return 'serialNumber.keyword';
			case 'Event Severity':
				return 'severity.keyword';
			case 'Case ID':
				return 'tacCaseNo.keyword';
			case 'Time Created':
				return 'alarmCreated';
			case 'Event Status':
				return 'status.keyword';
			default:
				return 'alarmId';
		}
	}

	/**
	 * On load of Document it will call
	 */
	public ngOnInit () {
		this.buildTable();
		this.getAfmAlarmData(this.searchParams);
	}

	/**
	 * Builds filters
	 */
	private buildFilters () {
		this.filters = [
			{
				key: 'timeRange',
				loading: true,
				seriesData: [],
				template: this.timeRangeFilterTemplate,
				title: I18n.get('_AfmTimeRange_'),
			},
		];
		this.loadTimeRangeData();
	}

	/**
	 * Will construct the Alarm table
	 */
	private buildTable () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					name: I18n.get('_AfmSeverity_'),
					sortable: true,
					template: this.severityColorsTemplate,
				},
				{
					name: I18n.get('_AfmSyslogEvent_'),
					sortable: true,
					template: this.syslogTemplate,
				},
				{
					name: I18n.get('_AfmFaultIC_'),
					sortable: true,
					template: this.faultICTemplate,
				},
				{
					key: 'serialNumber',
					name: I18n.get('_AfmSerialNumber_'),
					sortable: true,
				},
				{
					key: 'tacCaseNo',
					name: I18n.get('_AfmCaseId_'),
					sortable: true,
				},
				{
					name: I18n.get('_AfmTimeCreated_'),
					sortable: true,
					template: this.dateFilterTemplate,
				},
				{
					key: 'status',
					name: I18n.get('_AfmStatus_'),
					sortable: true,
				},
			],
			dynamicData: true,
			hover: true,
			padding: 'loose',
			selectable: false,
			singleSelect: true,
			sortable: true,
			striped: true,
			updateParams: false,
			wrapText: false,
		});
		this.searchForm = new FormGroup({
			search: this.search,
		});
	}

	/**
	 * Retriving the Alarm data from server
	 * @param searchParams AfmSearchParams
	 * @memberof AfmComponent
	 */
	private getAfmAlarmData (searchParams: AfmSearchParams) {
		this.loading = true;
		this.afmService.getAfmAlarms(searchParams)
			.pipe(takeUntil(this.destroy$))
			.subscribe(response => {
				this.prepareGridData(response);
			},
			);
	}

	/**
	 * Retriving Alarm data from server for panel
	 * @param alarmData Alarm
	 * @memberof AfmComponent
	 */
	private getAfmEventData (alarmData: AfmSearchParams) {
		this.afmService.getAfmEvents(alarmData)
			.pipe(takeUntil(this.destroy$))
			.subscribe(response => {
				this.tablePanelData = response.eventInfo;
				this.ignoreStatus = null;
			});
	}

	/**
	 * Retriving the Alarm data from server
	 * @param searchParams AfmSearchParams
	 * @memberof AfmComponent
	 */
	private getAfmTacCaseData (searchParams: AfmSearchParams) {
		this.loading = true;
		this.afmService.getTacCases(searchParams)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				response => {
					this.prepareGridData(response);
				});
	}

	/**
	 * Afm Search box functionality will retrive the results and populate in grid
	 * @param searchParams AfmSearchParams
	 * @memberof AfmComponent
	 */
	private getAfmSearchFilterInfo (searchParams: AfmSearchParams) {
		this.loading = true;
		this.afmService.getAfmSearchFilterInfo(searchParams)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				response => {
					this.prepareGridData(response);
				});
	}

	/**
	 * it will call at the time of pagination click
	 * @param pageInfo AfmPagination
	 * @memberof AfmComponent
	 */
	public onPagerUpdated (pageInfo: any) {
		// {page: 0, limit: 10}
		this.tableOffset = pageInfo.page;
		this.searchParams.pageNumber = pageInfo.page + 1;
		this.searchParams.pageSize = this.tableLimit;
		this.loadFilterdData();
	}

	/**
	 * it is a common private method for both pagination and sorting
	 *  it retrive data and show in grid
	 * @private
	 * @memberof AfmComponent
	 */
	private loadFilterdData () {
		switch (this.searchParams.headerFilterType) {
			case this.AFM_CONSTANT.TAC:
				this.getAfmTacCaseData(this.searchParams);
				break;
			case this.AFM_CONSTANT.SEARCH:
				this.getAfmSearchFilterInfo(this.searchParams);
				break;
			case this.AFM_CONSTANT.ALARM:
				this.getAfmAlarmData(this.searchParams);
				break;
			case this.AFM_CONSTANT.IGNORE_EVENT:
				this.getAfmAlarmData(this.searchParams);
				break;
			case this.AFM_CONSTANT.CHATS:
				this.afmTimeRangeFilter(this.searchParams);
				break;
			default:
				this.getAfmAlarmData(this.searchParams);
				break;
		}
	}

	/**
	 * it will retrive the All alarmds records only
	 */
	public allAlarmFilter () {
		this.resetValuesWhileFilter();
		this.searchParams.headerFilterType = this.AFM_CONSTANT.ALARM;
		this.searchParams.firstTimeLoading = true;
		this.getAfmAlarmData(this.searchParams);
	}

	/**
	 * it will retrive the TAC Case records only
	 */
	public tacCaseFilters () {
		this.resetValuesWhileFilter();
		this.searchParams.headerFilterType = this.AFM_CONSTANT.TAC;
		this.getAfmTacCaseData(this.searchParams);
	}

	/**
	 * it will retrive the Search records only
	 */
	public searchFilter () {
		const searchWord = this.afmSearchInput;
		if (!searchWord) {
			this.allAlarmFilter();
		} else {
			this.resetValuesWhileFilter();
			if (searchWord.toLowerCase()
				.startsWith('p')) {
				this.searchParams.searchTerm = searchWord.substring(1, 2);
			} else {
				this.searchParams.searchTerm = searchWord;
			}
			this.searchParams.headerFilterType = this.AFM_CONSTANT.SEARCH;
			this.getAfmSearchFilterInfo(this.searchParams);
		}
	}

	/**
	 * Sub filter
	 */
	public onSubfilterSelect () {
		this.tableData = [];
	}

	/**
	 * Keys down function
	 * Keycode 13 is for enter
	 * @param event contains eventdata
	 */
	public keyDownAfmSearchFilter (event) {
		if (event.keyCode === 13) {
			this.searchFilter();
		}
	}
	/**
	 * It will close the alarm panel
	 */
	public onAlarmPanelClose () {
		this.showAlarmDetails = false;
	}

	/**
	 * Create alarm panel and create table
	 * @param alarm alarmdata
	 */
	public connectToAlarmDetails (alarm: Alarm) {
		this.syslogEvent = alarm.syslogMsg;
		this.showAlarmDetails = true;
		this.selectedAsset = null;
		this.searchParams.alarmId = alarm.alarmId;
		this.getAfmEventData(this.searchParams);
	}

	/**
	 * which will call asset details componet
	 * @param alarm -- alarm info
	 * @memberof AfmComponent
	 */
	public connectToAssetDetails (alarm: Alarm) {
		this.selectedAsset = alarm;
	}

	/**
	 * to close the panel
	 */
	public onPanelClose () {
		this.selectedAsset = null;
	}

	/**
	 * Exoport events into CSV file need to implement
	 */
	private exportAllEvents () {
		_.filter(this.alarmInfo); // just dummy
	}

	/**
	 * this will sort the records absed on column
	 *
	 * @param event - click event CuiTableOptions column info
	 * @memberof AfmComponent
	 */
	public onTableSortingChanged (event: any) {
		this.searchParams.sortField = this.getSortKey(event.name);
		this.searchParams.sortType = event.sortDirection;
		this.loadFilterdData();
	}

	/**
	 * Load time range data
	 * @returns time range filter
	 */
	private loadTimeRangeData () {
		const timeRangeFilter = _.find(this.filters, { key: 'timeRange' });
		if (!this.aggregationCount) {
			return timeRangeFilter.seriesData = [];
		}

		return (timeRangeFilter.seriesData = [
			{
				filter: '1',
				label: I18n.get('_Afm24Hr_'),
				selected: false,
				value: this.aggregationCount[this.AFM_CONSTANT.DAY1],
			},
			{
				filter: '7',
				label: I18n.get('_Afm7Days_'),
				selected: false,
				value: this.aggregationCount[this.AFM_CONSTANT.DAYS7],
			},
			{
				filter: '30',
				label: I18n.get('_Afm30Days_'),
				selected: false,
				value: this.aggregationCount[this.AFM_CONSTANT.DAYS30],
			},
			{
				filter: '90',
				label: I18n.get('_Afm90Days_'),
				selected: false,
				value: this.aggregationCount[this.AFM_CONSTANT.DAYS90],
			},
		]);
	}

	/**
	 * time Range filter based on selected bar chart filter days range display data
	 *
	 * @param subfilter number of days
	 * @param filter AfmFilter
	 * @memberof AfmComponent
	 */
	public onTimeRangefilterSelect (subfilter: number, filter: AfmFilter) {
		this.resetValuesWhileFilter();
		const sub = _.find(filter.seriesData, { filter: subfilter });
		if (sub) {
			sub.selected = !sub.selected;
		}
		this.searchParams.headerFilterType = this.AFM_CONSTANT.CHATS;
		this.searchParams.noOfDaysFilter = subfilter;
		this.afmTimeRangeFilter(this.searchParams);
	}

	/**
	 * time Range filter based on filter days range display data
	 *
	 * @private
	 * @param searchParams AfmSearchParams need to pass
	 * @memberof AfmComponent
	 */
	private afmTimeRangeFilter (searchParams: AfmSearchParams) {
		this.loading = true;
		this.afmService.getTimeRangeFilteredEvents(searchParams)
			.pipe(takeUntil(this.destroy$))
			.subscribe(
				response => {
					this.prepareGridData(response);
				});
	}

	/**
	 * Ignore Event function
	 */
	public ignoreAlarmFilters () {
		this.resetValuesWhileFilter();
		this.searchParams.headerFilterType = this.AFM_CONSTANT.IGNORE_EVENT;
		this.getAfmAlarmData(this.searchParams);
	}

	/**
	 * it will prepare Pagination header to show from which to which records showing
	 */
	private preparePaginationHeader () {
		if (this.pagination.total !== 0) {
			const first = (this.tableLimit * (this.pagination.page - 1)) + 1;
			let last = (this.tableLimit * this.pagination.page);
			if (last > this.pagination.total) {
				last = this.pagination.total;
			}
			this.paginationCount = `${first}-${last}`;
		} else {
			this.paginationCount = '0-0';
		}
	}

	/**
	 * setting default values while filtering
	 */
	private resetValuesWhileFilter () {
		this.searchParams.pageSize = this.tableLimit;
		this.searchParams.pageNumber = 1;
		this.searchParams.searchTerm = '';
		this.searchParams.headerFilterType = this.AFM_CONSTANT.ALARM;
		this.tableOffset = 0;
	}

	/**
	 * it will prepare response for display data into grid
	 *
	 * @private
	 * @param  response AfmResponse
	 * @memberof AfmComponent
	 */
	private prepareGridData (response: AfmResponse) {
		if (response && response.status && response.status !== null) {
			if (response.status.toUpperCase() === this.AFM_CONSTANT.SUCCESS) {
				this.tableData = response.eventList;
				this.pagination = response.pagination;
				if (this.searchParams.firstTimeLoading) {
					/**
					 * first time loading we are setting the
					 * Banner part for Total Alarms Count
					 */
					this.headerCount = {
						totalAlarmCount: this.pagination.total,
						totalIgnoreEventCount: this.pagination.ignoredEventCount,
						totalTacCaseCount: this.pagination.totalTacCases,
					};
					this.searchParams.firstTimeLoading = false;
					if (response.connectionStatus !== null) {
						this.afmConnectionStatus = response.connectionStatus;
					}
					this.aggregationCount = response.aggregationsCount;
					this.buildFilters();
				}
			} else if (response.status.toUpperCase() === this.AFM_CONSTANT.FAIL) {
				this.tableData = response.eventList;
				this.pagination = response.pagination;
				this.statusErrorMessage = response.statusMessage;
			}
			this.preparePaginationHeader();
		} else {
			this.tableData = Array<Alarm>();
		}
		this.loading = false;
	}

	/** Function used to destroy the component */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

}