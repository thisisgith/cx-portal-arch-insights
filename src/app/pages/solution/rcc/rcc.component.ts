import {
	Component, OnInit, OnDestroy, ViewChild, TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import {
	RccService,
	RccGridData,
	RccGridDataSample,
	RccAssetGridData,
	RccAssetGridDataSample,
	Filter,
} from '@sdp-api';
import { UserResolve } from '@utilities';
import { Subscription, forkJoin, Subject, of } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { FormControl, FormGroup } from '@angular/forms';
import { FromNowPipe } from '@cisco-ngx/cui-pipes';

/**
 * Main component for the RCC track
 */
@Component({
	selector: 'app-rcc',
	styleUrls: ['./rcc.component.scss'],
	templateUrl: './rcc.component.html',
})
export class RccComponent implements OnInit, OnDestroy {
	constructor (
		private logger: LogService,
		public RccTrackService: RccService,
		public userResolve: UserResolve,
		public fromNow: FromNowPipe,
	) {
		this.logger.debug('Best practices Component Created!');
	}
	get selectedFilters () {
		return _.filter(this.filters, 'selected');
	}
	public view = 'violation';
	public countSubscripion: Subscription;
	public gridSubscripion: Subscription;
	public gridAssetSubscripion: Subscription;
	public gridViolationsSubscripion: Subscription;
	public totalViolationsCount = { };
	public policyViolationsTableOptions: CuiTableOptions;
	public assetTableOptions: CuiTableOptions;
	public destroy$ = new Subject();
	public tableConfig = {
		tableLimit: 10,
		tableOffset: 0,
		totalItems: 15,
	}
	public paginationConfig = {
		pageLimit: 10,
		pageNum: 1,
		pagerLimit: 10,
	}
	public loading = false;
	public tableData: RccGridData;
	public policyViolationsGridData: RccGridDataSample[];
	public tableAssetData: RccAssetGridData;
	public tableAssetDataSample: RccAssetGridDataSample[];

	public policyGroup = null;
	public severity = null;
	public criteria = '';
	public assetCount: number;
	public policyViolationCount: number;
	public selectedAsset = false;
	public selRowData = [];
	public policyRuleData: object = {};
	public impactedAssetDetails: object = {};
	public isSlider = false;
	public customerId = '90019449';
	public testData = [];
	public policyViolationInfo = { };
	public selectedViolationModal = false;
	public selectedAssetData = [];
	public selectedAssetModal = false;
	public rowData = { };
	public filterObj = [];
	public assetFilterObj = [];
	public filterObjData = { };
	public assetFilterObjData = { };
	public isAssetView = false;
	public typeaheadItems: [];
	public defaultTypeaheadItems: [];
	public searchStr = null;
	public searchInput = '';
	public searchOptions = {
		debounce: 1500,
		max: 100,
		min: 3,
		pattern: /^[a-zA-Z ]*$/,
	};
	public search: FormControl = new FormControl('');
	public searchForm: FormGroup;
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
	@ViewChild('policyFilter', { static: true }) private policyFilterTemplate: TemplateRef<{}>;
	@ViewChild('severityFilter', { static: true }) private severityFilterTemplate: TemplateRef<{}>;
	@ViewChild('severityColor', { static: true }) private severityColorTemplate: TemplateRef<{}>;
	@ViewChild('tableIcon', { static: true }) private tableIconTemplate: TemplateRef<{ }>;
	@ViewChild('assetSlider', { read: ViewContainerRef, static: true })
	public entry: ViewContainerRef;
	private InventorySubject: Subject<{ }>;
	public filters: Filter[];
	public filtered = false;
	public allAssetsSelected = false;
	public status = {
		inventoryLoading: true,
		isLoading: true,
	};
	public violationGridObj: any = {
		criteria: this.criteria,
		customerId: this.customerId,
		pageLimit: this.paginationConfig.pageNum,
		pageNum: this.paginationConfig.pageNum,
		policyType: this.policyGroup,
		search: this.searchInput,
		severity: this.severity,
	}
	/**
	 * ngOnInit method execution
	 */
	public ngOnInit () {
		this.view = 'violation';
		// this.fetchViolationsCount();
		this.policyViolationsTableOptions = this.getPolicyViolationsTableOptions();
		this.buildFilters();
		this.getRCCData(this.violationGridObj);
		this.getFiltersData();
		this.searchForm = new FormGroup({
			search: this.search,
		});
		/* this.userResolve.getCustomerId()
			.pipe(
				// takeUntil(this.destroy$),
			)
			.subscribe((id: string) => {
				console.log(id)
				this.customerId = id;
			}
		); */
	}
	/**
	 * Gets selected sub filters
	 * @returns selected filters
	 */
	public getPolicyViolationsTableOptions () {
		return new CuiTableOptions({
			bordered: false,
			dynamicData: false,
			singleSelect: true,
			// tslint:disable-next-line: object-literal-sort-keys
			columns: [
				{
					key: 'ruleseverity',
					name: I18n.get('_RccSeverity_'),
					sortable: true,
					template: this.severityColorTemplate,
				},
				{
					key: 'policygroupid',
					name: I18n.get('_RccPolicyGroup_'),
					sortable: true,
				},
				{
					key: 'policycategory',
					name: I18n.get('_RccPolicyCategory_'),
					sortable: true,
				},
				{
					key: 'policyname',
					name: I18n.get('_RccPolicyName_'),
					sortable: true,
				},
				{
					key: 'ruletitle',
					name: I18n.get('_RccRuleName_'),
					sortable: true,
				},
				{
					key: 'violationcount',
					name: I18n.get('_RccViolationCount_'),
					sortable: true,
				},
				{
					key: 'impassets',
					name: I18n.get('_RccImpactedAssets_'),
					sortable: true,
				},
			],
		});
	}
	/**
	 * Gets selected sub filters
	 * @param violationGridObj pagenumber
	 * @returns selected filters
	 */
	public getRCCData (violationGridObj: any) {
		this.loading = true;
		this.RccTrackService
			.getGridData(violationGridObj)
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(gridData => {
				this.tableData = gridData;
				const responseData = gridData.data;
				this.policyViolationsGridData = responseData.summary;
				this.tableConfig.totalItems = this.policyViolationsGridData.length;
				this.loading = false;
			},
			// () => { this.loading = false; },
			// () => { }
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
	public getRCCAssetData (pageNum: number, pageLimt: number, policyGroup: string,
		severity: string) {
		this.loading = true;
		const queryParamMapObj: object = {
			pageNum: pageNum,
			pageLimt: pageLimt,
			policyType: policyGroup,
			severity: severity,
			customerId: this.customerId
		}
		this.gridAssetSubscripion = this.RccTrackService
			// .getAssetGridData(pageNum, pageLimt, policyGroup, severity, this.customerId)
			.getAssetGridData(queryParamMapObj)
			.subscribe(assetGridData => {
				this.tableAssetData = assetGridData;
				this.tableAssetDataSample = assetGridData.data.assetList;
				// this.tableConfig.totalItems = this.tableAssetDataSample.length;
			},
		);
		this.loading = false;
	}
	/**
	 * Gets row selected
	 * @param policyViolationInfo object
	 * @returns opens slider
	 */
	public onViolationRowClicked(policyViolationInfo: any) {
		this.policyViolationInfo = policyViolationInfo;
		this.selectedViolationModal = !this.selectedViolationModal;
	}
	/**
	 * Gets row selected
	 * @param rowData object
	 * @returns opens slider
	 */
	public onAssetRowClicked(rowData: any) {
		this.rowData = rowData;
		this.selectedAssetData = rowData;
		this.selectedAssetModal = !this.selectedAssetModal;
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
		this.loading = true;
		this.gridSubscripion = this.RccTrackService
			.getViolationCount()
			.subscribe(filterData => {
				this.filterObj = filterData;
				const filterObjRes = filterData.data;
				const policyFilter = _.find(this.filters, { key: 'policyGroup' });
				policyFilter.seriesData = filterObjRes.policyFilters;
				const severityFilter = _.find(this.filters, { key: 'severity' });
				severityFilter.seriesData = filterObjRes.severityFilters;
				this.assetCount = filterObjRes.assetCount;
				this.policyViolationCount = filterObjRes.policyViolationCount;
			},
		);
		this.loading = false;
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
		this.loading = true;
		this.gridSubscripion = this.RccTrackService
			.getAssetCount()
			.subscribe(assetFilterData => {
				this.assetFilterObj = assetFilterData;
				const filterObjRes = assetFilterData.data;
				const assetSeverityFilter = _.find(this.filters, { key: 'assetOsType' });
				assetSeverityFilter.seriesData = filterObjRes.ostypeList;
				const assetOsTypeFilter = _.find(this.filters, { key: 'assetSeverity' });
				assetOsTypeFilter.seriesData = filterObjRes.severityList;
			},
		);
		this.loading = false;
	}
	/**
	 * Determines whether pager updated on
	 * @param pageInfo gives page info
	 */
	public onPagerUpdated (pageInfo: any) {
		this.tableConfig.tableOffset = pageInfo.page;
		this.paginationConfig.pageNum = pageInfo.page + 1;
		this.getRCCData(this.violationGridObj);
	}
	/**
	 * Determines whether asset pager updated on
	 * @param pageInfo gives page info
	 */
	public onAssetPagerUpdated (pageInfo: any) {
		this.tableConfig.tableOffset = pageInfo.page;
		this.paginationConfig.pageNum = pageInfo.page + 1;
		// this.getRCCAssetData(this.pageNum, this.pageLimit, this.policyGroup, this.severity);
	}
	/**
	 * Determines whether pager updated on
	 * @param view gives selected view
	 */
	public selectedView (view: string) {
		if (view === 'violation') {
			this.isAssetView = false;
			this.buildFilters();
			this.getRCCData(this.violationGridObj);
			this.getFiltersData();
		} else {
			this.isAssetView = true;
			this.selectedAssetView(view);
		}
		this.view = view;
	}
	/**
	 * Determines whether pager updated on
	 * @param view gives selected view
	 */
	public selectedAssetView (view: string) {
		this.view = view;
		this.isAssetView = true;
		this.assetTableOptions = new CuiTableOptions({
			bordered: false,
			dynamicData: false,
			singleSelect: true,
			columns: [
				{
					key: 'deviceName',
					name: I18n.get('_RccAsset_'),
					sortable: true,
				},
				{
					key: 'ipAddress',
					name: I18n.get('_RccAssetIpAddress_'),
					sortable: true,
				},
				{
					key: 'lastScan',
					name: I18n.get('_RccAssetLastScan_'),
					sortable: true,
					render: item => item.lastScan ?
						this.fromNow.transform(item.lastScan) : I18n.get('_Never_'),
				},
				{
					key: 'serialNumber',
					name: I18n.get('_RccAssetSerialNumber_'),
					sortable: true,
				},
				{
					key: 'osType',
					name: I18n.get('_RccAssetSoftwareType_'),
					sortable: true,
				},
				{
					key: 'osVersion',
					name: I18n.get('_RccAssetSoftwareVersion_'),
					sortable: true,
				},
				{
					key: 'role',
					name: I18n.get('_RccAssetRole_'),
					sortable: true,
				},
				{
					key: 'violationCount',
					name: I18n.get('_RccAssetViolations_'),
					sortable: true,
					template: this.tableIconTemplate,
				},
			],
		});
		this.buildAssetFilters();
		this.getRCCAssetData(this.paginationConfig.pageNum, this.paginationConfig.pageLimit,
			this.policyGroup, this.severity);
		this.getAssetFiltersData();
	}
	/**
	 * method to load al the data on page load
	 */
	private loadData () {
		this.status.isLoading = true;
		// this.getAdvisoryCount();
		// this.getCoverageCounts();
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
				title: I18n.get('Policy Group'),
			},
			{
				key: 'severity',
				loading: true,
				seriesData: [],
				template: this.severityFilterTemplate,
				title: I18n.get('Severity'),
			},
		];
		this.loadData();
	}
	/**
	 * method to build filters & to feed data to the filters
	 */
	private buildAssetFilters () {
		this.filters = [
			{
				key: 'assetOsType',
				loading: true,
				seriesData: [],
				template: this.policyFilterTemplate,
				title: I18n.get('OS Type'),
			},
			{
				key: 'assetSeverity',
				loading: true,
				seriesData: [],
				template: this.severityFilterTemplate,
				title: I18n.get('Severity'),
			},
		];
		this.loadData();
	}
	/**
	 * Determines whether pager updated on
	 * @param subfilter gives page info
	 * @param filter gives page info
	 * @param triggeredFromGraph gives page info
	 */
	public onSubfilterSelect (subfilter: string, filter: Filter, triggeredFromGraph) {
		if (triggeredFromGraph) {
			filter.seriesData.forEach(obj => {
			 	obj.selected = false;
		 	});
		}
		const sub = _.find(filter.seriesData, { filter: subfilter });
		if (sub) {
			sub.selected = !sub.selected;
		}
		// this.appliedFilters.severity = +this.syslogsParams.severity[0];
		if (filter.key === 'policyGroup') {
			this.policyGroup = sub.filter;
			if (triggeredFromGraph) {
				this.violationGridObj.policyType = this.policyGroup;
			} else {
				this.violationGridObj.policyType = null;
			}
		} else {
			this.severity = sub.filter;
			if (triggeredFromGraph) {
				this.violationGridObj.severity = this.severity;
			} else {
				this.violationGridObj.severity = null;
			}
		}
		this.getRCCData(this.violationGridObj);
		// this.appliedFilters = _.cloneDeep(this.appliedFilters);
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
	 * method to clear selected filters
	 */
	public clearFilters () {
		// const totalFilter = _.find(this.filters, { key: 'total' });
		this.filtered = false;
		_.each(this.filters, (filter: Filter) => {
			filter.selected = false;
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});
		this.violationGridObj.policyType = null;
		this.violationGridObj.severity = null;
		this.allAssetsSelected = false;
		this.getRCCData(this.violationGridObj);
	}
	/**
	 * Keys down function
	 * @param event contains eventdata
	 */
	public searchViolations (event) {
		if (event.keyCode === 13) {
			this.violationGridObj.search = this.searchInput;
			this.tableConfig.tableOffset = 0;
			this.getRCCData(this.violationGridObj);
		}
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
	public onPanelClose (model) {
		this[model] = !this[model];
	}
	/**
	 * destroy method to kill the services
	 */
	public ngOnDestroy () {
		if (this.countSubscripion) {
			this.countSubscripion.unsubscribe();
		}
		if (this.gridSubscripion) {
			this.gridSubscripion.unsubscribe();
		}
		if (this.gridAssetSubscripion) {
			this.gridAssetSubscripion.unsubscribe();
		}
		this.destroy$.next();
		this.destroy$.complete();
	}
}
