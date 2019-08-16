import { Component, OnInit } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { ArchitectureService, IAsset } from '@sdp-api';

 /** Our current customerId */
const customerId = '231215372';

/**
 * Devices With Exceptions Component
 */

@Component({
	selector: 'app-dnac-list',
	styleUrls: ['./dnac-list.component.scss'],
	templateUrl: './dnac-list.component.html',
})

export class DnacListComponent implements OnInit {

	constructor (
		private logger: LogService,
		private architectureService: ArchitectureService,
	) {
		this.logger.debug('DevicesListComponent Created!');
	}

	public assetObject: IAsset = null;
	public AssetsExceptionDetails = [];
	public tableOptions: CuiTableOptions;
	public totalItems = 0;
	public isLoading = true;
	public tableStartIndex = 0;
	public tableEndIndex = 0;

	public params = { customerId, page: 0, pageSize: 10 };

	/**
 	 * Used for getting pageNumber Index and call the getdata function
 	 * @param event - The Object that contains pageNumber Index
 	 */
	public onPagerUpdated (event) {
		this.isLoading = true;
		this.params.page = event.page;
		this.params.pageSize = event.limit;
		this.getAllAssetsWithExceptions();
	}

	/**
	 * used for setting the data for table
	 */
	public getAllAssetsWithExceptions() {
		this.tableStartIndex = this.params.page * this.params.pageSize;
		let x = (this.tableStartIndex + this.AssetsExceptionDetails.length);
		this.tableEndIndex = (x) > this.totalItems ? this.totalItems : x;

		this.architectureService.getAllAssetsWithExceptions(this.params).subscribe(res => {
			this.isLoading = false;
			this.totalItems = res.TotalCounts;
			this.AssetsExceptionDetails = res.AssetsExceptionDetails;
			this.tableEndIndex = (this.tableStartIndex + this.AssetsExceptionDetails.length);
			this.AssetsExceptionDetails.map(asset => {
				asset.ruleIdsWithExceptionsCount = asset.ruleIdsWithExceptions.split(';').length;
			},
				err => {
					this.logger.error('Devices With Exceptions View' +
						'  : getAllAssetsWithExceptions() ' +
						`:: Error : (${err.status}) ${err.message}`);
					this.isLoading = false;
					this.AssetsExceptionDetails = [];
					this.totalItems = 0;
				});
		});
	}

	/**
	 * used to Intialize Table options
	 */
	ngOnInit() {

		this.getAllAssetsWithExceptions();
		this.buildTable();
	}

	/**
	 * This method is used to set the exception object in order to open Fly-out View
	 * @param event - It contains the selected asset object
	 */
	public onTableRowClicked(event: IAsset) {
		this.assetObject = event;
	}

	/**
	 * This method is used to set the null to exception object 
	 * in order to Close Fly-out View
	 */
	public onPanelClose () {
		this.assetObject = null;
	}

	public buildTable () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					name: I18n.get('_ArchitectureDNAC_'),
					sortable: false,
					key: 'inventoryName',
				},
				{
					name: I18n.get('_ArchitectureDevices_'),
					sortable: false,
					key: 'ipAddress',
				},
				{
					name: I18n.get('_ArchitectureEndPoints_'),
					sortable: false,
					key: 'productId',
				},
				{
					name: I18n.get('_ArchitectureFabrics_'),
					sortable: false,
					key: 'productFamily',
				},
				{
					name: I18n.get('_ArchitectureCPUUsage_'),
					sortable: false,
					key: 'swType',
				},
				{
					name: I18n.get('_ArchitectureFileSystemUsage_'),
					sortable: false,
					key: 'swVersion',
				},
				{
					name: I18n.get('_ArchitectureMemoryUsage_'),
					sortable: false,
					key: 'configCollectionDate',
				},
			],
			singleSelect: true,
		});
	}
}
