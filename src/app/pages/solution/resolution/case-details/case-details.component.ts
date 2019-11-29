import {
	Component,
	EventEmitter,
	OnInit,
	OnDestroy,
	Input,
	Output,
	SimpleChanges,
} from '@angular/core';
import { CaseService, CaseDetails } from '@cui-x/services';
import { CaseDetailsService } from 'src/app/services/case-details';
import { Subject, forkJoin, of } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import { tap, switchMap, takeUntil, catchError, filter } from 'rxjs/operators';
import { Case } from '@interfaces';
import * as _ from 'lodash-es';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { CSCUploadService } from '@cui-x-views/csc';
import { UserResolve } from '@utilities';
import { InventoryService } from '@sdp-api';

/**
 * Case Details Component
 */
@Component({
	selector: 'app-case-details',
	styleUrls: ['./case-details.component.scss'],
	templateUrl: './case-details.component.html',
})
export class CaseDetailsComponent implements OnInit, OnDestroy {
	@Input() public case: Case;
	@Input() public caseDetails: CaseDetails;
	@Output() public caseDetailsChange = new EventEmitter<CaseDetails>();
	@Output() public showAssetDetails: EventEmitter<{ }> = new EventEmitter<{ }>();

	public caseNotes: any[];
	public caseFiles: any;
	public item: any;
	public loading = false;
	public tabIndex = 0;
	private refresh$ = new Subject();
	private destroy$ = new Subject();
	private severity: string;
	public numberOfFiles = 0;
	public customerId: string;
	public isAssetAvailable = false;

	constructor (
		private caseService: CaseService,
		private caseDetailsService: CaseDetailsService, private logger: LogService,
		private cuiModalService: CuiModalService, private cscService: CSCUploadService,
		private inventoryService: InventoryService, private userResolve: UserResolve,
	) {
		this.userResolve.getCustomerId()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((id: string) => {
			this.customerId = id;
		});
	}

	/**
	 * Initialization hook
	 */
	public ngOnInit () {
		this.caseDetailsService.refreshNotesList(false);
		this.refresh$.pipe(
			tap(() => {
				this.loading = true;
				this.caseNotes = [];
				this.numberOfFiles = 0;
			}),
			switchMap(() => forkJoin(
				this.getCaseDetails(),
				this.getCaseNotes(),
				this.caseDetailsService.getCaseFiles(this.case.caseNumber),
				this.getAssetAvailability(),
			)),
			takeUntil(this.destroy$),
		)
			.subscribe(results => {
				this.loading = false;
				this.caseDetails = results[0];
				this.caseDetailsChange.emit(this.caseDetails);
				this.caseNotes = results[1];
				this.populateCaseFilesList(results[2]);
				const assetDetails = _.get(results[3], 'data');
				if (assetDetails && assetDetails.length > 0) {
					this.isAssetAvailable = true;
				}
			});

		this.caseDetailsService.addNote$
			.subscribe((refresh: boolean) => {
				if (refresh) {
					this.logger.debug(`case-details.component :: ${refresh}`);
					this.loading = true;
					this.tabIndex = 1;
					this.getCaseNotes()
						.pipe(
							tap(() => {
								this.caseNotes = [];
							}),
							takeUntil(this.destroy$),
						)
						.subscribe(caseNotes => {
							this.caseNotes = caseNotes;
							this.loading = false;
						});
				}
			});

		this.cuiModalService.onSuccess
			.pipe(
				filter(() => this.severity === 'success',
				),
				tap(() => {
					this.tabIndex = 2;
					this.loading = true;
				}),
				switchMap(() => forkJoin(
					this.getCaseNotes(),
					this.caseDetailsService.getCaseFiles(this.case.caseNumber),
					),
				),
				takeUntil(this.destroy$),
			)
			.subscribe(results => {
				this.caseNotes = results[0];
				this.populateCaseFilesList(results[1]);
				this.loading = false;
			});

		this.cscService.getCurrentStatus()
			.subscribe(res => {
				this.severity = res.severity;
			});

		this.refresh();
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		if (this.case) {
			this.refresh$.next();
		}
	}

	/**
	 * Populates case files list
	 * @param result case files list
	 */
	public populateCaseFilesList (result) {
		if (_.get(result,
			['result', 'response', 'getBrokerResponse', 'error'])) {
			this.numberOfFiles = 0;
			this.caseFiles = { };
		} else {
			this.caseFiles = _.get(result,
				['result', 'response', 'getBrokerResponse', 'downloadInfo'], []);
			this.numberOfFiles = _.get(this.caseFiles, 'noOfFiles');
		}
	}

	/**
	 * getCaseDetails function
	 * @returns the case details
	 */
	public getCaseDetails () {
		return this.caseService.fetchCaseDetails(this.case.caseNumber)
			.pipe(
				catchError(err => {
					this.logger.error('casedetails.component : getCaseDetails() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);
	}

	/**
	 * fetches case notes
	 * @returns case notes
	 */
	public getCaseNotes () {
		return this.caseService.fetchCaseNotes(this.case.caseNumber, true)
			.pipe(
				catchError(err => {
					this.logger.error('casedetails.component : getCaseNotes() ' +
						`:: Error : (${err.status}) ${err.message}`);

					return of({ });
				}),
			);
	}

	/**
	 * fetch asset details to check availability
	 * @returns Observable
	 */
	public getAssetAvailability () {
		return this.inventoryService.getHardware({
			customerId: this.customerId,
			serialNumber: [this.case.serialNumber],
		})
		.pipe(
			catchError(err => {
				this.logger.error('casedetails.component : getAssetAvailability() ' +
					`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}),
		);
	}

	/**
	 * Used for Opening the Asset 360 View
	 */
	public showAssetDetailsView () {
		this.showAssetDetails.emit({ serialNumber : this.caseDetails.serialNumber });
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Checks if our currently selected case has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentCase = _.get(changes, ['case', 'currentValue']);
		if (currentCase && !changes.case.firstChange) {
			this.tabIndex = 0; // move to summary tab
			this.refresh();
		}
	}
}
