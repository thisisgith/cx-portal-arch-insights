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
	TransactionRequestResponse,
	Connectivity,
} from '@sdp-api';
import * as _ from 'lodash-es';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { LogService } from '@cisco-ngx/cui-services';
import { of, forkJoin, Subject } from 'rxjs';
import {
	map,
	catchError,
	takeUntil,
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
		scanEligible: false,
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
	 * Gets the eligibility of the device for scanning
	 * @returns the observable
	 */
	private getEligibility () {
		const params: NetworkDataGatewayService.GetEligibilityParams = {
			customerId: this.customerId,
			productId: this.asset.productId,
			serialNumber: this.asset.serialNumber,
		};

		return this.networkService.getEligibility(params)
		.pipe(
			map((response: Connectivity) => {
				this.status.scanEligible = _.get(response, 'connected', false) &&
					_.get(response, 'eligible', false);
			}),
			catchError(err => {
				this.status.loading.eligibility = false;
				this.logger.error('details-header.component : getEligibility()' +
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
					productId: this.asset.productId,
					serialNumber: this.asset.serialNumber,
				}],
			},
			requestType: 'PEC',
			transactionType: 'SCAN',
		};

		this.networkService.postDeviceTransactions(request)
		.pipe(
			map((response: TransactionRequestResponse) => {
				this.logger.debug('header.component :: initiateScan() ::' +
					`Scan Request Response ${JSON.stringify(response)}`);
			}),
			catchError(err => {
				this.logger.error('header.component : initiateScan() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		)
		.subscribe();
	}

	/**
	 * Refreshes the data
	 */
	public refresh () {
		if (_.get(this.asset, 'serialNumber')) {
			this.status.loading.overall = true;
			forkJoin(
				this.fetchCases(),
				this.getEligibility(),
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
