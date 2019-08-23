import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * fingerprint-body Component
 */
@Component({
	selector: 'app-fingerprint-body',
	styleUrls: ['./fingerprint-body.component.scss'],
	templateUrl: './fingerprint-body.component.html',
})
export class FingerprintBodyComponent implements OnChanges {

	public tabIndex = 2;
	public selectedDevices: any;
	@Input() public asset: any;
	public selectedDevice: string;
	public selectedAsset: any;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('FingerprintBodyComponent Created!');
	}
	/**
	 * SimpleChanges
	 * @param changes selectedDevices
	 */
	public ngOnChanges (changes: SimpleChanges): void {
		if (changes.asset) {
			this.selectedDevice = changes.asset.currentValue.deviceId;
			this.selectedAsset = changes.asset.currentValue;
			this.selectedDevices = {
				deviceId1: this.selectedDevice,
				productId1: changes.asset.currentValue.productId,
			};
		}
	}
	/**
	 * slectedDevice
	 * @param event sshowComparison
	 */
	public showComparison (event) {
		this.tabIndex = 2;
		this.selectedDevices = event;
	}
}
