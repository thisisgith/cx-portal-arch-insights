import { Component, Inject } from '@angular/core';

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
	) { }
}
