import {
	Component,
	Input,
	OnInit,
	OnChanges,
	SimpleChanges,
	OnDestroy,
	EventEmitter,
	Output,
} from '@angular/core';
import { CaseParams, CaseService } from '@cui-x/services';
import {
	Asset,
	NetworkDataGatewayService,
	TransactionRequest,
	Transaction,
	TransactionRequestResponse,
	TransactionStatusResponse,
	ScanRequestResponse,
} from '@sdp-api';
import * as _ from 'lodash-es';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { LogService } from '@cisco-ngx/cui-services';
import { of, forkJoin, Subject } from 'rxjs';
import {
	map,
	catchError,
	takeUntil,
	mergeMap,
	delay,
} from 'rxjs/operators';
import { CaseOpenComponent } from '../../../case/case-open/case-open.component';
import { Alert } from '@interfaces';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * Asset Details Header Component
 */
@Component({
	host: {
		'[class.fullscreen]': 'fullscreen',
		'[class.hidden]': 'hidden',
	},
	selector: 'asset-details-header',
	styleUrls: ['./header.component.scss'],
	templateUrl: './header.component.html',
})
export class AssetDetailsHeaderComponent implements OnChanges, OnInit, OnDestroy {

	@Input('asset') public asset: Asset;
	@Input('customerId') public customerId: string;
	@Output('alert') public alertMessage = new EventEmitter<Alert>();

	public openCases: any[];
	private caseParams: CaseParams = new CaseParams({
		page: 0,
		size: 20,
		sort: 'lastModifiedDate,desc',
		statusTypes: 'O',
	});
	public status = {
		loading: {
			cases: false,
			eligibility: false,
			overall: false,
		},
		scan: {
			eligible: true, // TODO: Update this based on eligibility when working
			inProgress: false,
		},
	};
	public casesDropdownActive = false;
	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		private caseService: CaseService,
		private cuiModalService: CuiModalService,
		private logger: LogService,
		private networkService: NetworkDataGatewayService,
	) { }

	/**
	 * Toggle the open cases dropdown
	 */
	public toggleActiveCases () {
		this.casesDropdownActive = !this.casesDropdownActive;
	}

	/**
	 * Fetch the cases for the selected asset
	 * @returns the observable
	 */
	private fetchCases () {
		this.status.loading.cases = true;
		const params = _.cloneDeep(this.caseParams);
		_.set(params, 'serialNumbers', this.asset.serialNumber);

		return this.caseService.read(params)
		.pipe(
			takeUntil(this.destroyed$),
			map(data => {
				this.openCases = _.get(data, 'content', []);
				this.status.loading.cases = false;
			}),
			catchError(err => {
				this.openCases = [];
				this.status.loading.cases = false;
				this.logger.error('asset-details:header.component : fetchCases()' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * TODO: Add back eligibility check when it is actually working
	 * Gets the eligibility of the device for scanning
	 * @returns the observable
	 */
	// private getEligibility () {
	// 	const params: NetworkDataGatewayService.GetEligibilityParams = {
	// 		customerId: this.customerId,
	// 		productId: this.asset.productId,
	// 		serialNumber: this.asset.serialNumber,
	// 	};

	// 	return this.networkService.getEligibility(params)
	// 	.pipe(
	// 		map((response: Connectivity) => {
	// 			this.status.scan.eligible = _.get(response, 'connected', false) &&
	// 				_.get(response, 'eligible', false);
	// 		}),
	// 		catchError(err => {
	// 			this.status.loading.eligibility = false;
	// 			this.logger.error('details-header.component : getEligibility()' +
	// 				`:: Error : (${err.status}) ${err.message}`);

	// 			return of({ });
	// 		}),
	// 	);
	// }

	/**
	 * Checks for a current scan status on an asset
	 */
	private checkScanStatus () {
		const getScanStatusParams: NetworkDataGatewayService.GetScanStatusBySerialParams = {
			customerId: this.customerId,
			productId: this.asset.productId,
			serialNumber: this.asset.serialNumber,
		};

		return this.networkService.getScanStatusBySerial(getScanStatusParams)
		.pipe(
			takeUntil(this.destroyed$),
			mergeMap((response: ScanRequestResponse) => {
				const inProgress = _.find(response, { status: 'IN_PROGRESS' });
				const received = _.find(response, { status: 'RECEIVED' });

				if (inProgress && inProgress.transactionId) {
					_.set(this.status, ['scan', 'inProgress'], true);

					this.alertMessage.emit({
						message: I18n.get('_ScanningCurrentlyInProgress_'), severity: 'info' });

					return this.scanPolling({
						customerId: this.customerId,
						transactionId: inProgress.transactionId,
					});
				}
				if (received && received.transactionId) {
					_.set(this.status, ['scan', 'inProgress'], true);

					this.alertMessage.emit({
						message: I18n.get('_ScanningCurrentlyInProgress_'), severity: 'info' });

					return this.scanPolling({
						customerId: this.customerId,
						transactionId: received.transactionId,
					});
				}

				return of({ });
			}),
			catchError(err => {
				this.logger.error('asset-details:header.component : checkScanStatus() ' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Initiates a scan
	 */
	public initiateScan () {
		const request: TransactionRequest = {
			customerId: this.customerId,
			neCount: 1,
			requestBody: {
				deviceOptions: 'LIST',
				devices: [{
					hostname: this.asset.deviceName,
					ipAddress: this.asset.ipAddress,
					productId: this.asset.productId,
					serialNumber: this.asset.serialNumber,
				}],
			},
			requestType: 'PEC',
			transactionType: 'SCAN',
		};

		if (!_.get(this.status, ['scan', 'inProgress'], false)) {
			this.networkService.postDeviceTransactions(request)
			.pipe(
				takeUntil(this.destroyed$),
				mergeMap((response: TransactionRequestResponse) => {
					const transaction: Transaction = _.head(response);

					if (_.get(transaction, 'transactionId')) {
						_.set(this.status, ['scan', 'inProgress'], true);

						return this.scanPolling(transaction);
					}

					return of({ });
				}),
				catchError(err => {
					this.alertMessage.emit({
						message: I18n.get('_UnableToInitiateScan_', this.asset.deviceName),
						severity: 'danger',
					});

					this.logger.error('asset-details:header.component : initiateScan() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			)
			.subscribe();
		}
	}

	/**
	 * Initiate Polling
	 * @param transaction the transaction
	 * @returns the observable
	 */
	private scanPolling (transaction: Transaction) {
		return this.networkService.getScanStatusByTransaction({
			customerId: this.customerId,
			transactionId: transaction.transactionId,
		})
		.pipe(
			delay(3000),
			takeUntil(this.destroyed$),
			mergeMap((response: TransactionStatusResponse) => {
				if (response.status === 'SUCCESS') {
					this.alertMessage.emit({
						message: I18n.get('_ScanningHasCompleted_'),
						severity: 'success',
					});

					_.set(this.status, ['scan', 'inProgress'], false);

					return of({ });
				}

				return this.scanPolling(transaction);
			}),
			catchError(err => {
				this.alertMessage.emit({
					message: I18n.get('_UnableToInitiateScan_', this.asset.deviceName),
					severity: 'danger',
				});

				_.set(this.status, ['scan', 'inProgress'], false);

				this.logger.error('asset-details:header.component : initiatePolling() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Refreshes the data
	 */
	public refresh () {
		if (_.get(this.asset, 'serialNumber')) {
			this.status.loading.overall = true;
			forkJoin(
				this.fetchCases(),
				this.checkScanStatus(),
				// this.getEligibility(),
			)
			.subscribe(() => {
				this.status.loading.overall = false;
			});
		}
	}

	/**
	 * Initializer
	 */
	public ngOnInit () {
		this.refresh();
	}

	/**
	 * Destroys the component
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentAsset = _.get(changes, ['asset', 'currentValue']);
		if (currentAsset && !changes.asset.firstChange) {
			this.refresh();
		}
	}

/**
	* On "Open a Case" button pop up "Open Case" component
	*/
	public openCase () {
		 this.cuiModalService.showComponent(CaseOpenComponent, { asset: this.asset }, 'full');
	}
}
