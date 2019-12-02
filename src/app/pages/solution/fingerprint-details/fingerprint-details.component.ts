import { Component, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { DetailsPanelStackService } from '@services';
import * as _ from 'lodash-es';

/**
 * fingerprint-details Component
 */
@Component({
	selector: 'app-fingerprint-details',
	templateUrl: './fingerprint-details.component.html',
})
export class FingerprintDetailsComponent implements OnChanges {

	@Input() public selectedSystem: any;
	@Output('close') public close = new EventEmitter<boolean>();
	public fullscreen = false;
	public showAssetDetailsView = false;

	constructor (
		private detailsPanelStackService: DetailsPanelStackService,
	) { }

	/**
	 * Update changes to selectedSystem
	 * @param changes data of OnChages Object
	 */
	public ngOnChanges (changes: SimpleChanges) {
		this.selectedSystem = _.get(changes, 'selectedSystem.currentValue', this.selectedSystem);
	}

	/**
	 * close panel 360
	 */
	public onPanelClose () {
		this.detailsPanelStackService.reset();
		this.selectedSystem = null;
		this.close.emit(true);
	}

	/**
	 * Handles the hidden event from details-panel
	 * @param hidden false if details slideout is open
	 */
	public handleHidden () {
		this.selectedSystem = null;
		this.onPanelClose();
		this.onAllPanelsClose();
	}

	/**
	 * Closes all 360 panels
	 */
	public onAllPanelsClose () {
		this.detailsPanelStackService.reset();
	}
}
