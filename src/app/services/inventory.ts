import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { Observable } from 'rxjs';
import { Asset, DeviceDetails } from '@interfaces';

/**
 * Interface representing a list of Inventory Results
 */
export interface InventoryResults {
	assets: Asset[];
}

/**
 * Service which contains all calls to our solution service
 */
@Injectable({
	providedIn: 'root',
})
export class InventoryService {

	private serviceUrl: string;

	constructor (
		private http: HttpClient,
	) {
		const origin = environment.origin || window.location.origin;
		this.serviceUrl = `${origin}${environment.services.inventory}`;
	}

	/**
	 * Performs a query against the inventory api
	 * @returns Inventory results
	 */
	public queryAssets (): Observable<InventoryResults> {
		return this.http.get<InventoryResults>(`${this.serviceUrl}/hardware`);
	}

	/**
	 * Performs a query against the Inventory api
	 * @param assetId : device id
	 * @returns Inventory results
	 */
	public queryAssetById (assetId: number) {
		return this.http.get<DeviceDetails>(`${this.serviceUrl}/hardware?_id=${assetId}`);
	}
}
