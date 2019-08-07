import { Component, OnInit } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';

import { ArchitectureService , IException } from '@sdp-api';

@Component({
	selector: 'app-cbp-rule-violation',
	styleUrls: ['./cbp-rule-violation.component.scss'],
	templateUrl: './cbp-rule-violation.component.html',
})
export class CbpRuleViolationComponent implements OnInit {
	constructor (private logger: LogService, private architectureService: ArchitectureService) {
		this.logger.debug('CbpRuleViolationComponent Created!');
	}

	public tableOptions: CuiTableOptions;
	public totalItems: any;
	public cbpRuleExceptions = [];
	public severityObj: any;
	public AssetsExceptionsCount:any;
	public params = { page: 0, pageSize : 10 };
	public severityType: any;
	public paramsType = { page : 0, pageSize: 10, severity: null };
	public exceptionObject:IException = null;

	public ModifyCbpRuleExceptions(array:Array<any>){
		array.map(obj => {
			obj.bpRecommendation = obj.bpRecommendation.substr(0, 30)
			.concat('...');
			obj.correctiveAction = obj.correctiveAction.substr(0, 25)
			.concat('...');
				// obj.deviceIdsWithExceptions = obj.deviceIdsWithExceptions.split(';');
		});
		// }
	}

	public onPagerUpdated(event){
		this.params.page = event.page;
		this.params.pageSize = event.limit;
		this.getAllCBPRulesDetails();
	}

	public getAllCBPRulesDetails(){
		this.architectureService.getAllCBPRulesDetails(this.params).subscribe(res => {
			this.totalItems = res.TotalCounts;
			this.cbpRuleExceptions = res.BPRulesDetails;
			this.ModifyCbpRuleExceptions(this.cbpRuleExceptions);
		});
	}

	getCBPRuleDetailsWithSeverity(){
		this.architectureService.getCBPSeverityResponse(this.paramsType).subscribe(res => {
			this.cbpRuleExceptions = res.body.BPRulesDetails;
			this.ModifyCbpRuleExceptions(this.cbpRuleExceptions);
		});
	}

	public ngOnInit () {

		this.architectureService.getAssetsExceptionCountSubjectObj().subscribe(res => {
			this.paramsType.severity = res.severityType.split('R')[0];
			this.getCBPRuleDetailsWithSeverity();
		});

		this.getAllCBPRulesDetails();
		// this.architectureService.getAssetsExceptionCountSubjectObj().subscribe(res =>{
		// 	console.log(res);
		// 	if(res.severityObj){
		// 		this.severityObj = res.severityObj.severity;
		// 	}
		// 	if(this.severityObj == "MediumRisk"){
		// 		this.architectureService.getMediumSeverityExceptions().subscribe(res => {
		// 			console.log(res);
		// 			this.cbpRuleExceptions = res.BPRulesDetails;
		// 			this.ModifyCbpRuleExceptions(this.cbpRuleExceptions);
		// 		});
		// 	}else{
		// 		this.architectureService.getHighSeverityExceptions().subscribe(res => {
		// 			console.log(res);
		// 			this.cbpRuleExceptions = res.BPRulesDetails;
		// 			this.ModifyCbpRuleExceptions(this.cbpRuleExceptions);
		// 			console.log(this.cbpRuleExceptions);
		// 		});
		// 	}
		// });
		this.tableOptions = new CuiTableOptions({
		  bordered: false,
		  columns: [
			{ name: 'Risk', sortable: false, key : 'bpSeverity' },
			{ name: 'Technology', sortable: false, key: 'bpPrimaryTechnologies' },
			{ name: 'Exception', sortable: false, key: 'exceptions' },
			{ name: 'Recommendation', sortable: false, key: 'bpRecommendation' },
			{ name: 'Corrective Action', sortable: false, key: 'correctiveAction' },
			{ name: 'Assets Affected', sortable: false, key: 'assetsAffected' },
			{ name: 'Software Type', sortable: false, key: 'softwareType' },
			{ name: 'Rule ID', sortable: false, key: 'bpRuleId'},
		  ],
		  singleSelect : true,
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
