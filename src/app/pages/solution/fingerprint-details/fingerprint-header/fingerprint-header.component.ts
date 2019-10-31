import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { CrashPreventionService, IDeviceInfo, RacetrackSolution, RacetrackTechnology } from '@sdp-api';

import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { RacetrackInfoService } from '@services';

/**
 * fingerprint-header Component
 */
@Component({
	selector: 'app-fingerprint-header',
	styleUrls: ['./fingerprint-header.component.scss'],
	templateUrl: './fingerprint-header.component.html',
})
export class FingerprintHeaderComponent implements  OnChanges {

	@Input() public asset: any;
	public deviceDetails: CrashPreventionService.GetDeviceParams;
	public deviceData: any = [];
	public riskScore: any;
	private destroy$ = new Subject();
	public customerId: string;
	public productFamily: string;
	public productId: string;
	public softwareVersion: string;
	public softwareType: string;
	public globalRiskRank: string;
	public deviceName: string;
	public deviceId: string;
	public serialNumber: any;
	public ipAddress: any;

	constructor (
		private logger: LogService,
		public crashPreventionService: CrashPreventionService,
		private route: ActivatedRoute,
		private racetrackInfoService: RacetrackInfoService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.deviceDetails = {
			customerId: this.customerId,
			deviceId: this.asset,
		};
	}

	/**
	 * Fetches the device information Assets360 header view
	 * @returns the total crash history of particular device
	 */
	private loadDeviceInfo () {
		this.crashPreventionService.getDeviceInfo(this.deviceDetails)
			.subscribe((results: IDeviceInfo) => {
				this.logger.debug(JSON.stringify(results));
				this.deviceData = results;
				this.riskScore = Math.round(results.riskScore)
				.toString();
			});
	}

	/**
	 * deviceId
	 * @param changes loadDeviceInfo
	 */
	public ngOnChanges (changes: SimpleChanges): void {
		if (changes.asset) {
			 this.deviceDetails.deviceId = changes.asset.currentValue.deviceId;
			 this.racetrackInfoService.getCurrentSolution()
			 .pipe(
				 takeUntil(this.destroy$),
			 )
			 .subscribe((solution: RacetrackSolution) => {
				 this.deviceDetails.solution = _.get(solution, 'name');
			 });

			 this.racetrackInfoService.getCurrentTechnology()
			 .pipe(
				 takeUntil(this.destroy$),
			 )
			 .subscribe((technology: RacetrackTechnology) => {
				 this.deviceDetails.useCase = _.get(technology, 'name');
			 });
			 this.loadDeviceInfo();
		}
	}
}
