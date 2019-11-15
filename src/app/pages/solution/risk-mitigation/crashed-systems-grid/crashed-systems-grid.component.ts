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
import { AssetPanelLinkService, RacetrackInfoService } from '@services';
import { LogService } from '@cisco-ngx/cui-services';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { of, Subject } from 'rxjs';

/**
 * Show the grid of Crashed Systems data
 */
@Component({
	selector: 'app-crashed-systems-grid',
	styleUrls: ['./crashed-systems-grid.component.scss'],
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
	isLoading: boolean;

	constructor (
		private riskMitigationService: RiskMitigationService,
		private assetPanelLinkService: AssetPanelLinkService,
		private logger: LogService,
		private route: ActivatedRoute,
		private racetrackInfoService: RacetrackInfoService,
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
		this.searchQuery = _.get(changes, ['searchQuery', 'currentValue'], '');
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
				},
				{
					key: 'productId',
					name: I18n.get('_RMProductId_'),
					sortable: true,
					template: this.productIdTemplate,
				},
				{
					key: 'swType',
					name: I18n.get('_RMSoftwareType_'),
					sortable: true,
					template: this.swTypeCrahsedTemplate,
				},
				{
					key: 'swVersion',
					name: I18n.get('_RMSoftwareVersion_'),
					sortable: true,
					template: this.swVersionTemplate,
				},
				{
					key: 'firstOccurrence',
					name: I18n.get('_RMFirstOccurance_'),
					sortable: false,
					template: this.firstOccuranceTemplate,
				},
				{
					key: 'lastOccurrence',
					name: I18n.get('_RMLastOccurance_'),
					sortable: false,
					template: this.lastOccuranceTemplate,
				},
			],
			dynamicData: false,
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
		// this.updatePagerDetails();

		return this.riskMitigationService.getDeviceDetails(params)
				.pipe(
					takeUntil(this.destroy$),
					map((results: RiskAssets) => {
						this.isLoading = false;
						this.crashedSystemsGridDetails.tableData = results.deviceDetails;
						this.crashedSystemsGridDetails.totalItems = _.size(results.deviceDetails);
						this.crashedSystemsGridDetails.tableOffset = 0;
						this.updatePagerDetails();

					}),
					catchError(err => {
						this.isLoading = false;
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
	 * Updates the crashed grid pagination details
	 */
	public updatePagerDetails () {
		if (this.crashedSystemsGridDetails.totalItems) {
			const first = (this.paginationParams.page * 10) + 1;
			const last = (this.paginationParams.page * 10) +
			this.paginationParams.limit;
			this.crashPagination = `${first}-${last}`;
		} else {
			this.crashPagination = '0-0';
		}
		const paginationValueProp = {
			itemRange: this.crashPagination,
			totalItems: this.crashedSystemsGridDetails.totalItems,
		};
		this.paginationValue.emit(paginationValueProp);
	}

	/**
	 * Function to update pagination
	 * @param pageInfo will have the page info
	 *
	 */
	public onPagerUpdated (pageInfo: any) {
		this.crashedSystemsGridDetails.tableOffset = pageInfo.page;
		this.updatePagerDetails();
		const paginationValueProp = {
			itemRange: this.crashPagination,
			totalItems: this.crashedSystemsGridDetails.totalItems,
		};
		this.paginationValue.emit(paginationValueProp);
	}

	/**
	 * Determines whether panel close on when grids open details of asset
	 */
	public onPanelClose () {
		this.selectedSystem = null;
	}
}
