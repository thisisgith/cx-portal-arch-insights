import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CaseService } from '@cui-x/services';
import { Asset, CriticalBug, FieldNoticeBulletin, SecurityAdvisoryBulletin } from '@sdp-api';
import { CuiModalContent, CuiModalService } from '@cisco-ngx/cui-components';
import { LogService } from '@cisco-ngx/cui-services';
import { ProfileService } from '@cisco-ngx/cui-auth';
import { I18n } from '@cisco-ngx/cui-utils';
import { CaseRequestType, caseSeverities } from '@classes';
import { AdvisoryType, CaseOpenRequest, ProblemArea, Subtech, Tech } from '@interfaces';
import { CloseConfirmComponent } from '../close-confirm/close-confirm.component';
import { CaseNoteBuilder } from './case-note-builder';
import { Observable, Subject, of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CaseOpenData } from '../caseOpenData';

import * as _ from 'lodash-es';

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

	public data: { }; // Input data
	public caseForm = new FormGroup({
		description: new FormControl('', [Validators.required, Validators.maxLength(32000)]),
		problemArea: new FormControl(null, Validators.required),
		severity: new FormControl(3, Validators.required),
		subtech: new FormControl(null, Validators.required),
		technology: new FormControl(null, Validators.required),
		title: new FormControl('', [Validators.required, Validators.maxLength(255)]),
	});
	public severityName = caseSeverities[3].getCreateName();
	public submitting = false;
	public submitted = false;

	private noteBuilder = new CaseNoteBuilder();
	private note: string;

	private destroy$ = new Subject();

	constructor (
		private caseService: CaseService,
		public cuiModalService: CuiModalService,
		private logger: LogService,
		private profileService: ProfileService,
	) {
		this.logger.debug('CaseOpenAdvisoriesComponent Created!');
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
				_.get(this.advisory, 'bulletinTitle'),
			);
		} else {
			this.caseForm.controls.title.setValue(
				_.get(this.advisory, 'title'),
			);
		}
		this.note = this.noteBuilder.buildNote(this.type, this.advisory);
		this.caseForm.controls.description.setValue(
			this.note,
		);
		this.fetchTechList();
		this.subscribeSubtech();
		this.subscribeProblemArea();
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
	 * Send API request to open case
	 * When user clicks "Submit" button
	 */
	public submit () {
		this.submitting = true;
		const caseDetails: CaseOpenRequest = {
			contactId: this.profileService.getProfile().cpr.pf_auth_uid,
			customerActivity: _.get(this.caseForm.controls.problemArea.value, 'customerActivity'),
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
			problemCode: _.get(this.caseForm.controls.problemArea.value, 'problemCode'),
			requestType: CaseRequestType.Diagnose,
			serialNumber: this.allAssets[0].serialNumber,
			// serialNumber: '35641136A1621',
			softwareVersion: this.allAssets[0].osVersion,
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
					requestRma: false,
					severity: this.caseForm.controls.severity.value,
					severityName: caseSeverities[3].getCreateName(),
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
	 * Fetch list of CSOne Techs
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
	 * API request to get problem areas
	 * @param requestType fetch "diagnose" or "rma" problem areas
	 * @returns Observable with result
	 */
	private fetchProblemAreas () {
		return this.caseService.fetchProblemArea(CaseRequestType.Diagnose)
			.pipe(
				catchError(err => {
					this.logger.error(`Fetch Problem Area :: Error ${err}`);

					return of(null);
				}),
				takeUntil(this.destroy$),
			);
	}

	/**
	 * Subscribe and listen for tech to change, refresh subtech options
	 */
	private subscribeSubtech () {
		this.caseForm.controls.technology.valueChanges.pipe(
			tap(() => {
				this.loadingSubtech = true;
				this.caseForm.controls.subtech.setValue(null);
			}),
			switchMap(techId => this.fetchSubtechList(techId)),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.loadingSubtech = false;
			this.subtechOptions = result.subTechList;
		});
	}

	/**
	 * Subscribe and listen for subtech to change, refresh problemArea options
	 */
	private subscribeProblemArea () {
		this.caseForm.controls.subtech.valueChanges.pipe(
			tap(() => {
				this.loadingProblemAreas = true;
				this.caseForm.controls.problemArea.setValue(null);
			}),
			switchMap(() => this.fetchProblemAreas()),
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
	}
}
