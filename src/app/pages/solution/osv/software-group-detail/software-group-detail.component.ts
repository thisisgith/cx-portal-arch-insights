import {
	Component,
	OnInit,
	Input,
	SimpleChanges,
	OnDestroy,
	OnChanges,
	Output,
	EventEmitter,
	ViewChild,
	TemplateRef,
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
	AssetRecommendationsResponse,
	MachineRecommendationsResponse,
	MachineRecommendations,
} from '@sdp-api';
import { forkJoin, Subject, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CuiTableOptions, CuiModalService } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { DatePipe } from '@angular/common';
import { CancelConfirmComponent } from '../cancel-confirm/cancel-confirm.component';

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
	@Output() public selectedSoftwareGroupChange = new EventEmitter<SoftwareGroup>();
	@ViewChild('versionTemplate', { static: true }) private versionTemplate: TemplateRef<{}>;
	@Input() public tabIndex;

	public status = {
		isLoading: true,
	};
	public fullscreen = false;
	private destroy$ = new Subject();
	public customerId: string;
	public softwareGroupVersions: SoftwareGroupVersion[];
	public softwareGroupAssets: SoftwareGroupAsset[];
	public softwareGroupVersionsTable: CuiTableOptions;
	public softwareGroupAssetsTable: CuiTableOptions;
	public softwareGroupDetailsParams: OSVService.GetSoftwareGroupDetailsParam;
	public softwareGroupAssetsParams: OSVService.GetSoftwareGroupAssetsParams;
	public softwareGroupVersionsParams: OSVService.GetSoftwareGroupAssetsParams;
	public assetsPagination: OsvPagination;
	public assetsPaginationCount: string;
	public versionsPagination: OsvPagination;
	public versionsPaginationCount: string;
	public headingClass = this.fullscreen ? 'text-xlarge' : 'text-large';
	public subHeadingClass = this.fullscreen ? 'text-large' : 'text-medium';
	public chartWidth = this.fullscreen ? 250 : 140;
	public assetAlert: any = {};
	public versionAlert: any = {};
	public recommendationAlert = {};
	public recommendations: AssetRecommendationsResponse;
	public machineRecommendationsResponse: MachineRecommendationsResponse;
	public machineRecommendations: MachineRecommendations[];
	public selectedMachineRecommendation;
	public screenWidth = window.innerWidth;
	public barChartBackgroundColor= "#f2fbfd";
	constructor (
		private logger: LogService,
		private osvService: OSVService,
		private route: ActivatedRoute,
		private cuiModalService: CuiModalService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.softwareGroupDetailsParams = {
			customerId: this.customerId,
			profileName: '7293498_NA',
		};
		this.softwareGroupAssetsParams = {
			customerId: this.customerId,
			profileName: '7293498_NA',
			pageIndex: 1,
			pageSize: 10,
			sort: 'hostName',
			sortOrder: 'asc',
		};
		this.softwareGroupVersionsParams = {
			customerId: this.customerId,
			profileName: '7293498_NA',
			pageIndex: 1,
			pageSize: 10,
			sort: 'swType',
			sortOrder: 'asc',
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
		if (this.selectedSoftwareGroup && !this.selectedSoftwareGroup.statusUpdated) {
			this.clear();
			// const profileName = _.get(this.selectedSoftwareGroup, 'profileName');
			// this.softwareGroupDetailsParams.profileName = profileName;
			// this.softwareGroupAssetsParams.profileName = profileName;
			// this.softwareGroupVersionsParams.profileName = profileName;
			this.loadData();
		}
	}

	/**
	 * load data
	 */
	public loadData () {
		this.status.isLoading = true;
		forkJoin(
			this.fetchMachineRecommendations(),
			this.fetchSoftwareGroupDetails(),
			this.getSoftwareGroupAssets(),
			this.getSoftwareGroupVersions(),
		)
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe((responses) => {
				if (this.machineRecommendationsResponse && this.recommendations) {
					this.populateMachineRecommendationsInfo();
				}
				this.status.isLoading = false;
				this.logger.debug('assets software.component: loadData()::Done Loading');
			});
	}

	/**
	 * merge recommendations and machine recommendation info required for compare view
	 */
	public populateMachineRecommendationsInfo () {
		_.map(this.machineRecommendationsResponse, (machineRecommendation) => {
			const recommendation = _.filter(this.recommendations,
				{ swVersion: machineRecommendation.release });
			machineRecommendation.name = _.get(recommendation, ['0', 'name']);
			machineRecommendation.postDate = _.get(recommendation, ['0', 'postDate']);
			if (machineRecommendation.bugSeverity) {
				machineRecommendation.bugsExposed = Object.values(machineRecommendation.bugSeverity)
					.reduce((a: number, b: number) => a + b);
			}
			if (machineRecommendation.psirtSeverity) {
				machineRecommendation.psirtExposed = Object.values(machineRecommendation.psirtSeverity)
					.reduce((a: number, b: number) => a + b);
			}
			machineRecommendation.bugSeriesData = _.compact(
				_.map(machineRecommendation.bugSeverity, (value: number, key: string) => {
					return {
						value,
						filter: key,
						label: key === 'critical' ?
							I18n.get('_OsvCritical_')
							: key === 'high' ? I18n.get('_OsvHigh_') : I18n.get('_OsvLow_'),
						selected: false,
					};
				}));
			machineRecommendation.psritSeriesData = _.compact(
				_.map(machineRecommendation.psirtSeverity, (value: number, key: string) => {
					return {
						value,
						filter: key,
						label: key === 'critical' ?
							I18n.get('_OsvCritical_')
							: key === 'high' ? I18n.get('_OsvHigh_') : I18n.get('_OsvLow_'),
						selected: false,
					};
				}));
		});
		this.sortData(this.machineRecommendationsResponse);
		this.machineRecommendations = this.machineRecommendationsResponse;
	}

	/**
	 * Fetch Software Group details for the selected SoftwareGroup
	 * @returns software group details list observable
	 */
	public fetchSoftwareGroupDetails () {
		this.status.isLoading = true;
		return this.osvService.getSoftwareGroupRecommendations(this.softwareGroupDetailsParams)
			.pipe(
				map((response: AssetRecommendationsResponse) => {
					this.recommendations = response;
				}),
				takeUntil(this.destroy$),
				catchError(err => {
					_.invoke(this.recommendationAlert, 'show',
						I18n.get('_OsvGenericError_'), 'danger');
					this.logger.error('OSV Asset Recommendations : getAssetDetails() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({});
				}),
			);
	}

	/**
	 * Fetch Machine Recommendations for the selected SoftwareGroup
	 * @returns Machine Recommendations list observable
	 */
	public fetchMachineRecommendations () {
		this.status.isLoading = true;
		return this.osvService.getMachineRecommendations(this.softwareGroupDetailsParams)
			.pipe(
				map((response: MachineRecommendationsResponse) => {
					this.machineRecommendationsResponse = response;
				}),
				takeUntil(this.destroy$),
				catchError(err => {
					_.invoke(this.recommendationAlert, 'show',
						I18n.get('_OsvGenericError_'), 'danger');
					this.logger.error('OSV Asset Recommendations : getAssetDetails() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({});
				}),
			);
	}

	/**
	 * get software group assets list
	 * @returns software group assets list observable
	 */
	public getSoftwareGroupAssets () {
		return this.osvService.getSoftwareGroupAssets(this.softwareGroupAssetsParams)
			.pipe(
				map((response: SoftwareGroupAssetsResponse) => {
					this.softwareGroupAssets = response.uiAssetList;
					this.assetsPagination = response.pagination;
					this.assetsPagination.rows = this.softwareGroupAssetsParams.pageSize;
					const first = (this.assetsPagination.rows *
						(this.assetsPagination.page - 1)) + 1;
					let last = (this.assetsPagination.rows * this.assetsPagination.page);
					if (last > this.assetsPagination.total) {
						last = this.assetsPagination.total;
					}
					this.assetsPaginationCount = `${first}-${last}`;
					this.buildSoftwareGroupAssetsTable();
				}),
				catchError(err => {
					_.invoke(this.assetAlert, 'show',
						I18n.get('_OsvGenericError_'), 'danger');
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
		return this.osvService.getSoftwareGroupVersions(this.softwareGroupVersionsParams)
			.pipe(
				map((response: SoftwareGroupVersionsResponse) => {
					this.softwareGroupVersions = response.uiSwVersionList;
					this.versionsPagination = response.pagination;
					this.versionsPagination.rows = this.softwareGroupVersionsParams.pageSize;
					const first = (this.versionsPagination.rows *
						(this.versionsPagination.page - 1)) + 1;
					let last = (this.versionsPagination.rows * this.versionsPagination.page);
					if (last > this.versionsPagination.total) {
						last = this.versionsPagination.total;
					}
					this.versionsPaginationCount = `${first}-${last}`;
					this.buildSoftwareGroupVersionsTable();
				}),
				catchError(err => {
					_.invoke(this.versionAlert, 'show',
						I18n.get('_OsvGenericError_'), 'danger');
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
		this.recommendations = null;
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
		const currentSelectedGroup = _.get(changes, ['selectedSoftwareGroup', 'currentValue']);
		const isFirstChange = _.get(changes, ['selectedSoftwareGroup', 'firstChange']);
		const currentTabIndex = _.get(changes, ['tabIndex', 'currentValue']);

		if (currentTabIndex) {
			this.tabIndex = currentTabIndex;
		} else {
			this.tabIndex = _.isUndefined(this.tabIndex) ? 0 : this.tabIndex;
		}
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
						width: '10%',
					},
					{
						name: I18n.get('_OsvReleaseDate_'),
						render: item => !_.isNull(item.postDate) ?
							datePipe.transform(
								new Date(item.postDate), 'yyyy MMM dd') :
							'',
						sortable: true,
					},
					{
						key: 'swType',
						name: I18n.get('_OsvOSType_'),
						sortable: true,
						sortDirection: 'asc',
						sorting: true,
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
						name: I18n.get('_OsvCurrentOSVersion_'),
						template: this.versionTemplate,
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

	/**
	 * called after the recommendation is accepted
	 * @param event contains updated data about the accepted recommendation
	 */
	public onRecommendationAccept (event: any) {
		if (event.err) {
			setTimeout(() => {
				_.invoke(this.recommendationAlert, 'show',
					I18n.get('_OsvGenericError_'), 'danger');
			});

			return;
		}
		this.selectedSoftwareGroup = event.selectedSoftwareGroup;
		this.selectedSoftwareGroupChange.emit(this.selectedSoftwareGroup);
		_.map(this.machineRecommendations, (machineRecommendation) => {
			const recommendation = _.filter(event.recommendations,
				{ swVersion: machineRecommendation.release });
			machineRecommendation.accpeted = _.get(recommendation, ['0', 'accepted']);
		});
		this.getSoftwareGroupAssets();
	}

	/**
	 * on machine recommendation accept click
	 */
	public onAcceptClick () {
		this.selectedMachineRecommendation = {};
	}

	/**
	 * on machine recommendation cancel click
	 */
	public onCancel () {
		this.cuiModalService.showComponent(CancelConfirmComponent, {});
	}

	/**
	 * Sort Machine Recommendations by name
	 * @param data MachineRecommendations
	 * @returns sorted data
	 */
	public sortData (data: MachineRecommendationsResponse) {
		data.sort((a: MachineRecommendations, b: MachineRecommendations) =>
			<any>new Date(a.name) - <any>new Date(b.name));

		return data;
	}
}
