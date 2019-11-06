import { Component, TemplateRef, ViewChild } from '@angular/core';
import { forkJoin, of, Subject } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import { AssetPanelLinkService, RacetrackInfoService } from '@services';
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
	InventoryService,
	HighCrashRiskDeviceTooltip,
	RacetrackSolution,
	RacetrackTechnology,
} from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import { AssetLinkInfo } from '@interfaces';

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
	public searchQueryInCrashGrid: String = '';
	public searchQueryInHighCrashGrid: String = '';
	public searchOptions = {
		debounce: 1500,
		max: 200,
		min: 0,
	};
	public selectedFilters;
	public hcrPagination;
	public paginationParams = {
		limit: 10,
		page: 0,
	};
	public crashPagination: string;
	public assetParams: InventoryService.GetAssetsParams;
	public assetLinkInfo: AssetLinkInfo = Object.create({ });

	public crashedAssetsCount = 0;
	private selectedSolutionName: string;
	private selectedTechnologyName: string;

	constructor (
		private riskMitigationService: RiskMitigationService,
		private assetPanelLinkService: AssetPanelLinkService,
		private logger: LogService,
		private route: ActivatedRoute,
		private racetrackInfoService: RacetrackInfoService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}

	@ViewChild('contextualMenuTemplate',
	{ static: true }) private contextualMenuTemplate: TemplateRef<string>;
	@ViewChild('cardColors', { static: true }) public cardColorsTemplate: TemplateRef<string>;
	@ViewChild('lastOccuranceTemplate', { static: true })
	public lastOccuranceTemplate: TemplateRef<string>;
	@ViewChild('firstOccuranceTemplate', { static: true })
	 public firstOccuranceTemplate: TemplateRef<string>;
	@ViewChild('swVersionTemplate', { static: true }) public swVersionTemplate: TemplateRef<string>;
	@ViewChild('swTypeCrahsedTemplate', { static: true })
	public swTypeCrahsedTemplate: TemplateRef<string>;
	@ViewChild('riskScoreTemplate', { static: true }) public riskScoreTemplate: TemplateRef<string>;
	@ViewChild('neNameTemplate', { static: true }) public neNameTemplate: TemplateRef<string>;
	@ViewChild('productIdTemplate', { static: true }) public productIdTemplate: TemplateRef<string>;
	@ViewChild('productFamilyTemplate', { static: true })
		public productFamilyTemplate: TemplateRef<string>;
	@ViewChild('deviceNameTemplate', { static: true })
		public deviceNameTemplate: TemplateRef<string>;
	@ViewChild('softwareTypeTemplate', { static: true })
		public softwareTypeTemplate: TemplateRef<string>;
	@ViewChild('resetReasonTemplate', { static: true })
		public resetReasonTemplate: TemplateRef<string>;
	@ViewChild('softwareVersionTemplate', { static: true })
		public softwareVersionTemplate: TemplateRef<string>;
	@ViewChild('timeStampTemplate', { static: true })
		public timeStampTemplate: TemplateRef<string>;
	@ViewChild('riskTooltipTemplate', { static: true })
		public riskTooltipTemplate: TemplateRef<string>;
	@ViewChild('riskScoreFilterTemplate', { static: true })
		public riskScoreFilterTemplate: TemplateRef<string>;

	public openPanel = false;
	public fullscreen = false;
	public filters: Filter[];
	public onlyCrashes = true;
	public selectedAsset: RiskAsset = { active: false };
	public selectedFingerPrintdata: HighCrashRiskDevices;
	public showAsset360 = false;
	public isCrashHistoryLoading = false;
	public highCrashRiskParams: HighCrashRiskPagination;
	public crashHistoryParams: CrashHistoryDeviceCount;
	public highCrashDeviceCount = 0;
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
		isLoading: true,
	};

	/**
	 * Load data of risk details
	 */
	public loadData () {
		this.status.isLoading = true;
		this.highCrashRiskParams = {
			customerId: _.cloneDeep(this.customerId),
			page: 0,
			search: '',
			size: 10,
			sort: '',
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		};
		this.status.isLoading = true;
		forkJoin(
			this.getAllCrashesData(),
			this.getHighCrashesDeviceData(),
		)
		.subscribe(() => {
			this.status.isLoading = false;
		});
		this.getDeviceDetails('1');
		this.onlyCrashes = true;
	}

	/**
	 * Selected filter is for to assign default filter on page loads.
	 */
	public selectedTimeFilters () {
		if (this.selectedFilters !== undefined) {
			this.resetFilters();
			_.filter(this.filters, 'selected');
			this.selectedFilters = this.filters;
			this.selectedFilters[0].seriesData[0].selected = true;
		}
  	 }
	/**
	 * Gets high crashes device data
	 * @param searchString will have search string
	 * @returns  the crashed device data
	 */
	public getHighCrashesDeviceData () {
		this.highCrashRiskAssetsGridDetails.tableOffset = this.highCrashRiskParams.page;
		this.showAsset360 = false;
		this.onlyCrashes = true;
		if (_.get(this.filters, [0, 'selected'])) {
			this.filters[0].selected = false;
		}
		this.highCrashRiskParams.globalRiskRank = 'HIGH';
		this.getFingerPrintDeviceDetails(this.highCrashRiskParams);
		const params = _.pick(_.cloneDeep(this.highCrashRiskParams), [
			'customerId',
			'solution',
			'useCase',
		]);
		this.status.isLoading = true;

		return this.riskMitigationService.getHighCrashRiskDeviceCountData(params)
				.pipe(
					takeUntil(this.destroy$),
					map((results: HighCrashRiskDeviceCount) => {
						this.status.isLoading = false;
						this.highCrashDeviceCount = results.crashRiskDeviceCount.high;
						this.getRiskScore(results.crashRiskDeviceCount);
					}),
					catchError(err => {
						this.status.isLoading = false;
						this.highCrashDeviceCount = 0;
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
		const params = _.pick(_.cloneDeep(this.highCrashRiskParams), [
			'customerId',
			'solution',
			'useCase',
		]);
		this.onlyCrashes = false;
		this.filters[0].selected = true;

		return this.riskMitigationService.getAllCrashesData(params)
			.pipe(
				takeUntil(this.destroy$),
				map((results: any) => {
					const seriesData = this.marshallResultsObjectForGraph(results);
					this.last24hrsData = results.devicesCrashCount_1d;
					this.crashedAssetsCount = this.last24hrsData;
					this.getAdvisoryCount(seriesData);
				}),
				catchError(err => {
					this.last24hrsData = undefined;
					this.crashedAssetsCount = undefined;
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
	 * Fetches the all the crashes data
	 * @param timePeriod time period
	 * @returns the total crashes observable
	 */
	public getDeviceDetails (timePeriod: string) {
		const params = _.pick(_.cloneDeep(this.highCrashRiskParams), [
			'customerId',
			'solution',
			'useCase',
		]);
		this.crashedAssetsGridDetails.tableData = [];
		if (timePeriod) {
			params.timePeriod = timePeriod;
		} else {
			_.unset(params, 'timePeriod');
		}
		this.status.isLoading = true;

		return this.riskMitigationService.getDeviceDetails(params)
				.pipe(
					takeUntil(this.destroy$),
					map((results: RiskAssets) => {
						this.status.isLoading = false;
						this.crashedAssetsGridDetails.tableData = results.deviceDetails;
						this.crashedAssetsGridDetails.totalItems = _.size(results.deviceDetails);
						this.crashedAssetsGridDetails.tableOffset = 0;

						this.paginationParams.page = 0;
						this.updatePagerDetails();
					}),
					catchError(err => {
						this.status.isLoading = false;
						this.crashedAssetsGridDetails.tableData = [];
						this.logger.error('Crash Assets : getDeviceDetails() ' +
							`:: Error : (${err.status}) ${err.message}`);

						return of({ });
					}),
				)
				.subscribe();
	}
	/**
	 * Updates the crashed grid pagination details
	 */
	public updatePagerDetails () {
		let first = (this.paginationParams.page * 10) + 1;
		let last = (this.paginationParams.page * 10) +
		this.paginationParams.limit;
		if (first > this.crashedAssetsGridDetails.totalItems) {
			first = this.crashedAssetsGridDetails.totalItems;
		}
		if (last > this.crashedAssetsGridDetails.totalItems) {
			last = this.crashedAssetsGridDetails.totalItems;
		}
		this.crashPagination = `${first}-${last}`;
	}

	/**
	 * get the finger print device details
	 * @param param service params
	 * @returns observable of crash devices
	 */
	public getFingerPrintDeviceDetails (param: HighCrashRiskPagination) {
		this.status.isLoading = true;

		return this.riskMitigationService.getFingerPrintDeviceDetailsData(param)
						.pipe(
							takeUntil(this.destroy$),
							map((results: HighCrashRisk) => {
								this.status.isLoading = false;
								this.highCrashRiskAssetsGridDetails.tableData = results.devices;
								this.highCrashRiskAssetsGridDetails.totalItems = results.count;
								this.highCrashRiskAssetsGridDetails.tableOffset = param.page;

								let first = (this.highCrashRiskParams.page * 10) + 1;
								const last = (this.highCrashRiskParams.page * 10) +
								this.highCrashRiskAssetsGridDetails.tableData.length;
								if (first > this.highCrashRiskAssetsGridDetails.totalItems) {
									first = this.highCrashRiskAssetsGridDetails.totalItems;
								}
								this.hcrPagination = `${first}-${last}`;

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
		this.isCrashHistoryLoading = true;
		this.crashHistoryParams = {
			customerId: _.cloneDeep(this.customerId),
			neInstanceId: asset.neInstanceId,
		};

		return this.riskMitigationService.getCrashHistoryForDevice(this.crashHistoryParams)
							.pipe(
								takeUntil(this.destroy$),
								map((results: any) => {
									this.crashHistoryGridDetails.tableData = results.crashes;
									this.isCrashHistoryLoading = false;
								}),
								catchError(err => {
									this.crashHistoryGridDetails.tableData  = [];
									this.isCrashHistoryLoading = true;
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
		this.paginationParams.page = pageInfo.page;
		this.updatePagerDetails();
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
		if (filter) {
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
		 } else {
			time = '1';
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
	 * @param params have the search string
	 * @returns new table details
	 */
	public searchInCrashedAssetsGrid (params) {
		this.status.isLoading = true;

		return this.riskMitigationService.getSearchedData(params)
				.pipe(
					takeUntil(this.destroy$),
					map((results: any) => {
						this.status.isLoading = false;
						this.crashedAssetsGridDetails.tableData = results.deviceDetails;
						this.crashedAssetsGridDetails.totalItems = results.deviceDetails.length;
						this.crashedAssetsGridDetails.tableOffset = 0;

						this.paginationParams.page = 0;
						this.updatePagerDetails();
					}),
					catchError(err => {
						this.status.isLoading = false;
						this.crashedAssetsGridDetails.tableData   = [];
						this.logger.error('Crash Assets : onSearchQuery() ' +
							`:: Error : (${err.status}) ${err.message}`);

						return of({ });
					}),
				)
				.subscribe();
	}

	/**
	 * Function to update pagination
	 * @param searchText will have the device details
	 * @returns new table details
	 */
	public onSearchQuery (searchText: string) {

		if (!this.onlyCrashes) {
			this.searchQueryInCrashGrid = searchText;
			const params = this.getFilterDetailsForSearchQuery(this.searchQueryInCrashGrid);
			this.searchInCrashedAssetsGrid(params);
		} else {
			this.searchQueryInHighCrashGrid = searchText;
			this.highCrashRiskParams.page = 0;
			this.highCrashRiskParams.search = searchText;
			this.highCrashRiskParams.size = 10;
			this.getFingerPrintDeviceDetails(this.highCrashRiskParams);
		}

	}
	/**
	 * Function to capture the row click on grid
	 * @param event will have the device details
	 */
	public highCrashTableSorted (event) {
		if (event.key === 'globalRiskRank') { event.key = 'riskScore'; }
		this.highCrashRiskParams.sort = `${event.key}.${event.sortDirection}`;
		 this.getFingerPrintDeviceDetails(this.highCrashRiskParams);
	}
	/**
	 * Function to capture the row click on grid
	 * @param asset will have the device details
	 * @returns Network element
	 */
	public onRowClicked (asset: any) {
		this.showAsset360 = false;
		if (asset.active) {
			this.selectedAsset = asset;
			this.getCrashedDeviceHistory(asset);
			this.getAssetLinkInfo(asset);
		} else {
			this.selectedAsset.active = false;
		}
	}

	/**
	 * Function to capture the row click on grid
	 * @param asset will have the device details
	 * @returns Network element
	 */
	public getAssetLinkInfo (asset) {
		this.assetParams = {
			customerId: JSON.stringify(this.customerId),
			serialNumber: [asset.serialNumber],
		};

		return this.assetPanelLinkService.getAssetLinkData(this.assetParams)
			.subscribe(response => {
				this.assetLinkInfo.asset = _.get(response, [0, 'data', 0]);
				this.assetLinkInfo.element = _.get(response, [1, 'data', 0]);
			});
	}
	/**
	 * Determines whether fpdpanel close on click
	 */
	public onFPDPanelClose () {
		_.set(this.selectedFingerPrintdata, 'active', false);
		this.showFpDetails = false;
		_.set(this.selectedFingerPrintdata, 'active', false);
		this.selectedFingerPrintdata = null;
	}

	/**
	 * Connects to fp details
	 * @param asset is selected asset from grid
	 */

	public connectToFpDetails (asset: any) {
		if (_.get(asset, 'active')) {
			this.showFpDetails = true;
			this.selectedFingerPrintdata = asset;
			this.getAssetLinkInfo(asset);
		} else {
			this.onFPDPanelClose();
		}
	}

	/**
	 * Determines whether panel close on when grids open details of asset
	 */
	public onPanelClose () {
		_.set(this.selectedAsset, 'active', false);
		_.set(this.selectedFingerPrintdata, 'active', false);
		this.showAsset360 = false;
		this.onFPDPanelClose();
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
	 * Determines whether table sorting changed on
	 * @param event is get sorting event
	 * @returns  params from sorting data
	 */
	public onTableSortingChanged (event) {
		 const params = this.getFilterDetailsForSearchQuery(this.searchQueryInCrashGrid);
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
		this.selectedAsset.deviceName = this.selectedAsset.neName;
	}

	/**
	 * Used to select which tab we want to view the data for
	 * @param tab the tab we've clicked on
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.racetrackInfoService.getCurrentSolution()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((solution: RacetrackSolution) => {
			this.selectedSolutionName = _.get(solution, 'name');
		});

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((technology: RacetrackTechnology) => {
			if (this.selectedTechnologyName !== _.get(technology, 'name')) {
				this.selectedTechnologyName = _.get(technology, 'name');
				this.loadData();
			}
		});

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
					width: '356px',
					template: this.resetReasonTemplate,
				},
				{
					key: 'timeStamp',
					name: I18n.get('_RMTimeStamp_'),
					sortable: false,
					template: this.timeStampTemplate,
				}],
		});
		this.crashesAssetsGridOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'neName',
					name: I18n.get('_RMAsset_'),
					sortable: true,
					template: this.neNameTemplate,
				},
				{
					key: 'productId',
					name: I18n.get('_RMProductId_'),
					sortable: true,
					template: this.productIdTemplate,
				},
				{
					key: 'swType',
					name: I18n.get('_RMSoftwareType_'),
					sortable: true,
					template: this.swTypeCrahsedTemplate,
				},
				{
					key: 'swVersion',
					name: I18n.get('_RMSoftwareVersion_'),
					sortable: true,
					template: this.swVersionTemplate,
				},
				{
					key: 'firstOccurrence',
					name: I18n.get('_RMFirstOccurance_'),
					sortable: false,
					template: this.firstOccuranceTemplate,
				},
				{
					key: 'lastOccurrence',
					name: I18n.get('_RMLastOccurance_'),
					sortable: false,
					template: this.lastOccuranceTemplate,
				},
			],
			dynamicData: false,
			hover: true,
			singleSelect: true,
			striped: false,
		});
		this.highCrashRiskAssetsGridOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'deviceName',
					name: I18n.get('_RMAsset_'),
					sortable: true,
					template: this.deviceNameTemplate,
				},
				{
					key: 'productId',
					name: I18n.get('_RMProductId_'),
					sortable: true,
					template: this.productIdTemplate,
				},
				{
					key: 'softwareType',
					name: I18n.get('_RMSoftwareType_'),
					sortable: true,
					template: this.softwareTypeTemplate,
				},
				{
					key: 'softwareVersion',
					name: I18n.get('_RMSoftwareVersion_'),
					sortable: true,
					template: this.softwareVersionTemplate,
				},
				{
					headerTemplate:  this.riskTooltipTemplate,
					key: 'globalRiskRank',
					sortable: true,
					template: this.cardColorsTemplate,
				},
			],
			dynamicData: false,
			hover: true,
			singleSelect: true,
			striped: false,
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
				title: '',
			},
			{
				key: 'riskScore',
				loading: true,
				seriesData: [],
				template: this.riskScoreFilterTemplate,
				title:  I18n.get('_CP_Risk_'),
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
		this.crashedAssetsCount = sub.value;
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
		if (filter.key === 'advisories') {
			this.getDeviceDetails(filterSelected);
		} else {
			this.highCrashRiskParams.globalRiskRank = subfilter;
			this.getFingerPrintDeviceDetails(this.highCrashRiskParams);

		}
	}

	/**
	 * Function used to clear the filters
	 */
	public clearFilters () {
		this.clearAllFilters = !this.clearAllFilters;
		this.searchQueryInCrashGrid = '';
		_.each(this.filters, (clearFilter: Filter) => {
			_.each(clearFilter.seriesData, (currentFilter: { selected: boolean; }) => {
				currentFilter.selected = false;
			});
		});
		this.resetFilters();
		this.getDeviceDetails('1');
		const filter = _.find(this.filters, { key: 'advisories' });
		if (filter) {
			filter.seriesData[0].selected = true;
		}
		this.filters[0] = filter;
		this.getSelectedSubFilters('advisories');
		this.selectedFilters = this.filters;
		this.selectedTimeFilters();
		this.crashedAssetsCount = this.last24hrsData;
	}

	/**
	 * Function used to reset the filters
	 */
	public resetFilters () {
		this.searchQueryInCrashGrid = '';
		this.searchQueryInHighCrashGrid = '';
		_.each(this.filters, (filter: Filter) => {
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
				label: I18n.get('_High_'),
				selected: true,
				value: result.high,
			},
			{
				filter: 'LOW',
				label: I18n.get('_Low_'),
				selected: false,
				value: result.low,
			},
			{
				filter: 'MED',
				label: I18n.get('_Medium_'),
				selected: false,
				value: result.med,
			},
			{
				filter: 'Not Evaluated',
				label: I18n.get('_CP_NotEvaluated'),
				selected: false,
				value: result.notEvaluated,
			},
		]);

	}

}
