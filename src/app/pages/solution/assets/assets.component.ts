import {
	Component,
	OnInit,
	ViewChild,
	TemplateRef,
	ElementRef,
	OnDestroy,
} from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	ContractsService,
	InventoryService,
	Asset,
	Assets,
	InventoryPagination as Pagination,
	ContractCount,
	ContractDeviceCountsResponse,
	RoleCount,
	RoleCountResponse,
	CoverageCountsResponse,
	ProductAlertsService,
	HardwareEOLCountResponse,
	VulnerabilityResponse,
	TransactionRequest,
	NetworkDataGatewayService,
	ScanRequestResponse,
	NetworkElementResponse,
	NetworkElement,
} from '@sdp-api';
import * as _ from 'lodash-es';
import { CuiModalService, CuiTableOptions } from '@cisco-ngx/cui-components';
import { LogService } from '@cisco-ngx/cui-services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin, fromEvent, of, Subject } from 'rxjs';
import {
	map,
	debounceTime,
	catchError,
	distinctUntilChanged,
	switchMap,
	mergeMap,
	takeUntil,
} from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { FromNowPipe } from '@cisco-ngx/cui-pipes';
import { VisualFilter } from '@interfaces';
import { CaseOpenComponent } from '@components';
import { getProductTypeImage, getProductTypeTitle } from '@classes';
import { DetailsPanelStackService } from '@services';

/**
 * Interface representing an item of our inventory in our assets table
 */
interface Item {
	actions?: any[];
	data: Asset;
	details?: boolean;
	element?: NetworkElement;
	selected?: boolean;
}

/** Interface for selected subfilters */
interface SelectedSubfilter {
	filter: string;
	subfilter: VisualFilter['seriesData'];
}

/**
 * Assets Component
 */
@Component({
	styleUrls: ['./assets.component.scss'],
	templateUrl: './assets.component.html',
})
export class AssetsComponent implements OnInit, OnDestroy {
	@ViewChild('totalFilter', { static: true })
		private totalFilterTemplate: TemplateRef<{ }>;
	@ViewChild('bubbleChartFilter', { static: true })
		private bubbleChartFilterTemplate: TemplateRef<{ }>;
	@ViewChild('pieChartFilter', { static: true })
		private pieChartFilterTemplate: TemplateRef<{ }>;
	@ViewChild('barChartFilter', { static: true })
		private barChartFilterTemplate: TemplateRef<{ }>;

	@ViewChild('deviceTemplate', { static: true }) private deviceTemplate: TemplateRef<{ }>;
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{ }>;
	@ViewChild('lastScanTemplate', { static: true }) private lastScanTemplate: TemplateRef<{ }>;
	@ViewChild('supportCoverage', { static: true })
		private supportCoverageTemplate: TemplateRef<{ }>;
	@ViewChild('criticalAdvisories', { static: true })
		private criticalAdvisoriesTemplate: TemplateRef<{ }>;

	@ViewChild('tableContainer', { static: false }) private tableContainer: ElementRef;

	private searchInput: ElementRef;
	@ViewChild('searchInput', { static: false }) set content (content: ElementRef) {
		if (content) {
			this.searchInput = content;
			this.searchSubscription();
		}
	}

	public mainContent = 'assets';
	public alert: any = { };
	public bulkDropdown = false;
	public selectedAssets: Item[] = [];
	public filters: VisualFilter[];
	public visibleTemplate: TemplateRef<{ }>;
	public filterCollapse = false;
	private customerId: string;
	public assetParams: InventoryService.GetAssetsParams;
	public contractCountParams: ContractsService.GetContractCountsParams;
	public pagination: Pagination;
	public paginationCount: string;
	public status = {
		inventoryLoading: true,
		isLoading: true,
	};
	public assetsTable: CuiTableOptions;
	public searchOptions = {
		debounce: 600,
		max: 100,
		min: 3,
		pattern: /^[a-zA-Z0-9\s\-\/\(\).]*$/,
	};
	public searchForm = new FormGroup({
		search: new FormControl('',
			[
				Validators.minLength(this.searchOptions.min),
				Validators.maxLength(this.searchOptions.max),
				Validators.pattern(this.searchOptions.pattern),
			]),
	});
	private destroy$ = new Subject();
	public tableContainerHeight: string;
	public inventory: Item[] = [];
	public assetsDropdown = false;
	public allAssetsSelected = false;
	public filtered = false;
	private InventorySubject: Subject<{ }>;

	public view: 'list' | 'grid' = 'list';
	public selectOnLoad = false;
	public selectedAsset: Item;
	public fullscreen = false;
	public selectedSubfilters: SelectedSubfilter[];
	public getProductIcon = getProductTypeImage;
	public getProductTitle = getProductTypeTitle;

	constructor (
		private contractsService: ContractsService,
		private cuiModalService: CuiModalService,
		private logger: LogService,
		private inventoryService: InventoryService,
		private productAlertsService: ProductAlertsService,
		public route: ActivatedRoute,
		public router: Router,
		private fromNow: FromNowPipe,
		private networkService: NetworkDataGatewayService,
		private detailsPanelStackService: DetailsPanelStackService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);

		this.assetParams = {
			customerId: this.customerId,
			page: 1,
			rows: 10,
			sort: ['deviceName:ASC'],
		};

		this.contractCountParams = {
			customerId: this.customerId,
		};
	}

	/**
	 * Returns the number of selected rows
	 * @returns the number of rows
	 */
	get selected (): number {
		return _.sumBy(this.inventory, (item: Item) => item.selected ? 1 : 0) || 0;
	}

	/**
	 * Returns the current selected visual filters
	 * @returns the selected visual filters
	 */
	get selectedFilters () {
		return _.filter(this.filters, 'selected');
	}

	/**
	 * Returns the built actions
	 * @returns the actions
	 */
	get dropdownActions () {
		return _.filter([
			this.selected ? {
				label: `${I18n.get('_ExportSelected_')} (${this.selected})`,
			} : undefined,
			{
				label: I18n.get('_ExportAll_'),
			},
		]);
	}

	/**
	 * Returns the row specific actions
	 * @param item the row we're building our actions for
	 * @returns the built actions
	 */
	public getRowActions (item: Item) {
		return _.filter([
			_.get(item, ['data', 'supportCovered'], false) ? {
				label: I18n.get('_OpenSupportCase_'),
				onClick: () => this.cuiModalService.showComponent(
					CaseOpenComponent,
					{ asset: item.data },
					'full',
				),
			} : undefined,
			_.get(item, ['element', 'isManagedNE'], false) ?
				{
					label: I18n.get('_Scan_'),
					onClick: () => this.checkScan(item),
				} : undefined,
		]);
	}

	/**
	 * Performs a check on the current scan status
	 * @param item the row of the asset to scsan
	 */
	public checkScan (item: Item) {
		const getScanStatusParams: NetworkDataGatewayService.GetScanStatusBySerialParams = {
			customerId: this.customerId,
			productId: _.get(item, ['data', 'productId']),
			serialNumber: _.get(item, ['data', 'serialNumber']),
		};
		const deviceName = _.get(item, ['data', 'deviceName']);

		this.networkService.getScanStatusBySerial(getScanStatusParams)
		.pipe(
			mergeMap((response: ScanRequestResponse) => {
				const inProgress = _.find(response, { status: 'IN_PROGRESS' });
				const received = _.find(response, { status: 'RECEIVED' });

				if (!inProgress && !received) {
					return this.initiateScan(item);
				}

				this.alert.show(I18n.get('_ScanAlreadyInProgress_', deviceName), 'info');

				return of();
			}),
			catchError(err => {
				this.alert.show(I18n.get('_UnableToInitiateScan_', deviceName), 'danger');
				this.logger.error('assets.component : checkScan() ' +
				`:: Error : (${err.status}) ${err.message}`);

				return of();
			}),
		)
		.subscribe();
	}

	/**
	 * Initiates a scan on a device
	 * @param item the row to scan
	 * @returns the observable
	 */
	public initiateScan (item: Item) {
		const deviceName = _.get(item, ['data', 'deviceName']);
		const request: TransactionRequest = {
			customerId: this.customerId,
			neCount: 1,
			requestBody: {
				deviceOptions: 'LIST',
				devices: [{
					hostname: deviceName,
					ipAddress: _.get(item, ['data', 'ipAddress']),
					productId: _.get(item, ['data', 'productId']),
					serialNumber: _.get(item, ['data', 'serialNumber']),
				}],
			},
			requestType: 'PEC',
			transactionType: 'SCAN',
		};

		return this.networkService.postDeviceTransactions(request)
		.pipe(
			map(() => {
				this.alert.show(I18n.get('_ScanInitiated_', deviceName), 'info');
				this.onRowSelect(item);

				return of();
			}),
			catchError(err => {
				this.alert.show(I18n.get('_UnableToInitiateScan_', deviceName), 'danger');
				this.logger.error('header.component : initiateScan() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Returns the selected sub filters
	 * @param key the key to match to the filter
	 * @returns the array of filters
	 */
	public getAllSelectedSubFilters () {
		return _.reduce(this.filters, (memo, filter) => {
			if (filter.seriesData.length) {
				const selected = _.map(_.filter(filter.seriesData, 'selected'),
				f => ({ filter, subfilter: f }));

				return _.concat(memo, selected);
			}

			return memo;
		}, []);
	}

	/**
	 * Unselects all selected visual filters
	 */
	public clearSelectedFilters () {
		this.filters.forEach((f: VisualFilter) => {
			f.selected = false;
			_.each(f.seriesData, sd => {
				sd.selected = false;
			});
		});

		this.selectedSubfilters = [];
		this.InventorySubject.next();
	}

	/**
	 * Will adjust the browsers query params to preserve the current state
	 */
	private adjustQueryParams () {
		const queryParams = _.omit(_.cloneDeep(this.assetParams), ['customerId', 'rows']);
		this.filtered = !_.isEmpty(_.omit(queryParams, ['sort', 'page']));
		this.router.navigate([], {
			queryParams,
			relativeTo: this.route,
		});
	}

	/**
	 * Page change handler
	 * @param event the event emitted
	 */
	public onPageChanged (event: any) {
		this.assetParams.page = (event.page + 1);
		this.allAssetsSelected = false;
		this.adjustQueryParams();
		this.InventorySubject.next();
	}

	/**
	 * Called on 360 details panel close button click
	 */
	public onPanelClose () {
		_.set(this.selectedAsset, 'details', false);
		this.selectedAsset = null;
	}

	/**
	 * Function used to select an item from our inventory
	 * @param item the item we selected
	 */
	public onItemSelect (item: Item) {
		item.selected = !item.selected;

		this.allAssetsSelected = _.every(this.inventory, 'selected');
	}

	/**
	 * Function used to handle single row selection
	 *
	 * NOTE: Should only set the item.details, not item.selected
	 * @param item the item we selected
	 */
	public onRowSelect (item: Item) {
		this.inventory.forEach((i: Item) => {
			if (i !== item) {
				i.details = false;
			}
		});
		item.details = !item.details;
		this.detailsPanelStackService.reset(item.details);
		this.selectedAsset = item.details ? item : null;
	}

	/**
	 * Function used to handle selecting/de-selecting all rows
	 * @param selected boolean representing selecting all or selecting none
	 */
	public onAllSelect (selected: boolean) {
		this.inventory.forEach((i: Item) => {
			i.selected = selected;
		});

		this.allAssetsSelected = selected;
	}

	/**
	 * Function used to clear the filters
	 */
	public clearFilters () {
		this.filtered = false;

		_.each(this.filters, (filter: VisualFilter) => {
			filter.selected = (filter.key === 'total') ? true : false;
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});

		this.assetParams = _.assignIn(
			_.pick(
				_.cloneDeep(this.assetParams), ['customerId', 'rows', 'sort']),
				{ page: 1 });

		this.selectedSubfilters = [];
		this.searchForm.controls.search.setValue('');
		this.allAssetsSelected = false;
		this.adjustQueryParams();
		this.InventorySubject.next();
	}

	/**
	 * Adds a subfilter to the given filer
	 * @param subfilter the subfilter selected
	 * @param filter the filter we selected the subfilter on
	 * @param reload if we're reloading our assets
	 */
	public onSubfilterSelect (subfilter: string, filter: VisualFilter, reload: boolean = true) {
		const sub = _.find(filter.seriesData, { filter: subfilter });

		if (sub) {
			const selected = !sub.selected;
			_.each(filter.seriesData, (s: { selected: boolean }) => _.set(s, 'selected', false));
			sub.selected = selected;
		}

		filter.selected = _.some(filter.seriesData, 'selected');

		this.selectedSubfilters = this.getAllSelectedSubFilters();
		const params = this.assetParams;
		let val;
		let key;
		if (filter.key !== 'advisories' && filter.key !== 'eox') {
			val =  _.map(_.filter(filter.seriesData, 'selected'), 'filter');
			key = filter.key;
		} else if (filter.key === 'eox') {
			val = _.map(_.filter(filter.seriesData, 'selected'), 'filter');
			key = 'lastDateOfSupportRange';
		} else if (filter.key === 'advisories') {
			_.each(params, (_v, k) => {
				if (/has*/.test(k)) {
					_.unset(params, [k]);
				}
			});
			key = subfilter;
			val = true;
		}

		if (filter.selected) {
			_.set(params, [key], val);
		} else {
			_.unset(params, [key]);
		}

		this.assetParams.page = 1;

		const totalFilter = _.find(this.filters, { key: 'total' });
		if (filter.selected) {
			totalFilter.selected = false;
			this.filtered = true;
		} else {
			const total = _.reduce(this.filters, (memo, f) => {
				if (!memo) {
					return _.some(f.seriesData, 'selected');
				}

				return memo;
			}, false);

			totalFilter.selected = !total;
			this.filtered = total;
		}

		if (reload) {
			this.allAssetsSelected = false;
			this.adjustQueryParams();
			this.InventorySubject.next();
		}
	}

	/**
	 * Used to select which tab we want to view the data for
	 * @param tab the tab we've clicked on
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		if (window.Cypress) {
			window.loading = true;
		}
		const currentView = window.sessionStorage.getItem('view');
		if (!currentView) {
			window.sessionStorage.setItem('view', this.view);
		} else {
			this.view = <'list' | 'grid'> currentView;
		}

		this.assetParams.rows = this.getRows();
		this.buildTable();
		this.buildInventorySubject();
		this.buildFilters();
		this.route.queryParams.subscribe(params => {
			if (params.page) {
				const page = _.toSafeInteger(params.page);
				this.assetParams.page = (page < 1) ? 1 : page;
			}

			if (params.contractNumber) {
				this.assetParams.contractNumber = _.castArray(params.contractNumber);
			}

			if (params.coverage) {
				this.assetParams.coverage = _.castArray(params.coverage);
			}

			if (params.role) {
				this.assetParams.role = _.castArray(params.role);
			}

			if (params.serialNumber) {
				this.assetParams.serialNumber = _.castArray(params.serialNumber);
			}

			if (params.lastDateOfSupportRange) {
				this.assetParams.lastDateOfSupportRange =
					_.castArray(params.lastDateOfSupportRange);
			}

			if (params.hasBugs) {
				this.assetParams.hasBugs = params.hasBugs;
			} else if (params.hasFieldNotices) {
				this.assetParams.hasFieldNotices = params.hasFieldNotices;
			} else if (params.hasSecurityAdvisories) {
				this.assetParams.hasSecurityAdvisories = params.hasSecurityAdvisories;
			}

			if (params.search &&
				params.search.length >= this.searchOptions.min &&
				params.search.length <= this.searchOptions.max &&
				this.searchOptions.pattern.test(params.search)) {
				this.assetParams.search = params.search;
				this.searchForm.controls.search.setValue(params.search);
			}

			if (params.sort) {
				const sort = _.split(params.sort, ':');
				_.each(this.assetsTable.columns, c => {
					if (sort.length === 2 &&
							c.sortable &&
							c.key &&
							c.key.toLowerCase() === sort[0].toLowerCase()) {
						c.sorting = true;
						c.sortDirection = sort[1].toLowerCase();
						this.assetParams.sort = _.castArray(`${sort[0]}:${sort[1].toUpperCase()}`);
					} else {
						c.sorting = false;
					}
				});
			}

			if (params.select) {
				this.selectOnLoad = true;
			}

			this.filtered = !_.isEmpty(
				_.omit(_.cloneDeep(this.assetParams), ['customerId', 'rows', 'page', 'sort']),
			);
			const totalFilter = _.find(this.filters, { key: 'total' });
			totalFilter.selected = !this.filtered;
		});
		this.loadData();
	}

	/**
	 * Selects all the sub filters based on a list of parameters
	 * @param params the array list of params
	 * @param key the key to search for in the filters
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
	 * Function used to load all of the data
	 */
	private loadData () {
		this.status.isLoading = true;
		forkJoin(
			this.getCoverageCounts(),
			this.getContractCounts(),
			this.getAdvisoryCount(),
			this.getRoleCounts(),
			this.getHardwareEOXCounts(),
			this.getInventoryCounts(),
		)
		.pipe(
			map(() => {
				if (this.assetParams.contractNumber) {
					this.selectSubFilters(this.assetParams.contractNumber, 'contractNumber');
				}

				if (this.assetParams.role) {
					this.selectSubFilters(this.assetParams.role, 'role');
				}

				if (this.assetParams.coverage) {
					this.selectSubFilters(this.assetParams.coverage, 'coverage');
				}

				if (this.assetParams.hasBugs) {
					this.selectSubFilters(['hasBugs'], 'advisories');
				} else if (this.assetParams.hasFieldNotices) {
					this.selectSubFilters(['hasFieldNotices'], 'advisories');
				} else if (this.assetParams.hasSecurityAdvisories) {
					this.selectSubFilters(['hasSecurityAdvisories'], 'advisories');
				}

				if (this.assetParams.lastDateOfSupportRange) {
					this.selectSubFilters(this.assetParams.lastDateOfSupportRange, 'eox');
				}

				return this.InventorySubject.next();
			}),
		)
		.subscribe(() => {
			this.status.isLoading = false;

			if (window.Cypress) {
				window.loading = false;
			}

			this.logger.debug('assets.component : loadData() :: Finished Loading');
		});
	}

	/**
	 * Initializes our visual filters
	 * @param tab the tab we're building the filters for
	 */
	private buildFilters () {
		this.filters = [
			{
				key: 'total',
				loading: true,
				selected: true,
				seriesData: [],
				template: this.totalFilterTemplate,
				title: I18n.get('_Total_'),
			},
			{
				key: 'coverage',
				loading: true,
				seriesData: [],
				template: this.pieChartFilterTemplate,
				title: I18n.get('_CoverageStatus_'),
			},
			{
				key: 'contractNumber',
				loading: true,
				seriesData: [],
				template: this.pieChartFilterTemplate,
				title: I18n.get('_ContractNumber_'),
			},
			{
				key: 'advisories',
				loading: true,
				seriesData: [],
				template: this.barChartFilterTemplate,
				title: I18n.get('_Advisories_'),
			},
			{
				key: 'eox',
				loading: true,
				seriesData: [],
				template: this.barChartFilterTemplate,
				title: I18n.get('_HardwareEOX_'),
			},
			{
				key: 'role',
				loading: true,
				seriesData: [],
				template: this.bubbleChartFilterTemplate,
				title: I18n.get('_NetworkRole_'),
			},
		];
	}

	/**
	 * Handler for performing a search
	 * @param query search string
	 */
	public doSearch () {
		const query = this.searchForm.controls.search.value;
		if (this.searchForm.valid && query) {
			this.logger.debug(`assets.component :: doSearch() :: Searching for ${query}`);
			_.set(this.assetParams, 'search', query);
			_.set(this.assetParams, 'page', 1);
			this.filtered = true;
			this.adjustQueryParams();
			this.InventorySubject.next();
		} else if (!query && this.filtered) {
			_.unset(this.assetParams, 'search');
			_.set(this.assetParams, 'page', 1);
			this.adjustQueryParams();
			this.InventorySubject.next();
		}
	}

	/**
	 * Builds the search debounce subscription
	 */
	private searchSubscription () {
		fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(
				map((evt: KeyboardEvent) => (<HTMLInputElement> evt.target).value),
				debounceTime(this.searchOptions.debounce),
				distinctUntilChanged(),
				takeUntil(this.destroy$),
			)
			.subscribe(() => this.doSearch());
	}

	/**
	 * Fetches the contract counts for the visual filter
	 * @returns the contract counts observable
	 */
	private getContractCounts () {
		const contractFilter = _.find(this.filters, { key: 'contractNumber' });

		return this.contractsService.getContractCounts(this.contractCountParams)
		.pipe(
			map((data: ContractDeviceCountsResponse) => {
				contractFilter.seriesData = _.map(data, (d: ContractCount) => ({
					filter: d.contractNumber,
					label: _.capitalize(d.contractNumber),
					selected: false,
					value: d.deviceCount,
				}));

				contractFilter.loading = false;
			}),
			catchError(err => {
				contractFilter.loading = false;
				this.logger.error('assets.component : getContractCounts() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the coverage counts for the visual filter
	 * @returns the coverage counts observable
	 */
	private getCoverageCounts () {
		const coverageFilter = _.find(this.filters, { key: 'coverage' });

		return this.contractsService.getCoverageCounts({ customerId: this.customerId })
		.pipe(
			map((data: CoverageCountsResponse) => {
				coverageFilter.seriesData = _.compact(_.map(data, (value: number, key: string) => {
					if (value !== 0) {
						return {
							value,
							filter: key,
							label: _.capitalize(key),
							selected: false,
						};
					}
				}));
				coverageFilter.loading = false;
			}),
			catchError(err => {
				coverageFilter.loading = false;
				this.logger.error('assets.component : getCoverageCounts() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the advisory counts for the visual filter
	 * @returns the advisory counts
	 */
	private getAdvisoryCount () {
		const advisoryFilter = _.find(this.filters, { key: 'advisories' });

		return this.productAlertsService.getVulnerabilityCounts({ customerId: this.customerId })
		.pipe(
			map((data: VulnerabilityResponse) => {
				const series = [];

				const bugs = _.get(data, 'bugs', 0);

				if (bugs) {
					series.push({
						filter: 'hasBugs',
						label: I18n.get('_Bugs_'),
						selected: false,
						value: bugs,
					});
				}

				const notices = _.get(data, 'field-notices', 0);

				if (notices) {
					series.push({
						filter: 'hasFieldNotices',
						label: I18n.get('_FieldNotices_'),
						selected: false,
						value: notices,
					});
				}

				const security = _.get(data, 'security-advisories', 0);

				if (security) {
					series.push({
						filter: 'hasSecurityAdvisories',
						label: I18n.get('_SecurityAdvisories_'),
						selected: false,
						value: security,
					});
				}

				advisoryFilter.seriesData = series;
				advisoryFilter.loading = false;
			}),
			catchError(err => {
				advisoryFilter.loading = false;
				this.logger.error('assets.component : getAdvisoryCount() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the role counts for the visual filter
	 * @returns the role counts
	 */
	private getRoleCounts () {
		const roleFilter = _.find(this.filters, { key: 'role' });

		return this.inventoryService.getRoleCount({ customerId: this.customerId })
		.pipe(
			map((data: RoleCountResponse) => {
				roleFilter.seriesData = _.map(data, (d: RoleCount) => ({
					filter: d.role,
					label: _.startCase(_.toLower(d.role)),
					selected: false,
					value: d.deviceCount,
				}));
				roleFilter.loading = false;
			}),
			catchError(err => {
				roleFilter.loading = false;
				this.logger.error('assets.component : getRoleCounts() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Will construct the assets table
	 */
	private buildTable () {
		if (!this.assetsTable) {
			this.assetsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'deviceName',
						name: I18n.get('_Device_'),
						sortable: true,
						sortDirection: 'asc',
						sorting: true,
						template: this.deviceTemplate,
					},
					{
						key: 'serialNumber',
						name: I18n.get('_SerialNumber_'),
						sortable: true,
						value: 'serialNumber',
					},
					{
						key: 'ipAddress',
						name: I18n.get('_IPAddress_'),
						sortable: true,
						value: 'ipAddress',
					},
					{
						key: 'criticalAdvisories',
						name: I18n.get('_CriticalAdvisories_'),
						sortable: false,
						template: this.criticalAdvisoriesTemplate,
					},
					{
						key: 'supportCovered',
						name: I18n.get('_SupportCoverage_'),
						sortable: false,
						template: this.supportCoverageTemplate,
					},
					{
						key: 'osType',
						name: I18n.get('_SoftwareType_'),
						sortable: true,
						value: 'osType',
					},
					{
						key: 'osVersion',
						name: I18n.get('_SoftwareVersion_'),
						sortable: true,
						value: 'osVersion',
					},
					{
						key: 'lastScan',
						name: I18n.get('_LastScan_'),
						sortable: false,
						template: this.lastScanTemplate,
						width: '100px',
					},
					{
						key: 'role',
						name: I18n.get('_Role_'),
						render: item => _.startCase(_.toLower(item.role)),
						sortable: true,
						value: 'role',
						width: '100px',
					},
					{
						click: true,
						sortable: false,
						template: this.actionsTemplate,
					},
				],
				dynamicData: true,
				hover: true,
				padding: 'compressed',
				selectable: false,
				singleSelect: true,
				sortable: true,
				striped: false,
				tableSort: false,
				wrapText: true,
			});
		}
	}

	/**
	 * Fetches the count of the inventory
	 * @returns the inventory count
	 */
	private getInventoryCounts () {
		const totalFilter = _.find(this.filters, { key: 'total' });

		const params = _.assignIn(
			_.pick(
				_.cloneDeep(this.assetParams), ['customerId', 'page']), { rows: 1 });

		return this.inventoryService.getAssets(params)
		.pipe(
			map((results: Assets) => {
				totalFilter.seriesData = [{
					value: _.get(results, ['Pagination', 'total'], 0),
				}];

				totalFilter.loading = false;
			}),
			catchError(err => {
				this.logger.error('assets.component : fetchInventoryCount() ' +
					`:: Error : (${err.status}) ${err.message}`);
				totalFilter.loading = false;

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the hardware eox counts for the visual filter
	 * @returns the counts
	 */
	private getHardwareEOXCounts () {
		const eoxFilter = _.find(this.filters, { key: 'eox' });

		return this.productAlertsService.getHardwareEolTopCount(this.customerId)
		.pipe(
			map((data: HardwareEOLCountResponse) => {
				const series = [];

				const sub30 = _.get(data, 'gt-0-lt-30-days');
				const sub30Value = _.get(sub30, 'numericValue', 0);

				if (sub30Value) {
					series.push({
						filter: 'gt-0-lt-30-days',
						filterValue: [`${
							_.get(sub30, 'fromTimestampInMillis')},${
								_.get(sub30, 'toTimestampInMillis')}`],
						label: `< 30 ${I18n.get('_Days_')}`,
						selected: false,
						value: sub30Value,
					});
				}

				const sub60 = _.get(data, 'gt-30-lt-60-days');
				const sub60Value = _.get(sub60, 'numericValue', 0);

				if (sub60Value) {
					series.push({
						filter: 'gt-30-lt-60-days',
						filterValue: [`${
							_.get(sub60, 'fromTimestampInMillis')},${
								_.get(sub60, 'toTimestampInMillis')}`],
						label: `30 - 60 ${I18n.get('_Days_')}`,
						selected: false,
						value: sub60Value,
					});
				}

				const sub90 = _.get(data, 'gt-60-lt-90-days');
				const sub90Value = _.get(sub90, 'numericValue', 0);

				if (sub90Value) {
					series.push({
						filter: 'gt-60-lt-90-days',
						filterValue: [`${
							_.get(sub90, 'fromTimestampInMillis')},${
								_.get(sub90, 'toTimestampInMillis')}`],
						label: `61 - 90 ${I18n.get('_Days_')}`,
						selected: false,
						value: sub90Value,
					});
				}

				eoxFilter.seriesData = series;
				eoxFilter.loading = false;
			}),
			catchError(err => {
				eoxFilter.loading = false;
				this.logger.error('assets.component : getHardwareEOXCounts() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Builds our inventory subject for cancellable http requests
	 */
	private buildInventorySubject () {
		this.InventorySubject = new Subject();

		this.InventorySubject
		.pipe(
			switchMap(() => this.fetchInventory()),
			takeUntil(this.destroy$),
		)
		.subscribe();
	}

	/**
	 * Fetches the network elements
	 * @param assets the assets to lookup
	 * @returns the observable
	 */
	private fetchNetworkElements (assets: Assets) {
		const params: InventoryService.GetNetworkElementsParams = {
			customerId: this.customerId,
			page: 1,
			rows: this.getRows(),
			serialNumber: _.map(assets.data, 'serialNumber'),
		};

		return this.inventoryService.getNetworkElements(params)
		.pipe(
			map((response: NetworkElementResponse) => response),
			catchError(err => {
				this.pagination = null;
				this.paginationCount = null;
				this.logger.error('assets.component : fetchNetworkElements() ' +
					`:: Error : (${err.status}) ${err.message}`);
				this.status.inventoryLoading = false;
				if (window.Cypress) {
					window.inventoryLoading = false;
				}

				return of({ data: [] });
			}),
		)
		.pipe(
			map((response: NetworkElementResponse) => {
				assets.data.forEach((a: Asset) => {
					const element = _.find(
						_.get(response, 'data', []), { serialNumber: a.serialNumber });

					if (a.role) {
						a.role = _.startCase(_.toLower(a.role));
					}
					a.criticalAdvisories = _.toSafeInteger(_.get(a, 'criticalAdvisories', 0));

					const row = {
						data: a,
						details: false,
						selected: false,
					};

					if (element) {
						_.set(row, 'element', element);
					}

					_.set(row, 'actions', this.getRowActions(row));
					this.inventory.push(row);
				});
				this.pagination = assets.Pagination;

				const first = (this.pagination.rows * (this.pagination.page - 1)) + 1;
				let last = (this.pagination.rows * this.pagination.page);
				if (last > this.pagination.total) {
					last = this.pagination.total;
				}

				this.paginationCount = `${first}-${last}`;

				this.buildTable();

				if (this.selectOnLoad) {
					this.onAllSelect(true);
					this.onSelectionChanged(_.map(this.inventory, item => item));
					if (this.selectedAssets.length === 1) {
						this.selectedAsset = this.selectedAssets[0];
						_.set(this.inventory, [0, 'details', true]);
					}
				}

				this.status.inventoryLoading = false;
				this.tableContainerHeight = undefined;

				if (window.Cypress) {
					window.inventoryLoading = false;
				}
			}),
		);
	}

	/**
	 * Fetches the users inventory
	 * @returns the inventory
	 */
	private fetchInventory () {
		this.status.inventoryLoading = true;
		if (window.Cypress) {
			window.inventoryLoading = true;
		}

		if (_.size(this.inventory) && this.tableContainer) {
			this.tableContainerHeight = `${this.tableContainer.nativeElement.offsetHeight}px`;
		}

		this.inventory = [];
		this.pagination = null;

		const assetParams = _.omit(_.cloneDeep(this.assetParams), ['lastDateOfSupportRange']);

		if (this.assetParams.lastDateOfSupportRange) {
			const rangeValue = _.head(this.assetParams.lastDateOfSupportRange);
			const eoxFilter = _.find(this.filters, { key: 'eox' });
			const rangeFilter = _.find(_.get(eoxFilter, 'seriesData', []),
				{ filter: rangeValue });

			if (rangeFilter && rangeFilter.filterValue) {
				_.set(assetParams, 'lastDateOfSupportRange', rangeFilter.filterValue);
			} else {
				_.unset(this.assetParams, 'lastDateOfSupportRange');
				this.adjustQueryParams();
			}
		}

		_.each(assetParams, (value, key) => {
			if (_.isArray(value) && _.isEmpty(value)) {
				_.unset(assetParams, key);
			}
		});

		return this.inventoryService.getAssets(assetParams)
		.pipe(
			mergeMap((results: Assets) => this.fetchNetworkElements(results)),
			catchError(err => {
				this.pagination = null;
				this.paginationCount = null;
				this.logger.error('assets.component : fetchInventory() ' +
					`:: Error : (${err.status}) ${err.message}`);
				this.status.inventoryLoading = false;
				if (window.Cypress) {
					window.inventoryLoading = false;
				}

				return of({ });
			}),
		);
	}

	/**
	 * Sets the list of selected asset table elements
	 * @param selectedItems array of selected table elements
	 *
	 */
	public onSelectionChanged (selectedItems: Item[]) {
		this.selectedAssets = selectedItems;
	}

	/**
	 * Sets the params for sorting
	 * @param column column to set sorting
	 */
	public onColumnSort (column) {
		if (column.sortable) {
			this.filtered = true;
			_.each(this.assetsTable.columns, c => {
				c.sorting = false;
			});
			column.sorting = true;
			column.sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';
			this.assetParams.sort = [`${column.key}:${column.sortDirection.toUpperCase()}`];
			this.adjustQueryParams();
			this.InventorySubject.next();
		}
	}

	/**
	 * Handler for destroying subscriptions
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Changes the view to either list or grid
	 * @param view view to set
	 */
	public selectView (view: 'list' | 'grid') {
		if (this.view !== view) {
			this.view = view;
			window.sessionStorage.setItem('view', this.view);
			const newRows = this.getRows();
			this.assetParams.page =
				Math.round(this.assetParams.page * this.assetParams.rows / newRows);
			this.assetParams.rows = newRows;
			this.adjustQueryParams();
			this.InventorySubject.next();
		}
	}

	/**
	 * Returns the number of rows for the page
	 * depending on the view
	 * @returns number of rows
	 */
	private getRows () {
		return this.view === 'list' ? 10 : 12;
	}

	/**
	 * Click handler logic for the asset list
	 * @param {Event} $event Click event
	 * @param {string} type Click target type (checkbox, item, or menu)
	 * @param {Item} [item] Targeted item
	 */
	public onClick ($event: Event, type: 'checkbox' | 'item' | 'menu', item?: Item) {
		if ($event.defaultPrevented) {
			// Event has already been handled
			return;
		}
		switch (type) {
			case 'checkbox':
				this.onItemSelect(item);
				// Don't mark event as handled so table row checkbox still works
				break;
			case 'item':
				this.onRowSelect(item);
				$event.preventDefault(); // mark this event as handled
				break;
			case 'menu':
			default:
				$event.preventDefault(); // mark this event as handled
		}
	}
}
