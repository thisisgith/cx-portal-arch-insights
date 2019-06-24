import {
	Component,
	Input,
	OnDestroy,
	OnInit,
	Output,
	EventEmitter,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

import { Observable, Subject, of } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

import { RMAService } from '@services';
import { RMARecord, RMAResponse, PartsLineDetail } from '@interfaces';
import * as _ from 'lodash';
import { environment } from '@environment';

/**
 * Data format for the special RMA display table
 */
interface RmaTableData {
	caseId?: string;
	contractNumber?: string;
	number?: string;
	products?: PartsLineDetail[];
	status?: string;
	trackingNumber?: string;
}

/**
 * Component representing "special" RMA search results on the search modal
 */
@Component({
	selector: 'app-rma-search',
	styleUrls: ['./rma-search.component.scss'],
	templateUrl: './rma-search.component.html',
})
export class RMASearchComponent implements OnInit, OnDestroy {
	@Input('rmaNumber') public rmaNumber: string;
	@Output('hide') public hide = new EventEmitter<boolean>();
	@Output('toggleGeneralSearch') public toggleGeneralSearch = new EventEmitter<{
		hide: boolean,
		searchString?: string,
	}>();

	public loading = true;
	public rma: RMARecord;
	public rmaTableData: RmaTableData;
	public caseLink: string;
	public rmaLink: string;
	public trackingLink: string;

	private refresh$ = new Subject();
	private destroy$ = new Subject();

	constructor (
		private service: RMAService,
		private logger: LogService,
	) { }

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.toggleGeneralSearch.emit({ hide: true });
		this.refresh$.pipe(
			tap(() => this.loading = true),
			switchMap(() => this.getByNumber(this.rmaNumber)),
			takeUntil(this.destroy$),
		)
		.subscribe((rmaResult: RMAResponse) => {
			this.rma = _.find(
				_.get(rmaResult, 'returns.RmaRecord'),
				(o: RMARecord) => o.rmaNo === parseInt(this.rmaNumber, 10),
			);
			if (!this.rma) {
				this.hide.emit();

				return;
			}
			this.rmaTableData = {
				caseId: _.get(this.rma, 'caseId'),
				contractNumber: _.get(this.rma, 'contractId'),
				number: `${this.rma.rmaNo}`,
				products: _.get(this.rma, 'replacementParts.partsLineDetails', []),
				status: _.get(this.rma, 'status'),
				trackingNumber: _.get(
					this.rma,
					'replacementParts.trackingInfo.trackingNumber',
				),
			};

			this.rmaLink = `${environment.rmaToolUrl}?&OrderNumber=${this.rma.rmaNo}`;
			if (
				this.rmaTableData.products.length === 1
				&& _.has(this.rmaTableData, 'products[0].partsDescription')
			) {
				this.toggleGeneralSearch.emit({
					hide: false,
					searchString: this.rmaTableData.products[0].partsDescription,
				});
			}

			this.loading = false;
		});
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
}
