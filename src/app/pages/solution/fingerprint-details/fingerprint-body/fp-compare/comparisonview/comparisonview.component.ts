import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { Icomparison, CrashPreventionService } from '@sdp-api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';

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
	@Input() public deviceA: any;
	@Input() public deviceB: any;
	public deviceId1: string;
	public deviceId2: string;
	public customerId: string;
	private destroy$ = new Subject();
	public softwaredetails: any;
	public softwareData = null;
	public featuresdetails: any;
	public featuresData = null;
	public comparisonInfo: any;
	public compareviewLoading = false;
	@Output() public reqError: EventEmitter<any> = new EventEmitter<any>();
	public showAssetDetailsView = false;
	public selectedAsset:any;

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
			deviceId1: this.deviceA.deviceId,
			deviceId2: this.deviceB.deviceId,
		};
	}

	/**
	 * Handle the cache
	 * @param changes containes changes details
	 */
	public ngOnChanges (changes: SimpleChanges): void {
		this.compareView = _.get(changes, ['compareView', 'currentValue'], this.compareView);
		this.deviceA = _.get(changes, ['deviceA', 'currentValue'], this.deviceId1);
		this.deviceB = _.get(changes, ['deviceB', 'currentValue'], this.deviceId2);
		if (_.get(changes, ['deviceA', 'currentValue'], false) ||
		 _.get(changes, ['deviceB', 'currentValue'], false)) {
			this.loadData();
		}
		this.logger.info(JSON.stringify(changes));
	}

	/**
	 * invoke getComparison
	 */
	public loadData () {
		this.compareviewLoading = true;
		this.initReqObj();
		this.crashPreventionService.getComparison(this.comparisonInfo)
			.pipe(takeUntil(this.destroy$))
			.subscribe((results: Icomparison) => {
				this.softwareData = results.software;
				this.featuresData = results.feature;
				this.compareviewLoading = false;
				this.reqError.emit();
			},
			err => {
				this.compareviewLoading = false;
				this.softwareData = null;
				this.featuresData = null;
				this.reqError.emit(I18n.get('_CP_Compare_Assets_Error_'));
				this.logger.error(err);
			},
			);
	}

	public showAssetDetails(selectedAsset){
		this.selectedAsset = selectedAsset;
		this.showAssetDetailsView = true;
	}
}
