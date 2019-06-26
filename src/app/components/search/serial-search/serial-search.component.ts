import {
	Component,
	EventEmitter,
	forwardRef,
	Input,
	Output,
	OnDestroy,
	OnInit,
	OnChanges,
	TemplateRef,
	ViewChild,
} from '@angular/core';

import { Subject, Observable, of } from 'rxjs';
import { catchError, takeUntil, tap, switchMap } from 'rxjs/operators';

import { LogService } from '@cisco-ngx/cui-services';
import {
	ContractsService,
	DeviceContractResponse,
	InventoryService,
	HardwareResponse,
} from '@cui-x/sdp-api';

import { SpecialSearchComponent } from '../special-search/special-search.component';
import { SearchQuery } from '@interfaces';

import * as _ from 'lodash-es';

/**
 * Interface representing all serial number data to go in the template
 */
interface SerialData {
	productId: string;
	productName: string;
	productSeries: string;
	ipAddress?: string;
	hostName?: string;
	softwareType: string;
	currentVersion?: string;
	latestVersion?: string;
	openCase?: number;
	openRmas?: number;
	advisoryCounts?: {
		scanTime: string;
		fn: number;
		sa: number;
		bugs: number;
	};
}

/**
 * Interface representing all contract data to go in the template
 */
interface ContractData {
	cxLevel?: string;
	contractNum?: number;
	expirationDate?: string;
}

/**
 * A Component to house the search results by serial number
 */
@Component({
	providers: [{
		provide: SpecialSearchComponent,
		useExisting: forwardRef(() => SerialSearchComponent,
	)}],
	selector: 'serial-search',
	styleUrls: ['./serial-search.component.scss'],
	templateUrl: './serial-search.component.html',
})
export class SerialSearchComponent extends SpecialSearchComponent
implements OnInit, OnChanges, OnDestroy {
	@ViewChild('sidebar', { static: true, read: TemplateRef })
		public sidebarContent: TemplateRef<any>;
	@Input('serialNumber') public serialNumber: SearchQuery;
	@Output('hide') public hide = new EventEmitter<boolean>();
	public loading = true;
	public loadingContractData = true;
	public customerId = '2431199';
	public data: SerialData;
	public contractData: ContractData = { };

	private refresh$ = new Subject();
	private destroy$ = new Subject();

	constructor (
		private contractService: ContractsService,
		private logger: LogService,
		private inventoryService: InventoryService,
	) {
		super();
		this.logger.debug('SerialSearchComponent Created!');
	}

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		/** Main Serial Num Data Refresh */
		this.refresh$.pipe(
			tap(() => {
				this.loading = true;
				this.hide.emit(false);
			}),
			switchMap(() => this.getData(this.customerId, this.serialNumber.query)),
			takeUntil(this.destroy$),
		)
		.subscribe(response => {
			this.loading = false;
			const snData = _.get(response, ['data', 0]);
			if (!snData) {
				this.hide.emit(true);

				return;
			}
			this.data = {
				currentVersion: snData.swVersion,
				hostName: snData.hostname,
				ipAddress: snData.managementAddress,
				productId: snData.productId,
				productName: snData.productName,
				productSeries: snData.productFamily,
				softwareType: snData.swType,
			};
		});
		/** Contract Data Refresh */
		this.refresh$.pipe(
			tap(() => {
				this.loadingContractData = true;
				this.contractData = { };
			}),
			switchMap(() => this.getContractData(this.customerId, this.serialNumber.query)),
			takeUntil(this.destroy$),
		)
		.subscribe(response => {
			this.loadingContractData = false;
			const firstContract = response.data[0];
			if (firstContract) {
				this.contractData = {
					contractNum: firstContract.contractNumber,
					cxLevel: firstContract.cxLevel,
					expirationDate: firstContract.contractEndDate,
				};
			}
		});
		/** TODO: Get Case data as well, once that service code is merged in */

		this.refresh$.next();
	}

	/**
	 * OnChanges lifecycle hook
	 */
	public ngOnChanges () {
		this.refresh$.next();
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Fetch device API data
	 * @param customerId id of customer whose device we're searching
	 * @param serialNumber serial number of the device we're fetching
	 * @returns Observable with device data
	 */
	private getData (customerId: string, serialNumber: string):
	Observable<HardwareResponse> {
		const params = { customerId, serialNumber: [serialNumber] };

		return this.inventoryService.getHardware(params)
		.pipe(
			catchError(err => {
				this.logger.error(`Device Data :: ${serialNumber} :: Error ${err}`);

				return of(null);
			}),
		);
	}

	/**
	 * Fetch device contract data
	 * @param customerId id of customer whose device we're searching
	 * @param serialNumber serial number of the device we're fetching
	 * @returns Observable with device data
	 */
	private getContractData (customerId: string, serialNumber: string):
		Observable<DeviceContractResponse> {
		const params = { customerId, serialNumber: [serialNumber] };

		return this.contractService.getContractDetails(params)
		.pipe(
			catchError(err => {
				this.logger.error(`Device Contract Data :: ${serialNumber} :: Error ${err}`);

				return of(null);
			}),
		);
	}
}
