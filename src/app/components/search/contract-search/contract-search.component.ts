import {
	Component,
	EventEmitter,
	OnInit,
	OnChanges,
	OnDestroy,
	Input,
	Output,
	forwardRef,
} from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import * as _ from 'lodash-es';

import { LogService } from '@cisco-ngx/cui-services';

import { SpecialSearchComponent } from '../special-search/special-search.component';
import { DeviceContractResponse, ContractsService, DeviceContractInfo } from '@sdp-api';
import { SearchQuery } from '@interfaces';
import { UserResolve } from '@utilities';

/**
 * Mapping of Contract statuses to status colors
 * TODO: Get definitive list of possible statuses/colors
 */
enum StatusColorMap {
	ACTIVE = 'text-success',
	ENTERED = 'text-turquoise',
	EXPIRED = 'text-muted',
	INACTIVE = 'text-muted',
	OVERDUE = 'text-warning',
	'QA HOLD' = 'text-warning-alt',
	SERVICE = 'text-info',
	SIGNED = 'text-info',
	TERMINATED = 'text-danger',
	UNKNOWN = 'text-muted',
}

/**
 * Component to fetch/display contract search results
 */
@Component({
	providers: [{
		provide: SpecialSearchComponent,
		useExisting: forwardRef(() => ContractSearchComponent,
	)}],
	selector: 'app-contract-search',
	styleUrls: ['./contract-search.component.scss'],
	templateUrl: './contract-search.component.html',
})
export class ContractSearchComponent extends SpecialSearchComponent
	implements OnInit, OnChanges, OnDestroy {
	@Input('contractNumber') public contractNumber: SearchQuery;
	@Output('hide') public hide = new EventEmitter<boolean>();
	public loading = true;
	public loadingCoverages = true;
	public contractData: DeviceContractInfo;
	public coverageCount: number;
	public statusColor: StatusColorMap;
	public showCxInfo = false;

	private customerId: string;
	private refresh$ = new Subject();
	private destroy$ = new Subject();

	public contractExpirationStatusColor: string;
	public expirationDatePadding = '';

	constructor (
		private contractsService: ContractsService,
		private logger: LogService,
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
		/** Get main contract details */
		this.refresh$.pipe(
			tap(() => {
				this.loading = true;
				this.hide.emit(false);
			}),
			switchMap(() => this.getData(this.contractNumber.query, this.customerId)),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.loading = false;
			this.contractData = result ? result.data[0] : null;
			if (this.contractData) {
				const statusKey = _.get(this.contractData, 'contractStatus', 'UNKNOWN')
					.toUpperCase();
				this.statusColor = _.get(StatusColorMap, statusKey);
				const ContractExpDate = new Date(_.get(this.contractData, 'contractEndDate'));
				this.contractExpirationStatusColor = this.getExpirationStatusColor(ContractExpDate);

			} else {
				this.hide.emit(true);
			}
		});
		/** Get contract coverages */
		this.refresh$.pipe(
			tap(() => {
				this.loadingCoverages = true;
			}),
			switchMap(() => this.getCoverages(this.contractNumber.query, this.customerId)),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			if (result === null) {
				this.coverageCount = null;

				return;
			}
			this.loadingCoverages = false;
			this.coverageCount = _.toNumber(result.headers.get('X-API-RESULT-COUNT'));
		});

		this.refresh$.next();
	}

	/**
	 * On Destroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * OnChanges lifecycle hook
	 * Refresh API data whenever contractNumber changes
	 */
	public ngOnChanges () {
		this.refresh$.next();
	}

	/**
	 * Fetch contract API data
	 * TODO: some changes need to be made to the contract swagger and consequently the
	 * service itself. This will include getting the devices covered count which isn't there yet
	 * @param contractNumber number to fetch data for
	 * @param customerId id of customer whose contracts we're searching
	 * @returns Observable with response data
	 */
	private getData (contractNumber: string, customerId: string):
		Observable<DeviceContractResponse> {
		return this.contractsService.getContractDetails({
			customerId,
			contractNumber: [parseInt(contractNumber, 10)],
		})
		.pipe(
			catchError(err => {
				this.logger.error(`Contract Data :: ${contractNumber} :: Error ${err}`);

				return of(null);
			}),
		);
	}

	/**
	 * Fetch contract coverages
	 * @param contractNumber number to fetch data for
	 * @param customerId id of customer whose contracts we're searching
	 * @returns Observable with http response
	 */
	private getCoverages (contractNumber: string, customerId: string):
	Observable<HttpResponse<null>> {
		return this.contractsService.headProductsCoveragesResponse(
			{
				contractNumber,
				customerId,
				coverage: 'covered',
			},
		)
		.pipe(
			catchError(err => {
				this.logger.error(`Coverage :: ${contractNumber} :: Error ${err}`);

				return of(null);
			}),
		);
	}

	/**
	 * Fetch colour status Expiration for Contract
	 * based on current date - expiration date
	 * @param contractExpDate takes expiration date as input
	 * @returns colour to be displayed
	 */
	private getExpirationStatusColor (contractExpDate: any) {
		if (contractExpDate) {
			const dayInMilliseconds = (1000 * 60 * 60 * 24);
			const dateNow: any = new Date();
			const dateDifference =  Math.floor((contractExpDate - dateNow) / dayInMilliseconds);
			this.expirationDatePadding = (dateDifference < 90) ? 'qtr-padding-left' : '';

			return (dateDifference < 0) ? 'background-expired-lightRed' :
			((dateDifference < 90) ? 'background-warning-lightOrange' : '');
		}
	}

}
