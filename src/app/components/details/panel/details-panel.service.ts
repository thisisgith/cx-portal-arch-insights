import { Injectable } from '@angular/core';
import { Panel360 } from '@interfaces';
import * as _ from 'lodash-es';

// TODO: move this file to a different directory

@Injectable({
	providedIn: 'root',
})
export class DetailsPanelStackService {

	private panels: Panel360[];

	public push(panel: Panel360): void {
		this.panels.push(panel);
	}

	public pop(): Panel360 {
		const ret = this.panels.pop();
		ret.onPanelClose();

		return ret;
	}

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

	public canGoBack () {
		return _.size(this.panels) > 1;
	}

	constructor () {
		this.panels = [];
	}
}
