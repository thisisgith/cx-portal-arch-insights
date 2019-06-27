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
import { map, debounceTime, catchError, distinctUntilChanged } from 'rxjs/operators';

/**
 * Interface representing our visual filters
 */
interface Filter {
	key: string;
	selected?: boolean;
	subfilter?: string;
	template?: TemplateRef<{ }>;
	title: string;
	loading: boolean;
	seriesData?: any;
}

/**
 * Interface representing an item of our inventory in our assets table
 */
interface Item {
	selected?: boolean;
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
	public assetTotal;

	constructor (
		private contractsService: ContractsService,
		private logger: LogService,
		private inventoryService: InventoryService,
		private productAlertsService: ProductAlertsService,
		private solutionService: SolutionService,
	) { }

	/**
	 * Returns the number of selected rows
	 * @returns the number of rows
	 */
	get selected (): number {
		return _.sumBy(this.inventory, 'selected') || 0;
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
	 * Returns the selected sub filters
	 * @param key the key to match to the filter
	 * @returns the array of filters
	 */
	public getSelectedSubFilters (key: string) {
		const filter = _.find(this.filters, { key });

		if (filter) {
			return _.filter(filter.subfilter, 'selected');
		}
	}

	/**
	 * Unselects all selected visual filters
	 */
	public clearSelectedFilters () {
		this.filters.forEach((f: Filter) => {
			f.selected = false;
			f.subfilter = undefined;
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
		// this.solutionService.sendCurrentAsset(item.selected ? item.data : null);
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
			_.each(filter.subfilter, f => {
				f.selected = false;
			});
		});

		totalFilter.selected = true;
		this.fetchInventory()
			.subscribe();
	}

	/**
	 * Adds a subfilter to the given filer
	 * @param subfilter the subfilter selected
	 * @param filter the filter we selected the subfilter on
	 */
	public onSubfilterSelect (subfilter: string, filter: Filter) {
		const sub = _.find(filter.subfilter, { filter: subfilter });
		if (sub) {
			sub.selected = !sub.selected;
		}

		filter.selected = _.some(filter.subfilter, 'selected');
		this.assetParams[filter.key] = _.map(_.filter(filter.subfilter, 'selected'), 'filter');
		this.assetParams.page = 1;

		const totalFilter = _.find(this.filters, { key: 'total' });
		if (filter.selected) {
			totalFilter.selected = false;
			this.filtered = true;
		} else {
			const total = _.reduce(this.filters, (memo, f) => {
				if (!memo) {
					return _.some(f.subfilter, 'selected');
				}

				return memo;
			}, false);

			totalFilter.selected = !total;
			this.filtered = total;
		}

		this.fetchInventory()
			.subscribe();
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

		this.buildFilters();
	}

	/**
	 * Function used to load all of the data
	 */
	private loadData () {
		forkJoin(
			this.getCoverageCounts(),
			this.getContractCounts(),
			this.getAdvisoryCount(),
			this.getRoleCounts(),
			this.fetchInventory(),
		)
		.subscribe(() => {
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
				template: this.totalAssetsFilterTemplate,
				title: I18n.get('_Total_'),
			},
			{
				key: 'coverage',
				loading: true,
				template: this.coverageFilterTemplate,
				title: I18n.get('_CoverageStatus_'),
			},
			{
				key: 'contractNumber',
				loading: true,
				template: this.contractFilterTemplate,
				title: I18n.get('_ContractNumber_'),
			},
			{
				key: 'advisories',
				loading: true,
				template: this.advisoryFilterTemplate,
				title: I18n.get('_Advisories_'),
			},
			{
				key: 'role',
				loading: true,
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
				const seriesData = _.map(data, (d: ContractCount) => ({
					name: d.contractNumber,
					y: d.deviceCount,
				}));

				contractFilter.subfilter = _.map(data, (d: ContractCount) => ({
					filter: d.contractNumber,
					selected: false,
				}));

				contractFilter.seriesData = seriesData;
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
				const seriesData = _.compact(_.map(data, (value: number, key: string) => {
					if (value !== 0) {
						return {
							name: key,
							y: value,
						};
					}
				}));

				coverageFilter.subfilter = _.map(_.keys(data), key => ({
					filter: key,
					selected: false,
				}));

				coverageFilter.seriesData = seriesData;
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
						y: bugs,
					});
				}

				const notices = _.get(data, 'field-notices');

				if (notices && notices > 0) {
					series.push({
						filter: 'field-notices',
						label: I18n.get('_FieldNotices_'),
						selected: false,
						y: notices,
					});
				}

				const security = _.get(data, 'security-advisories');

				if (security && security > 0) {
					series.push({
						filter: 'security-advisories',
						label: I18n.get('_SecurityAdvisories_'),
						selected: false,
						y: security,
					});
				}

				advisoryFilter.subfilter = series;
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
				const series = _.map(data, (d: RoleCount) => ({
					data: [
						{
							name: d.role,
							value: d.deviceCount,
						},
					],
					name: d.role,
					type: undefined,
				}));

				roleFilter.subfilter = _.map(data, (d: RoleCount) => ({
					filter: d.role,
					selected: false,
				}));

				roleFilter.seriesData = series;
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
						sortable: false,
						sortDirection: 'asc',
						value: 'hostName',
					},
					{
						key: 'ipAddress',
						name: I18n.get('_IPAddress_'),
						sortable: false,
						value: 'ipAddress',
					},
					{
						name: I18n.get('_LastScan_'),
						render: item => item.lastScan ? item.lastScan : I18n.get('_Never_'),
						sortable: false,
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
						key: 'serialNumber',
						name: I18n.get('_SerialNumber_'),
						sortable: false,
						value: 'serialNumber',
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
						key: 'role',
						name: I18n.get('_Role_'),
						sortable: false,
						value: 'role',
					},
					{
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
	 * Fetches the users inventory
	 * @returns the inventory
	 */
	private fetchInventory () {
		this.status.isLoading = true;
		this.inventory = [];

		const assetParams = _.omit(_.cloneDeep(this.assetParams), ['advisories']);

		_.each(assetParams, (value, key) => {
			if (_.isArray(value) && _.isEmpty(value)) {
				_.unset(assetParams, key);
			}
		});

		const totalFilter = _.find(this.filters, { key: 'total' });

		return this.inventoryService.getAssets(assetParams)
			.pipe(
				map((results: Assets) => {
					results.data.forEach((a: Asset) => {
						this.inventory.push({
							data: a,
							selected: false,
						});
					});
					this.pagination = results.Pagination;

					if (!this.assetTotal) {
						this.assetTotal = this.pagination.total;
					}

					const first = (this.pagination.rows * (this.pagination.page - 1)) + 1;
					let last = (this.pagination.rows * this.pagination.page);

					if (last > this.pagination.total) {
						last = this.pagination.total;
					}

					this.paginationCount = `${first}-${last}`;

					this.buildTable();

					this.status.isLoading = false;
					totalFilter.loading = false;

					if (window.Cypress) {
						window.loading = false;
					}
				}),
				catchError(err => {
					this.logger.error('assets.component : fetchInventory() ' +
						`:: Error : (${err.status}) ${err.message}`);
					this.status.isLoading = false;
					totalFilter.loading = false;

					if (window.Cypress) {
						window.loading = false;
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
	public onSelectionChanged (selectedItems: HardwareInfo[]) {
		this.selectedAssets = selectedItems;
	}

	/**
	 * Handler for destroying subscriptions
	 */
	public ngOnDestroy () {
		_.invoke(this.searchSubscribe, 'unsubscribe');
	}
}
