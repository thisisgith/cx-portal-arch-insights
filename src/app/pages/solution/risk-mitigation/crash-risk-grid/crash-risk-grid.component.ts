import {
	Component,
	Input,
	TemplateRef,
	ViewChild,
	SimpleChanges,
	OnChanges,
	Output,
	EventEmitter,
} from '@angular/core';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	RiskMitigationService,
	HighCrashRiskPagination,
	HighCrashRisk,
	HighCrashRiskDevices,
	InventoryService,
} from '@sdp-api';
import { map, catchError, takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { LogService } from '@cisco-ngx/cui-services';
import { AssetPanelLinkService } from '@services';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { AssetLinkInfo } from '@interfaces';
/**
 * High Crash Risk Grid Component
 */
@Component({
	selector: 'app-crash-risk-grid',
	templateUrl: './crash-risk-grid.component.html',
})
export class CrashRiskGridComponent implements OnChanges {
	@Input() public selectedFilter = '';
	@Input() public searchQuery = '';
	@Input() public selectedSolution = '';
	@Input() public selectedTechnology = '';
	@Output() public paginationValue = new EventEmitter();
	public highCrashRiskAssetsGridOptions: CuiTableOptions;

	public highCrashRiskSystemsGridDetails = {
		tableData: [],
		tableLimit: 10,
		tableOffset: 0,
		totalItems: 0,
	};
	public crashRiskGridLoading = false;
	public highCrashRiskParams: HighCrashRiskPagination;
	public hcrPagination;
	private destroy$ = new Subject();
	private logger: LogService;
	public customerId: any;
	public selectedFingerPrintdata: HighCrashRiskDevices;
	public showFpDetails = false;
	public assetLinkInfo: AssetLinkInfo = Object.create({ });
	public assetParams: InventoryService.GetAssetsParams;

	@ViewChild('deviceNameTemplate', { static: true })
	public deviceNameTemplate: TemplateRef<string>;
	@ViewChild('productIdTemplate', { static: true })
	public productIdTemplate: TemplateRef<string>;
	@ViewChild('softwareVersionTemplate', { static: true })
	public softwareVersionTemplate: TemplateRef<string>;
	@ViewChild('softwareTypeTemplate', { static: true })
	public softwareTypeTemplate: TemplateRef<string>;
	@ViewChild('riskTooltipTemplate', { static: true })
	public riskTooltipTemplate: TemplateRef<string>;
	@ViewChild('cardColors', { static: true })
	public cardColorsTemplate: TemplateRef<string>;

	constructor (
		private riskMitigationService: RiskMitigationService,
		private assetPanelLinkService: AssetPanelLinkService,
		private route: ActivatedRoute,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}

	/**
	 * Read selected filter value
	 * @param changes data of OnChages Object
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
		this.highCrashRiskParams = this.getCrashRiskDevicePrams();
		this.crashRiskGridInit();
		this.getFingerPrintDeviceDetails(this.highCrashRiskParams);
	}

	/**
	 * get the finger print device details
	 * @param param service params
	 * @returns observable of crash devices
	 */

	public getFingerPrintDeviceDetails (param: HighCrashRiskPagination) {
		this.crashRiskGridLoading = true;

		return this.riskMitigationService
			.getFingerPrintDeviceDetailsData(param)
			.pipe(
				takeUntil(this.destroy$),
				map((results: HighCrashRisk) => {
					this.crashRiskGridLoading = false;
					this.highCrashRiskSystemsGridDetails.tableData =
						results.devices;
					this.highCrashRiskSystemsGridDetails.totalItems =
						results.count;
					this.highCrashRiskSystemsGridDetails.tableOffset =
						param.page;

					const first = this.highCrashRiskSystemsGridDetails.totalItems
						? this.highCrashRiskParams.page * 10 + 1
						: this.highCrashRiskParams.page;
					const last =
						this.highCrashRiskParams.page * 10 +
						this.highCrashRiskSystemsGridDetails.tableData.length;
					const paginationValueProp = {
						itemRange: `${first}-${last}`,
						totalItems: this.highCrashRiskSystemsGridDetails.totalItems,
					};
					this.paginationValue.emit(paginationValueProp);
				}),
				catchError(err => {
					this.highCrashRiskSystemsGridDetails.tableData = [];
					this.logger.error(
						'Crash Assets : getFingerPrintDeviceDetails() ' +
							`:: Error : (${err.status}) ${err.message}`,
					);

					return of({ });
				}),
			)
			.subscribe();
	}

	/**
	 * Cui table Initialization
	 */
	private crashRiskGridInit () {
		this.highCrashRiskAssetsGridOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'deviceName',
					name: I18n.get('_RMAsset_'),
					sortable: true,
					template: this.deviceNameTemplate,
					width: '25%',
				},
				{
					key: 'productId',
					name: I18n.get('_RMProductId_'),
					sortable: true,
					template: this.productIdTemplate,
					width: '25%',
				},
				{
					key: 'softwareType',
					name: I18n.get('_RMSoftwareType_'),
					sortable: true,
					template: this.softwareTypeTemplate,
					width: '25%',
				},
				{
					key: 'softwareVersion',
					name: I18n.get('_RMSoftwareVersion_'),
					sortable: true,
					template: this.softwareVersionTemplate,
					width: '15%',
				},
				{
					headerTemplate: this.riskTooltipTemplate,
					key: 'globalRiskRank',
					sortable: true,
					template: this.cardColorsTemplate,
					width: '10%',
				},
			],
			dynamicData: true,
			hover: true,
			singleSelect: true,
			striped: false,
		});
	}
	/**
	 * Connects to fp details
	 * @param asset is selected asset from grid
	 */
	public connectToFpDetails (asset: any) {
		this.selectedFingerPrintdata = asset;
		_.set(this.selectedFingerPrintdata, 'active', true);
	}

	/**
	 * Function to capture the row click on grid
	 * @param event will have the device details
	 */
	public highCrashTableSorted (event) {
		if (event.key === 'globalRiskRank') {
			event.key = 'riskScore';
		}
		this.highCrashRiskParams.sort = `${event.key}.${event.sortDirection}`;
		this.getFingerPrintDeviceDetails(this.highCrashRiskParams);
	}

	/**
	 * Function to capture High crash grid updation
	 * @param param will have the high crash risk grid pagination info
	 */
	public onHcrPagerUpdated (param: HighCrashRiskPagination) {
		this.highCrashRiskSystemsGridDetails.tableOffset = param.page;
		this.highCrashRiskSystemsGridDetails.tableLimit = param.limit;
		this.highCrashRiskParams.size = this.highCrashRiskSystemsGridDetails.tableLimit;
		this.highCrashRiskParams.page = this.highCrashRiskSystemsGridDetails.tableOffset;
		this.getFingerPrintDeviceDetails(this.highCrashRiskParams);
	}

	/**
	 * Initialize parameters for Crash-Risk Devices API request
	 * @returns return the request parameters required for Crash-Risk_Devices API request
	 */
	private getCrashRiskDevicePrams () {
		return {
			customerId: this.customerId,
			globalRiskRank: this.selectedFilter,
			page: 0,
			search: this.searchQuery,
			size: 10,
			solution: this.selectedSolution,
			sort: '',
			useCase: this.selectedTechnology,
		};
	}

	/**
	 * Determines whether panel close on when grids open details of asset
	 */
	public onPanelClose () {
		this.selectedFingerPrintdata = null;
	}

}