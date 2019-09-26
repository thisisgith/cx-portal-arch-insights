import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AssetsState } from '../assets-state.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, map, startWith, takeUntil, tap } from 'rxjs/operators';
import * as _ from 'lodash-es';

/**
 * Counts for the toolbar pager
 */
interface AssetCounts {
	displayedAssets: number;
	totalAssets: number;
}

/**
 * AssetTotalComponent
 */
@Component({
	selector: 'asset-toolbar',
	styleUrls: ['./asset-toolbar.component.scss'],
	templateUrl: './asset-toolbar.component.html',
})
export class AssetToolbarComponent implements OnDestroy, OnInit {
	private destroyed$: Subject<void> = new Subject<void>();
	private displayedAssets = 0;
	private totalAssets = 0;
	public counts$: Observable<AssetCounts> = this.state.changes
		.pipe(
			startWith(this.state.currentState),
			filter(changes => !_.isUndefined(changes.displayedAssets)
				|| !_.isUndefined(changes.totalAssets)),
			map(changes => ({
				displayedAssets: changes.displayedAssets || this.displayedAssets,
				totalAssets: changes.totalAssets || this.totalAssets,
			})),
			tap(counts => {
				this.displayedAssets = counts.displayedAssets || this.displayedAssets;
				this.totalAssets = counts.totalAssets || this.totalAssets;
			}),
			takeUntil(this.destroyed$),
		);
	public view$: Observable<'table' | 'grid'> = this.state.changes
		.pipe(
			startWith(this.state.currentState),
			filter(changes => !_.isUndefined(changes.view)),
			map(changes => changes.view),
			takeUntil(this.destroyed$),
		);
	public searchForm: FormGroup = new FormGroup({
		search: new FormControl(''),
	});

	constructor (
		private state: AssetsState,
	) { }

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * NgOnInit
	 */
	public ngOnInit () {
		// Commenting this until search is supported by API
		// this.searchForm.valueChanges
		// 	.pipe(
		// 		debounceTime(500),
		// 		takeUntil(this.destroyed$),
		// 	)
		// 	.subscribe(value => {
		// 		this.state.search = value;
		// 	});
	}

	/**
	 * Toggles the view between table and grid
	 * @param view - 'table' | 'grid'
	 */
	public selectView (view: 'table' | 'grid') {
		this.state.view = view;
	}
}
