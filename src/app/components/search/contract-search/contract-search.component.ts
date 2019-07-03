import {
	Component,
	EventEmitter,
	OnInit,
	OnChanges,
	OnDestroy,
	Input,
	Output,
	TemplateRef,
	ViewChild,
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
	@ViewChild('sidebar', { static: true, read: TemplateRef })
		public sidebarContent: TemplateRef<any>;
	@Input('contractNumber') public contractNumber: SearchQuery;
	@Output('hide') public hide = new EventEmitter<boolean>();
	public loading = true;
	public loadingCoverages = true;
	public contractData: DeviceContractInfo;
	public coverageCount: number;

	private customerId = '2431199';
	private refresh$ = new Subject();
	private destroy$ = new Subject();

	constructor (
		private contractsService: ContractsService,
		private logger: LogService,
	) {
		super();
		this.logger.debug('ContractSearchComponent Created!');
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
			if (!this.contractData) {
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
}
