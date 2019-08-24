import {
	Component,
	OnInit,
	OnDestroy,
	ViewChild,
	TemplateRef,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { SyslogsService, SyslogGridData, SyslogFilter } from '@sdp-api';
// tslint:disable-next-line: max-line-length
import { Subscription, Subject, forkJoin, of } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';

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
	) {
		this.userResolve.getCustomerId()
			.pipe(
			takeUntil(this.destroy$),
			)
			.subscribe((id: string) => {
				this.customerId = id;
			});
		this.logger.debug('BestpracticesComponent Created!');
	}
	get selectedFilters () {
		return _.filter(this.filters, 'selected');
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
	public customerId;
	public countSubscripion: Subscription;
	public totalSyslogsCount = { };
	public tableOptions: CuiTableOptions;
	public loading = false;
	public totalItems = 0;
	public tableData: SyslogGridData[] = [];
	public pageLimit = 10;
	public pageNum = 1;
	public severity = 7;
	public timeRange = 1;
	public catalog = '';
	public selectedAsset;
	public showAssetPanel = false;
	public fullscreen = false;
	public width = 300;
	public view: 'syslogMessage' | 'syslogAsset' = 'syslogMessage';
	public appliedFilters = {
		asset: '',
		catalog : 'cisco catalog',
		severity: 7,
		timeRange: 1,
	};
	/**
	 * Visual filters  of syslogs component
	 */
	@ViewChild('timeRangeFilter', { static: true })
	private timeRangeFilterTemplate: TemplateRef<{ }>;
	@ViewChild('catalogFilter', { static: true })
	private catalogFilterTemplate: TemplateRef<{ }>;
	@ViewChild('severityFilter', { static: true })
	private severityFilterTemplate: TemplateRef<{ }>;
	 @ViewChild('assetFilter', { static: true })
	 private assetFilterTemplate: TemplateRef<{ }>;
	private InventorySubject: Subject<{ }>;
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
		timeRange: ['1'],
	};
	public selected;
	public visualLabels: any = [
		{
			active: true, count: null,
			label: I18n.get('_SyslogTotalSyslogs_'),
			route: 'Exceptions'},
		{
			active: false, count: null,
			label: I18n.get('_SyslogTotalAssets_'),
			route: 'AssetsWithExceptions' },
	];
	private destroy$ = new Subject();
	/**
	 * initilize grid and graph
	 * @returns grid and graph data
	 */
	public ngOnInit () {
		this.fetchSyslogsCount();
		this.buildFilters();
	}

	/**
	 * Fetchs syslogs count
	 */
	public fetchSyslogsCount () {
		// tslint:disable-next-line: ban-comma-operator
		this.countSubscripion = this.syslogsService
			.getSyslogsCount(this.customerId)
			.pipe(takeUntil(this.destroy$))
			.subscribe(counts => {
				this.totalSyslogsCount = counts;
				this.visualLabels[0].count = counts.sysLogMsgCount;
				this.visualLabels[1].count = counts.assetsCount;
			}),
			catchError(err => {
				this.logger.error('syslogs-devices.component : getDeviceGridData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			});
	}
	/**
	 * Gets time range count
	 * @returns time range filter
	 */
	public getTimeRangeCount () {
		const timeRangeFilter = _.find(this.filters, { key: 'timeRange' });

		return (timeRangeFilter.seriesData = [
			{
				filter: '1',
				label: I18n.get('_SyslogDay1_'),
				selected: false,
				value: 10,
			},
			{
				filter: '7',
				label: I18n.get('_SyslogDays7_'),
				selected: false,
				value: 15,
			},
			{
				filter: '15',
				label: I18n.get('_SyslogDays15_'),
				selected: false,
				value: 20,
			},
			{
				filter: '30',
				label: I18n.get('_SyslogDays30_'),
				selected: false,
				value: 25,
			},

		]);
	}
	/**
	 * Gets catalog counts
	 * @returns  catalog graph data
	 */
	public getCatalogCounts () {
		const catalogFilter = _.find(this.filters, { key: 'catalog' });

		return (catalogFilter.seriesData = [
			{
				filter: 'cisco catalog',
				label: I18n.get('_SyslogCiscoCatalog_'),
				selected: false,
				value: 50,
			},
			{
				filter: 'others',
				label: I18n.get('_SyslogOthers_'),
				selected: false,
				value: 50,
			},
		]);
	}
	/**
	 * Gets severity counts
	 * @returns servirity graph data
	 */
	public getSeverityCounts () {
		const severityFilter = _.find(this.filters, { key: 'severity' });

		return (severityFilter.seriesData = [
			{
				filter: '0',
				label: '0',
				selected: false,
				value: 10,
			},
			{
				filter: '1',
				label: '0-1',
				selected: false,
				value: 15,
			},
			{
				filter: '2',
				label: '0-2',
				selected: false,
				value: 20,
			},
			{
				filter: '3',
				label: '0-3',
				selected: false,
				value: 25,
			},
			{
				filter: '4',
				label: '0-4',
				selected: false,
				value: 30,
			},
			{
				filter: '5',
				label: '0-5',
				selected: false,
				value: 35,
			},
			{
				filter: '6',
				label: '0-6',
				selected: false,
				value: 40,
			},
			{
				filter: '7',
				label: '0-7',
				selected: false,
				value: 45,
			},
		]);
	}
	/**
	 * Gets asset counts
	 * @returns asset seriesdata
	 */
	public getAssetCounts () {
		const assetFilter = _.find(this.filters, { key: 'asset' });

		return (assetFilter.seriesData = [
			{
				filter: 'noSyslog',
				label: I18n.get('_SyslogNoSyslog_'),
				selected: false,
				value: 50,
			},
			{
				filter: 'withSyslog',
				label: I18n.get('_SyslogWithSyslog_'),
				selected: false,
				value: 50,
			},
		]);
	}
	/**
	 * Loads data
	 */
	private loadData () {
		this.status.isLoading = true;
		forkJoin(
			this.getTimeRangeCount(),
			this.getCatalogCounts(),
			this.getSeverityCounts(),
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
				title: I18n.get('_Time Range_'),
				view: ['syslogMessage', 'syslogAsset'],
			},
			{
				key: 'catalog',
				loading: true,
				seriesData: [],
				template: this.catalogFilterTemplate,
				title: I18n.get('_Catalog_'),
				view: ['syslogMessage', 'syslogAsset'],
			},
			{
				key: 'severity',
				loading: true,
				seriesData: [],
				template: this.severityFilterTemplate,
				title: I18n.get('_Severity_'),
				view: ['syslogMessage', 'syslogAsset'],
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
				this.appliedFilters.severity = 7;
			}
		} else if (filter.key === 'timeRange') {
			this.appliedFilters.timeRange = +this.syslogsParams.timeRange[0];
			if (isNaN(this.appliedFilters.timeRange)) {
				this.appliedFilters.timeRange = 1;
			}
		} else if (filter.key === 'catalog') {
			this.appliedFilters.catalog = this.syslogsParams.catalog[0];
			if (!this.appliedFilters.catalog) {
				this.appliedFilters.catalog = '';
			}
		} else if (filter.key === 'asset') {
			this.appliedFilters.asset = this.syslogsParams.asset[0];
			if (!this.appliedFilters.asset) {
				this.appliedFilters.asset = '';
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

		if (filter) {
			return _.filter(filter.seriesData, 'selected');
		}
	}
	/**
	 * Clears filters
	 */
	public clearFilters () {
		this.filtered = false;

		_.each(this.filters, (filter: SyslogFilter) => {
			filter.selected = false;
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});

		this.allAssetsSelected = false;
		this.syslogsParams.timeRange = ['1'];
		if (this.syslogsParams.timeRange) {
			this.selectSubFilters(
				this.syslogsParams.timeRange,
				'timeRange',
			);
		}
		this.appliedFilters = {
			asset: '',
			catalog: 'cisco catalog',
			severity: 3,
			timeRange: 1,
		};
		// this.getSyslogsData();
	}
	/**
	 * Selects visual label
	 * @param i contains visual label index
	 */
	public selectVisualLabel (i: number) {
		 if (i === 0) {
			this.visualLabels[0].active = true;
			this.visualLabels[1].active = false;
			if (this.filters.length === 4) {
				this.filters.pop();
			}
		} else {
			this.visualLabels[0].active = false;
			this.visualLabels[1].active = true;
			if (this.filters.length === 3) {
				this.filters.push({
					key: 'asset',
					loading: true,
					seriesData: [],
					template: this.assetFilterTemplate,
					title: I18n.get('_SyslogAsset_'),
					view: ['syslogMessage', 'syslogAsset'],
				});
		  }
			this.getAssetCounts();
		}
		this.loadData();
		this.clearFilters();
	}
	/**
	 * on destroy
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
