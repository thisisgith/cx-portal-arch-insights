import { Component, Input } from '@angular/core';
import { CaseDetails } from '@cui-x/services';

/**
 * Case Details Summary Component
 */
@Component({
	selector: 'app-case-summary',
	styleUrls: ['./case-summary.component.scss'],
	templateUrl: './case-summary.component.html',
})

export class CaseSummaryComponent {
	@Input() public caseDetails: CaseDetails;
}
