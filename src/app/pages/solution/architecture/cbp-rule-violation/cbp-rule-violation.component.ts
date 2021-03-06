import {
	Component, OnInit, Input, SimpleChanges,
	OnChanges, ViewChild, TemplateRef,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';
import { ArchitectureService, IException, cbpRuleException, params, ArchitectureReviewService } from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash-es';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
	public destroy$ = new Subject();
	@ViewChild('riskTemplate', { static: true })
	private riskTemplate: TemplateRef<{ }>;
	@ViewChild('recommendationTemplate', { static: true })
	private recommendationTemplate: TemplateRef<{ }>;
	@ViewChild('correctiveActionsTemplate', { static: true })
	private correctiveActionsTemplate: TemplateRef<{ }>;
	@ViewChild('exceptionsTemplate', { static: true })
	private exceptionsTemplate: TemplateRef<{ }>;

	public searchText = '';

	public paramsType: params = {
		collectionId: '',
		customerId: '',
		page: 0,
		pageSize: 10,
		searchText: '',
		severity: '',
	};

	constructor (
		private logger: LogService,
		private architectureService: ArchitectureService,
		private route: ActivatedRoute,
		private architectureReviewService: ArchitectureReviewService,
	) {
		const user = _.get(this.route, ['snapshot', 'data', 'user']);
		this.customerId = _.get(user, ['info', 'customerId']);
		this.paramsType.customerId = _.cloneDeep(this.customerId);
	}

	/**
	 * Used to call the getCBPRulesData and buildTable function for Updating the Table
	 */
	public ngOnInit () {
		this.getCollectionId();
		this.buildTable();
	}

	/**
	 * Method to fetch collectionId
	 */

	public getCollectionId () {
		this.architectureReviewService.getCollectionId()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe(res => {
			this.paramsType.collectionId = _.get(res, 'collection.collectionId');
			if (this.paramsType.collectionId) {
				const datePipe = new DatePipe('en-US');
				this.lastCollectionTime =
						 datePipe.transform(_.get(res, 'collection.collectionDate'),
											 'medium');
				this.getCBPRulesData();
			}
		},
		err => {
			this.logger.error('Devices list Component View' +
				'  : getCollectionId() ' +
				`:: Error : (${err.status}) ${err.message}`);
		});
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
			const severityType = _.get(selectedFilter,  'exceptions');
			const isClearAllSelected = _.get(selectedFilter, 'isClearAllSelected');
			if (severityType) {
				this.paramsType.severity = _.cloneDeep(severityType.toString());
			} else {
				this.paramsType.severity = '';
			}
			if (isClearAllSelected) {
				this.paramsType.searchText = '';
				this.searchText = '';
			}
			this.isLoading = true;
			this.tableStartIndex = 0;
			this.paramsType.page = 0;
			this.getCollectionId();
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
					name: I18n.get('_ArchitectureSeverity_'),
					sortable: false,
					template: this.riskTemplate,
					width: '10%',
				},
				{
					key: 'bpRuleTitle',
					name: I18n.get('_ArchitectureRuleViolated_'),
					sortable: false,
					width: '8%',
				},
				{
					name: I18n.get('_ArchitectureException_'),
					sortable: false,
					template: this.exceptionsTemplate,
				},
				{
					name: I18n.get('_ArchitectureRecommendation_'),
					sortable: false,
					template: this.recommendationTemplate,
				},
				{
					name: I18n.get('_ArchitectureCorrectiveAction_'),
					sortable: false,
					template: this.correctiveActionsTemplate,
				},
				{
					key: 'softwareType',
					name: I18n.get('_ArchitectureSoftwareType_'),
					sortable: false,
				},
				{
					key: 'deviceIpsWithExceptions',
					name: I18n.get('_ArchitectureSystemsAffected_'),
					render: item => item.deviceIpsWithExceptions.length !== 0
								? item.deviceIpsWithExceptions.length : '0',
					sortable: false,
				},
			],
			hover: true,
			singleSelect: true,
			striped: false,
			wrapText: true,
		});
	}

	/**
	 * Keys down function
	 * @param event contains eventdata
	 */
	public textFilter (event) {
		// key code 13 refers to enter key
		const eventKeycode = 13;
		if (event.keyCode === eventKeycode || this.searchText.trim().length === 0) {
			this.isLoading = true;
			this.tableStartIndex = 0;
			this.paramsType.page = 0;
			this.paramsType.searchText = this.searchText;
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
			if (!data) {
				return this.inValidResponseHandler();
			}
			this.isLoading = false;
			this.totalItems = data.TotalCounts;
			this.cbpRuleExceptions = data.BPRulesDetails;
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
	 * This Function is used to handle the invalid Response
	 */
	public inValidResponseHandler () {
		this.isLoading = false;
		this.cbpRuleExceptions = [];
		this.totalItems = 0;
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
		_.set(this.exceptionObject, 'active', false);
		this.exceptionObject = null;
	}

	/**
	 * Handles the hidden event from details-panel
	 * @param hidden false if details slideout is open
	 */
	public handleHidden (hidden: boolean) {
		if (hidden) {
			this.onPanelClose();
		}
	}
}
