import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { InventoryService, HardwareAssets } from '@sdp-api';
import { UserResolve } from '@utilities';
import { takeUntil, map, catchError, switchMap } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
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
		private logger: LogService,
	) {
		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
		});
	}

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

	private buildRefreshSubject() {
		this.refresh$
		.pipe(
			switchMap(() =>
				this.getAssetAvailability(),
			),
			takeUntil(this.destroy$),
		)
		.subscribe(asset => {
			if (asset.data && asset.data.length > 0) {
				this.isAssetAvailable = true;
			}
		})
	}

	/**
	 * 
	 */
	private getAssetAvailability () {
		return this.inventoryService.getHardwareAssets({
			customerId: this.customerId,
			page: 1,
			rows: 1,
			serialNumber: [this.caseDetails.serialNumber],
		});
	}
}
