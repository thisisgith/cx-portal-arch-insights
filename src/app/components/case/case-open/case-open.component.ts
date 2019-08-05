import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, merge, of } from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { CaseRequestType } from '@classes';
import { CaseOpenRequest, ProblemArea, Subtech, Tech } from '@interfaces';
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
	public loadingTech = false;
	public loadingSubtech = false;
	public loadingProblemAreas = false;
	public submitted = false;
	public submitting = false;
	public sevOptions: SelectOption<number>[] = [
		{
			name: I18n.get('_OpenCaseNetworkDown_'),
			subtitle: I18n.get('_SeverityX_', 1),
			value: 1,
		},
		{
			name: I18n.get('_OpenCaseSeverelyDegraded_'),
			subtitle: I18n.get('_SeverityX_', 2),
			value: 2,
		},
		{
			name: I18n.get('_OpenCaseNetworkImpaired_'),
			subtitle: I18n.get('_SeverityX_', 3),
			value: 3,
		},
		{
			name: I18n.get('_OpenCaseAskaQuestion_'),
			subtitle: I18n.get('_SeverityX_', 4),
			value: 4,
		},
	];
	public descriptionMaxLength = 32000;
	public titleMaxLength = 255;
	public techOptions: Tech[];
	public subtechOptions: Subtech[];
	public problemAreaOptions: ProblemArea[];
	public problemGroups: string[];
	public caseForm = new FormGroup({
		description: new FormControl('', [Validators.required,
			Validators.maxLength(this.descriptionMaxLength)]),
		problemArea: new FormControl(null, Validators.required),
		requestRma: new FormControl(false),
		severity: new FormControl(4, Validators.required),
		subtech: new FormControl(null, Validators.required),
		technology: new FormControl(null, Validators.required),
		title: new FormControl('', [Validators.required,
			Validators.maxLength(this.titleMaxLength)]),
	});

	/** 2 values to pass to "submitted" component post-request */
	public errors: string[];
	public caseOpenData: CaseOpenData;

	private destroy$ = new Subject();
	private refreshProblemArea$ = new Subject<CaseRequestType>();
	private refreshSubtech$ = new Subject<string>();

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
		this.fetchTechList();
		this.subscribeSubtech();
		this.subscribeProblemArea();
		this.refreshProblemArea$.next(CaseRequestType.Diagnose);
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
	 * Send API request to open case
	 * When user clicks "Submit" button
	 */
	public submit () {
		this.submitting = true;
		const caseDetails: CaseOpenRequest = {
			contactId: this.profileService.getProfile().cpr.pf_auth_uid,
			customerActivity: _.get(this.caseForm.controls.problemArea.value, 'customerActivity'),
			description: this.caseForm.controls.description.value,
			deviceName: this.asset.deviceName,
			priority: this.caseForm.controls.severity.value,
			problemCode: _.get(this.caseForm.controls.problemArea.value, 'problemCode'),
			requestType: this.caseForm.controls.requestRma.value ?
				CaseRequestType.RMA : CaseRequestType.Diagnose,
			serialNumber: this.asset.serialNumber,
			softwareVersion: this.asset.osVersion,
			subTechId: _.get(this.caseForm.controls.subtech.value, '_id'),
			summary: this.caseForm.controls.title.value,
			techId: this.caseForm.controls.technology.value,
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
						_.get(this.caseForm.controls.problemArea.value, 'customerActivity'),
					description: this.caseForm.controls.description.value,
					problemArea:
						_.get(this.caseForm.controls.problemArea.value, 'problemCodeName'),
					requestRma: this.caseForm.controls.requestRma.value,
					severity: this.caseForm.controls.severity.value,
					severityName: _.get(_.find(this.sevOptions,
						{ value: this.caseForm.controls.severity.value }), 'name'),
					subtech: _.get(this.caseForm.controls.subtech.value, 'subTechName'),
					technology: _.get(_.find(this.techOptions,
						{ _id: this.caseForm.controls.technology.value }), 'techName'),
					title: this.caseForm.controls.title.value,
				};
			}
			this.submitted = true;
		});
	}

	/**
	 * Fetch select options for tech/problem area from APIs
	 */
	private fetchTechList () {
		this.loadingTech = true;
		this.caseService.fetchTechList()
			.pipe(
				catchError(err => {
					this.logger.error(`Fetch Tech :: Error ${err}`);

					return of(null);
				}),
				takeUntil(this.destroy$),
			)
			.subscribe(result => {
				this.loadingTech = false;
				this.techOptions = _.get(result, 'techList');
			});
	}

	/**
	 * Fetch subtech options for a particular tech
	 * @param techId tech id to fetch subtechs for
	 * @returns Observable with results
	 */
	private fetchSubtechList (techId: string): Observable<{ subTechList: Subtech[] }> {
		return this.caseService.fetchSubTechList(techId)
			.pipe(
				catchError(err => {
					this.logger.error(`Fetch Subtech :: Error ${err}`);

					return of(null);
				}),
			);
	}

	/**
	 * Subscribe and listen for tech to change, refresh subtech options
	 */
	private subscribeSubtech () {
		this.refreshSubtech$.pipe(
			tap(() => this.loadingSubtech = true),
			switchMap(techId => this.fetchSubtechList(techId)),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.loadingSubtech = false;
			this.subtechOptions = result.subTechList;
		});
		this.caseForm.controls.technology.valueChanges.pipe(
			tap(() => this.caseForm.controls.subtech.setValue(null)),
			takeUntil(this.destroy$),
		)
		.subscribe((techId: string) => {
			this.refreshSubtech$.next(techId);
		});
	}

	/**
	 * Listen for "Request RMA" change and update problem area options
	 */
	private subscribeProblemArea () {
		this.refreshProblemArea$.pipe(
			tap(() => this.loadingProblemAreas = true),
			switchMap(type => this.fetchProblemAreas(type)),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.loadingProblemAreas = false;
			// If a subtech is selected, filter the problemAreas to only valid ones for that subtech
			if (this.caseForm.controls.subtech.value) {
				const validCodes = this.caseForm.controls.subtech.value.problemCodes;
				result.problemArea.customerActivities =
					_.filter(result.problemArea.customerActivities, activity =>
						_.includes(validCodes, activity.problemCode),
					);
			}
			const problemAreasGrouped = _.groupBy(
				_.get(result, ['problemArea', 'customerActivities'], []),
				'customerActivity',
			);
			this.problemAreaOptions = Object.values(problemAreasGrouped);
			this.problemGroups = Object.keys(problemAreasGrouped);
		});
		// Listen for "requestType" or "subTech" to change, update problem areas.
		merge(
			this.caseForm.controls.requestRma.valueChanges,
			this.caseForm.controls.subtech.valueChanges.pipe(
				map(() => this.caseForm.controls.requestRma.value),
			),
		)
		.pipe(
			tap(() => this.caseForm.controls.problemArea.setValue(null)),
			takeUntil(this.destroy$),
		)
		.subscribe((rma: boolean) => {
			this.refreshProblemArea$.next(rma ? CaseRequestType.RMA : CaseRequestType.Diagnose);
		});
	}

	/**
	 * API request to get problem areas
	 * @param requestType fetch "diagnose" or "rma" problem areas
	 * @returns Observable with result
	 */
	private fetchProblemAreas (requestType: CaseRequestType) {
		return this.caseService.fetchProblemArea(requestType)
			.pipe(
				catchError(err => {
					this.logger.error(`Fetch Problem Area :: Error ${err}`);

					return of(null);
				}),
				takeUntil(this.destroy$),
			);
	}
}
