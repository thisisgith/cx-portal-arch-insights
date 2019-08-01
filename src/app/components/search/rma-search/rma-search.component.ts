import {
	Component,
	Input,
	OnDestroy,
	OnChanges,
	OnInit,
	Output,
	EventEmitter,
	forwardRef,
} from '@angular/core';
import { Router } from '@angular/router';

import { LogService } from '@cisco-ngx/cui-services';

import { Observable, Subject, of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import { RMAService, SearchService } from '@services';
import { RMARecord, RMAResponse, PartsLineDetail, SearchContext, SearchQuery } from '@interfaces';
import * as _ from 'lodash-es';
import { environment } from '@environment';
import { SpecialSearchComponent } from '../special-search/special-search.component';

/**
 * Data format for the special RMA display table
 */
interface RmaTableData {
	caseId?: string;
	contractNumber?: string;
	courier?: string;
	number?: string;
	products?: PartsLineDetail[];
	status?: string;
	trackingNumber?: string;
}

/**
 * Mapping of RMA statuses to status icon colors
 * TODO: Get definitive list of possible statuses/colors
 */
enum StatusColorMap {
	'IN-PROGRESS' = 'text-success',
	UNKNOWN = 'text-muted',
}

/**
 * Component representing "special" RMA search results on the search modal
 */
@Component({
	providers: [{
		provide: SpecialSearchComponent,
		useExisting: forwardRef(() => RMASearchComponent,
	)}],
	selector: 'app-rma-search',
	styleUrls: ['./rma-search.component.scss'],
	templateUrl: './rma-search.component.html',
})
export class RMASearchComponent extends SpecialSearchComponent
	implements OnInit, OnChanges, OnDestroy {
	@Input('rmaNumber') public rmaNumber: SearchQuery;
	@Output('hide') public hide = new EventEmitter<boolean>();
	/** Emitter to show or hide general search */
	@Output('toggleGeneralSearch') public toggleGeneralSearch = new EventEmitter<{
		hide: boolean,
		searchString?: string,
		context?: SearchContext,
	}>();

	public loading = true;
	public rma: RMARecord;
	public rmaTableData: RmaTableData;
	public statusColor: StatusColorMap;
	public caseLink: string;
	public rmaLink: string;
	public trackingLink: string;

	private refresh$ = new Subject();
	private destroy$ = new Subject();

	constructor (
		private router: Router,
		private searchService: SearchService,
		private service: RMAService,
		private logger: LogService,
	) {
		super();
	}

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.refresh$.pipe(
			tap(() => {
				this.toggleGeneralSearch.emit({ hide: true });
				this.loading = true;
				this.hide.emit(false);
			}),
			switchMap(() => this.getByNumber(this.rmaNumber.query)),
			takeUntil(this.destroy$),
		)
		.subscribe((rmaResult: RMAResponse) => {
			this.rma = _.find(
				_.get(rmaResult, 'returns.RmaRecord'),
				(o: RMARecord) => o.rmaNo === parseInt(this.rmaNumber.query, 10),
			);
			if (!this.rma) {
				this.toggleGeneralSearch.emit({ hide: false });
				this.hide.emit(true);

				return;
			}
			this.rmaTableData = {
				caseId: _.get(this.rma, 'caseId'),
				contractNumber: _.get(this.rma, 'contractId'),
				courier: _.get(
					this.rma,
					['replacementParts', 'trackingInfo', 'courier'],
					_.get(this.rma, ['replacementParts', 'trackingInfo', 'courierList']),
				),
				number: `${this.rma.rmaNo}`,
				products: _.get(this.rma, 'replacementParts.partsLineDetails', []),
				status: _.get(this.rma, 'status'),
				trackingNumber: _.get(
					this.rma,
					'replacementParts.trackingInfo.trackingNumber',
				),
			};
			const statusKey = _.get(this.rmaTableData, 'status', 'UNKNOWN')
				.toUpperCase();
			this.statusColor = _.get(StatusColorMap, statusKey);
			this.rmaLink = `${environment.rmaToolUrl}?&OrderNumber=${this.rma.rmaNo}`;
			if (
				this.rmaTableData.products.length === 1
				&& _.has(this.rmaTableData, 'products[0].partsDescription')
			) {
				this.toggleGeneralSearch.emit({
					// Sending product name directly
					// context: SearchContext.serialno
					hide: false,
					searchString: this.rmaTableData.products[0].partsDescription,
				});
			} else {
				this.toggleGeneralSearch.emit({ hide: false });
			}

			this.loading = false;
		});
		this.refresh$.next();
	}

	/**
	 * OnChanges Lifecycle Hook
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
	 * Send RMA request
	 * @param rmaNumber search term string
	 * @returns observable with results
	 */
	private getByNumber (rmaNumber: string): Observable<RMAResponse> {
		return this.service.getByNumber(rmaNumber)
			.pipe(catchError(err => {
				this.logger.error(`RMA Fetch :: ${rmaNumber} :: Error ${err}`);

				return of(null);
			}));
	}

	/**
	 * Navigate to a single case details
	 * @param casenum case number to view details for
	 */
	public onViewCaseDetails (casenum: string) {
		this.router.navigate(
			['solution/resolution'],
			{ queryParams: { case: casenum } },
		);
		this.searchService.close();
	}
}
