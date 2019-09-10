import { Injectable } from '@angular/core';
import {
	InventoryService,
} from '@sdp-api';

import { Observable, forkJoin } from 'rxjs';

/**
 * Service for fetch asset data and element data
 */
@Injectable({
	providedIn: 'root',
})
export class AssetPanelLinkService {

	public assetParams: InventoryService.GetAssetsParams;
	public elementParams: InventoryService.GetNetworkElementsParams;

	constructor (
		private inventoryService: InventoryService,
	) {	}

	/**
	 * Asset panel link data
	 * @param assetLinkParams asset
	 * @returns Observable<any>
	 */
	public getAssetLinkData (assetLinkParams: InventoryService.GetAssetsParams)
		: Observable<any> {
		this.elementParams = {
			customerId: assetLinkParams.customerId,
			serialNumber: assetLinkParams.serialNumber,
		};

		const asset = this.inventoryService.getAssets(assetLinkParams);
		const element = this.inventoryService.getNetworkElements(this.elementParams);

		return forkJoin(
			[asset, element],
		);
	}
}
