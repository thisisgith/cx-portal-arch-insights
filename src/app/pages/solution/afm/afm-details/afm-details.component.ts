import { Component, Input, Output, EventEmitter } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { Alarm, AfmSearchParams, AfmService } from '@sdp-api';

/**
 * Afm details panal header
 */
@Component({
	selector: 'afm-details',
	styleUrls: ['./afm-details.component.scss'],
	templateUrl: './afm-details.component.html',
})
export class AfmDetailsComponent {

	private searchParams: AfmSearchParams;
	private ignoreToggled = false;
	public ignoreStatus: string;

	@Input('alarm') public alarm: Alarm;
	@Output()
	public selectedAsset = new EventEmitter();

	constructor (
		private logger: LogService, private afmService: AfmService,
	) {
		this.logger.debug('AFM Detaisls Component Created!');
		this.searchParams = new Object();
	}

	/**
	 * which will call asset details componet
	 * @param alarm -- alarm info
	 * @memberof AfmComponent
	 */
	public connectToAssetDetails (alarm: Alarm) {
		this.selectedAsset.emit(alarm);
	}

	/**
	 * Toggle Ignore event and revert Ignore Event
	 * @param alarmData Alarm
	 */
	public toggleEvent (alarmData: Alarm) {
		this.searchParams.customerId = alarmData.customerId;
		this.searchParams.faultIC = alarmData.faultIC;
		if (!this.ignoreToggled) {
			this.afmService.ignoreEvent(this.searchParams)
				.subscribe(response => {
					this.ignoreStatus = response.statusMessage;
					this.ignoreToggled = true;
				});
		} else {
			this.afmService.revertIgnoreEvent(this.searchParams)
				.subscribe(response => {
					this.ignoreStatus = response.statusMessage;
					this.ignoreToggled = false;
				});
		}
	}
}
