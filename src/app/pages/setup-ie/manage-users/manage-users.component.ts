import { Component, EventEmitter, Output } from '@angular/core';
import { SetupStep } from '@interfaces';

/**
 * ManageUsersComponent
 */
@Component({
	selector: 'manage-users',
	templateUrl: './manage-users.component.html',
})
export class ManageUsersComponent implements SetupStep {
	@Output('onStepComplete') public onStepComplete = new EventEmitter<void>();

	/**
	 * Continues to next step
	 */
	public continue () {
		this.onStepComplete.next();
	}
}
