import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	TemplateRef,
	ViewChild,
} from '@angular/core';
import {
	HardwareInfo,
	ContractsService,
	CoverageInfo,
	ProductAlertsService,
	HardwareEOLResponse,
	HardwareEOL,
	HardwareEOLBulletinResponse,
	HardwareEOLBulletin,
	InventoryService,
	Asset,
} from '@sdp-api';
import { CaseParams, CaseService } from '@cui-x/services';

import { CuiTimelineItem } from '@cisco-ngx/cui-components';

import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';

/** Our current customerId */
const customerId = '2431199';

/**
 * Asset Details Component
 */
@Component({
	host: {
		// '[class.fullscreen]': 'fullscreen',
		'[class.hidden]': 'hidden',
	},
	selector: 'asset-details',
	templateUrl: './details.component.html',
})

export class AssetDetailsComponent implements OnChanges, OnInit {

	@Input('asset') public asset: Asset;
	@Input('customerId') public customerId: string;
	@ViewChild('timelineItem', { static: true }) private timelineItemTemplate: TemplateRef<{ }>;

	public coverageData: CoverageInfo;
	public eolData: HardwareEOL;
	public eolBulletinData: HardwareEOLBulletin;
	public hardwareData: HardwareInfo;
	public numberInInventory: number;

	public componentData = {
		openCases: 0,
	};
	private caseParams: CaseParams = new CaseParams({
		page: 0,
		size: 20,
		sort: 'lastModifiedDate,desc',
		statusTypes: 'O',
	});
	public status = {
		loading: {
			cases: false,
			coverage: false,
			timeline: false,
		},
	};
	public hidden = true;
	// public fullscreen = false;

	public timelineData: CuiTimelineItem[] = [];

	constructor (
		private caseService: CaseService,
		private contractsService: ContractsService,
		private logger: LogService,
		private productAlertsService: ProductAlertsService,
		private inventoryService: InventoryService,
	) { }

	/**
	 * Fetch the cases for the selected asset
	 */
	private fetchCases () {
		if (_.get(this.asset, 'serialNumber')) {
			this.status.loading.cases = true;
			const params = _.cloneDeep(this.caseParams);
			_.set(params, 'serialNumbers', this.asset.serialNumber);
			this.caseService.read(params)
			.subscribe((data: any) => {
				this.componentData.openCases = _.get(data, 'totalElements', 0);
				this.status.loading.cases = false;
			},
			err => {
				this.componentData.openCases = 0;
				this.status.loading.cases = false;
				this.logger.error('assetDetails.component : fetchCases()' +
					`:: Error : (${err.status}) ${err.message}`);
			});
		}
	}

	/**
	 * Fetch the coverage data for the selected asset
	 */
	private fetchCoverageData () {
		if (this.asset) {
			this.contractsService.getDevicesAndCoverage(
				{ customerId, managedNeId: [this.asset.managedNeId] })
			.subscribe((data: any) => {
				this.coverageData = _.get(data, 'body.data[0]', undefined);
				this.fetchHardwareData();
			},
			err => {
				this.coverageData = undefined;
				this.status.loading.coverage = false;
				this.logger.error('assetDetails.component : fetchCoverageData()' +
					`:: Error : (${err.status}) ${err.message}`);
			});
		}
	}

	/**
	 * Fetch the eol bulletin data for the selected asset
	 */
	private fetchEOLBulletinData () {
		if (this.asset && this.eolData) {
			this.productAlertsService.getHardwareEoxBulletin(
				{ hwEolInstanceId: [this.eolData.hwEolInstanceId] })
			.subscribe((data: HardwareEOLBulletinResponse) => {
				this.eolBulletinData = data[0];
			});
		}
	}

	/**
	 * Fetch the eol data for the selected asset
	 */
	private fetchEOLData () {
		if (this.asset) {
			this.productAlertsService.getHardwareEox(
				{ customerId, managedNeId: [this.asset.managedNeId] })
			.subscribe((data: HardwareEOLResponse) => {
				this.eolData = data[0];
				this.fetchEOLBulletinData();
			});
		}
	}

	/**
	 * Fetch the hardware data for the selected asset
	 */
	private fetchHardwareData () {
		if (this.asset && this.coverageData) {
			this.inventoryService.getHardware(
				{ customerId, productId: [this.coverageData.productId] })
			.subscribe((results: any) => {
				this.hardwareData = _.get(results, 'body.data[0]', undefined);
				this.numberInInventory = _.get(results, 'body.data.length', 0);
			});
		}
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentAsset = _.get(changes, ['asset', 'currentValue']);
		if (currentAsset && !changes.asset.firstChange) {
			this.refresh();
		}
	}

	/**
	 * Initializer
	 */
	public ngOnInit () {
		this.refresh();
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		this.fetchCases();
		if (this.asset) {
			this.hidden = false;
			this.fetchCoverageData();
			this.fetchEOLData();
		}
	}

	/**
	 * determine if fullscreen from child data
	 * @param $event gets the boolean value
	 */
	// public determineFullScreen ($event: boolean) {
	// 	if ($event) {
	// 		this.fullscreen = true;
	// 	} else {
	// 		this.fullscreen = false;
	// 	}
	// }

	/**
	 * determine if close from child data
	 * @param $event gets the boolean value
	 */
	public determineClose ($event: boolean) {
		this.hidden = $event;
	}
}
