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
	InventoryPagination as Pagination,
	RoleCount,
	RoleCountResponse,
	CoverageCountsResponse,
	ProductAlertsService,
	HardwareEOLCountResponse,
	VulnerabilityResponse,
	TransactionRequest,
	NetworkDataGatewayService,
	ScanRequestResponse,
	TransactionStatusResponse,
	RacetrackSolution,
	RacetrackTechnology,
	HardwareAsset,
	SystemAsset,
	SystemAssets,
	HardwareAssets,
} from '@sdp-api';
import * as _ from 'lodash-es';
import { CuiModalService, CuiTableOptions } from '@cisco-ngx/cui-components';
import { LogService } from '@cisco-ngx/cui-services';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { forkJoin, fromEvent, of, Subject, Subscription } from 'rxjs';
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
import { VisualFilter } from '@interfaces';
import { CaseOpenComponent } from '@components';
import { getProductTypeImage, getProductTypeTitle } from '@classes';
import { DetailsPanelStackService, RacetrackInfoService } from '@services';
import { HttpResponse } from '@angular/common/http';

/**
 * Interface representing an item of our inventory in our assets table
 */
interface Item {
	actions?: any[];
	data: SystemAsset | HardwareAsset;
	details?: boolean;
	selected?: boolean;
}

/** Interface for selected subfilters */
interface SelectedSubfilter {
	filter: string;
	subfilter: VisualFilter['seriesData'];
}

/** Interface representing our view */
interface View {
	allAssetsSelected?: boolean;
	contentContainerHeight?: string;
	data?: Item[];
	filtered?: boolean;
	filters: VisualFilter[];
	key: string;
	loading: boolean;
	pagination?: Pagination;
	paginationCount?: string;
	params?: InventoryService.GetSystemAssetsParams | 	InventoryService.GetHardwareAssetsParams;
	route: string;
	searchForm?: FormGroup;
	searchInput?: ElementRef;
	searchLabel?: string;
	searchSubscribe?: Subscription;
	searchTemplate?: TemplateRef<{ }>;
	selected?: boolean;
	selectedAssets?: Item[];
	selectedSubfilters?: SelectedSubfilter[];
	subject?: Subject<{ }>;
	table?: CuiTableOptions;
	tableContainerHeight?: string;
	template?: TemplateRef<{ }>;
	title?: string;
	titleCount?: string;
	total?: number;
}

/**
 * Assets Component
 */
@Component({
	styleUrls: ['./assets.component.scss'],
	templateUrl: './assets.component.html',
})
export class AssetsComponent implements OnInit, OnDestroy {
	@ViewChild('bubbleChartFilter', { static: true })
		private bubbleChartFilterTemplate: TemplateRef<{ }>;
	@ViewChild('pieChartFilter', { static: true })
		private pieChartFilterTemplate: TemplateRef<{ }>;
	@ViewChild('barChartFilter', { static: true })
		private barChartFilterTemplate: TemplateRef<{ }>;

	@ViewChild('deviceTemplate', { static: true }) private deviceTemplate: TemplateRef<{ }>;
	@ViewChild('productTypeTemplate', { static: true })
		private productTypeTemplate: TemplateRef<{ }>;
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{ }>;
	@ViewChild('lastScanTemplate', { static: true }) private lastScanTemplate: TemplateRef<{ }>;
	@ViewChild('productIdTemplate', { static: true }) private productIdTemplate: TemplateRef<{ }>;
	@ViewChild('criticalAdvisories', { static: true })
		private criticalAdvisoriesTemplate: TemplateRef<{ }>;

	@ViewChild('tableContainer', { static: false }) private tableContainer: ElementRef;

	@ViewChild('systemSearchTemplate', { static: true })
	private systemSearchTemplate: TemplateRef<{ }>;
	@ViewChild('hardwareSearchTemplate', { static: true })
	private hardwareSearchTemplate: TemplateRef<{ }>;

	@ViewChild('systemSearchInput', { static: false }) set systemContent (content: ElementRef) {
		if (content) {
			const view = this.getView('system');
			view.searchInput = content;
			this.searchSubscription(view);
		}
	}

	@ViewChild('hardwareSearchInput', { static: false }) set hardwareContent (content: ElementRef) {
		if (content) {
			const view = this.getView('hardware');
			view.searchInput = content;
			this.searchSubscription(view);
		}
	}

	@ViewChild('contentContainer', { static: false })
	private contentContainer: ElementRef;

	public views: View[];
	public alert: any = { };
	public bulkDropdown = false;
	public visibleTemplate: TemplateRef<{ }>;
	public filterCollapse = false;
	private customerId: string;
	public contentContainerHeight: string;
	public status = {
		isLoading: true,
	};
	public searchOptions = {
		debounce: 600,
		max: 100,
		min: 3,
		pattern: /^[a-zA-Z0-9\s\-\/\(\).]*$/,
	};
	private destroy$ = new Subject();
	private selectedSolutionName: string;
	private selectedTechnologyName: string;

	public viewType: 'list' | 'grid' = 'list';
	public selectOnLoad = false;
	public selectedAsset: Item;
	public fullscreen = false;
	public getProductIcon = getProductTypeImage;
	public getProductTitle = getProductTypeTitle;
	private routeParam: string;

	constructor (
		private contractsService: ContractsService,
		private cuiModalService: CuiModalService,
		private detailsPanelStackService: DetailsPanelStackService,
		private inventoryService: InventoryService,
		private logger: LogService,
		private networkService: NetworkDataGatewayService,
		private productAlertsService: ProductAlertsService,
		private racetrackInfoService: RacetrackInfoService,
		public route: ActivatedRoute,
		public router: Router,
	) {
		this.routeParam = _.get(this.route, ['snapshot', 'params', 'view'], 'system');

		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}

	/**
	 * Returns the built actions
	 * @returns the actions
	 */
	get dropdownActions () {
		return _.filter([
			this.selectedView.selected ? {
				label: `${I18n.get('_ExportSelected_')} (${this.selectedView.selected})`,
			} : undefined,
			{
				label: I18n.get('_ExportAll_'),
			},
		]);
	}

	/**
	 * Returns the number of selected rows
	 * @returns the number of rows
	 */
	get selected (): number {
		return _.sumBy(this.selectedView.data, (item: Item) => item.selected ? 1 : 0) || 0;
	}

	/**
	 * Returns the current selected visual filters
	 * @returns the selected visual filters
	 */
	get selectedFilters () {
		return _.filter(this.selectedView.filters, 'selected');
	}

	/**
	 * Returns the currently selected view
	 * @returns the view
	 */
	get selectedView (): View {
		return _.find(this.views, 'selected');
	}

	/**
	 * Finds selected view from views array and returns it
	 * @param key the key to match to the view
	 * @returns the found view
	 */
	public getView (key: string): View {
		return _.find(this.views, { key });
	}

	/**
	 * Sets the list of selected asset table elements
	 * @param selectedItems array of selected table elements
	 *
	 */
	public onSelectionChanged (selectedItems: Item[]) {
		this.selectedView.selectedAssets = selectedItems;
	}

	/**
	 * Will adjust the browsers query params to preserve the current state
	 */
	private adjustQueryParams () {
		const queryParams = _.omit(_.cloneDeep(this.selectedView.params),
			['customerId', 'rows', 'solution', 'useCase']);
		this.selectedView.filtered = !_.isEmpty(_.omit(queryParams, ['sort', 'page']));
		this.router.navigate([`/solution/assets/${this.routeParam}`], {
			queryParams,
		});
	}

	/**
	 * Sets the params for sorting
	 * @param column column to set sorting
	 */
	public onColumnSort (column) {
		if (column.sortable) {
			this.selectedView.filtered = true;
			_.each(this.selectedView.table.columns, c => {
				c.sorting = false;
			});
			column.sorting = true;
			column.sortDirection = column.sortDirection === 'asc' ? 'desc' : 'asc';
			this.selectedView.params.sort = [`${column.key}:${column.sortDirection.toUpperCase()}`];
			this.adjustQueryParams();
			this.selectedView.subject.next();
		}
	}

	/**
	 * Handler for performing a search
	 * @param view search string
	 */
	public doSearch (view: View) {
		const query = view.searchForm.controls.search.value;
		if (view.searchForm.valid && query) {
			this.logger.debug(`assets.component :: doSearch():${view.key}`
				+ `:: Searching for ${query}`);
			_.set(view.params, 'search', query);
			_.set(view.params, 'page', 1);
			view.filtered = true;
			this.adjustQueryParams();
			view.subject.next();
		} else if (!query && view.filtered) {
			_.unset(view.params, 'search');
			_.set(view.params, 'page', 1);
			this.adjustQueryParams();
			view.subject.next();
		}
	}

	/**
	 * Builds the search debounce subscription
	 * @param view the view we're currently on
	 */
	private searchSubscription (view: View) {
		fromEvent(view.searchInput.nativeElement, 'keyup')
			.pipe(
				map((evt: KeyboardEvent) => (<HTMLInputElement> evt.target).value),
				debounceTime(this.searchOptions.debounce),
				distinctUntilChanged(),
				takeUntil(this.destroy$),
			)
			.subscribe(() => this.doSearch(view));
	}

	/**
	 * Switches our selected view
	 * @param view the view to select
	 */
	public selectView (view: View) {
		_.each(this.views, (v: View) => {
			v.selected = false;
		});
		view.selected = true;
		this.routeParam = view.route;
		this.adjustQueryParams();
	}

	/**
	 * Returns the number of rows for the page
	 * depending on the view
	 * @returns number of rows
	 */
	private getRows () {
		return this.viewType === 'list' ? 10 : 12;
	}

	/**
	 * Page change handler
	 * @param event the event emitted
	 */
	public onPageChanged (event) {
		this.selectedView.params.page = (event.page + 1);
		this.selectedView.allAssetsSelected = false;
		this.adjustQueryParams();
		this.selectedView.subject.next();
	}

	/**
	 * Changes the view type to either list or grid
	 * @param type view to set
	 */
	public selectViewType (type: 'list' | 'grid') {
		if (this.viewType !== type) {
			this.viewType = type;
			window.sessionStorage.setItem('viewType', this.viewType);
			const newRows = this.getRows();
			this.selectedView.params.page =
				Math.round(this.selectedView.params.page * this.selectedView.params.rows / newRows);
			this.selectedView.params.rows = newRows;
			this.adjustQueryParams();
			this.selectedView.subject.next();
		}
	}

	/**
	 * Builds our System tab
	 * @returns the system tab
	 */
	private systemView (): View {
		const route = 'system';

		return {
			route,
			filters: [
				// {
				// 	key: 'partner',
				// 	loading: true,
				// 	seriesData: [],
				// 	template: this.pieChartFilterTemplate,
				// 	title: I18n.get('_Partner_'),
				// },
				{
					key: 'advisories',
					loading: true,
					seriesData: [],
					template: this.barChartFilterTemplate,
					title: I18n.get('_Advisories_'),
				},
				{
					key: 'role',
					loading: true,
					seriesData: [],
					template: this.bubbleChartFilterTemplate,
					title: I18n.get('_Role_'),
				},
			],
			key: 'system',
			loading: true,
			params: {
				customerId: this.customerId,
				page: 1,
				rows: this.getRows(),
				sort: ['criticalAdvisories:DESC'],
			},
			searchLabel: '_Systems_',
			searchTemplate: this.systemSearchTemplate,
			selected: this.routeParam === route,
			selectedAssets: [],
			subject: new Subject(),
			table: new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'criticalAdvisories',
						name: I18n.get('_CriticalAdvisories_'),
						sortable: true,
						sortDirection: 'desc',
						sorting: true,
						template: this.criticalAdvisoriesTemplate,
						width: '150px',
					},
					{
						key: 'deviceName',
						name: I18n.get('_Hostname_'),
						sortable: true,
						template: this.deviceTemplate,
					},
					{
						key: 'ipAddress',
						name: I18n.get('_IPAddress_'),
						sortable: true,
						value: 'ipAddress',
					},
					{
						key: 'productId',
						name: I18n.get('_ProductID_'),
						sortable: true,
						template: this.productIdTemplate,
					},
					{
						key: 'osType',
						name: I18n.get('_SoftwareType_'),
						sortable: true,
						value: 'osType',
					},
					{
						key: 'osVersion',
						name: I18n.get('_SoftwareRelease_'),
						sortable: true,
						value: 'osVersion',
					},
					{
						key: 'lastScan',
						name: I18n.get('_LastScan_'),
						sortable: true,
						template: this.lastScanTemplate,
						width: '100px',
					},
					{
						key: 'cxLevel',
						name: I18n.get('_SupportLevel_'),
						render: item => item.cxLevel || I18n.get('_NA_'),
						sortable: true,
						value: 'cxLevel',
						width: '115px',
					},
					{
						click: true,
						sortable: false,
						template: this.actionsTemplate,
						width: '50px',
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
			}),
			title: '_Systems_',
			titleCount: '_Systems_',
			total: 0,
		};
	}

	/**
	 * Builds our Hardware tab
	 * @returns the hardware tab
	 */
	private hardwareView (): View {
		const route = 'hardware';

		return {
			route,
			filters: [
				{
					key: 'coverage',
					loading: true,
					seriesData: [],
					template: this.pieChartFilterTemplate,
					title: I18n.get('_CoverageStatus_'),
				},
				{
					key: 'advisories',
					loading: true,
					seriesData: [],
					template: this.pieChartFilterTemplate,
					title: I18n.get('_Advisories_'),
				},
				// {
				// 	key: 'partner',
				// 	loading: true,
				// 	seriesData: [],
				// 	template: this.pieChartFilterTemplate,
				// 	title: I18n.get('_Partner_'),
				// },
				{
					key: 'equipmentType',
					loading: true,
					seriesData: [],
					template: this.barChartFilterTemplate,
					title: I18n.get('_HardwareType_'),
				},
			],
			key: 'hardware',
			loading: true,
			params: {
				customerId: this.customerId,
				page: 1,
				rows: this.getRows(),
				sort: ['deviceName:DESC', 'productId:DESC'],
			},
			searchLabel: '_HardwareComponents_',
			searchTemplate: this.hardwareSearchTemplate,
			selected: this.routeParam === route,
			selectedAssets: [],
			subject: new Subject(),
			table: new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'serialNumber',
						name: I18n.get('_SerialNumber_'),
						sortable: true,
						value: 'serialNumber',
					},
					{
						key: 'deviceName',
						name: I18n.get('_SystemHostname_'),
						sortable: true,
						sortDirection: 'desc',
						sorting: true,
						value: 'deviceName',
					},
					{
						key: 'productId',
						name: I18n.get('_ProductID_'),
						sortable: true,
						template: this.productIdTemplate,
					},
					{
						key: 'productType',
						name: I18n.get('_ProductType_'),
						sortable: true,
						template: this.productTypeTemplate,
					},
					{
						key: 'equipmentType',
						name: I18n.get('_HardwareType_'),
						render: item => _.startCase(_.toLower(_.get(item, 'equipmentType', ''))),
						sortable: true,
						value: 'equipmentType',
					},
					{
						key: 'cxLevel',
						name: I18n.get('_SupportLevel_'),
						render: item => item.cxLevel || I18n.get('_NA_'),
						sortable: true,
						value: 'cxLevel',
						width: '115px',
					},
					{
						click: true,
						sortable: false,
						template: this.actionsTemplate,
						width: '50px',
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
			}),
			title: '_Hardware_',
			titleCount: '_HardwareComponents_',
			total: 0,
		};
	}

	/**
	 * Function used to handle single row selection
	 *
	 * NOTE: Should only set the item.details, not item.selected
	 * @param item the item we selected
	 */
	public onRowSelect (item: Item) {
		const selectedView = this.selectedView;
		selectedView.data.forEach((i: Item) => {
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
		this.selectedView.data.forEach((i: Item) => {
			i.selected = selected;
		});

		this.selectedView.allAssetsSelected = selected;
	}

	/**
	 * Function used to clear the filters
	 */
	public clearFilters () {
		const view = this.selectedView;
		view.filtered = false;

		_.each(view.filters, (filter: VisualFilter) => {
			filter.selected = (filter.key === 'total') ? true : false;
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});

		view.params = _.assignIn(
			_.pick(
				_.cloneDeep(view.params), ['customerId', 'rows', 'sort']),
				{ page: 1 });

		view.selectedSubfilters = [];
		view.searchForm.controls.search.setValue('');
		view.allAssetsSelected = false;
		this.adjustQueryParams();
		view.subject.next();
	}

	/**
	 * Will handle reloading data if our scan request has completed
	 * @param transaction the transaction status of the completed or failed scan
	 */
	public handleScanStatus (transaction: TransactionStatusResponse) {
		if (transaction.status === 'SUCCESS') {
			forkJoin(
				this.getSystemAdvisoryCount(),
				this.fetchSystems(),
			)
			.subscribe(() => {
				const view = this.getView('system');
				const currentSerial = _.get(this.selectedAsset, ['data', 'serialNumber']);
				const refreshed = _.find(view.data, (i: Item) =>
					_.get(i, ['data', 'serialNumber']) === currentSerial);
				this.onRowSelect(refreshed);
			});
		}
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
	 * Returns the row specific actions
	 * @param item the row we're building our actions for
	 * @param view the view the actions are for
	 * @returns the built actions
	 */
	public getRowActions (item: Item, view: View) {
		const { cxLevel } = item.data;

		return _.filter([
			_.get(item, ['data', 'supportCovered'], false) ? {
				label: I18n.get('_OpenSupportCase_'),
				onClick: () => this.cuiModalService.showComponent(
					CaseOpenComponent,
					{ asset: item.data },
					'fluid',
				),
			} : undefined,
			(Number(cxLevel) > 0 && view.key === 'system' && _.get(item, ['data', 'isManagedNE'], false))
			? {
				label: I18n.get('_RunDiagnosticScan_'),
				onClick: () => this.checkScan(item),
			}
			: undefined,
		]);
	}

	/**
	 * Fetches the users system assets
	 * @returns the system assets
	 */
	private fetchSystems () {
		const view = this.getView('system');

		return this.fetchInventory(view, _.cloneDeep(view.params));
	}

	/**
	 * Builds our system subject for cancellable http requests
	 */
	private buildSystemSubject () {
		this.getView('system').subject
		.pipe(
			switchMap(() => this.fetchSystems()),
			takeUntil(this.destroy$),
		)
		.subscribe();
	}

	/**
	 * Fetches the users inventory
	 * @param view the view
	 * @param params the query params
	 * @returns the inventory
	 */
	private fetchInventory (view: View, params) {
		view.loading = true;
		view.pagination = null;

		if (_.size(view.data) && this.contentContainer) {
			view.contentContainerHeight =
				`${this.contentContainer.nativeElement.offsetHeight}px`;
		}
		view.data = [];

		params.solution = this.selectedSolutionName;
		params.useCase = this.selectedTechnologyName;

		_.each(params, (value, key) => {
			if (_.isArray(value) && _.isEmpty(value)) {
				_.unset(params, key);
			}
		});

		const service = view.key === 'system' ? 'getSystemAssets' : 'getHardwareAssets';

		return _.invoke(this.inventoryService, service, params)
		.pipe(
			map((results: SystemAssets | HardwareAssets) => {
				const data = _.get(results, 'data', []);
				data.forEach((a: SystemAsset | HardwareAsset) => {
					const role = _.get(a, 'role');
					if (role) {
						_.set(a, 'role', _.startCase(_.toLower(role)));
					}

					a.criticalAdvisories = _.toSafeInteger(_.get(a, 'criticalAdvisories', 0));
					const row = {
						data: a,
						details: false,
						selected: false,
					};
					_.set(row, 'actions', this.getRowActions(row, view));
					view.data.push(row);
				});

				view.pagination = results.Pagination;

				const first = (view.pagination.rows * (view.pagination.page - 1)) + 1;
				let last = (view.pagination.rows * view.pagination.page);
				if (last > view.pagination.total) {
					last = view.pagination.total;
				}

				view.paginationCount = `${first}-${last}`;

				if (this.selectOnLoad && this.selectedView.key === 'system') {
					this.onAllSelect(true);
					this.onSelectionChanged(_.map(this.selectedView.data, item => item));
					if (this.selectedView.selectedAssets.length === 1) {
						this.selectedAsset = this.selectedView.selectedAssets[0];
						_.set(this.selectedView.data, [0, 'details', true]);
					}
				}

				view.loading = false;
				view.tableContainerHeight = undefined;
			}),
			catchError(err => {
				view.pagination = null;
				view.paginationCount = null;
				this.logger.error('assets.component : fetchInventory() ' +
					`:: Error : (${err.status}) ${err.message}`);
				view.loading = false;

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the users hardware assets
	 * @returns the hardware assets
	 */
	private fetchHardware () {
		const view = this.getView('hardware');
		const params = _.omit(_.cloneDeep(view.params),
			['lastDateOfSupportRange', 'hasNoFieldNotices']);
		const supportRange = _.get(view, ['params', 'lastDateOfSupportRange']);

		if (supportRange) {
			const rangeValue = _.head(supportRange);
			const eoxFilter = _.find(view.filters, { key: 'eox' });
			const rangeFilter = _.find(_.get(eoxFilter, 'seriesData', []),
				{ filter: rangeValue });

			if (rangeFilter && rangeFilter.filterValue) {
				_.set(params, 'lastDateOfSupportRange', rangeFilter.filterValue);
			} else {
				_.unset(view.params, 'lastDateOfSupportRange');
				this.adjustQueryParams();
			}
		}

		if (params.sort) {
			const [field, dir] = _.split(params.sort[0], ':');

			if (field.includes('deviceName')) {
				params.sort.push(`productId:${dir}`);
			}
		}

		if (_.get(view.params, 'hasNoFieldNotices')) {
			params.hasFieldNotices = false;
		}

		return this.fetchInventory(view, params);
	}

	/**
	 * Builds our hardware subject for cancellable http requests
	 */
	private buildHardwareSubject () {
		this.getView('hardware').subject
		.pipe(
			switchMap(() => this.fetchHardware()),
			takeUntil(this.destroy$),
		)
		.subscribe();
	}

	/**
	 * Fetches the coverage counts for the visual filter
	 * @returns the coverage counts observable
	 */
	private getCoverageCounts () {
		const coverageFilter = _.find(this.getView('hardware').filters, { key: 'coverage' });

		return this.contractsService.getCoverageCounts({
			customerId: this.customerId,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		})
		.pipe(
			map((data: CoverageCountsResponse) => {
				coverageFilter.seriesData = _.compact(_.map(data, (value: number, key: string) => {
					if (value !== 0) {
						const filterKey = key === 'uncovered' ? 'not covered' : key;

						return {
							value,
							filter: key,
							label: _.startCase(filterKey),
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
	 * TODO: Implement with Partner API - Out for LA
	 * Fetches the partner counts for the visual filter
	 * @returns the partner counts
	 */
	// private getPartnerCounts () {
	// 	const systemPartnerFilter = _.find(this.getView('system').filters, { key: 'partner' });
	// 	const hardwarePartnerFilter = _.find(this.getView('hardware').filters, { key: 'partner' });

	// 	systemPartnerFilter.loading = false;
	// 	hardwarePartnerFilter.loading = false;

	// 	return of({ });
	// }

	/**
	 * Fetches the advisory counts for the systems visual filter
	 * @returns the advisory counts
	 */
	private getSystemAdvisoryCount () {
		const systemAdvisoryFilter =
			_.find(this.getView('system').filters, { key: 'advisories' });
		const hardwareView = this.getView('hardware');
		const hardwareAdvisoryFilter =
			_.find(hardwareView.filters, { key: 'advisories' });

		return this.productAlertsService.getVulnerabilityCounts({
			customerId: this.customerId,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		})
		.pipe(
			map((data: VulnerabilityResponse) => {
				const systemSeries = [];
				const hardwareSeries = [];

				const bugs = _.get(data, 'bugs', 0);

				if (bugs) {
					systemSeries.push({
						filter: 'hasBugs',
						label: I18n.get('_PriorityBugs_'),
						selected: false,
						value: bugs,
					});
				}

				const security = _.get(data, 'security-advisories', 0);

				if (security) {
					systemSeries.push({
						filter: 'hasSecurityAdvisories',
						label: I18n.get('_SecurityAdvisories_'),
						selected: false,
						value: security,
					});
				}

				const notices = _.get(data, 'field-notices', 0);

				if (notices && notices !== hardwareView.total) {
					hardwareSeries.push(
						{
							filter: 'hasFieldNotices',
							label: I18n.get('_FieldNotices_'),
							selected: false,
							value: notices,
						},
						{
							filter: 'hasNoFieldNotices',
							label: I18n.get('_None_'),
							selected: false,
							value: hardwareView.total - notices,
						},
					);
				}

				systemAdvisoryFilter.seriesData = systemSeries;
				systemAdvisoryFilter.loading = false;

				hardwareAdvisoryFilter.seriesData = hardwareSeries;
				hardwareAdvisoryFilter.loading = false;
			}),
			catchError(err => {
				systemAdvisoryFilter.loading = false;
				hardwareAdvisoryFilter.loading = false;
				this.logger.error('assets.component : getAdvisoryCount() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the hardware type counts for the visual filter
	 * @returns the hardware type counts
	 */
	private getHardwareTypeCounts () {
		const typeFilter = _.find(this.getView('hardware').filters, { key: 'equipmentType' });

		const seriesData = [
			{
				filter: 'CHASSIS',
				label: I18n.get('_Chassis_'),
				selected: false,
				value: 0,
			},
			{
				filter: 'MODULE',
				label: I18n.get('_Module_'),
				selected: false,
				value: 0,
			},
		];

		return forkJoin(
			_.map(seriesData, a =>
				this.inventoryService.headHardwareAssetsResponse({
					customerId: this.customerId,
					equipmentType: a.filter,
					solution: this.selectedSolutionName,
					useCase: this.selectedTechnologyName,
				})
				.pipe(
					map((response: HttpResponse<null>) => {
						a.value = _.toNumber(_.invoke(response, 'headers.get', 'X-API-RESULT-COUNT')) || 0;
					}),
					catchError(err => {
						this.logger.error('assets.component : getHardwareTypeCounts(): ' +
						`${a.filter} :: Error : (${err.status}) ${err.message}`);

						return of({ });
					}),
				),
			),
		)
		.pipe(
			map(() => {
				typeFilter.seriesData = seriesData;
				typeFilter.loading = false;
			}),
		);
	}

	/**
	 * Fetches the role counts for the visual filter
	 * @returns the role counts
	 */
	private getRoleCounts () {
		const roleFilter = _.find(this.getView('system').filters, { key: 'role' });

		return this.inventoryService.getRoleCount({
			customerId: this.customerId,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		})
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
	 * Fetches the hardware eox counts for the visual filter
	 * @returns the counts
	 */
	private getHardwareEOXCounts () {
		const eoxFilter = _.find(this.getView('hardware').filters, { key: 'eox' });

		return this.productAlertsService.getHardwareEolTopCount({
			customerId: this.customerId,
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		})
		.pipe(
			map((data: HardwareEOLCountResponse) => {
				const series = [];

				const sub12 = _.get(data, 'gt-0-lt-12-months');
				const sub12Value = _.get(sub12, 'numericValue', 0);

				if (sub12Value) {
					series.push({
						filter: 'gt-0-lt-12-months',
						filterValue: [`${
							_.get(sub12, 'fromTimestampInMillis')},${
								_.get(sub12, 'toTimestampInMillis')}`],
						label: `< 12 ${_.lowerCase(I18n.get('_Months_'))}`,
						selected: false,
						value: sub12Value,
					});
				}

				const sub24 = _.get(data, 'gt-12-lt-24-months');
				const sub24Value = _.get(sub24, 'numericValue', 0);

				if (sub24Value) {
					series.push({
						filter: 'gt-12-lt-24-months',
						filterValue: [`${
							_.get(sub24, 'fromTimestampInMillis')},${
								_.get(sub24, 'toTimestampInMillis')}`],
						label: `12 - 24 ${_.lowerCase(I18n.get('_Months_'))}`,
						selected: false,
						value: sub24Value,
					});
				}

				const sub36 = _.get(data, 'gt-24-lt-36-months');
				const sub36Value = _.get(sub36, 'numericValue', 0);

				if (sub36Value) {
					series.push({
						filter: 'gt-24-lt-36-months',
						filterValue: [`${
							_.get(sub36, 'fromTimestampInMillis')},${
								_.get(sub36, 'toTimestampInMillis')}`],
						label: `25 - 36 ${_.lowerCase(I18n.get('_Months_'))}`,
						selected: false,
						value: sub36Value,
					});
				}

				const gt36 = _.get(data, 'gt-36-months');
				const gt36Value = _.get(gt36, 'numericValue', 0);

				if (gt36Value) {
					series.push({
						filter: 'gt-36-months',
						filterValue: [`${_.get(sub36, 'fromTimestampInMillis')}`],
						label: `> 36 ${_.lowerCase(I18n.get('_Months_'))}`,
						selected: false,
						value: gt36Value,
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
	 * Fetches the count of the inventory
	 * @returns the inventory count
	 */
	private getInventoryCounts () {
		const systemView = this.getView('system');
		const hardwareView = this.getView('hardware');

		return forkJoin([
			this.inventoryService.headSystemAssetsResponse({
				customerId: this.customerId,
				solution: this.selectedSolutionName,
				useCase: this.selectedTechnologyName,
			})
			.pipe(
				map((response: HttpResponse<null>) => {
					systemView.total = _.toNumber(_.invoke(response, 'headers.get', 'X-API-RESULT-COUNT')) || 0;
				}),
				catchError(err => {
					this.logger.error('assets.component : fetchInventoryCount(): systems ' +
					`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			),
			this.inventoryService.headHardwareAssetsResponse({
				customerId: this.customerId,
				solution: this.selectedSolutionName,
				useCase: this.selectedTechnologyName,
			})
			.pipe(
				map((response: HttpResponse<null>) => {
					hardwareView.total = _.toNumber(_.invoke(response, 'headers.get', 'X-API-RESULT-COUNT')) || 0;
				}),
				catchError(err => {
					this.logger.error('assets.component : fetchInventoryCount(): hardware ' +
					`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			),
		]);
	}

	/**
	 * Returns the selected sub filters
	 * @param key the key to match to the filter
	 * @returns the array of filters
	 */
	public getAllSelectedSubFilters () {
		return _.reduce(this.selectedView.filters, (memo, filter) => {
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
		this.selectedView.filters.forEach((f: VisualFilter) => {
			f.selected = false;
			_.each(f.seriesData, sd => {
				sd.selected = false;
			});
		});

		this.selectedView.selectedSubfilters = [];
		this.selectedView.subject.next();
	}

	/**
	 * Adds a subfilter to the given filer
	 * @param subfilter the subfilter selected
	 * @param filter the filter we selected the subfilter on
	 * @param reload if we're reloading our assets
	 */
	public onSubfilterSelect (subfilter: string, filter: VisualFilter, reload: boolean = true) {
		const view = this.selectedView;
		const sub = _.find(filter.seriesData, { filter: subfilter });

		if (sub) {
			const selected = !sub.selected;
			_.each(filter.seriesData, (s: { selected: boolean }) => _.set(s, 'selected', false));
			sub.selected = selected;
		}

		filter.selected = _.some(filter.seriesData, 'selected');

		view.selectedSubfilters = this.getAllSelectedSubFilters();
		const params = view.params;
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
			key = (subfilter === 'hasNoFieldNotices') ? 'hasFieldNotices' : subfilter;
			val = (subfilter === 'hasNoFieldNotices') ? false : true;
		}

		if (filter.selected) {
			_.set(params, [key], val);
		} else {
			_.unset(params, [key]);
		}

		view.params.page = 1;

		if (filter.selected) {
			view.filtered = true;
		}

		if (reload) {
			this.selectedView.allAssetsSelected = false;
			this.adjustQueryParams();
			view.subject.next();
		}
	}

	/**
	 * Selects all the sub filters based on a list of parameters
	 * @param view the view
	 * @param params the array list of params
	 * @param key the key to search for in the filters
	 */
	private selectSubFilters (view: View, params: string[], key: string) {
		const filter = _.find(view.filters, { key });

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
		this.getInventoryCounts()
		.pipe(
			mergeMap(() =>
				forkJoin(
					this.getCoverageCounts(),
					// this.getPartnerCounts(),
					this.getSystemAdvisoryCount(),
					this.getHardwareTypeCounts(),
					this.getRoleCounts(),
					this.getInventoryCounts(),
				)
				.pipe(
					map(() => _.map(this.views, (view: View) => {
						if (view.key === 'system') {
							const role = _.get(view, ['params', 'role']);
							if (role) {
								this.selectSubFilters(view, role, 'role');
							}

							if (_.get(view, ['params', 'hasBugs'])) {
								this.selectSubFilters(view, ['hasBugs'], 'advisories');
							} else if (_.get(view, ['params', 'hasSecurityAdvisories'])) {
								this.selectSubFilters(view,
									['hasSecurityAdvisories'], 'advisories');
							}
						}

						if (view.key === 'hardware') {
							const coverage = _.get(view, ['params', 'coverage']);
							if (coverage) {
								this.selectSubFilters(view, coverage, 'coverage');
							}

							const hasFieldNotices = _.get(view, ['params', 'hasFieldNotices']);
							if (hasFieldNotices) {
								const subFilter = (hasFieldNotices === 'false') ?
									'hasNoFieldNotices' : 'hasFieldNotices';
								this.selectSubFilters(view, [subFilter], 'advisories');
							}

							const supportRange = _.get(view, ['params', 'lastDateOfSupportRange']);
							if (supportRange) {
								this.selectSubFilters(view, supportRange, 'eox');
							}
						}
						view.subject.next();
					})),
				),
			),
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
	 * Component Initializer
	 */
	public ngOnInit () {
		if (window.Cypress) {
			window.loading = true;
		}

		const currentView = window.sessionStorage.getItem('viewType');
		if (!currentView) {
			window.sessionStorage.setItem('view', this.viewType);
		} else {
			this.viewType = <'list' | 'grid'> currentView;
		}

		this.views = [
			this.systemView(),
			this.hardwareView(),
		];

		_.each(this.views, (view: View) => {
			view.searchForm = new FormGroup({
				search: new FormControl('',
					[
						Validators.minLength(this.searchOptions.min),
						Validators.maxLength(this.searchOptions.max),
						Validators.pattern(this.searchOptions.pattern),
					]),
			});
		});

		if (!_.some(this.views, 'selected')) {
			this.selectView(_.head(this.views));
		}

		this.buildSystemSubject();
		this.buildHardwareSubject();

		this.route.queryParams.subscribe(params => {
			const view = this.selectedView;

			if (params.page) {
				const page = _.toSafeInteger(params.page);
				view.params.page = (page < 1) ? 1 : page;
			}

			if (view.key === 'hardware') {
				if (params.coverage) {
					_.set(view.params, 'coverage', _.castArray(params.coverage));
				}

				if (params.lastDateOfSupportRange) {
					_.set(view.params, 'lastDateOfSupportRange',
						_.castArray(params.lastDateOfSupportRange));
				}

				if (params.hasFieldNotices) {
					_.set(view.params, 'hasFieldNotices', params.hasFieldNotices);
				}
			}

			if (view.key === 'system') {
				if (params.role) {
					_.set(view.params, 'role', _.castArray(params.role));
				}

				if (params.hasBugs) {
					_.set(view.params, 'hasBugs', params.hasBugs);
				} else if (params.hasSecurityAdvisories) {
					_.set(view.params, 'hasSecurityAdvisories', params.hasSecurityAdvisories);
				}
			}

			if (params.serialNumber) {
				view.params.serialNumber = _.castArray(params.serialNumber);
			}

			if (params.search &&
				params.search.length >= this.searchOptions.min &&
				params.search.length <= this.searchOptions.max &&
				this.searchOptions.pattern.test(params.search)) {
				view.params.search = params.search;
				view.searchForm.controls.search.setValue(params.search);
			}

			if (params.sort) {
				const sort = _.split(params.sort, ':');
				_.each(view.table.columns, c => {
					if (sort.length === 2 &&
							c.sortable &&
							c.key &&
							c.key.toLowerCase() === sort[0].toLowerCase()) {
						c.sorting = true;
						c.sortDirection = sort[1].toLowerCase();
						view.params.sort = _.castArray(`${sort[0]}:${sort[1].toUpperCase()}`);
					} else {
						c.sorting = false;
					}
				});
			}

			if (params.select) {
				this.selectOnLoad = true;
			}

			view.filtered = !_.isEmpty(
				_.omit(_.cloneDeep(view.params), ['customerId', 'rows', 'page', 'sort']),
			);
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
			if (this.selectedTechnologyName !== _.get(technology, 'name')) {
				this.selectedTechnologyName = _.get(technology, 'name');
				this.loadData();
			}
		});
	}

	/**
	 * Handler for destroying subscriptions
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
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

		this.selectedView.allAssetsSelected = _.every(this.selectedView.data, 'selected');
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
