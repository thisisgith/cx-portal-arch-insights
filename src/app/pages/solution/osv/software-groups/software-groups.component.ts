import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnInit,
	OnDestroy,
	ViewChild,
	TemplateRef,
	SimpleChanges,
	OnChanges,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { Subject, of } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { SoftwareGroupsResponse, OSVService, OsvPagination, SoftwareGroup } from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

/**
 * SoftwareGroups Component
 */
@Component({
	selector: 'app-software-groups',
	styleUrls: ['./software-groups.component.scss'],
	templateUrl: './software-groups.component.html',
})
export class SoftwareGroupsComponent implements OnInit, OnDestroy, OnChanges {
	@Input() public filters;
	@Output() public contactSupport = new EventEmitter();
	@Input() public cxLevel;
	@Input() public selectedSoftwareGroup;
	@Output() public selectedSoftwareGroupChange = new EventEmitter<SoftwareGroup>();
	@Input() public tabIndex;
	@Output() public tabIndexChange = new EventEmitter<number>();
	@ViewChild('recommendationsTemplate', { static: true })
	private recommendationsTemplate: TemplateRef<{ }>;
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{ }>;
	@ViewChild('currentOSVersionsTemp', { static: true })
	private currentOSVersionsTemp: TemplateRef<{ }>;
	public softwareGroupsTable: CuiTableOptions;
	public status = {
		isLoading: true,
	};
	public softwareGroups: SoftwareGroup[];
	public pagination: OsvPagination;
	public paginationCount: string;
	public destroy$ = new Subject();
	public softwareGroupsParams: OSVService.GetSoftwareGroupsParams;
	public customerId: string;
	public alert: any = { };
	constructor (
		public logger: LogService,
		public osvService: OSVService,
		public route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.softwareGroupsParams = {
			customerId: this.customerId,
			pageIndex: 1,
			pageSize: 10,
			sort: 'profileName',
			sortOrder: 'asc',
			filter: '',
		};
	}

	/**
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
		const selectedSoftwareGroup = _.get(changes, ['selectedSoftwareGroup', 'currentValue']);
		const statusUpdated = _.get(selectedSoftwareGroup, 'statusUpdated');
		const isFirstChange = _.get(changes, 'selectedSoftwareGroup.firstChange');
		if (selectedSoftwareGroup && statusUpdated && !isFirstChange) {
			const selected = _.filter(this.softwareGroups, { id: selectedSoftwareGroup.id });
			if (selected && selected.length > 0) {
				selected[0].optimalVersion = _.get(selectedSoftwareGroup, 'optimalVersion');
			}
		}
	}

	/**
	 * Function used to load all of the data
	 */
	public loadData () {
		this.getSoftwareGroups();
	}

	/**
	 * fetches profile groups
	 * @returns profile groups list observable
	 */
	public getSoftwareGroups () {
		this.status.isLoading = true;
		return this.osvService.getSoftwareGroups(this.softwareGroupsParams)
			.pipe(
				map((response: SoftwareGroupsResponse) => {
					this.status.isLoading = false;
					response.uiProfileList.forEach((softwareGroup: SoftwareGroup) => {
						_.set(softwareGroup, 'actions', this.getRowActions(softwareGroup));
					});
					this.softwareGroups = response.uiProfileList;
					this.pagination = response.pagination;
					this.pagination.rows = this.softwareGroupsParams.pageSize;
					const first = (this.pagination.rows * (this.pagination.page - 1)) + 1;
					let last = (this.pagination.rows * this.pagination.page);
					if (last > this.pagination.total) {
						last = this.pagination.total;
					}

					this.paginationCount = `${first}-${last}`;
					this.buildTable();
				}),
				takeUntil(this.destroy$),
				catchError(err => {
					_.invoke(this.alert, 'show', I18n.get('_OsvGenericError_'), 'danger');
					this.logger.error('OSV Profile Groups : getsoftwareGroups() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of();
				}),
			)
			.subscribe(() => {
				this.status.isLoading = false;
			});
	}

	/**
	 * Will construct the assets table
	 */
	public buildTable () {
		if (!this.softwareGroupsTable) {
			this.softwareGroupsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'profileName',
						name: I18n.get('_OsvSoftwareGroup_'),
						sortable: true,
						sortDirection: 'asc',
						sorting: true,
						width: '20%',
					},
					{
						key: 'productFamily',
						name: I18n.get('_OsvProductFamily_'),
						sortable: true,
						width: '20%',
					},
					{
						key: 'assetCount',
						name: I18n.get('_OsvAssetCount_'),
						sortable: false,
						width: '10%',
					},
					{
						key: 'swType',
						name: I18n.get('_OsvOSType_'),
						sortable: false,
						width: '15%',
					},
					{
						name: I18n.get('_OsvCurrentOSVersion_'),
						sortable: false,
						template: this.currentOSVersionsTemp,
						width: '15%',
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvOptimalVersion_'),
						sortable: false,
						width: '15%',
					},
					{
						name: I18n.get('_OsvRecommendations_'),
						sortable: false,
						template: this.recommendationsTemplate,
						width: '15%',
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
	}

	/**
	 * Function used to handle single row selection
	 * @param item the item we selected
	 */
	public onRowSelect (item: any) {
		this.softwareGroups.forEach((softwareGroup: any) => {
			if (softwareGroup !== item) {
				softwareGroup.rowSelected = false;
			}
			softwareGroup.statusUpdated = false;
		});
		item.rowSelected = !item.rowSelected;
		this.tabIndex = 0;
		this.tabIndexChange.emit(this.tabIndex);
		this.selectedSoftwareGroup = item.rowSelected ? item : null;
		this.selectedSoftwareGroupChange.emit(this.selectedSoftwareGroup);
	}

	/**
	 * Page change handler
	 * @param event the event emitted
	 */
	public onPageChanged (event: any) {
		this.softwareGroupsParams.pageIndex = (event.page + 1);
		this.loadData();
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		_.invoke(this.alert, 'hide');
		_.map(this.softwareGroups, (softwareGroup: any) => {
			softwareGroup.rowSelected = false;
		});
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Returns the row specific actions
	 * @param softwareGroup the row we're building our actions for
	 * @returns the built actions
	 */
	public getRowActions (softwareGroup: SoftwareGroup) {
		return _.filter([
			{
				label: I18n.get('_OsvCompareRecommendations'),
				onClick: () => {
					this.openSoftwareGroupDetails(0, softwareGroup);
				},
			},
			{
				label: I18n.get('_OsvRecommendations_'),
				onClick: () => {
					this.openSoftwareGroupDetails(1, softwareGroup);
				},
			},
			{
				label: I18n.get('_OsvViewAssets_'),
				onClick: () => {
					this.openSoftwareGroupDetails(2, softwareGroup);
				},
			},
			{
				label: I18n.get('_OsvViewVersions_'),
				onClick: () => {
					this.openSoftwareGroupDetails(3, softwareGroup);
				},
			},
		]);
	}

	/**
	 * * open software group details
	 * @param tabIndex tab to open
	 * @param softwareGroup software group data for details
	 */
	public openSoftwareGroupDetails (tabIndex, softwareGroup) {
		this.selectedSoftwareGroup = _.cloneDeep(softwareGroup);
		this.selectedSoftwareGroupChange.emit(this.selectedSoftwareGroup);
		this.tabIndex = tabIndex;
		this.tabIndexChange.emit(this.tabIndex);
	}

	/**
	 * open up the versions tab in software group detail
	 * @param event click event
	 * @param item software groups row item
	 */
	public openCurrentVersionsTab (event: any, item: SoftwareGroup) {
		event.stopPropagation();
		this.openSoftwareGroupDetails(3, item);
	}

	/**
	 * sort table
	 * @param sortColumn column to sort by
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
		this.softwareGroupsTable.columns.forEach(column => {
			column.sorting = false;
		});
		sortColumn.sorting = true;
		this.softwareGroupsParams.sortOrder = sortColumn.sortDirection;
		this.softwareGroupsParams.sort = sortColumn.key;
		this.softwareGroupsParams.pageIndex = 1;
		this.loadData();
	}

}
