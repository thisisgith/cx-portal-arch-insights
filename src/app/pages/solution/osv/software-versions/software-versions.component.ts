import { Component, ViewChild, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { forkJoin, Subject, of } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { OSVService, SoftwareVersionsResponse, OsvPagination, SoftwareVersion } from '@sdp-api';
import * as _ from 'lodash-es';
import { ActivatedRoute } from '@angular/router';

/**
 * SoftwareVersion Component
 */
@Component({
	selector: 'app-software-versions',
	styleUrls: ['./software-versions.component.scss'],
	templateUrl: './software-versions.component.html',
})
export class SoftwareVersionsComponent implements OnInit, OnDestroy {
	@ViewChild('releaseDate', { static: true }) private releaseDateTemplate: TemplateRef<{ }>;
	public softwareVersionsTable: CuiTableOptions;
	public status = {
		isLoading: true,
	};
	public softwareVersions: SoftwareVersion[];
	public pagination: OsvPagination;
	public paginationCount: string;
	public destroy$ = new Subject();
	public softwareVersionsParams: OSVService.GetSoftwarVersionsParams;
	public customerId: string;

	constructor (
		private logger: LogService,
		private osvService: OSVService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.softwareVersionsParams = {
			customerId: this.customerId,
			pageIndex: 1,
			pageSize: 10,
			sort: 'swVersion',
			sortOrder: 'desc',
		};
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
	 * Function used to load all of the data
	 */
	private loadData () {
		this.status.isLoading = true;
		forkJoin(
			this.getSoftwareVersions(),
		)
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(() => {
				this.status.isLoading = false;
			});
	}

	/**
	 * Fetches the total counts for the visual filter
	 * @returns the total counts observable
	 */
	private getSoftwareVersions () {
		return this.osvService.getSoftwareVersions(this.softwareVersionsParams)
			.pipe(
				map((response: SoftwareVersionsResponse) => {
					this.status.isLoading = false;
					this.softwareVersions = response.uiSwVersionList;
					this.pagination = response.pagination;
					this.pagination.rows = this.softwareVersionsParams.pageSize;
					const first = (this.pagination.rows * (this.pagination.page - 1)) + 1;
					let last = (this.pagination.rows * this.pagination.page);
					if (last > this.pagination.total) {
						last = this.pagination.total;
					}
					this.paginationCount = `${first}-${last}`;
					this.buildTable();

				}),
				catchError(err => {
					this.logger.error('OSV SoftwareVersions : getVersions() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);
	}

	/**
	 * Will construct the assets table
	 */
	public buildTable () {
		if (!this.softwareVersionsTable) {
			this.softwareVersionsTable = new CuiTableOptions({
				bordered: false,
				columns: [
					{
						key: 'swVersion',
						name: I18n.get('_OsvVersion_'),
						sortable: false,
						sortDirection: 'desc',
						sorting: true,
						width: '10%',
					},
					{
						name: I18n.get('_OsvReleaseDate_'),
						sortable: false,
						template: this.releaseDateTemplate,
					},
					{
						key: 'assetCount',
						name: I18n.get('_OsvIndependentAssets_'),
						sortable: false,
					},
					{
						key: 'profileAssetCount',
						name: I18n.get('_OsvAssetsOfSoftwareProfiles_'),
						sortable: false,
					},
					{
						key: 'goldenVersion',
						name: I18n.get('_OsvGoldenImage_'),
						render: item => item.optimalVersion ? I18n.get('_OsvYes_')
							: I18n.get('_OsvNo_'),
						sortable: false,
					},
					{
						key: 'swType',
						name: I18n.get('_OsvOSType_'),
						sortable: false,
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvOptimalVersionY/N_'),
						render: item => item.optimalVersion ? I18n.get('_OsvYes_')
							: I18n.get('_OsvNo_'),
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
	 * Page change handler
	 * @param event the event emitted
	 */
	public onPageChanged (event: any) {
		this.softwareVersionsParams.pageIndex = (event.page + 1);
		this.loadData();
	}

	/**
	 * sort each column in case table view
	 * @param evt for table sort information
	 */
	public onTableSortingChanged (evt: any) {
		this.softwareVersionsParams.sortOrder = evt.sortDirection;
		this.softwareVersionsParams.sort = evt.key;
		this.softwareVersionsParams.pageIndex = 1;
		this.loadData();
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}