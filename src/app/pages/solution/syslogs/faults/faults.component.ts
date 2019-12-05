import { Component, OnInit, TemplateRef,
	ViewChild, Input, OnChanges,
	SimpleChanges, OnDestroy } from '@angular/core';
import { FaultService, FaultSearchParams,
	FaultGridData, RacetrackSolution,
	RacetrackTechnology, FaultResponse,
} from '@sdp-api';
import { UserResolve } from '@utilities';
import { takeUntil, catchError, map } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { I18n } from '@cisco-ngx/cui-utils';
import { CuiTableOptions, CuiToastComponent } from '@cisco-ngx/cui-components';
import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
import { RacetrackInfoService } from '@services';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * FaultsComponent which shows in Insight view for Fault Management
 *
 * @export
 * @class FaultsComponent
 */
@Component({
	selector: 'app-faults',
	styleUrls: ['./faults.component.scss'],
	templateUrl: './faults.component.html',
})
export class FaultsComponent implements OnInit, OnChanges, OnDestroy {

	@Input('faultFilter') public faultFilter;

	public searchParams: FaultSearchParams;
	private destroy$ = new Subject();
	public tableOptions: CuiTableOptions;
	public tableData: FaultGridData[];
	public tableLimit = 10;
	public tableOffset = 0;
	public loading = false;
	public totalCount = 0;
	public paginationCount;
	public connectionStatus: string;
	public fault: FaultGridData;
	public showFaultDetails = false;
	public lastUpdateTime: string;
	public lastUpdateDate: string;
	public offlineTime: string;
	public alert: any = { };
	public searchOptions = {
		debounce: 1500,
		max: 100,
		min: 0,
	};
	public FAULT_CONSTANT = {
		ACTIVE: 'active',
		DETECTED: 'Detected',
		INACTIVE: 'inactive',
	};

	@ViewChild('severityColors', { static: true }) public severityColorsTemplate: TemplateRef<{ }>;
	@ViewChild(CuiToastComponent, { static: true }) public toasts: CuiToastComponent;

	constructor (
		private logger: LogService,
		private faultService: FaultService,
		private userResolve: UserResolve,
		private racetrackInfoService: RacetrackInfoService,
	) {
		this.searchParams = Object.create({ });
		this.userResolve.getCustomerId()
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe((id: string) => {
				this.searchParams.customerId = id;
			});
		this.searchParams.pageNo = 1;
		this.searchParams.tacEnabled = this.FAULT_CONSTANT.ACTIVE;
	}

	/**
	 * On load this method will be called
	 */
	public ngOnInit () {
		this.racetrackInfoService.getCurrentSolution()
		.pipe(takeUntil(this.destroy$))
		.subscribe((solution: RacetrackSolution) => {
			this.searchParams.solution = _.get(solution, 'name');
		});

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(takeUntil(this.destroy$))
		.subscribe((technology: RacetrackTechnology) => {
			this.searchParams.useCase = _.get(technology, 'name');
			this.getFaultData(this.searchParams);
		});

		this.buildTable();
	}

	/**
	 * On changes this method will be called
	 * @param changes SimpleChanges
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentFilter = _.get(changes, ['faultFilter', 'currentValue']);
		const firstChange = _.get(changes, ['faultFilter', 'firstChange']);
		if (currentFilter && !firstChange) {
			this.searchParams.tacEnabled =
				(currentFilter.faults === this.FAULT_CONSTANT.DETECTED)
				? this.FAULT_CONSTANT.INACTIVE : this.FAULT_CONSTANT.ACTIVE;
			this.searchParams.faultSeverity = currentFilter.afmSeverity;
			this.searchParams.days = currentFilter.timeRange;
			this.resetPage();
			this.getFaultData(this.searchParams);
		}
	}

	private resetPage () {
		this.searchParams.pageNo = 1;
		this.tableOffset = 0;
	}

	/**
	 * Will construct the Fault table
	 */
	private buildTable () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					name: I18n.get('_FaultSeverity_'),
					sortable: true,
					template: this.severityColorsTemplate,
				},
				{
					key: 'category',
					name: I18n.get('_FaultCategory_'),
					sortable: true,
				},
				{
					key: 'title',
					name: I18n.get('_FaultTitle_'),
					sortable: true,
				},
				{
					key: 'systemCount',
					name: I18n.get('_FaultAffectedSystems_'),
					sortable: true,
				},
				{
					key: 'tacCount',
					name: I18n.get('_FaultCreatedCases_'),
					sortable: true,
				},
			],
			dynamicData: true,
			hover: true,
			padding: 'loose',
			selectable: false,
			singleSelect: true,
			sortable: true,
			striped: false,
		});
	}

	/**
	 * it will retrive the All alarmds records only
	 *
	 * @param searchParams FaultSearchParams
	 */
	public getFaultData (searchParams: FaultSearchParams) {
		this.loading = true;
		this.faultService.getFaultDetails(searchParams)
			.pipe(takeUntil(this.destroy$),
			map((response: FaultResponse) => {
				this.totalCount = response.count;
				this.connectionStatus = response.afmStatus;
				this.lastUpdateTime = response.lastUpdateTime;
				this.lastUpdateDate = response.lastUpdateDate;
				this.offlineTime = response.offlineTime;
				this.tableData = response.responseData;
				this.preparePaginationHeader();
				this.loading = false;
			}),
			catchError((err: HttpErrorResponse)  => {
				this.loading = false;
				_.invoke(this.alert, 'show',  I18n.get('_FaultGenericError_'), 'danger');
				this.logger.error(
					'FaultsComponent : getFaultData() ' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}))
			.subscribe();
	}

	/**
	 * This will sort the records absed on column
	 *
	 * @param event - click event CuiTableOptions column info
	 * @memberof FaultsComponent
	 */
	public onTableSortingChanged (event) {
		this.searchParams.sortField = this.getSortKey(event.name);
		this.searchParams.sortOrder = event.sortDirection;
		this.getFaultData(this.searchParams);
	}

	private getSortKey = sortKey => {
		switch (sortKey) {
			case 'Severity':
				return 'faultSeverity';
			case 'Category':
				return 'category';
			case 'Title':
				return 'title';
			case 'Systems Affected':
				return 'systemCount';
			case 'Created Cases':
				return 'tacCount';
			default:
				return 'title';
		}
	}

	/**
	 * Create alarm panel and create table
	 * @param fault Fault data
	 * @memberof FaultsComponent
	 */
	public connectToFaultDetails (fault) {
		this.fault = fault;
		this.showFaultDetails = true;
	}

	/**
	 * it will call at the time of pagination click
	 * @param pageInfo Pagination
	 * @memberof FaultsComponent
	 */
	public onPagerUpdated (pageInfo) {
		this.searchParams.pageNo = pageInfo.page + 1;
		this.tableOffset = pageInfo.page;
		this.searchParams.size = this.tableLimit;
		this.getFaultData(this.searchParams);
	}

	/**
	 * it will prepare Pagination header to show from which to which records showing
	 */
	private preparePaginationHeader () {
		if (this.totalCount !== 0) {
			const tableStartIndex = (this.tableLimit * (this.searchParams.pageNo - 1)) + 1;
			let tableEndIndex = (this.tableLimit * this.searchParams.pageNo);
			if (tableEndIndex > this.totalCount) {
				tableEndIndex = this.totalCount;
			}
			this.paginationCount = `${tableStartIndex}-${tableEndIndex}`;
		} else {
			this.paginationCount = '0-0';
		}
	}

	/**
	 * Close fault panel
	 */
	public onFaultPanelClose () {
		this.showFaultDetails = false;
	}

	/**
	 * Update on search
	 * @param event search text
	 */
	public onSearchUpdate (event) {
		this.resetPage();
		this.searchParams.localSearch = event;
		this.getFaultData(this.searchParams);
	}

	/**
	 * Success toast
	 * @param event event
	 */
	public onShowSuccess (event) {
		this.toasts.autoHide = 3000;
		this.toasts.addToast('success', 'Event Type:',
		I18n.get('_FaultXSuccess_', event.icName) +
		I18n.get('_FaultsYMoved_', event.tacEnable));
		this.getFaultData(this.searchParams);
	}

	/**
	 * OnDestroy Lifecycle Hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
