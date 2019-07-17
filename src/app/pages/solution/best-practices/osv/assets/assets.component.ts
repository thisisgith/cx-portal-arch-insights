import { Component, TemplateRef, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash-es';

/**
 * AssetSoftware Component
 */
@Component({
	selector: 'app-assets',
	styleUrls: ['./assets.component.scss'],
	templateUrl: './assets.component.html',
})
export class AssetsComponent {
	@Input() public selectedAssetSoftware;
	@Output() public selectedAssetSoftwareChange = new EventEmitter<any>();
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{ }>;
	public assetsSoftwareTable: CuiTableOptions;
	public status = {
		isLoading: true,
	};
	public assetSoftwares: any;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('AssetSoftwareComponent Created!');
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
			this.getAssetSoftwares(),
		)
			.subscribe(() => {
				this.status.isLoading = false;
			});
	}

	/**
	 * Fetches the total counts for the visual filter
	 * @returns the total counts observable
	 */
	private getAssetSoftwares () {
		return of({ })
			.pipe(
				map(() => {
					this.assetSoftwares = [
						{
							currentOSVersion: '3',
							deploymentStatus: 'None',
							hostName: 'Asset 1',
							ipaddress: '10.1.171.1',
							optimalVersion: '8.6.100.2',
							osType: 'IOS-XE',
							productFamily: 'XYZ',
						}, {
							currentOSVersion: '3',
							deploymentStatus: 'None',
							hostName: 'Asset 2',
							ipaddress: '10.1.171.1',
							optimalVersion: '8.6.100.2',
							osType: 'IOS-XE',
							productFamily: 'XYZ',
						}, {
							currentOSVersion: '3',
							deploymentStatus: 'None',
							hostName: 'Asset 3',
							ipaddress: '10.1.171.1',
							optimalVersion: '8.6.100.2',
							osType: 'IOS-XE',
							productFamily: 'XYZ',
						}, {
							currentOSVersion: '3',
							deploymentStatus: 'None',
							hostName: 'Asset 4',
							ipaddress: '10.1.171.1',
							optimalVersion: '8.6.100.2',
							osType: 'IOS-XE',
							productFamily: 'XYZ',
						}, {
							currentOSVersion: '3',
							deploymentStatus: 'None',
							hostName: 'Asset 5',
							ipaddress: '10.1.171.1',
							optimalVersion: '8.6.100.2',
							osType: 'IOS-XE',
							productFamily: 'XYZ',
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
		if (!this.assetsSoftwareTable) {
			this.assetsSoftwareTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'hostName',
						name: I18n.get('_OsvHostName'),
						width: '10%',
					},
					{
						key: 'ipaddress',
						name: I18n.get('_OsvIpAddress_'),
					},
					{
						key: 'productFamily',
						name: I18n.get('_OsvProductFamily_'),
					},
					{
						key: 'osType',
						name: I18n.get('_OsvOSType_'),
					},
					{
						key: 'currentOSVersion',
						name: I18n.get('_OsvCurrentOSVersion_'),
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvOptimalVersion_'),
					},
					{
						key: 'deploymentStatus',
						name: I18n.get('_OsvDeploymentStatus_'),
					},
					{
						key: 'recommendations',
						name: I18n.get('_OsvRecommendations_'),
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
	 * Returns the row specific actions
	 * @returns the built actions
	 */
	public getRowActions () {
		return _.filter([
			{
				label: I18n.get('_OsvCompareRecommendations'),
			},
			{
				label: I18n.get('_OsvRefreshRecommendations_'),
			},
		]);
	}

	/**
	 * Function used to handle single row selection
	 * @param item the item we selected
	 */
	public onRowSelect (item: any) {
		this.selectedAssetSoftware = item;
		this.selectedAssetSoftwareChange.emit(this.selectedAssetSoftware);
	}
}
