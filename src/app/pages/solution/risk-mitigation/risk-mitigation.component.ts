import { Component, TemplateRef, ViewChild } from '@angular/core';
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
} from '@sdp-api';
import { ActivatedRoute } from '@angular/router';

/**
 * Risk mitigation component
 */
@Component({
	styleUrls: ['./risk-mitigation.component.scss'],
	templateUrl: './risk-mitigation.component.html',
})
export class RiskMitigationComponent {
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
	public selectedCrashedSystemsFilter = '90';
	public selectedCrashRiskFilter = 'HIGH';
	public itemRange = '';
	public totalItems = '';
	public filters: Filter[];
	public onlyCrashes = true;
	public highCrashDeviceCount = 0;
	public loading = false;
	public loadingCrashesData = false;
	private destroy$ = new Subject();

	@ViewChild('riskScoreFilterTemplate', { static: true })
	public riskScoreFilterTemplate: TemplateRef<string>;
	@ViewChild('timeRangeFilterTemplate', { static: true })
	private timeRangeFilterTemplate: TemplateRef<{ }>;

	constructor (
		private riskMitigationService: RiskMitigationService,
		private logger: LogService,
		private route: ActivatedRoute,
		private racetrackInfoService: RacetrackInfoService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
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
				this.selectedTechnologyName = _.get(technology, 'name');
				this.loadData();
				this.getTotalAssetCount();
			});

		this.buildFilters();
		this.loadData();
	}

	/**
	 * Load data of risk details
	 */
	public loadData () {
		forkJoin(
			this.getTotalAssetCount(),
			this.getAllCrashesData(),
			this.getHighCrashesDeviceData(),
		)
		.subscribe();
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
				catchError(err => {
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
			catchError(err => {
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
				title: I18n.get('_RMTIMEPeriod_'),
			},
			{
				key: 'riskScore',
				loading: true,
				seriesData: [],
				template: this.riskScoreFilterTemplate,
				title: I18n.get('_CP_Risk_'),
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
	 */
	public clearFilters () {
		this.searchQueryInCrashGrid = '';
		this.searchQueryInHighCrashGrid = '';
		this.resetFilters();
		// TODO: Implement a better approach to handle the default filter value selection
		const key = this.onlyCrashes ? 'riskScore' : 'timeRange';
		const filter = _.find(this.filters, { key });
		this.onlyCrashes
			? _.set(filter, 'seriesData.0.selected', true)
			: _.set(filter, 'seriesData.3.selected', true);
		this.selectedFilters = [filter];
	}

	/**
	 * clear all selected filter values in Crash Risk grid
	 */
	public clearAllFilters () {
		this.clearFilters();
		const filter = _.find(this.filters, { key: 'riskScore' });
		_.set(filter, 'seriesData.0.selected', false);
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

		return (catalogFilter.seriesData = [
			{
				filter: 'HIGH',
				label: `${I18n.get('_High_')}(${result.high})`,
				selected: true,
				value: result.high,
			},
			{
				filter: 'LOW',
				label: `${I18n.get('_Low_')}(${result.low})`,
				selected: false,
				value: result.low,
			},
			{
				filter: 'MED',
				label: `${I18n.get('_Medium_')}(${result.med})`,
				selected: false,
				value: result.med,
			},
			{
				filter: 'Not Evaluated',
				label: `${I18n.get('_CP_NotEvaluated')}(${result.med})`,
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
}
