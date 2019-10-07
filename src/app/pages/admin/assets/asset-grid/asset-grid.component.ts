import { Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { AssetsState } from '../assets-state.service';
import { Observable, Subject } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { getProductTypeImage, getProductTypeTitle } from '@classes';
import * as _ from 'lodash-es';

/**
 * AssetGridComponent
 */
@Component({
	selector: 'asset-grid',
	templateUrl: './asset-grid.component.html',
})
export class AssetGridComponent implements OnDestroy {
	@ViewChild('deviceNameCell', { static: false }) private deviceNameCell: TemplateRef<any>;
	@ViewChild('statusCell', { static: false }) private statusCell: TemplateRef<any>;
	@ViewChild('dateCell', { static: false }) private dateCell: TemplateRef<any>;
	public columns;
	public getProductTitle = getProductTypeTitle;
	public getProductTypeImage = getProductTypeImage;
	private destroyed$: Subject<void> = new Subject<void>();
	public assets$: Observable<any[]> = this.state.changes
		.pipe(
			startWith(this.state.currentState),
			filter(changes => !_.isUndefined(changes.assets)),
			map(changes => changes.assets),
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
