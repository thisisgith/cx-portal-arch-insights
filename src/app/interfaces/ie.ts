import { EventEmitter } from '@angular/core';

import { SETUP_STATES } from '@classes';

/**
 * Interface for all IE setup steps components to implement.
 * onStepComplete() fires when the step is done and the next one should be paged to.
 */
export interface SetupStep {
	inputs?: object;
	onStepComplete: EventEmitter<void | SetupComponent[]>;
	ngOnChanges?: () => void;
}

/**
 * Interface representing a setup page component that will be instantiated
 */
export interface SetupComponent {
	type: any;
	state: SETUP_STATES;
	inputs?: object;
}
