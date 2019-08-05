import { Component, OnInit } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { HttpClient } from '@angular/common/http';
import { ArchitectureService } from '@sdp-api';

@Component({
	selector: 'app-cbp-rule-violation',
	styleUrls: ['./cbp-rule-violation.component.scss'],
	templateUrl: './cbp-rule-violation.component.html',
})
export class CbpRuleViolationComponent implements OnInit {
	
	constructor (
		private logger: LogService, private httpClient: HttpClient,private architectureService : ArchitectureService
	) {
		this.logger.debug('CbpRuleViolationComponent Created!');
	}

	tableOptions: CuiTableOptions;
	
	totalItems :any;

	public cbpRuleExceptions = [];
	public severityObj : any;

	AssetsExceptionsCount:any;

	public ModifyCbpRuleExceptions(array:Array<any>){
		// if(array.length != 0){
			array.map(obj => {
				// obj.assetsAffected = obj.deviceIdsWithExceptions.split(';').length;
				obj.bpRecommendation = obj.bpRecommendation.substr(0,30).concat("...");
				obj.correctiveAction = obj.correctiveAction.substr(0,25)+"...";
				// obj.deviceIdsWithExceptions = obj.deviceIdsWithExceptions.split(';');
			})
		// }
	}

	public params = {
		page: 0,
		pageSize :10,
	}

	public paramsType = {
		page : 0,
		pageSize: 10,
		severity:""
	}

	severityType :any;

	onPagerUpdated(event){
		this.params.page = event.page;
		this.params.pageSize = event.limit;
		this.getAllCBPRulesDetails();
	}

	getAllCBPRulesDetails(){
		this.architectureService.getAllCBPRulesDetails(this.params).subscribe(res =>{
			this.totalItems = res.TotalCounts;
			this.cbpRuleExceptions = res.BPRulesDetails;
			console.log(this.cbpRuleExceptions);
			this.ModifyCbpRuleExceptions(this.cbpRuleExceptions);
			console.log(this.cbpRuleExceptions);
		});
	}

	getCBPRuleDetailsWithSeverity(){
		this.architectureService.getCBPSeverityResponse(this.paramsType).subscribe(res => {
			console.log(res);
			this.cbpRuleExceptions = res.body.BPRulesDetails;
			this.ModifyCbpRuleExceptions(this.cbpRuleExceptions);
			console.log(this.cbpRuleExceptions);
		})
	}

	ngOnInit () {


		this.architectureService.getAssetsExceptionCountSubjectObj().subscribe(res => {
			console.log(res.severityType.split('R'));
			this.paramsType.severity = res.severityType.split('R')[0];
			this.getCBPRuleDetailsWithSeverity();
		})

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
			{
			  name: 'Risk',
			  sortable: false,
			  key : 'bpSeverity'
			},
			{
			  name: 'Technology',
			  sortable: false,
			  key: 'bpPrimaryTechnologies',
			},
			{
				name: 'Exception',
				sortable: false,
				key: 'exceptions',
			},
			{
				name: 'Recommendation',
				sortable: false,
				key: 'bpRecommendation',
			},
			{
				name: 'Corrective Action',
				sortable: false,
				key: 'correctiveAction',
			},
			{
				name: 'Assets Affected',
				sortable: false,
				key: 'assetsAffected',
			},
			{
				name: 'Software Type',
				sortable: false,
				key: 'softwareType',
			},
			{
				name: 'Rule ID',
				sortable: false,
				key: 'bpRuleId',
			},
		  ],
		  singleSelect : true,
		});		
		
	} 

	onTableRowClicked(event:any){
		console.log(event);
	}
	
}
