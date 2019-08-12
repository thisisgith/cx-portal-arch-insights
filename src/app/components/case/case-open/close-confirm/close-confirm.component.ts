import { Component } from '@angular/core';
import { CuiModalService } from '@cisco-ngx/cui-components';

/**
 * Component for user to confirm if they want to close the case open modal or go back
 */
@Component({
	selector: 'app-close-confirm',
	templateUrl: './close-confirm.component.html',
})
export class CloseConfirmComponent {

	constructor (
		private cuiModalService: CuiModalService,
	) { }

	/**
	 * Close the modal and delete all components
	 * when the user confirms to close or clicks the 'X'
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
