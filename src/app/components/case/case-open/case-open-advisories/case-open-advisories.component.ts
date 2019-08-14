import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CaseService } from '@cui-x/services';
import { Asset, CriticalBug, FieldNoticeBulletin,
	SecurityAdvisoryBulletin, ContractsService,
	DeviceContractResponse } from '@sdp-api';
import { CuiModalContent, CuiModalService } from '@cisco-ngx/cui-components';
import { LogService } from '@cisco-ngx/cui-services';
import { ProfileService } from '@cisco-ngx/cui-auth';
import { I18n } from '@cisco-ngx/cui-utils';
import { CaseRequestType, caseSeverities } from '@classes';
import { AdvisoryType, CaseOpenRequest, ProblemArea, Subtech, Tech } from '@interfaces';
import { CloseConfirmComponent } from '../close-confirm/close-confirm.component';
import { CaseNoteBuilder } from './case-note-builder';
import { Subject, of, Observable } from 'rxjs';
import { catchError, takeUntil, flatMap } from 'rxjs/operators';
import { CaseOpenData } from '../caseOpenData';

import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';

/**
 * Component for opening a case against a Cisco Security Advisory/Field Notice/Bug
 */
@Component({
	selector: 'app-case-open-advisories',
	styleUrls: ['./case-open-advisories.component.scss'],
	templateUrl: './case-open-advisories.component.html',
})
export class CaseOpenAdvisoriesComponent implements CuiModalContent, OnInit, OnDestroy {
	@Input() public advisory: SecurityAdvisoryBulletin | FieldNoticeBulletin | CriticalBug;
	@Input() public selectedAsset: Asset;
	@Input() public otherAssets: Asset[];
	@Input() public type: AdvisoryType;
	public titles = {
		bug: '_CriticalBug_',
		field: '_CiscoFieldNotice_',
		security: '_CiscoSecurityAdvisory_',
	};
	public typeTitle: string;
	public allAssets: Asset[];
	public loadingTech = false;
	public loadingSubtech = false;
	public loadingProblemAreas = false;
	public techOptions: Tech[];
	public subtechOptions: Subtech[];
	public problemAreaOptions: ProblemArea[];
	public problemGroups: string[];
	public errors: string[];
	public caseOpenData: CaseOpenData;
	public titleMaxLength = 255;
	public descriptionMaxLength = 32000;

	public data: { }; // Input data
	public caseForm = new FormGroup({
		description: new FormControl('',
			[Validators.required, Validators.maxLength(this.descriptionMaxLength)]),
		severity: new FormControl(3, Validators.required),
		title: new FormControl('',
			[Validators.required, Validators.maxLength(this.titleMaxLength)]),
	});
	public severityName = caseSeverities[3].getCreateName();
	public customerId: string;
	public contractNumber: string;
	public contractLoading = true;
	public submitting = false;
	public submitted = false;

	private noteBuilder = new CaseNoteBuilder();
	private note: string;

	private destroy$ = new Subject();

	constructor (
		private caseService: CaseService,
		private contractsService: ContractsService,
		public cuiModalService: CuiModalService,
		private logger: LogService,
		private profileService: ProfileService,
		private userResolve: UserResolve,
	) {
	}

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.advisory = _.get(this.data, 'advisory');
		this.selectedAsset = _.get(this.data, 'selectedAsset');
		this.otherAssets = _.get(this.data, 'otherAssets', []);
		this.type = _.get(this.data, 'type');
		this.allAssets = this.otherAssets;
		if (this.selectedAsset) {
			this.allAssets.unshift(this.selectedAsset);
		}
		this.allAssets = _.uniqBy(this.allAssets, 'serialNumber');
		if (this.type !== 'bug') {
			this.caseForm.controls.title.setValue(
				_.get(this.advisory, 'bulletinTitle', ''),
			);
		} else {
			this.caseForm.controls.title.setValue(
				_.get(this.advisory, 'title', ''),
			);
		}
		this.note = this.noteBuilder.buildNote(this.type, this.advisory);
		this.caseForm.controls.description.setValue(
			this.note,
		);
		this.typeTitle = I18n.get(this.titles[this.type]);

		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroy$),
			flatMap((id: string) => {
				this.customerId = id;

				return this.getContractData(this.customerId, this.selectedAsset.serialNumber);
			}),
		)
		.subscribe(response => {
			this.contractNumber = _.get(response, ['data', 0, 'contractNumber'], null);
			this.contractLoading = false;
		});
	}

	/**
	 * OnDestroy Lifecycle Hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Close modal
	 */
	public close () {
		if (!this.submitted) {
			this.cuiModalService.showComponent(CloseConfirmComponent, { });
		} else {
			this.cuiModalService.onCancel.next();
			this.cuiModalService.hide();
		}
	}

	/**
	 * Register the tech/subtech/pc sub form group when it is ready
	 * @param form the sub-group
	 */
	public onFormReady (form: FormGroup) {
		this.caseForm.addControl('techInfo', form);
	}

	/**
	 * Send API request to open case
	 * When user clicks "Submit" button
	 */
	public submit () {
		this.submitting = true;
		const caseDetails: CaseOpenRequest = {
			contactId: this.profileService.getProfile().cpr.pf_auth_uid,
			contractNumber: this.contractNumber,
			customerActivity: _.get(
				(<FormGroup> this.caseForm.controls.techInfo).controls.problemArea.value,
				'customerActivity',
			),
			description: this.caseForm.controls.description.value,
			deviceName: this.allAssets[0].deviceName,
			noteDetails: {
				note1: {
					note: 'Additional Event Details',
					noteDetail: this.note,
					noteStatus: 'E',
					noteType: 'Problem Description',
				},
			},
			priority: this.caseForm.controls.severity.value,
			problemCode: _.get(
				(<FormGroup> this.caseForm.controls.techInfo).controls.problemArea.value,
				'problemCode',
			),
			requestType: CaseRequestType.Diagnose,
			serialNumber: this.allAssets[0].serialNumber,
			softwareVersion: this.allAssets[0].osVersion,
			subTechId: _.get(
				(<FormGroup> this.caseForm.controls.techInfo).controls.subtech.value,
				'_id',
			),
			summary: this.caseForm.controls.title.value,
			techId: _.get(
				(<FormGroup> this.caseForm.controls.techInfo).controls.technology.value,
				'_id',
			),
		};
		this.caseService.createCase(caseDetails)
		.pipe(
			catchError(err => {
				this.logger.error(`Create Case :: Error ${err}`);

				return of(null);
			}),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			if (!result) {
				this.errors = [I18n.get('_ErrorReachingCSOne_')];
			} else if (result.statusCode === 'ERROR') {
				this.errors = result.errorMessages.map(
					msg => msg.errorMessage,
				);
			} else {
				this.caseOpenData = {
					caseNum: result.caseNumber,
					customerActivity:
						_.get(
							(<FormGroup> this.caseForm.controls.techInfo)
								.controls.problemArea.value,
							'customerActivity',
						),
					description: this.caseForm.controls.description.value,
					problemArea:
						_.get(
							(<FormGroup> this.caseForm.controls.techInfo)
								.controls.problemArea.value,
							'problemCodeName',
						),
					requestRma: false,
					severity: this.caseForm.controls.severity.value,
					severityName: caseSeverities[3].getCreateName(),
					subtech: _.get(
						(<FormGroup> this.caseForm.controls.techInfo).controls.subtech.value,
						'subTechName',
					),
					technology: _.get(
						(<FormGroup> this.caseForm.controls.techInfo).controls.technology,
						'techName',
					),
					title: this.caseForm.controls.title.value,
				};
			}
			this.submitted = true;
		});
	}

	/**
	 * Fetch device contract data
	 * @param customerId id of customer whose device we're searching
	 * @param serialNumber serial number of the device we're fetching
	 * @returns Observable with device data
	 */
	private getContractData (customerId: string, serialNumber: string):
		Observable<DeviceContractResponse> {
		const params = { customerId, serialNumber: [serialNumber] };

		return this.contractsService.getContractDetails(params)
		.pipe(
			catchError(err => {
				this.logger.error(`Device Contract Data :: ${serialNumber} :: Error ${err}`);

				return of(null);
			}),
		);
	}
}
