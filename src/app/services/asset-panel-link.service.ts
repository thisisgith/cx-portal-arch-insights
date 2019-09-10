import { Injectable } from '@angular/core';
import {
	InventoryService,
	AssetLinkInfo,
} from '@sdp-api';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LogService } from '@cisco-ngx/cui-services';

/**
 * Service for fetch asset data and element data
 */
@Injectable({
	providedIn: 'root',
})
export class AssetPanelLinkService {

	public assetParams: InventoryService.GetAssetsParams;
	public elementParams: InventoryService.GetNetworkElementsParams;
	public assetLinkInfo: AssetLinkInfo;

	constructor (
		private inventoryService: InventoryService,
		private logger: LogService,
	) {
		this.assetLinkInfo = Object.create({ });
	}

	/**
	 * Asset panel link data
	 * @param assetLinkParams asset
	 * @returns Observable<AssetLinkInfo>
	 */
	public getAssetLinkData (assetLinkParams: InventoryService.GetAssetsParams)
		: Observable<AssetLinkInfo> {
		this.elementParams = {
			customerId: assetLinkParams.customerId,
			serialNumber: assetLinkParams.serialNumber,
		};

		this.inventoryService.getAssets(assetLinkParams)
			.subscribe(response => {
				this.assetLinkInfo.asset = response.data[0];
			}, catchError(this.logger.error),
			);

		this.inventoryService.getNetworkElements(this.elementParams)
			.subscribe(response => {
				this.assetLinkInfo.element = response.data[0];
			}, catchError(this.logger.error),
			);

		return of(this.assetLinkInfo);
	}

}
