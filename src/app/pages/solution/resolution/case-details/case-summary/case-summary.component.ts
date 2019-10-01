import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Case Details Summary Component
 */
@Component({
	selector: 'app-case-summary',
	styleUrls: ['./case-summary.component.scss'],
	templateUrl: './case-summary.component.html',
})

export class CaseSummaryComponent {
	@Input() public caseDetails: any;
	@Output() public showAssetDetails: EventEmitter<{ }> = new EventEmitter<{ }>();

	/**
	 * Used for Opening the Asset 360 View the data
	 */
	public openAssetDetailsView () {
		if (this.caseDetails && this.caseDetails.serialNumber) {
			this.showAssetDetails.emit({ serialNumber: this.caseDetails.serialNumber });
		}
	}
}
