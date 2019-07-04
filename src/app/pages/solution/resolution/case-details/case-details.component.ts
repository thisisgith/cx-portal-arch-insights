import { Component, OnInit } from '@angular/core';
import { CaseService, CaseDetails } from '@cui-x/services';

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

	constructor (
		private caseService: CaseService,
	) { }

	/**
	 * Initialization hook
	 */
	public ngOnInit () {
		this.getCaseDetails();
	}

	/**
	 * getCaseDetails function
	 * @returns the case details
	 */
	public getCaseDetails () {
		return this.caseService.fetchCaseDetails('688296392')
			.subscribe(
				(response: any) => {
					this.caseDetails = response.responseDetails.caseDetail;
				});
	}
}
