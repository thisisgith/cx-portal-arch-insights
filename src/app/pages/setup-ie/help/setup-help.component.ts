import { Component, Inject } from '@angular/core';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { ContactSupportComponent } from '@components';

/**
 * Setup Help Component
 */
@Component({
	selector: 'setup-help',
	styleUrls: ['./setup-help.component.scss'],
	templateUrl: './setup-help.component.html',
})
export class SetupHelpComponent {
	constructor (
		@Inject('ENVIRONMENT') public env,
		private cuiModalService: CuiModalService,
	) { }

	/**
	 * Opens the contact support modal
	 */
	public openContactSupport () {
		this.cuiModalService.showComponent(ContactSupportComponent, { });
	}
}
