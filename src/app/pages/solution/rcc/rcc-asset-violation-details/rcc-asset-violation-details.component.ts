import { Component, Input, OnInit, ViewChild, TemplateRef, SimpleChanges } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { Subscription, Subject, forkJoin } from 'rxjs';
import { RccAssetSelectReq, RccService } from '@sdp-api';
import { takeUntil } from 'rxjs/operators';
import { I18n } from '@cisco-ngx/cui-utils';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';
import { ActivatedRoute } from '@angular/router';
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
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}
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
	public assetPolicyNameItems = [];
	public assetPolicySeverityItems = [];
	public policyGroupSelection = '';
	public policyNameSelection = '';
	public policySeveritySelection = '';
	public customerId: string;
	public initialLoading = false;
	public isLoading = false;
	public apiNoData = true;
	public errorResult = false;
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
		const isFirstChange = _.get(changes, ['selectedAssetData', 'firstChange']);
		if (selectedData && !isFirstChange) {
			this.policyGroupSelection = '';
			this.policyNameSelection = '';
			this.policySeveritySelection = '';
			this.assetRowParams = {
				customerId: this.customerId,
				pageIndex: 0,
				pageSize: this.tableLimit,
				policyGroupName: this.policyGroupSelection,
				policyName: this.policyNameSelection,
				serialNumber: this.selectedAssetData.serialNumber,
				severity: this.policySeveritySelection,
				sortBy: '',
				sortOrder: '',
			};
			this.loadData();
			this.tableOffset = 0;
		}
	}

	/**
	 * loads the filter and asset data
	 */
	public loadData () {
		this.initialLoading = true;
		this.apiNoData = true;
		this.errorResult = false;
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
				if (assetPolicyFilterInfo) {
					this.assetPolicyFilterInfo = assetPolicyFilterInfo;
					this.assetPolicyNameItems = [];
					this.assetPolicyGroupItems = [];
					this.assetPolicySeverityItems = [];
					(assetPolicyFilterInfo.data.policyname).map((policyFilter: any, index: any) => {
						this.assetPolicyNameItems.push({ id: index, name: policyFilter });
					});
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
					(assetPolicyFilterInfo.data.policygroupname)
					.map((policyGroup: any, index: any) => {
						this.assetPolicyGroupItems.push({ id: index, name: policyGroup });
					});
				}
				this.rccAssetPolicyTableData = [];
				this.rccAssetPolicyTableData = assetViolations.data.violation;
				this.totalItems = this.rccAssetPolicyTableData.length;
				if (this.rccAssetPolicyTableData.length > 0) {
					this.apiNoData = false;
				 }
				this.tableOffset = 0;
				this.initialLoading = false;
				this.buildGridTable();
			},
				error => {
					this.initialLoading = false;
					this.errorResult = true;
					this.apiNoData = false;
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
		this.errorResult = false;
		const params = _.cloneDeep(this.assetRowParams);
		this.rccService.getAssetSummaryData(params)
			.pipe(
			takeUntil(this.destroy$),
		)
			.subscribe(
				(assetViolations => {
					const assetViolationsResponse = assetViolations;
					if (assetViolationsResponse) {
						this.rccAssetPolicyTableData = [];
						this.rccAssetPolicyTableData = assetViolations.data.violation;
						if (this.rccAssetPolicyTableData) {
							this.totalItems = _.size(this.rccAssetPolicyTableData);
						}
						this.isLoading = false;
					}
					this.tableOffset =  0;
					this.buildGridTable();
				}),
				error => {
					this.isLoading = false;
					this.errorResult = true;
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
	 * To be called on policy name selection
	 * @param event object contains the value
	 */
	public onPolicyNameSelection (event: any) {
		this.assetRowParams.policyName = event;
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
					key: 'policyGroupName',
					name: I18n.get('_RccAssetPolicyGroup_'),
					sortable: true,
					width: '20%',
				},
				{
					key: 'policyName',
					name: I18n.get('_RccAssetPolicyName_'),
					sortable: true,
					width: '25%',
				},
				{
					key: 'ruleName',
					name: I18n.get('_RccAssetRuleName_'),
					sortable: true,
					width: '30%',
				},
				{
					key: 'ruleHighSeverity',
					name: I18n.get('_RccAssetSeverity_'),
					sortable: true,
					template: this.assetSliderIconTemplate,
					width: '10%',
				},
				{
					key: 'violationCount',
					name: I18n.get('_RccAssetViolationCount_'),
					sortable: false,
					width: '3%',
				},
			],
			dynamicData: false,
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
					key: 'conditionCount',
					name: I18n.get('_RccAssetSNum_'),
					sortable: false,
				},
				{
					key: 'message',
					name: I18n.get('_RccAssetMessage_'),
					sortable: false,
				},
				{
					key: 'suggestedFix',
					name: I18n.get('_RccAssetSuggestedFix_'),
					sortable: false,
				},
				{
					key: 'age',
					name: I18n.get('_RccAssetViolationAge_'),
					sortable: false,
					template: this.violationAgeTemplate,
				},
				{
					key: 'severity',
					name: I18n.get('_RccAssetSeverity_'),
					sortable: false,
					template: this.assetSeverityIconTemplate,
				},
			],
			dynamicData: false,
			singleSelect: false,
			striped: false,
		});
	}
}
