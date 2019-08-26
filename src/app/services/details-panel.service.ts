import { Injectable } from '@angular/core';
import { Panel360 } from '@interfaces';
import * as _ from 'lodash-es';

/**
 * Service to maintain a stack of 360 panels
 */
@Injectable({
	providedIn: 'root',
})
export class DetailsPanelStackService {

	private panels: Panel360[];

	/**
	 * Pushes a 360 panel onto the panel stack
	 * @param panel the panel to add to the stack
	 */
	public push (panel: Panel360): void {
		this.panels.push(panel);
	}

	/**
	 * Pops and closes the top 360 panel from the stack
	 * @returns the panel being closed
	 */
	public pop (): Panel360 {
		const ret = this.panels.pop();
		ret.onPanelClose();

		return ret;
	}

	/**
	 * Closes all currently open 360 panels and resets the stack
	 * @param keepBottomPanel set to true to close all 360 panels except the bottom panel
	 */
	public reset (keepBottomPanel = false): void {
		const panelsToClose = keepBottomPanel ? _.slice(this.panels, 1) : this.panels;
		_.each(panelsToClose, (x: Panel360) => x.onPanelClose());

		const bottomPanel = _.get(this.panels, 0);
		if (keepBottomPanel && bottomPanel) {
			this.panels = [bottomPanel];
		} else {
			this.panels = [];
		}
	}

	/**
	 * Determines whether the 360 panel back action should be allowed
	 * @returns true if the back action should be allowed
	 */
	public canGoBack (): boolean {
		return _.size(this.panels) > 1;
	}

	constructor () {
		this.panels = [];
	}
}
