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
					if (response.responseDetails) {
						this.caseDetails = response.responseDetails.caseDetail;
					}
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
