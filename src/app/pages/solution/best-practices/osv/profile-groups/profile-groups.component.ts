import { Component, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash-es';

@Component({
	selector: 'app-profile-groups',
	styleUrls: ['./profile-groups.component.scss'],
	templateUrl: './profile-groups.component.html',
})
export class ProfileGroupsComponent {
	@Input() public selectedProfileGroup;
	@Output() selectedProfileGroupChange = new EventEmitter<any>();
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{}>;
	public profileGroupsTable: CuiTableOptions;
	public status = {
		isLoading: true,
	};
	public profileGroups: any;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('ProfileGroupsComponent Created!');
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
			this.getProfileGroups(),
		)
			.subscribe(() => {
				this.status.isLoading = false;
			});
	}


	/**
	 * Fetches the total counts for the visual filter
	 * @returns the total counts observable
	 */
	private getProfileGroups () {
		return of({}).pipe(
			map(() => {
				this.profileGroups = [
					{
						softwareProfile: 'Profile 1',
						productFamily: 'XYZ',
						assetCount: 2,
						osType: 'IOS-XE',
						currentOSVersion: '3',
						optimalVersion: '8.6.100.2',
						lastRecommendedDate: '2018-07-14',
						deploymentStatus: 'None',
						risk: '',
						popularity: '',
					}, {
						softwareProfile: 'Profile 1',
						productFamily: 'XYZ',
						assetCount: 2,
						osType: 'IOS-XE',
						currentOSVersion: '3',
						optimalVersion: '8.6.100.2',
						lastRecommendedDate: '2018-07-14',
						deploymentStatus: 'None',
						risk: '',
						popularity: '',
					},
					{
						softwareProfile: 'Profile 1',
						productFamily: 'XYZ',
						assetCount: 2,
						osType: 'IOS-XE',
						currentOSVersion: '3',
						optimalVersion: '8.6.100.2',
						lastRecommendedDate: '2018-07-14',
						deploymentStatus: 'None',
						risk: '',
						popularity: '',
					},
					{
						softwareProfile: 'Profile 1',
						productFamily: 'XYZ',
						assetCount: 2,
						osType: 'IOS-XE',
						currentOSVersion: '3',
						optimalVersion: '8.6.100.2',
						lastRecommendedDate: '2018-07-14',
						deploymentStatus: 'None',
						risk: '',
						popularity: '',
					},
					{
						softwareProfile: 'Profile 1',
						productFamily: 'XYZ',
						assetCount: 2,
						osType: 'IOS-XE',
						currentOSVersion: '3',
						optimalVersion: '8.6.100.2',
						lastRecommendedDate: '2018-07-14',
						deploymentStatus: 'None',
						risk: '',
						popularity: '',
					},
					{
						softwareProfile: 'Profile 1',
						productFamily: 'XYZ',
						assetCount: 2,
						osType: 'IOS-XE',
						currentOSVersion: '3',
						optimalVersion: '8.6.100.2',
						lastRecommendedDate: '2018-07-14',
						deploymentStatus: 'None',
						risk: '',
						popularity: '',
					},
				];
				this.buildTable();
			})
		)
	}

	/**
	 * Will construct the assets table
	 */
	private buildTable () {
		if (!this.profileGroupsTable) {
			this.profileGroupsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'softwareProfile',
						name: I18n.get('_OsvSoftwareProfile_'),
					},
					{
						key: 'productFamily',
						name: I18n.get('_OsvProductFamily_'),
					},
					{
						key: 'assetCount',
						name: I18n.get('_OsvAssetCount_'),
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
						key: 'lastRecommendedDate',
						name: I18n.get('_OsvLastRecommendedDate'),
					},
					{
						key: 'deploymentStatus',
						name: I18n.get('_OsvDeploymentStatus_'),
					},
					{
						key: 'risk',
						name: I18n.get('_OsvRisk_'),
					},
					{
						key: 'popularity',
						name: I18n.get('_OsvPopularity_'),
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
	 * @param asset the asset we're building the actions for
	 * @returns the built actions
	 */
	public getRowActions (profileGroup: any) {
		return [
			{
				label: I18n.get('_OsvCompareRecommendations'),
				profileGroup: profileGroup,
			},
			{
				label: I18n.get('_OsvRefreshRecommendations_'),
				profileGroup: profileGroup,
			},
		];

	}
	/**
	 * Return the action data whenever action is clicked
	 * @param event 
	 */
	public onActionSelected (event: any) {
		this.logger.debug(event);
	}

	/**
	 * Function used to handle single row selection
	 * @param item the item we selected
	 */
	public onRowSelect (item: any) {
		this.selectedProfileGroup = item;
		this.selectedProfileGroupChange.emit(this.selectedProfileGroup);
	}

}
