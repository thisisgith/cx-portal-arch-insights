import { Component } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * SoftwareVersion Component
 */
@Component({
	selector: 'app-software-versions',
	styleUrls: ['./software-versions.component.scss'],
	templateUrl: './software-versions.component.html',
})
export class SoftwareVersionsComponent {
	public softwareVersionsTable: CuiTableOptions;
	public status = {
		isLoading: true,
	};
	public softwareVersions: any;

	constructor (
		private logger: LogService,
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
			.subscribe(() => {
				this.status.isLoading = false;
			});
	}

	/**
	 * Fetches the total counts for the visual filter
	 * @returns the total counts observable
	 */
	private getSoftwareVersions () {
		return of({ })
			.pipe(
				map(() => {
					this.softwareVersions = [
						{
							assetCount: 2,
							goldenImage: 'Y',
							optimalVersion: '8.6.100.2',
							osType: 'IOS-XE',
							releaseDate: '2015-10-10',
							version: '10.1.171.1',
						},
					];
					this.buildTable();
				}),
			);
	}

	/**
	 * Will construct the assets table
	 */
	private buildTable () {
		if (!this.softwareVersionsTable) {
			this.softwareVersionsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'version',
						name: I18n.get('_OsvVersion_'),
						width: '10%',
					},
					{
						key: 'releaseDate',
						name: I18n.get('_OsvReleaseDate_'),
					},
					{
						key: 'assetCount',
						name: I18n.get('_OsvUngroupedAssetsCount_'),
					},
					{
						key: 'goldenImage',
						name: I18n.get('_OsvGoldenImage_'),
					},
					{
						key: 'osType',
						name: I18n.get('_OsvOSType_'),
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvOptimalVersionY'),
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
}
