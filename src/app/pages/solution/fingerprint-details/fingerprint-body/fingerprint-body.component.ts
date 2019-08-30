import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import * as _ from 'lodash-es';
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
		const currentAsset = _.get(changes, ['asset', 'currentValue']);
		if (currentAsset) {
			this.selectedDevice = currentAsset.deviceId;
			this.selectedAsset = currentAsset;
			this.selectedDevices = {
				deviceId1: this.selectedDevice,
				productId1: currentAsset.productId,
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
