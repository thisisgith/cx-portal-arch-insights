import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import { HardwareResponse, InventoryService, HardwareInfo } from '@cui-x/sdp-api';
import * as _ from 'lodash-es';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { SolutionService } from '../solution.service';

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
 * Interface which represents params to send to the asset service
 */
interface AssetParams {
	customerId: string;
	limit: number;
	page: number;
	rows: number;
	total?: number;
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
	@ViewChild('statusFilter', { static: true }) private statusFilterTemplate: TemplateRef<{ }>;
	@ViewChild('typeFilter', { static: true }) private typeFilterTemplate: TemplateRef<{ }>;
	@ViewChild('advisoryFilter', { static: true }) private advisoryFilterTemplate: TemplateRef<{ }>;

	public bulkDropdown = false;
	public selectedAssets: HardwareInfo[] = [];
	public filters: Filter[];
	public visibleTemplate: TemplateRef<{ }>;
	public assetParams: AssetParams = {
		customerId: '2431199',
		limit: 10,
		page: 1,
		rows: 10,
	};
	public status = {
		isLoading: true,
	};
	public assetsTable: CuiTableOptions;

	public inventory = [];

	constructor (
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
				title: I18n.get('_Coverage_'),
			},
			{
				key: 'status',
				template: this.statusFilterTemplate,
				title: I18n.get('_Status_'),
			},
			{
				key: 'advisories',
				template: this.advisoryFilterTemplate,
				title: I18n.get('_Advisories_'),
			},
			{
				key: 'cases',
				template: this.casesAssetsFilterTemplate,
				title: I18n.get('_OpenCases_'),
			},
			{
				key: 'rmas',
				template: this.rmasAssetsFilterTemplate,
				title: I18n.get('_OpenRMAs_'),
			},
			{
				key: 'type',
				template: this.typeFilterTemplate,
				title: I18n.get('_Type_'),
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
						key: 'inUse',
						name: I18n.get('_InUse_'),
						sortable: false,
						value: 'inUse',
					},
					{
						key: 'hostname',
						name: I18n.get('_Hostname_'),
						sortable: true,
						sortDirection: 'asc',
						sorting: true,
						value: 'hostname',
					},
					{
						key: 'productId',
						name: I18n.get('_ProductID_'),
						sortable: true,
						value: 'productId',
					},
					{
						key: 'managementAddress',
						name: I18n.get('_IPAddress_'),
						sortable: true,
						value: 'managementAddress',
					},
					{
						key: 'location',
						name: I18n.get('_Location_'),
						sortable: false,
						value: 'location',
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
						key: 'productDescription',
						name: I18n.get('_CXLevel_'),
						sortable: false,
						value: 'productDescription',  // -- temporaily use productDescription
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
		this.inventoryService.getHardware(this.assetParams)
			.subscribe((results: HardwareResponse) => {
				const data = _.get(results, 'data', []);
				this.assetParams.total = data.length;
				this.inventory = data.slice(0, this.assetParams.limit);
				this.buildTable();
				this.status.isLoading = false;
				if (window.Cypress) {
					window.loading = false;
				}
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

}
