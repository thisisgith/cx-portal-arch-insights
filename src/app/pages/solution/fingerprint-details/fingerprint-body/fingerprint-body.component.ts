import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { ActivatedRoute } from '@angular/router';
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

	public tabIndex = 0;
	@Input() public asset: any;
	public selectedDevices: any;

	public selectedDevice: string;
	public selectedAsset: any;
	public alertFPCompare: any = { };
	public alertFPSimilarAssets: any = { };
	public alertFPIntelligence: any = { };
	public alertMlVisualization: any = { };
	public cxLevel: number;

	constructor (
		private logger: LogService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.cxLevel = _.get(user, ['service', 'cxLevel'], 0);
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
				productFamily1: currentAsset.productFamily,
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
