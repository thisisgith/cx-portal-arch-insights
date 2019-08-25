import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnInit,
	OnDestroy,
	ViewChild,
	TemplateRef,
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
	templateUrl: './software-groups.component.html',
})
export class SoftwareGroupsComponent implements OnInit, OnDestroy {
	@Input() public fullscreen;
	@Output() public fullscreenChange = new EventEmitter<boolean>();
	@Input() public selectedSoftwareGroup;
	@Output() public contactExpert = new EventEmitter();
	@Output() public selectedSoftwareGroupChange = new EventEmitter<SoftwareGroup>();
	@Input() public tabIndex;
	@Output() public tabIndexChange = new EventEmitter<number>();
	@ViewChild('recommendationsTemplate', { static: true })
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{ }>;
	private recommendationsTemplate: TemplateRef<{ }>;
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
		};
	}

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.loadData();
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
					this.logger.error('OSV Profile Groups : getsoftwareGroups() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
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
						sortDirection: 'desc',
						sorting: false,
						width: '30%',
					},
					{
						key: 'productFamily',
						name: I18n.get('_OsvProductFamily_'),
						sortable: false,
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
						width: '10%',
					},
					{
						key: 'currentOSVersion',
						name: I18n.get('_OsvCurrentOSVersion_'),
						sortable: false,
						width: '10%',
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvOptimalVersion_'),
						sortable: false,
						width: '10%',
					},
					{
						name: I18n.get('_OsvRecommendations_'),
						sortable: false,
						template: this.recommendationsTemplate,
						width: '10%',
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
		this.softwareGroups.forEach((asset: any) => {
			if (asset !== item) {
				asset.rowSelected = false;
			}
		});
		item.rowSelected = !item.rowSelected;
		this.fullscreen = false;
		this.fullscreenChange.emit(this.fullscreen);
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
					this.selectedSoftwareGroup = softwareGroup;
					this.selectedSoftwareGroupChange.emit(this.selectedSoftwareGroup);
					this.tabIndex = 0;
					this.tabIndexChange.emit(this.tabIndex);
				},
			},
			{
				label: I18n.get('_OsvRecommendations_'),
				onClick: () => {
					this.selectedSoftwareGroup = softwareGroup;
					this.selectedSoftwareGroupChange.emit(this.selectedSoftwareGroup);
					this.tabIndex = 1;
					this.tabIndexChange.emit(this.tabIndex);
				},
			},
			{
				label: I18n.get('_OsvViewAssets_'),
				onClick: () => {
					this.selectedSoftwareGroup = softwareGroup;
					this.selectedSoftwareGroupChange.emit(this.selectedSoftwareGroup);
					this.tabIndex = 2;
					this.tabIndexChange.emit(this.tabIndex);
				},
			},
			{
				label: I18n.get('_OsvViewVersions_'),
				onClick: () => {
					this.selectedSoftwareGroup = softwareGroup;
					this.selectedSoftwareGroupChange.emit(this.selectedSoftwareGroup);
					this.tabIndex = 3;
					this.tabIndexChange.emit(this.tabIndex);
				},
			},
		]);
	}

}
