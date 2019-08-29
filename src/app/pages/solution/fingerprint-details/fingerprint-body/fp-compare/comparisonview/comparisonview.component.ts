import { Component, Input, SimpleChanges } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { Icomparison, CrashPreventionService } from '@sdp-api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

/**
 * Comparisonview Component
 */
@Component({
	selector: 'app-comparisonview',
	styleUrls: ['./comparisonview.component.scss'],
	templateUrl: './comparisonview.component.html',
})
export class ComparisonviewComponent {
	@Input() public compareView: string;
	@Input() public deviceId1: string;
	@Input() public deviceId2: string;
	public customerId: string;
	private destroy$ = new Subject();
	public hardwaredetails: any;
	public hardwareData = null;
	public softwaredetails: any;
	public softwareData = null;
	public featuresdetails: any;
	public featuresData = null;
	public comparisonInfo: any;
	public initialLoading = false;

	constructor (
		private logger: LogService,
		public crashPreventionService: CrashPreventionService,
		private route: ActivatedRoute,
		) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}

	/**
	 * Initializer
	 */
	public ngOnInit () {
		this.initReqObj();
	}

	/**
	 * Initializer
	 */
	private initReqObj () {
		this.comparisonInfo = {
			customerId: this.customerId,
			deviceId1: this.deviceId1,
			deviceId2: this.deviceId2,
		};
	}

	/**
	 * Handle the cache
	 * @param changes containes changes details
	 */
	public ngOnChanges (changes: SimpleChanges): void {
		if (changes.compareView !== undefined) {
			this.compareView = changes.compareView.currentValue;
		}
		if (changes.deviceId1 !== undefined) {
			this.deviceId1 = changes.deviceId1.currentValue;
		}
		if (changes.deviceId2 !== undefined) {
			this.deviceId2 = changes.deviceId2.currentValue;
		}
		this.loadData();
		this.logger.info(JSON.stringify(changes));
	}

	/**
	 * invoke getComparison
	 */
	public loadData () {
		this.initialLoading = true;
		this.initReqObj();
		this.crashPreventionService.getComparison(this.comparisonInfo)
			.pipe(takeUntil(this.destroy$))
			.subscribe((results: Icomparison) => {
				this.hardwareData = results.hardware;
				this.softwareData = results.software;
				this.featuresData = results.feature;
				this.logger.info(JSON.stringify(results));
				this.initialLoading = false;
			});
	}
}
