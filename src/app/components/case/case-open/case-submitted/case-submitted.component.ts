import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CuiModalService } from '@cisco-ngx/cui-components';
import { LogService } from '@cisco-ngx/cui-services';

import { Asset } from '@sdp-api';
import { CaseOpenData } from '../caseOpenData';

/**
 * Component to display view after a Case Open submit. Either with success message
 * and case info or error messages.
 */
@Component({
	selector: 'app-case-submitted',
	templateUrl: './case-submitted.component.html',
})
export class CaseSubmittedComponent {
	@Input() public errors: string[];
	@Input() public asset: Asset;
	@Input() public caseData: CaseOpenData;

	public requestRma = false;

	constructor (
		public cuiModalService: CuiModalService,
		private logger: LogService,
		private router: Router,
	) {
		this.logger.debug('CaseSubmittedComponent Created!');
	}

	/**
	 * Close modal
	 */
	public close () {
		this.cuiModalService.onCancel.next();
		this.cuiModalService.hide();
	}

	/**
	 * When user selects a "View Case" button, take them to the details
	 */
	public async onViewCase () {
		await this.router.navigate(['/solution/resolution'], {
			queryParams: { case: this.caseData.caseNum },
		});
		this.close();
	}
}