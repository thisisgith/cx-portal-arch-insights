import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnInit,
	OnDestroy,
	ViewChild,
	TemplateRef,
	SimpleChanges,
	OnChanges,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions, CuiModalService } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { Subject, of } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';
import { SoftwareGroupsResponse, OSVService, OsvPagination, SoftwareGroup } from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { ContactSupportComponent } from '@components';

/**
 * SoftwareGroups Component
 */
@Component({
	selector: 'app-software-groups',
	styleUrls: ['./software-groups.component.scss'],
	templateUrl: './software-groups.component.html',
})
export class SoftwareGroupsComponent implements OnInit, OnDestroy, OnChanges {
	@Input() public filters;
	@Output() public contactSupport = new EventEmitter();
	@Input() public cxLevel;
	@Input() public selectedSoftwareGroup;
	@Output() public selectedSoftwareGroupChange = new EventEmitter<SoftwareGroup>();
	@Input() public tabIndex;
	@Output() public tabIndexChange = new EventEmitter<number>();
	@Input() public softwareGroupsCount;
	@Input() public solution;
	@Input() public useCase;
	@ViewChild('recommendationsTemplate', { static: true })
	private recommendationsTemplate: TemplateRef<{ }>;
	@ViewChild('actionsTemplate', { static: true }) private actionsTemplate: TemplateRef<{ }>;
	@ViewChild('currentOSVersionsTemp', { static: true })
	private currentOSVersionsTemp: TemplateRef<{ }>;
	public softwareGroupsTable: CuiTableOptions;
	public status = {
		isLoading: false,
	};
	public softwareGroups: SoftwareGroup[];
	public pagination: OsvPagination;
	public paginationCount: string;
	public destroy$ = new Subject();
	public softwareGroupsParams: OSVService.GetSoftwareGroupsParams;
	public customerId: string;
	public alert: any = { };
	public searchOptions = {
		debounce: 600,
	};

	constructor (
		public logger: LogService,
		public osvService: OSVService,
		public route: ActivatedRoute,
		public cuiModalService: CuiModalService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.softwareGroupsParams = {
			customerId: this.customerId,
			pageIndex: 1,
			pageSize: 10,
			search: '',
			sort: 'profileName',
			sortOrder: 'asc',
			filter: '',
			solution: '',
			useCase: '',
		};
	}

	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		if (this.softwareGroupsCount > 0) {
			if (this.filters) {
				this.setFilter(this.filters);
			}
			this.softwareGroupsParams.solution = this.solution;
			this.softwareGroupsParams.useCase = this.useCase;
			this.loadData();
		}
	}

	/**
	 * lifecycle hook
	 * @param changes: changes
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const selectedSoftwareGroup = _.get(changes, ['selectedSoftwareGroup', 'currentValue']);
		const statusUpdated = _.get(selectedSoftwareGroup, 'statusUpdated');
		const isFirstChange = _.get(changes, 'selectedSoftwareGroup.firstChange');
		if (selectedSoftwareGroup && statusUpdated && !isFirstChange) {
			const selected = _.filter(this.softwareGroups, { id: selectedSoftwareGroup.id });
			if (selected && selected.length > 0) {
				selected[0].optimalVersion = _.get(selectedSoftwareGroup, 'optimalVersion');
			}
		}
		const currentFilter = _.get(changes, ['filters', 'currentValue']);
		const solution = _.get(changes, ['solution', 'currentValue']);
		const useCase = _.get(changes, ['useCase', 'currentValue']);
		if (currentFilter && !changes.filters.firstChange && this.softwareGroupsCount > 0) {
			this.setFilter(currentFilter);
			this.loadData();
		}
		if (solution && !_.get(changes, ['solution', 'firstChange'])) {
			this.softwareGroupsParams.solution = solution;
			this.loadData();
		}
		if (useCase && !_.get(changes, ['useCase', 'firstChange'])) {
			this.softwareGroupsParams.useCase = useCase;
			this.loadData();
		}
	}

	/**
	 * apply the filter selected by customer
	 * @param currentFilter set the filter selected by customer
	 */
	public setFilter (currentFilter) {
		const recommendationType = _.get(currentFilter, 'recommendationType', []);
		let filter = '';
		if (recommendationType.length > 0) {
			filter += `recommendationType:${recommendationType.join(',')}`;
		}
		this.softwareGroupsParams.pageIndex = 1;
		this.softwareGroupsParams.filter = filter;
	}

	/**
	 * Function used to load all of the data
	 */
	public loadData () {
		this.getSoftwareGroups();
	}

	/**
	 * fetches profile groups
	 * @returns profile groups list observable
	 */
	public getSoftwareGroups () {
		this.status.isLoading = true;
		return this.osvService.getSoftwareGroups(this.softwareGroupsParams)
			.pipe(
				map((response: SoftwareGroupsResponse) => {
					this.status.isLoading = false;
					response.uiProfileList.forEach((softwareGroup: SoftwareGroup) => {
						_.set(softwareGroup, 'actions', this.getRowActions(softwareGroup));
					});
					this.softwareGroups = response.uiProfileList;
					this.pagination = response.pagination;
					this.pagination.rows = this.softwareGroupsParams.pageSize;
					const first = (this.pagination.rows * (this.pagination.page - 1)) + 1;
					let last = (this.pagination.rows * this.pagination.page);
					if (last > this.pagination.total) {
						last = this.pagination.total;
					}

					this.paginationCount = `${first}-${last}`;
					this.buildTable();
				}),
				takeUntil(this.destroy$),
				catchError(err => {
					_.invoke(this.alert, 'show', I18n.get('_OsvGenericError_'), 'danger');
					this.logger.error('OSV Profile Groups : getsoftwareGroups() ' +
						`:: Error : (${err.status}) ${err.message}`);
					this.status.isLoading = false;

					return of();
				}),
			)
			.subscribe(() => {
				this.status.isLoading = false;
			});
	}

	/**
	 * Will construct the assets table
	 */
	public buildTable () {
		if (!this.softwareGroupsTable) {
			this.softwareGroupsTable = new CuiTableOptions({
				bordered: true,
				columns: [
					{
						key: 'profileName',
						name: I18n.get('_OsvSoftwareGroup_'),
						sortable: true,
						sortDirection: 'asc',
						sorting: true,
						width: '20%',
					},
					{
						key: 'productFamily',
						name: I18n.get('_OsvProductFamily_'),
						sortable: true,
						width: '25%',
					},
					{
						key: 'swType',
						name: I18n.get('_OsvOSType_'),
						sortable: true,
						width: '10%',
					},
					{
						name: I18n.get('_OsvCurrentOSVersion_'),
						sortable: false,
						template: this.currentOSVersionsTemp,
						width: '15%',
					},
					{
						key: 'optimalVersion',
						name: I18n.get('_OsvAcceptedRelease_'),
						render: item =>
							item.optimalVersion ? item.optimalVersion : '',
						sortable: false,
						width: '15%',
					},
					{
						key: 'assetCount',
						name: I18n.get('_OsvAssetCount_'),
						sortable: true,
						width: '10%',
					},
					{
						name: I18n.get('_OsvRecommendations_'),
						sortable: true,
						template: this.recommendationsTemplate,
						width: '15%',
					},
					{
						click: true,
						sortable: false,
						template: this.actionsTemplate,
					},
				],
				dynamicData: true,
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
	 * Function used to handle single row selection
	 * @param item the item we selected
	 */
	public onRowSelect (item: any) {
		this.softwareGroups.forEach((softwareGroup: any) => {
			if (softwareGroup !== item) {
				softwareGroup.rowSelected = false;
			}
			softwareGroup.statusUpdated = false;
		});
		item.rowSelected = !item.rowSelected;
		this.tabIndex = 0;
		this.tabIndexChange.emit(this.tabIndex);
		this.selectedSoftwareGroup = item.rowSelected ? item : null;
		this.selectedSoftwareGroupChange.emit(this.selectedSoftwareGroup);
	}

	/**
	 * Page change handler
	 * @param event the event emitted
	 */
	public onPageChanged (event: any) {
		this.softwareGroupsParams.pageIndex = (event.page + 1);
		this.loadData();
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		_.invoke(this.alert, 'hide');
		_.map(this.softwareGroups, (softwareGroup: any) => {
			softwareGroup.rowSelected = false;
		});
		this.destroy$.next();
		this.destroy$.complete();
	}

	/**
	 * Returns the row specific actions
	 * @param softwareGroup the row we're building our actions for
	 * @returns the built actions
	 */
	public getRowActions (softwareGroup: SoftwareGroup) {
		return _.filter([
			_.get(softwareGroup, 'recommendation') === 'automated' ? {
				label: I18n.get('_OsvViewAutomatedRecommendations_'),
				onClick: () => {
					this.openSoftwareGroupDetails(0, softwareGroup);
				},
			} : undefined,
			{
				label: I18n.get('_OsvViewSoftwareVersionSummary_'),
				onClick: () => {
					const tabIndex = _.get(softwareGroup, 'recommendation') === 'automated' ? 1 : 0;
					this.openSoftwareGroupDetails(tabIndex, softwareGroup);
				},
			},
			{
				label: I18n.get('_OsvViewAssets_'),
				onClick: () => {
					const tabIndex = _.get(softwareGroup, 'recommendation') === 'automated' ? 2 : 1;
					this.openSoftwareGroupDetails(tabIndex, softwareGroup);
				},
			},
			{
				label: I18n.get('_OsvViewVersions_'),
				onClick: () => {
					const tabIndex = _.get(softwareGroup, 'recommendation') === 'automated' ? 3 : 2;
					this.openSoftwareGroupDetails(tabIndex, softwareGroup);
				},
			},
		]);
	}

	/**
	 * * open software group details
	 * @param tabIndex tab to open
	 * @param softwareGroup software group data for details
	 */
	public openSoftwareGroupDetails (tabIndex, softwareGroup) {
		this.selectedSoftwareGroup = _.cloneDeep(softwareGroup);
		this.selectedSoftwareGroupChange.emit(this.selectedSoftwareGroup);
		this.tabIndex = tabIndex;
		this.tabIndexChange.emit(this.tabIndex);
	}

	/**
	 * open up the versions tab in software group detail
	 * @param event click event
	 * @param item software groups row item
	 */
	public openCurrentVersionsTab (event: any, item: SoftwareGroup) {
		event.stopPropagation();
		this.openSoftwareGroupDetails(3, item);
	}

	/**
	 * sort table
	 * @param sortColumn column to sort by
	 */
	public sortTable (sortColumn: any) {
		if (!sortColumn.sortable) {
			return;
		}
		if (sortColumn.sortDirection === 'asc') {
			sortColumn.sortDirection = 'desc';
		} else {
			sortColumn.sortDirection = 'asc';
		}
		this.softwareGroupsTable.columns.forEach(column => {
			column.sorting = false;
		});
		sortColumn.sorting = true;
		this.softwareGroupsParams.sortOrder = sortColumn.sortDirection;
		this.softwareGroupsParams.sort = sortColumn.key;
		this.softwareGroupsParams.pageIndex = 1;
		this.loadData();
	}

	/**
	 * Handler for performing a search
	 * @param query search string
	 */
	public onSearchQuery (query?: string) {
		this.softwareGroupsParams.search = query;
		this.softwareGroupsParams.pageIndex = 1;
		this.loadData();
	}

	/**
	 * Open contact support modal
	 * @param selectedSoftwareGroup softwareGroup for which the request has to be made
	 */
	public async openContactSupport (selectedSoftwareGroup: SoftwareGroup) {
		const options = {
			contactExpert: true,
			productFamily: selectedSoftwareGroup.productFamily,
			osType: selectedSoftwareGroup.swType,
			requestTypes: I18n.get('_OsvContactExpertRequestTypes_'),
		};
		const result = await this.cuiModalService.showComponent(ContactSupportComponent, options);
		if (result) {
			this.loadData();
		}
	}
}
