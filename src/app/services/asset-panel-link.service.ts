import { Injectable } from '@angular/core';
import {
	InventoryService, RacetrackSolution, RacetrackTechnology,
} from '@sdp-api';
import * as _ from 'lodash-es';
import { Observable, forkJoin } from 'rxjs';
import { RacetrackInfoService } from './racetrack-info';

/**
 * Service for fetch asset data and element data
 */
@Injectable({
	providedIn: 'root',
})
export class AssetPanelLinkService {

	public assetParams: InventoryService.GetAssetsParams;
	public elementParams: InventoryService.GetNetworkElementsParams;
	private selectedSolutionName: string;
	private selectedTechnologyName: string;

	constructor (
		private inventoryService: InventoryService,
		private racetrackInfoService: RacetrackInfoService,
	) {
		this.racetrackInfoService.getCurrentSolution()
		.subscribe((solution: RacetrackSolution) => {
			this.selectedSolutionName = _.get(solution, 'name');
		});

		this.racetrackInfoService.getCurrentTechnology()
		.subscribe((technology: RacetrackTechnology) => {
			this.selectedTechnologyName = _.get(technology, 'name');
		});
	}

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
			solution: this.selectedSolutionName,
			useCase: this.selectedTechnologyName,
		};

		assetLinkParams.solution = this.selectedSolutionName;
		assetLinkParams.useCase = this.selectedTechnologyName;

		return forkJoin([
			this.inventoryService.getAssets(assetLinkParams),
			this.inventoryService.getNetworkElements(this.elementParams),
		]);
	}
}
