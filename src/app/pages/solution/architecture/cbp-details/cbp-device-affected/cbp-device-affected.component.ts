import {
	Component,
	Input,
	ViewChild,
	TemplateRef,
	OnChanges,
	OnInit,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { ArchitectureService , IException, IAsset } from '@sdp-api';

/**
 * CBP Device Affected Table Component
 */
@Component({
	selector: 'cbp-device-affected',
	styleUrls: ['./cbp-device-affected.component.scss'],
	templateUrl: './cbp-device-affected.component.html',
})
export class CbpDeviceAffectedComponent implements OnInit, OnChanges {

	@Input('cbpDetails') public cbpDetails: IException;
	@ViewChild('assetTmpl', { static: true }) public assetTemplate: TemplateRef<any>;
	public tableOptions: CuiTableOptions;
	public tableLimit = 5;
	public tableOffset = 0;
	public tableIndex = 0;
	public totalItems = 0;
	public tableData: IAsset[] = [];
	public tempData: IAsset[] = [];

	constructor (private logger: LogService, private architectureService: ArchitectureService) {
	}

	/**
	 * Used to Intialize Table options
	 */
	public ngOnInit () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					name: 'Asset',
					sortable: false,
					template: this.assetTemplate,
				},
				{
					key: 'productId',
					name: 'Product ID',
					sortable: false,
				},
				{
					key: 'productFamily',
					name: 'Product Family',
					sortable: false,
				},
				{
					key: 'swVersion',
					name: 'Software Version',
					sortable: false,
				},
				{
					key: 'configCollectionDate',
					name: 'Config Collection Date',
					sortable: false,
				},
				{
					key: 'ipAddress',
					name: 'Ip Address',
					sortable: false,
				},
			],
		});

	}

	/**
	 * Used to detect the changes in input object and
	 * call the getdata function for Updating the Table
	 */
	public ngOnChanges () {
		if (this.cbpDetails) {
			const deviceIdsWithExceptions = this.cbpDetails.deviceIdsWithExceptions.split(';');
			this.architectureService.getAllCBPDeviceAffected(deviceIdsWithExceptions)
				.subscribe((res: IAsset[]) => {
					this.tempData = res;
					this.tempData = this.tempData.map(item => {
						const d: Date = new Date(item.configCollectionDate);
						const strDate = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
						item.configCollectionDate = strDate;

						return item;
					});
					this.totalItems = this.tempData.length;
					this.tableOffset = 0;
					this.getData();
				});
		}
	}

	/**
	 * Used for getting pageNumber Index and call the getdata function
	 * @param pageInfo - The Object that contains pageNumber Index
	 */
	public onPagerUpdated (pageInfo: any) {
		this.tableOffset = pageInfo.page;
		this.getData();
	}
	/**
	 * used for setting the data for table
	 */
	public getData () {

		this.tableIndex = this.tableOffset * this.tableLimit;
		this.tableData = this.tempData.slice(this.tableIndex, this.tableIndex + this.tableLimit);
	}

	/**
	 * Used for Opening the Asset 360 View the data for table
	 * @param item - The Item to which Asset 360 needs to shown
	 */
	public openAsset360View (item: any) {
	}

	/**
	 * Used for exporting the table data
	 */
	public export () {
	}
}
