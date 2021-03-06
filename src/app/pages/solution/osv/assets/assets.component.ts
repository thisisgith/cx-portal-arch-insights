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
	OnDestroy,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { forkJoin, Subject, of } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { OSVService, AssetsResponse, OSVAsset, OsvPagination } from '@sdp-api';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';
/**
 * AssetSoftware Component
 */
@Component({
	selector: 'app-assets',
	styleUrls: ['./assets.component.scss'],
	templateUrl: './assets.component.html',
})
export class AssetsComponent implements OnInit, OnChanges, OnDestroy {

	@Input() public selectedAsset;
	@Input() public filters;
	@Input() public fullscreen;
	@Input() public cxLevel;
	@Input() public assetsCount;
	@Input() public solution;
	@Input() public useCase;
	@Output() public fullscreenChange = new EventEmitter<boolean>();
	@Output() public selectedAssetChange = new EventEmitter<OSVAsset>();
	@Output() public contactSupport = new EventEmitter();
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{ }>;
	@ViewChild('versionTemplate', { static: true }) private versionTemplate: TemplateRef<{ }>;
	@ViewChild('recommendationsTemplate', { static: true })
	private recommendationsTemplate: TemplateRef<{ }>;
	@ViewChild('hostTemplate', { static: true })
	private hostTemplate: TemplateRef<{ }>;
	public assetsTable: CuiTableOptions;
	public status = {
		isLoading: false,
	};
	public assets: OSVAsset[];
	public pagination: OsvPagination;
	public paginationCount: string;
	public destroy$ = new Subject();
	public assetsParams: OSVService.GetAssetsParams;
	public customerId: string;
	public sorting: 'asc' | 'desc';
	public rowActions = [
		{
			label: I18n.get('_OsvBasicRecommendations_'),
		},
	];
	public alert: any = { };
	public searchOptions = {
		debounce: 600,
	};

	constructor (
		private logger: LogService,
		private osvService: OSVService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);

		this.assetsParams = {
			customerId: this.customerId,
			filter: '',
			pageIndex: 1,
			pageSize: 10,
			search: '',
			sort: 'hostName',
			sortOrder: 'asc',
			solution: '',
			useCase: '',
		};
	}

	/**
	 * Used to select which tab we want to view the data for
	 * @param tab the tab we've clicked on
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		if (this.assetsCount > 0) {
			this.assetsParams.solution = this.solution;
			this.assetsParams.useCase = this.useCase;
			this.loadData();
		}
	}

	/**
	 * lifecycle hook
	 * @param changes: changes
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentFilter = _.get(changes, ['filters', 'currentValue']);
		if (currentFilter && !changes.filters.firstChange && this.assetsCount > 0) {
			this.setFilter(currentFilter);
			this.loadData();
		}
		const solution = _.get(changes, ['solution', 'currentValue']);
		const useCase = _.get(changes, ['useCase', 'currentValue']);
		if (solution && !_.get(changes, ['solution', 'firstChange'])) {
			this.assetsParams.solution = solution;
			this.loadData();
		}
		if (useCase && !_.get(changes, ['useCase', 'firstChange'])) {
			this.assetsParams.useCase = useCase;
			this.loadData();
		}
	}

	/**
	 * set the filters are part of query params
	 * @param currentFilter current filters selected by customer
	 */
	public setFilter (currentFilter) {
		const assetType = _.get(currentFilter, 'assetType', []);
		const deploymentStatus = _.get(currentFilter, 'deploymentStatus', []);
		let filter = '';
		if (deploymentStatus.length > 0) {
			filter += `deployment:${deploymentStatus.join(',')}`;
		}
		if (assetType.length === 1) {
			filter += filter.length > 0 ? ';' : '';
			filter += assetType.indexOf('assets_profile') > -1
				? 'independent:no' : 'independent:yes';
		}
		this.assetsParams.pageIndex = 1;
		this.assetsParams.filter = filter;
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
					_.invoke(this.alert, 'show', I18n.get('_OsvGenericError_'), 'danger');
					this.assets = [];
					this.pagination = {
						total: 0,
					};
					this.logger.error('OSV Assets : getAssets() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);
	}

	/**
	 * Will construct the assets table
	 */
	public buildTable () {
		if (!this.assetsTable) {
			this.assetsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'hostName',
						name: I18n.get('_OsvHostName'),
						sortable: true,
						sortDirection: 'asc',
						sorting: true,
						template: this.hostTemplate,
						width: '15%',
					},
					{
						key: 'ipAddress',
						name: I18n.get('_OsvIpAddress_'),
						sortable: false,
						width: '10%',
					},
					{
						key: 'productFamily',
						name: I18n.get('_OsvProductFamily_'),
						sortable: true,
						width: '20%',
					},
					{
						key: 'profileName',
						name: I18n.get('_OsvSoftwareGroup_'),
						sortable: true,
						render: item =>
							item.profileName ? item.profileName : '',
						width: '10%',
					},
					{
						key: 'swType',
						name: I18n.get('_OsvOSType_'),
						sortable: true,
						width: '100px',
					},
					{
						name: I18n.get('_OsvCurrentOSVersion_'),
						sortable: false,
						template: this.versionTemplate,
						width: '10%',
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvAcceptedRelease_'),
						render: item =>
							item.optimalVersion ? item.optimalVersion : '',
						sortable: false,
						width: '10%',
					},
					{
						key: 'deploymentStatus',
						name: I18n.get('_OsvDeploymentStatus_'),
						render: item =>
							item.deploymentStatus ? item.deploymentStatus : '',
						sortable: true,
						width: '10%',
					},
					{
						key: 'recommendation',
						name: I18n.get('_OsvRecommendations_'),
						sortable: true,
						template: this.recommendationsTemplate,
						width: '10%',
					},
				],
				dynamicData: true,
				hover: true,
				padding: 'compressed',
				selectable: false,
				singleSelect: true,
				sortable: true,
				striped: false,
			});
		}
	}

	/**
	 * Function used to handle single row selection
	 * @param item the item we selected
	 */
	public onRowSelect (item: any) {
		this.assets.forEach((asset: any) => {
			if (asset !== item) {
				asset.rowSelected = false;
			}
		});
		item.rowSelected = !item.rowSelected;
		this.fullscreen = false;
		this.fullscreenChange.emit(this.fullscreen);
		this.selectedAsset = item.rowSelected ? item : null;
		this.selectedAssetChange.emit(this.selectedAsset);
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		_.invoke(this.alert, 'hide');
		_.map(this.assets, (asset: any) => {
			asset.rowSelected = false;
		});
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
		if (sortColumn.sortDirection === 'asc') {
			sortColumn.sortDirection = 'desc';
		} else {
			sortColumn.sortDirection = 'asc';
		}
		this.assetsTable.columns.forEach(column => {
			column.sorting = false;
		});
		sortColumn.sorting = true;
		this.assetsParams.sortOrder = sortColumn.sortDirection;
		this.assetsParams.sort = sortColumn.key;
		this.assetsParams.pageIndex = 1;
		this.loadData();
	}

	/**
	 * Handler for performing a search
	 * @param query search string
	 */
	public onSearchQueryAsset (query?: string) {
		this.assetsParams.search = query;
		this.assetsParams.pageIndex = 1;
		this.loadData();
	}
}
