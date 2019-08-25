import {
	Component,
	OnInit,
	ViewChild,
	TemplateRef,
	Input,
	SimpleChanges,
	OnDestroy,
	OnChanges,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import * as _ from 'lodash-es';
import {
	OSVService,
	SoftwareGroup,
	SoftwareGroupVersion,
	SoftwareGroupAsset,
	SoftwareGroupVersionsResponse,
	SoftwareGroupAssetsResponse,
	OsvPagination,
} from '@sdp-api';
import { forkJoin, Subject, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { DatePipe } from '@angular/common';

/**
 * SoftwareGroupDetail Component
 */
@Component({
	selector: 'app-software-group-detail',
	styleUrls: ['./software-group-detail.component.scss'],
	templateUrl: './software-group-detail.component.html',
})
export class SoftwareGroupDetailComponent implements OnInit, OnDestroy, OnChanges {
	@Input() public selectedSoftwareGroup: SoftwareGroup;
	@Input() fullscreen;
	@Input() public tabIndex: number = 0;
	public status = {
		isLoading: true,
	};
	private destroy$ = new Subject();
	public customerId: string;
	private params: OSVService.GetSoftwareGroupDetailsParam;
	public softwareGroupVersions: SoftwareGroupVersion[];
	public softwareGroupAssets: SoftwareGroupAsset[];
	public softwareGroupVersionsTable: CuiTableOptions;
	public softwareGroupAssetsTable: CuiTableOptions;
	public softwareGroupAssetsParams: OSVService.GetAssetsParams;
	public softwareGroupVersionsParams: OSVService.GetAssetsParams;
	public assetsPagination: OsvPagination;
	public assetsPaginationCount: string;
	public versionsPagination: OsvPagination;
	public versionsPaginationCount: string;
	constructor (
		private logger: LogService,
		private osvService: OSVService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.params = {
			customerId: this.customerId,
			id: '231215372_NA,FXS2202Q11R,C9407R,NA_C9407R_FXS2202Q11R',
		};
		this.softwareGroupAssetsParams = {
			customerId: this.customerId,
			pageIndex: 1,
			pageSize: 10,
		};
		this.softwareGroupVersionsParams = {
			customerId: this.customerId,
			pageIndex: 1,
			pageSize: 10,
		};

		this.logger.debug('SoftwareGroupDetailComponent Created!');
	}

	/**
	 * Initialization hook
	 */
	public ngOnInit (): void {
		this.refresh();
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		if (this.selectedSoftwareGroup) {
			this.clear();
			// this.params.id = this.selectedProfileGroup.id;
			this.loadData();
		}
	}

	/**
	 * load data
	 */
	public loadData () {
		this.status.isLoading = true;
		forkJoin(
			// this.getProfileRecommendations(),
			this.getSoftwareGroupAssets(),
			this.getSoftwareGroupVersions(),
		)
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(() => {
				this.status.isLoading = false;
				this.logger.debug('assets software.component: loadData()::Done Loading');
			});
	}

	/**
	 * get software group assets list
	 * @returns software group assets list observable
	 */
	public getSoftwareGroupAssets () {
		return this.osvService.getSoftwareGroupAssets(this.params)
			.pipe(
				map((response: SoftwareGroupAssetsResponse) => {
					this.softwareGroupAssets = response.uiAssetList;
					this.assetsPagination = response.pagination;
					this.assetsPagination.rows = this.softwareGroupAssetsParams.pageSize;
					const first = (this.assetsPagination.rows * (this.assetsPagination.page - 1)) + 1;
					let last = (this.assetsPagination.rows * this.assetsPagination.page);
					if (last > this.assetsPagination.total) {
						last = this.assetsPagination.total;
					}
					this.assetsPaginationCount = `${first}-${last}`;
					this.buildSoftwareGroupAssetsTable();
				}),
				catchError(err => {
					this.logger.error('OSV SG : getSoftwareGroupAsset() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({});
				}),
			);
	}

	/**
	 * get software group versions list
	 * @returns software group versions list observable
	 */
	public getSoftwareGroupVersions () {
		return this.osvService.getSoftwareGroupVersions(this.params)
			.pipe(
				map((response: SoftwareGroupVersionsResponse) => {
					this.softwareGroupVersions = response.uiSwVersionList;
					this.versionsPagination = response.pagination;
					this.versionsPagination.rows = this.softwareGroupVersionsParams.pageSize;
					const first = (this.versionsPagination.rows * (this.versionsPagination.page - 1)) + 1;
					let last = (this.versionsPagination.rows * this.versionsPagination.page);
					if (last > this.versionsPagination.total) {
						last = this.versionsPagination.total;
					}
					this.versionsPaginationCount = `${first}-${last}`;
					this.buildSoftwareGroupVersionsTable();
				}),
				catchError(err => {
					this.logger.error('OSV SG : getSoftwareGroupVersions() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({});
				}),
			);
	}

	/**
	 * Resets data fields
	 */
	public clear () {
		this.softwareGroupAssets = null;
		this.softwareGroupVersions = null;
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Checks if our currently selected software group has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentSelectedGroup = _.get(changes, ['selectedProfileGroup', 'currentValue']);
		const isFirstChange = _.get(changes, ['selectedProfileGroup', 'firstChange']);
		const currentTabIndex = _.get(changes, ['tabIndex', 'currentValue'], 0);
		if (currentTabIndex && isFirstChange) {
			this.tabIndex = currentTabIndex;
		}
		this.tabIndex = _.get(changes, ['tabIndex', 'currentValue'], 0);
		if (currentSelectedGroup && !isFirstChange) {
			this.refresh();
		}
	}

	/**
	 * build software group versions table
	 */
	public buildSoftwareGroupVersionsTable () {
		const datePipe = new DatePipe('en-US');
		if (!this.softwareGroupVersionsTable) {
			this.softwareGroupVersionsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'swVersion',
						name: I18n.get('_OsvVersion_'),
						sortable: false,
						sortDirection: 'asc',
						sorting: false,
						width: '10%',
					},
					{
						name: I18n.get('_OsvReleaseDate_'),
						render: item => item.postDate ?
							datePipe.transform(
								new Date(item.postDate), 'yyyy MMM dd') :
							'',
						sortable: false,
					},
					{
						key: 'swType',
						name: I18n.get('_OsvOSType_'),
						sortable: false,
					},
					{
						key: 'assetCount',
						name: I18n.get('_OsvAssetCount_'),
						sortable: false,
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvOptimalOSVersion_'),
						sortable: false,
					},
				],
				dynamicData: true,
				hover: true,
				padding: 'compressed',
				selectable: false,
				singleSelect: false,
				sortable: true,
				striped: true,
				wrapText: true,
			});
		}
	}

	/**
	 * build software group assets table
	 */
	public buildSoftwareGroupAssetsTable () {
		const datePipe = new DatePipe('en-US');
		if (!this.softwareGroupAssetsTable) {
			this.softwareGroupAssetsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'hostName',
						name: I18n.get('_OsvHostName'),
						width: '10%',
						sortable: false,
						sortDirection: 'asc',
						sorting: false,
					},
					{
						key: 'ipAddress',
						name: I18n.get('_OsvIpAddress_'),
						sortable: false,
					},
					{
						key: 'swType',
						name: I18n.get('_OsvOSType_'),
						sortable: false,
					},
					{
						key: 'swVersion',
						name: I18n.get('_OsvCurrentOSVersion_'),
						sortable: false,
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvOptimalVersion_'),
						sortable: false,
					},
					{
						key: 'deployment',
						name: I18n.get('_OsvDeploymentStatus_'),
						sortable: false,
					},
				],
				dynamicData: true,
				hover: true,
				padding: 'compressed',
				selectable: false,
				singleSelect: false,
				sortable: true,
				striped: true,
				wrapText: true,
			});
		}
	}

	/**
	 * Page change handler for SoftwareGroup Assets
	 * @param event the event emitted
	 */
	public onAssetsPageChanged (event: any) {
		this.softwareGroupAssetsParams.pageIndex = (event.page + 1);
		this.getSoftwareGroupAssets();
	}

	/**
	 * Page change handler for SoftwareGroup Versions
	 * @param event the event emitted
	 */
	public onVersionsPageChanged (event: any) {
		this.softwareGroupVersionsParams.pageIndex = (event.page + 1);
		this.getSoftwareGroupVersions();
	}
}
