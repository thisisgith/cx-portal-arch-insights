import { Component, OnDestroy } from '@angular/core';
import { AssetsState } from '../assets-state.service';
import { Observable, Subject } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';

/**
 * AssetTotalComponent
 */
@Component({
	selector: 'asset-total',
	styleUrls: ['./asset-total.component.scss'],
	templateUrl: './asset-total.component.html',
})
export class AssetTotalComponent implements OnDestroy {
	private destroyed$: Subject<void> = new Subject<void>();
	public numDevices$: Observable<number> = this.state.changes.pipe(
		startWith(this.state.currentState),
		filter(change => !_.isUndefined(change.totalAssets)),
		map(change => change.totalAssets),
		takeUntil(this.destroyed$),
	);

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
}
