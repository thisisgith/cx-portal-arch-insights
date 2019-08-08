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
import { DatePipe } from '@angular/common';

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
	public tableIndex = 0;
	public totalItems = 0;
	public isLoading = true;
	public tableData: IAsset[] = [];
	public params: any = {
		page : 0,
		pageSize : 8,
		body : [],
	};

	constructor (private logger: LogService, private architectureService: ArchitectureService) {
	}

	/**
	 * Used to Intialize Table options
	 */
	public ngOnInit () {
		const datePipe = new DatePipe('en-US');
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
					render: item =>
						datePipe.transform(item.configCollectionDate, 'yyyy-MM-dd'),
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
			this.totalItems = deviceIdsWithExceptions.length;
			this.params.body = deviceIdsWithExceptions;
			this.params.page = 0 ;
			this.isLoading = true;
			this.getData();
		}
	}

	/**
	 * Used for getting pageNumber Index and call the getdata function
	 * @param pageInfo - The Object that contains pageNumber Index
	 */
	public onPagerUpdated (pageInfo: any) {
		this.params.page = pageInfo.page;
		this.isLoading = true;
		this.getData();
	}

	/**
	 * used for setting the data for table
	 */
	public getData () {

		this.tableIndex = this.params.page * this.params.pageSize;
		this.architectureService.getAllCBPDeviceAffected(this.params)
				.subscribe((res: IAsset[]) => {
					this.tableData = res;
					this.isLoading = false;
				},
					err => {
						this.logger.error('CBP-Device-Affected Fly-Out View' +
							'  : getData() ' +
							`:: Error : (${err.status}) ${err.message}`);
						this.isLoading = false;
						this.tableData = [];
						this.totalItems = 0;
					});
	}

	// /**
	//  * Used for Opening the Asset 360 View the data for table
	//  * @param item - The Item to which Asset 360 needs to shown
	//  */
	// public openAsset360View (item: any) {
	// }

	// /**
	//  * Used for exporting the table data
	//  */
	// public export () {
	// }
}
