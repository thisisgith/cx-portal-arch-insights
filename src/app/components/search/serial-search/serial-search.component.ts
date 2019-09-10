import {
	Component,
	EventEmitter,
	forwardRef,
	Input,
	Output,
	OnDestroy,
	OnInit,
	OnChanges,
} from '@angular/core';
import { Router } from '@angular/router';

import { Subject, Observable, forkJoin, of } from 'rxjs';
import { catchError, takeUntil, tap, switchMap } from 'rxjs/operators';

import { CuiModalService } from '@cisco-ngx/cui-components';
import { LogService } from '@cisco-ngx/cui-services';
import {
	Asset,
	ContractsService,
	DeviceContractResponse,
	InventoryService,
	ProductAlertsService,
	HardwareResponse,
	VulnerabilityResponse,
	Assets,
	HardwareInfo,
} from '@sdp-api';
import { CaseService } from '@cui-x/services';
import { SearchService } from '@services';

import { SpecialSearchComponent } from '../special-search/special-search.component';
import { CaseOpenComponent } from '../../case/case-open/case-open.component';
import { SearchQuery } from '@interfaces';

import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';

/**
 * Interface representing all serial number data to go in the template
 */
interface SerialData {
	currentVersion?: string;
	hostName?: string;
	ipAddress?: string;
	lastScan: string;
	openCase?: number;
	openRmas?: number;
	productId: string;
	productName: string;
	productSeries: string;
	softwareType: string;
}

/**
 * Interface representing all contract data to go in the template
 */
interface ContractData {
	contractNum?: number;
	cxLevel?: string;
	expirationDate?: string;
}

/**
 * Interface representing Product Alerts data to go in the template
 */
interface AlertsData {
	bugs: number;
	fieldNotices: number;
	securityAdvisories: number;
}

/**
 * Interface representing open case/rma data to go in template
 */
interface CaseData {
	openCases: number;
	openRmas: number;
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
	@Input('serialNumber') public serialNumber: SearchQuery;
	@Output('hide') public hide = new EventEmitter<boolean>();
	public loading = true;
	public loadingContract = true;
	public loadingHardware = true;
	public loadingAlerts = true;
	public loadingCase = true;
	public customerId: string;
	public data = <SerialData> { };
	public assetData: Asset;
	public contractData: ContractData;
	public expirationFromNow: string;
	public alertsData: AlertsData;
	public caseData: CaseData;

	private refresh$ = new Subject();
	private destroy$ = new Subject();

	constructor (
		private caseService: CaseService,
		private contractService: ContractsService,
		private cuiModalService: CuiModalService,
		private logger: LogService,
		private searchService: SearchService,
		private inventoryService: InventoryService,
		private alertsService: ProductAlertsService,
		public router: Router,
		private userResolve: UserResolve,
	) {
		super();
		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
		});
	}

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		/** Main Asset Data Refresh */
		this.refresh$.pipe(
			tap(() => {
				this.loading = true;
				this.hide.emit(false);
			}),
			switchMap(() => this.getAssetInfo(this.customerId, this.serialNumber.query)),
			takeUntil(this.destroy$),
		)
		.subscribe(response => {
			this.loading = false;
			this.assetData = _.get(response, ['data', 0]);
			if (!this.assetData) {
				this.hide.emit(true);

				return;
			}
			this.data.currentVersion = this.assetData.osVersion;
			this.data.ipAddress = this.assetData.ipAddress;
			this.data.lastScan = this.assetData.lastScan;
			this.data.productId = this.assetData.productId;
			this.data.softwareType = this.assetData.osType;
		});
		/** Hardware Info Refresh */
		this.refresh$.pipe(
			tap(() => {
				this.loadingContract = true;
			}),
			switchMap(() => this.getHardwareInfo(this.customerId, this.serialNumber.query)),
			takeUntil(this.destroy$),
		)
		.subscribe(response => {
			this.loadingHardware = false;
			const hardwareData: HardwareInfo = _.get(response, ['data', 0]);
			if (hardwareData) {
				this.data.hostName = hardwareData.hostname;
				this.data.productName = hardwareData.productName;
				this.data.productSeries = hardwareData.productFamily;
			}
		});
		/** Contract Data Refresh */
		this.refresh$.pipe(
			tap(() => {
				this.loadingContract = true;
			}),
			switchMap(() => this.getContractData(this.customerId, this.serialNumber.query)),
			takeUntil(this.destroy$),
		)
		.subscribe(response => {
			this.loadingContract = false;
			this.contractData = {
				contractNum: _.get(response, ['data', 0, 'contractNumber'], null),
				cxLevel: _.get(response, ['data', 0, 'cxLevel'], null),
				expirationDate: _.get(response, ['data', 0, 'contractEndDate'], null),
			};
		});
		/** Alerts Data Refresh */
		this.refresh$.pipe(
			tap(() => {
				this.loadingAlerts = true;
				this.alertsData = null;
			}),
			switchMap(() => this.getAlertsData(this.customerId, this.serialNumber.query)),
			takeUntil(this.destroy$),
		)
		.subscribe(response => {
			this.loadingAlerts = false;
			this.alertsData = {
				bugs: _.get(response, 'bugs', null),
				fieldNotices: _.get(response, 'field-notices', null),
				securityAdvisories: _.get(response, 'security-advisories', null),
			};
		});
		/** Get Open Case/Open RMA Counts */
		this.refresh$.pipe(
			tap(() => {
				this.loadingCase = true;
				this.caseData = null;
			}),
			switchMap(() => this.getCaseData(this.serialNumber.query)),
			takeUntil(this.destroy$),
		)
		.subscribe(response => {
			const [caseResponse, rmaResponse] = response;
			this.caseData = {
				openCases: _.get(caseResponse, 'totalElements', 0),
				openRmas: _.get(rmaResponse, 'totalElements', 0),
			};
		});

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
	 * Fetch inventory asset API data
	 * @param customerId id of customer whose device we're searching
	 * @param serialNumber serial number of the device we're fetching
	 * @returns Observable with device data
	 */
	 private getAssetInfo (customerId: string, serialNumber: string):
	 Observable<Assets> {
		 return this.inventoryService.getAssets({ customerId, serialNumber: [serialNumber] })
		 .pipe(
			 catchError(err => {
				 this.logger.error(`Hardware Data :: ${serialNumber} :: Error ${err}`);

				 return of(null);
			 }),
		 );
	 }

	/**
	 * Fetch inventory hardware API data
	 * @param customerId id of customer whose device we're searching
	 * @param serialNumber serial number of the device we're fetching
	 * @returns Observable with device data
	 */
	private getHardwareInfo (customerId: string, serialNumber: string):
	Observable<HardwareResponse> {
		const params = { customerId, serialNumber: [serialNumber] };

		return this.inventoryService.getHardware(params)
		.pipe(
			catchError(err => {
				this.logger.error(`Hardware Data :: ${serialNumber} :: Error ${err}`);

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

	/**
	 * Fetch product alerts data
	 * @param customerId id of customer whose device we're searching
	 * @param serialNumber serial number of the device we're fetching
	 * @returns Observable with alerts counts data
	 */
	private getAlertsData (customerId: string, serialNumber: string):
	Observable<VulnerabilityResponse> {
		return this.alertsService.getVulnerabilityCounts({
			customerId,
			serialNumber: [serialNumber],
		})
		.pipe(
			catchError(err => {
				this.logger.error(`Product Alerts Data :: ${serialNumber} :: Error ${err}`);

				return of(null);
			}),
		);
	}

	/**
	 * Fetch Case/RMA counts for the given serial number
	 * @param serialNumber sn to search on
	 * @returns Observable with array of case followed by RMA counts
	 */
	private getCaseData (serialNumber: string) {
	 const params = {
		 nocache: Date.now(),
		 page: 0,
		 serialNumbers: [serialNumber],
		 size: 1,
		 sort: 'caseNumber,ASC',
		 statusTypes: 'O',
	 };

	 return forkJoin(
		 // Case Count
		 this.caseService.read(params)
		 .pipe(
			 catchError(err => {
				 this.logger.error(`Case Data :: ${serialNumber} :: Error ${err}`);

				 return of(null);
			 }),
		 ),
		 // RMA count
		 this.caseService.read({
			 ...params,
			 hasRMAs: 'T',
		 })
		 .pipe(
			 catchError(err => {
				 this.logger.error(`RMA Data :: ${serialNumber} :: Error ${err}`);

				 return of(null);
			 }),
		 ),
	 );
	}

	/**
	 * Navigate to asset view and close modal
	 * Occurs when user clicks "View Device Details" button
	 * @param serialNumber serial number of the device to view
	 */
	 public async onViewDetails (serialNumber?: string) {
		await this.router.navigate(['solution'], { skipLocationChange: true });
		await this.router.navigate(
			['solution/assets'],
			{ queryParams: { serialNumber, select: true } },
		);
		this.searchService.close();
	}

	/**
	 * Pop up the "Open a Case" component modal when the user clicks the Open a Case button
	 * @param asset the Asset to open a case for.
	 */
	public openCase (asset: Asset) {
		this.cuiModalService.showComponent(CaseOpenComponent, { asset }, 'full');
	}
}
