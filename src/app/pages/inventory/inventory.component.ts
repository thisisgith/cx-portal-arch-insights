import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 *  Define interface
 */
export interface Asset {
	_id?: number;
	hostname: string;
	productId?: string;
	ipaddress?: string;
	serialNumber?: string;
}

/**
 * Main Inventory Page Component
 */
@Component({
	selector: 'app-inventory',
	styleUrls: ['./inventory.component.scss'],
	templateUrl: './inventory.component.html',
})

export class InventoryComponent implements OnInit {
	public tableOptions: CuiTableOptions;
	public loading = false;
	public limit = 15;
	public totalAssets = 20;
	public assets: Asset[] = [];
	@ViewChild('hostname') public hostnameTemplate: TemplateRef<string>;
	@ViewChild('productid') public productidTemplate: TemplateRef<string>;
	@ViewChild('ip')  public ipTemplate: TemplateRef<string>;
	@ViewChild('serial') public serialTemplate: TemplateRef<string>;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('InventoryComponent Created!');
	}

	/**
 	* Implement ngOnInit
 	*/
	public ngOnInit () {
		this.tableOptions = new CuiTableOptions({
			bordered: false,
			columns: [
				{
					key: 'hostname',
					name: I18n.get('_Hostname_'),
					sortable: true,
					sorting: false,
					sortKey: 'hostname',
					width: '25%',
				},
				{
					name: I18n.get('_ProductId_'),
					sortable: false,
					sorting: false,
					template: this.productidTemplate,
				},
				{
					key: 'ipaddress',
					name: I18n.get('_IpAddress_'),
					sortable: false,
					sorting: false,
				},
				{
					key: 'serialNumber',
					name: I18n.get('_SerialNumber_'),
					sortable: false,
					sorting: false,
				},
			],
			dynamicData: true,
			padding: 'loose',
			selectable: false,
			sortable: true,
		});
		this.loadData();
	}

	/**
 	* Implement loadData funciton
 	*/
	public loadData () {
		this.loading = true;
		for (let i = 0; i < this.totalAssets; i = i + 1) {
			const asset = {
				_id : i,
				hostname: `${i.toString()}.cisco.com`,
				ipaddress :  `${i.toString()}.${i.toString()}.${i.toString()}.${i.toString()}`,
				productId : `${i.toString()}`,
				serialNumber : `TMX${i.toString()}`,
			};
			this.assets.push(asset);
		}
		this.loading = false;
	}
}
