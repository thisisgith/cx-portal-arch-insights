import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	InventoryService,
	HardwareInfo,
	NetworkElementResponse,
	Pagination,
} from '@cui-x/sdp-api';
import * as _ from 'lodash-es';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { SolutionService } from '../solution.service';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Interface representing our visual filters
 */
interface Filter {
	key: string;
	selected?: boolean;
	subfilter?: string;
	template?: TemplateRef<{ }>;
	title: string;
}

/**
 * Assets Component
 */
@Component({
	styleUrls: ['./assets.component.scss'],
	templateUrl: './assets.component.html',
})
export class AssetsComponent implements OnInit {
	@ViewChild('casesAssetsFilter', { static: true }) private casesAssetsFilterTemplate:
		TemplateRef<{ }>;
	@ViewChild('rmasAssetsFilter', { static: true }) private rmasAssetsFilterTemplate:
		TemplateRef<{ }>;
	@ViewChild('totalAssetsFilter', { static: true }) private totalAssetsFilterTemplate:
		TemplateRef<{ }>;
	@ViewChild('assetsContent', { static: true }) private assetsTemplate: TemplateRef<{ }>;
	@ViewChild('eoxContent', { static: true }) private eoxTemplate: TemplateRef<{ }>;
	@ViewChild('contractsContent', { static: true }) private contractsTemplate: TemplateRef<{ }>;
	@ViewChild('coverageFilter', { static: true }) private coverageFilterTemplate: TemplateRef<{ }>;
	@ViewChild('contractFilter', { static: true }) private contractFilterTemplate: TemplateRef<{ }>;
	@ViewChild('typeFilter', { static: true }) private typeFilterTemplate: TemplateRef<{ }>;
	@ViewChild('advisoryFilter', { static: true }) private advisoryFilterTemplate: TemplateRef<{ }>;

	public bulkDropdown = false;
	public selectedAssets: HardwareInfo[] = [];
	public filters: Filter[];
	public visibleTemplate: TemplateRef<{ }>;
	public assetParams: InventoryService.GetNetworkElementsParams = {
		customerId: '2431199',
		page: 1,
		rows: 10,
	};
	public pagination: Pagination;
	public status = {
		isLoading: true,
	};
	public assetsTable: CuiTableOptions;

	public inventory = [];

	public view: 'list' | 'grid' = 'list';

	constructor (
		private logger: LogService,
		private inventoryService: InventoryService,
		private solutionService: SolutionService,
	) { }

	/**
	 * Returns the current selected visual filters
	 * @returns the selected visual filters
	 */
	public getSelectedFilters () {
		return _.filter(this.filters, 'selected');
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
		this.fetchInventory();
	}

	/**
	 * Adds a subfilter to the given filer
	 * @param subfilter the subfilter selected
	 * @param key the key of the subfilter's filter
	 */
	public onSubfilterSelect (subfilter: string, key: string) {
		this.filters.forEach((f: Filter) => {
			if (f.key === key) {
				// only select/deselect if the filter is unselected or
				// selecting the same subfilter when already selected
				if ((!f.selected) || (f.selected && f.subfilter === subfilter)) {
					f.subfilter = subfilter;
					this.selectFilter(f);
				} else {
					f.subfilter = subfilter;
				}

				return;
			}
		});
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
	 * Handler for table event selection, will send out an update for the solution service
	 * @param row the selected row
	 */
	public rowSelected (row: HardwareInfo) {
		const active = _.get(row, 'active', false);

		this.solutionService.sendCurrentAsset(active ? row : null);
	}

	/**
	 * Selects a visual filter
	 * @param filter the filter to select or unselect
	 */
	public selectFilter (filter: Filter) {
		filter.selected = !filter.selected;

		// clear the subfilter when a filter has been deselected
		if (!filter.selected) {
			filter.subfilter = undefined;
		}
	}

	/**
	 * Initializes our visual filters
	 * @param tab the tab we're building the filters for
	 */
	private buildFilters () {
		this.filters = [
			{
				key: 'total',
				selected: true,
				template: this.totalAssetsFilterTemplate,
				title: I18n.get('_Total_'),
			},
			{
				key: 'coverage',
				template: this.coverageFilterTemplate,
				title: I18n.get('_CoverageStatus_'),
			},
			{
				key: 'contract',
				template: this.contractFilterTemplate,
				title: I18n.get('_Contract_'),
			},
			{
				key: 'advisories',
				template: this.advisoryFilterTemplate,
				title: I18n.get('_Advisories_'),
			},
			// {
			// 	key: 'cases',
			// 	template: this.casesAssetsFilterTemplate,
			// 	title: I18n.get('_OpenCases_'),
			// },
			// {
			// 	key: 'rmas',
			// 	template: this.rmasAssetsFilterTemplate,
			// 	title: I18n.get('_OpenRMAs_'),
			// },
			{
				key: 'role',
				template: this.typeFilterTemplate,
				title: I18n.get('_NetworkRole_'),
			},
		];
		this.fetchInventory();
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
						key: 'hostName',
						name: I18n.get('_Device_'),
						sortable: true,
						sortDirection: 'asc',
						sorting: true,
						value: 'hostName',
					},
					{
						key: 'ipAddress',
						name: I18n.get('_IPAddress_'),
						sortable: true,
						value: 'ipAddress',
					},
					{
						key: 'lastUpdateDate',
						name: I18n.get('_LastScan_'),
						sortable: false,
						value: 'lastUpdateDate',
					},
					{
						name: I18n.get('_CriticalAdvisories_'),
						render: item => item.criticalAdvisories ? item.criticalAdvisories : 0,
						sortable: false,
					},
					{
						name: I18n.get('_SupportCoverage_'),
						render: item => item.supportCoverage ? item.supportCoverage : false,
						sortable: false,
					},
					{
						key: 'serialNumber',
						name: I18n.get('_SerialNumber_'),
						sortable: true,
						value: 'serialNumber',
					},
					{
						key: 'swType',
						name: I18n.get('_OSType_'),
						sortable: true,
						value: 'swType',
					},
					{
						key: 'swVersion',
						name: I18n.get('_OSVersion_'),
						sortable: true,
						value: 'swVersion',
					},
					{
						key: 'productType',
						name: I18n.get('_Role_'),
						sortable: false,
						value: 'productType',
					},
				],
				dynamicData: true,
				hover: true,
				paddding: 'loose',
				selectable: false,
				singleSelect: true,
				sortable: true,
				striped: false,
				wrapText: true,
			});
		}
	}

	/**
	 * Fetches the users inventory
	 */
	private fetchInventory () {
		this.status.isLoading = true;
		this.inventoryService.getNetworkElements(this.assetParams)
			.subscribe((results: NetworkElementResponse) => {
				this.inventory = results.data;
				this.pagination = results.Pagination;

				this.buildTable();

				this.status.isLoading = false;

				if (window.Cypress) {
					window.loading = false;
				}
			},
			err => {
				this.logger.error('assets.component : fetchInventory() ' +
					`:: Error : (${err.status}) ${err.message}`);
				this.status.isLoading = false;
			});
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
	 * Changes the view to either list or grid
	 * @param view view to set
	 */
	public selectView (view: 'list' | 'grid') {
		this.view = view;
	}
}
