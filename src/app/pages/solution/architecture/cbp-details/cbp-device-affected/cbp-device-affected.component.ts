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

/**
 * CBP Device Affected Table Component
 */
@Component({
	selector: 'cbp-device-affected',
	styleUrls: ['./cbp-device-affected.component.scss'],
	templateUrl: './cbp-device-affected.component.html',
})
export class CbpDeviceAffectedComponent implements OnInit, OnChanges {

	@Input('cbpDetails') public cbpDetails: any;
	@ViewChild('assetTmpl', { static: true }) public assetTemplate: TemplateRef<any>;
	public tableOptions: CuiTableOptions;
	public tableLimit = 5;
	public tableOffset = 0;
	public totalItems = 8;
	public tableData: any[] = [];
	public tempData: any[] = [
		{
			neInstanceId: '23493613',
			customerId: '167866829',
			collectorId: 'CSP0001039747',
			managedNeInstanceId: '7676767',
			inventoryName: 'SNTC_API_Test123',
			managementAddress: '172.21.34.57',
			neSubtype: 'Child Device for ex:- Daughter Card in a Device',
			inventoryAvailability: 'Inventory Availability',
			lastConfigRegister: 'Last Config Register 0*2102',
			ipAddress: '172.21.34.94',
			hostname: 'TSPM-SJ-P1C1R11',
			sysName: 'bocgrp-ipswich-596313-WAP-11',
			featureSet: 'IP BASE, IP BASE W/O CRYPTO',
			inventoryCollectionDate: '2017-04-08T04:22:45Z',
			productFamily: 'Cisco Catalyst 4500 Series Switches',
			productId: 'WS-C4506-E',
			productType: 'LAN Switches',
			createDate: '2017-10-24T09:19:17Z',
			swType: 'IOS',
			swVersion: '15.0(1)M4',
			reachabilityStatus: 'REACHABLE',
			neType: 'APPLICATION',
			lastReset: '2012-01-20T22:38:03Z',
			resetReason: 'power-on',
			sysContact: 'Mark Doering',
			sysDescr: 'Cisco IOS Software, IOS-XE Software, Catalyst 4500 L3 Switch Software (cat4500e-UNIVERSALK9-M), Version 03.04.02.SG RELEASE SOFTWARE',
			sysLocation: 'SJC-J/2',
			sysObjectId: '1.3.6.1.4.1.9.1.576',
			configRegister: '0x2102',
			configAvailability: 'Available',
			configCollectionDate: '2012-06-19T14:15:33Z',
			imageName: 'C2800NM-IPBASE-M',
			bootstrapVersion: 'NA',
			isManagedNe: '1',
			macAddress: '00:06:28:d9:00:20',
			ruleIdsWithExceptions: '8323;8324;8325;8326;8327;8328;8329;8330;8331;8332;8333;8334;8335;8336;8337;8338;8339;8340;8341;8342;8343;8344;8345;8346;8347;8348;8349;8350;8351;8352;8353;8354;8355;8356;8357;8358;8359;8360;8361;8362;8363;8364;8365;8366;8367',
		},
		{
			neInstanceId: '23493620',
			customerId: '167866829',
			collectorId: 'CSP0001039747',
			managedNeInstanceId: '7676767',
			inventoryName: 'SNTC_API_Test123',
			managementAddress: '172.21.34.57',
			neSubtype: 'Child Device for ex:- Daughter Card in a Device',
			inventoryAvailability: 'Inventory Availability',
			lastConfigRegister: 'Last Config Register 0*2102',
			ipAddress: '172.21.34.94',
			hostname: 'TSPM-SJ-P1C1R11',
			sysName: 'bocgrp-ipswich-596313-WAP-11',
			featureSet: 'IP BASE, IP BASE W/O CRYPTO',
			inventoryCollectionDate: '2017-04-08T04:22:45Z',
			productFamily: 'Cisco Catalyst 4500 Series Switches',
			productId: 'WS-C4506-E',
			productType: 'LAN Switches',
			createDate: '2017-10-24T09:19:17Z',
			swType: 'IOS',
			swVersion: '15.0(1)M4',
			reachabilityStatus: 'REACHABLE',
			neType: 'APPLICATION',
			lastReset: '2012-01-20T22:38:03Z',
			resetReason: 'power-on',
			sysContact: 'Mark Doering',
			sysDescr: 'Cisco IOS Software, IOS-XE Software, Catalyst 4500 L3 Switch Software (cat4500e-UNIVERSALK9-M), Version 03.04.02.SG RELEASE SOFTWARE',
			sysLocation: 'SJC-J/2',
			sysObjectId: '1.3.6.1.4.1.9.1.576',
			configRegister: '0x2102',
			configAvailability: 'Available',
			configCollectionDate: '2012-06-19T14:15:33Z',
			imageName: 'C2800NM-IPBASE-M',
			bootstrapVersion: 'NA',
			isManagedNe: '1',
			macAddress: '00:06:28:d9:00:20',
			ruleIdsWithExceptions: '8391',
		},
		{
			neInstanceId: '23493621',
			customerId: '167866829',
			collectorId: 'CSP0001039747',
			managedNeInstanceId: '7676767',
			inventoryName: 'SNTC_API_Test123',
			managementAddress: '172.21.34.57',
			neSubtype: 'Child Device for ex:- Daughter Card in a Device',
			inventoryAvailability: 'Inventory Availability',
			lastConfigRegister: 'Last Config Register 0*2102',
			ipAddress: '172.21.34.94',
			hostname: 'TSPM-SJ-P1C1R11',
			sysName: 'bocgrp-ipswich-596313-WAP-11',
			featureSet: 'IP BASE, IP BASE W/O CRYPTO',
			inventoryCollectionDate: '2017-04-08T04:22:45Z',
			productFamily: 'Cisco Catalyst 4500 Series Switches',
			productId: 'WS-C4506-E',
			productType: 'LAN Switches',
			createDate: '2017-10-24T09:19:17Z',
			swType: 'IOS',
			swVersion: '15.0(1)M4',
			reachabilityStatus: 'REACHABLE',
			neType: 'APPLICATION',
			lastReset: '2012-01-20T22:38:03Z',
			resetReason: 'power-on',
			sysContact: 'Mark Doering',
			sysDescr: 'Cisco IOS Software, IOS-XE Software, Catalyst 4500 L3 Switch Software (cat4500e-UNIVERSALK9-M), Version 03.04.02.SG RELEASE SOFTWARE',
			sysLocation: 'SJC-J/2',
			sysObjectId: '1.3.6.1.4.1.9.1.576',
			configRegister: '0x2102',
			configAvailability: 'Available',
			configCollectionDate: '2012-06-19T14:15:33Z',
			imageName: 'C2800NM-IPBASE-M',
			bootstrapVersion: 'NA',
			isManagedNe: '1',
			macAddress: '00:06:28:d9:00:20',
			ruleIdsWithExceptions: '8387',
		},
		{
			neInstanceId: '23493609',
			customerId: '167866829',
			collectorId: 'CSP0001039747',
			managedNeInstanceId: '7676767',
			inventoryName: 'SNTC_API_Test123',
			managementAddress: '172.21.34.57',
			neSubtype: 'Child Device for ex:- Daughter Card in a Device',
			inventoryAvailability: 'Inventory Availability',
			lastConfigRegister: 'Last Config Register 0*2102',
			ipAddress: '172.21.34.94',
			hostname: 'TSPM-SJ-P1C1R11',
			sysName: 'bocgrp-ipswich-596313-WAP-11',
			featureSet: 'IP BASE, IP BASE W/O CRYPTO',
			inventoryCollectionDate: '2017-04-08T04:22:45Z',
			productFamily: 'Cisco Catalyst 4500 Series Switches',
			productId: 'WS-C4506-E',
			productType: 'LAN Switches',
			createDate: '2017-10-24T09:19:17Z',
			swType: 'IOS',
			swVersion: '15.0(1)M4',
			reachabilityStatus: 'REACHABLE',
			neType: 'APPLICATION',
			lastReset: '2012-01-20T22:38:03Z',
			resetReason: 'power-on',
			sysContact: 'Mark Doering',
			sysDescr: 'Cisco IOS Software, IOS-XE Software, Catalyst 4500 L3 Switch Software (cat4500e-UNIVERSALK9-M), Version 03.04.02.SG RELEASE SOFTWARE',
			sysLocation: 'SJC-J/2',
			sysObjectId: '1.3.6.1.4.1.9.1.576',
			configRegister: '0x2102',
			configAvailability: 'Available',
			configCollectionDate: '2012-06-19T14:15:33Z',
			imageName: 'C2800NM-IPBASE-M',
			bootstrapVersion: 'NA',
			isManagedNe: '1',
			macAddress: '00:06:28:d9:00:20',
			ruleIdsWithExceptions: '8351',
		},
	];

	constructor (private logger: LogService) {
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
	 * Used to detect the changes in input object and call the getdata function
	 */
	public ngOnChanges () {
		this.totalItems = this.tempData.length;
		this.getData();
	}

	/**
	 * Used for getting pageNumber Index and call the getdata function
	 * @param pageInfo the key to match to the filter
	 */
	public onPagerUpdated (pageInfo: any) {
		this.tableOffset = pageInfo.page;
		this.getData();
	}
	/**
	 * used for setting the data for table
	 */
	public getData () {
		const index = this.tableOffset * this.tableLimit;
		this.tableData = this.tempData.slice(index, index + this.tableLimit);
	}
}
