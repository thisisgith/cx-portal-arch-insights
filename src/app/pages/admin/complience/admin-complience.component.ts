import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import {
	ControlPointAdminComplienceService,
	RightTagResponse,
	LeftTagResponse,
	AssetTaggingService,
	CanDeactivateGuard,
	PolicyGroupDetails,
	DeactivationGuarded } from '@sdp-api';

import { User } from '@interfaces';
import { ActivatedRoute } from '@angular/router';

import { Subject, of, forkJoin, Observable } from 'rxjs';

import { catchError, takeUntil, map } from 'rxjs/operators';
import { RouteAuthService } from '@services';

import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
import { I18n } from '@cisco-ngx/cui-utils';
import { CuiModalService } from '@cisco-ngx/cui-components';
/**
 * Main Settings component
 */
@Component({
	selector: 'admin-complience',
	styleUrls: ['./admin-complience.component.scss'],
	templateUrl: './admin-complience.component.html',
})
export class AdminComplienceComponent implements OnInit , DeactivationGuarded, OnDestroy {
	@ViewChild('confirmationModalTemplate',
	{ static: true }) private confirmationModalTemplate: TemplateRef<string>;

	@ViewChild('switchBetweenPolicy',
	{ static: true }) private switchBetweenPolicy: TemplateRef<string>;

	@ViewChild('switchBetweenCompliance',
	{ static: true }) private switchBetweenCompliance: TemplateRef<string>;
	public returnValue: boolean | Observable<boolean>;
	private destroyed$: Subject<void> = new Subject<void>();
	private customerId: string;
	public accepted = false;
	public error = false;
	public errorMessage = '';
	public loading = false;
	public optlnStatus = false;
	public isOptlnStatusChanged = false;
	public filteredArray = [];
	public policies = [];
	public enableSaveButton: boolean;
	public leftSideTagsResponse: LeftTagResponse;
	public rightSideTagsResponse: RightTagResponse;
	public policyGroupDetails: PolicyGroupDetails;
	public selectedPolicy = 'select';
	public leftSideTags = [];
	public clonedLeftTags = [];
	public clonedRightTags = [];
	public rightSideTags = [];
	public tagsFromAssetTagging = false;
	public saveDetails: AssetTaggingService.PostParams = {
		body: {
			customerId: '',
			policy: 'select',
			tags: [],
			toBeScanned : false,
		},
	};
	public toBeScanned = false;
	public alert: any = { };

	private user: User;
	public selectedDeviceTagType = 'allDevices';
	public isPolicyChanged: boolean;
	public triggerModal = '';
	public hideAssetTags = true;
	public allInventorySelected: boolean;
	public defaultValue = 'Select';

	constructor (
		public cuiModalService: CuiModalService,
		public controlPointAdminComplienceService: ControlPointAdminComplienceService,
		public assetTaggingService: AssetTaggingService,
		private route: ActivatedRoute,
		private logger: LogService,
		private routeAuthService: RouteAuthService,
		private canDeactGuard: CanDeactivateGuard,
	) {
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
		this.saveDetails.body.customerId = this.customerId;
	}

	/**
	 * Function which instanstiates the settings page to the initial view
	 */
	public ngOnInit () {
		this.checkOptlnStatus();
		this.initializeDetails();
	}

	/**
	 * initialize all the tag and policy details
	 */
	public initializeDetails () {
		this.saveDetails.body.policy = 'select';
		this.saveDetails.body.tags = [];
		this.selectedDeviceTagType = 'allDevices';
	}

	/**
	 * Function to check permissions to view this
	 * @returns permission check
	 */
	public checkOptlnStatus () {

		this.getOptinOutStatus()
			.subscribe((results: any) => {
				this.optlnStatus = results.data.rccOptInStatus;
				if (this.optlnStatus) {
					this.getPolicies()
					.subscribe();
					this.getLeftSideTags()
						.subscribe();
				}
			});

		return this.routeAuthService.checkPermissions(this.customerId)
				.pipe(
				takeUntil(this.destroyed$),
				catchError(err => {
					this.logger.error('High Crash Assets : getHighCrashesDeviceData() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);

	}
	/**
	 * Function to toggleOpt status
	 * @returns null
	 */

	public toggleOptlnStatus () {
		this.optlnStatus = !this.optlnStatus;
		if (!this.optlnStatus) {
			this.cuiModalService.show(this.confirmationModalTemplate, 'normal');
		} else {
			const params = {
				customerId: this.customerId,
				isRccOpted: this.optlnStatus,
			};
			this.getLeftSideTags()
			.pipe(
				takeUntil(this.destroyed$),
				catchError(() => {
					this.handleError();

					return of({ });
				}),
			)
			.subscribe();
			this.assetTaggingService.updateOptStatus(params)
			.pipe(
				takeUntil(this.destroyed$),
				catchError(() => {
					this.handleError();

					return of({ });
				}),
			)
			.subscribe();
		}
	}
	/**
	 * Function to discard opt changes
	 * @returns null
	 */
	public discardChanges () {
		this.optlnStatus = false;
		this.isOptlnStatusChanged = true;
		const params = {
			customerId: this.customerId,
			isRccOpted: this.optlnStatus,
		};
		forkJoin(
			this.assetTaggingService.updateOptStatus(params),
		)
		.pipe(
			takeUntil(this.destroyed$),
			catchError(() => {
				this.handleError();

				return of({ });
			}),
		)
		.subscribe();
		this.initializeDetails();
		this.cuiModalService.hide();
		this.toBeScanned = false;
		this.enableSaveButton = false;
	}
	/**
	 * Function to save opt changes
	 * @returns null
	 */
	public saveChanges () {
		this.optlnStatus = true;
		this.cuiModalService.hide();
	}
	/**
	 * Function to get opt changes
	 * @returns opt data
	 */

	public getOptinOutStatus () {
		const params = {
			customerId: this.customerId,
		};

		return this.assetTaggingService.getOptInStatus(params)
			.pipe(
				takeUntil(this.destroyed$),
				catchError(err => {
					this.logger.error('OptinStatus : getOptinOutStatus() ' +
						`:: Error : (${err.status}) ${err.message}`);
					this.handleError();

					return of({ });
				}),
			);

	}

	/**
	 * Function to get policies
	 * @returns policies data
	 */

	 public getPolicies () {

		  return this.controlPointAdminComplienceService.getPolicies(this.customerId)
		  .pipe(
			  takeUntil(this.destroyed$),
			  map((results: any) => {
				  this.policyGroupDetails = results;
				  this.policies = _.cloneDeep(this.policyGroupDetails.policyGroup);
				  this.policies.unshift('select');
			}),
			catchError(err => {
				this.logger.error('Policies : getPolicies()' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
			);
	 }

	/**
	 * Function to get left side tags
	 * @returns tags data
	 */
	public getLeftSideTags () {

		return this.controlPointAdminComplienceService.getLeftSideTags(this.customerId)
			.pipe(
				takeUntil(this.destroyed$),
				map((results: any) => {
					this.leftSideTagsResponse = results;
					this.clonedLeftTags = _.cloneDeep(this.leftSideTagsResponse.tags);
				}),
				catchError(err => {
					this.logger.error('Left side tags : getLeftSideTags() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);

	}
	/**
	 * Function to get right side tags
	 * @returns tags
	 */
	public getRightSideTags () {

		return this.controlPointAdminComplienceService.getRightSideTags(this.customerId)
			.pipe(
				takeUntil(this.destroyed$),
				map((results: any) => {
					this.rightSideTagsResponse = results;
					if (this.rightSideTagsResponse.policyGroups.length === 0) {
						this.rightSideTagsResponse.policyGroups = [{
							devices: [],
							policyName: 'HIPAA',
							tags: [],
							toBeScanned: false,
						},
						{
							devices: [],
							policyName: 'PCI',
							tags: [],
							toBeScanned: false,
						},
						];
					}
					this.filterDuplicates();
				}),
			);
	}

	/**
	 * Function to filter duplicates
	 * @param event will have right sad tag details
	 */
	public checkRightSideTags (event) {
		this.saveDetails.body.tags = event;
		if (event.length) {
			this.tagsFromAssetTagging = true;
		} else {
			this.tagsFromAssetTagging = false;
		}
	}

	/**
	 * Function to filter duplicates
	 * @returns null
	 */

	public filterDuplicates () {
		if (this.rightSideTagsResponse.policyGroups) {
			const policyGroups = _.find(this.rightSideTagsResponse.policyGroups,
				 { policyName: this.saveDetails.body.policy });
			if (policyGroups) {
				if (policyGroups.tags.length) {
					this.allInventorySelected = false;
					this.selectedDeviceTagType = 'selectedTags';
					this.rightSideTags = policyGroups.tags;
					this.clonedRightTags = _.cloneDeep(this.rightSideTags);
					this.toBeScanned = JSON.parse(policyGroups.toBeScanned);
					_.each(this.leftSideTags, (tag, i) => {
						const duplicateTagIndex = this.rightSideTags.findIndex(rightSideTag =>
							tag.tagName === rightSideTag.tagName);
						if (duplicateTagIndex !== -1) {
							this.rightSideTags[duplicateTagIndex] = _.cloneDeep(tag);
							this.filteredArray
								.push(this.leftSideTags[i]);
						}
					});

					this.leftSideTags = _.differenceWith(this.leftSideTags, this.filteredArray, _.isEqual);
					this.filteredArray = [];
				} else {
					this.rightSideTags  = [];
					_.cloneDeep(this.rightSideTags);
					if (this.triggerModal !== 'scan') {
						this.selectedDeviceTagType = 'allDevices';
					}
					this.toBeScanned = JSON.parse(policyGroups.toBeScanned);
				}

			} else {
				this.rightSideTags  = [];
				_.cloneDeep(this.rightSideTags);
				if (this.triggerModal !== 'scan') {
					this.selectedDeviceTagType = 'allDevices';
				}
				this.toBeScanned = false;
			}
		} else {
			this.toBeScanned = false;
		}
	}
	/**
	 * Function to filter duplicates
	 * @param policy type of policy selected
	 * @returns response with success
	 */

	public onPolicySelected (policy) {
		_.invoke(this.alert, 'hide');
		this.triggerModal = 'policy';
		let showModalFlag = false;
		this.tagsFromAssetTagging = true;
		if (this.rightSideTagsResponse && this.rightSideTagsResponse.policyGroups && policy !== 'select') {
			const previousPolicy = policy === 'HIPAA' ? 'PCI' : 'HIPAA';
			const policyGroup = _.find(this.rightSideTagsResponse.policyGroups,
				{ policyName: previousPolicy });
			if (policyGroup) {
				if (policyGroup.toBeScanned !== this.toBeScanned) {
					showModalFlag = true;
				}
			} else if (this.toBeScanned) {
				showModalFlag = true;
			}
		}
		if (policy !== 'select' && !this.enableSaveButton && !this.allInventorySelected && !showModalFlag) {
			if (this.leftSideTagsResponse) {
				this.clonedLeftTags = _.cloneDeep(this.leftSideTagsResponse.tags);
				this.leftSideTags = this.clonedLeftTags;
				this.getRightSideTags()
					.subscribe();
			}
		} else if (policy !== 'select' && this.allInventorySelected && this.rightSideTags.length || showModalFlag) {
			this.cuiModalService.show(this.switchBetweenPolicy, 'normal');
		} else if (this.enableSaveButton) {
			this.cuiModalService.show(this.switchBetweenPolicy, 'normal');
		}
		this.allInventorySelected = false;
	}

	public enableDisableScan () {
		this.toBeScanned = !this.toBeScanned;
		if (this.rightSideTagsResponse && this.rightSideTagsResponse.policyGroups) {
			const policyGroup = _.find(this.rightSideTagsResponse.policyGroups,
				{ policyName: this.saveDetails.body.policy });
			if (policyGroup.toBeScanned !== this.toBeScanned && policyGroup.tags.length) {
				this.tagsFromAssetTagging = true;
			}
		}
	}
	/**
	 * Function can help in enabling and disabling the save button,
	 *  based on updated tags details
	 * @param updateSavebuttonFlag it is a flag
	 */
	public getUpdatedTags (updateSavebuttonFlag) {
		this.enableSaveButton = updateSavebuttonFlag;
	}

	/**
	 * This Function is used to save the policy details
	 */
	public savePolicyDetails () {

		_.invoke(this.alert, 'hide');

		this.saveDetails.body.toBeScanned = this.toBeScanned;
		if (this.selectedDeviceTagType === 'allDevices') {
			this.saveDetails.body.tags = [];
		}
		const params = {
			body: this.saveDetails.body,
			customerId: this.customerId,
			policy: this.saveDetails.body.policy,
			tags: this.saveDetails.body.tags,
			toBeScanned: this.saveDetails.body.toBeScanned,
		};

		this.assetTaggingService.postPolicyMapping(params)
			.pipe(takeUntil(this.destroyed$),
			map(() => {
				this.handleSaveSuccess();
			}),
				catchError(() => {
					this.handleError();

					return of({ });
				}),
			)
			.subscribe();
	}

	/**
	 * handle success scenario on save
	 */
	public handleSaveSuccess () {
		this.enableSaveButton = false;
		this.allInventorySelected = false;
		this.tagsFromAssetTagging = true;
		let alert = '_AssetsTaggingSavePolicyAlertDisabled_';
		if (this.saveDetails.body.toBeScanned) {
			alert = '_AssetsTaggingSavePolicyAlertEnabled_';
		}
		_.invoke(this.alert, 'show',
		I18n.get(alert, this.saveDetails.body.policy), 'success');
		this.enableSaveButton = false;

		if (this.rightSideTagsResponse && this.rightSideTagsResponse.policyGroups) {
			const policyGroups = _.find(this.rightSideTagsResponse.policyGroups,
				{ policyName: this.saveDetails.body.policy });
			if (policyGroups) {
				policyGroups.toBeScanned = this.toBeScanned;
			}
		}
	}

	/**
	 * This Function is used to updateOptInOutStatus
	 */
	public updateOptInOutStatus () {
		const params = {
			customerId: this.customerId,
			isRccOpted: this.optlnStatus,
		};
		this.assetTaggingService.updateOptStatus(params)
		.subscribe();

		if (!this.optlnStatus) {
			this.assetTaggingService.deleteMapping(params)
				.subscribe();
		}

		if (this.optlnStatus && this.isOptlnStatusChanged) {
			this.isOptlnStatusChanged = false;
			forkJoin(
				this.getLeftSideTags(),
				this.getRightSideTags(),
			)
			.subscribe();

		}
	}

	/**
	 * function to habdle error scenarios
	 */

	 public handleError () {
		_.invoke(this.alert, 'show',
		I18n.get('_OsvGenericError_', this.saveDetails.body.policy), 'danger');
	 }
	/**
	 * Function to update permission
	 * @returns subscribe of data
	 */
	public updatePermissions () {

		return this.routeAuthService.updatePermissions(this.customerId, true)
		.pipe(
		takeUntil(this.destroyed$),
		catchError(err => {
			this.logger.error('Update Permission : updatePermissions() ' +
				`:: Error : (${err.status}) ${err.message}`);
			this.handleError();

			return of({ });
		}),
	);

	}

/**
 * Function to update option selected by user
 * @param type selected type by user
 */
	public onChangesDeviceTagType () {
		_.invoke(this.alert, 'hide');
		this.triggerModal = 'scan';
		if (this.selectedDeviceTagType === 'allDevices') {
			this.allInventorySelected = true;
		} else {
			this.allInventorySelected = false;
		}
		if (this.enableSaveButton && this.selectedDeviceTagType === 'allDevices') {
			this.cuiModalService.show(this.switchBetweenPolicy, 'normal');
		} else if (!this.enableSaveButton && this.selectedDeviceTagType === 'allDevices') {
			this.hideAssetTags = true;
		} else if (this.selectedDeviceTagType === 'selectedTags' && this.enableSaveButton) {
			this.hideAssetTags = false;
		} else {
			this.hideAssetTags = false;
			this.tagsFromAssetTagging = false;
			if (this.leftSideTagsResponse) {
				this.leftSideTags = _.cloneDeep(this.leftSideTagsResponse.tags);
				this.getRightSideTags()
				.subscribe();
			}
		}
	}

	/**
	 * Function to discard selected policy change
	 */
	public discardChangesOnPolicyChange () {
		this.hideAssetTags = true;
		this.allInventorySelected = false;
		if (this.triggerModal === 'policy') {
			this.leftSideTags = _.cloneDeep(this.leftSideTagsResponse.tags);
			this.getRightSideTags()
			.subscribe();
			this.hideAssetTags = true;
		} else {
			this.selectedDeviceTagType = 'allDevices';
		}
		this.enableSaveButton = false;
		this.cuiModalService.hide();
	}

	/**
	 * Function to keep updated policy changes
	 */
	public onCancelPolicyChanges () {
		if (this.triggerModal === 'policy') {
			 this.saveDetails.body.policy =
			 this.saveDetails.body.policy === 'HIPAA' ? 'PCI' : 'HIPAA';
		} else {
			this.selectedDeviceTagType = 'selectedTags';
		}
		this.cuiModalService.hide();
	}

	/**
	 * Function to show Confirmation pop up when leaving compliance tap
	 * @returns with popup
	 */
	public canDeactivate (): boolean | Observable <boolean> | Promise <boolean> {
		if (this.enableSaveButton) {
			this.cuiModalService.show(this.switchBetweenCompliance, 'normal');

			return this.canDeactGuard.navigateAwaySelection$;
		}
	  }

	/**
	 * Function to show Confirmation pop up when leaving compliance tap
	 * @param choice  will have user's choice
	 */
	public continueWithoutChange (choice: boolean): void {
		this.canDeactGuard.navigateAwaySelection$.next(choice);
		this.cuiModalService.hide();
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
