import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { CaseDetails, CaseService } from '@cui-x/services';
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
	public caseParams = {
		nocache: Date.now(),
		page: 0,
		search: '',
		size: 10,
		sort: 'lastModifiedDate,DESC',
		statusTypes: 'O',
	};
	public paginationCount = '';
	@ViewChild('severityTmpl', { static: true }) public severityTemplate: TemplateRef<any>;
	@ViewChild('updatedTmpl', { static: true }) public updatedTemplate: TemplateRef<any>;

	public searchCasesForm: FormGroup;
	public isSearchCaseFormInvalid = false;

	constructor (
		private logger: LogService,
		private caseService: CaseService,
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
	) { }

	/** ngOnInit */
	public ngOnInit () {
		/** Watch query params for a case number, show that 360 */
		this.route.queryParamMap.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((params: ParamMap) => {
			const casenum = params.get('casenum');
			if (casenum) {
				this.selectedCase = {
					caseNumber: casenum,
				};
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
					key: 'priority',
					name: I18n.get('_RMACaseSeverity_'),
					sortable: true,
					template: this.severityTemplate,
				},
				{
					key: 'caseNumber',
					name: I18n.get('_RMACaseID_'),
					sortable: true,
				},
				{
					key: 'deviceName',
					name: I18n.get('_RMACaseDevice_'),
					sortable: true,
				},
				{
					key: 'summary',
					name: I18n.get('_RMACaseSummary_'),
					sortable: true,
				},
				{
					key: 'status',
					name: I18n.get('_RMACaseStatus_'),
					sortable: true,
				},
				{
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
	 * calls CSOne's API to get case details
	 * @param caseNo to be searched for
	 * @returns void
	 */
	public getCaseDetails (caseNo: string): Observable<any> {
		return this.caseService.fetchCaseDetails(caseNo);
	}

	/**
	 * on click of table row show case360
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
