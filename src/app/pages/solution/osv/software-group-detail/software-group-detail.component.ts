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
	ProfileRecommendationsResponse,
} from '@sdp-api';
import { forkJoin, Subject, of, Subscription } from 'rxjs';
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
	@ViewChild('versionTemplate', { static: true })
	private versionTemplate: TemplateRef<{ }>;
	@Input() public tabIndex;

	public status = {
		profileRecommendations: true,
		assetsLoading: true,
		versionsLoading: true,
		machineRecommendationsLoading: true,
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

	public assetAlert: any = { };
	public versionAlert: any = { };
	public recommendationAlert = { };

	public recommendations: AssetRecommendationsResponse;
	public machineRecommendationsResponse: MachineRecommendationsResponse;
	public profileRecommendationResponse: AssetRecommendationsResponse;
	public machineRecommendations: MachineRecommendations[];

	public screenWidth = window.innerWidth;

	public recommendationAcceptedDate: string;
	public cancelSubscription: Subscription;
	public actionData: any;

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
			profileName: '',
		};
		this.softwareGroupAssetsParams = {
			customerId: this.customerId,
			profileName: '',
			id: '',
			pageIndex: 1,
			pageSize: 10,
			sort: 'hostName',
			sortOrder: 'asc',
		};
		this.softwareGroupVersionsParams = {
			customerId: this.customerId,
			profileName: '',
			id: '',
			pageIndex: 1,
			pageSize: 10,
			sort: 'swType',
			sortOrder: 'asc',
		};
	}

	/**
	 * Initialization hook
	 */
	public ngOnInit (): void {
		this.refresh();
		this.cancelSubscription = this.cuiModalService.onCancel
			.subscribe(() => {
				this.onCancel();
			});
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		if (this.selectedSoftwareGroup && !this.selectedSoftwareGroup.statusUpdated) {
			this.clear();
			const profileName = _.get(this.selectedSoftwareGroup, 'profileName');
			const profileId = _.get(this.selectedSoftwareGroup, 'id');
			this.softwareGroupDetailsParams.profileName = profileName;
			this.softwareGroupAssetsParams.id = profileId;
			this.softwareGroupAssetsParams.profileName = profileName;
			this.softwareGroupVersionsParams.id = profileId;
			this.softwareGroupVersionsParams.profileName = profileName;
			this.loadData();
		}
	}

	/**
	 * load data
	 */
	public loadData () {
		forkJoin(
			this.fetchSoftwareGroupDetails(),
			this.getSoftwareGroupAssets(),
			this.getSoftwareGroupVersions(),
		)
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(() => {
				this.logger.debug('software group detail: loadData()::Done Loading');
			});
	}

	/**
	 * Fetch Software Group details for the selected SoftwareGroup
	 * @returns software group details list observable
	 */
	public fetchSoftwareGroupDetails () {
		this.status.profileRecommendations = true;
		return this.osvService.getSoftwareGroupRecommendations(this.softwareGroupDetailsParams)
			.pipe(
				map((response: ProfileRecommendationsResponse) => {
					this.status.machineRecommendationsLoading = false;
					this.status.profileRecommendations = false;
					response.recommendations = _.compact(response.recommendations);
					response.recommendationSummaries = _.compact(response.recommendationSummaries);
					this.setProfileRiskScore(response);
					this.setAcceptedVersion({
						data: response.recommendations,
						acceptedDate: response.recommAcceptedDate,
						key: 'swVersion',
					});
					this.setAcceptedVersion({
						data: response.recommendationSummaries,
						acceptedDate: response.recommAcceptedDate,
						key: 'release',
					});
					this.recommendations = this.addCurrentRecommendation(response);
					this.machineRecommendations = response.recommendationSummaries;
					this.recommendationAcceptedDate = response.recommAcceptedDate;
				}),
				takeUntil(this.destroy$),
				catchError(err => {
					this.status.machineRecommendationsLoading = false;
					this.status.profileRecommendations = false;
					_.invoke(this.recommendationAlert, 'show',
						I18n.get('_OsvGenericError_'), 'danger');
					this.logger.error('OSV Asset Recommendations : getAssetDetails() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of();
				}),
			);
	}

	/**
	 * get software group assets list
	 * @returns software group assets list observable
	 */
	public getSoftwareGroupAssets () {
		this.status.assetsLoading = true;
		return this.osvService.getSoftwareGroupAssets(this.softwareGroupAssetsParams)
			.pipe(
				map((response: SoftwareGroupAssetsResponse) => {
					this.status.assetsLoading = false;
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
					this.status.assetsLoading = false;
					_.invoke(this.assetAlert, 'show',
						I18n.get('_OsvGenericError_'), 'danger');
					this.logger.error('OSV SG : getSoftwareGroupAsset() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of();
				}),
			);
	}

	/**
	 * get software group versions list
	 * @returns software group versions list observable
	 */
	public getSoftwareGroupVersions () {
		this.status.versionsLoading = true;
		return this.osvService.getSoftwareGroupVersions(this.softwareGroupVersionsParams)
			.pipe(
				map((response: SoftwareGroupVersionsResponse) => {
					this.status.versionsLoading = false;
					this.softwareGroupVersions = response.uiProfileSwVersion;
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
					this.status.versionsLoading = false;
					_.invoke(this.versionAlert, 'show',
						I18n.get('_OsvGenericError_'), 'danger');
					this.logger.error('OSV SG : getSoftwareGroupVersions() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of();
				}),
			);
	}

	/**
	 * Resets data fields
	 */
	public clear () {
		this.machineRecommendations = null;
		this.recommendations = null;
		this.softwareGroupAssets = null;
		this.softwareGroupVersions = null;
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		if (this.cancelSubscription) {
			_.invoke(this.cancelSubscription, 'unsubscribe');
		}
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
						sortable: false,
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
						key: 'deploymentStatus',
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
	 * triggerd whenever user accepts or cancels recommendation
	 * @param data emitted from the action or cancel actions
	 */
	public onAction (data: any) {
		this.actionData = data;
		if (data.type === 'accept') {
			this.onAccept(data.version);
		} else if (data.type === 'cancel') {
			this.cuiModalService.showComponent(CancelConfirmComponent, { });
		}
	}

	/**
	 * accept recommendations
	 * @param acceptedVersion accept version for this selected profile
	 */
	public onAccept (acceptedVersion: string) {
		const body = {
			customerId: this.customerId,
			profileName: this.selectedSoftwareGroup.profileName,
			optimalVersion: acceptedVersion,
		};
		this.status.profileRecommendations = true;
		this.osvService.updateProfile(body)
			.subscribe((response: SoftwareGroup) => {
				this.status.profileRecommendations = false;
				this.refreshAfterAction(response);
				this.logger.debug('Updated');
			}, () => {
				this.status.profileRecommendations = false;
				_.invoke(this.recommendationAlert, 'show',
						I18n.get('_OsvGenericError_'), 'danger');
				this.logger.debug('Error in updating');
			});
	}

	/**
	 * cancel the accepted Recommendation
	 */
	public onCancel () {
		const body = {
			customerId: this.customerId,
			profileName: this.selectedSoftwareGroup.profileName,
			optimalVersion: this.actionData.version,
		};
		this.status.profileRecommendations = true;
		this.osvService.cancelUpdateProfileResponse(body)
			.subscribe((response: any) => {
				this.status.profileRecommendations = false;
				this.refreshAfterAction(response);
				this.logger.debug('Updated');
			}, () => {
				this.status.profileRecommendations = false;
				_.invoke(this.recommendationAlert, 'show',
						I18n.get('_OsvGenericError_'), 'danger');
				this.logger.debug('Error in updating');
			});

	}

	/**
	 * set refresh other tabs after accept or cancel action
	 * @param response response from the accept or cancel action
	 */
	public refreshAfterAction (response: any) {
		this.selectedSoftwareGroup.statusUpdated = true;
		this.selectedSoftwareGroup.optimalVersion = response.optimalVersion;
		this.setAcceptedVersion({
			data: this.recommendations,
			acceptedDate: response.recommAcceptedDate,
			key: 'swVersion',
		});
		this.setAcceptedVersion({
			data: this.machineRecommendations,
			acceptedDate: response.recommAcceptedDate,
			key: 'release',
		});
		this.getSoftwareGroupAssets()
			.subscribe();
		this.getSoftwareGroupVersions()
			.subscribe();
		this.selectedSoftwareGroupChange.emit(this.selectedSoftwareGroup);
	}

	/**
	 * set Accepted version and accpeted date
	 * @param params containing recommendations,accepted date
	 */
	public setAcceptedVersion (params) {
		const optimalVersion = this.selectedSoftwareGroup.optimalVersion;
		_.map(params.data, (recommendation: any) => {
			if (recommendation) {
				recommendation.accepted = recommendation[params.key] === optimalVersion
					? true : false;
				recommendation.acceptedDate = params.acceptedDate;
			}
		});
	}

	/**
	 * add current recommendations to basic recommendations
	 * @param response profile recommendations response
	 * @returns merged array of software recommendations
	 */
	public addCurrentRecommendation (response) {
		if (response.recommendations && response.recommendations.length > 0) {
			response.recommendations.push({
				error: null,
				name: 'profile current',
				postDate: null,
				swVersion: 'NA',
			});

			return response.recommendations;
		}
	}

	/**
	 * adding risk score to machine recommendations
	 * @param response of the profile recommendations call
	 */
	public setProfileRiskScore (response) {
		_.map(response.recommendationSummaries, recommendation => {
			recommendation.profileRisk = response.profileRisk;
		});
	}

}
