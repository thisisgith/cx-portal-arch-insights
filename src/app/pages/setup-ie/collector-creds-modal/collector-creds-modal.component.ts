import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CuiModalService } from '@cisco-ngx/cui-components';

import { RegisterCollectorService } from '../register-collector/register-collector.service';
import { SetupIEStateService } from '../setup-ie-state.service';

import { empty, Subject } from 'rxjs';
import { catchError, mergeMap, takeUntil } from 'rxjs/operators';

/**
 * Component for user to confirm if they want to close the case open modal or go back
 */
@Component({
	selector: 'collector-creds-modal',
	templateUrl: './collector-creds-modal.component.html',
})
export class CollectorCredsModalComponent {
	public error: boolean;
	public credsForm: FormGroup = new FormGroup({
		password: new FormControl(null, Validators.required),
		userId: new FormControl('cxcadmin', Validators.required),
	});
	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		public cuiModalService: CuiModalService,
		private registerService: RegisterCollectorService,
		private state: SetupIEStateService,
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
	 * Saves the credentials and closes the modal
	 */
	public continue () {
		this.registerService
			.getAuthToken({
				password: this.credsForm.get('password').value,
				userId: this.credsForm.get('userId').value,
			})
			.pipe(
				mergeMap(response => {
					const state = this.state.getState() || { };
					state.collectorToken = response;
					this.state.setState(state);

					return response;
				}),
				catchError(() => {
					this.error = true;

					return empty();
				}),
				takeUntil(this.destroyed$),
			)
			.subscribe(() => {
				this.close();
			});
	}
}
