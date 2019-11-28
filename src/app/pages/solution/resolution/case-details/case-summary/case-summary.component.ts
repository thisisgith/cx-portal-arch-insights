import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { InventoryService } from '@sdp-api';
import { UserResolve } from '@utilities';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'lodash-es';

/**
 * Case Details Summary Component
 */
@Component({
	selector: 'app-case-summary',
	styleUrls: ['./case-summary.component.scss'],
	templateUrl: './case-summary.component.html',
})

export class CaseSummaryComponent implements OnInit {
	@Input() public caseDetails: any;
	@Output() public showAssetDetails: EventEmitter<{ }> = new EventEmitter<{ }>();
	public isAssetAvailable = false;
	public customerId: string;
	private destroy$: Subject<void> = new Subject<void>();
	private refresh$ = new Subject();

	constructor (
		private inventoryService: InventoryService,
		private userResolve: UserResolve,
	) {
		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
		});
	}

	/**
	 * Initialization hook
	 */
	public ngOnInit () {
		this.buildRefreshSubject();
		this.refresh$.next();
	}

	/**
	 * Used for Opening the Asset 360 View the data
	 */
	public openAssetDetailsView () {
		if (this.caseDetails && this.caseDetails.serialNumber) {
			this.showAssetDetails.emit({ serialNumber: this.caseDetails.serialNumber });
		}
	}

	/**
	 * Builds the refresh subject for cancellable http requests
	 */
	private buildRefreshSubject () {
		this.refresh$
		.pipe(
			switchMap(() =>
				this.getAssetAvailability(),
			),
			takeUntil(this.destroy$),
		)
		.subscribe(asset => {
			var a = _.filter(asset.data, d => _.find(this.caseDetails.deviceName , f => f === d.hostname));
			if (a.length > 0) {
				this.isAssetAvailable = true;
			}
		});
	}

	/**
	 * fetch asset details to check availability
	 * @returns Observable
	 */
	private getAssetAvailability () {
		return this.inventoryService.getHardware({
			customerId: this.customerId,
			serialNumber: [this.caseDetails.serialNumber],
		});
	}
}
