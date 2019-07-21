import { Component, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { SoftwareProfilesResponse, OSVService } from '@sdp-api';

/** Our current customerId */
const customerId = '2431199';

/**
 * ProfileGroups Component
 */
@Component({
	selector: 'app-software-profiles',
	styleUrls: ['./software-profile.component.scss'],
	templateUrl: './software-profile.component.html',
})
export class SoftwareProfilesComponent {
	@Input() public selectedProfileGroup;
	@Output() public selectedProfileGroupChange = new EventEmitter<any>();
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{ }>;
	public profileGroupsTable: CuiTableOptions;
	public status = {
		isLoading: true,
	};
	public profileGroups: any;

	constructor (
		private logger: LogService,
		private osvService: OSVService,
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
		return this.osvService.getSoftwareProfiles({ customerId })
			.pipe(
				map((response: SoftwareProfilesResponse) => {
					this.status.isLoading = false;
					this.profileGroups = response;
					this.buildTable();
				}),
			);
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
						// name: I18n.get('_OsvSoftwareProfile_'),
						name: 'Software',
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
	 * @param profileGroup the progileGroup we're building the actions for
	 * @returns the built actions
	 */
	public getRowActions (profileGroup: any) {
		return [
			{
				profileGroup,
				label: I18n.get('_OsvCompareRecommendations'),
			},
			{
				profileGroup,
				label: I18n.get('_OsvRefreshRecommendations_'),
			},
		];

	}
	/**
	 * Return the action data whenever action is clicked
	 * @param event contains the profileGroup that is selected
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
