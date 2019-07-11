import {
	Component,
	EventEmitter,
	OnInit,
	OnDestroy,
	Input,
	Output,
	SimpleChanges,
} from '@angular/core';
import { CaseService, CaseDetails } from '@cui-x/services';
import { RMAService } from '@services';
import { CaseDetailsService } from 'src/app/services/case-details';
import { Subject, forkJoin, of } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import { tap, switchMap, takeUntil, catchError } from 'rxjs/operators';
import { Case } from '@interfaces';
import * as _ from 'lodash-es';

/**
 * Case Details Component
 */
@Component({
	selector: 'app-case-details',
	styleUrls: ['./case-details.component.scss'],
	templateUrl: './case-details.component.html',
})
export class CaseDetailsComponent implements OnInit, OnDestroy {
	@Input() public case: Case;
	@Input() public caseDetails: CaseDetails;
	@Output() public caseDetailsChange = new EventEmitter<CaseDetails>();
	public caseNotes: any[] = [];
	public item: any;
	public loading = false;
	public tabIndex = 0;
	private refresh$ = new Subject();
	private destroy$ = new Subject();

	constructor (
		private caseService: CaseService, private rmaService: RMAService,
		private caseDetailsService: CaseDetailsService, private logger: LogService,
	) { }

	/**
	 * Initialization hook
	 */
	public ngOnInit () {
		this.refresh$.pipe(
			tap(() => {
				this.loading = true;
				this.caseNotes = [];
			}),
			switchMap(() => forkJoin(
				this.getCaseDetails(),
				this.getCaseNotes(),
			)),
			takeUntil(this.destroy$),
		)
			.subscribe(results => {
				this.caseDetails = results[0];
				this.caseDetailsChange.emit(this.caseDetails);
				this.loading = false;
				this.caseNotes = results[1];
			});

		this.caseDetailsService.addNote$
			.subscribe((refresh: boolean) => {
				if (refresh) {
					this.logger.debug(`${refresh}`);
					this.loading = true;
					this.tabIndex = 1;
					this.getCaseNotes()
						.pipe(
							tap(() => {
								this.caseNotes = [];
							}),
							takeUntil(this.destroy$),
						)
						.subscribe(caseNotes => {
							this.caseNotes = caseNotes;
							this.loading = false;
						});
				}
			});
		this.refresh();

	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		if (this.case) {
			this.refresh$.next();
		}
	}

	/**
	 * getCaseDetails function
	 * @returns the case details
	 */
	public getCaseDetails () {
		return this.caseService.fetchCaseDetails(this.case.caseNumber)
			.pipe(
				catchError(err => {
					this.logger.error('casedetails.component : getCaseDetails() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);
	}

	/**
	 * fetches case notes
	 * @returns case notes
	 */
	public getCaseNotes () {
		return this.caseService.fetchCaseNotes(this.case.caseNumber, true)
			.pipe(
				catchError(err => {
					this.logger.error('casedetails.component : getCaseDetails() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Checks if our currently selected case has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentCase = _.get(changes, ['case', 'currentValue']);
		if (currentCase && !changes.case.firstChange) {
			this.refresh();
		}
	}
}
