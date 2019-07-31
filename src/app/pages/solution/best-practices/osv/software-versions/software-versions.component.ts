import { Component, ViewChild, TemplateRef } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { forkJoin, Subject, of } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { OSVService, SoftwareVersionsResponse, Pagination, SoftwareVersion } from '@sdp-api';

/** Our current customerId */
const customerId = '231215372';

/**
 * SoftwareVersion Component
 */
@Component({
	selector: 'app-software-versions',
	styleUrls: ['./software-versions.component.scss'],
	templateUrl: './software-versions.component.html',
})
export class SoftwareVersionsComponent {
	@ViewChild('releaseDate', { static: true }) private releaseDateTemplate: TemplateRef<{ }>;
	public softwareVersionsTable: CuiTableOptions;
	public status = {
		isLoading: true,
	};
	public softwareVersions: SoftwareVersion[];
	public pagination: Pagination;
	public paginationCount: string;
	public destroy$ = new Subject();
	public softwareVersionsParams: OSVService.GetSoftwarVersionsParams = {
		customerId,
		pageIndex: 1,
		pageSize: 10,
	};

	constructor (
		private logger: LogService,
		private osvService: OSVService,
	) {
		this.logger.debug('SoftwareVersionsComponent Created!');
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
	private buildTable () {
		if (!this.softwareVersionsTable) {
			this.softwareVersionsTable = new CuiTableOptions({
				bordered: false,
				columns: [
					{
						key: 'swVersion',
						name: I18n.get('_OsvVersion_'),
						width: '10%',
					},
					{
						name: I18n.get('_OsvReleaseDate_'),
						template: this.releaseDateTemplate,
					},
					{
						key: 'assetCount',
						name: I18n.get('_OsvIndependentAssets_'),
					},
					{
						key: 'profileAssetCount',
						name: I18n.get('_OsvAssetsOfSoftwareProfiles_'),
					},
					{
						key: 'goldenVersion',
						name: I18n.get('_OsvGoldenImage_'),
						render: item => item.optimalVersion ? I18n.get('_OsvYes_')
							: I18n.get('_OsvNo_'),
					},
					{
						key: 'swType',
						name: I18n.get('_OsvOSType_'),
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvOptimalVersionY/N_'),
						render: item => item.optimalVersion ? I18n.get('_OsvYes_')
							: I18n.get('_OsvNo_'),
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
		this.loadData();
	}
}
