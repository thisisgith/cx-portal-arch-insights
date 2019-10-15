import { EventEmitter } from '@angular/core';

import { SETUP_STATES } from '@classes';

/**
 * Interface for all IE setup steps components to implement.
 * onStepComplete() fires when the step is done and the next one should be paged to.
 */
export interface SetupStep {
	goBack?: EventEmitter<number>;
	inputs?: object;
	ngOnChanges?: () => void;
	onStepComplete: EventEmitter<void | SetupComponent[]>;
	onStepCompleteInsert?: EventEmitter<OnStepCompleteInsertOptions>;
}

/**
 * Interface representing a setup page component that will be instantiated
 */
export interface SetupComponent {
	type: any;
	state: SETUP_STATES;
	inputs?: object;
}

/**
 * Interface representing inputs for the onStepCompleteInsert event handler
 */
export interface OnStepCompleteInsertOptions {
	steps: SetupComponent[];
	offset: number;
}
