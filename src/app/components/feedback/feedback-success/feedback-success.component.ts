import { Component } from '@angular/core';
import { CuiModalContent, CuiModalService } from '@cisco-ngx/cui-components';

/**
 * Modal for feedback that's successfully send
 */
@Component({
	selector: 'app-feedback-success',
	styleUrls: ['../feedback.component.scss'],
	templateUrl: './feedback-success.component.html',
})
export class FeedbackSuccessComponent implements CuiModalContent {
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
