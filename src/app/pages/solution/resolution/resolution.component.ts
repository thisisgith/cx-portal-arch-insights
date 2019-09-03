import { Component, ViewChild, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CaseParams, CaseDetails, CaseService } from '@cui-x/services';
import { LogService } from '@cisco-ngx/cui-services';

import { Observable, Subject, of, forkJoin } from 'rxjs';

import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { I18n } from '@cisco-ngx/cui-utils';
import { tap, switchMap, takeUntil, catchError, map } from 'rxjs/operators';

import * as _ from 'lodash-es';
import { DateTime } from 'luxon';

import { caseSeverities } from '@classes';
import { Case, VisualFilter } from '@interfaces';

/**
 * Interface for series data used by visual filters.
 */
interface FilterData {
	barLabel?: string;
	color?: string;
	filter: string;
	label: string;
	selected: boolean;
	value: number;
}

/**
 * Master list of case statuses to filter on.
 * TODO: Get full list or make dynamic using API.
 */
const statusList: string[] = [
	'Cisco Pending',
	'Close Pending',
	'Customer Pending',
	'Customer Requested Closure',
	'Customer Updated',
	'New',
	'Release Pending',
	'Service Order Pending',
];

/**
 * Array of default data for the status filter
 */
const defaultStatusFilterData: FilterData[] =
_.map(statusList, status => ({
	filter: status,
	label: status,
	selected: false,
}));

/**
 * Array of default data for the severity filter
 */
const defaultSeverityFilterData: FilterData[] =
_.map(Object.entries(caseSeverities), severityMap => ({
	color: severityMap[1].color,
	filter: severityMap[0],
	label: `S${severityMap[0]}`,
	selected: false,
}));

/**
 * List of filter names that aren't stored under the "filters" case parameter
 * (due to the way the case service processes them)
 */
const otherFilters = ['hasRMAs', 'lastUpdateFrom', 'lastUpdateTo',
	'dateCreatedFrom', 'dateCreatedTo'];

/** 1 day ago */
const oneDay = DateTime.local()
	.minus({ days: 1 })
	.toUTC()
	.toISO();
/** 1 week ago */
const oneWeek = DateTime.local()
	.minus({ weeks: 1 })
	.toUTC()
	.toISO();
/** 2 weeks ago */
const twoWeeks = DateTime.local()
	.minus({ weeks: 2 })
	.toUTC()
	.toISO();

/** Labels and subfilters maps for the last updated filter */
const lastUpdatedFilters = [
	{
		barLabel: 'Updated ≤24H Ago',
		label: '≤24 hr',
		lastUpdateFrom: oneDay,
	},
	{
		barLabel: 'Updated 1D-1W Ago',
		label: '>1 day',
		lastUpdateFrom: oneWeek,
		lastUpdateTo: oneDay,
	},
	{
		barLabel: 'Updated >1W Ago',
		label: '>1 week',
		lastUpdateTo: oneWeek,
	},
];

/** Labels and subfilters maps for the duration open filter */
const durationOpenFilters = [
	{
		barLabel: 'Opened ≤24H Ago',
		dateCreatedFrom: oneDay,
		label: '≤24 hr',
	},
	{
		barLabel: 'Opened 1D-1W Ago',
		dateCreatedFrom: oneWeek,
		dateCreatedTo: oneDay,
		label: '>1 day',
	},
	{
		barLabel: 'Opened 1W-2W Ago',
		dateCreatedFrom: twoWeeks,
		dateCreatedTo: oneWeek,
		label: '>1 week',
	},
	{
		barLabel: 'Opened >2W Ago',
		dateCreatedTo: twoWeeks,
		label: '>2 weeks',
	},
];

/**
 * Array of default data for the last updated filter
 */
const defaultLastUpdatedFilterData: FilterData[] =
_.map(lastUpdatedFilters, fields => ({
	barLabel: fields.barLabel,
	filter: _.pick(fields, ['lastUpdateFrom', 'lastUpdateTo']),
	label: fields.label,
	selected: false,
}));

/**
 * Array of default data for the duration open filter
 */
const defaultDurationOpenFilterData: FilterData[] =
_.map(durationOpenFilters, fields => ({
	barLabel: fields.barLabel,
	filter: _.pick(fields, ['dateCreatedFrom', 'dateCreatedTo']),
	label: fields.label,
	selected: false,
}));

/**
 * Array of default data for the severity filter
 */
const defaultRmaFilterData: FilterData[] =
_.map(['No RMAs', 'With RMAs'], label => ({
	label,
	filter: label === 'No RMAs' ? 'F' : 'T',
	selected: false,
}));

/**
 * Resolution Component
 */
@Component({
	styleUrls: ['./resolution.component.scss'],
	templateUrl: './resolution.component.html',
})
export class ResolutionComponent implements OnInit, OnDestroy {
	@ViewChild('totalFilter', { static: true }) private totalFilterTemplate: TemplateRef<{ }>;
	@ViewChild('pieChartFilter', { static: true }) private pieChartFilterTemplate: TemplateRef<{ }>;
	@ViewChild('barChartFilter', { static: true }) private barChartFilterTemplate: TemplateRef<{ }>;
	@ViewChild('columnChartFilter', { static: true })
		private columnChartFilterTemplate: TemplateRef<{ }>;

	@ViewChild('severityTmpl', { static: true }) public severityTemplate: TemplateRef<any>;
	@ViewChild('updatedTmpl', { static: true }) public updatedTemplate: TemplateRef<any>;

	public selectedCase: Case;
	public selectedDetails: CaseDetails;
	public fullscreen = false;

	public caseListData: any[];
	public caseListTableOptions: CuiTableOptions;
	public filters: VisualFilter[];
	public mainContent = 'cases';
	public filterCollapse = false;
	public filtered = false;
	private refresh$ = new Subject();
	private destroy$ = new Subject();
	public isLoading = true;
	public rmaCases: number;
	public paginationInfo = {
		currentPage: 0,
		totalElements: 0, // total number of records for user
	};
	public caseParams: CaseParams = {
		filter: [],
		nocache: Date.now(),
		page: 0,
		search: '',
		size: 10,
		sort: 'lastModifiedDate,DESC',
		statusTypes: 'O',
	};
	public paginationCount = '';

	public searchCasesForm: FormGroup;
	public isSearchCaseFormInvalid = false;

	constructor (
		private logger: LogService,
		private caseService: CaseService,
		private formBuilder: FormBuilder,
		public route: ActivatedRoute,
		private router: Router,
	) { }

	/** ngOnInit */
	public ngOnInit () {
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

		this.route.queryParams
		.subscribe(params => {
			if (params.case) {
				this.selectedCase = {
					caseNumber: params.case,
				};
				this.searchCasesForm.patchValue(params.case);
				_.set(this.caseParams, 'caseNumbers', params.case);
			}

			if (params.serial) {
				_.set(this.caseParams, 'serialNumbers', params.serial);
			}

			if (params.filter) {
				_.set(this.caseParams, 'filter', _.castArray(params.filter));
			}

			if (params.lastUpdated) {
				const filter = _.find(defaultLastUpdatedFilterData, { label: params.lastUpdated })
								.filter;
				_.assign(this.caseParams, ...filter);
			}

			if (params.durationOpen) {
				const filter = _.find(defaultDurationOpenFilterData, { label: params.durationOpen })
								.filter;
				_.assign(this.caseParams, ...filter);
			}

			if (params.hasRMAs) {
				_.set(this.caseParams, 'hasRMAs', params.hasRMAs);
			}

			if (params.page) {
				_.set(this.caseParams, 'coverage', params.page);
			}

			if (params.search) {
				_.set(this.caseParams, 'search', params.search);
			}

			if (params.sort) {
				_.set(this.caseParams, 'sort', params.sort);
			}
		});

		this.buildRefreshSubject();
		this.refresh$.next();
		this.buildFilters();
		this.getFilterData();
	}

	/**
	 * Builds the refresh subject for cancellable http requests
	 */
	private buildRefreshSubject () {
		this.refresh$
		.pipe(
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
			this.logger.error('resolution.component : Case List - ' +
			 					`:: Error : (${err.status}) ${err.message}`);
		});
	}

	/**
	 * Initializes the visual filters with default values
	 */
	private buildFilters () {
		// Initialize filters
		this.filters = [
			{
				key: 'total',
				loading: true,
				selected: true,
				seriesData: [{
					filter: null,
					label: null,
					selected: true,
					value: 0 }],
				template: this.totalFilterTemplate,
				title: I18n.get('_Total_'),
			},
			{
				key: 'status',
				loading: true,
				seriesData: defaultStatusFilterData,
				template: this.pieChartFilterTemplate,
				title: I18n.get('_Status_'),
			},
			{
				key: 'severity',
				loading: true,
				seriesData: defaultSeverityFilterData,
				template: this.pieChartFilterTemplate,
				title: I18n.get('_Severity_'),
			},
			{
				key: 'lastUpdated',
				loading: true,
				seriesData: defaultLastUpdatedFilterData,
				template: this.columnChartFilterTemplate,
				title: I18n.get('_LastUpdated_'),
			},
			{
				key: 'durationOpen',
				loading: true,
				seriesData: defaultDurationOpenFilterData,
				template: this.columnChartFilterTemplate,
				title: I18n.get('_TotalTimeOpen_'),
			},
			{
				key: 'rma',
				loading: true,
				seriesData: defaultRmaFilterData,
				template: this.barChartFilterTemplate,
				title: I18n.get('_RMAs_'),
			},
		];
		// Select filters based on query params so they show up
		// before waiting for all filters to load in
		_.each(this.filters, filter => {
			_.each(filter.seriesData, data => {
				const caseParams = this.caseParams;
				if (filter.key === 'status' || filter.key === 'severity') {
					const caseParamsFilter = _.find(caseParams.filter,
						param => _.includes(param, filter.key));
					if (_.includes(caseParamsFilter, `:${data.filter}`) ||
						_.includes(caseParamsFilter, `:O-${data.filter}`) ||
						_.includes(caseParamsFilter, `,${data.filter}`)) {
						this.onSubfilterSelect(data.label, filter, false);
					}
				} else if (filter.key === 'lastUpdated') {
					const lastUpdateFilter = _.find(defaultLastUpdatedFilterData,
						defaultData => defaultData.label === data.label).filter;
					const lastUpdateFrom = lastUpdateFilter.lastUpdateFrom;
					const lastUpdateTo = lastUpdateFilter.lastUpdateTo;
					if (lastUpdateFrom === caseParams.lastUpdateFrom &&
						lastUpdateTo === caseParams.lastUpdateTo) {
						this.onSubfilterSelect(data.label, filter, false);
					}
				} else if (filter.key === 'durationOpen') {
					const durationOpenFilter = _.find(defaultDurationOpenFilterData,
						defaultData => defaultData.label === data.label).filter;
					const dateCreatedFrom = durationOpenFilter.dateCreatedFrom;
					const dateCreatedTo = durationOpenFilter.dateCreatedTo;
					if (dateCreatedFrom === caseParams.dateCreatedFrom &&
						dateCreatedTo === caseParams.dateCreatedTo) {
						this.onSubfilterSelect(data.label, filter, false);
					}
				} else if (filter.key === 'rma' && caseParams.hasRMAs === data.filter) {
					this.onSubfilterSelect(data.label, filter, false);
				}
			}, this, filter);
		}, this);
	}

	/**
	 * Gets the real values for the visual filters
	 */
	private getFilterData () {
		forkJoin(
			this.getTotalFilterData(),
			this.getStatusFilterData(),
			this.getSeverityFilterData(),
			this.getLastUpdatedFilterData(),
			this.getDurationOpenFilterData(),
			this.getRmaFilterData(),
		)
		.subscribe(() => {
			if (window.Cypress) {
				window.loading = false;
			}
			this.logger.debug('resolution.component : buildFilters() :: Finished Building');
		}, err => {
			if (window.Cypress) {
				window.loading = false;
			}
			this.logger.error('resolution.component : Case List - ' +
								 `:: Error : (${err.status}) ${err.message}`);
		});
	}

	/**
	 * Fetch the number of open cases and displays it in the total filter
	 * @returns null observable
	 */
	private getTotalFilterData () {
		const params = {
			nocache: Date.now(),
			page: 0,
			size: 1,
			sort: 'caseNumber,ASC',
			statusTypes: 'O',
		};

		return this.caseService.read(params)
		.pipe(
			map(result => {
				const totalFilter = _.find(this.filters, { key: 'total' });
				if (result.totalElements) {
					totalFilter.seriesData = [{ value: result.totalElements }];
				}
				totalFilter.loading = false;
			}),
			catchError(err => {
				this.logger.error('resolution.component : buildTotalFilter() ' +
									`:: Error : (${err.status}) ${err.message}`);

				return of(null);
			}),
		);
	}

	/**
	 * Fetch the number of open cases and displays it in the total filter
	 * @returns null observable
	 */
	private getStatusFilterData () {
		const params = {
			nocache: Date.now(),
			page: 0,
			size: 1,
			sort: 'caseNumber,ASC',
			statusTypes: 'O',
		};

		return forkJoin(
			_.map(defaultStatusFilterData, statusFilter => this.caseService.read(
				{ ...params, filter: [`status:O-${statusFilter.filter}`] },
			)),
		)
		.pipe(
			map(responses => this.setFilterSeriesData('status',
				defaultStatusFilterData, responses)),
			catchError(err => {
				this.logger.error('resolution.component : buildStatusFilter() ' +
									`:: Error : (${err.status}) ${err.message}`);

				return of(null);
			}),
		);
	}

	/**
	 * Fetch the number of open cases and displays it in the total filter
	 * @returns null observable
	 */
	private getSeverityFilterData () {
		const params = {
			nocache: Date.now(),
			page: 0,
			size: 1,
			sort: 'caseNumber,ASC',
			statusTypes: 'O',
		};

		return forkJoin(
			_.map(defaultSeverityFilterData, severityFilter => this.caseService.read(
				{ ...params, filter: [`severity:${severityFilter.filter}`] },
			)),
		)
		.pipe(
			map(responses =>
				this.setFilterSeriesData('severity', defaultSeverityFilterData, responses)),
			catchError(err => {
				this.logger.error('resolution.component : buildSeverityFilter() ' +
									`:: Error : (${err.status}) ${err.message}`);

				return of(null);
			}),
		);
	}

	/**
	 * Fetch the total number of cases by when they were last updated
	 * and displays them in the given filter
	 * @returns null observable
	 */
	public getLastUpdatedFilterData () {
		const params: CaseParams = {
			nocache: Date.now(),
			page: 0,
			size: 1,
			sort: 'caseNumber,ASC',
			statusTypes: 'O',
		};

		return forkJoin(
			_.map(defaultLastUpdatedFilterData, lastUpdatedFilter => this.caseService.read(
				{ ...params, ...lastUpdatedFilter.filter },
			)),
		)
		.pipe(
			map(responses =>
				this.setFilterSeriesData('lastUpdated', defaultLastUpdatedFilterData, responses)),
			catchError(err => {
				this.logger.error('resolution.component : buildLastUpdatedFilter() ' +
									`:: Error : (${err.status}) ${err.message}`);

				return of(null);
			}),
		);
	}

	/**
	 * Fetch the total number of cases by duration open and displays them in the given filter
	 * @returns null observable
	 */
	public getDurationOpenFilterData () {
		const params: CaseParams = {
			nocache: Date.now(),
			page: 0,
			size: 1,
			sort: 'caseNumber,ASC',
			statusTypes: 'O',
		};

		return forkJoin(
			_.map(defaultDurationOpenFilterData, durationOpenFilter => this.caseService.read(
				{ ...params, ...durationOpenFilter.filter },
			)),
		)
		.pipe(
			map(responses =>
				this.setFilterSeriesData('durationOpen', defaultDurationOpenFilterData, responses)),
			catchError(err => {
				this.logger.error('resolution.component : buildDurationOpenFilter() ' +
									`:: Error : (${err.status}) ${err.message}`);

				return of(null);
			}),
		);
	}

	/**
	 * Fetch Case/RMA counts and displays them in the given filter
	 * @returns null observable
	 */
	public getRmaFilterData () {
		const params: CaseParams = {
			nocache: Date.now(),
			page: 0,
			size: 1,
			sort: 'caseNumber,ASC',
			statusTypes: 'O',
		};

		return forkJoin(
			_.map(defaultRmaFilterData, rmaFilter => this.caseService.read(
				{ ...params, hasRMAs: rmaFilter.filter },
			)),
		)
		.pipe(
			map(responses =>
				this.setFilterSeriesData('rma', defaultRmaFilterData, responses)),
			catchError(err => {
				this.logger.error('resolution.component : buildRmaFilter() ' +
									`:: Error : (${err.status}) ${err.message}`);

				return of(null);
			}),
		);
	}

	/**
	 * Sets the series data for the filter matching the given key
	 * with the given information from the response
	 * @param key Name of the filter to set data for
	 * @param defaultData Array of default data for the filter
	 * @param responses Responses from the Case API for each filter
	 */
	private setFilterSeriesData (key: string, defaultData, responses) {
		const filter = _.find(this.filters, { key });
		filter.seriesData = _.map(responses, (response, index) => ({
			...defaultData[index],
			selected: _.get(
				_.find(filter.seriesData, data => data.label === defaultData[index].label),
				'selected', false),
			value: response.totalElements,
		}), filter);
		if (key === 'status' || key === 'severity') {
			_.remove(filter.seriesData, data => !data.value);
		}
		filter.loading = false;
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
		this.paginationInfo.currentPage = 0;
		this.caseParams.page = 0;
		this.refresh$.next();
	}

	/**
	 * clear search
	 */
	public clearSearch () {
		this.searchCasesForm.setValue({ caseNo: '' });
		this.searchCaseNumber();
	}

	/**
	 * Call CSOne's API to get the case list
	 * @returns Observable with response data.
	 */
	public getCaseList (): Observable<any> {
		return this.caseService.read(this.caseParams);
	}

	/**
	 * Calls CSOne's API to get case details
	 * @param caseNo to be searched for
	 * @returns void
	 */
	public getCaseDetails (caseNo: string): Observable<any> {
		return this.caseService.fetchCaseDetails(caseNo);
	}

	/**
	 * Returns the current selected visual filters
	 * @returns the selected visual filters
	 */
	get selectedFilters () {
		return _.filter(this.filters, 'selected');
	}

	/**
	 * Returns the selected sub filters
	 * @param key the key to match to the filter
	 * @returns the array of filters
	 */
	public getSelectedSubFilters (key: string) {
		const filter = _.find(this.filters, { key });
		if (filter) {
			return _.filter(filter.seriesData, 'selected');
		}
	}

	/**
	 * Adjust the browser's query params to preserve the current state
	 */
	 private async adjustQueryParams () {
		// Must remove all query params first or they'll only update once
		await this.router.navigate([], { queryParams: null, relativeTo: this.route });
		const queryParams = _.pick(this.caseParams,
			['filter', 'coverage', 'search', 'sort', 'hasRMAs']);
		const lastUpdatedFilter = _.find(this.filters, { key: 'lastUpdated' });
		const lastUpdatedSubFilter = _.find(lastUpdatedFilter.seriesData, 'selected');
		if (lastUpdatedSubFilter) {
			_.set(queryParams, 'lastUpdated', lastUpdatedSubFilter.label);
		}
		const durationOpenFilter = _.find(this.filters, { key: 'durationOpen' });
		const durationOpenSubFilter = _.find(durationOpenFilter.seriesData, 'selected');
		if (durationOpenSubFilter) {
			_.set(queryParams, 'durationOpen', durationOpenSubFilter.label);
		}
		await this.router.navigate([], { queryParams, relativeTo: this.route });
		this.refresh$.next();
	}

	/**
	 * Function used to clear the filters
	 */
	public clearFilters () {
		const totalFilter = _.find(this.filters, { key: 'total' });
		this.filtered = false;

		_.each(this.filters, (filter: VisualFilter) => {
			filter.selected = false;
			_.set(this.caseParams, 'filter', []);
			_.each(otherFilters, otherFilter => {
				_.set(this.caseParams, otherFilter, null);
			});
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});

		totalFilter.selected = true;
		this.adjustQueryParams();
	}

	/**
	 * Adds a subfilter to the given filter
	 * @param label the label of the subfilter selected
	 * @param filter the filter we selected the subfilter on
	 * @param reload if we're reloading the cases
	 */
	public onSubfilterSelect (label, filter: VisualFilter, reload: boolean = true) {
		const sub = _.find(filter.seriesData, { label });
		if (sub) {
			sub.selected = !sub.selected;
		}

		filter.selected = _.some(filter.seriesData, 'selected');

		const key = filter.key;
		let values = _.map(
			_.filter(filter.seriesData, 'selected', true),
			subFilter => subFilter.filter,
		);
		// Different behavior to handle different types of filters to appease the case service
		if (key === 'status' || key === 'severity') {
			if (key === 'status') {
				values = `O-${values}`;
			}

			const existingFilterIndex = _.findIndex(this.caseParams.filter,
				filterKeyVal => _.includes(filterKeyVal, `${key}:`));

			if (existingFilterIndex !== -1) {
				if (values.length > 0 && values !== 'O-') {
					(<string[]> this.caseParams.filter)[existingFilterIndex] = `${key}:${values}`;
				} else {
					(<string[]> this.caseParams.filter).splice(existingFilterIndex, 1);
				}
			} else {
				(<string[]> this.caseParams.filter).push(`${key}:${values}`);
			}
		} else if (key === 'lastUpdated') {
			if (sub.selected) {
				this.caseParams.lastUpdateFrom = sub.filter.lastUpdateFrom;
				this.caseParams.lastUpdateTo = sub.filter.lastUpdateTo;
			} else {
				delete(this.caseParams.lastUpdateFrom);
				delete(this.caseParams.lastUpdateTo);
			}
			_.forEach(filter.seriesData, seriesData => {
				if (seriesData.filter !== sub.filter) {
					seriesData.selected = false;
				}
			});
		}  else if (key === 'durationOpen') {
			if (sub.selected) {
				this.caseParams.dateCreatedFrom = sub.filter.dateCreatedFrom;
				this.caseParams.dateCreatedTo = sub.filter.dateCreatedTo;
			} else {
				delete(this.caseParams.dateCreatedFrom);
				delete(this.caseParams.dateCreatedTo);
			}
			_.forEach(filter.seriesData, seriesData => {
				if (seriesData.filter !== sub.filter) {
					seriesData.selected = false;
				}
			});
		} else if (key === 'rma') {
			this.caseParams.hasRMAs = sub.filter;
			_.forEach(filter.seriesData, seriesData => {
				if (seriesData.filter !== sub.filter) {
					seriesData.selected = false;
				}
			});
			if (!sub.selected) {
				delete(this.caseParams.hasRMAs);
			}
		}

		this.caseParams.page = 0;

		const totalFilter = _.find(this.filters, { key: 'total' });
		const filtered = _.reduce(this.filters, (isFiltered, f) => {
			if (!isFiltered) {
				return _.some(f.seriesData, 'selected');
			}

			return isFiltered;
		}, false);
		totalFilter.selected = !filtered;
		this.filtered = filtered;

		if (reload) {
			this.adjustQueryParams();
		}
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
