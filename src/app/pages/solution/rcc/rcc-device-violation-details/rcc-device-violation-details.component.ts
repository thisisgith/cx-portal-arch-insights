import { Component, Input, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import {
	RccService, RccUtilService,
} from '@sdp-api';
import { forkJoin, Subject, of } from 'rxjs';
import { map, takeUntil, catchError } from 'rxjs/operators';

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
	}
	public paginationConfig = {
		pageLimit: 10,
		pageNum: 1,
		pagerLimit: 10,
		pageIndex: 0,
	}
	public impactedDeviceDetails = [];
	public tableColumnHeaders = [];
	public violationsDetailsTableColumnHeaders = [];
	@Input() public selectedViolationData: any;
	@Input("policyViolationInfo") public policyViolationInfo: any;
	@ViewChild('policyRowWellTemplate', { static: true })
	private policyRowWellTemplate: TemplateRef<{}>;
	public policyRuleData: any = {};
	public customerId = "90019449";
	public impactedAssetsCount: any;
	public selectionObj: object = {};
	public destroy$ = new Subject();
	public queryParamMapObj: object = {};
	constructor(
		private rccTrackService: RccService,
		private rccUtilService: RccUtilService
	) {

	}
	public ngOnChanges() {
		this.queryParamMapObj = {
			customerId: this.customerId,
			policyName: this.policyViolationInfo.policyid,
			severity: this.policyViolationInfo.ruleseverity,
			policyGroup: this.policyViolationInfo.policygroupid,
			policyCategory: this.policyViolationInfo.policycategory,
			ruleName: this.policyViolationInfo.ruleid
		}
		if (this.policyViolationInfo == null || Object.keys(this.policyViolationInfo).length == 0) return;
		this.selectionObj = {};
		this.impactedAssetsCount = this.policyViolationInfo.impassets;
		forkJoin(
			this.rccTrackService
				.getRccPolicyRuleDetailsData(this.queryParamMapObj),
			this.rccTrackService
				.getRccViolationDetailsData({ violationCount: this.policyViolationInfo.violationcount, ...this.queryParamMapObj })
		).pipe(
			takeUntil(this.destroy$),
		).subscribe(([policyRuleDetails, violationDetails]) => {
			policyRuleDetails.data.deviceFilterDetails =
				this.rccUtilService.getSelectableData(policyRuleDetails.data.deviceFilterDetails);
			this.policyRuleData = policyRuleDetails.data;
			violationDetails.data.impactedAssets.forEach(asset => {
				asset.violations.forEach((violation, i) => {
					violation['index'] = i + 1;
				});
			});
			this.impactedDeviceDetails = violationDetails.data.impactedAssets;
		}, (error: any) => {

		},
			() => {

			});

	}
	/**
	 * OnInit lifecycle hook
	 */
	public ngOnInit() {
		this.policyRuleData.policy = {};
		this.policyRuleData.rule = {};
		this.policyRuleData.deviceFilterDetails = {
			productFamily: [],
			productModel: [],
			osName: []
		};
		this.rccViolationInfoTableOptions = this.buildRccViolationInfoTableOptions();
		this.impactedDeviceTableOptions = this.buildImpactedDeviceTableOptions();
	}

	public buildImpactedDeviceTableOptions() {
		return new CuiTableOptions({
			bordered: true,
			dynamicData: false,
			singleSelect: false,
			rowWellColor: 'black',
			rowWellTemplate: this.policyRowWellTemplate,
			columns: [
				{
					name: 'Device',
					sortable: true,
					key: 'hostName',
				},
				{
					name: 'IP Address',
					sortable: true,
					key: 'ipAddress',
				},
				{
					name: 'Product Family',
					sortable: true,
					key: 'productFamily',
				},
				{
					name: 'Product Model',
					sortable: true,
					key: 'productModel',
				},
				{
					name: 'OS Name',
					sortable: true,
					key: 'osName',
				},
				{
					name: 'OS Version',
					sortable: true,
					key: 'osVersion',
				},
				{
					name: 'Violation Count',
					sortable: true,
					key: 'violationCount',
				}
			],
		});
	}
	public buildRccViolationInfoTableOptions() {
		return new CuiTableOptions({
			bordered: true,
			columns: [
				{
					key: 'index',
					name: I18n.get('_No_'),
					sortable: false,
				},
				{
					key: 'message',
					name: I18n.get('_Message_'),
					sortable: false,
				},
				{
					key: 'suggestedFix',
					name: I18n.get('_Suggested Fix_'),
					sortable: false,
				},
				{
					key: 'age',
					name: I18n.get('_Violation Age_'),
					sortable: false,
				},
				{
					key: 'severity',
					name: I18n.get('_Severity_'),
					sortable: false
				},
			],
			dynamicData: false,
			singleSelect: false,
			striped: false,
		});
	}
	/**
	 * Function called when page changed
	 * @param pageInfo gives page number
	 */
	public onSelection(selectedItem) {
		let newQueryParamMapObj = { violationCount: this.policyViolationInfo.violationcount, ...this.queryParamMapObj };
		for (let item in this.selectionObj) {
			if (this.selectionObj[item] !== null && this.selectionObj[item] !== "") {
				newQueryParamMapObj[item] = this.selectionObj[item];
			}
		}
		forkJoin(
			this.rccTrackService
				.getRccViolationDetailsData(newQueryParamMapObj)
		).pipe(
			takeUntil(this.destroy$),
		).subscribe(([violationDetails]) => {
			this.impactedDeviceDetails = violationDetails.data.impactedAssets;
		}, (error: any) => {
			
		},
			() => {

			});
	}

	/**
	 * Function called when page changed
	 * @param pageInfo gives page number
	 */
	public onPageIndexChange(pageInfo: any) {
		this.tableConfig.tableOffset = pageInfo.page;
		this.paginationConfig.pageIndex = pageInfo.page + 1;
	}

	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy() {
		this.destroy$.next();
		this.destroy$.complete();
	}
}

