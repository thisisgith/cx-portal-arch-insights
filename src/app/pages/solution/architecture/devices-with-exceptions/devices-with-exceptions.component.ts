import { Component, OnInit,Output,EventEmitter } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { ArchitectureService } from '@sdp-api';

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

	public AssetsExceptionDetails = [];
	public tableOptions: CuiTableOptions;
	public tableLimit = 4;
	public tableOffset = 0;
	public totalItems = 10;

	ngOnInit(){

		this.architectureService.getAllAssetsWithExceptions().subscribe(res =>{
			console.log(res);
			this.AssetsExceptionDetails = res.AssetsExceptionDetails;
			this.AssetsExceptionDetails.map((asset)=>{
				asset.ruleIdsWithExceptionsCount = asset.ruleIdsWithExceptions.split(';').length;
				// asset.ruleIdsWithExceptions = asset.ruleIdsWithExceptions.split(';');
			})
			console.log(this.AssetsExceptionDetails);
		});
		
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
			  {
				name: 'Asset',
				sortable: false,
				key : 'inventoryName'
			  },
			  {
				name: 'Product ID',
				sortable: false,
				key: 'productId',
			  },
			  {
				  name: 'Product Family',
				  sortable: false,
				  key: 'productFamily',
			  },
			  {
				  name: 'Software Type',
				  sortable: false,
				  key: 'swType',
			  },
			  {
				  name: 'Software Version',
				  sortable: false,
				  key: 'swVersion',
			  },
			  {
				  name: 'CBP Exceptions',
				  sortable: false,
				  key: 'ruleIdsWithExceptionsCount',
			  },
			 
			],
		  });
	}

	
}
