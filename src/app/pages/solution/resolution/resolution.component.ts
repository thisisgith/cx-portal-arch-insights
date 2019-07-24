import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { CaseParams, CaseDetails, CaseService } from '@cui-x/services';
import { LogService } from '@cisco-ngx/cui-services';

import { Observable, Subject } from 'rxjs';

import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { I18n } from '@cisco-ngx/cui-utils';
import { tap, switchMap, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash-es';

import { caseSeverities } from '@classes';
import { Case } from '@interfaces';

/**
 * Resolution Component
 */
@Component({
	styleUrls: ['./resolution.component.scss'],
	templateUrl: './resolution.component.html',
})
export class ResolutionComponent {
	public selectedCase: Case;
	public selectedDetails: CaseDetails;
	public fullscreen = false;

	public caseListData: any[];
	public caseListTableOptions: CuiTableOptions;
	private refresh$ = new Subject();
	private destroy$ = new Subject();
	public isLoading = true;
	public paginationInfo = {
		currentPage: 0,
		totalElements: 0, // total number of records for user
	};
	public caseParams: CaseParams = new CaseParams({
		nocache: new Date(),
		page: 0,
		size: 10,
		sort: 'lastModifiedDate,DESC',
		statusTypes: 'O',
	});
	public paginationCount = '';
	@ViewChild('severityTmpl', { static: true }) public severityTemplate: TemplateRef<any>;
	@ViewChild('updatedTmpl', { static: true }) public updatedTemplate: TemplateRef<any>;

	public searchCasesForm: FormGroup;
	public isSearchCaseFormInvalid = false;

	constructor (
		private logger: LogService,
		private caseService: CaseService,
		private formBuilder: FormBuilder,
		public route: ActivatedRoute,
	) { }

	/** ngOnInit */
	public ngOnInit () {
		/** Watch query params for a case number, show that 360 */
		this.route.queryParamMap.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((params: ParamMap) => {
			const casenum = params.get('case');
			if (casenum) {
				this.selectedCase = {
					caseNumber: casenum,
				};
			}
			const serialnum = params.get('serial');
			if (serialnum) {
				_.set(this.caseParams, 'serialNumbers', serialnum);
			}
		});
		this.refresh$.pipe(
			tap(() => {
				this.isLoading = true;
			}),
			switchMap(() =>
				this.getCaseList(),
			),
			takeUntil(this.destroy$),
		)
		.subscribe(cases => {
			this.isLoading = false;
			this.caseListData = cases.content;

			const first = (this.caseParams.size * (this.paginationInfo.currentPage)) + 1;
			let last = (this.caseParams.size * (this.paginationInfo.currentPage + 1));
			if (last > cases.totalElements) {
				last = cases.totalElements;
			}
			this.paginationCount = `${first}-${last}`;
			this.paginationInfo.totalElements = cases.totalElements ? cases.totalElements : 0;

			// If case selected via query params and it's in the table, select the row
			_.each(this.caseListData, data => {
				if (_.get(this.selectedCase, 'caseNumber') === _.get(data, 'caseNumber')) {
					_.set(data, 'active', true);
				} else {
					_.set(data, 'active', false);
				}
			});
		}, err => {
			this.isLoading = false;
			this.logger.error(`resolution component : case list - ${err}`);
		});

		this.refresh$.next();

		this.searchCasesForm = this.formBuilder.group({
			caseNo: ['',
				[Validators.pattern('^[0-9]+$'), Validators.minLength(9), Validators.maxLength(9)],
			],
		});

		this.caseListTableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					autoIdHeader: 'Severity-Header',
					key: 'priority',
					name: I18n.get('_RMACaseSeverity_'),
					sortable: true,
					template: this.severityTemplate,
				},
				{
					autoIdHeader: 'Case ID-Header',
					key: 'caseNumber',
					name: I18n.get('_RMACaseID_'),
					sortable: true,
				},
				{
					autoIdHeader: 'Device-Header',
					key: 'deviceName',
					name: I18n.get('_RMACaseDevice_'),
					sortable: true,
				},
				{
					autoIdHeader: 'Summary-Header',
					key: 'summary',
					name: I18n.get('_RMACaseSummary_'),
					sortable: true,
				},
				{
					autoIdHeader: 'Status-Header',
					key: 'status',
					name: I18n.get('_RMACaseStatus_'),
					sortable: true,
				},
				{
					autoIdHeader: 'Updated-Header',
					key: 'lastModifiedDate',
					name: I18n.get('_RMACaseUpdatedDate_'),
					sortable: true,
					sorting: true,
					template: this.updatedTemplate,
				},
			],
			hover: true,
			singleSelect: true,
			striped: false,
		});
	}

	/**
	 * get the color of severity icon
	 * @param severity of case
	 * @returns void
	 */
	public getSeverityColor (severity: string) {
		const severityInt = parseInt(severity, 10);

		return _.get(caseSeverities[severityInt], 'class');
	}

	/**
	 * sort each column in case table view
	 * @param evt for table sort information
	 */
	public onTableSortingChanged (evt: any) {
		this.caseParams.sort = `${evt.key},${evt.sortDirection}`;
		this.refresh$.next();
	}

	/**
	 * update the page records based on page number
	 * @param pageInfo used in pagination of table
	 */
	public onPagerUpdated (pageInfo: any) {
		this.paginationInfo.currentPage = pageInfo.page;
		this.caseParams.page = pageInfo.page;
		this.refresh$.next();
	}

	/**
	 * search for input case number
	 */
	public searchCaseNumber () {
		if (this.searchCasesForm.invalid) {
			this.isSearchCaseFormInvalid = true;

			return;
		}

		this.isSearchCaseFormInvalid = false;
		this.caseParams.search = '';

		if (this.searchCasesForm.get('caseNo').value) {
			this.caseParams.search = this.searchCasesForm.get('caseNo').value;
		}

		this.caseParams.sort = 'lastModifiedDate,DESC';
		this.caseParams.page = 0;
		this.refresh$.next();
	}

	/**
	 * Call CSOne's API to get the case list
	 * @returns Observable with response data.
	 */
	public getCaseList (): Observable<any> {
		return this.caseService.read(this.caseParams);
	}

	/**
	 * On click of table row show case360
	 * @param event is a Case
	 */
	public onTableRowClicked (event: Case) {
		if (event.caseNumber === _.get(this.selectedCase, 'caseNumber')) {
			_.set(event, 'active', false);
			this.selectedCase = null;
			this.selectedDetails = null;

			return;
		}
		this.selectedCase = event;
	}

	/**
	 * Fired when the user closes the case details 360
	 */
	public detailsClose () {
		this.selectedCase = null;
		this.selectedDetails = null;
		_.each(this.caseListData, data => {
			_.set(data, 'active', false);
		});
	}
	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
