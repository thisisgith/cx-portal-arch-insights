import { InventoryResults } from '../inventory';
import { DeviceDetails } from '@interfaces';

/**
 * Mock data for Inventory API results
 * @ignore
 */
export const mockData: InventoryResults = {
	assets: [
		{
			_id: 1,
			hostname: 'SJ-CAT-3650-12x48',
			ipAddress: '127.0.0.1',
			productId: 'CAT 3600',
			serialNumber: 'TMX1919OU4',
			softwareType: 'IOS',
			softwareVersion: '9.4(2)',
		},
		{
			_id: 2,
			hostname: 'SJ-002.umbrella.com',
			ipAddress: '127.0.0.1',
			productId: 'PIX 501',
			serialNumber: 'TMX1919OU4',
			softwareType: 'IOS',
			softwareVersion: '9.4(2)',
		},
		{
			_id: 3,
			hostname: 'SJ-003.umbrella.com',
			ipAddress: '127.0.0.1',
			productId: 'ASA 5500',
			serialNumber: 'TMX1919OU4',
			softwareType: 'IOS',
			softwareVersion: '9.4(2)',
		},
		{
			_id: 4,
			hostname: 'SJ-004.umbrella.com',
			ipAddress: '127.0.0.1',
			productId: 'PIX 515',
			serialNumber: 'TMX1919OU4',
			softwareType: 'IOS',
			softwareVersion: '9.4(2)',
		},
		{
			_id: 5,
			hostname: 'SJ-005.umbrella.com',
			ipAddress: '127.0.0.1',
			productId: 'NX 6000',
			serialNumber: 'TMX1919OU4',
			softwareType: 'IOS',
			softwareVersion: '9.4(2)',

		},
	],
};

/**
 * Mock data for Inventory API results
 * @ignore
 */
export const mockDeviceDetails: DeviceDetails = {
	_id: 1,
	hostname: 'SJ-CAT-3650-12x48',
	ipAddress: '127.0.0.1',
	productFamily: 'Catalyst Switch',
	productId: 'WS-C3650-12X48FD-E',
	productSeries: 'Catalyst 3600',
	serialNumber: 'TMX1919OU4',
	swType: 'IOS',
	swVersion: 'Everest-16.6.5,',
	sysName: 'Cisco Catalyst 3650-12X48FD-E Switch',
};
