import { Component, ViewChild, TemplateRef } from '@angular/core';

import { CaseService } from '@cui-x/services';
import { LogService } from '@cisco-ngx/cui-services';

import { Observable, Subject } from 'rxjs';

import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { I18n } from '@cisco-ngx/cui-utils';
import { tap, switchMap, takeUntil } from 'rxjs/operators';

/**
 * Resolution Component
 */
@Component({
	styleUrls: ['./resolution.component.scss'],
	templateUrl: './resolution.component.html',
})
export class ResolutionComponent {
	public caseListData: any[];
	public caseListTableOptions: CuiTableOptions;
	private refresh$ = new Subject();
	private destroy$ = new Subject();
	public isLoading = true;
	public paginationInfo = {
		totalElements: 0, // total number of records for user
		currentPage: 0,
	};
	public caseParams = {
		nocache: Date.now(),
		statusTypes: 'O',
		page: 0,
		size: 10,
		sort: 'lastModifiedDate,DESC',
		search: '',
	};
	public paginationCount = '';
	@ViewChild('severityTmpl', { static: true }) public severityTemplate: TemplateRef<any>;
	@ViewChild('caseIDTmpl', { static: true }) public caseIDTemplate: TemplateRef<any>;
	@ViewChild('deviceTmpl', { static: true }) public deviceTemplate: TemplateRef<any>;
	@ViewChild('summaryTmpl', { static: true }) public summaryTemplate: TemplateRef<any>;
	@ViewChild('statusTmpl', { static: true }) public statusTemplate: TemplateRef<any>;
	@ViewChild('updatedTmpl', { static: true }) public updatedTemplate: TemplateRef<any>;

	public searchCasesForm: FormGroup;
	public isSearchCaseFormInvalid = false;

	constructor (private logger: LogService, private caseService: CaseService,
		private formBuilder: FormBuilder) { }

	/** ngOnInit */
	public ngOnInit () {
		// this.getCaseList()
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
			});

		this.refresh$.next();

		this.searchCasesForm = this.formBuilder.group({
			caseNo: ['',
				[Validators.pattern('^[0-9]+$'), Validators.minLength(9), Validators.maxLength(9)],
			],
		});

		this.caseListTableOptions = new CuiTableOptions({
			bordered: false,
			striped: false,
			hover: true,
			columns: [
				{
					name: I18n.get('_RMACaseSeverity_'),
					sortable: true,
					key: 'priority',
					template: this.severityTemplate,
				},
				{
					name: I18n.get('_RMACaseID_'),
					sortable: true,
					key: 'caseNumber',
					template: this.caseIDTemplate,
				},
				{
					name: I18n.get('_RMACaseDevice_'),
					sortable: true,
					key: 'deviceName',
					template: this.deviceTemplate,
				},
				{
					name: I18n.get('_RMACaseSummary_'),
					sortable: true,
					key: 'summary',
					template: this.summaryTemplate,
				},
				{
					name: I18n.get('_RMACaseStatus_'),
					sortable: true,
					key: 'status',
					template: this.statusTemplate,
				},
				{
					name: I18n.get('_RMACaseUpdatedDate_'),
					sortable: true,
					sorting: true,
					key: 'lastModifiedDate',
					template: this.updatedTemplate,
				},
			],
		});
	}

	/**
	 * get the color of severity icon
	 * @param severity of case
	 * @returns void
	 */
	public getSeverityColor (severity: string) {
		switch (severity) {
			case '1': return 'red';
				break;
			case '2': return 'orange';
				break;
			case '3': return 'yellow';
				break;
			case '4': return 'blue';
				break;
		}
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
			// '688296392' - response from mock
			this.refresh$.next();
		} else {
			this.caseParams.sort = 'lastModifiedDate,DESC';
			this.caseParams.page = 0;
			this.refresh$.next();
		}
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

}
