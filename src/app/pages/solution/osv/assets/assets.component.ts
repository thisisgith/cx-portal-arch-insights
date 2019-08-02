import {
	Component,
	TemplateRef,
	ViewChild,
	Output,
	Input,
	EventEmitter,
	OnInit,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { forkJoin, Subject, of } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { OSVService, AssetsResponse, OSVAsset, OsvPagination } from '@sdp-api';
import * as _ from 'lodash-es';

/** Our current customerId */
const customerId = '231215372';

/**
 * AssetSoftware Component
 */
@Component({
	selector: 'app-assets',
	styleUrls: ['./assets.component.scss'],
	templateUrl: './assets.component.html',
})
export class AssetsComponent implements OnInit, OnChanges {
	@Input() public selectedAsset;
	@Input() public filters;
	@Input() public fullscreen;
	@Output() public fullscreenChange = new EventEmitter<boolean>();
	@Output() public selectedAssetChange = new EventEmitter<any>();
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{ }>;
	@ViewChild('recommendationsTemplate', { static: true }) private recommendationsTemplate: TemplateRef<{ }>;
	public assetsTable: CuiTableOptions;
	public status = {
		isLoading: true,
	};
	public assets: OSVAsset[];
	public pagination: OsvPagination;
	public paginationCount: string;
	public destroy$ = new Subject();
	public assetsParams: OSVService.GetAssetsParams = {
		customerId,
		filter: '',
		pageIndex: 1,
		pageSize: 10,
		sort:'hostName',
		sortOrder: 'desc',		
	};

	public rowActions = [
		{
			label: I18n.get('_OsvBasicRecommendations_'),
		},
	];

	constructor (
		private logger: LogService,
		private osvService: OSVService,
	) {
		this.logger.debug('AssetComponent Created!');
	}

	/**
	 * Used to select which tab we want to view the data for
	 * @param tab the tab we've clicked on
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.loadData();
	}

	/**
	 * lifecycle hook
	 * @param changes: changes
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentFilter = _.get(changes, ['filters', 'currentValue']);
		if (currentFilter && !changes.filters.firstChange) {
			this.assetsParams.filter = currentFilter;
			this.loadData();
		}
	}

	/**
	 * Function used to load all of the data
	 */
	private loadData () {
		this.status.isLoading = true;
		forkJoin(
			this.getAssets(),
		)
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(() => {
				this.status.isLoading = false;
			});
	}

	/**
	 * Fetches the list of assets
	 * @returns the assets list observable
	 */
	private getAssets () {
		return this.osvService.getAssets(this.assetsParams)
			.pipe(
				map((response: AssetsResponse) => {
					this.assets = response.uiAssetList;
					this.pagination = response.pagination;
					this.pagination.rows = this.assetsParams.pageSize;
					const first = (this.pagination.rows * (this.pagination.page - 1)) + 1;
					let last = (this.pagination.rows * this.pagination.page);
					if (last > this.pagination.total) {
						last = this.pagination.total;
					}
					this.paginationCount = `${first}-${last}`;
					this.buildTable();
				}),
				catchError(err => {
					this.logger.error('OSV Assets : getAssets() ' +
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
						key: 'hostName',
						name: I18n.get('_OsvHostName'),
						width: '10%',
						sortDirection:'desc',
						sortable: true,
						sorting: true,
					},
					{
						key: 'ipAddress',
						name: I18n.get('_OsvIpAddress_'),
						sortable:false,
					},
					{
						key: 'productFamily',
						name: I18n.get('_OsvProductFamily_'),
						sortable: true,
					},
					{
						key: 'swType',
						name: I18n.get('_OsvOSType_'),
						sortable:false,
					},
					{
						key: 'swVersion',
						name: I18n.get('_OsvCurrentOSVersion_'),
						sortable:false,
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvOptimalVersion_'),
						sortable:false,
					},
					{
						key: 'deployment',
						name: I18n.get('_OsvDeploymentStatus_'),
						sortable:false,
					},
					{
						name: I18n.get('_OsvRecommendations_'),
						template:this.recommendationsTemplate,
						sortable:false,
					},
					// {
					// 	click: true,
					// 	sortable: false,
					// 	template: this.actionsTemplate,
					// },
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
	}

	/**
	 * Function used to handle single row selection
	 * @param item the item we selected
	 */
	public onRowSelect (item: any) {
		this.fullscreen = false;
		this.fullscreenChange.emit(this.fullscreen);
		this.selectedAsset = item;
		this.selectedAssetChange.emit(this.selectedAsset);
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Page change handler
	 * @param event the event emitted
	 */
	public onPageChanged (event: any) {
		this.assetsParams.pageIndex = (event.page + 1);
		this.loadData();
	}

	/**
	 * Sorts the table by a column
	 * @param sortColumn The column to sort by
	 */
	public sortTable (sortColumn: any) {
		if (!sortColumn.sortable) {
			return;
		}
		if(sortColumn.sortDirection === 'asc'){
			sortColumn.sortDirection = 'desc';
		} else {
			sortColumn.sortDirection = 'asc';	
		}
		this.assetsParams.sortOrder = sortColumn.sortDirection;
		this.assetsParams.sort = sortColumn.key;
		this.loadData();
	}

	/**
	 * Returns the row specific actions
	 * @param asset the asset we're building the actions for
	 * @returns the built actions
	 */
	public getRowActions (asset: OSVAsset) {
		return [
			[
				{
					asset,
					label: I18n.get('_OsvBasicRecommendations_'),
					onClick: (action: any) => {
						this.logger.debug(action);
					},
				},
			],
		];
	}

}
