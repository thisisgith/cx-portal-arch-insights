import {
	Component,
	OnInit,
	ViewChild,
	TemplateRef,
	Input,
} from '@angular/core';
import { VisualFilter } from '@interfaces';
import { I18n } from '@cisco-ngx/cui-utils';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import * as _ from 'lodash-es';
import { LogService } from '@cisco-ngx/cui-services';
import { MachineRecommendations } from '@sdp-api';

/**
 * Interface representing our visual filters
 */
interface Filter extends VisualFilter {
	template?: TemplateRef<{ }>;
}

/** bugs and psirt details component */
@Component({
	selector: 'app-bugs-details',
	styleUrls: ['./bugs-details.component.scss'],
	templateUrl: './bugs-details.component.html',
})
export class BugsDetailsComponent implements OnInit {
	@Input('fullscreen') public fullscreen;
	@Input('data') public data;
	@Input('params') public params;
	@ViewChild('totalFilterTemplate', { static: true })
		public totalFilterTemplate: TemplateRef<{ }>;
	@ViewChild('stateFilterTemplate', { static: true })
		public stateFilterTemplate: TemplateRef<{ }>;
	@ViewChild('severityFilterTemplate', { static: true })
		public severityFilterTemplate: TemplateRef<{ }>;
	@ViewChild('stateTemplate', { static: true })
		public stateTemplate: TemplateRef<{ }>;
	@ViewChild('updatedDateTemp', { static: true })
		public updatedDateTemp: TemplateRef<{ }>;
	@ViewChild('impactTemp', { static: true })
		public impactTemp: TemplateRef<{ }>;
	@ViewChild('titleTemp', { static: true })
		public titleTemp: TemplateRef<{ }>;
	@ViewChild('bugIdTemp', { static: true })
		public bugIdTemp: TemplateRef<{ }>;
	@ViewChild('bugTitleTemp', { static: true })
		public bugTitleTemp: TemplateRef<{ }>;

	public filters: Filter[];
	public status = {
		isLoading: true,
		isFiltering: false,
	};
	public bugsTable: CuiTableOptions;
	public psirtsTable: CuiTableOptions;
	public detailsData: any;
	public filtered = false;
	public searchOptions = {
		debounce: 600,
	};
	public numberOfRows = 10;
	public tabIndex = 0;
	public severityMap = [
		{ key: 'H', label: I18n.get('_OsvHigh_'), name: 'High' },
		{ key: 'M', label: I18n.get('_OsvMedium_'), name: 'Medium' },
		{ key: 'L', label: I18n.get('_OsvLow_'), name: 'Low' },
	];

	constructor (private logger: LogService) {
		this.logger.debug('bug and psirt details component created');
	}

	/**
	 * initialization hook
	 */
	public ngOnInit () {
		if (this.data) {
			this.buildFilters();
			this.setDefaultData();
			this.populateFilters();
			this.buildTable();
		}
		this.status.isLoading = false;
	}

	/**
	 * Will construct the assets table
	 */
	public buildTable () {
		if (!this.bugsTable && _.get(this.params, 'viewType') === 'bug') {
			this.bugsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'severity',
						name: I18n.get('_Severity_'),
						sortable: true,
						sortDirection: 'asc',
						sorting: true,
						template: this.impactTemp,
						width: '10%',
					},
					{
						key: 'id',
						name: I18n.get('_OsvBugId_'),
						sortable: true,
						template: this.bugIdTemp,
						width: '15%',
					},
					{
						key: 'title',
						name: I18n.get('_Title_'),
						sortable: false,
						template: this.bugTitleTemp,
						width: '65%',
					},
					{
						key: 'status',
						name: I18n.get('_State_'),
						sortable: true,
						template: this.stateTemplate,
						width: '10%',
					},
				],
				dynamicData: false,
				hover: true,
				padding: 'compressed',
				selectable: false,
				singleSelect: true,
				sortable: true,
				striped: false,
				wrapText: true,
			});
		} else if (!this.psirtsTable && _.get(this.params, 'viewType') === 'psirt') {
			this.psirtsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'severity',
						name: I18n.get('_Impact_'),
						sortable: true,
						template: this.impactTemp,
						width: '10%',
					},
					{
						key: 'title',
						name: I18n.get('_Title_'),
						sortable: false,
						template: this.titleTemp,
						width: '50%',
					},
					{
						key: 'version',
						name: I18n.get('_OsvVersion_'),
						sortable: false,
						width: '15%',
					},
					{
						key: 'lastUpdatedDate',
						name: I18n.get('_OsvUpdated_'),
						sortable: true,
						sortDirection: 'desc',
						sorting: true,
						template: this.updatedDateTemp,
						width: '15%',
					},
					{
						key: 'status',
						name: I18n.get('_State_'),
						sortable: true,
						template: this.stateTemplate,
						width: '10%',
					},
				],
				dynamicData: false,
				hover: true,
				padding: 'compressed',
				selectable: false,
				singleSelect: true,
				sortable: true,
				striped: false,
				wrapText: true,
			});
		}
	}

	/**
	 * populate the details info in respective tabs
	 */
	public populatePaginationInfo () {
		const viewType = _.get(this.params, 'viewType');
		_.map(this.detailsData, (recommendation: any) => {
			const data = viewType === 'bug' ? _.get(recommendation, ['data', 'bugs'], []) :
				_.get(recommendation, ['data', 'psirts'], []);

			const offset = _.get(recommendation, ['params', 'offset']);
			let first = (this.numberOfRows * ((offset + 1) - 1)) + 1;
			if (data.length === 0) {
				first = 0;
			}
			let last = (this.numberOfRows * (offset + 1));
			if (last > data.length) {
				last = data.length;
			}
			_.set(recommendation, 'total', data.length);
			_.set(recommendation, 'paginationCount', `${first} - ${last}`);
		});
	}

	/**
	 * populate the summary info in respective tabs
	 */
	public populateFilters () {
		const viewType = _.get(this.params, 'viewType');
		_.map(this.detailsData, (recommendation: any) => {
			const totalFilter = _.find(_.get(recommendation, 'filters'), { key: 'total' });
			const stateFilter = _.find(_.get(recommendation, 'filters'), { key: 'state' });
			const severityFilter = _.find(_.get(recommendation, 'filters'), { key: 'severity' });

			_.set(totalFilter, 'template', this.totalFilterTemplate);
			_.set(stateFilter, 'template', this.stateFilterTemplate);
			_.set(severityFilter, 'template', this.severityFilterTemplate);
			totalFilter.seriesData = [
				{
					total: viewType === 'bug' ?
						_.get(recommendation, ['data', 'bugs'], []).length :
						_.get(recommendation, ['data', 'psirts'], []).length,
				},
			];
			const severityFilterData = viewType === 'bug' ?
				_.get(recommendation, ['data', 'totalBugsSeverity']) :
				_.get(recommendation, ['data', 'totalPsirtsSeverity']);
			const severityFilterSeriesData = _.compact(
				_.map(severityFilterData, (value: number, sevKey: string) => {
					if (value !== 0) {
						const filteredSeverity = _.filter(this.severityMap,
							severity => severity.key === sevKey);
						return {
							value,
							label: _.get(filteredSeverity, ['0', 'label']),
							filter: _.get(filteredSeverity, ['0', 'name']),
							selected: false,
						};
					}
				}));
			_.set(severityFilter, 'seriesData', severityFilterSeriesData);
			if (viewType === 'bug') {
				stateFilter.seriesData =
					this.populateStateFilter(_.get(recommendation, ['data', 'bugsExposed']),
						_.get(recommendation, ['data', 'resolvedBugsCount']));
			} else {
				stateFilter.seriesData =
					this.populateStateFilter(_.get(recommendation, ['data', 'psirtExposed']),
						_.get(recommendation, ['data', 'psirtResolvedCount']));
			}
		});
	}

	/**
	 * populate state filters
	 * @param exposedCount  number of bugs exposed
	 * @param resolvedCount number of bugs fixed
	 * @returns the series data for state filters
	 */
	private populateStateFilter (exposedCount: number, resolvedCount: number) {
		const seriesData = [];
		if (exposedCount > 0) {
			seriesData.push({
				value: exposedCount,
				filter: 'Exposed',
				label: I18n.get('_OsvExposed_'),
				selected: _.get(this.params, 'filter') === 'exposed' ? true : false,
			});
		}
		if (resolvedCount > 0) {
			seriesData.push({
				value: resolvedCount,
				filter: 'Fixed',
				label: I18n.get('_OsvFixed_'),
				selected: _.get(this.params, 'filter') === 'fixed' ? true : false,
			});
		}
		return seriesData;
	}

	/**
	 * Initializes our visual filters
	 */
	public buildFilters () {
		this.filters = [
			{
				key: 'total',
				loading: false,
				selected: true,
				seriesData: [],
				title: I18n.get('_Total_'),
			},
			{
				key: 'state',
				loading: false,
				selected: false,
				seriesData: [],
				title: I18n.get('_State_'),
			},
			{
				key: 'severity',
				loading: false,
				selected: false,
				seriesData: [],
				title: _.get(this.params, 'viewType') === 'bug' ?
					I18n.get('_Severity_') : I18n.get('_Impact_'),
			},
		];
	}

	/**
	 * setting the default for the details page
	 */
	public setDefaultData () {
		const appliedFilters = {
			state: [],
			severity: [],
		};

		const params = {
			limit: 10,
			offset: 0,
			search: '',
		};

		this.detailsData = {
			current: {
				name: 'profile current',
				params: _.cloneDeep(params),
				filters: _.cloneDeep(this.filters),
				data: _.cloneDeep(_.get(_.filter(this.data,
					(recomm: MachineRecommendations) => recomm.name === 'profile current'), 0)),
				paginationCount: '',
				filtered: false,
				appliedFilters: _.cloneDeep(appliedFilters),
			},
			recommended1: {
				name: 'Recommendation #1',
				params: _.cloneDeep(params),
				filters: _.cloneDeep(this.filters),
				data: _.cloneDeep(_.get(_.filter(this.data,
					(recomm: MachineRecommendations) => recomm.name === 'Recommendation #1'), 0)),
				paginationCount: '',
				filtered: false,
				appliedFilters: _.cloneDeep(appliedFilters),
			},
			recommended2: {
				name: 'Recommendation #2',
				params: _.cloneDeep(params),
				filters: _.cloneDeep(this.filters),
				data: _.cloneDeep(_.get(_.filter(this.data,
					(recomm: MachineRecommendations) => recomm.name === 'Recommendation #2'), 0)),
				paginationCount: '',
				filtered: false,
				appliedFilters: _.cloneDeep(appliedFilters),
			},
			recommended3: {
				name: 'Recommendation #3',
				params: _.cloneDeep(params),
				filters: _.cloneDeep(this.filters),
				data: _.cloneDeep(_.get(_.filter(this.data,
					(recomm: MachineRecommendations) => recomm.name === 'Recommendation #3'), 0)),
				paginationCount: '',
				filtered: false,
				appliedFilters: _.cloneDeep(appliedFilters),
			},
		};
		this.populatePaginationInfo();
	}

	/**
	 * Adds a subfilter to the given filer
	 * @param subfilter the subfilter selected
	 * @param filter the filter we selected the subfilter on
	 */
	public onSubfilterSelect (subfilter: string, filter: Filter) {
		const recommendation = this.getCurrentTabData();
		const sub = _.find(filter.seriesData, { filter: subfilter });
		if (sub) {
			sub.selected = !sub.selected;
		}
		filter.selected = _.some(filter.seriesData, 'selected');
		if (filter.key === 'state') {
			recommendation.appliedFilters.state =
				_.map(_.filter(filter.seriesData, 'selected'), 'filter');
		}
		if (filter.key === 'severity') {
			recommendation.appliedFilters.severity =
				_.map(_.filter(filter.seriesData, 'selected'), 'filter');
		}
		const totalFilter = _.find(recommendation.filters, { key: 'total' });
		if (filter.selected) {
			totalFilter.selected = false;
			recommendation.filtered = true;
		} else {
			const total = _.reduce(recommendation.filters, (memo, f) => {
				if (!memo) {
					return _.some(f.seriesData, 'selected');
				}

				return memo;
			}, false);

			totalFilter.selected = !total;
			recommendation.filtered = total;
		}
		this.setFilter(recommendation);
	}

	/**
	 * set the filters are part of query params
	 * @param recommendation current filters selected by customer
	 */
	public setFilter (recommendation) {
		this.status.isFiltering = true;
		const actualData = _.cloneDeep(_.get(_.filter(this.data,
			(recomm: MachineRecommendations) => recomm.name === recommendation.name), 0));
		const viewType = _.get(this.params, 'viewType');
		const data = viewType === 'bug' ? actualData.bugs :
			actualData.psirts;
		const stateFilters = recommendation.appliedFilters.state;
		const severityFilters = recommendation.appliedFilters.severity;
		let filteredData = data;
		const searchedText = _.toLower(recommendation.params.search);
		if (stateFilters.length > 0 || severityFilters.length > 0 || searchedText.length > 0) {
			if (stateFilters.length > 0) {
				const mappedStateFilters = [];
				if (stateFilters.indexOf('Fixed') > -1) {
					mappedStateFilters.push('RESOLVED');
				}
				if (stateFilters.indexOf('Exposed') > -1) {
					mappedStateFilters.push(...['OPEN', 'NEW_OPEN']);
				}
				filteredData = _.filter(filteredData, recomm =>
					mappedStateFilters.indexOf(recomm.status) > -1,
				);
			}
			if (severityFilters.length > 0) {
				filteredData = _.filter(filteredData, recomm =>
					severityFilters.indexOf(recomm.severity) > -1,
				);
			}
			if (searchedText.length > 0) {
				filteredData = _.filter(filteredData, recomm =>
					_.includes(_.toLower(recomm.id), searchedText) ||
					_.includes(_.toLower(recomm.title), searchedText),
				);
			}
		}

		viewType === 'bug' ? recommendation.data.bugs = filteredData :
			recommendation.data.psirts = filteredData;
		recommendation.params.offset = 0;
		this.populatePaginationInfo();
		setTimeout(() => {
			this.status.isFiltering = false;
		}, 100);
	}

	/**
	 * extract data of the currently displayed recommendation
	 * @returns data of the currently displayed recommendation
	 */
	public getCurrentTabData () {
		let currentData;
		switch (this.tabIndex) {
			case 0:
				currentData = this.detailsData.current;
				break;
			case 1:
				currentData = this.detailsData.recommended1;
				break;
			case 2:
				currentData = this.detailsData.recommended2;
				break;
			case 3:
				currentData = this.detailsData.recommended3;
				break;
		}

		return currentData;
	}

	/**
	 * Function used to clear the filters
	 */
	public clearFilters () {
		const recommendation = this.getCurrentTabData();
		const totalFilter = _.find(recommendation.filters, { key: 'total' });
		recommendation.filtered = false;

		_.each(recommendation.filters, (filter: Filter) => {
			filter.selected = false;
			_.each(filter.seriesData, f => {
				f.selected = false;
			});
		});
		totalFilter.selected = true;
		recommendation.appliedFilters = {
			state: [],
			severity: [],
		};
		const actualData = _.get(_.filter(this.data,
			(recomm: MachineRecommendations) => recomm.name === recommendation.name), 0);
		const viewType = _.get(this.params, 'viewType');
		viewType === 'bug' ? recommendation.data.bugs = actualData.bugs :
			recommendation.data.psirts = actualData.psirts;
		recommendation.params.offset = 0;
		this.populatePaginationInfo();
	}

	/**
	 * Returns the selected sub filters
	 * @param key the key to match to the filter
	 * @param recommendation  data of currently displayed recommendatio
	 * @returns the array of filters
	 */
	public getSelectedSubFilters (key: string, recommendation: any) {
		const filter = _.find(recommendation.filters, { key });
		if (filter) {

			return _.filter(filter.seriesData, 'selected');
		}

		return [];
	}

	/**
	 * Returns the current selected visual filters
	 * @param recommendation  data of currently displayed recommendation
	 * @returns the selected visual filters
	 */
	public getSelectedFilters (recommendation) {

		return _.filter(recommendation.filters, 'selected');
	}

	/**
	 * get data based on page index changes
	 * @param event contains pageindex details
	 * @param recommendation of currently displayed recommendation
	 */
	public onPageChanged (event, recommendation) {
		recommendation.params.offset = event.page;
		this.populatePaginationInfo();
	}

	/**
	 * Handler for performing a search
	 * @param query search string
	 */
	public onSearchQuery (query?: string) {
		const recommendation = this.getCurrentTabData();
		recommendation.params.search = query;
		this.setFilter(recommendation);
	}

	/**
	 * onTableRow click
	 * @param row  table row
	 */
	public onRowSelect (row: any) {
		window.open(`${row.url}`, '_blank');
	}

	/**
	 * onTableRow click
	 * @param row  table row
	 */
	public onBugRowSelect (row: any) {
		const url = `https://bst.cloudapps.cisco.com/bugsearch/bug/${row.id}`;
		window.open(`${url}`, '_blank');
	}
}
