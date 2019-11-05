import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {
	ControlPointIEHealthStatusAPIService,
	ControlPointAdminComplienceService,
	UserService,
	RightTagResponse,
	LeftTagResponse,
	AssetTaggingService,
} from '@sdp-api';

import { User } from '@interfaces';
import { ActivatedRoute } from '@angular/router';

import { empty, Subject, from, of, forkJoin } from 'rxjs';
import { catchError, finalize, takeUntil, map, switchMap } from 'rxjs/operators';
import { RouteAuthService } from '@services';

import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
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
	@ViewChild('alertTemplate',
	{ static: true }) private alertTemplate: TemplateRef<string>;

	private destroyed$: Subject<void> = new Subject<void>();
	private customerId: string;
	public accepted = false;
	public error = false;
	public errorMessage = '';
	public loading = false;
	public optlnStatus = false;
	public policies = [];
	public leftSideTagsResponse: LeftTagResponse;
	public rightSideTagsResponse: RightTagResponse;
	public selectedPolicy = '';
	public leftSideTags = [];
	public rightSideTags = [];
	public saveDetails: AssetTaggingService.PostParams = {
		body: {
			policy: '',
			tags: [],
			toBeScanned : false,
		},
		customerId: '',
	};
	public toBeScanned = false;
	public alert: any = { };

	private user: User;

	constructor (
		private controlPointIEHealthStatusAPIService: ControlPointIEHealthStatusAPIService,
		public cuiModalService: CuiModalService,
		public controlPointAdminComplienceService: ControlPointAdminComplienceService,
		public assetTaggingService: AssetTaggingService,
		private route: ActivatedRoute,
		private logger: LogService,
		private userService: UserService,
		private routeAuthService: RouteAuthService,
	) {
		this.user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(this.user, ['info', 'customerId']);
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
				name: 'HIPPA',
				value: false,
			},
			{
				name: 'PCI',
				value: false,
			},
		];
		this.checkOptlnStatus();
	}

	/**
	 * Function to check permissions to view this
	 * @returns permission check
	 */
	public checkOptlnStatus () {

		this.optlnStatus = true;
		forkJoin(
			this.getLeftSideTags(),
			this.getRightSideTags(),
		).subscribe();

		return this.routeAuthService.checkPermissions(this.customerId)
				.pipe(
				takeUntil(this.destroyed$),
				map((results: any) => {

				}),
				catchError(err => {
					this.logger.error('High Crash Assets : getHighCrashesDeviceData() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);

	}

	public toggleOptlnStatus () {
		if (this.rightSideTags || this.leftSideTags) {
			this.cuiModalService.show(this.confirmationModalTemplate, 'small');
			this.optlnStatus = true;
		}
	}

	public discardChanges () {
		this.optlnStatus = false;
		this.cuiModalService.hide();
	}

	public saveChanges () {
		this.optlnStatus = true;
		this.cuiModalService.hide();
	}

	public getLeftSideTags () {

		return this.controlPointAdminComplienceService.getLeftSideTags(this.customerId)
			.pipe(
				takeUntil(this.destroyed$),
				map((results: any) => {
					this.leftSideTagsResponse = results;
				}),
				catchError(err => {
					this.logger.error('Crash Assets : getLeftSideTags() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);

	}

	public getRightSideTags () {

		return this.controlPointAdminComplienceService.getRightSideTags(this.customerId)
			.pipe(
				takeUntil(this.destroyed$),
				map((results: any) => {
					this.rightSideTagsResponse = results;
				}),
				catchError(err => {
					this.logger.error('Crash Assets : getAllCrashesData() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);
	}

	public filterDuplicates () {
		if (this.leftSideTagsResponse.tags) {
			this.leftSideTags = _.cloneDeep(this.leftSideTagsResponse.tags);
		}
		if (this.rightSideTagsResponse.policyGroups) {
			const policyGroups = _.find(this.rightSideTagsResponse.policyGroups,
				 { policyName: this.selectedPolicy });
			this.rightSideTags = _.cloneDeep(policyGroups.tags);
			_.each(this.rightSideTags, (tag) => {
				tag.devices = policyGroups.devices;
				tag.deviceCount = policyGroups.deviceCount;
			});

			  console.log('Left side Tags:' + this.leftSideTags);
			  console.log('Right side Tags:' + this.rightSideTags);

		}
	}

	public onPolicySelected (policy) {
		if (policy != 'select') {
			this.selectedPolicy = policy;
			this.filterDuplicates();
		}
	}

	/**
	 * This Function is used to save the policy details
	 */
	public savePolicyDetails () {

		this.assetTaggingService.getSelectedTags()
		.pipe(
			switchMap(tags => {
				this.saveDetails.body.tags = tags;
				this.saveDetails.body.policy = this.selectedPolicy;
				this.saveDetails.body.toBeScanned = this.toBeScanned;
				this.saveDetails.customerId = this.customerId;

				return this.assetTaggingService.postPolicyMapping(this.saveDetails);
			}),
			takeUntil(this.destroyed$))
		.subscribe(() => this.alert.show(`Tags details for the policy
					${this.selectedPolicy} are successfully saved`, 'success'));
	}

	public updatePermissions () {

		return this.routeAuthService.updatePermissions(this.customerId, true)
		.pipe(
		takeUntil(this.destroyed$),
		map((results: any) => {

		}),
		catchError(err => {
			this.logger.error('High Crash Assets : getHighCrashesDeviceData() ' +
				`:: Error : (${err.status}) ${err.message}`);

			return of({ });
		}),
	);

	}
}
