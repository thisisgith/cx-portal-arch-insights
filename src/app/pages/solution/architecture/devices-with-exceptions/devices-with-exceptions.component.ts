import { Component, OnInit } from '@angular/core';
import { I18n } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { ArchitectureService, IAsset, assetExceptionList } from '@sdp-api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

/** Our current customerId */
const customerId = '7293498';

/**
 * Devices With Exceptions Component
 */
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

	public assetObject: IAsset = null;
	public assetsExceptionDetails: assetExceptionList[] = [];
	public tableOptions: CuiTableOptions;
	public totalItems = 0;
	public isLoading = true;
	public tableStartIndex = 0;
	public tableEndIndex = 0;
	private destroy$ = new Subject();
	public params = { customerId, page: 0, pageSize: 10 };

	/**
	 * used to Intialize Table options
	 */
	public ngOnInit () {
		this.getAllAssetsWithExceptions();
		this.buildTable();
	}

	public buildTable () {

		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'inventoryName',
					name: I18n.get('_ArchitectureHostName_'),
					sortable: false,
				},
				{
					key: 'ipAddress',
					name: I18n.get('_ArchitectureIPAddress_'),
					sortable: false,
				},
				{
					key: 'productId',
					name: I18n.get('_ArchitectureProductId_'),
					sortable: false,
				},
				{
					key: 'productFamily',
					name: I18n.get('_ArchitectureProductFamily_'),
					sortable: false,
				},
				{
					key: 'swType',
					name: I18n.get('_ArchitectureSoftwareType_'),
					sortable: false,
				},
				{
					key: 'swVersion',
					name: I18n.get('_ArchitectureSoftwareVersion_'),
					sortable: false,
				},
				{
					key: 'configCollectionDate',
					name: I18n.get('_ArchitectureConfigCollectionDate_'),
					sortable: false,
				},
				{
					key: 'ruleIdsWithExceptionsCount',
					name: I18n.get('_ArchitectureCBPExceptions_'),
					sortable: false,
				},
			],
			singleSelect: true,
		});
	}

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
	public getAllAssetsWithExceptions () {
		this.tableStartIndex = this.params.page * this.params.pageSize;
		const endIndex = (this.tableStartIndex + this.assetsExceptionDetails.length);
		this.tableEndIndex = (endIndex) > this.totalItems ? this.totalItems : endIndex;

		this.architectureService.getAllAssetsWithExceptions(this.params)
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe(res => {
			this.isLoading = false;
			this.totalItems = res.TotalCounts;
			this.assetsExceptionDetails = res.AssetsExceptionDetails;
			this.tableEndIndex = (this.tableStartIndex + this.assetsExceptionDetails.length);
			this.assetsExceptionDetails.map(asset => {
				asset.ruleIdsWithExceptionsCount = asset.ruleIdsWithExceptions.split(';').length;
			},
				err => {
					this.logger.error('Devices With Exceptions View' +
						'  : getAllAssetsWithExceptions() ' +
						`:: Error : (${err.status}) ${err.message}`);
					this.isLoading = false;
					this.assetsExceptionDetails = [];
					this.totalItems = 0;
				});
		});
	}

	/**
	 * This method is used to set the exception object in order to open Fly-out View
	 * @param event - It contains the selected asset object
	 */
	public onTableRowClicked (event: IAsset) {
		this.assetObject = event;
	}

	/**
	 * This method is used to set the null to exception object
	 * in order to Close Fly-out View
	 */
	public onPanelClose () {
		this.assetObject = null;
	}
}
