import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';

/**
 *  Define interface
 */
export interface Asset {
	_id: number;
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
	public loading = false;
	public limit = 15;
	public totalAssets = 20;
	public assets: Asset[] = [];
	public currentTab = 'vulnerability';
	public less = true;
	public currentButton = 'securityadvisory';
	public showSidePanel = false;
	public sampleDevice = {
		deviceName: 'Cisco Catalyst 3650-12x48FD-E Switch',
		hostname: 'SJ-CAT-3650-12x48',
		ipAddress: '10.10.10.1',
		productFamily: 'Catalyst Switch',
		productID: 'WS-C3650-12X48FD-E',
		productSeries: 'Catalyst 3600',
		serialNo: 'TMX1919OU4',
		software: 'Everest-16.6.5',
	};

	@ViewChild('productid') public productidTemplate: TemplateRef<string>;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('InventoryComponent Created!');
	}

	/**
 	* Implement ngOnInit
 	*/
	public ngOnInit () {
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

	/**
	 * Implement selectTab function
	 * @param tab : future active Tab
	 */
	public selectTab (tab: string) {
		this.currentTab = tab;
	}

	/**
 	* Implement showMore funciton
 	*/
	public showMore () {
		this.less = false;
	}

	/**
 	* Implement showLess funciton
 	*/
	public showLess () {
		this.less = true;
	}

	/**
	 * Implement clickButton function
	 * @param button : Button Clicked
	 */
	public clickButton (button: string) {
		this.currentButton = button;
	}
}
