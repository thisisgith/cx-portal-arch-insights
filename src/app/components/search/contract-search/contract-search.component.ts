import {
	Component,
	OnInit,
	OnChanges,
	OnDestroy,
	Input,
	TemplateRef,
	ViewChild,
	forwardRef,
} from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import { LogService } from '@cisco-ngx/cui-services';

import { SpecialSearchComponent } from '../special-search/special-search.component';
import { ContractsResponse, ContractsService, ContractInfo } from '@cui-x/sdp-api';

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
	@Input('contractNumber') public contractNumber: string;
	public loading = true;
	public contractData: ContractInfo;

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
		this.refresh$.pipe(
			tap(() => this.loading = true),
			switchMap(() => this.getData(this.contractNumber, this.customerId)),
			takeUntil(this.destroy$),
		)
		.subscribe(result => {
			this.loading = false;
			this.contractData = result ? result.data[0] : null;
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
	 * TODO some changes need to be made to the contract swagger and consequently the
	 * service itself. This will include getting the devices covered count which isn't there yet
	 * @param contractNumber number to fetch data for
	 * @param customerId id of customer whose contracts we're searching
	 * @returns Observable with response data
	 */
	private getData (contractNumber: string, customerId: string):
		Observable<ContractsResponse> {
		return this.contractsService.getContracts({
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
}
