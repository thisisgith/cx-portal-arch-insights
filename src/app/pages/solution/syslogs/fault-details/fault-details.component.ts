import {
	Component,
	OnInit,
	Input,
	Output,
	EventEmitter,
	ViewChild,
	TemplateRef,
	OnDestroy,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { UserResolve } from '@utilities';
import {
	DetailsPanelStackService,
	AssetPanelLinkService,
	RacetrackInfoService,
} from '@services';
import {
	FaultService,
	FaultSearchParams,
	FaultGridData,
	FaultSummaryDetails,
	FaultAffectedSystemDetails,
	InventoryService,
	FaultProductId,
	FaultSwType,
	RacetrackSolution,
	RacetrackTechnology,
	FaultICSearchParams,
	FaultIcSettings,
	FaultAffectedSystems,
	FaultFilterData,
	FaultSummary,
} from '@sdp-api';
import { takeUntil, catchError, map } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { AssetLinkInfo, Case, Panel360 } from '@interfaces';
import { CaseDetails } from '@cui-x/services';

/**
 * FaultDetailsComponent is a details view of Fault component
 */
@Component({
	selector: 'fault-details',
	styleUrls: ['./fault-details.component.scss'],
	templateUrl: './fault-details.component.html',
})
export class FaultDetailsComponent implements OnInit, Panel360, OnDestroy {

	@Input('fault') public fault: FaultGridData;
	@Input('faultParams') public faultParams: FaultSearchParams;
	@Input('lastUpdateTime') public lastUpdateTime: string;
	@Output('showFaultDetails') public showFaultDetails = new EventEmitter();
	@Output('showSuccess') public showSuccess = new EventEmitter();

	public searchParams: FaultSearchParams;
	public searchIcParams: FaultICSearchParams;
	private destroy$ = new Subject();
	public tableOptions: CuiTableOptions;
	public faultDetails: FaultSummaryDetails[];
	public fullscreen = false;
	public faultAffectedDetails: FaultAffectedSystemDetails[];
	public tableLimit = 10;
	public tableOffset = 0;
	public affectedCount: number;
	public assetParams: InventoryService.GetAssetsParams;
	public assetLinkInfo: AssetLinkInfo = Object.create({ });
	public selectedAsset = false;
	public selectedCase: Case;
	public selectedDetails: CaseDetails;
	public loading = false;
	public affectedSystemLoading = false;
	public alert: any = { };
	public productID: FaultProductId[];
	public software: FaultSwType[];
	public serialNumber: string;
	public icSettingsResponse: FaultIcSettings;
	public paginationCount;
	public timeRange: any[] = [
		{
			name: I18n.get('_FaultDay1_'),
			value: 1,
		},
		{
			name: I18n.get('_FaultDays7_'),
			value: 7,
		},
		{
			name: I18n.get('_FaultDays15_'),
			value: 15,
		},
		{
			name: I18n.get('_FaultDays30_'),
			value: 30,
		}];

	public selectDropDown = {
		productID: '',
		Software: '',
		timePeriod: '',
	};

	public FAULT_CONSTANT = {
		ACTIVE: 'ACTIVE',
		AUTOMATED: 'Automated Faults',
		DETECTED: 'Detected Faults',
		FILTER_TYPE: 'productId,swType',
		INACTIVE: 'INACTIVE',
		PRODUCT_ID: 'PRODUCTID',
		SOFTWARE: 'SOFTWARE',
		TIME: 'TIME',
	};

	public faultIcSettings = {
		icName: '',
		tacEnable: '',
	};

	@ViewChild('systemName', { static: true })
		public systemNameTemplate: TemplateRef<{ }>;
	@ViewChild('productId', { static: true })
	public productIdTemplate: TemplateRef<{ }>;
	@ViewChild('softwareType', { static: true })
		public softwareTypeTemplate: TemplateRef<{ }>;
	@ViewChild('caseNumber', { static: true })
		public caseNumberTemplate: TemplateRef<{ }>;
	@ViewChild('caseCreatedDate', { static: true })
		public caseCreatedDateTemplate: TemplateRef<{ }>;

	constructor (
		private logger: LogService,
		private userResolve: UserResolve,
		private detailsPanelStackService: DetailsPanelStackService,
		private assetPanelLinkService: AssetPanelLinkService,
		private faultService: FaultService,
		private racetrackInfoService: RacetrackInfoService,
	) {
		this.searchParams = Object.create({ });
		this.searchIcParams = Object.create({ });
		this.userResolve.getCustomerId()
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe((id: string) => {
				this.searchParams.customerId = id;
			});
		this.searchParams.pageNo = 1;
	}

	/**
	 * Will be called when this component called
	 */
	public ngOnInit () {
		this.loading = true;
		this.searchParams.msgType = this.fault.msgType;
		this.searchParams.tacEnabled = this.faultParams.tacEnabled;
		this.searchParams.faultSeverity = this.faultParams.faultSeverity;
		this.searchParams.days = this.faultParams.days;
		this.searchParams.filterTypes = this.FAULT_CONSTANT.FILTER_TYPE;
		this.racetrackInfoService.getCurrentSolution()
		.pipe(takeUntil(this.destroy$))
		.subscribe((solution: RacetrackSolution) => {
			this.searchParams.solution = _.get(solution, 'name');
		});
		this.racetrackInfoService.getCurrentTechnology()
		.pipe(takeUntil(this.destroy$))
		.subscribe((technology: RacetrackTechnology) => {
			this.searchParams.useCase = _.get(technology, 'name');
			this.getFaultSummaryDetails(this.searchParams);
			this.getAffectedSystemDetails(this.searchParams);
			this.getFiltersData();
		});

		this.detailsPanelStackService.push(this);
		this.buildTable();
	}

	/**
	 * Get Fault summary details
	 *
	 * @param searchParams FaultSearchParams
	 */
	public getFaultSummaryDetails (searchParams: FaultSearchParams) {
		this.faultService.getSummaryDetails(searchParams)
			.pipe(takeUntil(this.destroy$),
			map((response: FaultSummary) => {
				this.faultDetails = response.responseData;
			}),
			catchError(err => {
				_.invoke(this.alert, 'show',  I18n.get('_FaultGenericError_'), 'danger');
				this.logger.error(
					'FaultDetailsComponent : getFaultSummaryDetails() ' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}))
			.subscribe();
	}

	/**
	 * Get Affected system details
	 *
	 * @param searchParams FaultSearchParams
	 */
	public getAffectedSystemDetails (searchParams: FaultSearchParams) {
		this.affectedSystemLoading = true;
		this.searchParams.lastUpdateTime = this.lastUpdateTime;
		this.faultService.getAffectedSystems(searchParams)
			.pipe(takeUntil(this.destroy$),
			map((response: FaultAffectedSystems) => {
				this.affectedCount = response.count;
				this.faultAffectedDetails = response.responseData;
				this.preparePaginationHeader();
				this.affectedSystemLoading = false;
			}),
			catchError(err => {
				this.affectedSystemLoading = false;
				_.invoke(this.alert, 'show',  I18n.get('_FaultGenericError_'), 'danger');
				this.logger.error(
					'FaultDetailsComponent : getAffectedSystemDetails() ' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}))
			.subscribe();
	}

	/**
	 * it will prepare Pagination header to show from which to which records showing
	 */
	private preparePaginationHeader () {
		if (this.affectedCount !== 0) {
			const tableStartIndex = (this.tableLimit * (this.searchParams.pageNo - 1)) + 1;
			let tableEndIndex = (this.tableLimit * this.searchParams.pageNo);
			if (tableEndIndex > this.affectedCount) {
				tableEndIndex = this.affectedCount;
			}
			this.paginationCount = `${tableStartIndex}-${tableEndIndex}`;
		} else {
			this.paginationCount = '0-0';
		}
	}

	/**
	 * Get Fault filter data
	 */
	public getFiltersData () {
		this.faultService.getFaultFiltersData(this.searchParams)
			.pipe(takeUntil(this.destroy$),
			map((response: FaultFilterData) => {
				this.productID = _.get(response, ['responseData', 0, 'productId']);
				this.software = _.get(response, ['responseData', 1, 'swType']);
				this.loading = false;
			}),
			catchError(err => {
				this.loading = false;
				_.invoke(this.alert, 'show',  I18n.get('_FaultGenericError_'), 'danger');
				this.logger.error(
					'FaultDetailsComponent : getFiltersData() ' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}))
			.subscribe();
	}

	/**
	 * Will construct the Affected Fault table
	 */
	private buildTable () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					name: I18n.get('_FaultSystemName_'),
					sortable: true,
					template: this.systemNameTemplate,
					width: '30%',
				},
				{
					name: I18n.get('_FaultProductId_'),
					sortable: true,
					template: this.productIdTemplate,
					width: '14%',
				},
				{
					name: I18n.get('_FaultSoftwareType_'),
					sortable: true,
					template: this.softwareTypeTemplate,
					width: '18%',
				},
				{
					name: I18n.get('_FaultCaseNumber_'),
					sortable: true,
					template: this.caseNumberTemplate,
					width: '16%',
				},
				{
					name: I18n.get('_FaultDateAndTime'),
					sortable: true,
					template: this.caseCreatedDateTemplate,
					width: '22%',
				},
			],
			dynamicData: true,
			hover: true,
			padding: 'loose',
			selectable: false,
			singleSelect: true,
			sortable: true,
			striped: false,
		});
	}

	/**
	 * Handles the hidden event from details-panel
	 * @param hidden false if details slideout is open
	 */
	public handleHidden (hidden: boolean) {
		if (hidden) {
			this.onPanelClose();
			this.showFaultDetails.emit(false);
			this.detailsPanelStackService.reset();
		}
	}

	/**
	 * to close the panel
	 */
	public onPanelClose () {
		this.selectedAsset = false;
	}

	/**
	 * Closes all details panels
	 */
	public onAllPanelsClose () {
		this.detailsPanelStackService.reset();
		this.showFaultDetails.emit(false);
	}

	/**
	 * Removes the details panel from the stack when the back button is pressed
	 */
	public onPanelBack () {
		this.detailsPanelStackService.pop();
	}

	/**
	 * On details filter select
	 *
	 * @param event Event
	 * @param paramType string
	 */
	public onSelection (event, paramType: string) {
		if (paramType.toUpperCase() === this.FAULT_CONSTANT.PRODUCT_ID) {
			this.searchParams.productId = event;
		} else if (paramType.toUpperCase() === this.FAULT_CONSTANT.SOFTWARE) {
			this.searchParams.software = event;
		} else {
			this.searchParams.days = event;
		}
		this.getAffectedSystemDetails(this.searchParams);
	}

	/**
	 * Connect to Asset details panel
	 *
	 * @param serialnumber string
	 */
	public connectToAsset (serialnumber) {
		this.serialNumber = serialnumber;
		this.assetParams = {
			customerId: this.searchParams.customerId,
			serialNumber: [serialnumber],
			solution: this.searchParams.solution,
			useCase: this.searchParams.useCase,
		};
		this.getAssetLinkData(this.assetParams);
		this.selectedAsset = true;
	}

	/**
	 * Get asset link data
	 * @param assetParams InventoryService.GetAssetsParams
	 * @returns Asset link information
	 */
	private getAssetLinkData (assetParams: InventoryService.GetAssetsParams) {
		return this.assetPanelLinkService.getAssetLinkData(assetParams)
			.pipe(takeUntil(this.destroy$),
			map((response: AssetLinkInfo) => {
				this.assetLinkInfo.asset = _.get(response, [0, 'data', 0]);
				this.assetLinkInfo.element = _.get(response, [1, 'data', 0]);
			}),
			catchError(err => {
				_.invoke(this.alert, 'show',  I18n.get('_FaultGenericError_'), 'danger');
				this.logger.error(
					'FaultDetailsComponent : getAssetLinkData() ' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}))
			.subscribe();
	}

	/**
	 * Show case details view
	 * @param event case number
	 */
	public connectToCaseDetails (event) {
		this.selectedCase = Object.create({ });
		this.selectedCase.caseNumber = event;
	}

	/**
	 * Close case details view
	 */
	public detailsClose () {
		this.selectedCase = null;
	}

	/**
	 * Open confirmation screen
	 */
	public openConfirmation () {
		this.searchIcParams.syslogsignature = this.fault.msgType;
		this.searchIcParams.enable =
			(this.faultParams.tacEnabled.toUpperCase() === this.FAULT_CONSTANT.ACTIVE) ? false : true;
		this.updateIcSettings(this.searchIcParams);
	}

	/**
	 * Update Ic settings
	 *
	 * @param searchIcParams FaultICSearchParams
	 */
	public updateIcSettings (searchIcParams: FaultICSearchParams) {
		this.faultService.updateIcSettings(searchIcParams)
			.pipe(takeUntil(this.destroy$),
			map((response: FaultIcSettings) => {
				this.icSettingsResponse = response;
				this.icSsttings();
			}),
			catchError(err => {
				_.invoke(this.alert, 'show',  I18n.get('_FaultGenericError_'), 'danger');
				this.logger.error(
					'FaultDetailsComponent : updateIcSettings() ' +
				`:: Error : (${err.status}) ${err.message}`);

				return of({ });
			}))
			.subscribe();
	}

	/**
	 * Update ic settings
	 */
	private icSsttings () {
		if (this.icSettingsResponse.statusCode.toUpperCase() !== 'OK') {
			_.invoke(this.alert, 'show', this.icSettingsResponse.statusMessage, 'danger');
		} else {
			this.faultIcSettings.icName = this.fault.title;
			this.faultIcSettings.tacEnable = this.searchIcParams.enable
				? this.FAULT_CONSTANT.AUTOMATED : this.FAULT_CONSTANT.DETECTED;
			this.showSuccess.emit(this.faultIcSettings);
			this.onAllPanelsClose();
		}
	}

	/**
	 * On pager update
	 * @param pageInfo Page info
	 */
	public onPagerUpdated (pageInfo) {
		this.searchParams.pageNo = pageInfo.page + 1;
		this.tableOffset = pageInfo.page;
		this.searchParams.size = this.tableLimit;
		this.getAffectedSystemDetails(this.searchParams);
	}

	/**
	 * This will sort the records absed on column
	 * @param event - click event CuiTableOptions column info
	 */
	public onTableSortingChanged (event) {
		this.searchParams.sortField = this.getSortKey(event.name);
		this.searchParams.sortOrder = event.sortDirection;
		this.getAffectedSystemDetails(this.searchParams);
	}

	private getSortKey = sortKey => {
		switch (sortKey) {
			case 'System Name':
				return 'hostName';
			case 'Product ID':
				return 'productId';
			case 'Software Type':
				return 'swType';
			case 'Case Number':
				return 'tacCaseNo';
			case 'Date and Time':
				return 'taccaseCreatedDate';
			default:
				return 'hostName';
		}
	}

	/**
	 * OnDestroy Lifecycle Hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
