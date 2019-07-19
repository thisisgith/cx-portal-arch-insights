import { Component, OnInit } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { ArchitectureService } from '@cui-x/sdp-api';

@Component({
	selector: 'app-devices-with-exceptions',
	styleUrls: ['./devices-with-exceptions.component.scss'],
	templateUrl: './devices-with-exceptions.component.html',
})
export class DevicesWithExceptionsComponent implements OnInit {

	constructor (
		private logger: LogService,
		private architectureService : ArchitectureService
	) {
		this.logger.debug('DevicesWithExceptionsComponent Created!');
	}

	ngOnInit(){

		// this.architectureService.getAllCBPRules().subscribe(res =>{
		// 	console.log(res);
		// 	this.tableData = res.content
		// 	// console.log(this.tableData);
		// });

		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
			  {
				name: 'Asset',
				sortable: false,
				key : 'asset'
			  },
			  {
				name: 'Product ID',
				sortable: false,
				key: 'productId',
			  },
			  {
				  name: 'Product Family',
				  sortable: false,
				  key: 'ProductFamily',
			  },
			  {
				  name: 'Software Type',
				  sortable: false,
				  key: 'SoftwareType',
			  },
			  {
				  name: 'Software Version',
				  sortable: false,
				  key: 'SoftwareVersion',
			  },
			  {
				  name: 'CBP Exceptions',
				  sortable: false,
				  key: 'CbpExceptions',
			  },
			 
			],
		  });
	}

	tableOptions: CuiTableOptions;
	tableLimit = 4;
	tableOffset = 0;
	totalItems = 10;
	
	tableData = [];
	
	// tableData = [{
	// 	asset : 'FCW2216LOUT',
	// 	productId : 'SJ-AP923U',
	// 	ProductFamily : 'Cisco catalyst 9300 switch',
	// 	SoftwareType : 'IOS-XE',
	// 	SoftwareVersion : '16.6.3',
	// 	CbpExceptions  : '12',
	// },
	// {
	// 	asset : 'FCW2216LOUT',
	// 	productId : 'SJ-AP923U',
	// 	ProductFamily : 'Cisco catalyst 9300 switch',
	// 	SoftwareType : 'IOS-XE',
	// 	SoftwareVersion : '16.6.3',
	// 	CbpExceptions  : '12',
	// },
	// {
	// 	asset : 'FCW2216LOUT',
	// 	productId : 'SJ-AP923U',
	// 	ProductFamily : 'Cisco catalyst 9300 switch',
	// 	SoftwareType : 'IOS-XE',
	// 	SoftwareVersion : '16.6.3',
	// 	CbpExceptions  : '12',
	// },
	// {
	// 	asset : 'FCW2216LOUT',
	// 	productId : 'SJ-AP923U',
	// 	ProductFamily : 'Cisco catalyst 9300 switch',
	// 	SoftwareType : 'IOS-XE',
	// 	SoftwareVersion : '16.6.3',
	// 	CbpExceptions  : '12',
	// },
	// {
	// 	asset : 'FCW2216LOUT',
	// 	productId : 'SJ-AP923U',
	// 	ProductFamily : 'Cisco catalyst 9300 switch',
	// 	SoftwareType : 'IOS-XE',
	// 	SoftwareVersion : '16.6.3',
	// 	CbpExceptions  : '12',
	// },
	// {
	// 	asset : 'FCW2216LOUT',
	// 	productId : 'SJ-AP923U',
	// 	ProductFamily : 'Cisco catalyst 9300 switch',
	// 	SoftwareType : 'IOS-XE',
	// 	SoftwareVersion : '16.6.3',
	// 	CbpExceptions  : '12',
	// },
	// {
	// 	asset : 'FCW2216LOUT',
	// 	productId : 'SJ-AP923U',
	// 	ProductFamily : 'Cisco catalyst 9300 switch',
	// 	SoftwareType : 'IOS-XE',
	// 	SoftwareVersion : '16.6.3',
	// 	CbpExceptions  : '12',
	// },
	// {
	// 	asset : 'FCW2216LOUT',
	// 	productId : 'SJ-AP923U',
	// 	ProductFamily : 'Cisco catalyst 9300 switch',
	// 	SoftwareType : 'IOS-XE',
	// 	SoftwareVersion : '16.6.3',
	// 	CbpExceptions  : '12',
	// },
	// {
	// 	asset : 'FCW2216LOUT',
	// 	productId : 'SJ-AP923U',
	// 	ProductFamily : 'Cisco catalyst 9300 switch',
	// 	SoftwareType : 'IOS-XE',
	// 	SoftwareVersion : '16.6.3',
	// 	CbpExceptions  : '12',
	// },
	// {
	// 	asset : 'FCW2216LOUT',
	// 	productId : 'SJ-AP923U',
	// 	ProductFamily : 'Cisco catalyst 9300 switch',
	// 	SoftwareType : 'IOS-XE',
	// 	SoftwareVersion : '16.6.3',
	// 	CbpExceptions  : '12',
	// },
	
	// ];
}
