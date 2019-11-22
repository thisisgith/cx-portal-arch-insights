import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	OnDestroy,
	EventEmitter,
	Output,
} from '@angular/core';
import {
	AssetTaggingService,
	AssetTaggingDeviceDetails,
	Tags,
	NetworkDataGatewayService,
	TransactionStatusResponse,
	ScanRequestResponse,
	TransactionRequest,
	TransactionRequestResponse,
	Transaction,
} from '@sdp-api';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
import { of, Subject, forkJoin } from 'rxjs';
import {
	map,
	catchError,
	takeUntil,
	mergeMap,
	delay,
} from 'rxjs/operators';
import { Alert, ModHardwareAsset, ModSystemAsset } from '@interfaces';

/**
 * Asset Details Component
 */
@Component({
	selector: 'asset-details-summary',
	styleUrls: ['./summary.component.scss'],
	templateUrl: './summary.component.html',
})

export class AssetDetailsSummaryComponent implements OnChanges, OnInit, OnDestroy {

	@Input('customerId') public customerId: string;
	@Input('systemAsset') public systemAsset: ModSystemAsset;
	@Input('hardwareAsset') public hardwareAsset: ModHardwareAsset;
	@Output('alert') public alertMessage = new EventEmitter<Alert>();
	@Output('scanStatus') public scanStatus = new EventEmitter<TransactionStatusResponse>();

	public warrantyStatus: 'Covered' | 'Uncovered';
	public tags: Tags[];

	private assetTagsParams: AssetTaggingService.GetParams;

	public status = {
		loading: {
			overall: false,
			tags: false,
		},
		scan: {
			eligible: false,
			inProgress: false,
		},
	};
	public hidden = true;
	public fullscreen = false;
	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		private logger: LogService,
		private assetTaggingService: AssetTaggingService,
		private networkService: NetworkDataGatewayService,
	) { }

	/**
	 * Resets data fields
	 */
	private clear () {
		this.tags = null;
	}

	/**
	 * Checks for a current scan status on an asset
	 * @returns the observable
	 */
	private checkScanStatus () {
		if (!this.status.scan.eligible) {
			return of({ });
		}

		const getScanStatusParams: NetworkDataGatewayService.GetScanStatusBySerialParams = {
			customerId: this.customerId,
			productId: this.systemAsset.productId,
			serialNumber: this.systemAsset.serialNumber,
		};

		return this.networkService.getScanStatusBySerial(getScanStatusParams)
		.pipe(
			takeUntil(this.destroyed$),
			mergeMap((response: ScanRequestResponse) => {
				const scan = _.head(response);
				const status = _.get(scan, 'status', '');
				const inProgress = (
					status === 'IN_PROGRESS' ||
					status === 'RECEIVED' ||
					status === 'ACCEPTED'
				);

				if (scan && scan.transactionId && inProgress) {
					_.set(this.status, ['scan', 'inProgress'], true);

					this.alertMessage.emit({
						message: I18n.get('_ScanningCurrentlyInProgress_'),
						severity: 'info',
					});

					return this.scanPolling({
						customerId: this.customerId,
						transactionId: scan.transactionId,
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
					hostname: this.systemAsset.deviceName,
					ipAddress: this.systemAsset.ipAddress,
					productId: this.systemAsset.productId,
					serialNumber: this.systemAsset.serialNumber,
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
						message: I18n.get('_UnableToInitiateScan_', this.systemAsset.deviceName),
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
				const status = _.get(response, 'status');

				if (status && status === 'SUCCESS' || status === 'FAILURE') {
					this.alertMessage.emit({
						message: status === 'SUCCESS' ?
							I18n.get('_ScanningHasCompleted_') : I18n.get('_ScanningHasFailed_'),
						severity: status === 'SUCCESS' ? 'success' : 'danger',
					});

					_.set(this.status, ['scan', 'inProgress'], false);

					this.scanStatus.emit(response);

					return of({ });
				}

				return this.scanPolling(transaction);
			}),
			catchError(err => {
				this.alertMessage.emit({
					message: I18n.get('_UnableToInitiateScan_', this.systemAsset.deviceName),
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
	 * Fetches the summary data for the asset
	 * @returns the tags info
	 */
	private fetchTagsData () {
		this.status.loading.tags = true;

		return this.assetTaggingService.getAsset360Tags(this.assetTagsParams)
		.pipe(
			map((response: AssetTaggingDeviceDetails) => {
				this.tags = response.tags;
				this.status.loading.tags = false;
			}),
			catchError(err => {
				this.status.loading.tags = false;
				this.logger.error('details.component : fetchTagsData()' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Checks if our currently selected asset has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentSystemAsset = _.get(changes, ['systemAsset', 'currentValue']);
		const currentHardwareAsset = _.get(changes, ['hardwareAsset', 'currentValue']);
		if (currentSystemAsset && !changes.systemAsset.firstChange) {
			this.refresh();
		} else if (currentHardwareAsset && !changes.hardwareAsset.firstChange) {
			this.refresh();
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
	 * Refreshes the component
	 */
	public refresh () {
		if (this.hardwareAsset) {
			this.clear();
			this.status.loading.overall = true;

			this.assetTagsParams = {
				customerId: this.customerId,
				deviceId: _.get(this.hardwareAsset, 'neId'),
			};

			this.status.scan.eligible = _.get(this.systemAsset, 'isManagedNe', false) ?
				true : false;

			this.hidden = false;

			forkJoin(
				this.fetchTagsData(),
				this.checkScanStatus(),
			)
			.subscribe(() => {
				this.status.loading.overall = false;
			});
		}
	}
}