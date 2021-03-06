import {
	Component, OnInit, OnDestroy, ViewChild, TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions, CuiTableColumnOption } from '@cisco-ngx/cui-components';
import {
	RccService,
	RccGridData,
	RccGridDataSample,
	RccAssetGridData,
	RccAssetGridDataSample,
	violationGridParams,
	assetGridParams,
	Filter,
	InventoryService,
	RacetrackSolution,
	RacetrackTechnology,
} from '@sdp-api';
import { UserResolve } from '@utilities';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { FormControl, FormGroup } from '@angular/forms';
import { FromNowPipe } from '@cisco-ngx/cui-pipes';
import { ActivatedRoute } from '@angular/router';
import { DetailsPanelStackService, AssetPanelLinkService, RacetrackInfoService } from '@services';
import { AssetLinkInfo, Panel360 } from '@interfaces';
import { UserRoles } from '@constants';

/**
 * Main component for the RCC track
 */
@Component({
	selector: 'app-rcc',
	styleUrls: ['./rcc.component.scss'],
	templateUrl: './rcc.component.html',
})
export class RccComponent implements OnInit, Panel360 , OnDestroy {
	public customerId: string;
	public cxLevel: number;
	public authParamsRCCUser = {
		blacklistRoles: UserRoles.SA_ADMIN,
	};
	public authParamsRCCAdmin = {
		whitelistRoles: UserRoles.SA_ADMIN,
	};

	constructor (
		private logger: LogService,
		public RccTrackService: RccService,
		public userResolve: UserResolve,
		public fromNow: FromNowPipe,
		private route: ActivatedRoute,
		private detailsPanelStackService: DetailsPanelStackService,
		private assetPanelLinkService: AssetPanelLinkService,
		private racetrackInfoService: RacetrackInfoService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.cxLevel = _.get(user, ['service', 'cxLevel'], 0);
	}
	get selectedFilters () {
		return _.filter(this.filters, 'selected');
	}
	public assetParams: InventoryService.GetAssetsParams;
	public assetLinkInfo: AssetLinkInfo;
	public selectedAssetSerial: string;
	public view: 'violation' | 'asset' = 'violation';
	public totalViolationsCount = { };
	public policyViolationsTableOptions: CuiTableOptions;
	public assetTableOptions: CuiTableOptions;
	public destroy$ = new Subject();
	public tableConfig = {
		tableLimit: 10,
		tableOffset: 0,
		totalItems: 0,
	};
	public paginationConfig = {
		pageLimit: 10,
		pageNum: 1,
		pagerLimit: 10,
	};
	public violationPaginationConfig = {
		pageIndex: 1,
		pageSize: 10,
		totalItems: 0,
	};
	public loading = false;
	public filterLoading = false;
	public selectedSolutionName: string;
	public selectedUseCaseName: string;
	public tableData: RccGridData;
	public policyViolationsGridData: RccGridDataSample[] = [];
	public tableAssetData: RccAssetGridData;
	public tableAssetDataSample: RccAssetGridDataSample[] = [];
	public slideinFullScreen = {
		assetsFullScreen : false,
		violationFullScreen : false,
	};
	public fullscreen: any;
	public policyGroup = null;
	public searched: boolean;
	public severity = null;
	public assetOsType = null;
	public assetSeverity = null;
	public criteria = '';
	public assetsTotalCount: number;
	public conditionViolationsAssetCount: number;
	public policyViolationsTotalCount: number;
	public selectedAsset = false;
	public selRowData = [];
	public policyRuleData: object = { };
	public impactedAssetDetails: object = { };
	public isSlider = false;
	public testData = [];
	public errorMessage = ' ';
	public errorPolicyView = false;
	public policyViolationInfo = {
		policyCategory: '',
		policyGroupId: '',
		policyName: '',
		ruleSeverity: '',
		ruleTitle: '',
	};
	public selectedViolationModal = false;
	public selectedAssetData = {
		deviceName: '',
		ipAddress: '',
		lastScan: '',
		serialNumber: '',
	};
	public violationFilterShow = false;
	public systemFilterShow = false;
	public selectedAssetModal = false;
	public openDeviceModal = false;
	public rowData = { };
	public filterObj = [];
	public assetFilterObj = [];
	public isAssetView = false;
	public typeaheadItems: [];
	public defaultTypeaheadItems: [];
	public searchStr = null;
	public searchInput = '';
	public conditionViolations = 0;
	public noTableData = false;
	public assetsConditionViolationsCount = 0;
	public withViolationsAssetsCount;
	public showNoAccessMsg = false;
	public optInStatus = false;
	public scanEnabled = false;
	public showRunningBanner = false;
	public runOnce = false;
	public collectorId = '';
	public nextScheduleTime = '';
	public alert: any = { };
	public lastScan = '';
	public searchOptions = {
		debounce: 1500,
		max: 100,
		min: 1,
		pattern: /^[a-zA-Z0-9\s\-\/\[\]\(\).]*$/,
	};
	public search: FormControl = new FormControl('');
	public searchForm: FormGroup;
	public prevSearchText = '';
	public invalidSearchInput = false;
	/**
	 * method for dropdown for export all
	 */
	public dropdownActions: any[] = [
		{
			label: I18n.get('_ExportAll_'),
		},
	];
	public componentRef: any;
	/**
	 * Visual filters  of rcc component
	 */
	@ViewChild('policyFilter', { static: true }) private policyFilterTemplate: TemplateRef<{ }>;
	@ViewChild('severityFilter', { static: true }) private severityFilterTemplate: TemplateRef<{ }>;
	@ViewChild('severityColor', { static: true }) private severityColorTemplate: TemplateRef<{ }>;
	@ViewChild('severityTemplate', { static: true }) private severityTemplate: TemplateRef<{ }>;
	@ViewChild('ruletitleTemplate', { static: true }) private ruletitleTemplate: TemplateRef<{ }>;
	@ViewChild('lastScanTmpl', { static: true }) public lastScanTemplate: TemplateRef<{ }>;
	@ViewChild('policyCategoryTooltipTemplate', { static: true })
	private policyCategoryTooltipTemplate: TemplateRef<string>;
	@ViewChild('policySeverityTooltipTemplate', { static: true })
	private policySeverityTooltipTemplate: TemplateRef<string>;
	@ViewChild('ruleViolationsTooltipTemplate', { static: true })
	private ruleViolationsTooltipTemplate: TemplateRef<string>;
	public entry: ViewContainerRef;
	private InventorySubject: Subject<{ }>;
	public filters: Filter[];
	public filtered = false;
	public allAssetsSelected = false;
	public status = {
		inventoryLoading: true,
		isLoading: true,
	};
	public violationGridObj: violationGridParams;
	public assetGridObj: assetGridParams;
	/**
	 * ngOnInit method execution
	 */
	public ngOnInit () {
		this.loading = true;
		this.filterLoading = true;
		this.assetsTotalCount = 0;
		this.policyViolationsTotalCount = 0;
		this.searched = true;
		this.view = 'violation';
		this.loadData();
		this.policyViolationsTableOptions = this.getPolicyViolationsTableOptions();
		this.assetLinkInfo = Object.create({ });
		this.searchForm = new FormGroup({
			search: this.search,
		});
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
			if (this.selectedUseCaseName !== _.get(technology, 'name')) {
				this.selectedUseCaseName = _.get(technology, 'name');
				if (this.cxLevel > 1) {
					this.getOptInDetail();
				} else {
					this.loading = false;
					this.filterLoading = false;
					this.showNoAccessMsg = true;
				}
			}
		});
		this.detailsPanelStackService.push(this);
	}
	/**
	 * to check the opt-in/opt-out status for loggedin user
	 */
	public getOptInDetail () {
		this.loading = true;
		this.filterLoading = true;
		this.assetsTotalCount = 0;
		this.policyViolationsTotalCount = 0;
		this.violationFilterShow = false;
		this.systemFilterShow = false;
		this.conditionViolations = 0;
		this.conditionViolationsAssetCount = 0;
		this.withViolationsAssetsCount = 0;
		this.assetsConditionViolationsCount = 0;
		if (this.filters) {
			_.each(this.filters, (filter: Filter) => {
				filter.selected = false;
				_.each(filter.seriesData, f => {
					f.selected = false;
				});
			});
		}
		this.isAssetView = false;
		this.optInStatus = false;
		this.runOnce = false;
		this.showRunningBanner = false;
		this.violationGridObj.policyType = null;
		this.violationGridObj.severity = null;
		this.allAssetsSelected = false;
		this.searchStr = null;
		this.searchInput = '';
		this.assetGridObj.osType = null;
		this.assetGridObj.severity = null;
		this.assetGridObj.searchParam = null;
		this.violationGridObj.search = null;
		this.violationGridObj.pageIndex = 1;
		this.violationGridObj.sortName = null;
		this.violationGridObj.sortOrder = null;
		this.policyViolationsGridData = [];
		this.tableAssetDataSample = [];
		this.filterObj = [];
		this.assetFilterObj = [];
		this.tableConfig.totalItems = 0;
		this.tableConfig.tableOffset = 0;
		this.RccTrackService.
		optInDetail({ customerId: this.customerId })
		.pipe(takeUntil(this.destroy$))
			.subscribe(status => {
				this.optInStatus = _.get(status, ['data', 'rccOptInStatus']);
				this.runOnce = _.get(status, ['data', 'runOnce']);
				if (this.optInStatus) {
					if (this.runOnce) {
						this.buildFilters();
						this.getRCCData(this.violationGridObj);
						this.getFiltersData();
					} else {
						this.getBannerTimeStamp();
					}
				} else {
					this.loading = false;
					this.filterLoading = false;
				}
			},
			error => {
				this.loading = false;
				this.filterLoading = false;
				this.logger.error(
					'RccComponent : getOptInDetail() ' +
				`:: Error : (${error.status}) ${error.message}`);
				this.errorPolicyView = true;
			},
		);
	}
	/**
	 * to get the timestamp for next compliance run
	 */
	public getBannerTimeStamp () {
		this.RccTrackService.
		getScheduleTime({ customerId: this.customerId })
		.pipe(takeUntil(this.destroy$))
			.subscribe(response => {
				if (response.status === 200 && response.message === 'success') {
					this.nextScheduleTime = _.get(response.data[0], ['nextSchedule']);
				}
				this.showRunningBanner = true;
				this.filterLoading = false;
				this.loading = false;
			},
			error => {
				this.loading = false;
				this.logger.error(
					'RccComponent : getBannerTimeStamp() ' +
				`:: Error : (${error.status}) ${error.message}`);
			},
		);
	}
	/**
	 * to load data on page load
	 */
	public loadData () {
		this.violationGridObj = {
			criteria: this.criteria,
			customerId: this.customerId,
			pageIndex: this.paginationConfig.pageNum,
			pageSize: this.paginationConfig.pageLimit,
			policyType: this.policyGroup,
			search: this.searchInput,
			severity: this.severity,
		};
		this.assetGridObj = {
			criteria: this.criteria,
			customerId: this.customerId,
			osType: this.assetOsType,
			pageLimit: this.paginationConfig.pageNum,
			pageNum: this.paginationConfig.pageNum,
			searchParam: this.searchInput,
			severity: this.assetSeverity,
		};
	}
	/**
	 * Gets selected sub filters
	 * @returns selected filters
	 */
	public getPolicyViolationsTableOptions () {
		return new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'ruleSeverity',
					name: I18n.get('_RccHighestSeverity_'),
					sortable: true,
					template: this.severityColorTemplate,
					width: '13%',
				},
				{
					key: 'policyGroupName',
					name: I18n.get('_RccRegulatoryType_'),
					sortable: true,
				},
				{
					headerTemplate:  this.policyCategoryTooltipTemplate,
					key: 'policyCategory',
					sortable: true,
					width: '10%',
				},
				{
					key: 'ruleTitle',
					name: I18n.get('_RccRuleViolated_'),
					sortable: true,
					template: this.ruletitleTemplate,
				},
				{
					headerTemplate:  this.ruleViolationsTooltipTemplate,
					key: 'violationCount',
					sortable: true,
					width: '14%',
				},
				{
					key: 'impAssetsCount',
					name: I18n.get('_RccAffectedSystems_'),
					sortable: true,
				},
			],
			dynamicData: true,
			hover: true,
			singleSelect: true,
			striped: false,
			wrapText: true,
		});
	}
	/**
	 * Gets selected sub filters
	 * @param violationGridObj pagenumber
	 * @returns selected filters
	 */
	public getRCCData (violationGridObj: violationGridParams) {
		this.loading = true;
		this.policyViolationsGridData = [];
		this.RccTrackService
			.getGridData(violationGridObj)
			.pipe(takeUntil(this.destroy$))
			.subscribe(gridData => {
				this.tableData = gridData;
				const responseData = gridData.data;
				this.policyViolationsGridData = responseData.summary;
				this.conditionViolations = responseData.violationcount;
				this.conditionViolationsAssetCount = responseData.impassets;
				if (this.policyViolationsGridData && this.policyViolationsGridData.length > 0) {
					this.violationPaginationConfig.totalItems
						= responseData.totalcount;
					this.noTableData = false;
				} else {
					this.noTableData = true;
				}
				this.loading = false;
				this.errorPolicyView = false;
			},
			error => {
				this.loading = false;
				this.noTableData = false;
				this.alert.show(I18n.get('_RccErrorResults_'), 'danger');
				this.logger.error(
					'RccComponent : getRCCData() ' +
				`:: Error : (${error.status}) ${error.message}`);
				this.errorPolicyView = true;
			},
		);
	}
	/**
	 * Gets selected sub filters
	 * @param assetGridObj pagenumber
	 * @returns selected filters
	 */
	public getRCCAssetData (assetGridObj: assetGridParams) {
		this.loading = true;
		this.tableAssetDataSample = [];
		this.RccTrackService
			.getAssetGridData(assetGridObj)
			.subscribe(assetGridData => {
				this.tableAssetData = assetGridData;
				this.tableAssetDataSample = assetGridData.data.assetList;
				this.assetsConditionViolationsCount = assetGridData.data.totalViolationCount;
				this.withViolationsAssetsCount = assetGridData.data.totalViolatedDevices;
				if (this.tableAssetDataSample && this.tableAssetDataSample.length > 0) {
					this.tableConfig.totalItems = this.tableAssetDataSample.length;
					this.noTableData = false;
				} else {
					this.noTableData = true;
				}
				this.loading = false;
				this.errorPolicyView = false;
			},
			error => {
				this.loading = false;
				this.noTableData = false;
				this.errorPolicyView = true;
				this.alert.show(I18n.get('_RccErrorResults_'), 'danger');
				this.logger.error(
					'RccComponent : getRCCAssetData() ' +
				`:: Error : (${error.status}) ${error.message}`);
			},
		);
	}
	/**
	 * Gets row selected
	 * @param policyViolationInfo object
	 * @returns opens slider
	 */
	public onViolationRowClicked (policyViolationInfo: any) {
		this.policyViolationInfo = policyViolationInfo;
		this.selectedViolationModal = true;
		this.selectedAssetModal = false;
		this.openDeviceModal = false;
		this.detailsPanelStackService.reset();
	}
	/**
	 * Gets row selected
	 * @param rowData object
	 * @returns opens slider
	 */
	public onAssetRowClicked (rowData: any) {
		this.rowData = rowData;
		this.selectedAssetData = rowData;
		this.lastScan = rowData.lastScan;
		this.selectedAssetModal = true;
		this.selectedViolationModal = false;
		this.openDeviceModal = false;
		this.detailsPanelStackService.reset();
	}
	/**
	 * Gets selected sub filters
	 * @param pageNum pagenumber
	 * @param pageLimt page limit
	 * @param policyGroup is policy group
	 * @param severity key
	 * @returns selected filters
	 */
	public getFiltersData () {
		this.filterLoading = true;
		this.RccTrackService
			.getViolationCount({ customerId: this.customerId })
			.pipe(takeUntil(this.destroy$))
			.subscribe(filterData => {
				this.filterObj = filterData;
				const filterObjRes = filterData.data;
				const policyFilter = _.find(this.filters, { key: 'policyGroup' });
				policyFilter.seriesData = filterObjRes.policyFilters;
				const severityFilter = _.find(this.filters, { key: 'severity' });
				severityFilter.seriesData = filterObjRes.severityFilters;
				if (policyFilter.seriesData.length || severityFilter.seriesData.length) {
					this.violationFilterShow = true;
				} else {
					this.violationFilterShow = false;
				}
				this.assetsTotalCount = filterObjRes.assetCount;
				this.policyViolationsTotalCount = filterObjRes.policyViolationCount;
				this.filterLoading = false;
			},
			error => {
				this.filterLoading = false;
				this.alert.show(I18n.get('_RccErrorResults_'), 'danger');
				this.logger.error(
					'RccComponent : getFiltersData() ' +
				`:: Error : (${error.status}) ${error.message}`);
			},
		);
	}
	/**
	 * Gets selected sub filters
	 * @param pageNum pagenumber
	 * @param pageLimt page limit
	 * @param policyGroup is policy group
	 * @param severity key
	 * @returns selected filters
	 */
	public getAssetFiltersData () {
		this.filterLoading = true;
		this.RccTrackService
			.getAssetCount({ customerId: this.customerId })
			.pipe(takeUntil(this.destroy$))
			.subscribe(assetFilterData => {
				this.assetFilterObj = assetFilterData;
				const filterObjRes = assetFilterData.data;
				const assetSeverityFilter = _.find(this.filters, { key: 'assetSeverity' });
				assetSeverityFilter.seriesData = filterObjRes.severityList;
				if (assetSeverityFilter.seriesData.length) {
					this.systemFilterShow = true;
				} else {
					this.systemFilterShow = false;
				}
				this.filterLoading = false;
			},
			error => {
				this.filterLoading = false;
				this.logger.error(
					'RccComponent : getAssetFiltersData() ' +
				`:: Error : (${error.status}) ${error.message}`);
			},
		);
	}
	/**
	 * Determines whether pager updated on
	 * @param pageInfo gives page info
	 */
	public onPagerUpdated (pageInfo: any) {
		this.tableConfig.tableOffset = pageInfo.page;
		this.violationGridObj.pageIndex = pageInfo.page + 1;
		this.getRCCData(this.violationGridObj);
	}
	/**
	 * Determines whether asset pager updated on
	 * @param pageInfo gives page info
	 */
	public onAssetPagerUpdated (pageInfo: any) {
		this.tableConfig.tableOffset = pageInfo.page;
		this.paginationConfig.pageNum = pageInfo.page + 1;
		// this.getRCCAssetData(this.assetGridObj);
	}
	/**
	 * Determines whether pager updated on
	 * @param view gives selected view
	 */
	public selectedView (view: any) {
		this.tableConfig.totalItems = 0;
		this.tableConfig.tableOffset = 0;
		this.policyViolationsGridData = [];
		this.tableAssetDataSample = [];
		_.invoke(this.alert, 'hide');
		this.view = view;
		this.clearFilters();
		if (view === 'violation') {
			this.isAssetView = false;
			this.buildFilters();
			this.getFiltersData();
		} else {
			this.isAssetView = true;
			this.selectedAssetView(view);
		}
		this.openDeviceModal = false;
		this.selectedAssetModal = false;
		this.selectedViolationModal = false;
		this.errorPolicyView = false;
		this.noTableData = false;
	}
	/**
	 * Determines whether pager updated on
	 * @param view gives selected view
	 */
	public selectedAssetView (view: 'violation' | 'asset') {
		this.view = view;
		this.isAssetView = true;
		_.invoke(this.alert, 'hide');
		this.errorPolicyView = false;
		this.noTableData = false;
		this.assetTableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'deviceName',
					name: I18n.get('_RccSystemName_'),
					sortable: true,
					width: '24%',
				},
				{
					key: 'ipAddress',
					name: I18n.get('_RccAssetIpAddress_'),
					sortable: true,
				},
				{
					key: 'osVersion',
					name: I18n.get('_RccAssetSoftwareRelease_'),
					sortable: true,
				},
				{
					key: 'lastScan',
					name: I18n.get('_RccAssetLastScan_'),
					sortable: true,
					sortKey: 'lastScan',
					template: this.lastScanTemplate,
				},
				{
					headerTemplate:  this.ruleViolationsTooltipTemplate,
					key: 'violationCount',
					sortable: true,
				},
				{
					headerTemplate:  this.policySeverityTooltipTemplate,
					key: 'severity',
					sortable: true,
					template: this.severityTemplate,
				},
			],
			dynamicData: false,
			hover: true,
			singleSelect: true,
			striped: false,
			wrapText: true,
		});
		this.buildAssetFilters();
		// this.getRCCAssetData(this.assetGridObj);
		this.getAssetFiltersData();
	}
	/**
	 * method to build filters & to feed data to the filters
	 */
	private buildFilters () {
		this.filters = [
			{
				key: 'policyGroup',
				loading: true,
				seriesData: [],
				template: this.policyFilterTemplate,
				title: I18n.get('_RccRegulatoryType_'),
			},
			{
				key: 'severity',
				loading: true,
				seriesData: [],
				template: this.severityFilterTemplate,
				title: I18n.get('_RccHighestSeverity_'),
			},
		];
	}
	/**
	 * method to build filters & to feed data to the filters
	 */
	private buildAssetFilters () {
		this.filters = [
			{
				key: 'assetSeverity',
				loading: true,
				seriesData: [],
				template: this.severityFilterTemplate,
				title: I18n.get('_RccHighestSeverity_'),
			},
		];
	}
	/**
	 * Determines whether pager updated on
	 * @param subfilter gives page info
	 * @param filter gives page info
	 * @param triggeredFromGraph gives page info
	 */
	public onSubfilterSelect (subfilter: any, filter: Filter, triggeredFromGraph) {
		this.errorPolicyView = false;
		_.invoke(this.alert, 'hide');
		const searchInput = this.searchInput.trim();
		if (this.searchForm.invalid ||
				(!_.isEmpty(searchInput) && searchInput.length < 1)) {
			this.invalidSearchInput = true;

			return;
		}
		if (triggeredFromGraph) {
			filter.seriesData.forEach(obj => {
				obj.selected = false;
				this.filtered = true;
		 	});
		} else {
			let isFilterEmpty = true;
			_.each(this.selectedFilters, (filterItem: Filter) => {
				_.each(filterItem.seriesData, item => {
					if (item.selected) {
						isFilterEmpty = false;

						return;
					}
				});
			});
			if (isFilterEmpty) {
				this.filtered = false;
			}
		}
		const sub = typeof subfilter === 'string' ?
		_.find(filter.seriesData, { filter: subfilter }) : _.find(filter.seriesData, subfilter);
		if (sub) {
			sub.selected = !sub.selected;
		}
		const policyGroupConst = 'policyGroup';
		const severityConst = 'severity';
		const assetOsTypeConst = 'assetOsType';
		const assetSeverityConst = 'assetSeverity';
		(filter.key === policyGroupConst || filter.key === severityConst)
			? this.violationGridObj.search = searchInput
			: this.assetGridObj.searchParam = searchInput;
		this.prevSearchText = searchInput;
		this.searchInput = searchInput;
		if (filter.key === policyGroupConst || filter.key === severityConst) {
			this.policyViolationsTableOptions = this.getPolicyViolationsTableOptions();
			this.violationGridObj.pageIndex = 1;
			this.violationGridObj.sortName = null;
			this.violationGridObj.sortOrder = null;
		}
		if (filter.key === policyGroupConst) {
			this.policyGroup = sub.filter;
			(triggeredFromGraph)
				? this.violationGridObj.policyType = this.policyGroup
				: this.violationGridObj.policyType = null;
			this.getRCCData(this.violationGridObj);
		} else if (filter.key === severityConst) {
			this.severity = sub.filter;
			(triggeredFromGraph)
				? this.violationGridObj.severity = this.severity
				: this.violationGridObj.severity = null;
			this.getRCCData(this.violationGridObj);
		} else if (filter.key === assetOsTypeConst) {
			this.assetOsType = sub.filter;
			(triggeredFromGraph)
				? this.assetGridObj.osType = this.assetOsType
				: this.assetGridObj.osType = null;
			this.getRCCAssetData(this.assetGridObj);
		} else if (filter.key === assetSeverityConst) {
			this.severity = sub.filter;
			(triggeredFromGraph)
				? this.assetGridObj.severity = this.severity
				: this.assetGridObj.severity = null;
			this.getRCCAssetData(this.assetGridObj);
		}
		this.tableConfig.tableOffset = 0;
		filter.selected = _.some(filter.seriesData, 'selected');
	}
	/**
	 * Determines whether pager updated on
	 * @param key gives selected key
	 * @returns selected sub filters
	 */
	public getSelectedSubFilters (key: string) {
		const filter = _.find(this.filters, { key });
		if (filter) {
			return _.filter(filter.seriesData, 'selected');
		}
	}
	/**
	 * method to get violation table sorting selection
	 * @param columnData is sort object
	 */
	public onViolationTableSortingChanged (columnData: CuiTableColumnOption) {
		this.tableConfig.tableOffset = 0;
		this.violationGridObj.pageIndex = 1;
		this.violationGridObj.sortName = columnData.key;
		this.violationGridObj.sortOrder = columnData.sortDirection;
		this.getRCCData(this.violationGridObj);
	}
	/**
	 * method to get asset table sorting selection
	 */
	public onTableSortingChanged () {
		this.tableConfig.tableOffset = 0;
	}
	/**
	 * method to clear selected filters
	 */
	public clearFilters () {
		this.filtered = false;
		_.invoke(this.alert, 'hide');
		this.errorPolicyView = false;
		this.noTableData = false;
		_.each(this.filters, (filter: Filter) => {
			filter.selected = false;
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});
		this.searchInput = '';
		this.invalidSearchInput = false;
		this.prevSearchText = '';
		this.tableConfig.tableOffset = 0;
		if (this.view === 'violation') {
			this.violationGridObj.policyType = null;
			this.violationGridObj.severity = null;
			this.allAssetsSelected = false;
			this.violationGridObj.search = null;
			this.violationGridObj.pageIndex = 1;
			this.violationGridObj.sortName = null;
			this.violationGridObj.sortOrder = null;
			this.policyViolationsTableOptions = this.getPolicyViolationsTableOptions();
			this.getRCCData(this.violationGridObj);
		} else {
			this.assetGridObj.osType = null;
			this.assetGridObj.severity = null;
			this.assetGridObj.searchParam = null;
			this.getRCCAssetData(this.assetGridObj);
		}
	}
	/**
	 * function to be invoked on search clear
	 */
	public clearSearchInput () {
		if (_.isEmpty(this.searchInput)) {
			this.searchViolations(null, 'clear');
		}
	}

	/**
	 * Keys down function
	 * @param event contains eventdata
	 * @param type for enter or search icon click
	 */
	public searchViolations (event: any, type: string) {
		this.invalidSearchInput = false;
		_.invoke(this.alert, 'hide');
		this.errorPolicyView = false;
		this.noTableData = false;
		const searchInput = this.searchInput.trim();
		if (event && event.keyCode === 8 && this.searched) {
			if (!_.isEmpty(searchInput)) {
				return;
			}
			this.searched = false;
		}
		if (this.searchForm.invalid && type !== 'clear'
			&& ((event && event.keyCode && event.keyCode === 13) ||
			type === 'search')) {
			this.invalidSearchInput = true;

			return;
		}
		if (this.prevSearchText.toLowerCase() === searchInput
		.toLowerCase()) { return; }
		if (((event && event.keyCode && event.keyCode === 13) ||
			type === 'search') && (searchInput.length < 1)) {
			this.searchInput = searchInput;
			this.invalidSearchInput = true;

			return;
		}
		if (type === 'clear' || (this.searchForm.valid &&
			(event.keyCode === 8 || (!_.isEmpty(searchInput) &&
			(event && event.keyCode && event.keyCode === 13)
			|| (!_.isEmpty(searchInput) && type === 'search'))))) {
			this.errorPolicyView = false;
			this.invalidSearchInput = false;
			this.prevSearchText = searchInput;
			this.searchInput = searchInput;
			this.tableConfig.tableOffset = 0;
			this.tableConfig.totalItems = 0;
			this.searched = true;
			if (this.view === 'violation') {
				this.policyViolationsTableOptions = this.getPolicyViolationsTableOptions();
				this.violationGridObj.search = searchInput;
				this.violationGridObj.pageIndex = 1;
				this.violationGridObj.sortName = null;
				this.violationGridObj.sortOrder = null;
				this.getRCCData(this.violationGridObj);
			} else {
				this.assetGridObj.searchParam = searchInput;
				this.getRCCAssetData(this.assetGridObj);
			}
		}
		this.tableConfig.tableOffset = 0;
	}
	/**
	 * method to open slider for selected policy
	 * @param selData is the selected row
	 */
	public openSlider (selData: any) {
		this.selRowData = selData;
		this.selectedAsset = true;
	}
	/**
	 * method to close slider
	 * @param model is the selected slider name
	 */
	public onAllPanelsClose () {
		this.selectedAssetModal = false;
		this.selectedViolationModal = false;
		this.detailsPanelStackService.reset();
	}
	/**
	 * Removes the 360 panel from the stack when the back button is pressed
	 */
	public onPanelBack () {
		this.detailsPanelStackService.pop();
	}

	/**
	 * Handles the hidden event from details-panel
	 * @param hidden false if details slideout is open
	 * @param model current model
	 */
	public handleHidden (hidden: boolean) {
		if (hidden) {
			this.onAllPanelsClose();
		}
	}
	/**
	 * to close the panel
	 */
	public onPanelClose () {
		this.openDeviceModal = false;
		this.detailsPanelStackService.pop();
	}
	/**
	 * destroy method to kill the services
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
	/**
	 * Method  to open device slide in
	 * @param serialNumber is serial number of device
	 */
	public openDevicePage (serialNumber: string) {
		this.detailsPanelStackService.push(this);
		this.assetParams = {
			customerId: this.customerId,
			serialNumber: [serialNumber],
		};
		this.selectedAssetSerial = serialNumber;
		this.openDeviceModal = true;
		this.assetPanelLinkService.getAssetLinkData(this.assetParams)
		.pipe(takeUntil(this.destroy$))
		.subscribe(response => {
			this.assetLinkInfo.asset = _.get(response, [0, 'data', 0]);
			this.assetLinkInfo.element = _.get(response, [1, 'data', 0]);
		},
			err => {
				this.logger.error(
					'RccComponent : getAssetLinkData() ' +
				`:: Error : (${err.status}) ${err.message}`);
			});
	}
}
