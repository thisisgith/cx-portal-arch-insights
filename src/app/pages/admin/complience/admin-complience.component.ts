import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
	ControlPointAdminComplienceService,
	RightTagResponse,
	LeftTagResponse,
	AssetTaggingService,
} from '@sdp-api';

import { User } from '@interfaces';
import { ActivatedRoute } from '@angular/router';

import { Subject, of, forkJoin } from 'rxjs';
import { catchError, takeUntil, map, switchMap } from 'rxjs/operators';
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
export class AdminComplienceComponent implements OnInit {
	@ViewChild('confirmationModalTemplate',
	{ static: true }) private confirmationModalTemplate: TemplateRef<string>;

	@ViewChild('switchBetweenPolicy',
	{ static: true }) private switchBetweenPolicy: TemplateRef<string>;

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
	public selectedPolicy = 'select';
	public leftSideTags = [];
	public rightSideTags = [];
	public tagsFromAssetTagging: boolean;
	public saveDetails: AssetTaggingService.PostParams = {
		body: {
			customerId: '',
			policy: '',
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

	constructor (
		public cuiModalService: CuiModalService,
		public controlPointAdminComplienceService: ControlPointAdminComplienceService,
		public assetTaggingService: AssetTaggingService,
		private route: ActivatedRoute,
		private logger: LogService,
		private routeAuthService: RouteAuthService,
	) {
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
		this.saveDetails.body.customerId = this.customerId;
	}

	/**
	 * Function which instanstiates the settings page to the initial view
	 */
	public ngOnInit () {
		this.policies = [
			{
				name: 'select',
				value: true,
			},
			{
				name: 'HIPAA',
				value: false,
			},
			{
				name: 'PCI',
				value: false,
			},
		];
		this.checkOptlnStatus();
		this.initializeDetails();
	}

	/**
	 * initialize all the tag and policy details
	 */
	public initializeDetails () {
		this.saveDetails.body.policy = 'select';
		this.saveDetails.body.tags = [];
		this.saveDetails.body.toBeScanned = false;
		this.selectedDeviceTagType = 'allDevices';
	}

	/**
	 * Function to check permissions to view this
	 * @returns permission check
	 */
	public checkOptlnStatus () {

		forkJoin(
			this.getOptinOutStatus(),
			this.getLeftSideTags(),
			this.getRightSideTags(),
		)
		.subscribe();

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
		if (this.optlnStatus && this.isOptlnStatusChanged) {
			this.isOptlnStatusChanged = false;
			forkJoin(
				this.getLeftSideTags(),
				this.getRightSideTags(),
			)
			.subscribe();

		} else if (this.enableSaveButton) {
			this.cuiModalService.show(this.confirmationModalTemplate, 'normal');
		} else {
			this.optlnStatus = false;
			this.initializeDetails();
		}
	}
	/**
	 * Function to discard opt changes
	 * @returns null
	 */
	public discardChanges () {
		this.optlnStatus = false;
		this.isOptlnStatusChanged = true;
		this.updateOptInOutStatus();
		this.initializeDetails();
		this.cuiModalService.hide();
		this.enableSaveButton = false;
	}
	/**
	 * Function to save opt changes
	 * @returns null
	 */
	public saveChanges () {
		this.optlnStatus = true;
		this.updateOptInOutStatus();
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
				map((results: any) => {
					this.optlnStatus = results.data.rccOptInStatus;
				}),
				catchError(err => {
					this.logger.error('OptinStatus : getOptinOutStatus() ' +
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
				}),
				catchError(err => {
					this.logger.error('Tags : getRightSideTags() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
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
		if (this.leftSideTagsResponse.tags) {
			this.leftSideTags = _.cloneDeep(this.leftSideTagsResponse.tags);
		}
		if (this.rightSideTagsResponse.policyGroups) {
			const policyGroups = _.find(this.rightSideTagsResponse.policyGroups,
				 { policyName: this.saveDetails.body.policy });
			this.rightSideTags = _.cloneDeep(policyGroups.tags);
			_.each(this.rightSideTags, tag => {
				tag.devices = policyGroups.devices;
				tag.deviceCount = policyGroups.deviceCount;
			});
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
		if (policy !== 'select' && this.isPolicyChanged
		&& this.saveDetails.body.policy !== 'select' && this.enableSaveButton) {
			this.cuiModalService.show(this.switchBetweenPolicy, 'normal');
		}
		this.isPolicyChanged = true;
		this.filterDuplicates();
		if (this.rightSideTags.length) {
			this.selectedDeviceTagType = 'selectedTags';
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
			.pipe(takeUntil(this.destroyed$))
			.subscribe(() => this.handleSaveSuccess());
	}

	/**
	 * handle success scenario on save
	 */
	public handleSaveSuccess () {
		this.enableSaveButton = false;
		_.invoke(this.alert, 'show',
		I18n.get('_AssetsTaggingSavePolicyAlert_'), 'success');
		this.enableSaveButton = false;

		/** Needs to save Right side tag details and
		 * left side tag details
		 */
		_.each(this.rightSideTagsResponse.policyGroups, policy => {
			if (policy.policyName === this.saveDetails.body.policy) {
				policy.tags = this.saveDetails.body.tags;
			}
		});

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

			return of({ });
		}),
	);

	}

/**
 * Function to update option selected by user
 * @param type selected type by user
 */
	public onChangesDeviceTagType () {
		this.triggerModal = 'scan';
		if (this.enableSaveButton && this.selectedDeviceTagType === 'allDevices') {
			this.cuiModalService.show(this.switchBetweenPolicy, 'normal');
		} else if (!this.enableSaveButton && this.selectedDeviceTagType === 'allDevices') {
			this.hideAssetTags = true;
		} else if (this.selectedDeviceTagType === 'selectedTags' && this.enableSaveButton) {
			this.filterDuplicates();
			this.hideAssetTags = false;
		} else {
			this.hideAssetTags = false;
		}
	}

	/**
	 * Function to discard selected policy change
	 */
	public discardChangesOnPolicyChange () {
		this.hideAssetTags = true;
		if (this.triggerModal === 'policy') {
			this.onChangesDeviceTagType();
			this.selectedDeviceTagType = 'allDevices';
			this.hideAssetTags = true;
			this.filterDuplicates();
		} else if (this.selectedDeviceTagType === 'allDevices') {
			this.assetTaggingService.Tags = [];
		}
		this.filterDuplicates();
		this.enableSaveButton = false;
		this.cuiModalService.hide();
	}

	/**
	 * Function to keep updated policy changes
	 */
	public onCancelPolicyChanges () {
		if (this.triggerModal === 'policy') {
			 this.saveDetails.body.policy =
			 this.saveDetails.body.policy === ' HIPAA' ? 'PCI' : 'HIPAA';
		} else {
			this.selectedDeviceTagType = 'selectedTags';
		}
		this.cuiModalService.hide();
	}
}
