import { Component, OnInit } from '@angular/core';
import { CaseService, CaseDetails } from '@cui-x/services';
import { RMAService } from '@services';
import { CaseDetailsService } from 'src/app/services/case-details';
import { Subscription, Subject, forkJoin } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import { tap, switchMap, takeUntil } from 'rxjs/operators';

/**
 * Case Details Component
 */
@Component({
	selector: 'app-case-details',
	styleUrls: ['./case-details.component.scss'],
	templateUrl: './case-details.component.html',
})
export class CaseDetailsComponent implements OnInit {

	public caseDetails: CaseDetails;
	public caseNotes: any[] = [];
	public item: any;
	public subscription: Subscription;
	public loading = false;
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
		this.subscription = this.caseDetailsService.addNote$
			.subscribe((refresh: boolean) => {
				if (refresh) {
					this.logger.debug(`${refresh}`);
					this.getCaseNotes();
				}
			});
		this.refresh$.pipe(
			tap(() => {
				this.loading = true;
			}),
			switchMap(() => forkJoin(
				this.getCaseDetails(),
				this.getCaseNotes(),
			)),
			takeUntil(this.destroy$),
		)
			.subscribe(results => {
				this.caseDetails = results[0];
				this.caseNotes = results[1];
				this.loading = false;
			});
		this.refresh$.next();
	}

	/**
	 * getCaseDetails function
	 * @returns the case details
	 */
	public getCaseDetails () {
		return this.caseService.fetchCaseDetails('686569635');
	}

	/**
	 * fetches case notes
	 * @returns case notes
	 */
	public getCaseNotes () {
		return this.caseService.fetchCaseNotes('686569635');
	}

	/**
	 * gets severity color code
	 * @param severity of the case
	 * @returns color for the severity
	 */
	public getSeverityColor (severity: string) {
		switch (severity) {
			case '1': return 'red';
				break;
			case '2': return 'orange';
				break;
			case '3': return 'yellow';
				break;
			case '4': return 'blue';
				break;
		}
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
