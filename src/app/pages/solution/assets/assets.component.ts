import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import { HardwareResponse, InventoryService } from '@cui-x/sdp-api';
import * as _ from 'lodash';
import { CuiTableOptions } from '@cisco-ngx/cui-components';

/**
 * Interface representing our visual filters
 */
interface Filter {
	key: string;
	selected?: boolean;
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
	total?: number;
}

/**
 * Interface to represent the different tab options
 */
interface Tab {
	disabled?: boolean;
	key: string;
	selected?: boolean;
	template: TemplateRef<{ }>;
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

	@ViewChild('assetsContent') private assetsTemplate: TemplateRef<{ }>;
	@ViewChild('eoxContent') private eoxTemplate: TemplateRef<{ }>;
	@ViewChild('contractsContent') private contractsTemplate: TemplateRef<{ }>;

	@ViewChild('casesAssetsFilter') private casesAssetsFilterTemplate: TemplateRef<{ }>;
	@ViewChild('rmasAssetsFilter') private rmasAssetsFilterTemplate: TemplateRef<{ }>;
	@ViewChild('totalAssetsFilter') private totalAssetsFilterTemplate: TemplateRef<{ }>;
	@ViewChild('coverageFilter') private coverageFilterTemplate: TemplateRef<{ }>;
	@ViewChild('statusFilter') private statusFilterTemplate: TemplateRef<{ }>;
	@ViewChild('typeFilter') private typeFilterTemplate: TemplateRef<{ }>;
	@ViewChild('advisoryFilter') private advisoryFilterTemplate: TemplateRef<{ }>;

	public bulkDropdown = false;
	public selectedAssets: any[] = [];
	public tabs: Tab[];
	public selectedTab: Tab;
	public filters: Filter[];
	public visibleTemplate: TemplateRef<{ }>;
	public assetParams: AssetParams = {
		customerId: '2431199',
		limit: 10,
		page: 0,
	};
	public status = {
		isLoading: true,
	};
	public assetsTable: CuiTableOptions;

	public inventory = [];

	constructor (
		private inventoryService: InventoryService,
	) { }

	/**
	 * Used to select which tab we want to view the data for
	 * @param tab the tab we've clicked on
	 */
	public selectTab (tab: Tab) {
		if (!tab.selected) {
			this.tabs.forEach((t: Tab) => {
				t.selected = false;
			});

			tab.selected = true;
			this.selectedTab = tab;
			this.buildFilters(tab);
			this.visibleTemplate = tab.template;
		}
	}

	/**
	 * Selects a visual filter
	 * @param filter the filter to select or unselect
	 */
	public selectFilter (filter: Filter) {
		this.filters.forEach((f: Filter) => {
			if (f.key !== filter.key) {
				f.selected = false;
			}
		});

		filter.selected = !filter.selected;

		if (_.every(this.filters, { selected: false })) {
			this.selectFilter(this.filters[0]);
		}
	}

	/**
	 * Initializes our visual filters
	 * @param tab the tab we're building the filters for
	 */
	private buildFilters (tab: Tab) {
		if (tab.key === 'assets') {
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
					title: I18n.get('_Type_'),
					template: this.typeFilterTemplate,
				},
			];
			this.fetchInventory();
		}
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
						key: 'ipAddress',
						name: I18n.get('_IPAddress_'),
						sortable: true,
						value: 'ipAddress',
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
						key: 'cxLevel',
						name: I18n.get('_CXLevel_'),
						sortable: false,
						value: 'cxLevel',
					},
				],
				dynamicData: true,
				hover: true,
				paddding: 'loose',
				selectable: true,
				sortable: true,
				striped: false,
				wrapText: true,
			});
		}
	}

	/**
	 * Initializes our tabs
	 */
	private buildTabs () {
		this.tabs = [
			{
				key: 'assets',
				template: this.assetsTemplate,
				title: I18n.get('_Assets_'),
			},
			{
				disabled: true,
				key: 'eox',
				template: this.eoxTemplate,
				title: I18n.get('_EoXMilestones_'),
			},
			{
				disabled: true,
				key: 'contracts',
				template: this.contractsTemplate,
				title: I18n.get('_Contracts_'),
			},
		];
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
			});
	}

	/**
	 * Sets the list of selected asset table elements
	 * @param selectedItems array of selected table elements
	 *
	 */
	public onSelectionChanged (selectedItems: any[]) {
		this.selectedAssets = selectedItems;
	}

	/**
	 * OnInit function which will select our first tab
	 */
	public ngOnInit () {
		this.buildTabs();
		this.selectTab(this.tabs[0]);
	}

}
