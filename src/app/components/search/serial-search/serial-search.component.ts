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

import { Subject, Observable, forkJoin, of } from 'rxjs';
import { catchError, takeUntil, tap, switchMap } from 'rxjs/operators';

import { LogService } from '@cisco-ngx/cui-services';
import {
	ContractsService,
	DeviceContractResponse,
	InventoryService,
	ProductAlertsService,
	HardwareResponse,
	VulnerabilityResponse,
} from '@sdp-api';
import { CaseService } from '@cui-x/services';

import { SpecialSearchComponent } from '../special-search/special-search.component';
import { SearchQuery } from '@interfaces';

import * as _ from 'lodash-es';
import { FromNowPipe } from '@cisco-ngx/cui-pipes';

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
	openCase?: number;
	openRmas?: number;
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
 * Interface representing Product Alerts data to go in the template
 */
interface AlertsData {
	securityAdvisories: number;
	bugs: number;
	fieldNotices: number;
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
	@ViewChild('sidebar', { static: true, read: TemplateRef })
		public sidebarContent: TemplateRef<any>;
	@Input('serialNumber') public serialNumber: SearchQuery;
	@Output('hide') public hide = new EventEmitter<boolean>();
	public loading = true;
	public loadingContract = true;
	public loadingAlerts = true;
	public loadingCase = true;
	public customerId = '2431199';
	public data: SerialData;
	public contractData: ContractData;
	public expirationFromNow: string;
	public alertsData: AlertsData;
	public caseData: CaseData;

	private refresh$ = new Subject();
	private destroy$ = new Subject();

	constructor (
		private caseService: CaseService,
		private contractService: ContractsService,
		private logger: LogService,
		private inventoryService: InventoryService,
		private alertsService: ProductAlertsService,
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
			const fromNowPipe = new FromNowPipe();
			this.expirationFromNow = fromNowPipe.transform(this.contractData.expirationDate);
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
}
