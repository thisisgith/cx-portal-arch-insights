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
	HardwareInfo,
	InventoryService,
	Asset,
	Assets,
	Pagination,
	ContractCount,
	ContractDeviceCountsResponse,
	RoleCount,
	RoleCountResponse,
	CoverageCountsResponse,
	ProductAlertsService,
	VulnerabilityResponse,
} from '@cui-x/sdp-api';
import * as _ from 'lodash-es';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { SolutionService } from '../solution.service';
import { LogService } from '@cisco-ngx/cui-services';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription, forkJoin, fromEvent, of } from 'rxjs';
import { map, debounceTime, catchError, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Interface representing our visual filters
 */
interface Filter {
	key: string;
	selected?: boolean;
	template?: TemplateRef<{ }>;
	title: string;
	loading: boolean;
	seriesData: {
		filter: string,
		label: string,
		selected: boolean,
		value: number,
	}[];
}

/**
 * Interface representing an item of our inventory in our assets table
 */
interface Item {
	selected?: boolean;
	details?: boolean;
	data: Asset;
}

/** Our current customerId */
const customerId = '2431199';

/**
 * Assets Component
 */
@Component({
	styleUrls: ['./assets.component.scss'],
	templateUrl: './assets.component.html',
})
export class AssetsComponent implements OnInit, OnDestroy {
	@ViewChild('totalAssetsFilter', { static: true }) private totalAssetsFilterTemplate:
		TemplateRef<{ }>;
	@ViewChild('assetsContent', { static: true }) private assetsTemplate: TemplateRef<{ }>;
	@ViewChild('coverageFilter', { static: true }) private coverageFilterTemplate: TemplateRef<{ }>;
	@ViewChild('contractFilter', { static: true }) private contractFilterTemplate: TemplateRef<{ }>;
	@ViewChild('roleFilter', { static: true }) private roleFilterTemplate: TemplateRef<{ }>;
	@ViewChild('advisoryFilter', { static: true }) private advisoryFilterTemplate: TemplateRef<{ }>;
	@ViewChild('deviceTemplate', { static: true }) private deviceTemplate: TemplateRef<{ }>;
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{ }>;
	@ViewChild('supportCoverage', { static: true })
		private supportCoverageTemplate: TemplateRef<{ }>;
	@ViewChild('criticalAdvisories', { static: true })
		private criticalAdvisoriesTemplate: TemplateRef<{ }>;

	private searchInput: ElementRef;
	@ViewChild('searchInput', { static: false }) set content (content: ElementRef) {
		if (content) {
			this.searchInput = content;
			this.searchSubscription();
		}
	}

	public bulkDropdown = false;
	public selectedAssets: HardwareInfo[] = [];
	public filters: Filter[];
	public visibleTemplate: TemplateRef<{ }>;
	public filterCollapse = false;
	public assetParams: InventoryService.GetAssetsParams = {
		customerId,
		page: 1,
		rows: 10,
	};
	public contractCountParams: ContractsService.GetContractCountsParams = {
		customerId,
	};
	public pagination: Pagination;
	public paginationCount: string;
	public status = {
		inventoryLoading: true,
		isLoading: true,
	};
	public assetsTable: CuiTableOptions;
	public searchOptions = {
		debounce: 1500,
		max: 100,
		min: 3,
		pattern: /^[a-zA-Z ]*$/,
	};
	public search: FormControl = new FormControl('');
	public searchForm: FormGroup;
	private searchSubscribe: Subscription;
	public inventory: Item[] = [];
	public assetsDropdown = false;
	public allAssetsSelected = false;
	public filtered = false;

	public view: 'list' | 'grid' = 'list';

	constructor (
		private contractsService: ContractsService,
		private logger: LogService,
		private inventoryService: InventoryService,
		private productAlertsService: ProductAlertsService,
		private route: ActivatedRoute,
		private router: Router,
		private solutionService: SolutionService,
	) { }

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
	 * @param asset the asset we're building the actions for
	 * @returns the built actions
	 */
	public getRowActions (asset: Asset) {
		return _.filter([
			_.get(asset, 'supportCovered', false) ? {
				label: I18n.get('_OpenSupportCase_'),
			} : undefined,
			{
				label: I18n.get('_Scan_'),
			},
		]);
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
	 * Unselects all selected visual filters
	 */
	public clearSelectedFilters () {
		this.filters.forEach((f: Filter) => {
			f.selected = false;
			_.each(f.seriesData, sd => {
				sd.selected = false;
			});
		});
	}

	/**
	 * Will adjust the browsers query params to preserve the current state
	 */
	private adjustQueryParams () {
		const queryParams = _.omit(_.cloneDeep(this.assetParams), ['customerId', 'rows', 'page']);
		queryParams.view = this.view;
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
		this.fetchInventory()
			.subscribe();
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
	 * @param item the item we selected
	 */
	public onRowSelect (item: Item) {
		this.inventory.forEach((i: Item) => {
			if (i !== item) {
				i.details = false;
			}
		});
		item.details = !item.details;

		this.solutionService.sendCurrentAsset(item.details ? item.data : null);
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
		const totalFilter = _.find(this.filters, { key: 'total' });
		this.filtered = false;

		_.each(this.filters, (filter: Filter) => {
			filter.selected = false;
			_.unset(this.assetParams, filter.key);
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});

		totalFilter.selected = true;
		this.adjustQueryParams();
		this.fetchInventory()
			.subscribe();
	}

	/**
	 * Adds a subfilter to the given filer
	 * @param subfilter the subfilter selected
	 * @param filter the filter we selected the subfilter on
	 * @param reload if we're reloading our assets
	 */
	public onSubfilterSelect (subfilter: string, filter: Filter, reload: boolean = true) {
		const sub = _.find(filter.seriesData, { filter: subfilter });
		if (sub) {
			sub.selected = !sub.selected;
		}

		filter.selected = _.some(filter.seriesData, 'selected');
		this.assetParams[filter.key] = _.map(_.filter(filter.seriesData, 'selected'), 'filter');
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
			this.adjustQueryParams();
			this.fetchInventory()
				.subscribe();
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

		this.route.queryParams.subscribe(params => {
			if (params.contractNumber) {
				this.assetParams.contractNumber = _.castArray(params.contractNumber);
			}

			if (params.coverage) {
				this.assetParams.coverage = _.castArray(params.coverage);
			}

			if (params.role) {
				this.assetParams.role = _.castArray(params.role);
			}

			if (params.view) {
				this.view = params.view;
			}
		});
		this.buildFilters();
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
			this.getInventoryCounts(),
		)
		.pipe(
			mergeMap(() => {
				if (this.assetParams.contractNumber) {
					this.selectSubFilters(this.assetParams.contractNumber, 'contractNumber');
				}

				if (this.assetParams.role) {
					this.selectSubFilters(this.assetParams.role, 'role');
				}

				if (this.assetParams.coverage) {
					this.selectSubFilters(this.assetParams.coverage, 'coverage');
				}

				return this.fetchInventory();
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
				template: this.totalAssetsFilterTemplate,
				title: I18n.get('_Total_'),
			},
			{
				key: 'coverage',
				loading: true,
				seriesData: [],
				template: this.coverageFilterTemplate,
				title: I18n.get('_CoverageStatus_'),
			},
			{
				key: 'contractNumber',
				loading: true,
				seriesData: [],
				template: this.contractFilterTemplate,
				title: I18n.get('_ContractNumber_'),
			},
			{
				key: 'advisories',
				loading: true,
				seriesData: [],
				template: this.advisoryFilterTemplate,
				title: I18n.get('_Advisories_'),
			},
			{
				key: 'role',
				loading: true,
				seriesData: [],
				template: this.roleFilterTemplate,
				title: I18n.get('_NetworkRole_'),
			},
		];
		this.loadData();
	}

	/**
	 * Handler for performing a search
	 * @param query search string
	 */
	public doSearch (query: string) {
		if (query) {
			this.logger.debug(`Searching for ${query}`);
			// this.filter(query);
		}
	}

	/**
	 * Builds the search debounce subscription
	 */
	private searchSubscription () {
		this.searchSubscribe = fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(map((evt: KeyboardEvent) => (<HTMLInputElement> evt.target).value))
			.pipe(debounceTime(this.searchOptions.debounce))
			.pipe(distinctUntilChanged())
			.subscribe((query: string) => this.doSearch(query));
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

		return this.contractsService.getCoverageCounts({ customerId })
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

		return this.productAlertsService.getVulnerabilityCounts({ customerId })
		.pipe(
			map((data: VulnerabilityResponse) => {
				const series = [];

				const bugs = _.get(data, 'bugs');

				if (bugs && bugs > 0) {
					series.push({
						filter: 'bugs',
						label: I18n.get('_Bugs_'),
						selected: false,
						value: bugs,
					});
				}

				const notices = _.get(data, 'field-notices');

				if (notices && notices > 0) {
					series.push({
						filter: 'field-notices',
						label: I18n.get('_FieldNotices_'),
						selected: false,
						value: notices,
					});
				}

				const security = _.get(data, 'security-advisories');

				if (security && security > 0) {
					series.push({
						filter: 'security-advisories',
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

		return this.inventoryService.getRoleCount({ customerId })
		.pipe(
			map((data: RoleCountResponse) => {
				roleFilter.seriesData = _.map(data, (d: RoleCount) => ({
					filter: d.role,
					label: _.capitalize(d.role),
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
						name: I18n.get('_Device_'),
						sortable: false,
						sortDirection: 'asc',
						template: this.deviceTemplate,
					},
					{
						key: 'serialNumber',
						name: I18n.get('_SerialNumber_'),
						sortable: false,
						value: 'serialNumber',
					},
					{
						key: 'ipAddress',
						name: I18n.get('_IPAddress_'),
						sortable: false,
						value: 'ipAddress',
					},
					{
						name: I18n.get('_CriticalAdvisories_'),
						sortable: false,
						template: this.criticalAdvisoriesTemplate,
					},
					{
						name: I18n.get('_SupportCoverage_'),
						sortable: false,
						template: this.supportCoverageTemplate,
					},
					{
						key: 'osType',
						name: I18n.get('_SoftwareType_'),
						sortable: false,
						value: 'osType',
					},
					{
						key: 'osVersion',
						name: I18n.get('_SoftwareVersion_'),
						sortable: false,
						value: 'osVersion',
					},
					{
						name: I18n.get('_LastScan_'),
						render: item => item.lastScan ? item.lastScan : I18n.get('_Never_'),
						sortable: false,
					},
					{
						key: 'role',
						name: I18n.get('_Role_'),
						render: item => _.capitalize(item.role),
						sortable: false,
						value: 'role',
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
				wrapText: true,
			});
		}

		this.searchForm = new FormGroup({
			search: this.search,
		});
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
	 * Fetches the users inventory
	 * @returns the inventory
	 */
	private fetchInventory () {
		this.status.inventoryLoading = true;
		this.inventory = [];

		const assetParams = _.omit(_.cloneDeep(this.assetParams), ['advisories']);

		_.each(assetParams, (value, key) => {
			if (_.isArray(value) && _.isEmpty(value)) {
				_.unset(assetParams, key);
			}
		});

		return this.inventoryService.getAssets(assetParams)
			.pipe(
				map((results: Assets) => {
					results.data.forEach((a: Asset) => {
						this.inventory.push({
							data: a,
							details: false,
							selected: false,
						});
					});
					this.pagination = results.Pagination;

					const first = (this.pagination.rows * (this.pagination.page - 1)) + 1;
					let last = (this.pagination.rows * this.pagination.page);
					if (last > this.pagination.total) {
						last = this.pagination.total;
					}

					this.paginationCount = `${first}-${last}`;

					this.buildTable();

					this.status.inventoryLoading = false;
				}),
				catchError(err => {
					this.logger.error('assets.component : fetchInventory() ' +
						`:: Error : (${err.status}) ${err.message}`);
					this.status.inventoryLoading = false;

					return of({ });
				}),
			);
	}

	/**
	 * Sets the list of selected asset table elements
	 * @param selectedItems array of selected table elements
	 *
	 */
	public onSelectionChanged (selectedItems: HardwareInfo[]) {
		this.selectedAssets = selectedItems;
	}

	/**
	 * Handler for destroying subscriptions
	 */
	public ngOnDestroy () {
		_.invoke(this.searchSubscribe, 'unsubscribe');
	}

	/**
	 * Changes the view to either list or grid
	 * @param view view to set
	 */
   	public selectView (view: 'list' | 'grid') {
		if (this.view !== view) {
			this.view = view;
			this.assetParams.rows = this.view === 'list' ? 10 : 12;
			this.adjustQueryParams();
			this.fetchInventory()
				.subscribe();
		}
   	}
}
