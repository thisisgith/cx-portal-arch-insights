import {
	Component,
	Input,
	OnInit,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { CaseParams, CaseService } from '@cui-x/services';
import {
	Asset,
	NetworkDataGatewayService,
	TransactionRequest,
	Transaction,
	TransactionRequestResponse,
	TransactionStatusResponse,
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
} from 'rxjs/operators';
import { CaseOpenComponent } from '../../../case/case-open/case-open.component';
import { UserResolve } from '@utilities';

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
export class AssetDetailsHeaderComponent implements OnChanges, OnInit {
	@Input('asset') public asset: Asset;

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
	private customerId: string;

	constructor (
		private caseService: CaseService,
		private cuiModalService: CuiModalService,
		private logger: LogService,
		private networkService: NetworkDataGatewayService,
		private userResolve: UserResolve,
	) {
		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
		});
	}

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
			map(data => {
				this.openCases = _.get(data, 'content', []);
				this.status.loading.cases = false;
			}),
			catchError(err => {
				this.openCases = [];
				this.status.loading.cases = false;
				this.logger.error('header.component : fetchCases()' +
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
	 * Initiates a scan
	 */
	public initiateScan () {
		const request: TransactionRequest = {
			// TODO: Temporary for Testing
			// customerId: '231215372',
			customerId: this.customerId,
			neCount: 1,
			requestBody: {
				deviceOptions: 'LIST',
				devices: [{
					// TODO: Temporary for Testing
					// hostname: '6807',
					// ipAddress: '10.13.1.1',
					// productId: 'C6807-XL',
					// serialNumber: 'SMC1803008B',
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
				mergeMap((response: TransactionRequestResponse) => {
					const transaction: Transaction = _.head(response);

					if (_.get(transaction, 'transactionId')) {
						_.set(this.status, ['scan', 'inProgress'], true);

						return this.scanPolling(transaction);
					}

					return of();
				}),
				catchError(err => {
					this.logger.error('header.component : initiateScan() ' +
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
			// TODO: Temporary for Testing
			// customerId: '231215372',
			customerId: this.customerId,
			transactionId: transaction.transactionId,
		})
		.pipe(
			mergeMap((response: TransactionStatusResponse) => {
				if (response.status === 'SUCCESS') {
					_.set(this.status, ['scan', 'inProgress'], false);

					return of();
				}

				return this.scanPolling(transaction);
			}),
			catchError(err => {
				this.logger.error('header.component : initiatePolling() ' +
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
