import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewChild, TemplateRef } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';

import { ArchitectureService,IException } from '@sdp-api';
import * as _ from 'lodash-es';

@Component({
	selector: 'app-cbp-rule-violation',
	styleUrls: ['./cbp-rule-violation.component.scss'],
	templateUrl: './cbp-rule-violation.component.html',
})
export class CbpRuleViolationComponent implements OnInit, OnChanges {
	@Input() public filters;
	public tableOptions: CuiTableOptions;
	public totalItems: any;
	public cbpRuleExceptions = [];
	public isLoading = true;
	public severityObj: any;
	public AssetsExceptionsCount: any;
	public params = { page: 0, pageSize: 10 };
	public severityType: any = [];
	public paramsType = {
		page: 0,
		pageSize: 10,
		severity: '',
	};
	public exceptionObject:IException = null;
	@ViewChild('riskTemplate', { static: true })
	private riskTemplate: TemplateRef<{ }>;

	constructor (private logger: LogService, private architectureService: ArchitectureService) {
		this.logger.debug('CbpRuleViolationComponent Created!');
	}

	public ngOnInit() {
		this.getData();
		this.getAllCBPRulesDetails();
		this.buildTable();
	}

	public ngOnChanges(changes: SimpleChanges) {
		const selectedFilter = _.get(changes, ['filters', 'currentValue']);
		if (selectedFilter && !changes.filters.firstChange) {
			this.paramsType.severity = selectedFilter.Exceptions ? selectedFilter.Exceptions.toString() : '';
			this.getData();
		}
	}

	public buildTable() {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{ name: 'Rule Title', sortable: false, key: 'bpRuleTitle' },
				{ name: 'Risk', sortable: false, template: this.riskTemplate },
				{ name: 'Software Type', sortable: false, key: 'swType' },
				{ name: 'Exception', sortable: false, key: 'exceptions' },
				{ name: 'Recommendation', sortable: false, key: 'Recommendation' },
				{ name: 'Corrective Action', sortable: false, key: 'correctiveActionSummary' },
				{ name: 'Assets Affected', sortable: false, key: 'assetsAffected' },
			],
			singleSelect: true,
		});
	}

	public ModifyCbpRuleExceptions(array: Array<any>) {
		array.map(obj => {
			obj.Recommendation = obj.bpRecommendation.substr(0, 30)
				.concat('...');
			obj.correctiveActionSummary = obj.correctiveAction.substr(0, 25)
				.concat('...');
			obj.assetsAffected = obj.deviceIdsWithExceptions.length !=0
			? obj.deviceIdsWithExceptions.split(';').length : '0';
		});
		// }
	}

	public onPagerUpdated(event) {
		this.isLoading = true;
		this.params.page = event.page;
		this.params.pageSize = event.limit;
		this.getAllCBPRulesDetails();
	}

	public getAllCBPRulesDetails() {
		this.architectureService.getAllCBPRulesDetails(this.params).subscribe(res => {
			this.isLoading = false;
			this.totalItems = res.TotalCounts;
			this.cbpRuleExceptions = res.BPRulesDetails;
			this.ModifyCbpRuleExceptions(this.cbpRuleExceptions);
		});
	}

	public getData() {
		this.architectureService.
			getCBPSeverityList(this.paramsType)
			.subscribe(data => {
				this.isLoading = false;
				this.cbpRuleExceptions = data.BPRulesDetails;
				this.ModifyCbpRuleExceptions(this.cbpRuleExceptions);
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
		this.exceptionObject = null ;
	}
}
