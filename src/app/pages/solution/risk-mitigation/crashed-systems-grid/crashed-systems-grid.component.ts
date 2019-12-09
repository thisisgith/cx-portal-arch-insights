import {
	Component,
	OnChanges,
	Input,
	SimpleChanges,
	ViewChild,
	TemplateRef,
	Output,
	EventEmitter,
} from '@angular/core';
import { RiskMitigationService, RiskAssets, RiskAsset } from '@sdp-api';
import { LogService, SortableField } from '@cisco-ngx/cui-services';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { takeUntil, catchError, switchMap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Show the grid of Crashed Systems data
 */
@Component({
	selector: 'app-crashed-systems-grid',
	templateUrl: './crashed-systems-grid.component.html',
})
export class CrashedSystemsGridComponent implements OnChanges {
	@Input() public selectedFilter = '';
	@Input() public searchQuery = '';
	@Input() public selectedSolution = '';
	@Input() public selectedTechnology = '';
	@Output() public paginationValue = new EventEmitter();
	public customerId: string;
	public crashesSystemsGridOptions: CuiTableOptions;
	public crashedSystemsGridDetails: any;
	public selectedSystem: RiskAsset;
	private destroy$ = new Subject();
	public crashPagination: string;
	public paginationParams = {
		limit: 10,
		page: 0,
	};
	public pageFirstRecord = 0;
	public pageLastRecord = 10;
	public isLoading: boolean;
	public alert = { };
	public pageInfo = {
		limit: 2,
		page: 0,
	};

	@ViewChild('lastOccuranceTemplate', { static: true })
	public lastOccuranceTemplate: TemplateRef<string>;
	@ViewChild('firstOccuranceTemplate', { static: true })
	public firstOccuranceTemplate: TemplateRef<string>;
	@ViewChild('swVersionTemplate', { static: true })
	public swVersionTemplate: TemplateRef<string>;
	@ViewChild('swTypeCrahsedTemplate', { static: true })
	public swTypeCrahsedTemplate: TemplateRef<string>;
	@ViewChild('neNameTemplate', { static: true })
	public neNameTemplate: TemplateRef<string>;
	@ViewChild('productIdTemplate', { static: true })
	public productIdTemplate: TemplateRef<string>;

	constructor (
		private riskMitigationService: RiskMitigationService,
		private logger: LogService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.crashedSystemsGridDetails = {
			tableData: [],
			tableLimit: 10,
			tableOffset: 0,
			totalItems: 0,
		};
		this.crashedSystemsGridInit();

	}

	/**
	 * Updates the changes for filter, solution, useCase, searchQuery
	 * @param changes changes object
	 */
	public ngOnChanges (changes: SimpleChanges) {
		this.selectedSolution = _.get(
			changes,
			['selectedSolution', 'currentValue'],
			this.selectedSolution,
		);
		this.selectedTechnology = _.get(
			changes,
			['selectedTechnology', 'currentValue'],
			this.selectedTechnology,
		);
		this.selectedFilter = _.get(
			changes,
			['selectedFilter', 'currentValue'],
			this.selectedFilter,
		);
		this.searchQuery = _.get(changes, ['searchQuery', 'currentValue'], this.searchQuery);
		this.getCrashedSystemDetails();
	}

	/**
	 * Initialise crashed system table configuration
	 */
	public crashedSystemsGridInit () {
		this.crashesSystemsGridOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'neName',
					name: I18n.get('_RMAsset_'),
					sortable: true,
					template: this.neNameTemplate,
					width: '18%',
				},
				{
					key: 'productId',
					name: I18n.get('_RMProductId_'),
					sortable: true,
					template: this.productIdTemplate,
					width: '18%',
				},
				{
					key: 'swType',
					name: I18n.get('_RMSoftwareType_'),
					sortable: true,
					template: this.swTypeCrahsedTemplate,
					width: '18%',
				},
				{
					key: 'swVersion',
					name: I18n.get('_RMSoftwareVersion_'),
					sortable: true,
					template: this.swVersionTemplate,
					width: '10%',
				},
				{
					key: 'firstOccurrence',
					name: I18n.get('_RMFirstOccurance_'),
					sortable: false,
					template: this.firstOccuranceTemplate,
					width: '18%',
				},
				{
					key: 'lastOccurrence',
					name: I18n.get('_RMLastOccurance_'),
					sortable: false,
					template: this.lastOccuranceTemplate,
					width: '18%',
				},
			],
			dynamicData: true,
			hover: true,
			singleSelect: true,
			striped: false,
		});
	}

	/**
	 * Fetches the all the crashes data
	 * @returns the total crashes observable
	 */
	public getCrashedSystemDetails () {
		const params = this.getCrashedSystemsParams();
		this.isLoading = true;
		this.paginationValue.emit({
			itemRange: '0-0',
			totalItems: 0,
		});
		_.invoke(this.alert, 'hide', I18n.get('_RccErrorResults_'), 'danger');

		return this.riskMitigationService.getDeviceDetails(params)
				.pipe(
					takeUntil(this.destroy$),
					switchMap((results: RiskAssets) => {
						this.isLoading = false;
						this.crashedSystemsGridDetails.tableData = results.deviceDetails;
						this.crashedSystemsGridDetails.totalItems = _.size(results.deviceDetails);
						this.crashedSystemsGridDetails.tableOffset = 0;
						this.onPagerUpdated(this.pageInfo);

						return of(results);
					}),
					catchError((err: HttpErrorResponse) => {
						this.isLoading = false;
						if (err.status >= 500) {
							_.invoke(this.alert, 'show', I18n.get('_RccErrorResults_'), 'danger');

						}
						this.crashedSystemsGridDetails.tableData = [];
						this.logger.error('Crash Assets : getDeviceDetails() ' +
							`:: Error : (${err.status}) ${err.message}`);

						return of({ });
					}),
				)
				.subscribe();

	}

	/**
	 * parameters for crashed systems data
	 * @returns request parameters to get crashed systems data
	 */
	public getCrashedSystemsParams () {
		return {
			customerId : this.customerId,
			searchQuery: this.searchQuery,
			solution: this.selectedSolution,
			timePeriod: this.selectedFilter,
			useCase: this.selectedTechnology,
		};
	}
	/**
	 * Function to update pagination
	 * @param pageInfo will have the page info
	 *
	 */

	public onPagerUpdated (pageInfo: any) {
		this.crashedSystemsGridDetails.tableOffset = pageInfo.page;
		this.pageFirstRecord = (this.crashedSystemsGridDetails.totalItems)
		? ((pageInfo.page * pageInfo.limit) + 1) : 0;
		this.pageLastRecord = (pageInfo.page * pageInfo.limit) + 10;
		if (this.pageLastRecord > this.crashedSystemsGridDetails.totalItems) {
			this.pageLastRecord = this.crashedSystemsGridDetails.totalItems;
		}
		this.crashPagination = `${this.pageFirstRecord}-${this.pageLastRecord}`;
		const paginationValueProp = {
			itemRange: this.crashPagination,
			totalItems: this.crashedSystemsGridDetails.totalItems,
		};
		this.paginationValue.emit(paginationValueProp);
	 }
	/**
	 * This will sort the records absed on column
	 *
	 * @param event - click event CuiTableOptions column info
	 * @memberof FaultsComponent
	 */
	public onTableSortingChanged (event) {
		this.isLoading = true;
		this.sortTableData(event, this.crashesSystemsGridOptions.columns, this.crashedSystemsGridDetails.tableData);
		setTimeout(() => {
			this.isLoading = false;
		}, 1000);
	}

	/**
	 * Sorts a data set by a field
	 * @param sortField The field to sort by
	 * @param allFields All sortable fields
	 * @param tableData The data to sort
	 * @returns sortDataByField
	 */
	public sortTableData (sortField: any, allFields: SortableField[], tableData: any[]) {
		if (!sortField.sortable) {
			return tableData;
		}

		const sortDirection = sortField.sortDirection;
		for (const column of allFields) {
			column.sorting = false;
			column.sortDirection = 'desc';
		}
		sortField.sorting = true;
		sortField.sortDirection = sortDirection;

		return this.sortDataByField(sortField, tableData);
	}
	public sortDataByField (sortField, tableData: any[]) {
		return tableData.sort((a, b) => {
			if (sortField.sortDirection === 'asc' && sortField.key) {
				const valA = typeof a[sortField.key] !== 'boolean' ?
						a[sortField.key] : a[sortField.key] ? 0 : 1;
				const valB = typeof b[sortField.key] !== 'boolean' ?
						b[sortField.key] : b[sortField.key] ? 0 : 1;

				return (valA && valB)  ?
				(valA.toLowerCase() > valB.toLowerCase() ? 1 : valA.toLowerCase() < valB.toLowerCase() ? -1 : 0)
				: 0;
			}
		});
	}
	/**
	 * Determines whether panel close on when grids open details of asset
	 */
	public onPanelClose () {
		this.selectedSystem = null;
	}
}
