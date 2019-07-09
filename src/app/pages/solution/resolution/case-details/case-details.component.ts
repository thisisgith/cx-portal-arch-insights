import { Component, OnInit } from '@angular/core';
import { CaseService, CaseDetails } from '@cui-x/services';
import { RMAService } from '@services';
import { CaseDetailsService } from 'src/app/services/case-details';
import { Subscription } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';

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
	public summaryLoading = false;
	public notesLoading = false;

	constructor (
		private caseService: CaseService, private rmaService: RMAService,
		private caseDetailsService: CaseDetailsService, private logger: LogService,
	) { }

	/**
	 * Initialization hook
	 */
	public ngOnInit () {
		this.subscription = this.caseDetailsService.addNote$
			.subscribe(item => {
				this.logger.debug(item);
				this.getCaseNotes();
			});
		this.getCaseDetails();
		this.getCaseNotes();
		// this.getRMADetails();
	}

	/**
	 * getCaseDetails function
	 * @returns the case details
	 */
	public getCaseDetails () {
		this.summaryLoading = true;
		return this.caseService.fetchCaseDetails('686569635')
			.subscribe(
				(response: any) => {
					this.summaryLoading = false;
					this.caseDetails = response;
				});
	}

	/**
	 * fetches case notes
	 * @returns case notes
	 */
	public getCaseNotes () {
		this.notesLoading = true;
		return this.caseService.fetchCaseNotes('686569635')
			.subscribe(
				(response: any) => {
					this.notesLoading = false;
					this.caseNotes = response;
				});
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
}
