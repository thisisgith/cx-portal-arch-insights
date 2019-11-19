import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { Icomparison, CrashPreventionService, RacetrackSolution, RacetrackTechnology } from '@sdp-api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';
import { RacetrackInfoService, AssetPanelLinkService } from '@services';
import { AssetLinkInfo } from '@interfaces';

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
	public selectedAsset: any;
	private selectedSolutionName: string;
	private selectedTechnologyName: string;
	public assetParams: any;
	public assetLinkInfo: AssetLinkInfo = Object.create({ });

	constructor (
		private logger: LogService,
		private assetPanelLinkService: AssetPanelLinkService,
		public crashPreventionService: CrashPreventionService,
		private route: ActivatedRoute,
		private racetrackInfoService: RacetrackInfoService,
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
			deviceId1: _.get(this.deviceA, 'deviceId', null),
			deviceId2: _.get(this.deviceB, 'deviceId', null),
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		};
	}

	/**
	 * Handle the cache
	 * @param changes containes changes details
	 */
	public ngOnChanges (changes: SimpleChanges): void {
		this.compareView = _.get(changes, ['compareView', 'currentValue'], this.compareView);
		this.deviceA = _.get(changes, ['deviceA', 'currentValue'], this.deviceA);
		this.deviceB = _.get(changes, ['deviceB', 'currentValue'], this.deviceB);
		this.racetrackInfoService.getCurrentSolution()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((solution: RacetrackSolution) => {
			this.selectedSolutionName = _.get(solution, 'name');
		});

		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((technology: RacetrackTechnology) => {
			this.selectedTechnologyName = _.get(technology, 'name');
		});
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
	/**
	 * showAssetDetails
	 * @param selectedAsset selectAsset
	 * @returns assetPanelLinkService
	 */
	public showAssetDetails (selectedAsset) {
		this.showAssetDetailsView = true;
		this.assetParams = {
			customerId: this.customerId,
			serialNumber: [selectedAsset.serialNumber],
		};

		return this.assetPanelLinkService.getAssetLinkData(this.assetParams)
		.subscribe(response => {
			this.assetLinkInfo.asset = _.get(response, [0, 'data', 0]);
			this.assetLinkInfo.element = _.get(response, [1, 'data', 0]);
		});
	}
}
