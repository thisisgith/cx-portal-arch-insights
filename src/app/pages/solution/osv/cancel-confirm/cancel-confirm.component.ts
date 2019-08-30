import { Component } from '@angular/core';
import { CuiModalService } from '@cisco-ngx/cui-components';

/**
 * Component for user to confirm if they want to cancel the accepted recommendation
 */
@Component({
	selector: 'app-cancel-confirm',
	templateUrl: './cancel-confirm.component.html',
})
export class CancelConfirmComponent {

	constructor (
		private cuiModalService: CuiModalService,
	) { }

	/**
	 * Cancel the modal and delete all components
	 * when the user confirms to Cancel or clicks the 'X'
	 */
	public close () {
		this.cuiModalService.onCancel.next();
		this.cuiModalService.hide();
	}

	/**
	 * Go back to previous component.
	 * When the user chooses to continue case open.
	 */
	public back () {
		this.cuiModalService.pop({ });
	}
}
