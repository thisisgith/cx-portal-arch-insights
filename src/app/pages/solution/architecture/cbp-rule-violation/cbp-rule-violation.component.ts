import {
	Component, OnInit, Input, SimpleChanges,
	OnChanges, ViewChild, TemplateRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { ArchitectureService, IException, cbpRuleException } from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
//  /** Our current customerId */
// const customerId = '9482521';
/**
 * CBP Rule Component
 */
@Component({
	selector: 'app-cbp-rule-violation',
	styleUrls: ['./cbp-rule-violation.component.scss'],
	templateUrl: './cbp-rule-violation.component.html',
})
export class CbpRuleViolationComponent implements OnInit, OnChanges {
	@Input() public filters;
	public customerId: string;
	public tableOptions: CuiTableOptions;
	public totalItems = 0;
	public cbpRuleExceptions: cbpRuleException[] = [];
	public isLoading = true;
	public fullscreen: any;
	public tableStartIndex = 0;
	public tableEndIndex = 0;
	public lastCollectionTime = '';
	public exceptionObject: IException = null;
	@ViewChild('riskTemplate', { static: true })
	private riskTemplate: TemplateRef<{ }>;

	public globalSearchText = '';

	constructor (
		private logger: LogService,
		private architectureService: ArchitectureService,
		private route: ActivatedRoute,
	) {
		this.logger.debug('CbpRuleViolationComponent Created!');
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.paramsType.customerId = this.customerId;
	}

	public paramsType = {
		customerId: '',
		page: 0,
		pageSize: 10,
		searchText: '',
		severity: '',
	};

	/**
	 * Used to call the getCBPRulesData and buildTable function for Updating the Table
	 */
	public ngOnInit () {
		this.getCBPRulesData();
		this.buildTable();
	}

	/**
	 * Used to detect the changes in input object and
	 * call the getCBPRulesData function for Updating the Table
	 * @param changes SimpleChanges
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const selectedFilter = _.get(changes, ['filters', 'currentValue']);
		const isFirstChange = _.get(changes, ['filters', 'firstChange']);
		if (selectedFilter && !isFirstChange) {
			this.paramsType.severity =
				selectedFilter.exceptions ? selectedFilter.exceptions.toString() : '';
			this.isLoading = true;
			this.tableStartIndex = 0;
			this.paramsType.page = 0;
			this.getCBPRulesData();
		}
	}

	/**
	 * used to Intialize Table options
	 */
	public buildTable () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'bpRuleTitle',
					name: I18n.get('_ArchitectureRuleName_'),
					sortable: false,
				},
				{
					name: I18n.get('_ArchitectureSeverity_'),
					sortable: false,
					template: this.riskTemplate,
				},
				// { name: 'Software Type', sortable: false, key: 'swType' },
				{
					key: 'exceptions',
					name: I18n.get('_ArchitectureException_'),
					sortable: false,
				},
				{
					key: 'recommendations',
					name: I18n.get('_ArchitectureRecommendation_'),
					render: item =>
						item.recommendations.substr(0, 30)
							.concat('...'),
					sortable: false,
				},
				{
					key: 'softwareType',
					name: I18n.get('_ArchitectureSoftwareType_'),
					sortable: false,
				},
				{
					key: 'correctiveActions',
					name: I18n.get('_ArchitectureCorrectiveAction_'),
					render: item => item.correctiveActions.substr(0, 25)
						.concat('...'),
					sortable: false,
				},
				{
					key: 'deviceIpsWithExceptions',
					name: I18n.get('_ArchitectureAssetsImpacted_'),
					render: item => item.deviceIpsWithExceptions.length !== 0
						? item.deviceIpsWithExceptions.split(';').length : '0',
					sortable: false,
				},
			],
			singleSelect: true,
		});
	}

	/**
	 * Keys down function
	 * @param event contains eventdata
	 */
	public globalSearchFunction (event) {
		if (event.keyCode === 13) {
			this.isLoading = true;
			this.tableStartIndex = 0;
			this.paramsType.page = 0;
			this.paramsType.searchText = this.globalSearchText;
			this.getCBPRulesData();
		}
	}

	/**
 	* Used for getting pageNumber Index and call the getdata function
 	* @param event - The Object that contains pageNumber Index
 	*/
	public onPagerUpdated (event) {
		this.isLoading = true;
		this.paramsType.page = event.page;
		this.paramsType.pageSize = event.limit;
		this.getCBPRulesData();
	}

	/**
	 * used for setting the data for table
	 */
	public getCBPRulesData () {
		this.tableStartIndex = this.paramsType.page * this.paramsType.pageSize;
		const endIndex = (this.tableStartIndex + this.cbpRuleExceptions.length);
		this.tableEndIndex = (endIndex) > this.totalItems ? this.totalItems : endIndex;
		this.architectureService.
			getCBPSeverityList(this.paramsType)
			.subscribe(data => {
				const datePipe = new DatePipe('en-US');
				this.isLoading = false;
				this.totalItems = data.TotalCounts;
				this.cbpRuleExceptions = data.BPRulesDetails;
				this.lastCollectionTime = datePipe.transform(data.CollectionDate, 'medium');
				this.tableEndIndex = (this.tableStartIndex + this.cbpRuleExceptions.length);
			}, err => {
				this.logger.error('CBP Rule Component View' +
					'  : getCBPRulesData() ' +
					`:: Error : (${err.status}) ${err.message}`);
				this.isLoading = false;
				this.cbpRuleExceptions = [];
				this.totalItems = 0;
			});
	}

	/**
 	* This method is used to set the exception object in order to open Fly-out View
 	* @param event - It contains the selected Exception
 	*/
	public onTableRowClicked (event: IException) {
		this.exceptionObject = event;
	}

	/**
	 * This method is used to set the null to exception object
	 * in order to Close Fly-out View
	 */
	public onPanelClose () {
		this.exceptionObject = null;
	}
}
