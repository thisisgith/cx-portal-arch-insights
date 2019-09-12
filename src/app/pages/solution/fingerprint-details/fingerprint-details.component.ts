import { Component, Input } from '@angular/core';
import { DetailsPanelStackService } from '@services';

/**
 * fingerprint-details Component
 */
@Component({
	selector: 'app-fingerprint-details',
	templateUrl: './fingerprint-details.component.html',
})
export class FingerprintDetailsComponent {

	@Input() public selectedDevice = '';
	public fullscreen = false;

	constructor (
		private detailsPanelStackService: DetailsPanelStackService,
	) { }
	/**
	 * close panel 360
	 */
	public onPanelClose () {
		this.detailsPanelStackService.reset();
		this.selectedDevice = '';
	}
}
