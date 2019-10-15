import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SETUP_STATES } from '@classes';

import { OnStepCompleteInsertOptions, SetupComponent, SetupStep } from '@interfaces';

import { getButtonList } from './button-list.const';

import { getSlides } from './slide-getter.function';

import { Selection } from '../setup-ie.types';

/**
 * Component where user select's the setup instructions for their environment.
 * Outputs the correct set of instructions for the rest of the setup.
 */
@Component({
	selector: 'app-select-instructions',
	styleUrls: ['./select-instructions.component.scss'],
	templateUrl: './select-instructions.component.html',
})
export class SelectInstructionsComponent implements SetupStep {
	@Output() public onStepComplete = new EventEmitter<SetupComponent[]>();
	@Output() public onStepCompleteInsert = new EventEmitter<OnStepCompleteInsertOptions>();
	public buttons = getButtonList();

	constructor (
		private router: Router,
	) { }

	/**
	 * Called when an option is selected
	 * @param selection the button that was clicked
	 */
	public async onSelect (selection: Selection) {
		await this.router.navigate([], {
			queryParams: {
				ovaSelection: selection,
			},
			queryParamsHandling: 'merge',
			replaceUrl: true,
		});
		this.onStepCompleteInsert.emit({
			offset: 0,
			steps: [
				{
					state: SETUP_STATES.INSTALL,
					type: SelectInstructionsComponent,
				},
				...getSlides(selection),
			],
		});
	}
}
