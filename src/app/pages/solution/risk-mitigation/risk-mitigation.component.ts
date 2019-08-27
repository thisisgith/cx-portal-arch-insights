import { Component, TemplateRef, ViewChild } from '@angular/core';
import { forkJoin, of, Subject } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import {
	CrashHistoryDeviceCount,
	RiskMitigationService,
	HighCrashRiskPagination,
	RmFilter as Filter,
	RiskAsset,
	HighCrashRiskDevices,
	HighCrashRiskDeviceCount,
	HighCrashRisk,
	RiskAssets,
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
	public customerId: number;
	public clearAllFilters = false;
	public searchQueryString: String = '';
	public searchOptions = {
		debounce: 1500,
		max: 200,
		min: 0,
	};
	public selectedFilters;
	constructor (
		private riskMitigationService: RiskMitigationService,
		private logger: LogService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}

	@ViewChild('contextualMenuTemplate',
	{ static: true }) private contextualMenuTemplate: TemplateRef<string>;
	@ViewChild('cardColors', { static: true }) public cardColorsTemplate: TemplateRef<string>;
	@ViewChild('riskScore', { static: true }) public riskScoreTemplate: TemplateRef<string>;

	public openPanel = false;
	public fullscreen = false;
	public filters: Filter[];
	public onlyCrashes = true;
	public selectedAsset: RiskAsset;
	public selectedFingerPrintdata: HighCrashRiskDevices;
	public showAsset360 = false;
	public highCrashRiskParams: HighCrashRiskPagination;
	public crashHistoryParams: CrashHistoryDeviceCount;
	public highCrashDeviceCount: number;
	public crashHistoryTableOptions: CuiTableOptions;

	public crashesAssetsGridOptions: CuiTableOptions;
	public crashedAssetsGridDetails = {
		 tableData: [],
		 tableLimit: 10,
		 tableOffset: 0,
		 totalItems: 0,
	};

	public highCrashRiskAssetsGridOptions: CuiTableOptions;
	public highCrashRiskAssetsGridDetails = {
		tableData: [],
		tableLimit: 10,
		tableOffset: 0,
		totalItems: 0,
	};

	public crashHistoryGridOptions: CuiTableOptions;
	public crashHistoryGridDetails = {
		tableData: [],
		tableLimit: 10,
		tableOffset: 0,
		totalItems: 0,
	};

	public loading = false;
	public showFpDetails = false;
	public last24hrsData;
	public loadingCrashesData = false;
	private destroy$ = new Subject();

	/**
	 * Visual filters of CPRM component
	 */
	@ViewChild('advisoryFilter', { static: true }) private advisoryFilterTemplate: TemplateRef<{ }>;

	public status = {
		inventoryLoading: true,
		isLoading: true,
	};

	/**
	 * Load data of risk details
	 */
	public loadData () {
		this.highCrashRiskParams = {
			customerId: this.customerId,
			page: 0,
			size: 10,
		};
		this.status.isLoading = true;
		forkJoin(
			this.getAllCrashesData(),
			this.getHighCrashesDeviceData(),
		)
		.subscribe(() => {
			this.status.isLoading = false;
		});
		this.getFingerPrintDeviceDetails(this.highCrashRiskParams);
		this.onlyCrashes = true;
	}

	/**
	 * Selected filter is for to assign default filter on page loads.
	 */
	public selectedTimeFilters () {
		_.filter(this.filters, 'selected');
		this.selectedFilters = this.filters;
  	 }
	/**
	 * Gets high crashes device data
	 * @returns  the crashed device data
	 */
	public getHighCrashesDeviceData () {
		this.onlyCrashes = true;
		const params = _.pick(_.cloneDeep(this.highCrashRiskParams), ['customerId']);

		return this.riskMitigationService.getHighCrashRiskDeviceCountData(params)
				.pipe(
					takeUntil(this.destroy$),
					map((results: HighCrashRiskDeviceCount) => {
						this.highCrashDeviceCount = results.crashRiskDeviceCount;
					}),
					catchError(err => {
						this.highCrashDeviceCount = undefined;
						this.logger.error('High Crash Assets : getHighCrashesDeviceData() ' +
							`:: Error : (${err.status}) ${err.message}`);

						return of({ });
					}),
				);
	}

	/**
	 * Fetches the all the crashes data
	 * @returns the total crashes observable
	 */
	public getAllCrashesData () {
		const params = _.pick(_.cloneDeep(this.highCrashRiskParams), ['customerId']);
		this.onlyCrashes = false;
		this.getDeviceDetails('1');

		return this.riskMitigationService.getAllCrashesData(params)
			.pipe(
				takeUntil(this.destroy$),
				map((results: any) => {
					const seriesData = this.marshallResultsObjectForGraph(results);
					this.last24hrsData = results.devicesCrashCount_1d;
					this.getAdvisoryCount(seriesData);
				}),
				catchError(err => {
					this.last24hrsData = undefined;
					this.logger.error('Crash Assets : getAllCrashesData() ' +
						`:: Error : (${err.status}) ${err.message}`);

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
		[x: string]: any; hasOwnProperty: (arg0: string) => void; }) {
		return [
			{
				filter: 'Time: Last 24h',
				label: '24h',
				selected: true,
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
	 * Fetches the all the crashes data
	 * @param timePeriod time period
	 * @returns the total crashes observable
	 */
	public getDeviceDetails (timePeriod: string) {
		const params = _.pick(_.cloneDeep(this.highCrashRiskParams), ['customerId']);
		this.crashedAssetsGridDetails.tableData = [];
		if (timePeriod) {
			params.timePeriod = timePeriod;
		} else {
			_.unset(params, 'timePeriod');
		}

		return this.riskMitigationService.getDeviceDetails(params)
				.pipe(
					takeUntil(this.destroy$),
					map((results: RiskAssets) => {
						this.crashedAssetsGridDetails.tableData = results.deviceDetails;
						this.crashedAssetsGridDetails.totalItems = _.size(results.deviceDetails);
						this.crashedAssetsGridDetails.tableOffset = 0;
					}),
					catchError(err => {
						this.crashedAssetsGridDetails.tableData = [];
						this.logger.error('Crash Assets : getDeviceDetails() ' +
							`:: Error : (${err.status}) ${err.message}`);

						return of({ });
					}),
				)
				.subscribe();
	}

	/**
	 * get the finger print device details
	 * @param param service params
	 * @returns observable of crash devices
	 */
	private getFingerPrintDeviceDetails (param: HighCrashRiskPagination) {
		return this.riskMitigationService.getFingerPrintDeviceDetailsData(param)
						.pipe(
							takeUntil(this.destroy$),
							map((results: HighCrashRisk) => {
								this.highCrashRiskAssetsGridDetails.tableData = results.devices;
								this.highCrashRiskAssetsGridDetails.totalItems = results.count;
							}),
							catchError(err => {
								this.highCrashRiskAssetsGridDetails.tableData  = [];
								this.logger.error('Crash Assets : getFingerPrintDeviceDetails() ' +
									`:: Error : (${err.status}) ${err.message}`);

								return of({ });
							}),
						)
						.subscribe();
	}

	/**
	 * Gets crashed device history
	 * @param asset has the data of selected crashed details
	 * @returns  Returns the particular device crash history data
	 */
	private getCrashedDeviceHistory (asset) {
		this.crashHistoryGridDetails.tableData = [];
		this.crashHistoryParams = {
			customerId: _.cloneDeep(this.customerId),
			neInstanceId: asset.neInstanceId,
		};

		return this.riskMitigationService.getCrashHistoryForDevice(this.crashHistoryParams)
							.pipe(
								takeUntil(this.destroy$),
								map((results: any) => {
									this.crashHistoryGridDetails.tableData = results.crashes;
								}),
								catchError(err => {
									this.crashHistoryGridDetails.tableData  = [];
									this.logger.error('Crash Assets : getCrashedDeviceHistory() ' +
										`:: Error : (${err.status}) ${err.message}`);

									return of({ });
								}),
							)
							.subscribe();
	}

	/**
	 * Function to update pagination
	 * @param pageInfo will have the page info
	 *
	 */
	public onPagerUpdated (pageInfo: any) {
		this.crashedAssetsGridDetails.tableOffset = pageInfo.page;
	}

	/**
	 * Function to capture High crash grid updation
	 * @param param will have the high crash risk grid pagination info
	 */
	public onHcrPagerUpdated (param: HighCrashRiskPagination) {
		this.highCrashRiskAssetsGridDetails.tableOffset = param.page;
		this.highCrashRiskAssetsGridDetails.tableLimit = param.limit;
		this.highCrashRiskParams.size = this.highCrashRiskAssetsGridDetails.tableLimit;
		this.highCrashRiskParams.page = this.highCrashRiskAssetsGridDetails.tableOffset;
		this.getFingerPrintDeviceDetails(this.highCrashRiskParams);
	}
	/**
	 * Gets filter details for search query
	 * @param searchText is the string contains search query value
	 * @returns  time data with filter values
	 */
	public getFilterDetailsForSearchQuery (searchText: String) {
		let time;
		const filter =  _.find(this.filters[0].seriesData, { selected: true });
		if(filter){
			switch (filter.label) {
				case '24h': {
					time = '1';
					break;
				}
				case '7d': {
					time = '7';
					break;
				}
				case '30d': {
					time = '30';
					break;
				}
				case '90d': {
					time = '90';
					break;
				}
			}

			return {
				time,
				customerId: this.customerId,
				key: '',
				search: searchText,
				sortDirection: '',
			};
		} else {

			return {
				customerId: this.customerId,
				key: '',
				search: searchText,
				sortDirection: '',
				time: '1',
			};
		}

	}
	/**
	 * Function to update pagination
	 * @param searchText will have the device details
	 * @returns new table details
	 */
	public onSearchQuery (searchText: string) {
		this.searchQueryString = searchText;
		const params = this.getFilterDetailsForSearchQuery(this.searchQueryString);

		return this.riskMitigationService.getSearchedData(params)
				.pipe(
					takeUntil(this.destroy$),
					map((results: any) => {
						this.crashedAssetsGridDetails.tableData = results.deviceDetails;
						this.crashedAssetsGridDetails.totalItems = results.deviceDetails.length;
						this.crashHistoryGridDetails.tableOffset = 0;
					}),
					catchError(err => {
						this.crashedAssetsGridDetails.tableData   = [];
						this.logger.error('Crash Assets : onSearchQuery() ' +
							`:: Error : (${err.status}) ${err.message}`);

						return of({ });
					}),
				)
				.subscribe();
	}
	/**
	 * Function to capture the row click on grid
	 * @param asset will have the device details
	 */
	public onRowClicked (asset: any) {
		this.showAsset360 = false;
		if (asset.active) {
			this.selectedAsset = asset;
			this.getCrashedDeviceHistory(asset);
		} else { this.selectedAsset = undefined; }
	}
	/**
	 * Determines whether fpdpanel close on click
	 */
	public onFPDPanelClose () {
		this.showFpDetails = false;
	}

	/**
	 * Connects to fp details
	 * @param asset is selected asset from grid
	 */

	public connectToFpDetails (asset: any) {
		this.showFpDetails = true;
		this.selectedFingerPrintdata = asset;
	}

	/**
	 * Determines whether panel close on when grids open details of asset
	 */

	public onPanelClose () {
		this.selectedAsset = undefined;
		this.showAsset360 = false;
	}

	/**
	 * Determines whether table sorting changed on
	 * @param event is get sorting event
	 * @returns  params from sorting data
	 */
	public onTableSortingChanged (event) {
		 const params = this.getFilterDetailsForSearchQuery(this.searchQueryString);
		 params.key = event.key;
		 params.sortDirection = event.sortDirection;

		 return this.riskMitigationService.getSearchedData(params)
			 .pipe(
				map((results: any) => {
					this.crashedAssetsGridDetails.tableData = results.deviceDetails;
					this.crashedAssetsGridDetails.totalItems = results.deviceDetails.length;
					this.crashHistoryGridDetails.tableOffset = 0;
				}),
				catchError(err => {
					this.crashedAssetsGridDetails.tableData   = [];
					this.logger.error('Crash Assets : onTableSortingChanged()' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			)
			.subscribe();
	}

	/**
	 * Redirects to asset360
	 */
	public redirectToAsset360 () {
		this.showAsset360 = true;
	}
	/**
	 * Used to select which tab we want to view the data for
	 * @param tab the tab we've clicked on
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.buildFilters();
		this.buildTables();
		this.loadData();
	}
	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
	/**
	 * on init of component build tables
	 */
	public buildTables () {
		this.crashHistoryGridOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'resetReason',
					name: I18n.get('_RMRessetReason_'),
					sortable: false,
					width: '250px',
				},
				{
					key: 'timeStamp',
					name: I18n.get('_RMTimeStamp_'),
					sortable: false,
				}],
		});
		this.crashesAssetsGridOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'neName',
					name: I18n.get('_RMAsset_'),
					sortable: true,
				},
				{
					key: 'productId',
					name: I18n.get('_RMProductId_'),
					sortable: true,
				},
				{
					key: 'productFamily',
					name: I18n.get('_RMProductFamily_'),
					sortable: true,
				},
				{
					key: 'swVersion',
					name: I18n.get('_RMSoftwareVersion_'),
					sortable: true,
				},
				{
					key: 'crashCount',
					name: I18n.get('_RMNumberOfCrashes_'),
					sortable: true,
				},
				{
					key: 'firstOccurrence',
					name: I18n.get('_RMFirstOccurance_'),
					sortable: false,
				},
				{
					key: 'lastOccurrence',
					name: I18n.get('_RMLastOccurance_'),
					sortable: false,
				},
			],
			dynamicData: false,
			singleSelect: true,
		});
		this.highCrashRiskAssetsGridOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'deviceName',
					name: I18n.get('_RMDevice_'),
					sortable: false,
				},
				{
					key: 'productId',
					name: I18n.get('_RMProductId_'),
					sortable: false,
				},
				{
					key: 'productFamily',
					name: I18n.get('_RMProductFamily_'),
					sortable: false,
				},
				{
					key: 'softwareVersion',
					name: I18n.get('_RMSoftwareVersion_'),
					sortable: false,
				},
				{
					key: 'riskScore',
					name: I18n.get('_RMRisk_'),
					sortable: false,
					template: this.riskScoreTemplate,
				},
				{
					key: 'globalRiskRank',
					name: I18n.get('_RMGlobalRisk_'),
					sortable: false,
					template: this.cardColorsTemplate,
				},
			],
			dynamicData: false,
			singleSelect: true,
		});
	}
	/**
	 * Adds a subfilter to the given filer
	 * @param data advisoryFilter the subfilter selected
	 */
	public getAdvisoryCount (data) {
		const advisoryFilter = _.find(this.filters, { key: 'advisories' });
		advisoryFilter.seriesData = data;
		this.selectedFilters = this.filters;
		this.clearFilters();
	}

	/**
	 * Initializes our visual filters
	 * @param tab the tab we're building the filters for
	 */
	private buildFilters () {
		this.filters = [

			{
				key: 'advisories',
				loading: true,
				seriesData: [],
				template: this.advisoryFilterTemplate,
				title: I18n.get('_RMCrashes_'),
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
		sub.selected = (sub) ? !sub.selected : '';
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
		this.getDeviceDetails(filterSelected);
	}

	/**
	 * Function used to clear the filters
	 */
	public clearFilters () {
		_.each(this.filters, (filter: Filter) => {
			filter.selected = false;
			_.each(filter.seriesData, (currentFilter: { selected: boolean; }) => {
				currentFilter.selected = false;
			});
		});
		this.resetFilters();
		this.getDeviceDetails('1');
		this.clearAllFilters = true;
		const filter = _.find(this.filters, { key: 'advisories' });
		if (filter) {
			filter.seriesData[0].selected = true;
		}
		this.filters[0] = filter;
		this.getSelectedSubFilters('advisories');
		this.selectedFilters = this.filters;
		this.selectedTimeFilters();
	}

	/**
	 * Function used to reset the filters
	 */
	public resetFilters () {
		_.each(this.filters, (filter: Filter) => {
			filter.selected = false;
			_.each(filter.seriesData, (currentFilter: { selected: boolean; }) => {
				currentFilter.selected = false;
			});
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

}
