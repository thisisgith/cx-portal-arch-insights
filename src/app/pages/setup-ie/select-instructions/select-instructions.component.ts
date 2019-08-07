import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LogService } from '@cisco-ngx/cui-services';

import { SetupComponent, SetupStep } from '@interfaces';

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
	public buttons = getButtonList();

	constructor (
		private logger: LogService,
		private route: ActivatedRoute,
		private router: Router,
	) {
		this.logger.debug('SelectInstructionsComponent Created!');
	}

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
		this.onStepComplete.emit(getSlides(selection));
	}
}
