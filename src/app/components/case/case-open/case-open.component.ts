import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { caseSeverities, CaseRequestType } from '@classes';
import { CaseOpenRequest } from '@interfaces';
import { CaseService } from '@cui-x/services';
import { ProfileService } from '@cisco-ngx/cui-auth';
import { I18n } from '@cisco-ngx/cui-utils';
import { CuiModalContent, CuiModalService } from '@cisco-ngx/cui-components';
import { LogService } from '@cisco-ngx/cui-services';
import { Asset } from '@sdp-api';
import { SelectOption } from './panel-select/panel-select.component';
import { CaseOpenData } from './caseOpenData';
import { CloseConfirmComponent } from './close-confirm/close-confirm.component';

import * as _ from 'lodash-es';

/**
 * Component for opening a new case in CSOne for a device
 */
@Component({
	selector: 'app-case-open',
	styleUrls: ['./case-open.component.scss'],
	templateUrl: './case-open.component.html',
})
export class CaseOpenComponent implements  CuiModalContent, OnInit, OnDestroy {
	@Input() public asset: Asset;
	public data: { };
	public expand = false;
	public submitted = false;
	public submitting = false;
	public sevOptions: SelectOption<number>[] = [
		{
			name: caseSeverities[1].getCreateName(),
			subtitle: I18n.get('_SeverityX_', 1),
			value: 1,
		},
		{
			name: caseSeverities[2].getCreateName(),
			subtitle: I18n.get('_SeverityX_', 2),
			value: 2,
		},
		{
			name: caseSeverities[3].getCreateName(),
			subtitle: I18n.get('_SeverityX_', 3),
			value: 3,
		},
		{
			name: caseSeverities[4].getCreateName(),
			subtitle: I18n.get('_SeverityX_', 4),
			value: 4,
		},
	];
	public descriptionMaxLength = 32000;
	public titleMaxLength = 255;
	public caseForm = new FormGroup({
		description: new FormControl('', [Validators.required,
			Validators.maxLength(this.descriptionMaxLength)]),
		requestRma: new FormControl(false),
		severity: new FormControl(4, Validators.required),
		title: new FormControl('', [Validators.required,
			Validators.maxLength(this.titleMaxLength)]),
	});

	/** 2 values to pass to "submitted" component post-request */
	public errors: string[];
	public caseOpenData: CaseOpenData;

	private destroy$ = new Subject();

	constructor (
		private caseService: CaseService,
		public cuiModalService: CuiModalService,
		private logger: LogService,
		private profileService: ProfileService,
	) {
		this.logger.debug('CaseOpenComponent Created!');
	}

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.asset = _.get(this.data, 'asset');
	}

	/**
	 * OnDestroy lifecycle hook
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
			customerActivity: _.get(
				// Have to explicitly cast it to a FormGroup
				(<FormGroup> this.caseForm.controls.techInfo).controls.problemArea.value,
				'customerActivity',
			),
			description: this.caseForm.controls.description.value,
			deviceName: this.asset.deviceName,
			priority: this.caseForm.controls.severity.value,
			problemCode: _.get(
				(<FormGroup> this.caseForm.controls.techInfo).controls.problemArea.value,
				'problemCode',
			),
			requestType: this.caseForm.controls.requestRma.value ?
				CaseRequestType.RMA : CaseRequestType.Diagnose,
			serialNumber: this.asset.serialNumber,
			softwareVersion: this.asset.osVersion,
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
					requestRma: this.caseForm.controls.requestRma.value,
					severity: this.caseForm.controls.severity.value,
					severityName: _.get(_.find(this.sevOptions,
						{ value: this.caseForm.controls.severity.value }), 'name'),
					subtech: _.get(
						(<FormGroup> this.caseForm.controls.techInfo).controls.subtech.value,
						'subTechName',
					),
					technology: _.get(
						(<FormGroup> this.caseForm.controls.techInfo).controls.technology.value,
						'techName',
					),
					title: this.caseForm.controls.title.value,
				};
			}
			this.submitted = true;
		});
	}
}
