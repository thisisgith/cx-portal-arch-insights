import { Component, OnInit } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { HttpClient } from '@angular/common/http';
import { ArchitectureService } from '@cui-x/sdp-api';

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
	tableLimit = 4;
	tableOffset = 0;
	totalItems = 10;
	
	// tableData = [];
	
	// tableData = [{
	// 	risk : 'High',
	// 	technology : 'Angular',
	// 	Exception : 'xception',
	// 	Recommendation : 'Recommendation',
	// 	CorrectiveAction : 'Corrective Action',
	// 	AssetsAffected  : 'Assets Affected',
	// 	SoftwareType : 'OS',
	// 	RuleID : '12345'
	// },
	// {
	// 	risk : 'High',
	// 	technology : 'Angular',
	// 	Exception : 'xception',
	// 	Recommendation : 'Recommendation',
	// 	CorrectiveAction : 'Corrective Action',
	// 	AssetsAffected  : 'Assets Affected',
	// 	SoftwareType : 'OS',
	// 	RuleID : '12346'
	// },
	// {
	// 	risk : 'High',
	// 	technology : 'Angular',
	// 	Exception : 'xception',
	// 	Recommendation : 'Recommendation',
	// 	CorrectiveAction : 'Corrective Action',
	// 	AssetsAffected  : 'Assets Affected',
	// 	SoftwareType : 'OS',
	// 	RuleID : '12347'
	// },
	// {
	// 	risk : 'High',
	// 	technology : 'Angular',
	// 	Exception : 'xception',
	// 	Recommendation : 'Recommendation',
	// 	CorrectiveAction : 'Corrective Action',
	// 	AssetsAffected  : 'Assets Affected',
	// 	SoftwareType : 'OS',
	// 	RuleID : '12345'
	// },
	// {
	// 	risk : 'High',
	// 	technology : 'Angular',
	// 	Exception : 'xception',
	// 	Recommendation : 'Recommendation',
	// 	CorrectiveAction : 'Corrective Action',
	// 	AssetsAffected  : 'Assets Affected',
	// 	SoftwareType : 'OS',
	// 	RuleID : '12345'
	// },
	// {
	// 	risk : 'Low',
	// 	technology : 'Angular',
	// 	Exception : 'xception',
	// 	Recommendation : 'Recommendation',
	// 	CorrectiveAction : 'Corrective Action',
	// 	AssetsAffected  : 'Assets Affected',
	// 	SoftwareType : 'OS',
	// 	RuleID : '12345'
	// },
	// {
	// 	risk : 'Low',
	// 	technology : 'Angular',
	// 	Exception : 'xception',
	// 	Recommendation : 'Recommendation',
	// 	CorrectiveAction : 'Corrective Action',
	// 	AssetsAffected  : 'Assets Affected',
	// 	SoftwareType : 'OS',
	// 	RuleID : '12345'
	// },
	// {
	// 	risk : 'Low',
	// 	technology : 'Angular',
	// 	Exception : 'xception',
	// 	Recommendation : 'Recommendation',
	// 	CorrectiveAction : 'Corrective Action',
	// 	AssetsAffected  : 'Assets Affected',
	// 	SoftwareType : 'OS',
	// 	RuleID : '12345'
	// },
	// {
	// 	risk : 'Low',
	// 	technology : 'Angular',
	// 	Exception : 'xception',
	// 	Recommendation : 'Recommendation',
	// 	CorrectiveAction : 'Corrective Action',
	// 	AssetsAffected  : 'Assets Affected',
	// 	SoftwareType : 'OS',
	// 	RuleID : '12346'
	// },
	// {
	// 	risk : 'Low',
	// 	technology : 'Angular',
	// 	Exception : 'xception',
	// 	Recommendation : 'Recommendation',
	// 	CorrectiveAction : 'Corrective Action',
	// 	AssetsAffected  : 'Assets Affected',
	// 	SoftwareType : 'OS',
	// 	RuleID : '09876'
	// },
	// ];

	public tableData = [];
	

	ngOnInit () {

		this.architectureService.getAllCBPRules().subscribe(res =>{
			console.log(res);
			this.tableData = res.content;
			 console.log(this.tableData);
		});

    //    this.httpClient.get('/ws/architecture/v3/successUrls/getAllCbpRules').subscribe( res => {
	// 	   console.log(res);
	// 	//    this.tableData = res;
	//    } )

		this.tableOptions = new CuiTableOptions({
		  bordered: false,
		  columns: [
			{
			  name: 'Risk',
			  sortable: false,
			  key : 'risk'
			},
			{
			  name: 'Technology',
			  sortable: false,
			  key: 'technology',
			},
			{
				name: 'Exception',
				sortable: false,
				key: 'exception',
			},
			{
				name: 'Recommendation',
				sortable: false,
				key: 'recommendation',
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
				key: 'ruleID',
			},
		  ],
		});

		
	}


	
}
