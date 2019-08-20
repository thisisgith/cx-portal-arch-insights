// tslint:disable: no-any
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { forkJoin, of, Subject } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import {
	RiskMitigationService,
	HighCrashRiskPagination,
	RmFilter as Filter,
	RiskAsset,
	HighCrashRiskDevices,
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
	constructor (
		private riskmitigationservice: RiskMitigationService,
		private logger: LogService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}

	get selectedFilters () {
		return _.filter(this.filters, 'selected');
	}

	@ViewChild('contextualMenuTemplate',
	{ static: true }) private contextualMenuTemplate: TemplateRef<any>;
	@ViewChild('cardColors', { static: true }) public cardColorsTemplate: TemplateRef<any>;
	@ViewChild('riskScore', { static: true }) public riskScoreTemplate: TemplateRef<any>;

	public openPanel = false;
	public fullscreen = false;
	public filters: Filter[];
	public onlyCrashes = true;
	public selectedAsset: RiskAsset;
	public selectedFingerPrintdata: HighCrashRiskDevices;
	public showAsset360 = false;
	public highCrashRiskParams: HighCrashRiskPagination;
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
			page: 1,
			size: 10,
		};
		this.status.isLoading = true;
		forkJoin(
			this.getAllCrashesData(),
			this.getHighCrashesDeviceData(),
			this.getFingerPrintDeviceDetails(this.highCrashRiskParams),
		)
		.subscribe(() => {
			this.status.isLoading = false;
		});
		this.onlyCrashes = true;
	}
	// tslint:disable-next-line: valid-jsdoc
	/**
	 * Fetches the all the crashes data
	 */
	public getHighCrashesDeviceData () {
		this.onlyCrashes = true;
		let params: any = RiskMitigationService.GetAssetsParams;
		params = {
			customerId: this.customerId,
		};

		return this.riskmitigationservice.getHighCrashRiskDeviceCountData(params)
				.pipe(
					takeUntil(this.destroy$),
					map((results: any) => {
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
		let params: any = RiskMitigationService.GetAssetsParams;
		params = {
			customerId: this.customerId,
		};
		this.onlyCrashes = false;

		return this.riskmitigationservice.getAllCrashesData(params)
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
		let params: any = RiskMitigationService.GetAssetsParams;
		this.crashedAssetsGridDetails.tableData = [];
		params = (timePeriod) ? timePeriod : null;
		params.customerId = this.customerId;

		return this.riskmitigationservice.getDeviceDetails(params)
				.pipe(
					takeUntil(this.destroy$),
					map((results: any) => {
						this.crashedAssetsGridDetails.tableData = results.deviceDetails;
						this.crashedAssetsGridDetails.totalItems = results.deviceDetails.length;
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
		return this.riskmitigationservice.getFingerPrintDeviceDetailsData(param)
						.pipe(
							takeUntil(this.destroy$),
							map((results: any) => {
								this.highCrashRiskAssetsGridDetails.tableData = results.devices;
								this.highCrashRiskAssetsGridDetails.totalItems = results.count;
							}),
							catchError(err => {
								this.highCrashRiskAssetsGridDetails.tableData  = [];
								this.logger.error('Crash Assets : getFingerPrintDeviceDetails() ' +
									`:: Error : (${err.status}) ${err.message}`);

								return of({ });
							}),
						);
	}
	/**
	 * Fetches the device crashed history
	 * @returns the total crash history of particular device
	 */
	private getCrashedDeviceHistory () {
		this.crashHistoryGridDetails.tableData = [];
		let params: any = RiskMitigationService.GetAssetsParams;
		params = {
			customerId: this.customerId,
		};

		return this.riskmitigationservice.getCrashHistoryForDevice(params)
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
		this.highCrashRiskAssetsGridDetails.tableOffset = param.page + 1;
		this.highCrashRiskAssetsGridDetails.tableLimit = param.limit;
		this.highCrashRiskParams.size = this.highCrashRiskAssetsGridDetails.tableLimit;
		this.highCrashRiskParams.page = this.highCrashRiskAssetsGridDetails.tableOffset;
		this.getFingerPrintDeviceDetails(this.highCrashRiskParams);
		this.highCrashRiskAssetsGridDetails.totalItems =
		this.highCrashRiskAssetsGridDetails.totalItems + 10;
	}

	// tslint:disable-next-line: valid-jsdoc
	/**
	 * Function to capture High crash grid updation
	 * @param searchText will have the high crash risk grid pagination info
	 */
	public getFilterDetailsForSearchQuery (searchText: String) {
		let time;
		const filter =  _.find(this.filters[0].seriesData, { selected: true });
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
	}
	/**
	 * Function to update pagination
	 * @param searchText will have the device details
	 * @returns new table details
	 */
	public onSearchQuery (searchText: string) {
		this.searchQueryString = searchText;
		const params = this.getFilterDetailsForSearchQuery(this.searchQueryString);

		return this.riskmitigationservice.getSearchedData(params)
				.pipe(
					takeUntil(this.destroy$),
					map((results: any) => {
						this.crashedAssetsGridDetails.tableData = results.deviceDetails;
						this.crashedAssetsGridDetails.totalItems = results.deviceDetails.length;
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
			this.getCrashedDeviceHistory();
		} else { this.selectedAsset = undefined; }
	}
	/**
	 * Function to open close FP page
	 */
	public onFPDPanelClose () {
		this.showFpDetails = false;
	}
	// tslint:disable-next-line: valid-jsdoc
	/**
	 * Function to update pagination
	 */
	public connectToFpDetails (asset: any) {
		this.showFpDetails = true;
		this.selectedFingerPrintdata = asset;
	}
	/**
	 * Function to open close Asse360
	 */
	public onPanelClose () {
		this.selectedAsset = undefined;
		this.showAsset360 = false;
	}
	// tslint:disable-next-line: valid-jsdoc
	/**
	 * Function callback to table sort
	 */
	public onTableSortingChanged (event) {
		 const params = this.getFilterDetailsForSearchQuery(this.searchQueryString);
		 params.key = event.key;
		 params.sortDirection = event.sortDirection;

		 return this.riskmitigationservice.getSearchedData(params)
			 .pipe(
				map((results: any) => {
					this.crashedAssetsGridDetails.tableData = results.deviceDetails;
					this.crashedAssetsGridDetails.totalItems = results.deviceDetails.length;
				}),
				catchError(err => {
					this.crashedAssetsGridDetails.tableData   = [];
					this.logger.error('Crash Assets : onTableSortingChanged() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			)
			.subscribe();
	}
	/**
	 * Asset360 toggle
	 */
	public reDirectToAsset360 () {
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
					name: I18n.get('_RMProductId'),
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
					name: I18n.get('_RMProductId'),
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
		advisoryFilter.seriesData = (data) ? data : '';
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
	 */

	public onSubfilterSelect (subfilter: string, filter: Filter) {
		this.resetFilters();
		const sub = _.find(filter.seriesData, { filter: subfilter });
		sub.selected = (sub) ? !sub.selected : '';
		filter.selected = _.some(filter.seriesData, 'selected');
		switch (sub.filter) {
			case 'Time: Last 24h': {
				// tslint:disable-next-line: no-parameter-reassignment
				subfilter = '1';
				break;
			}
			case 'Time: Last 7d': {
				// tslint:disable-next-line: no-parameter-reassignment
				subfilter = '7';
				break;
			}
			case 'Time: Last 30d': {
				// tslint:disable-next-line: no-parameter-reassignment
				subfilter = '30';
				break;
			}
			case 'Time: Last 90d': {
				// tslint:disable-next-line: no-parameter-reassignment
				subfilter = '90';
				break;
			}
		}
		this.getDeviceDetails(subfilter);
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
