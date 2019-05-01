import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import * as _ from 'lodash';

/**
 *  Define interface
 */
export interface Asset {
	_id: number;
	hostname: string;
	productId?: string;
	ipaddress?: string;
	serialNumber?: string;
	status: boolean;
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
	public activeAssetId = -1;
	public totalAssets = 20;
	public assets: Asset[] = [];
	public currentTab = 'vulnerability';
	public less = true;
	public currentButton = 'securityadvisory';
	public showSidePanel = false;
	public sortDirection = 'desc';
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
				status: false,
			};
			this.assets.push(asset);
		}
		this.loading = false;
	}

	/**
 	* Implement onSort funciton
 	*/
	public onSort () {
		this.assets = _.orderBy(
			this.assets, ['hostname'], [this.sortDirection]);
		this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
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

	/**
	 * Implement clickTableRow funciton
	 * @param assetId : the asset selected
 	*/
	public clickTableRow (assetId: number) {
		// clicked the active row, will do nothing
		if (assetId === this.activeAssetId) {
			return;
		}

		// If sidepanel is opened, click the other row should close the sidepanel first
		if (this.showSidePanel && (this.activeAssetId !== assetId)) {
			this.closeSidePanel();

			return;
		}
		this.showSidePanel = this.showSidePanel ? false : true;
		if (this.activeAssetId > -1) {
			this.assets[this.activeAssetId].status = false;
		}
		this.assets[assetId].status = true;
		this.activeAssetId = assetId;
	}

	/**
 	* Implement closeSidePanel funciton
 	*/
	public closeSidePanel () {
		this.showSidePanel = false;
		for (const asset of this.assets) {
			asset.status = false;
		}

		// For now will reset all of the sidepanel information when close the sidepanel
		// In the future another API call will do the same
		this.activeAssetId = -1;
		this.currentButton = 'securityadvisory';
		this.currentTab = 'vulnerability';
		this.less = true;
	}
}
