import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	OnDestroy,
} from '@angular/core';
import {
	InventoryService,
	Asset,
	HardwareResponse,
	AssetSummary,
	AssetTaggingService,
	AssetTaggingDeviceDetails,
	Tags,
} from '@sdp-api';

import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
import { forkJoin, of, Subject } from 'rxjs';
import {
	map,
	catchError,
} from 'rxjs/operators';

/**
 * Asset Details Component
 */
@Component({
	selector: 'asset-details-summary',
	templateUrl: './summary.component.html',
})

export class AssetDetailsSummaryComponent implements OnChanges, OnInit, OnDestroy {

	@Input('asset') public asset: Asset;
	@Input('customerId') public customerId: string;

	public assetData: AssetSummary;
	public warrantyStatus: 'Covered' | 'Uncovered';
	public tags: Tags[];

	private assetSummaryParams: InventoryService.GetAssetSummaryParams;
	private hardwareParams: InventoryService.GetHardwareParams;
	private assetTagsParams: AssetTaggingService.GetParams;

	public status = {
		loading: {
			asset: false,
			hardware: false,
			overall: false,
			tags: false,
		},
	};
	public componentData = {
		numberInInventory: 0,
	};
	public hidden = true;
	public fullscreen = false;
	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		private logger: LogService,
		private inventoryService: InventoryService,
		private assetTaggingService: AssetTaggingService,
	) { }

	/**
	 * Determines whether a date has passed
	 * @param dateString expiration date as a string
	 * @returns true if the date is in the past, false otherwise
	 */
	public isExpired (dateString: string) {
		const date = new Date(dateString);

		return date.getTime() < new Date().getTime();
	}

	/**
	 * Resets data fields
	 */
	private clear () {
		this.componentData.numberInInventory = 0;
		this.assetData = null;
	}

	/**
	 * Fetches the summary data for the asset
	 * @returns the asset info
	 */
	private fetchAssetData () {
		this.status.loading.asset = true;

		return this.inventoryService.getAssetSummary(this.assetSummaryParams)
		.pipe(
			map((response: AssetSummary) => {
				this.assetData = response;
				this.warrantyStatus = this.isExpired(this.assetData.warrantyEndDate)
					? 'Uncovered' : 'Covered';
			}),
			catchError(err => {
				this.status.loading.asset = false;
				this.logger.error('details.component : fetchAssetData()' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetch the hardware data for the selected asset
	 * @returns the hardware data
	 */
	private fetchHardwareData () {
		this.status.loading.hardware = true;

		return this.inventoryService.getHardware(this.hardwareParams)
		.pipe(
			map((response: HardwareResponse) => {
				this.componentData.numberInInventory = _.get(response, ['Pagination', 'total'], 1);
				this.status.loading.hardware = false;
			}),
			catchError(err => {
				this.status.loading.hardware = false;
				this.logger.error('asset-details : summary.component : fetchHardwareData() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Fetches the summary data for the asset
	 * @returns the tags info
	 */
	private fetchTagsData () {
		this.status.loading.tags = true;

		return this.assetTaggingService.getAsset360Tags(this.assetTagsParams)
		.pipe(
			map((response: AssetTaggingDeviceDetails) => {
				this.tags = response.tags;
			}),
			catchError(err => {
				this.status.loading.tags = false;
				this.logger.error('details.component : fetchTagsData()' +
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
	 * Destroys the component
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		if (this.asset) {
			this.clear();
			this.status.loading.overall = true;

			const productId = _.get(this.asset, 'productId');
			const hwInstanceId = _.get(this.asset, 'hwInstanceId');

			const obsBatch = [];

			if (productId) {
				this.hardwareParams = {
					customerId: this.customerId,
					page: 1,
					productId: [productId],
					rows: 1,
				};

				obsBatch.push(this.fetchHardwareData());
			}

			if (hwInstanceId) {
				this.assetSummaryParams = {
					hwInstanceId,
					customerId: this.customerId,
				};

				obsBatch.push(
					this.fetchAssetData(),
				);
			}

			this.assetTagsParams = {
				customerId: this.customerId,
				deviceId: productId,
			};

			obsBatch.push(
				this.fetchTagsData(),
			);

			this.hidden = false;
			forkJoin(obsBatch)
			.subscribe(() => {
				this.status.loading.overall = false;
			});
		}
	}
}
