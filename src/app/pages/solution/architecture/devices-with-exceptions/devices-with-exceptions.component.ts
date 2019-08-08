import { Component, OnInit } from '@angular/core';

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
		private architectureService: ArchitectureService,
	) {
		this.logger.debug('DevicesWithExceptionsComponent Created!');
	}

	public AssetsExceptionDetails = [];
	public tableOptions: CuiTableOptions;
	public totalItems:any;

	public params = { page: 0, pageSize: 10 };

	public onPagerUpdated(event){
		this.params.page = event.page;
		this.params.pageSize = event.limit;
		this.getAllAssetsWithExceptions();
	}

	public getAllAssetsWithExceptions(){
		this.architectureService.getAllAssetsWithExceptions(this.params).subscribe(res => {
			this.totalItems = res.TotalCounts;
			this.AssetsExceptionDetails = res.AssetsExceptionDetails;
			this.AssetsExceptionDetails.map(asset => {
				asset.ruleIdsWithExceptionsCount = asset.ruleIdsWithExceptions.split(';').length;
			});
		});
	}

	ngOnInit(){

		this.getAllAssetsWithExceptions();
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
			  { name: 'Asset', sortable: false, key : 'inventoryName' },
			  { name: 'IP Address', sortable: false, key : 'ipAddress' },
			  { name: 'Product ID', sortable: false, key: 'productId' },
			  { name: 'Product Family', sortable: false, key: 'productFamily' },
			  { name: 'Software Type', sortable: false, key: 'swType' },
			  { name: 'Software Version', sortable: false, key: 'swVersion' },
			  { name: 'Config Collection date', sortable: false, key: 'configCollectionDate' },
			  { name: 'CBP Exceptions', sortable: false, key: 'ruleIdsWithExceptionsCount' },
			],
		  });
	}
}
