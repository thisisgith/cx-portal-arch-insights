import { Component, TemplateRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin, of, Subject } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import { RacetrackInfoService } from '@services';
import {
	RiskMitigationService,
	RmFilter as Filter,
	HighCrashRiskDeviceCount,
	InventoryService,
	HighCrashRiskDeviceTooltip,
	RacetrackSolution,
	RacetrackTechnology,
	IStatus,
} from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { InsightsUtilService } from 'src/app/services/insights-util.service';

/**
 * Risk mitigation component
 */
@Component({
	styleUrls: ['./risk-mitigation.component.scss'],
	templateUrl: './risk-mitigation.component.html',
})
export class RiskMitigationComponent implements AfterViewInit {
	public customerId: any;
	public searchQueryInCrashGrid = '';
	public searchQueryInHighCrashGrid = '';
	public searchOptions = {
		debounce: 1500,
		max: 200,
		min: 0,
	};
	public selectedFilters;
	public assetParams: InventoryService.GetAssetsParams;

	public crashedAssetsCount = 0;
	public selectedSolutionName: string;
	public selectedTechnologyName: string;
	public totalAssetCount = 0;
	public selectedCrashedSystemsFilter: string;
	public selectedCrashRiskFilter: string;
	public itemRange = '';
	public totalItems = '';
	public filters: Filter[];
	public onlyCrashes = true;
	public highCrashDeviceCount = 0;
	public loading = false;
	public loadingCrashesData = false;
	private destroy$ = new Subject();
	public defaultTimeRange = '1';
	public defaultRiskState = 'HIGH';
	public status: IStatus = { isLoading: true };
	public get selectedViewFilters (): [] {
		const selectedView = this.onlyCrashes ? 'crashRiskSystems' : 'crashedSystems';

		return _.filter(this.filters, (filter: Filter) =>
		_.indexOf(filter.view, selectedView) > -1,
		);
	}
	public filterCollapse = false;
	@ViewChild('riskScoreFilterTemplate', { static: true })
	public riskScoreFilterTemplate: TemplateRef<string>;
	@ViewChild('timeRangeFilterTemplate', { static: true })
	private timeRangeFilterTemplate: TemplateRef<{ }>;

	constructor (
		private riskMitigationService: RiskMitigationService,
		private logger: LogService,
		private route: ActivatedRoute,
		private racetrackInfoService: RacetrackInfoService,
		private crd: ChangeDetectorRef,
		private insightsUtilService: InsightsUtilService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.selectedCrashRiskFilter = this.defaultRiskState;
	}

	/**
	 * Used to select which tab we want to view the data for
	 * @param tab the tab we've clicked on
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.racetrackInfoService
			.getCurrentSolution()
			.pipe(takeUntil(this.destroy$))
			.subscribe((solution: RacetrackSolution) => {
				this.selectedSolutionName = _.get(solution, 'name');
			});

		this.racetrackInfoService
			.getCurrentTechnology()
			.pipe(takeUntil(this.destroy$))
			.subscribe((technology: RacetrackTechnology) => {
				if (_.get(technology, 'name') !== this.selectedTechnologyName) {
					this.selectedTechnologyName = _.get(technology, 'name');
					this.loadData();
				}
			});
		this.buildFilters();
		this.insightsUtilService
			.getFilterCollapseState()
			.pipe(takeUntil(this.destroy$))
			.subscribe((filterCollapse: boolean) => {
				this.filterCollapse = filterCollapse;
			});
	}

	/**
	 * Load data of risk details
	 */
	public loadData () {
		this.status.isLoading = true;
		this.buildFilters();
		forkJoin(
			this.getTotalAssetCount(),
			this.getAllCrashesData(),
			this.getHighCrashesDeviceData(),
		)
		.subscribe(() => {
			this.status.isLoading = false;
		});
	}

	/**
	 * Gets high crashes device data
	 * @param searchString will have search string
	 * @returns  the crashed device data
	 */
	public getHighCrashesDeviceData () {
		this.onlyCrashes = true;
		this.clearFilters();
		const params = {
			customerId: this.customerId,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		};

		return this.riskMitigationService
			.getHighCrashRiskDeviceCountData(params)
			.pipe(
				takeUntil(this.destroy$),
				map((results: HighCrashRiskDeviceCount) => {
					this.getRiskScore(results.crashRiskDeviceCount);
				}),
				catchError((err: HttpErrorResponse) => {
					this.filters = _.filter(this.filters, filter => filter.key !== 'riskScore');
					this.logger.error(
						'High Crash Assets : getHighCrashesDeviceData() ' +
							`:: Error : (${err.status}) ${err.message}`,
					);

					return of({ });
				}),
			);
	}

	/**
	 * Fetches the all the crashes data
	 * @returns the total crashes observable
	 */
	public getAllCrashesData () {
		this.onlyCrashes = false;
		this.clearFilters();
		const params = {
			customerId: this.customerId,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		};

		return this.riskMitigationService.getAllCrashesData(params)
			.pipe(
			takeUntil(this.destroy$),
			map((results: any) => {
				const seriesData = this.marshallResultsObjectForGraph(results);
				this.crashedAssetsCount = results.devicesCrashCount_90d;
				this.getTimeRange(seriesData);
			}),
			catchError((err: HttpErrorResponse) => {
				this.filters = _.filter(this.filters, filter => filter.key !== 'timeRange');
				this.crashedAssetsCount = undefined;
				this.logger.error(
					'Crash Assets : getAllCrashesData() ' +
						`:: Error : (${err.status}) ${err.message}`,
				);

				return of({ });
			}),
		);
	}

	/**
	 * Returns the selected sub filters
	 * @param data the key to match to the filter
	 * @returns the array of filters
	 */
	public marshallResultsObjectForGraph (data: {
		[x: string]: any;
		hasOwnProperty: (arg0: string) => void;
	}) {
		return [
			{
				filter: 'Time: Last 24h',
				label: '24h',
				selected: false,
				value: Number(data.devicesCrashCount_1d),
			},
			{
				filter: 'Time: Last 7d',
				label: '7d',
				selected: false,
				value: Number(data.devicesCrashCount_7d),
			},
			{
				filter: 'Time: Last 30d',
				label: '30d',
				selected: false,
				value: Number(data.devicesCrashCount_30d),
			},
			{
				filter: 'Time: Last 90d',
				label: '90d',
				selected: false,
				value: Number(data.devicesCrashCount_90d),
			},
		];
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Adds a subfilter to the given filer
	 * @param data timeRangeFilter the subfilter selected
	 */
	public getTimeRange (data) {
		const timeRangeFilter = _.find(this.filters, { key: 'timeRange' });
		const isEmpty = Object.values(data)
		.every(x => (_.get(x, 'value') === 0));
		if (isEmpty) {
			this.filters = _.filter(this.filters, filter => filter.key !== 'timeRange');
		}
		timeRangeFilter.seriesData = data;
		this.selectedFilters = this.filters;
	}

	/**
	 * Initializes our visual filters
	 * @param tab the tab we're building the filters for
	 */
	private buildFilters () {
		this.filters = [
			{
				key: 'timeRange',
				loading: true,
				seriesData: [],
				template: this.timeRangeFilterTemplate,
				title: I18n.get('_RMTimeRange_'),
				selected: true,
				view: ['crashedSystems'],
			},
			{
				key: 'riskScore',
				loading: true,
				seriesData: [],
				template: this.riskScoreFilterTemplate,
				title: I18n.get('_CP_Risk_'),
				selected: true,
				view: ['crashRiskSystems'],
			},
		];
	}

	/**
	 * Selects all the sub filters based on a list of parameters
	 * @param subfilter the string of param
	 * @param filter the string of param
	 * getDeviceDetails of subFilter
	 * @returns selected subfilter
	 */

	public onSubfilterSelect (subfilter: string, filter: Filter) {
		this.resetFilters();
		const sub = _.find(filter.seriesData, { filter: subfilter });
		sub.selected = sub ? !sub.selected : '';
		filter.selected = _.some(filter.seriesData, 'selected');
		let filterSelected: string;
		switch (sub.filter) {
			case 'Time: Last 24h': {
				filterSelected = '1';
				break;
			}
			case 'Time: Last 7d': {
				filterSelected = '7';
				break;
			}
			case 'Time: Last 30d': {
				filterSelected = '30';
				break;
			}
			case 'Time: Last 90d': {
				filterSelected = '90';
				break;
			}
		}
		if (filter.key === 'timeRange') {
			this.selectedCrashedSystemsFilter = filterSelected;
		} else {
			this.selectedCrashRiskFilter = subfilter;
		}
	}

	/**
	 * Function used to clear the filters
	 * @param selectedFilter selected filter to be cleared
	 */
	public clearFilters (selectedFilter?: any) {
		this.searchQueryInCrashGrid = '';
		this.searchQueryInHighCrashGrid = '';
		this.resetFilters();
		// TODO: Implement a better approach to handle the default filter value selection
		const key = this.onlyCrashes ? 'riskScore' : 'timeRange';
		const filter = _.find(this.filters, { key });
		_.set(filter, ['seriesData', '0', 'selected'], true);
		this.selectedFilters = [filter];
		this.selectedCrashedSystemsFilter = this.defaultTimeRange;
		if (_.get(selectedFilter, 'filter') === this.defaultRiskState) {
			this.selectedCrashRiskFilter = '';
			selectedFilter.selected = false;
		} else {
			this.selectedCrashRiskFilter = this.defaultRiskState;
		}
	}

	/**
	 * clear all selected filter values in Crash Risk grid
	 */
	public clearAllFilters () {
		this.clearFilters();
		const filter = _.find(this.filters, { key: 'riskScore' });
		_.set(filter, ['seriesData', '0', 'selected'], false);
		this.selectedCrashRiskFilter = '';
	}

	/**
	 * Function used to reset the filters
	 */
	public resetFilters () {
		_.each(this.filters, (filter: Filter) => {
			_.each(
				filter.seriesData,
				(currentFilter: { selected: boolean }) => {
					_.set(currentFilter, 'selected', false);
				},
			);
		});
	}

	/**
	 * Returns the selected sub filters
	 * @param key the key to match to the filter
	 * @returns the array of filters
	 */
	public getSelectedSubFilters (key: string) {
		const filter = _.find(this.filters, { key });
		if (filter) {
			return _.filter(filter.seriesData, 'selected');
		}
	}
	/**
	 * Gets high crashes Risk Score  data
	 * @param result will have search string
	 * @returns  the crashed device data
	 */
	public getRiskScore (result: HighCrashRiskDeviceTooltip) {
		const catalogFilter = _.find(this.filters, { key: 'riskScore' });
		const isEmpty = Object.values(result)
		.every(x => (x === 0));
		if (isEmpty) {
			this.filters = _.filter(this.filters, filter => filter.key !== 'riskScore');
		}

		return (catalogFilter.seriesData = [
			{
				filter: 'HIGH',
				label: `${I18n.get('_High_')}(${result.high})`,
				selected: true,
				value: result.high,
			},
			{
				filter: 'MED',
				label: `${I18n.get('_Medium_')}(${result.med})`,
				selected: false,
				value: result.med,
			},
			{
				filter: 'LOW',
				label: `${I18n.get('_Low_')}(${result.low})`,
				selected: false,
				value: result.low,
			},
			{
				filter: 'Not Evaluated',
				label: `${I18n.get('_CP_NotEvaluated')}(${result.notEvaluated})`,
				selected: false,
				value: result.notEvaluated,
			},
		]);
	}

	/**
	 * Method used to get the total Assest Count
	 * @returns Total assets count as observable
	 */
	public getTotalAssetCount () {
		const totalCountParams = {
			customerId: this.customerId,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		};

		return this.riskMitigationService
			.getTotalAssestCount(totalCountParams)
			.pipe(
				takeUntil(this.destroy$),
				map(response => {
					this.totalAssetCount = response
						.map(element => element.deviceCount)
						.reduce((sum, value) => sum + value, 0);
				}),
				catchError(err => {
					this.totalAssetCount = undefined;
					this.logger.error(
						'Could not fetch results : getTotalAssestCount() ' +
							`:: Error : (${err.status}) ${err.message}`,
					);

					return of({ });
				}),
			);
	}

	/**
	 * get the paginator value from Crash risk Grid
	 * @param params output from Crash Risk
	 */
	public paginationValueDetails (params: any) {
		this.itemRange = params.itemRange;
		this.totalItems = params.totalItems;
	}
	/**
 	* set OnlyCrashes based Grid selection
 	* @param param boolean value from template
 	*/
	public switchGrid (param: boolean) {
		this.onlyCrashes = param; this.clearFilters();
	}
	/**
	 * Refreshes pagination count after view init
	 */
	public ngAfterViewInit () {
		this.crd.detectChanges();
	}
}
