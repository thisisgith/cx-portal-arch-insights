import {
	AfterViewInit, ChangeDetectorRef, Component, OnDestroy, TemplateRef, ViewChild,
} from '@angular/core';
import { AssetsState } from '../assets-state.service';
import { Observable, Subject } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { getProductTypeImage, getProductTypeTitle } from '@classes';
import * as _ from 'lodash-es';

import { getColumnConfig } from './column-config';

/**
 * AssetTableComponent
 */
@Component({
	selector: 'asset-table',
	styleUrls: ['./asset-table.component.scss'],
	templateUrl: './asset-table.component.html',
})
export class AssetTableComponent implements AfterViewInit, OnDestroy {
	@ViewChild('deviceNameCell', { static: false }) private deviceNameCell: TemplateRef<any>;
	@ViewChild('lastScanCell', { static: false }) private lastScanCell: TemplateRef<any>;
	@ViewChild('statusCell', { static: false }) private statusCell: TemplateRef<any>;
	@ViewChild('dateCell', { static: false }) private dateCell: TemplateRef<any>;
	public columns;
	public getProductTitle = getProductTypeTitle;
	public getProductIcon = getProductTypeImage;
	private destroyed$: Subject<void> = new Subject<void>();
	public assets$: Observable<any[]> = this.state.changes
		.pipe(
			startWith(this.state.currentState),
			filter(changes => !_.isUndefined(changes.assets)),
			map(changes => changes.assets),
		);

	constructor (
		private cdr: ChangeDetectorRef,
		private state: AssetsState,
	) { }

	/**
	 * NgAfterViewInit
	 */
	public ngAfterViewInit () {
		this.columns = getColumnConfig([
			this.deviceNameCell,
			this.lastScanCell,
			this.statusCell,
			this.dateCell,
		]);
		this.cdr.detectChanges();
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}
}
