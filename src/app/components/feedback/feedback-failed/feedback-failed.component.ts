import { Component } from '@angular/core';
import { CuiModalContent, CuiModalService } from '@cisco-ngx/cui-components';

/**
 * Modal for feedback that failed to be send
 */
@Component({
	selector: 'app-feedback-failed',
	styleUrls: ['../feedback.component.scss'],
	templateUrl: './feedback-failed.component.html',
})
export class FeedbackFailedComponent implements CuiModalContent {
	public data = { };

	constructor (
		public cuiModalService: CuiModalService,
	) { }

	/**
	 * Cancels the modal
	 */
	public cancelModal () {
		this.cuiModalService.onCancel.emit();
		this.cuiModalService.hide();
	}

}
