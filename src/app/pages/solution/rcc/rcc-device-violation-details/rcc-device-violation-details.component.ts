import {
	Component, Input, OnInit, ViewChild, TemplateRef,
	OnDestroy, SimpleChanges,
} from '@angular/core';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	RccService, RccUtilService, RccPolicyViolationData,
} from '@sdp-api';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { UserResolve } from '@utilities';
import { ActivatedRoute } from '@angular/router';
import { LogService } from '@cisco-ngx/cui-services';
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
		totalItems: 0,
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
	@ViewChild('deviceLink', { static: true }) private deviceLinkTemplate: TemplateRef<{ }>;
	@ViewChild('violationAgeTemplate', { static: true })
	private violationAgeTemplate: TemplateRef<{ }>;
	public policyRuleData: any = { };
	public customerId: string;
	public impactedAssetsCount: any;
	public initialLoading = false;
	public apiNoData = true;
	public selectionLoading = false;
	public errorResult = false;
	public selectionObj = {
		osName : '',
		productFamily : '',
		productModel : '',
	};
	public destroy$ = new Subject();
	public queryParamMapObj: RccPolicyViolationData;
	constructor (
		private logger: LogService,
		private rccTrackService: RccService,
		private rccUtilService: RccUtilService,
		private route: ActivatedRoute,
		public userResolve: UserResolve,
	) {
		this.logger.debug('RccDeviceViolationDetailsComponent Created!');
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}
	/**
	 * Method for getting data for slide in page from APIs
	 * @param changes gives page changed data
	 */
	public ngOnChanges (changes: SimpleChanges) {
		this.policyRuleData.policy = { };
		this.policyRuleData.rule = { };
		this.policyRuleData.deviceFilterDetails = {
			osName: [],
			productFamily: [],
			productModel: [],
		};
		this.tableConfig.tableOffset = 0;
		const policyViolationInfo = _.get(changes, ['policyViolationInfo', 'currentValue']);
		const isFirstChange = _.get(changes, ['policyViolationInfo', 'firstChange']);
		if (policyViolationInfo && !isFirstChange) {
			this.queryParamMapObj = {
				customerId: this.customerId,
				policyCategory: this.policyViolationInfo.policycategory,
				policyGroup: this.policyViolationInfo.policygroupid,
				policyName: this.policyViolationInfo.policyid,
				ruleName: this.policyViolationInfo.ruleid,
				severity: this.policyViolationInfo.ruleseverity,
			};
			this.selectionObj = {
				osName : '',
				productFamily : '',
				productModel : '',
			};
			this.impactedAssetsCount = this.policyViolationInfo.impassets;
			this.loadData();
		}
	}
	/**
	 * Method for load data on intial view
	 */
	public loadData () {
		this.initialLoading = true;
		this.apiNoData = true;
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
				if (policyRuleDetails.data && _.size(policyRuleDetails.data) > 0) {
					policyRuleDetails.data.deviceFilterDetails =
					this.rccUtilService.getSelectableData(
						policyRuleDetails.data.deviceFilterDetails);
					this.policyRuleData = policyRuleDetails.data;
				}
				if (violationDetails.data && _.size(violationDetails.data) > 0) {
					violationDetails.data.impactedAssets.forEach(asset => {
						asset.violations.forEach((violation, i) => {
							violation.index = i + 1;
						});
					});
					this.impactedDeviceDetails = violationDetails.data.impactedAssets;
					this.tableConfig.totalItems = this.impactedDeviceDetails.length;
					if (this.impactedDeviceDetails.length > 0) {
						this.apiNoData = false;
					}
				}
				this.initialLoading = false;
				this.buildImpactedDeviceTableOptions();
			},
			error => {
				this.initialLoading = false;
				this.errorResult = true;
				this.apiNoData = false;
				this.logger.error(
					'RccDeviceViolationDetailsComponent : loadData() ' +
				`:: Error : (${error.status}) ${error.message}`);
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
		this.rccViolationInfoTableOptions = this.buildRccViolationInfoTableOptions();
		this.impactedDeviceTableOptions = this.buildImpactedDeviceTableOptions();
	}
	/**
	 * method for build impacted device table
	 * @returns selected filters
	 */
	public buildImpactedDeviceTableOptions () {
		return new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'hostName',
					name: I18n.get('_Device_'),
					sortable: true,
					template: this.deviceLinkTemplate,
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
			dynamicData: false,
			padding: 'regular',
			rowWellColor: 'black',
			rowWellTemplate: this.policyRowWellTemplate,
			singleSelect: false,
			striped: false,
			wrapText: true,
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
					template: this.violationAgeTemplate,
				},
				{
					key: 'severity',
					name: I18n.get('_RccSeverity_'),
					sortable: false,
				},
			],
		});
	}
	/**
	 * Function called when page changes
	 * @param selectedItem gives page number
	 */
	public onSelection () {
		this.selectionLoading = true;
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
			this.tableConfig.tableOffset = 0;
			this.impactedDeviceDetails = violationDetails.data.impactedAssets;
			this.selectionLoading = false;
			this.tableConfig.totalItems = this.impactedDeviceDetails.length;
			this.buildImpactedDeviceTableOptions();
		},
		error => {
			this.selectionLoading = false;
			this.logger.error(
				'RccDeviceViolationDetailsComponent : onSelection() ' +
			`:: Error : (${error.status}) ${error.message}`);
		});
	}
	/**
	 * Function called when page changed
	 * @param pageInfo gives page number
	 */
	public onPageIndexChange (pageInfo: any) {
		this.tableConfig.tableOffset = pageInfo.page;
	}
	/**
	 * Function called when sort changed
	 * @param event gives sort information
	 */
	public onTableSortingChanged () {
		this.tableConfig.tableOffset = 0;
	}
	/**
	 * OnDestroy lifecycle hook
	 */
	public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
