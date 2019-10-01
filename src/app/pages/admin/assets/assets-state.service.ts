import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DeviceDetailsByPage } from '@sdp-api';

/**
 * AssetStateChanges
 */
export interface AssetStateChanges {
	assets?: { data: DeviceDetailsByPage }[];
	page?: number;
	displayedAssets?: number;
	isLoadingAssets?: boolean;
	totalAssets?: number;
	search?: string;
	filter?: string;
	view?: 'table' | 'grid';
}

/**
 * Shares state amongst Admin Assets components
 */
@Injectable({
	providedIn: 'root',
})
export class AssetsState {
	private _assets: { data: DeviceDetailsByPage }[];
	private _displayedAssets = 0;
	private _filter: string;
	private _isLoadingAssets: boolean;
	private _page = 1;
	private _search: string;
	private _totalAssets;
	private _view: 'table' | 'grid' = 'table';
	public changes: Subject<AssetStateChanges> = new Subject<AssetStateChanges>();
	public get assets () { return this._assets; }
	public set assets (assets) {
		this._assets = assets;
		this.changes.next({ assets });
	}
	public get currentState () {
		return {
			assets: this._assets,
			displayedAssets: this._displayedAssets,
			filter: this._filter,
			isLoadingAssets: this._isLoadingAssets,
			page: this._page,
			search: this._search,
			totalAssets: this._totalAssets,
			view: this._view,
		};
	}
	public get displayedAssets () { return this._displayedAssets; }
	public set displayedAssets (displayedAssets) {
		this._displayedAssets = displayedAssets;
		this.changes.next({ displayedAssets });
	}
	public get filter () { return this._filter; }
	public set filter (filter) {
		this._filter = filter;
		this.changes.next({ filter });
	}
	public get isLoadingAssets () { return this._isLoadingAssets; }
	public set isLoadingAssets (isLoadingAssets) {
		this._isLoadingAssets = isLoadingAssets;
		this.changes.next({ isLoadingAssets });
	}
	public get page () { return this._page; }
	public set page (page) {
		this._page = page;
		this.changes.next({ page });
	}
	public get search () { return this._search; }
	public set search (search) {
		this._search = search;
		this.changes.next({ search });
	}
	public get totalAssets () { return this._totalAssets; }
	public set totalAssets (totalAssets) {
		this._totalAssets = totalAssets;
		this.changes.next({ totalAssets });
	}
	public get view () { return this._view; }
	public set view (view) {
		this._view = view;
		this.changes.next({ view });
	}
}
