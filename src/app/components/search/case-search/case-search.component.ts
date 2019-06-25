import { Component, Input, OnInit, OnDestroy, OnChanges,
	Output, EventEmitter, ViewChild, TemplateRef, forwardRef } from '@angular/core';
import { FromNowPipe } from '@cisco-ngx/cui-pipes';
import { CaseService } from '@cui-x/services';
import { InventoryService, HardwareResponse } from '@cui-x/sdp-api';
import { Case, Note, SearchContext } from '@interfaces';
import { LogService } from '@cisco-ngx/cui-services';
import { Subject, of, Observable } from 'rxjs';
import { tap, takeUntil, switchMap, catchError } from 'rxjs/operators';
import { SpecialSearchComponent } from '../special-search/special-search.component';

import * as _ from 'lodash-es';

/**
 * Component representing case number search results on the search modal.
 */
@Component({
	providers: [{
		provide: SpecialSearchComponent,
		useExisting: forwardRef(() => CaseSearchComponent,
	)}],
	selector: 'app-case-search',
	styleUrls: ['./case-search.component.scss'],
	templateUrl: './case-search.component.html',
})
export class CaseSearchComponent extends SpecialSearchComponent
implements OnInit, OnDestroy, OnChanges {
	@ViewChild('sidebar', { static: true, read: TemplateRef })
	public sidebarContent: TemplateRef<any>;
	@Input('caseNumber') public caseNumber: string;
	@Output('hide') public hide = new EventEmitter<boolean>();
	/** Emitter to show or hide general search */
	@Output('toggleGeneralSearch') public toggleGeneralSearch = new EventEmitter<{
		hide: boolean,
		searchString?: string,
		context?: SearchContext,
	}>();

	/** Text to use in place of unavailable fields. */
	public DEFAULT_FIELD = 'NA';
	/** Maximum length of a note to display before truncating. */
	public NOTE_TRUNCATE_LENGTH = 256;
	/** Mock fields for the call to the SDP InventoryService API. */
	private customerId = '2431199';
	private serialNumber = 'FOX1306GFKH';
	/** Whether each of the API requests are still loading (used for displaying HTML). */
	public detailsLoading = true;
	public hardwareLoading = true;
	public notesLoading = true;
	public summaryLoading = true;

	/** Observable used to begin searches. */
	private refresh$ = new Subject();
	/** Observable used to unsubscribe from search observables when the component is closed. */
	private destroy$ = new Subject();
	/** Observable used to emit the serial number associated with a case to the general search. */
	private serialNumber$ = new Subject<string>();

	/** Case-related fields for displaying in HTML. */
	public case = <Case> { };
	public lastNote: Note;
	public lastUpdated: string;
	public truncateLastNote: boolean;
	public showTruncateToggle: boolean;

	constructor (
		private logger: LogService,
		private caseService: CaseService,
		private inventoryService: InventoryService,
	) {
		super();
		this.logger.debug('caseSearchComponent Created!');
	}

	/**
	 * OnInit lifecycle hook.
	 */
	public ngOnInit () {
		// Set up pipes:
		// Case Details
		this.refresh$.pipe(
			tap(() => {
				this.toggleGeneralSearch.emit({ hide: true });
				this.detailsLoading = this.hardwareLoading = true;
				this.hide.emit(false);
			}),
			switchMap(() => this.getCaseDetails(this.caseNumber)),
			takeUntil(this.destroy$),
		)
		.subscribe(caseDetails => {
			if (caseDetails && caseDetails.caseNumber) {
				this.setCaseDetails(caseDetails);
				this.detailsLoading = false;
				this.toggleGeneralSearch.emit({
					context: SearchContext.serialno,
					hide: false,
					searchString: this.case.serialNumber,
				});
			} else {
				this.hide.emit(true);
				this.toggleGeneralSearch.emit({ hide: false });
			}
		});
		// Case Notes
		this.refresh$.pipe(
			tap(() => this.notesLoading = true),
			switchMap(() => this.getCaseNotes(this.caseNumber)),
			takeUntil(this.destroy$),
		)
		.subscribe(noteList => {
			this.setCaseNotes(noteList);
			this.notesLoading = false;
		});
		// Case Summary
		this.refresh$.pipe(
			tap(() => this.summaryLoading = true),
			switchMap(() => this.getCaseSummary(this.caseNumber)),
			takeUntil(this.destroy$),
		)
		.subscribe(caseSummary => {
			this.case.tacEngineer = _.get(caseSummary, ['content', 0, 'caseOwner']) ||
										this.DEFAULT_FIELD;
			this.summaryLoading = false;
		});
		// Hardware - Tied to serial number from Case Details
		this.serialNumber$.pipe(
			switchMap(() => this.getHardware(this.customerId, this.serialNumber)),
			takeUntil(this.destroy$),
		)
		.subscribe(hardware => {
			this.case.hostName = _.get(hardware, ['data', 0, 'hostname']) ||
									this.DEFAULT_FIELD;
			this.hardwareLoading = false;
		});

		// Begin pipes
		this.refresh$.next();
	}

	/**
	 * OnDestroy lifecycle hook.
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * On changes lifecycle hook.
	 * Send another request whenever the query term changes.
	 */
	public ngOnChanges () {
		this.refresh$.next();
	}

	/**
	 * Call CSOne's getCaseDetails() to get most of the case information.
	 * @param caseNumber Case number to fetch details for.
	 * @returns Observable with response data.
	 */
	public getCaseDetails (caseNumber: string): Observable<any> {
		return this.caseService.fetchCaseDetails(caseNumber)
		.pipe(
			catchError(err => {
				this.logger.error(`Case Details :: ${caseNumber} :: Error ${JSON.stringify(err)}`);

				return of(null);
			}),
		);
	}

	/**
	 * Sets fields in the component's case object using the result from getCaseDetails().
	 * Gets the serial number associated with the case which is used to trigger
	 * the subscription in getHardwareResponse() and the general search component.
	 * @param caseDetails Case details to set in the component's case object.
	 */
	public setCaseDetails (caseDetails: any) {
		this.case.contract = caseDetails.contractId || this.DEFAULT_FIELD;
		this.case.description = caseDetails.description || this.DEFAULT_FIELD;
		this.case.number = caseDetails.caseNumber || this.DEFAULT_FIELD;
		this.case.opened = caseDetails.createdDate || this.DEFAULT_FIELD;
		if (caseDetails.ownerName) {
			this.case.owner = caseDetails.ownerName;
			if (caseDetails.ownerEmail) {
				this.case.owner += ` (${caseDetails.ownerEmail})`;
			}
		} else {
			this.case.owner = caseDetails.ownerEmail || this.DEFAULT_FIELD;
		}
		if (caseDetails.rmaNumber) {
			this.case.relatedRmas = caseDetails.rmaNumber.split(',')
			.map(rmaNumber => rmaNumber.trim());
		}
		if (caseDetails.serialNumber) {
			this.case.serialNumber = caseDetails.serialNumber;
			// Emit serial number to trigger SDP hardware API call & general search
			this.serialNumber$.next(this.case.serialNumber);
		} else {
			this.case.serialNumber = this.DEFAULT_FIELD;
		}
		this.case.severity = caseDetails.priority || this.DEFAULT_FIELD;
		this.case.status = caseDetails.status || this.DEFAULT_FIELD;
		this.case.summary = caseDetails.summary || this.DEFAULT_FIELD;
		if (this.case.description === this.DEFAULT_FIELD) {
			const splitSummary = this.case.summary.split(' ');
			if (splitSummary.length <= 10) {
				this.case.description = this.case.summary;
			} else {
				this.case.description = splitSummary
				.slice(0, 10)
				.join(' ');
			}
		}
		this.case.trackingNumber = caseDetails.trackingNumber || this.DEFAULT_FIELD;
	}
	/**
	 * Call CSOne's fetchCaseNotes() to get the notes associated with the case.
	 * @param caseNumber Case number to fetch notes for.
	 * @returns Observable with response data.
	 */
	 public getCaseNotes (caseNumber: string): Observable<Note[]> {
		return this.caseService.fetchCaseNotes(this.caseNumber)
		.pipe(
			catchError(err => {
				this.logger.error(`Case Notes :: ${caseNumber} :: Error ${JSON.stringify(err)}`);

				return of(null);
			}),
		);
	}

	/**
	 * Sets the noteList in the component's case object using the result from getCaseNotes().
	 * @param noteList Case notes to set in the component's case object.
	 */
	 public setCaseNotes (noteList: Note[]) {
		if (_.has(noteList, '[0]')) {
			this.case.noteList = noteList;
			let lastDate = 0;
			this.case.noteList.forEach(note => {
				const date = Date.parse(note.createdDate);
				if (!isNaN(date) && date > lastDate) {
					lastDate = date;
					this.lastNote = note;
				}
			});
		}
		if (this.lastNote) {
			this.truncateLastNote = this.lastNote.noteDetail.length > this.NOTE_TRUNCATE_LENGTH;
			const fromNowPipe = new FromNowPipe();
			this.lastUpdated = fromNowPipe.transform(this.lastNote.createdDate);
		} else {
			this.lastNote = <Note> {
				createdDate: this.DEFAULT_FIELD,
				noteDetail: this.DEFAULT_FIELD,
			};
			this.truncateLastNote = false;
			this.lastUpdated = this.DEFAULT_FIELD;
		}
		this.showTruncateToggle = this.truncateLastNote;
	}

	/**
	 * Call CSOne's getSummary() to get the summary containing the case's TAC Engineer.
	 * @param caseNumber Case number to fetch summary for.
	 * @returns Observable with response data.
	 */
	public getCaseSummary (caseNumber: string): Observable<any> {
		return this.caseService.read({
			nocache: Date.now(),
			page: 0,
			search: caseNumber,
			size: 1,
			sort: 'caseNumber,ASC',
		})
		.pipe(
			catchError(err => {
				this.logger.error(`Case Summary :: ${caseNumber} :: Error ${JSON.stringify(err)}`);

				return of(null);
			}),
		);
	}

	/**
	 * Call SDP's getHardware() to get the hostName associated with the case.
	 * @param customerId Cisco customer ID associated with the case.
	 * @param serialNumber Serial number associated with the case.
	 * @returns Observable with response data.
	 */
	 public getHardware (customerId: string, serialNumber: string):
	 							Observable<HardwareResponse> {
		return this.inventoryService.getHardware({
			customerId: this.customerId,
			serialNumber: [this.serialNumber],
		})
		.pipe(
			catchError(err => {
				this.logger.error(`Case Hardware :: Customer ${customerId} & \
				Serial Number ${serialNumber} :: Error ${JSON.stringify(err)}`);

				return of(null);
			}),
		);
	}
}
