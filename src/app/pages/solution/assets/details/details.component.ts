import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
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
	HardwareResponse,
	CoverageResponse,
} from '@sdp-api';

import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
import { forkJoin, of } from 'rxjs';
import {
	map,
	mergeMap,
	catchError,
} from 'rxjs/operators';

/** Our current customerId */
const customerId = '2431199';

/**
 * Asset Details Component
 */
@Component({
	host: {
		'[class.hidden]': 'hidden',
	},
	selector: 'asset-details',
	templateUrl: './details.component.html',
})

export class AssetDetailsComponent implements OnChanges, OnInit {

	@Input('asset') public asset: Asset;
	@Input('customerId') public customerId: string;

	public coverageData: CoverageInfo;
	public eolData: HardwareEOL;
	public eolBulletinData: HardwareEOLBulletin;
	public hardwareData: HardwareInfo;

	public status = {
		loading: {
			coverage: false,
			eol: false,
			eolBulletin: false,
			hardware: false,
			overall: false,
			timeline: false,
		},
	};
	public componentData = {
		numberInInventory: 0,
	};
	public hidden = true;
	public fullscreen = false;

	constructor (
		private contractsService: ContractsService,
		private logger: LogService,
		private productAlertsService: ProductAlertsService,
		private inventoryService: InventoryService,
	) { }

	/**
	 * Resets data fields
	 */
	private clear () {
		this.componentData.numberInInventory = 0;
		this.coverageData = null;
		this.eolData = null;
		this.eolBulletinData = null;
		this.hardwareData = null;
	}

	/**
	 * Fetch the coverage data for the selected asset
	 * @param managedNeId the managed network id
	 * @returns the coverage data
	 */
	private fetchCoverageData (managedNeId: string) {
		this.status.loading.coverage = true;

		return this.contractsService.getDevicesAndCoverage(
			{ customerId,
				managedNeId: [managedNeId],
				page: 1,
				rows: 1,
			})
		.pipe(
			map((response: CoverageResponse) => {
				this.coverageData = _.head(_.get(response, 'data', []));

				this.status.loading.coverage = false;
			}),
			catchError(err => {
				this.coverageData = undefined;
				this.status.loading.coverage = false;
				this.logger.error('details.component : fetchCoverageData()' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetch the eol bulletin data for the selected asset
	 * @param hwEolInstanceId the instanceId to filter on
	 * @returns bulletin data
	 */
	private fetchEOLBulletinData (hwEolInstanceId: string) {
		this.status.loading.eolBulletin = true;

		return this.productAlertsService.getHardwareEoxBulletin(
			{ hwEolInstanceId: [hwEolInstanceId] })
		.pipe(
			map((response: HardwareEOLBulletinResponse) => {
				this.eolBulletinData = _.head(_.get(response, 'data', []));

				this.status.loading.eolBulletin = false;
			}),
			catchError(err => {
				this.status.loading.eolBulletin = false;
				this.logger.error('details.component : fetchEOLBulletinData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetch the eol data for the selected asset
	 * @param managedNeId the managed network id
	 * @returns eol data
	 */
	private fetchEOLData (managedNeId: string) {
		this.status.loading.eol = true;

		return this.productAlertsService.getHardwareEox(
			{ customerId, managedNeId: [managedNeId] })
		.pipe(
			mergeMap((response: HardwareEOLResponse) => {
				this.eolData = _.head(_.get(response, 'data', []));

				this.status.loading.eol = false;

				const instanceId = _.get(this, ['eolData', 'hwEolInstanceId']);
				if (instanceId) {
					return this.fetchEOLBulletinData(instanceId);
				}
			}),
			catchError(err => {
				this.status.loading.eol = false;
				this.logger.error('details.component : fetchEOLData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetch the hardware data for the selected asset
	 * @param productId the asset productId
	 * @returns the hardware data
	 */
	private fetchHardwareData (productId: string) {
		this.status.loading.hardware = true;

		return this.inventoryService.getHardware(
			{ customerId, productId: [productId] })
		.pipe(
			map((response: HardwareResponse) => {
				const data = _.get(response, 'data', []);

				this.hardwareData = _.find(data,
					{ managedNeId: this.asset.managedNeId },
				);

				this.componentData.numberInInventory = data.length;
				this.status.loading.hardware = false;
			}),
			catchError(err => {
				this.status.loading.hardware = false;
				this.logger.error('details.component : fetchHardwareData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
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
		if (this.asset) {
			this.clear();
			this.status.loading.overall = true;

			const productId = _.get(this.asset, 'productId');
			const managedNeId = _.get(this.asset, 'managedNeId');

			const obsBatch = [];

			if (productId) {
				obsBatch.push(this.fetchHardwareData(productId));
			}

			if (managedNeId) {
				obsBatch.push(
					this.fetchEOLData(managedNeId),
					this.fetchCoverageData(managedNeId),
				);
			}

			this.hidden = false;
			forkJoin(obsBatch)
			.subscribe(() => {
				this.status.loading.overall = false;

				this.logger.debug('details.component : loadData() :: Finished Refresh');
			});
		}
	}

	/**
	 * determine if close from child data
	 * @param $event gets the boolean value
	 */
	public determineClose ($event: boolean) {
		this.hidden = $event;
	}
}
