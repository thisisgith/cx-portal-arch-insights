import { Component, Input, SimpleChanges } from '@angular/core';
import { CaseDetails } from '@cui-x/services';
import { RMAService } from '@services';
import { caseSeverities } from '@classes';
import * as _ from 'lodash-es';
import { Case, RMAResponse, RMARecord } from '@interfaces';
import { LogService } from '@cisco-ngx/cui-services';
import { switchMap, takeUntil, catchError } from 'rxjs/operators';
import { Observable, Subject, forkJoin, of } from 'rxjs';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { CSCUploadService, UploadFilesContent } from '@cui-x-views/csc';

/**
 * Case Details Header Component
 */
@Component({
	selector: 'app-case-details-header',
	styleUrls: ['./case-details-header.component.scss'],
	templateUrl: './case-details-header.component.html',
})
export class CaseDetailsHeaderComponent {
	@Input() public case: Case;
	@Input() public caseDetails: CaseDetails;
	public isAddNoteClicked = false;
	public isRMAClicked = false;
	public rmaRecords: RMARecord[] = [];
	public loading = true;
	private refreshRma$ = new Subject<string>();
	private destroy$ = new Subject();
	public rmaStrings: string[] = [];

	constructor (
		private rmaService: RMAService,
		private logger: LogService,
		private cuiModalService: CuiModalService,
		private cscService: CSCUploadService,
	) { }

	/**
	 * Initialization hook
	 */
	public ngOnInit () {
		// Refresh RMA Details for current case
		this.refreshRma$.pipe(
			switchMap(() => this.getRMADetails()),
			takeUntil(this.destroy$),
		)
			.subscribe(rmaDetails => {
				if (rmaDetails) {
					this.rmaRecords = _.filter(rmaDetails.map(details => _.get(
						details, ['returns', 'RmaRecord', 0]),
					));
				}
			});
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		if (this.case) {
			this.refreshRma$.next();
		}
	}

	/**
	 * getseverity color
	 * @param severity of the case
	 * @returns color for the severity
	 */
	public getSeverityColor (severity: string) {
		const severityInt = parseInt(severity, 10);

		return _.get(caseSeverities[severityInt], 'class');
	}

	/**
	 * toggles add note section
	 */
	public toggleAddNote () {
		this.isAddNoteClicked = !this.isAddNoteClicked;
		if (this.isAddNoteClicked) {
			this.isRMAClicked = false;
		}
	}

	/**
	 * toggles RMA list section
	 */
	public toggleRMAList () {
		this.isRMAClicked = !this.isRMAClicked;
		if (this.isRMAClicked) {
			this.isAddNoteClicked = false;
			if (this.rmaRecords.length < 1) {
				this.refreshRma$.next(_.get(this.caseDetails, 'rmaNumber'));
			}
		}
	}

	/**
	 * toggles add file section
	 */
	public toggleAddFile () {
		const data = _.cloneDeep(this.cscService.uploadDefaults);
		data.tacCaseNum = this.case.caseNumber; // data.tacCaseNum = '92511831';
		this.cuiModalService.showComponent(UploadFilesContent, { caseNum: data.tacCaseNum });
	}

	/**
	 * get RMA Details
	 * @param rmaNumbers comma separated string of related rma numbers (often just 1)
	 * @returns rma list
	 */
	public getRMADetails (): Observable<RMAResponse[]> {
		if (!this.rmaStrings || !this.rmaStrings.length) {
			return of(null);
		}

		const rmaCalls = this.rmaStrings.map(
			rmaNum => this.rmaService.getByNumber(rmaNum.trim())
				.pipe(
					catchError(err => {
						this.logger.error('case-details-header.component : getRmaDetails() ' +
							`:: Error : (${err.status}) ${err.message}`);

						const newRecord = { returns: { RmaRecord:
							[{ rmaNo: Number(rmaNum.trim()) }] } };
						return of(newRecord);
					}),
				),
		);

		return forkJoin(...rmaCalls);
	}

	/**
	 * Checks if our currently selected case has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		if (changes.case) {
			this.loading = true;
		}
		if (changes.caseDetails) {
			if (changes.caseDetails.currentValue) {
				this.loading = false;
				this.isAddNoteClicked = false;
				this.isRMAClicked = false;
			} else {
				this.loading = true;
			}
			this.rmaRecords = [];
			this.rmaStrings = [];
			const rmaNumbers = _.get(this.caseDetails, 'rmaNumber');
			if (rmaNumbers) {
				this.rmaStrings = rmaNumbers.split(',');
			}
		}
	}
}
