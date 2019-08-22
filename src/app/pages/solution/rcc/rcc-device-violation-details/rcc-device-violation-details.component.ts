import { Component, Input, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	RccService, RccUtilService,
} from '@sdp-api';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
/**
 * Main component for the RCC track
 */
@Component({
	selector: 'app-rcc-device-violation-details',
	styleUrls: ['./rcc-device-violation-details.component.scss'],
	templateUrl: './rcc-device-violation-details.component.html',
})
export class RccDeviceViolationDetailsComponent implements OnInit, OnDestroy {
	public impactedDeviceTableOptions: CuiTableOptions;
	public rccViolationInfoTableOptions: CuiTableOptions;
	public tableConfig = {
		tableLimit: 10,
		tableOffset: 0,
		totalItems: 5,
	};
	public paginationConfig = {
		pageIndex: 0,
		pageLimit: 10,
		pageNum: 1,
		pagerLimit: 10,
	};
	public impactedDeviceDetails = [];
	public tableColumnHeaders = [];
	public violationsDetailsTableColumnHeaders = [];
	@Input() public selectedViolationData: any;
	@Input('policyViolationInfo') public policyViolationInfo: any;
	@ViewChild('policyRowWellTemplate', { static: true })
	private policyRowWellTemplate: TemplateRef<{ }>;
	public policyRuleData: any = { };
	public customerId = '7293498';
	public impactedAssetsCount: any;
	public loading = false;
	public selectionObj = {	};
	public destroy$ = new Subject();
	public queryParamMapObj = { };
	constructor (
		private rccTrackService: RccService,
		private rccUtilService: RccUtilService,
	) {

	}
	/**
	 * Method for getting data for slide in page from APIs
	 */
	public ngOnChanges () {
		this.queryParamMapObj = {
			customerId: this.customerId,
			policyCategory: this.policyViolationInfo.policycategory,
			policyGroup: this.policyViolationInfo.policygroupid,
			policyName: this.policyViolationInfo.policyid,
			ruleName: this.policyViolationInfo.ruleid,
			severity: this.policyViolationInfo.ruleseverity,
		};
		if (this.policyViolationInfo ===
			null || Object.keys(this.policyViolationInfo).length === 0) { return; }
		this.selectionObj = { };
		this.impactedAssetsCount = this.policyViolationInfo.impassets;
		this.loadData();
	}
	/**
	 * Method for load data on intial view
	 */
	public loadData () {
		forkJoin(
			this.rccTrackService
				.getRccPolicyRuleDetailsData(this.queryParamMapObj),
			this.rccTrackService
				.getRccViolationDetailsData(
				{
					violationCount: this.policyViolationInfo.violationcount,
					...this.queryParamMapObj,
				}),
		)
			.pipe(
				takeUntil(this.destroy$),
			)
			.subscribe(([policyRuleDetails, violationDetails]) => {
				policyRuleDetails.data.deviceFilterDetails =
					this.rccUtilService.getSelectableData(policyRuleDetails.data.deviceFilterDetails);
				this.policyRuleData = policyRuleDetails.data;
				violationDetails.data.impactedAssets.forEach(asset => {
					asset.violations.forEach((violation, i) => {
						violation.index = i + 1;
					});
				});
				this.impactedDeviceDetails = violationDetails.data.impactedAssets;
			}, (_error: any) => {
				this.loading = false;
			});
	}
	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit () {
		this.policyRuleData.policy = { };
		this.policyRuleData.rule = { };
		this.policyRuleData.deviceFilterDetails = {
			osName: [],
			productFamily: [],
			productModel: [],
		};
		this.rccViolationInfoTableOptions = (this.rccViolationInfoTableOptions ?
			this.rccViolationInfoTableOptions : this.buildRccViolationInfoTableOptions());
		this.impactedDeviceTableOptions = (this.impactedDeviceTableOptions
		? this.impactedDeviceTableOptions : this.buildImpactedDeviceTableOptions());
	}
	/**
	 * method for build impacted device table
	 * @returns selected filters
	 */
	public buildImpactedDeviceTableOptions () {
		return new CuiTableOptions({
			bordered: true,
			columns: [
				{
					key: 'hostName',
					name: I18n.get('_Device_'),
					sortable: true,
				},
				{
					key: 'ipAddress',
					name: I18n.get('_IPAddress_'),
					sortable: true,
				},
				{
					key: 'productFamily',
					name: I18n.get('_ProductFamily_'),
					sortable: true,
				},
				{
					key: 'productModel',
					name: I18n.get('_ProductModel_'),
					sortable: true,
				},
				{
					key: 'osName',
					name: I18n.get('_RccOSName_'),
					sortable: true,
				},
				{
					key: 'osVersion',
					name: I18n.get('_OSVersion_'),
					sortable: true,
				},
				{
					key: 'violationCount',
					name: I18n.get('_RccViolationCount_'),
					sortable: true,
				},
			],
		});
	}
	/**
	 * method for build violation info table
	 * @returns selected filters
	 */
	public buildRccViolationInfoTableOptions () {
		return new CuiTableOptions({
			bordered: true,
			columns: [
				{
					key: 'index',
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
					name: I18n.get('_RccSeverity_'),
					sortable: false,
				},
			],
			dynamicData: false,
			rowWellColor: 'black',
			rowWellTemplate: this.policyRowWellTemplate,
			singleSelect: false,
			striped: false,
		});
	}
	/**
	 * Function called when page changed
	 * @param selectedItem gives page number
	 */
	public onSelection () {
		const newQueryParamMapObj = { violationCount:
			this.policyViolationInfo.violationcount, ...this.queryParamMapObj };
		_.each(this.selectionObj,
			(value, key) => {
				if (value !== null && value !== '') { newQueryParamMapObj[key] = value; }
			}); 
		
		this.rccTrackService
			.getRccViolationDetailsData(newQueryParamMapObj)
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe(violationDetails => {
			this.impactedDeviceDetails = violationDetails.data.impactedAssets;
		}, (_error: any) => {
			this.loading = false;
		});
	}
	/**
	 * Function called when page changed
	 * @param pageInfo gives page number
	 */
	public onPageIndexChange (pageInfo: any) {
		this.tableConfig.tableOffset = pageInfo.page;
		this.paginationConfig.pageIndex = pageInfo.page + 1;
	}
	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}