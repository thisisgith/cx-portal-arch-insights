import { Component, ViewChild, TemplateRef, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, ActivationEnd, NavigationEnd } from '@angular/router';

import { CaseParams, CaseDetails, CaseService } from '@cui-x/services';
import { LogService } from '@cisco-ngx/cui-services';

import { Observable, Subject, forkJoin } from 'rxjs';

import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { I18n } from '@cisco-ngx/cui-utils';
import { tap, switchMap, takeUntil } from 'rxjs/operators';

import * as _ from 'lodash-es';
import { DateTime } from 'luxon';

import { caseSeverities } from '@classes';
import { AssetLinkInfo, Case, VisualFilter } from '@interfaces';
import { environment } from '@environment';
import { AssetPanelLinkService, DetailsPanelStackService, CaseDetailsService } from '@services';
import { UserResolve } from '@utilities';

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
 * List of filter names that aren't stored under the "filters" case parameter
 * (due to the way the case service processes them)
 */
const altFilters = ['hasRMAs', 'lastUpdateFrom', 'lastUpdateTo',
	'dateCreatedFrom', 'dateCreatedTo'];

/** 1 day ago */
const oneDay = DateTime.local()
	.minus({ days: 1 });
/** 1 week ago */
const oneWeek = DateTime.local()
	.minus({ weeks: 1 });
/** 2 weeks ago */
const twoWeeks = DateTime.local()
	.minus({ weeks: 2 });
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
 * Resolution Component
 */
@Component({
	styleUrls: ['./resolution.component.scss'],
	encapsulation: ViewEncapsulation.None,
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
	@ViewChild('rmasTmpl', { static: true }) public rmasTemplate: TemplateRef<any>;

	public selectedCase: Case;
	public selectedDetails: CaseDetails;
	public fullscreen = false;

	public caseListData: any[];
	public caseListTableOptions: CuiTableOptions;
	public filters: VisualFilter[];
	public builtFilters = false;
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
	public assetLinkInfo: AssetLinkInfo = Object.create({ });
	public customerId: string;
	public serialNumber: string;
	public showAsset360 = false;

	public defaultLastUpdatedFilterData: FilterData[];
	public defaultDurationOpenFilterData: FilterData[];
	public defaultRmaFilterData: FilterData[];
	public defaultFiltersData: any;

	constructor (
		private logger: LogService,
		private caseService: CaseService,
		private formBuilder: FormBuilder,
		public route: ActivatedRoute,
		private router: Router,
		private assetPanelLinkService: AssetPanelLinkService,
		private userResolve: UserResolve,
		private detailsPanelStackService: DetailsPanelStackService,
		private caseDetailsService: CaseDetailsService,
	) {
		this.userResolve.getCustomerId()
		.pipe(takeUntil(this.destroy$))
		.subscribe((id: string) => {
			this.customerId = id;
		});
		let params: any = { };
		this.router.events.subscribe(event => {
			if (event instanceof ActivationEnd) {
				params = (event.snapshot && event.snapshot.queryParams);
			}
			if (event instanceof NavigationEnd && params) {
				this.getCaseDetailsInfo(params);
			}
		});
	 }

	/** ngOnInit */
	public ngOnInit () {
		this.initializeFilterVariables();
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
					width: '7%',
					template: this.severityTemplate,
				},
				{
					autoIdHeader: 'Case ID-Header',
					key: 'caseNumber',
					name: I18n.get('_CaseNumber_'),
					width: '8%',
					sortable: true,
				},
				{
					autoIdHeader: 'Device-Header',
					key: 'deviceName',
					name: I18n.get('_RMAsset_'),
					sortable: false,
				},
				{
					autoIdHeader: 'Summary-Header',
					key: 'summary',
					name: I18n.get('_Description_'),
					sortable: true,
				},
				{
					autoIdHeader: 'Status-Header',
					key: 'status',
					name: I18n.get('_RMACaseStatus_'),
					width: '12%',
					sortable: true,
				},
				{
					autoIdHeader: 'RMA-Header',
					name: I18n.get('_RMACaseRMAs_'),
					sortable: false,
					width: '8%',
					template: this.rmasTemplate,
				},
				{
					autoIdHeader: 'Updated-Header',
					key: 'lastModifiedDate',
					name: I18n.get('_RMACaseUpdatedDate_'),
					sortable: true,
					sorting: true,
					width: '8%',
					template: this.updatedTemplate,
				},
			],
			hover: true,
			wrapText: true,
			singleSelect: true,
			striped: false,
		});

		this.initializeFilters();
		this.buildRefreshSubject();
		this.refresh$.next();

		this.caseDetailsService.caseCount$
			.pipe(takeUntil(this.destroy$))
			.subscribe((data: boolean) => {
				// calling functions again based on subject value
				if (data && this.destroy$) {
					this.initializeFilterVariables();
					this.initializeFilters();
					this.builtFilters = false;
					this.buildRefreshSubject();
					this.refresh$.next();
				}
			});
	}

	/**
	 * get the search text case number
	 * @param params  contains case number of the search case
	 */
	public getCaseDetailsInfo (params: any) {
		if (params.case) {
			this.selectedCase = {
				caseNumber: params.case,
				deviceName: params.deviceName,
				serialNumber: params.serialNumber,
			};
			if (this.searchCasesForm) {
				this.searchCasesForm.patchValue(params.case);
			}
			_.set(this.caseParams, 'caseNumbers', params.case);
		}

		if (params.serial) {
			_.set(this.caseParams, 'serialNumbers', params.serial);
		}

		if (params.filter) {
			_.set(this.caseParams, 'filter', _.castArray(params.filter));
		}

		if (params.lastUpdated) {
			const filter = _.find(this.defaultLastUpdatedFilterData,
				{ label: params.lastUpdated })
				.filter;
			_.assign(this.caseParams, ...filter);
		}

		if (params.durationOpen) {
			const filter = _.find(this.defaultDurationOpenFilterData,
				{ label: params.durationOpen })
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
	}

	/**
	 * Initializes the filters at half-opacity with stored values.
	 */
	private initializeFilters () {
		this.filters = [
			{
				key: 'total',
				loading: true,
				selected: true,
				seriesData: this.defaultFiltersData.total,
				template: this.totalFilterTemplate,
				title: I18n.get('_Total_'),
			},
			{
				key: 'status',
				loading: true,
				seriesData: this.defaultFiltersData.status,
				template: this.pieChartFilterTemplate,
				title: I18n.get('_Status_'),
			},
			{
				key: 'severity',
				loading: true,
				seriesData: this.defaultFiltersData.severity,
				template: this.pieChartFilterTemplate,
				title: I18n.get('_Severity_'),
			},
			{
				key: 'lastUpdated',
				loading: true,
				seriesData: this.defaultFiltersData.lastUpdated,
				template: this.columnChartFilterTemplate,
				title: I18n.get('_RMACaseUpdatedDate_'),
			},
			{
				key: 'durationOpen',
				loading: true,
				seriesData: this.defaultFiltersData.durationOpen,
				template: this.columnChartFilterTemplate,
				title: I18n.get('_TotalTimeOpen_'),
			},
			{
				key: 'rma',
				loading: true,
				seriesData: this.defaultFiltersData.rma,
				template: this.barChartFilterTemplate,
				title: I18n.get('_RMAs_'),
			},
		];

		// Select filters based on case params
		const caseParams = _.cloneDeep(this.caseParams);
		_.each(this.filters, filter => {
			_.each(filter.seriesData, data => {
				if (filter.key === 'status' || filter.key === 'severity') {
					const subFilter = _.find(caseParams.filter,
						param => _.includes(param, filter.key));
					if (_.includes(subFilter, `:${data.filter}`) ||
						_.includes(subFilter, `:O-${data.filter}`) ||
						_.includes(subFilter, `,${data.filter}`)) {
						this.onSubfilterSelect(data.label, filter, false);
					}
				} else if (filter.key === 'lastUpdated') {
					const subFilter = _.find(this.defaultLastUpdatedFilterData,
						{ label: data.label })
						.filter;
					// Extra DateTime object to protect from undefined values
					const placeholderDateTime = DateTime.local();
					const lastUpdateFrom = subFilter.lastUpdateFrom || placeholderDateTime;
					const lastUpdateTo = subFilter.lastUpdateTo || placeholderDateTime;
					if (lastUpdateFrom.equals(caseParams.lastUpdateFrom || placeholderDateTime) &&
						lastUpdateTo.equals(caseParams.lastUpdateTo || placeholderDateTime)) {
						this.onSubfilterSelect(data.label, filter, false);
					}
				} else if (filter.key === 'durationOpen') {
					const subFilter = _.find(this.defaultDurationOpenFilterData,
						{ label: data.label })
						.filter;
					// Extra DateTime object to protect from undefined values
					const placeholderDateTime = DateTime.local();
					const dateCreatedFrom = subFilter.dateCreatedFrom || placeholderDateTime;
					const dateCreatedTo = subFilter.dateCreatedTo || placeholderDateTime;
					if (dateCreatedFrom.equals(caseParams.dateCreatedFrom || placeholderDateTime) &&
						dateCreatedTo.equals(caseParams.dateCreatedTo || placeholderDateTime)) {
						this.onSubfilterSelect(data.label, filter, false);
					}
				} else if (filter.key === 'rma' && caseParams.hasRMAs === data.filter) {
					this.onSubfilterSelect(data.label, filter, false);
				}
			}, this, filter);
		}, this);
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

			// Get/set values for the filters
			if (!this.builtFilters) {
				this.buildFilters();
				this.builtFilters = true;
			} else {
				this.isLoading = false;
			}
		}, err => {
			this.isLoading = false;
			this.logger.error('resolution.component : Case List - ' +
			 					`:: Error : (${err.status}) ${err.message}`);
		});
	}

	/**
	 * Creates the visual filters for the case list.
	 * @param totalCases The total number of open cases available to the current user
	 */
	private buildFilters () {
		// Make requests to get/set values for the filters
		this.caseService.read({
			nocache: Date.now(),
			page: 0,
			size: 1,
			sort: 'lastModifiedDate,DESC',
			statusTypes: 'O',
		})
		.subscribe(response => {
			this.getFilterData(response.totalElements);
			this.logger.debug('resolution.component : buildFilters() :: Finished building filters');
		}, err => {
			this.isLoading = false;
			if (window.Cypress) {
				window.loading = false;
			}
			this.logger.error('resolution.component : buildFilters() - ' +
								 `:: Error : (${err.status}) ${err.message}`);
		});
	}

	/**
	 * Gets and sets the values used to populate the visual filters
	 * @param totalCases The total number of cases to get
	 */
	private getFilterData (totalCases) {
		const totalFilter = _.find(this.filters, { key: 'total' });
		totalFilter.seriesData = [{ value: totalCases }];

		const requestParamSet = [];
		let currentPage = 0;
		let casesRemaining = totalCases;
		while (casesRemaining > 0) {
			requestParamSet.push({
				fields: 'createdDate,lastModifiedDate,priority,rmaNumber,status',
				page: currentPage,
				size: environment.csone.maxCasesPerRequest,
				statusTypes: 'O',
			});
			currentPage += 1;
			casesRemaining -= environment.csone.maxCasesPerRequest;
		}

		forkJoin(
			_.map(requestParamSet, params => this.caseService.read(params)),
		)
		.subscribe(responses => {
			const cases = _.flatMap(responses, response => _.get(response, 'content', []));
			// Get all of the filters (except for the total filter) and reset their data
			const statusFilter = _.find(this.filters, { key: 'status' });
			const severityFilter = _.find(this.filters, { key: 'severity' });
			const lastUpdateFilter = _.find(this.filters, { key: 'lastUpdated' });
			const durationOpenFilter = _.find(this.filters, { key: 'durationOpen' });
			const rmaFilter = _.find(this.filters, { key: 'rma' });
			_.each(this.filters, filter => {
				if (filter.key !== 'total') {
					filter.seriesData = this.defaultFiltersData[filter.key];
				}
			});

			// Iterate through cases to sum values for all subfilters
			_.each(cases, caseFields => {
				// Status (dynamic so we don't have to maintain a list of possible statuses)
				const statusSubfilter = _.find(statusFilter.seriesData,
					{ filter: caseFields.status });
				if (!statusSubfilter) {
					statusFilter.seriesData.push({
						filter: caseFields.status,
						label: caseFields.status,
						selected: false,
						value: 1,
					});
				} else {
					statusSubfilter.value += 1;
				}
				// Severity
				const severitySubfilter = _.find(severityFilter.seriesData,
					{ filter: caseFields.priority });
				if (!severitySubfilter) {
					severityFilter.seriesData.push({
						filter: caseFields.priority,
						label: `S${caseFields.priority}`,
						selected: false,
						value: 1,
					});
				} else {
					severitySubfilter.value += 1;
				}
				// Last Updated
				const lastUpdate = DateTime.fromISO(caseFields.lastModifiedDate);
				const lastUpdateSubfilter = _.find(lastUpdateFilter.seriesData, seriesData => {
					const filterLastUpdateFrom = DateTime.fromISO(seriesData.filter.lastUpdateFrom);
					const filterLastUpdateTo = DateTime.fromISO(seriesData.filter.lastUpdateTo);
					if ((filterLastUpdateFrom && lastUpdate <= filterLastUpdateFrom) ||
						(filterLastUpdateTo && lastUpdate > filterLastUpdateTo)) {
						return false;
					}

					return true;
				});
				lastUpdateSubfilter.value += 1;
				// Duration Open
				const durationOpen = DateTime.fromISO(caseFields.createdDate);
				const durationOpenSubfilter = _.find(durationOpenFilter.seriesData, seriesData => {
					const filterOpenFrom = DateTime.fromISO(seriesData.filter.dateCreatedFrom);
					const filterOpenTo = DateTime.fromISO(seriesData.filter.dateCreatedTo);
					if ((filterOpenFrom && durationOpen <= filterOpenFrom) ||
						(filterOpenTo && durationOpen > filterOpenTo)) {
						return false;
					}

					return true;
				});
				durationOpenSubfilter.value += 1;
				// RMA
				const rmaSubfilter = _.find(rmaFilter.seriesData,
					seriesData => caseFields.rmaNumber ?
					seriesData.filter === 'T' : seriesData.filter === 'F');
				rmaSubfilter.value += 1;
			});

			// Order severities (S1, S2, S3, S4)
			severityFilter.seriesData = _.sortBy(severityFilter.seriesData,
				seriesData => seriesData.filter);

			_.each(this.filters, filter => {
				if (_.includes(['status', 'severity'], filter.key)) {
					// Don't include status or severities in pie charts with no associated cases
					_.set(filter, 'seriesData', _.filter(filter.seriesData, data => data.value));
				}
				if (filter.key === 'status' && filter.seriesData.length > 4) {
					const sortDataByDesc = _.reverse(_.sortBy(filter.seriesData, 'value'));
					const seriesData = _.slice(sortDataByDesc, 0, 3);
					seriesData.push({
						filter: _.join(_.map(_.slice(sortDataByDesc, 3), 'filter'), ','),
						label: I18n.get('_Others_'),
						selected: false,
						value: _.reduce(_.map(_.slice(sortDataByDesc, 3), 'value'),
						 (sum, val) =>  sum + val),
					});
					_.set(filter, 'seriesData', [...seriesData]);
				} else {
					_.set(filter, 'seriesData', [...filter.seriesData]);
				}
				_.set(filter, 'loading', false);
			});
			this.isLoading = false;

			if (window.Cypress) {
				window.loading = false;
			}
			this.logger.debug('resolution.component : getFilterData() :: Finished getting data');
		}, err => {
			this.isLoading = false;
			if (window.Cypress) {
				window.loading = false;
			}
			this.logger.error('resolution.component : getFilterData() - ' +
								 `:: Error : (${err.status}) ${err.message}`);
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
	 * get the description based on severity
	 * @param severity of case
	 * @returns void
	 */
	public getSeverityDescr (severity: string) {
		const severityInt = parseInt(severity, 10);

		if (Object.keys(caseSeverities)
		.includes(severity)) {
			return caseSeverities[severityInt].getCreateName();
		}

		return '';
	}

	/**
	 * sort each column in case table view
	 * @param evt for table sort information
	 */
	public onTableSortingChanged (evt: any) {
		const sortDir = (evt.sortDirection === 'asc') ? 'desc' : 'asc';
		this.caseParams.sort = `${evt.key},${sortDir}`;
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
		const requestParams = this.withISODates(this.caseParams);

		return this.caseService.read(requestParams);
	}

	/**
	 * Returns the given param set with the lastUpdate/dateCreated fields set to ISO dates.
	 * Necessary to convert from query parameter labels to values that CSOne can parse.
	 * @param params Parameter set to modify.
	 * @returns The modified parameter set.
	 */
	private withISODates (params) {
		const newParams = _.clone(params);
		if (newParams.lastUpdateFrom) {
			newParams.lastUpdateFrom = newParams.lastUpdateFrom
			.toUTC()
			.toISO();
		}
		if (newParams.lastUpdateTo) {
			newParams.lastUpdateTo = newParams.lastUpdateTo
			.toUTC()
			.toISO();
		}
		if (newParams.dateCreatedFrom) {
			newParams.dateCreatedFrom = newParams.dateCreatedFrom
			.toUTC()
			.toISO();
		}
		if (newParams.dateCreatedTo) {
			newParams.dateCreatedTo = newParams.dateCreatedTo
			.toUTC()
			.toISO();
		}

		return newParams;
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
			_.each(altFilters, altFilter => {
				_.set(this.caseParams, altFilter, null);
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
				this.caseParams.lastUpdateFrom = DateTime.fromISO(sub.filter.lastUpdateFrom);
				this.caseParams.lastUpdateTo = DateTime.fromISO(sub.filter.lastUpdateTo);
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
				this.caseParams.dateCreatedFrom = DateTime.fromISO(sub.filter.dateCreatedFrom);
				this.caseParams.dateCreatedTo = DateTime.fromISO(sub.filter.dateCreatedTo);
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
		if (this.showAsset360) {
			this.showAsset360 = false;
		}
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
	 * Handles the hidden event from details-panel
	 * @param hidden false if details slideout is open
	 */
	public handleHidden (hidden: boolean) {
		if (hidden) {
			this.detailsClose();
		}
	}

	/**
	 * Used for Opening the Asset 360 View data
	 * @param assetObj contains asset details
	 */
	public showAssetDetails (assetObj) {
		this.handleHidden(true);
		this.serialNumber = assetObj.serialNumber;
		this.assetPanelLinkService.getAssetLinkData({
			customerId: this.customerId,
			serialNumber: [assetObj.serialNumber],
		})
		.pipe(takeUntil(this.destroy$))
		.subscribe(response => {
			this.assetLinkInfo.asset = _.get(response, [0, 'data', 0]);
			this.assetLinkInfo.element = _.get(response, [1, 'data', 0]);
			this.showAsset360 = true;
		},
		err => {
			this.showAsset360 = true;
			this.logger.error(
				'RccComponent : getAssetLinkData() ' +
			`:: Error : (${err.status}) ${err.message}`);
		});
	}

	/**
	 * Initializing visual filter variables on every page load and case creation
	 */

	public initializeFilterVariables () {
		/**
	 	* Array of default data for the last updated filter
	 	*/
		 this.defaultLastUpdatedFilterData = _.map(lastUpdatedFilters, fields => ({
			barLabel: fields.barLabel,
			filter: _.pick(fields, ['lastUpdateFrom', 'lastUpdateTo']),
			label: fields.label,
			selected: false,
			value: 0,
		}));

		/**
	 	* Array of default data for the duration open filter
		 */
		 this.defaultDurationOpenFilterData = _.map(durationOpenFilters, fields => ({
			barLabel: fields.barLabel,
			filter: _.pick(fields, ['dateCreatedFrom', 'dateCreatedTo']),
			label: fields.label,
			selected: false,
			value: 0,
		}));

		/**
	 	* Array of default data for the severity filter
		 */
		this.defaultRmaFilterData = _.map(['No RMAs', 'With RMAs'], label => ({
			label,
			filter: label === 'No RMAs' ? 'F' : 'T',
			selected: false,
			value: 0,
		}));

		/**
		 * All of the default filter values stored in a map.
		 * This will be used to initialize each filter when the new data is fetched and accumulated
		 */
		this.defaultFiltersData = {
			durationOpen: this.defaultDurationOpenFilterData,
			lastUpdated: this.defaultLastUpdatedFilterData,
			rma: this.defaultRmaFilterData,
			severity: [],
			status: [],
			total: [{
				filter: null,
				label: null,
				selected: true,
				value: 0,
			}],
		};
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
		this.caseDetailsService.refreshCaseCount(false);
	}

}
