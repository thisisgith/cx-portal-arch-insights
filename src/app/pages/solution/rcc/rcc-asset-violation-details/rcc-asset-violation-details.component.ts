import { Component, Input, OnInit, ViewChild, TemplateRef, SimpleChanges } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { Subscription, Subject, forkJoin, of } from 'rxjs';
import { RccAssetSelectReq, RccAssetDetailsService } from '@sdp-api';
import { takeUntil, map, catchError } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { I18n } from '@cisco-ngx/cui-utils';

@Component({
	selector: 'app-rcc-asset-violation-details',
	styleUrls: ['./rcc-asset-violation-details.component.scss'],
	templateUrl: './rcc-asset-violation-details.component.html',
})
export class RccAssetViolationDetailsComponent implements OnInit {
	constructor (
		private logger: LogService,
		private RccAssetDetailsService: RccAssetDetailsService,
	) {
		this.logger.debug('RccAssetViolationDetailsComponent Created!');
	}
	public rccAssetPolicyTableOptions: CuiTableOptions;
	public rccMessageTableOptions: CuiTableOptions;
	public assetRowParams: any;
	public assetPolicyDropdownSubscripion: Subscription;
	public assetPolicyTableSubscription: Subscription;
	public tableLimit = 10;
	public tableOffset = 0;
	public totalItems = 0;
	public pageIndex = 0;
	public assetPolicyFilterInfo = { };
	public rccAssetPolicyTableData = [];
	public rccMessageTableData = [];
	public assetPolicyGroupItems = [];
	public assetPolicyNameItems = [];
	public assetPolicySeverityItems = [];
	public policyGroupSelection: string;
	public policyNameSelection: string;
	public policySeveritySelection: string;
	// @Input() public customerId: string;
	public customerId = '90019449';
	private destroy$ = new Subject();
	@Input() public selectedAssetData: any;
	public assetModalFilter: RccAssetSelectReq;
	@ViewChild('assetRowWellTemplate', { static: true })
	private assetRowWellTemplate: TemplateRef<{ }>;
	@ViewChild('assetSliderIconTemplate', { static: true })
	private assetSliderIconTemplate: TemplateRef<{ }>;
	@ViewChild('assetSeverityIconTemplate', { static: true })
	private assetSeverityIconTemplate: TemplateRef<{ }>;
	public severityMappings = { } = [
		{ id: 'P1', name: 'P1 - Emergency' },
		{ id: 'P2', name: 'P2 - Critical' },
		{ id: 'P3', name: 'P3 - Major' },
		{ id: 'P4', name: 'P4 - Minor' },
		{ id: 'P5', name: 'P5 - Informational' },
	];
	/* on init method
		will load on component loaded
	*/
	// tslint:disable-next-line: no-empty
	public ngOnInit () {

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
					sortable: false,
					width: '30%',
				},
				{
					key: 'ruleHighSeverity',
					name: I18n.get('_RccAssetSeverity_'),
					sortable: true,
					template: this.assetSliderIconTemplate,
					width: '15%',
				},
				{
					key: 'violationCount',
					name: I18n.get('_RccAssetViolationCount_'),
					sortable: false,
					width: '5%',
				},
			],
			dynamicData: false,
			padding: 'regular',
			rowWellColor: 'black',
			rowWellTemplate: this.assetRowWellTemplate,
			singleSelect: true,
			striped: false,
			wrapText: false,
		});

		this.rccMessageTableOptions = new CuiTableOptions({
			bordered: true,
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
	/* on changes of row item method */
	// tslint:disable-next-line: completed-docs
	public ngOnChanges (changes: SimpleChanges) {
		if (changes.selectedAssetData.currentValue && !(changes.selectedAssetData.firstChange)) {
			this.assetRowParams = {
				customerId: this.customerId,
				pageIndex: this.tableOffset,
				pageSize: this.tableLimit,
				policyGroupName: this.policyGroupSelection,
				policyName: this.policyNameSelection,
				serialNumber: this.selectedAssetData.serialNumber,
				severity: this.policySeveritySelection,
				sortBy: '',
			};
			this.loadData();
	 }
	}
	/* loads the filter and asset data
	   returns the filter and asset grid data
	*/
	// tslint:disable-next-line: completed-docs
	public loadData () {
		forkJoin(
			this.RccAssetDetailsService
			.getAssetSummaryData(this.assetRowParams),
			this.RccAssetDetailsService
			.getRccAssetFilterData(this.assetRowParams),
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
			});
	}
	/* method to return table information
	@params assetparams
	returns the grid data
	*/
	// tslint:disable-next-line: completed-docs
	public getAssetPolicyGridData (params: any) {
		// this.RccAssetDetailsService
		// 	.getAssetSummaryData(this.assetRowParams)
		// 	.pipe(
		// 		map((assetViolations: any) => {
		// 			this.rccAssetPolicyTableData = [];
		// 			this.rccAssetPolicyTableData = assetViolations.data.violation;
		// 			this.totalItems = this.rccAssetPolicyTableData.length;
		// 		}),
		// 		catchError(err => {
		// 			return of({ });
		// 		}),
		// 	);
		// this.RccAssetDetailsService
		// 	.getAssetSummaryData(this.assetRowParams)
		// 	.subscribe(assetViolations => {
		// 		this.rccAssetPolicyTableData = [];
		// 		this.rccAssetPolicyTableData = assetViolations.data.violation;
		// 		this.totalItems = this.rccAssetPolicyTableData.length;
		// 		takeUntil(this.destroy$);
		// 	}, err => {
		// 		return;
		// 	});
		forkJoin(
			this.RccAssetDetailsService
				.getAssetSummaryData(this.assetRowParams),
		)
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe(([assetViolations]) => {
			this.rccAssetPolicyTableData = [];
			this.rccAssetPolicyTableData = assetViolations.data.violation;
			if (this.rccAssetPolicyTableData) {
				this.totalItems = this.rccAssetPolicyTableData.length;
			}
		// tslint:disable-next-line: ter-arrow-body-style
		}, (error: any) => {
			return;
		});

	}
	/* To be called on policy group selection
		@params event object contains the value
		returns selected table asset grid data
	*/
	public onPolicyGroupSelection (event: any) {
		this.assetRowParams = {
			customerId: this.customerId,
			pageIndex: this.pageIndex,
			pageSize: this.tableLimit,
			policyGroupName: event,
			policyName: this.policyNameSelection,
			serialNumber: this.selectedAssetData.serialNumber,
			severity: this.policySeveritySelection,
			sortBy: '',
		};
		this.getAssetPolicyGridData(this.assetRowParams);
	}
	/*  Function called on selection of policy name from dropdown
		@params event object contains the value
		returns selected table asset grid data
	*/
	public onPolicyNameSelection (event: any) {
		this.assetRowParams = {
			customerId: this.customerId,
			pageIndex: this.pageIndex,
			pageSize: this.tableLimit,
			policyGroupName: this.policyGroupSelection,
			policyName: event,
			serialNumber: this.selectedAssetData.serialNumber,
			severity: this.policySeveritySelection,
			sortBy: '',
		};
		this.getAssetPolicyGridData(this.assetRowParams);
	}
	/*  Function called on selection of policy name from dropdown
		@params event object contains the value
		returns selected table asset grid data
	*/
	// tslint:disable-next-line: typedef-whitespace
	public onPolicySeveritySelection (event : any) {
		this.assetRowParams = {
			customerId: this.customerId,
			pageIndex: this.pageIndex,
			pageSize: this.tableLimit,
			policyGroupName: this.policyGroupSelection,
			policyName: this.policyNameSelection,
			serialNumber: this.selectedAssetData.serialNumber,
			severity: event,
			sortBy: '',
		};
		this.getAssetPolicyGridData(this.assetRowParams);
	}
	/**
	 * Function called when page changed
	 * @param pageInfo gives page number
	 */
	public onPolicyAssetPagerUpdated (pageInfo: any) {
		this.tableOffset = pageInfo.page;
		this.pageIndex = pageInfo.page + 1;
	}
	/**
	 * Method to be called on sorting
	 * @params event
	 * returns table data
	 */
	public onTableSortingChanged (event :any) {
		/* To Be Uncommented after sort implementation 
		key: "policyGroupName",sortDirection: "asc"/"desc"
		this.assetRowParams = {
			customerId: this.customerId,
			pageIndex: this.pageIndex,
			pageSize: this.tableLimit,
			policyGroupName: this.policyGroupSelection,
			policyName: this.policyNameSelection,
			serialNumber: this.selectedAssetData.serialNumber,
			severity: this.policySeveritySelection,
			sortBy: '',
		};
		*/
	}
	/**
	 * destroy method to kill the services
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
