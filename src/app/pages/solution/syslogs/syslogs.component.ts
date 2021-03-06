import {
	Component,
	OnInit,
	OnDestroy,
	ViewChild,
	TemplateRef,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { SyslogsService,
		SyslogGridData,
		SyslogFilter,
	 	RacetrackSolution,
	 	RacetrackTechnology,
		SyslogsSeverity,
		SyslogsTimeRange,
		FaultSeverity,
		FaultState,
		SyslogsSeverityResponse,
		SyslogsTimeRangeResponse,
		FaultSeverityResponse,
		FaultStateResponse,
	} from '@sdp-api';
import { Subscription, Subject, forkJoin, of } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';
import { RacetrackInfoService } from '@services';

/**
 * syslog Component
 */
@Component({
	selector: 'app-syslogs',
	styleUrls: ['./syslogs.component.scss'],
	templateUrl: './syslogs.component.html',
})
export class SyslogsComponent implements OnInit, OnDestroy {
	constructor (
		private logger: LogService,
		public syslogsService: SyslogsService,
		private userResolve: UserResolve,
		private racetrackInfoService: RacetrackInfoService,
	) {
		this.userResolve.getCustomerId()
			.pipe(
			takeUntil(this.destroy$),
			)
			.subscribe((id: string) => {
				this.customerId = id;
			});

	}
	get selectedFilters () {
		return _.filter(this.filters, 'selected');
	}
	public customerId;
	public countSubscripion: Subscription;
	public totalSyslogsCount = { };
	public tableOptions: CuiTableOptions;
	public loading = false;
	public totalItems = 0;
	public tableData: SyslogGridData[] = [];
	public pageLimit = 10;
	public pageNum = 1;
	public severity = 3;
	public timeRange = 1;
	public solution = '';
	public useCase = '';
	public title = '';
	public faultFlag = true;
	public view: 'syslogMessage' | 'syslogAsset' = 'syslogMessage';
	public countParams = { };
	public searchQueryInGrid: string;
	public appliedFilters = {
		afmSeverity: '',
		faults : 'Automated',
		severity: 0,
		timeRange: 1,
	};
	public noSyslogFilter = false;
	public alert: any = { };
	public syslogSeverityCount: SyslogsSeverity;
	public syslogTimeRangeCount: SyslogsTimeRange;
	public faultSeverityCount: FaultSeverity;
	public faultStateCount: FaultState;
	public faultTimeRangeCount: SyslogsTimeRange;

	/**
	 * Visual filters  of syslogs component
	 */
	@ViewChild('timeRangeFilter', { static: true })
	private timeRangeFilterTemplate: TemplateRef<{ }>;
	@ViewChild('faultsFilter', { static: true })
	private faultsFilterTemplate: TemplateRef<{ }>;
	@ViewChild('severityFilter', { static: true })
	private severityFilterTemplate: TemplateRef<{ }>;
	@ViewChild('afmSeverityFilter', { static: true })
	private afmSeverityFilterTemplate: TemplateRef<{ }>;
	public filters: SyslogFilter[];
	public filtered = false;
	public allAssetsSelected = false;
	public status = {
		inventoryLoading: true,
		isLoading: true,
	};
	public syslogsParams: SyslogsService.GetSyslogsParams = {
		afmSeverityList: [''],
		customerId: this.customerId,
		faultsList: ['Automated'],
		pageNo: this.pageNum,
		severityList : ['0'],
		size: this.pageLimit,
		timeRange: ['1'],

	};
	public selected;
	public visualLabels: any = [
		{
			active: true, count: '',
			label: I18n.get('_SyslogsAfm_'),
			route: 'Exceptions'},
		{
			active: false, count: '',
			label: I18n.get('_Syslogs_'),
			route: 'AssetsWithExceptions' },
	];
	private destroy$ = new Subject();
	/**
	 * initilize grid and graph
	 * @returns grid and graph data
	 */
	public ngOnInit () {
		this.racetrackInfoService.getCurrentSolution()
		.subscribe((solution: RacetrackSolution) => {
			this.solution = _.get(solution, 'name');
		});
		this.racetrackInfoService.getCurrentTechnology()
		.subscribe((technology: RacetrackTechnology) => {
			this.useCase = _.get(technology, 'name');
			this.clearFilters();
			this.fetchSyslogsCount();
		});
	}

	/**
	 * Fetchs syslogs count
	 */
	public fetchSyslogsCount () {
		this.countParams = {
			contractLevel: '',
			customerId: this.customerId,
			solution: this.solution,
			useCase: this.useCase,
			vaId: '',

		};
		this.countSubscripion = this.syslogsService
			.getSyslogsCount(this.countParams)
			.pipe(takeUntil(this.destroy$),
			map((counts: any) => {
				this.totalSyslogsCount = counts;
				this.visualLabels[0].count = counts.faultsCount;
				this.visualLabels[1].count = counts.eventsCount;
			}),
			catchError(err => {
				_.invoke(this.alert, 'show',  I18n.get('_SyslogsGenericError_'), 'danger');
				this.logger.error('syslogs-devices.component : getDeviceGridData() ' +
						`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}))
			.subscribe();
	}

	/**
	 * Gets SyslogsSeverityCount
	 * @returns  the SyslogsSeverityCount data
	 */
	public fetchSyslogsSeverityCount () {
		return this.syslogsService
			.getSyslogSeverityData()
			.pipe(takeUntil(this.destroy$),
			map((counts: SyslogsSeverityResponse) => {
				this.syslogSeverityCount = counts.filterCounts;
				this.getSeverityCounts(counts.filterCounts);

			}),
			catchError(err => {
				_.invoke(this.alert, 'show',  I18n.get('_SyslogsGenericError_'), 'danger');
				this.logger.error('syslogs-devices.component : getDeviceGridData() ' +
						`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}));
	}

	/**
	 * Gets SyslogsTimeRangeCount
	 * @returns  the SyslogsTimeRangeCount data
	 */
	public fetchSyslogsTimeRangeCount () {
		return this.syslogsService
			.getSyslogTimeRangeData()
			.pipe(takeUntil(this.destroy$),
			map((counts: SyslogsTimeRangeResponse) => {
				this.syslogTimeRangeCount = counts.filterCounts;
				this.getTimeRangeCount(counts.filterCounts);

			}),
			catchError(err => {
				_.invoke(this.alert, 'show',  I18n.get('_SyslogsGenericError_'), 'danger');
				this.logger.error('syslogs-devices.component : getDeviceGridData() ' +
						`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}));
	}

	/**
	 * Gets FaultSeverityCount
	 * @returns  the FaultSeverityCount data
	 */
	public fetchFaultSeverityCount () {
		return this.syslogsService
			.getFaultSeverityData()
			.pipe(takeUntil(this.destroy$),
			map((counts: FaultSeverityResponse) => {
				this.faultSeverityCount = counts.filterCounts;
				this.getAfmSeverityCounts(counts.filterCounts);

			}),
			catchError(err => {
				_.invoke(this.alert, 'show',  I18n.get('_SyslogsGenericError_'), 'danger');
				this.logger.error('Fault-devices.component : getDeviceGridData() ' +
						`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}));
	}
	/**
	 * Gets FaultStateCount
	 * @returns  the FaultStateCount data
	 */
	public fetchFaultStateCount () {
		return this.syslogsService
			.getFaultStateData()
			.pipe(takeUntil(this.destroy$),
			map((counts: FaultStateResponse) => {
				this.faultStateCount = counts.filterCounts;
				if (!this.faultStateCount.Active) {
					this.faultStateCount.Active = 0;
				}
				this.getFaultsCounts(this.faultStateCount);

			}),
			catchError(err => {
				_.invoke(this.alert, 'show',  I18n.get('_SyslogsGenericError_'), 'danger');
				this.logger.error('Fault-devices.component : getDeviceGridData() ' +
						`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}));
	}

	/**
	 * Gets FaultStateCount
	 * @returns  the FaultStateCount data
	 */
	public fetchFaultTimeRangeCount () {
		return this.syslogsService
			.getFaultTimeRangeData()
			.pipe(takeUntil(this.destroy$),
			map((counts: SyslogsTimeRangeResponse) => {
				this.faultTimeRangeCount = counts.filterCounts;
				this.getTimeRangeCount(counts.filterCounts);

			}),
			catchError(err => {
				_.invoke(this.alert, 'show',  I18n.get('_SyslogsGenericError_'), 'danger');
				this.logger.error('Fault-devices.component : getDeviceGridData() ' +
						`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}));
	}

	/**
	 * Gets timeRangeCount counts
	 * @param timeRangeCount will have timeRangeCount
	 * @returns timeRange filter data
	 */
	public getTimeRangeCount (timeRangeCount) {
		const timeRangeFilter = _.find(this.filters, { key: 'timeRange' });

		return (timeRangeFilter.seriesData = [
			{
				filter: '1',
				filterName: I18n.get('_SyslogDay1_'),
				label: I18n.get('_SyslogDay1_'),
				selected: false,
				value: timeRangeCount.days_1,
			},
			{
				filter: '7',
				filterName: I18n.get('_SyslogDays7_'),
				label: I18n.get('_SyslogDays7_'),
				selected: false,
				value: timeRangeCount.days_7,
			},
			{
				filter: '15',
				filterName: I18n.get('_SyslogDays15_'),
				label: I18n.get('_SyslogDays15_'),
				selected: false,
				value: timeRangeCount.days_15,
			},
			{
				filter: '30',
				filterName: I18n.get('_SyslogDays30_'),
				label: I18n.get('_SyslogDays30_'),
				selected: false,
				value: timeRangeCount.days_30,
			},

		]);
	}
	/**
	 * Gets faults counts
	 * @param stateCount will have stateCount
	 * @returns  faults graph data
	 */
	public getFaultsCounts (stateCount) {
		const faultsFilter = _.find(this.filters, { key: 'faults' });

		return (faultsFilter.seriesData = [
			{
				filter: 'Automated',
				filterName: I18n.get('_AfmAutomated_'),
				label: `${I18n.get('_AfmAutomated_')}(${stateCount.Active})`,
				selected: false,
				value: stateCount.Active,
			},
			{
				filter: 'Detected',
				filterName: I18n.get('_AfmDetected_'),
				label: `${I18n.get('_AfmDetected_')}(${stateCount.Inactive})`,
				selected: false,
				value: stateCount.Inactive,
			},
		]);
	}

	/**
	 * Gets severity counts
	 * @param severityCount will have severity count
	 * @returns severity filter data
	 */
	public getSeverityCounts (severityCount) {
		const severityFilter = _.find(this.filters, { key: 'severity' });

		return (severityFilter.seriesData = [
			{
				filter: '0',
				filterName: I18n.get('_SyslogSeverity0_'),
				label: I18n.get('_SyslogSeverity0_'),
				selected: false,
				value: severityCount.syslogSeverity0,
			},
			{
				filter: '1',
				filterName: I18n.get('_SyslogSeverity1_'),
				label: I18n.get('_SyslogSeverity1_'),
				selected: false,
				value: severityCount.syslogSeverity1,
			},
			{
				filter: '2',
				filterName: I18n.get('_SyslogSeverity2_'),
				label: I18n.get('_SyslogSeverity2_'),
				selected: false,
				value: severityCount.syslogSeverity2,
			},
			{
				filter: '3',
				filterName: I18n.get('_SyslogSeverity3_'),
				label: I18n.get('_SyslogSeverity3_'),
				selected: false,
				value: severityCount.syslogSeverity3,
			},
			{
				filter: '4',
				filterName: I18n.get('_SyslogSeverity4_'),
				label: I18n.get('_SyslogSeverity4_'),
				selected: false,
				value: severityCount.syslogSeverity4,
			},
			{
				filter: '5',
				filterName: I18n.get('_SyslogSeverity5_'),
				label: I18n.get('_SyslogSeverity5_'),
				selected: false,
				value: severityCount.syslogSeverity5,
			},
			{
				filter: '6',
				filterName: I18n.get('_SyslogSeverity6_'),
				label: I18n.get('_SyslogSeverity6_'),
				selected: false,
				value: severityCount.syslogSeverity6,
			},
			{
				filter: '7',
				filterName: I18n.get('_SyslogSeverity7_'),
				label: I18n.get('_SyslogSeverity7_'),
				selected: false,
				value: severityCount.syslogSeverity7,
			},
		]);
	}

	/**
	 * Gets severity counts
	 * @param afmSeverity will have severity count
	 * @returns severity filter data
	 */
	public getAfmSeverityCounts (afmSeverity) {
		const afmSeverityFilter = _.find(this.filters, { key: 'afmSeverity' });

		return (afmSeverityFilter.seriesData = [
			{
				filter: 'Critical',
				filterName: I18n.get('_SyslogCritical_'),
				label: `${I18n.get('_SyslogCritical_')}(${afmSeverity.critical})`,
				selected: false,
				value: afmSeverity.critical,
			},
			{
				filter: 'High',
				filterName: I18n.get('_SyslogHigh_'),
				label: `${I18n.get('_SyslogHigh_')}(${afmSeverity.high})`,
				selected: false,
				value: afmSeverity.high,
			},
			{
				filter: 'Medium',
				filterName: I18n.get('_SyslogMedium_'),
				label: `${I18n.get('_SyslogMedium_')}(${afmSeverity.medium})`,
				selected: false,
				value: afmSeverity.medium,
			},
			{
				filter: 'Low',
				filterName: I18n.get('_SyslogLow_'),
				label: `${I18n.get('_SyslogLow_')}(${afmSeverity.low})`,
				selected: false,
				value: afmSeverity.low,
			},
			{
				filter: 'Info',
				filterName: I18n.get('_SyslogInfo_'),
				label: `${I18n.get('_SyslogInfo_')}(${afmSeverity.info})`,
				selected: false,
				value: afmSeverity.info,
			},
		]);
	}
	/**
	 * Loads data
	 */
	public loadData () {
		this.status.isLoading = true;
		if (this.visualLabels[0].active) {
			this.appliedFilters.timeRange = 30;
			this.appliedFilters.afmSeverity = '';
			this.syslogsParams.timeRange = ['30'];
			this.filters =
			_.filter(this.filters, o =>  o.view[0] === 'afm' || o.key === 'timeRange');
			forkJoin(
			this.fetchFaultTimeRangeCount(),
			this.fetchFaultStateCount(),
			this.fetchFaultSeverityCount(),
		)
			.pipe(
				takeUntil(this.destroy$),
				map(() => {
					if (this.syslogsParams.faultsList) {
						this.selectSubFilters(
							this.syslogsParams.faultsList,
							'faults',
						);
					}
					if (this.syslogsParams.timeRange) {
						this.selectSubFilters(
							this.syslogsParams.timeRange,
							'timeRange',
						);
					}

				}),
			)
			.subscribe(() => {
				this.status.isLoading = false;

				this.logger.debug(
					'assets.component : loadData() :: Finished Loading',
				);
			});
		} else {
			this.appliedFilters.timeRange = 30;
			this.appliedFilters.severity = 0;
			this.syslogsParams.timeRange = ['1'];
			this.filters =
			_.filter(this.filters, o =>  o.view[0] === 'syslog' || o.key === 'timeRange');
			forkJoin(
			this.fetchSyslogsTimeRangeCount(),
			this.fetchSyslogsSeverityCount(),
			)
			.pipe(
				takeUntil(this.destroy$),
				map(() => {
					if (this.syslogsParams.timeRange) {
						this.selectSubFilters(
							this.syslogsParams.timeRange,
							'timeRange',
						);
					}
					if (this.syslogsParams.severityList) {
						this.selectSubFilters(
							this.syslogsParams.severityList,
							'severity',
						);
					}

				}),
			)
			.subscribe(() => {
				this.status.isLoading = false;

				if (window.Cypress) {
					window.loading = false;
				}

				this.logger.debug(
					'assets.component : loadData() :: Finished Loading',
				);
			});
		}
	}
	/**
	 * Builds filters
	 */
	private buildFilters () {
		this.filters = [
			{
				key: 'faults',
				loading: true,
				seriesData: [],
				template: this.faultsFilterTemplate,
				title: I18n.get('_faults_'),
				view: ['afm'],
			},
			{
				key: 'afmSeverity',
				loading: true,
				seriesData: [],
				template: this.afmSeverityFilterTemplate,
				title: I18n.get('_Severity_'),
				view: ['afm'],
			},
			{
				key: 'severity',
				loading: true,
				seriesData: [],
				template: this.severityFilterTemplate,
				title: I18n.get('_Severity_'),
				view: ['syslog'],
			},
			{
				key: 'timeRange',
				loading: true,
				seriesData: [],
				template: this.timeRangeFilterTemplate,
				title: I18n.get('_Time Range_'),
				view: ['syslog'],
			},

		];
		this.loadData();
	}
	/**
	 * Selects sub filters
	 * @param params selected filter
	 * @param key filter keys
	 */
	private selectSubFilters (params: string[], key: string) {
		const filter = _.find(this.filters, { key });
	   if (filter) {
		_.each(filter.seriesData, d => {
			if (params.indexOf(d.filter) > -1) {
				this.onSubfilterSelect(d.filter, filter, false);
			}
		});
	}
	}

	/**
	 * Determines whether subfilter select on
	 * @param subfilter filter name
	 * @param filter filter value
	 * @param triggeredFromGraph contains boolean value
	 *
	 */
	public onSubfilterSelect (
		subfilter: string,
		filter: SyslogFilter,
		triggeredFromGraph,
	) {
		const sub = _.find(filter.seriesData, { filter: subfilter });
		if (triggeredFromGraph) {
		   filter.seriesData.forEach(obj => {
			obj.selected = false;
		});
	  }
		if (sub) {
			sub.selected = !sub.selected;
		}

		this.syslogsParams[filter.key] = _.map(
			_.filter(filter.seriesData, 'selected'),
			'filter',
		);
		if (filter.key === 'severity') {
			this.appliedFilters.severity = +this.syslogsParams.severity[0];
			if (isNaN(this.appliedFilters.severity)) {
				this.appliedFilters.severity = 0;
			}
		} else if (filter.key === 'timeRange') {
			this.appliedFilters.timeRange = +this.syslogsParams.timeRange[0];
			if (isNaN(this.appliedFilters.timeRange) && this.visualLabels[0].active) {
				this.appliedFilters.timeRange = 30;
			} else if (isNaN(this.appliedFilters.timeRange) && this.visualLabels[1].active) {
				this.appliedFilters.timeRange = 1;
			}
		} else if (filter.key === 'faults') {
			this.appliedFilters.faults = this.syslogsParams.faults[0];
			if (!this.appliedFilters.faults) {
				this.appliedFilters.faults = 'Automated';
			}
		} else if (filter.key === 'afmSeverity') {
			this.appliedFilters.afmSeverity = this.syslogsParams.afmSeverity[0];
			if (!this.appliedFilters.afmSeverity) {
				this.appliedFilters.afmSeverity = '';
			}
		}
		this.appliedFilters = _.cloneDeep(this.appliedFilters);
		filter.selected = _.some(filter.seriesData, 'selected');
	}
	/**
	 * Gets selected sub filters
	 * @param key filter key
	 * @returns  selected filters
	 */
	public getSelectedSubFilters (key: string) {
		const filter = _.find(this.filters, { key });
		this.title = _.get(filter, 'title');
		if (filter) {
			return _.filter(filter.seriesData, 'selected');
		}
	}
	/**
	 * Clears filters
	 */
	public clearFilters () {
		this.searchQueryInGrid = '';
		this.filtered = false;
		this.noSyslogFilter = false;
		_.each(this.filters, (filter: SyslogFilter) => {
			filter.selected = false;
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});

		this.allAssetsSelected = false;
		this.syslogsParams.timeRange = ['1'];
		this.buildFilters();
	}

	/**
	 * On search updates the search param
	 * @param event string
	 */
	public onSearchUpdate (event) {
		if (event) {
			this.searchQueryInGrid = event;
		}
	}

	/**
	 * Selects visual label
	 * @param index contains visual label index
	 */
	public selectVisualLabel (index: number) {
		 if (index === 0) {
			this.faultFlag = true;
			this.visualLabels[0].active = true;
			this.visualLabels[1].active = false;
		} else {
			this.faultFlag = false;
			this.visualLabels[0].active = false;
			this.visualLabels[1].active = true;
			this.appliedFilters.timeRange = 1;
			this.appliedFilters.severity = 0;
		}
		this.clearFilters();
	}
	/**
	 * on destroy
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * On subfilter close
	 * @param event subfilter
	 */
	public onSubfilterClose (event) {
		const eventKey = _.get(event, 'key');
		if (eventKey === 'severity' || (this.faultFlag
				&& (eventKey === 'afmSeverity'))) {
			const filter = _.find(this.filters, { key: eventKey });
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
			(this.faultFlag) ? (eventKey === 'afmSeverity') ?
				this.appliedFilters.afmSeverity = '' : this.appliedFilters.timeRange = 30
				: this.appliedFilters.severity = null;

			this.appliedFilters = _.cloneDeep(this.appliedFilters);
		   	filter.selected = _.some(filter.seriesData, 'selected');
		}
	}
}
