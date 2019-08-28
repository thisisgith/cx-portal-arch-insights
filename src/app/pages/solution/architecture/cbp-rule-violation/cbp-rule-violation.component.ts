import { Component, OnInit, Input, SimpleChanges,
	OnChanges, ViewChild, TemplateRef } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { ArchitectureService, IException, cbpRuleException } from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';

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
	public fullscreen: any ;
	public tableStartIndex = 0;
	public tableEndIndex = 0;
	public exceptionObject: IException = null;
	@ViewChild('riskTemplate', { static: true })
	private riskTemplate: TemplateRef<{ }>;

	constructor (
		private logger: LogService,
		private architectureService: ArchitectureService,
		private route: ActivatedRoute,
	) {
		this.logger.debug('CbpRuleViolationComponent Created!');
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
	}

	public paramsType = {
		customerId: this.customerId,
		page: 0,
		pageSize: 10,
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
		if (selectedFilter && !changes.filters.firstChange) {
			this.paramsType.severity =
			selectedFilter.exceptions ? selectedFilter.exceptions.toString() : '';
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
					name: I18n.get('_ArchitectureRuleTitle_'),
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
					sortable: false,
				},
				{
					key: 'correctiveActionSummary',
					name: I18n.get('_ArchitectureCorrectiveAction_'),
					sortable: false,
				},
				{
					key: 'assetsAffected',
					name: I18n.get('_ArchitectureAssetsAffected_'),
					sortable: false,
				},
			],
			singleSelect: true,
		});
	}

	/**
 	* Used for shinking the  Recommendation, correctiveActionSummary
		* assetsAffected field
 	* @param array - The Array Objects to be modified
 	*/
	public ModifyCbpRuleExceptions (array) {
		array.map(obj => {
			obj.recommendations = obj.recommendations.substr(0, 30)
				.concat('...');
			obj.correctiveActionSummary = obj.correctiveActions.substr(0, 25)
				.concat('...');
			obj.assetsAffected = obj.deviceIpsWithExceptions.length !== 0
				? obj.deviceIpsWithExceptions.split(';').length : '0';
		});
		// }
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
				this.isLoading = false;
				this.totalItems = data.TotalCounts;
				this.cbpRuleExceptions = data.BPRulesDetails;
				this.tableEndIndex = (this.tableStartIndex + this.cbpRuleExceptions.length);
				this.ModifyCbpRuleExceptions(this.cbpRuleExceptions);
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