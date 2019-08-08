import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';

import { ArchitectureService } from '@sdp-api';
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
	public severityObj: any;
	public AssetsExceptionsCount: any;
	public params = { page: 0, pageSize: 10 };
	public severityType: any = [];
	public paramsType = {
		page: 0,
		pageSize: 10,
		severity: '',
	};

	constructor(private logger: LogService, private architectureService: ArchitectureService) {
		this.logger.debug('CbpRuleViolationComponent Created!');
	}

	public ngOnInit() {
		this.getData();
		this.getAllCBPRulesDetails();
		this.buildTable();
	}

	public ngOnChanges(changes: SimpleChanges) {
		const selectedFilter = _.get(changes, ['filters', 'currentValue']);
		if(selectedFilter && !changes.filters.firstChange) {
			this.paramsType.severity = selectedFilter.Exceptions ? selectedFilter.Exceptions.toString() : '';
			this.getData();
		}
	}

	public buildTable() {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{ name: 'Rule Title', sortable: false, key: 'bpRuleTitle' },
				{ name: 'Risk', sortable: false, key: 'bpSeverity' },
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
			obj.deviceIdsWithExceptions = obj.deviceIdsWithExceptions.split(';');
			obj.assetsAffected = obj.deviceIdsWithExceptions.length;
		});
		// }
	}

	public onPagerUpdated(event) {
		this.params.page = event.page;
		this.params.pageSize = event.limit;
		this.getAllCBPRulesDetails();
	}

	public getAllCBPRulesDetails() {
		this.architectureService.getAllCBPRulesDetails(this.params).subscribe(res => {
			this.totalItems = res.TotalCounts;
			this.cbpRuleExceptions = res.BPRulesDetails;
			this.ModifyCbpRuleExceptions(this.cbpRuleExceptions);
		});
	}

	public onTableRowClicked(event: any) { }

	public getData() {
		this.architectureService.
			getCBPSeverityList(this.paramsType)
			.subscribe(data => {
				this.cbpRuleExceptions = data.BPRulesDetails;
				this.ModifyCbpRuleExceptions(this.cbpRuleExceptions);
			});
	}

}
