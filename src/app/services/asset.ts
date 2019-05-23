import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { Observable } from 'rxjs';
import { Asset } from '@interfaces';

/**
 * Service which contains all calls to our solution service
 */
@Injectable({
	providedIn: 'root',
})
export class AssetService {

	private serviceUrl: string;

	constructor (
		private http: HttpClient,
	) {
		this.serviceUrl = `${environment.origin}${environment.services.inventory}`;
	}

	/**
	 * Queries the inventory api for a list of assets
	 * @returns Inventory results
	 */
	public queryAssets (): Observable<Asset[]> {
		return this.http.get<Asset[]>(`${this.serviceUrl}/hardware`);
	}

	/**
	 * Queries the inventory API for a specific asset
	 * @param id asset id
	 * @returns the found asset
	 */
	public queryAssetById (id: number) {
		return this.http.get<Asset>(`${this.serviceUrl}/hardware/${id}`);
	}
}
