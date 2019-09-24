import { Component, Input, OnInit, ViewChild, TemplateRef, SimpleChanges } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { Subscription, Subject, forkJoin } from 'rxjs';
import { RccAssetSelectReq,
		RccService,
		InventoryService,
		AssetLinkInfo,
	} from '@sdp-api';
import { takeUntil } from 'rxjs/operators';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';
import { ActivatedRoute } from '@angular/router';
import { AssetPanelLinkService } from '@services';
/**
 * Component for portal support
 */
@Component({
	selector: 'app-rcc-asset-violation-details',
	styleUrls: ['./rcc-asset-violation-details.component.scss'],
	templateUrl: './rcc-asset-violation-details.component.html',
})
export class RccAssetViolationDetailsComponent implements OnInit {
	constructor (
		private logger: LogService,
		private rccService: RccService,
		public userResolve: UserResolve,
		private route: ActivatedRoute,
		private assetPanelLinkService: AssetPanelLinkService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}
	public assetParams: InventoryService.GetAssetsParams;
	public assetLinkInfo: AssetLinkInfo;
	public rccAssetPolicyTableOptions: CuiTableOptions;
	public rccMessageTableOptions: CuiTableOptions;
	public assetRowParams: any;
	public assetPolicyDropdownSubscripion: Subscription;
	public assetPolicyTableSubscription: Subscription;
	public tableLimit = 10;
	public totalItems = 0;
	public tableOffset = 0;
	public assetPolicyFilterInfo = { };
	public rccAssetPolicyTableData = [];
	public rccMessageTableData = [];
	public assetPolicyGroupItems = [];
	public assetPolicySeverityItems = [];
	public policyGroupSelection = '';
	public policySeveritySelection = '';
	public customerId: string;
	public initialLoading = false;
	public isLoading = false;
	public apiNoData = true;
	public errorResult = false;
	public alert: any = { };
	private destroy$ = new Subject();
	@Input() public selectedAssetData: any;
	public assetModalFilter: RccAssetSelectReq;
	@ViewChild('assetRowWellTemplate', { static: true })
	private assetRowWellTemplate: TemplateRef<{ }>;
	@ViewChild('assetSliderIconTemplate', { static: true })
	private assetSliderIconTemplate: TemplateRef<{ }>;
	@ViewChild('assetSeverityIconTemplate', { static: true })
	private assetSeverityIconTemplate: TemplateRef<{ }>;
	@ViewChild('violationAgeTemplate', { static: true })
	private violationAgeTemplate: TemplateRef<{ }>;
	/* Will be used in next release*/
	public severityMappings = { } = [
		{ id: 'P1', name: I18n.get('_RccSeverityValueP1_') },
		{ id: 'P2', name: I18n.get('_RccSeverityValueP2_') },
		{ id: 'P3', name: I18n.get('_RccSeverityValueP3_') },
		{ id: 'P4', name: I18n.get('_RccSeverityValueP4_') },
		{ id: 'P5', name: I18n.get('_RccSeverityValueP5_') },
	];
	/**
	 * on init method
	 * Initialize grid data for asset policy violations
	 */
	public ngOnInit () {
		this.buildGridTable();
	}

	/**
	 * on changes method
	 * @param changes gives the current value
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const selectedData = _.get(changes, ['selectedAssetData', 'currentValue']);
		if (selectedData) {
			this.policyGroupSelection = '';
			this.policySeveritySelection = '';
			this.assetRowParams = {
				customerId: this.customerId,
				pageIndex: 0,
				pageSize: this.tableLimit,
				policyGroupName: this.policyGroupSelection,
				serialNumber: this.selectedAssetData.serialNumber,
				severity: this.policySeveritySelection,
				sortBy: '',
				sortOrder: '',
			};
			this.rccAssetPolicyTableData = [];
			this.rccMessageTableData = [];
			this.loadData();
			this.tableOffset = 0;
			this.errorResult = false;
			_.invoke(this.alert, 'hide');
		}
	}

	/**
	 * loads the filter and asset data
	 */
	public loadData () {
		this.initialLoading = true;
		this.apiNoData = true;
		const assetFilterReq = {
			customerId : this.assetRowParams.customerId,
			serialNumber : this.assetRowParams.serialNumber,
		};
		forkJoin(
			this.rccService
			.getAssetSummaryData(this.assetRowParams),
			this.rccService
			.getRccAssetFilterData(assetFilterReq),
			)
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(([assetViolations, assetPolicyFilterInfo]) => {
				if (!_.isEmpty(assetPolicyFilterInfo.data)) {
					this.assetPolicyFilterInfo = assetPolicyFilterInfo;
					this.assetPolicyGroupItems = [];
					this.assetPolicySeverityItems = [];
					if (assetPolicyFilterInfo.data.rulehighseverity) {
						(assetPolicyFilterInfo.data.rulehighseverity).map(
						(policySeverityFilter: string, index: any) => {
							this.severityMappings.forEach(policySeverityMapData => {
								if (policySeverityMapData.id === policySeverityFilter) {
									this.assetPolicySeverityItems.push({
										id: index, name: policySeverityFilter,
										title: policySeverityMapData.name,
									});
								}
							});
						});
					}
					if (assetPolicyFilterInfo.data.policygroupname) {
						(assetPolicyFilterInfo.data.policygroupname)
							.map((policyGroup: any, index: any) => {
								this.assetPolicyGroupItems.push({ id: index, name: policyGroup });
							});
					}
				}
				this.rccAssetPolicyTableData = [];
				if (!_.isEmpty(assetViolations.data)) {
					this.rccAssetPolicyTableData = assetViolations.data.violation;
					this.rccAssetPolicyTableData.forEach(assetPolicyDesc => {
						const policyDesc =
						_.get(assetPolicyDesc, ['policyDesc'], '')
							.replace(/\&gt;/g, '>')
							.replace(/\&lt;/g, '<');
						_.set(assetPolicyDesc, ['policyDesc'], policyDesc);
					});
					this.totalItems = this.rccAssetPolicyTableData.length;
					if (this.rccAssetPolicyTableData.length > 0) {
						this.apiNoData = false;
					 }
					this.tableOffset = 0;
					this.buildGridTable();
				}
				this.initialLoading = false;
			},
				error => {
					this.initialLoading = false;
					this.errorResult = true;
					this.apiNoData = true;
					this.alert.show(I18n.get('_RccErrorResults_'), 'danger');
					this.logger.error(
						'rcc-asset-violation-details.component : loadData() ' +
					`:: Error : (${error.status}) ${error.message}`);
				});
	}
	/**
	 * method to return table information
	 * @param params is a request object
	 * @returns empty on error
	 */
	public getAssetPolicyGridData () {
		this.isLoading = true;
		_.invoke(this.alert, 'hide');
		this.totalItems = 0;
		this.rccAssetPolicyTableData = [];
		const params = _.cloneDeep(this.assetRowParams);
		this.rccService.getAssetSummaryData(params)
			.pipe(
			takeUntil(this.destroy$),
		)
			.subscribe(
				(assetViolations => {
					const assetViolationsResponse = assetViolations;
					if (assetViolationsResponse) {
						this.rccAssetPolicyTableData = assetViolations.data.violation;
						if (this.rccAssetPolicyTableData) {
							this.totalItems = _.size(this.rccAssetPolicyTableData);
						}
						this.isLoading = false;
					}
					this.tableOffset =  0;
					this.errorResult = false;
					this.buildGridTable();
				}),
				error => {
					this.isLoading = false;
					this.errorResult = true;
					this.alert.show(I18n.get('_RccErrorResults_'), 'danger');
					this.logger.error(
						'rcc-asset-violation-details.component : getAssetPolicyGridData() ' +
					`:: Error : (${error.status}) ${error.message}`);
				},
			);

	}

	/**
	 * To be called on policy group selection
	 * @param event object contains the value
	 */
	public onPolicyGroupSelection (event: any) {
		this.assetRowParams.policyGroupName = event;
		this.getAssetPolicyGridData();
	}

	/**
	 * To be called on policy severity selection
	 * @param event object contains the value
	 */
	public onPolicySeveritySelection (event: any) {
		this.assetRowParams.severity = event;
		this.getAssetPolicyGridData();
	}

	/**
	 * Function called when page changed
	 * @param pageInfo gives page number
	 */
	public onPolicyAssetPagerUpdated (pageInfo: any) {
		this.tableOffset = pageInfo.page;
	}

	/**
	 * Function called when sort changed
	 * @param event gives sort information
	 */
	public onTableSortingChanged ( ) {
		this.tableOffset = 0;
	}
	/**
	 * destroy method to kill the services
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
	/**
	 * Function called when sort changed
	 * @param event gives sort information
	 */
	public buildGridTable () {
		this.rccAssetPolicyTableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'ruleHighSeverity',
					name: I18n.get('_RccAssetSeverity_'),
					sortable: true,
					template: this.assetSliderIconTemplate,
					width: '20%',
				},
				{
					key: 'policyGroupName',
					name: I18n.get('_RccAssetRegulatoryType_'),
					sortable: true,
					width: '30%',
				},
				{
					key: 'ruleName',
					name: I18n.get('_RccAssetRuleViolated_'),
					sortable: true,
					width: '47%',
				},
				{
					key: 'violationCount',
					name: I18n.get('_RccAssetViolationCount_'),
					sortable: false,
					width: '3%',
				},
			],
			dynamicData: false,
			hover: true,
			rowWellColor: 'bordered',
			rowWellTemplate: this.assetRowWellTemplate,
			singleSelect: false,
			striped: false,
			wrapText: true,
		});

		this.rccMessageTableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'severity',
					name: I18n.get('_RccAssetSeverity_'),
					sortable: false,
					template: this.assetSeverityIconTemplate,
				},
				{
					key: 'message',
					name: I18n.get('_RccAssetMessage_'),
					sortable: false,
				},
				{
					key: 'age',
					name: I18n.get('_RccAssetViolationAge_'),
					sortable: false,
					template: this.violationAgeTemplate,
				},
				{
					key: 'suggestedFix',
					name: I18n.get('_RccAssetSuggestedFix_'),
					sortable: false,
				},
			],
			dynamicData: false,
			singleSelect: false,
			striped: false,
		});
	}
}
