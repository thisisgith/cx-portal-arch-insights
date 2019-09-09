import { Component, Input } from '@angular/core';

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

	/**
	 * close panel 360
	 */
	public onPanelClose () {
		this.selectedDevice = '';
	}
}
