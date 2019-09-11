/**
 * Api link
 */
const api = '/customerportal/inventory/v1/assets';

/**
 * Asset link asset data
 */
const getAssetLinkAssetData = {
	data: [
		{
			contractNumber: '',
			criticalAdvisories: '0',
			deviceName: '5520-1',
			equipmentType: 'CHASSIS',
			hwInstanceId: 'FCH2139V1B0,AIR-CT5520-K9,NA,FCH2139V1B0,AIR-CT5520-K9,NA,NA',
			ipAddress: '10.105.218.192',
			lastScan: null,
			managedNeId: 'NA,FCH2139V1B0,AIR-CT5520-K9,NA',
			neId: 'NA,FCH2139V1B0,AIR-CT5520-K9,NA',
			osType: 'AireOS',
			osVersion: '8.8.125.0',
			productId: 'AIR-CT5520-K9',
			productName: 'Cisco 5520 Wireless Controller w/rack mounting kit',
			reachabilityStatus: 'Reachable',
			role: 'ACCESS',
			serialNumber: 'FCH2139V1B0',
			solutionInfo: null,
			supportCovered: false,
		},
	],
};

/**
 * Element data
 */
const getAssetLinkElementData = {
	data: [
		{
			customerId: '7293498',
			hostName: '5520-1',
			imageName: null,
			installedMemory: 0,
			ipAddress: '10.105.218.192',
			isManagedNE: true,
			lastResetReason: null,
			lastUpdateDate: '2019-08-30T17:47:30',
			managedNeId: 'NA,FCH2139V1B0,AIR-CT5520-K9,NA',
			managementAddress: '10.105.218.192',
			neInstanceId: 'NA,FCH2139V1B0,AIR-CT5520-K9,NA',
			neName: '5520-1',
			neRegistrationStatus: '',
			productFamily: 'Cisco 5500 Series Wireless Controllers',
			productId: 'AIR-CT5520-K9',
			productType: 'Wireless',
			serialNumber: 'FCH2139V1B0',
			smartLicenseProductInstanceIdentifier: '',
			smartLicenseVirtualAccountName: '',
			swType: 'AireOS',
			swVersion: '8.8.125.0',
			sysObjectId: '1.3.6.1.4.1.9.1.2170',
			systemUptime: null,
		},
	],
};

/**
 * Svenarios
 */
export const AssetLinkScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Asset data',
					response: {
						body: getAssetLinkAssetData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Element data',
					response: {
						body: getAssetLinkElementData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Use Case 2'],
	},
];
