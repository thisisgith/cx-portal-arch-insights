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
	ExpertRecommendations,
} from '@sdp-api';
import { forkJoin, Subject, of } from 'rxjs';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CuiTableOptions, CuiModalService } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { DatePipe } from '@angular/common';
import { DetailsPanelStackService } from '@services';
import { ContactSupportComponent } from '@components';

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
	@ViewChild('hostTemplate', { static: true })
		private hostTemplate: TemplateRef<{ }>;
	@ViewChild('expertActionTemplate', { static: true })
		private expertActionTemplate: TemplateRef<{ }>;
	@Input() public tabIndex;
	@Output('close') public close = new EventEmitter<boolean>();
	@Input() public solution;
	@Input() public useCase;
	@Output() public refreshSummary = new EventEmitter();

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
	public expertRecommendationsTable: CuiTableOptions;

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
	public expertRecommendations: ExpertRecommendations[];
	public actionData: any;
	public showDetails = false;
	public detailsParams: any;
	public bugTabIndex = 0;

	constructor (
		private logger: LogService,
		private osvService: OSVService,
		private route: ActivatedRoute,
		private cuiModalService: CuiModalService,
		private detailsPanelStackService: DetailsPanelStackService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.softwareGroupDetailsParams = {
			customerId: this.customerId,
			profileId: '',
			productFamily: '',
			profileName: '',
			productId: '',
		};
		this.softwareGroupAssetsParams = {
			customerId: this.customerId,
			profileName: '',
			id: '',
			pageIndex: 1,
			pageSize: 10,
			sort: 'hostName',
			sortOrder: 'asc',
			solution: '',
			useCase: '',
		};
		this.softwareGroupVersionsParams = {
			customerId: this.customerId,
			profileName: '',
			id: '',
			pageIndex: 1,
			pageSize: 10,
			sort: 'swType',
			sortOrder: 'asc',
			solution: '',
			useCase: '',
		};
	}

	/**
	 * Initialization hook
	 */
	public ngOnInit (): void {
		this.showDetails = false;
		this.refresh();
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		if (this.selectedSoftwareGroup && !this.selectedSoftwareGroup.statusUpdated) {
			this.clear();
			const profileName = _.get(this.selectedSoftwareGroup, 'profileName');
			const profileId = _.get(this.selectedSoftwareGroup, 'id');
			const productFamily = _.get(this.selectedSoftwareGroup, 'productFamily');
			const productId = _.get(this.selectedSoftwareGroup, 'productId');
			this.softwareGroupDetailsParams.profileId = profileId;
			this.softwareGroupDetailsParams.profileName = profileName;
			this.softwareGroupDetailsParams.productFamily = productFamily;
			this.softwareGroupDetailsParams.productId = productId;

			this.softwareGroupAssetsParams.id = profileId;
			this.softwareGroupAssetsParams.profileName = profileName;
			this.softwareGroupAssetsParams.solution = this.solution;
			this.softwareGroupAssetsParams.useCase = this.useCase;

			this.softwareGroupVersionsParams.id = profileId;
			this.softwareGroupVersionsParams.profileName = profileName;
			this.softwareGroupVersionsParams.solution = this.solution;
			this.softwareGroupVersionsParams.useCase = this.useCase;
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
	 * Handles the hidden event from details-panel
	 * @param hidden false if details slideout is open
	 */
	public handleHidden (hidden: boolean) {
		if (hidden) {
			this.onPanelClose();
		}
	}

	/**
	 * Closes the panel and emits an event
	 */
	public onPanelClose () {
		_.set(this.selectedSoftwareGroup, 'active', false);
		this.selectedSoftwareGroup = null;
		this.close.emit(true);
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
					this.expertRecommendations = response.expertRecommendations;
					this.buildExpertRecommendationsTable();
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
		this.showDetails = false;
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Checks if our currently selected software group has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		this.showDetails = false;
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

		const solution = _.get(changes, ['solution', 'currentValue']);
		const useCase = _.get(changes, ['useCase', 'currentValue']);

		if (solution && !_.get(changes, ['solution', 'firstChange'])) {
			this.refresh();
		}
		if (useCase && !_.get(changes, ['useCase', 'firstChange'])) {
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
						key: 'swType',
						name: I18n.get('_OsvOSType_'),
						sortable: true,
						sortDirection: 'asc',
						sorting: true,
						width: '20%',
					},
					{
						key: 'swVersion',
						name: I18n.get('_OsvVersion_'),
						sortable: false,
						width: '20%',
					},
					{
						key: 'releaseDate',
						name: I18n.get('_OsvReleaseDate_'),
						render: item => !_.isNull(item.postDate) ?
							datePipe.transform(
								new Date(item.postDate), 'MMM d, y') :
							'',
						sortable: true,
						width: '20%',
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvAcceptedRelease_'),
						render: item =>
								item.optimalVersion ? item.optimalVersion : '',
						sortable: false,
						width: '20%',
					},
					{
						key: 'assetCount',
						name: I18n.get('_OsvAssetCount_'),
						sortable: false,
						width: '20%',
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
						sortable: true,
						sortDirection: 'asc',
						sorting: true,
						template: this.hostTemplate,
						width: '20%',
					},
					{
						key: 'ipAddress',
						name: I18n.get('_OsvIpAddress_'),
						sortable: false,
						width: '16%',
					},
					{
						key: 'swType',
						name: I18n.get('_OsvOSType_'),
						sortable: false,
						width: '16%',
					},
					{
						name: I18n.get('_OsvCurrentOSVersion_'),
						template: this.versionTemplate,
						sortable: false,
						width: '16%',
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvAcceptedRelease_'),
						render: item =>
								item.optimalVersion ? item.optimalVersion : '',
						sortable: false,
						width: '16%',
					},
					{
						key: 'deploymentStatus',
						name: I18n.get('_OsvDeploymentStatus_'),
						render: item =>
								item.deploymentStatus ? item.deploymentStatus : '',
						sortable: false,
						width: '16%',
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
			this.onCancel();
		}
	}

	/**
	 * accept recommendations
	 * @param acceptedVersion accept version for this selected profile
	 */
	public onAccept (acceptedVersion: string) {
		const body = {
			customerId: this.customerId,
			profileId: this.selectedSoftwareGroup.id,
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
			profileId: this.selectedSoftwareGroup.id,
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
		setTimeout(() => {
			this.getSoftwareGroupAssets()
			.subscribe();
			this.getSoftwareGroupVersions()
			.subscribe();
		}, 1000);
		this.selectedSoftwareGroupChange.emit(this.selectedSoftwareGroup);
		this.refreshSummary.emit();
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

	/**
	 * show Bug and Psirt Details
	 * @param details details emitted for showing bug details
	 */
	public showDetailsView (details: any) {
		this.detailsParams = details;
		this.showDetails = true;
		this.bugTabIndex = details.tabIndex;
	}

	/**
	 * hide Bug and Psirt Details
	 */
	public hideDetailsView () {
		this.showDetails = false;
	}

	/**
	 * build software group assets table
	 */
	public buildExpertRecommendationsTable () {
		if (!this.expertRecommendationsTable) {
			const datePipe = new DatePipe('en-US');
			this.expertRecommendationsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'recommSubmittedDate',
						name: I18n.get('_OsvRequestDate_'),
						render: item =>
							datePipe.transform(item.recommSubmittedDate, 'MMM d, y'),
						sortable: false,
						width: '15%',
					},
					{
						key: 'status',
						name: I18n.get('_Status_'),
						sortable: false,
						render: item =>
								item.status ? _.capitalize(item.status) : '',
						width: '15%',
					},
					{
						key: 'release',
						name: I18n.get('_OsvRelease_'),
						sortable: false,
						width: '15%',
					},
					{
						name: I18n.get('_OsvReleaseDate_'),
						render: item =>
							datePipe.transform(item.releaseDate, 'MMM d, y'),
						sortable: false,
						width: '15%',
					},
					{
						name: '',
						template: this.expertActionTemplate,
						sortable: false,
						width: '40%',
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
	 * Open contact support modal
	 */
	public async openContactSupport () {
		const options = {
			contactExpert: true,
			productFamily: this.selectedSoftwareGroup.productFamily,
			osType: this.selectedSoftwareGroup.swType,
			requestTypes: I18n.get('_OsvContactExpertRequestTypes_'),
		};
		const result = await this.cuiModalService.showComponent(ContactSupportComponent, options);
		if (result) {
			this.refresh();
		}
	}

}
