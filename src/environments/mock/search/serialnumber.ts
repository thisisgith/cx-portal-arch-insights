import {
	Assets,
	HardwareResponse,
	DeviceContractResponse,
	VulnerabilityResponse,
	// FieldNoticeResponse,
} from '@sdp-api';

/** Base of URL for SDP API */
const hwApi = '/api/customerportal/inventory/v1/hardware';
// tslint:disable-next-line:completed-docs
const contractApi = '/api/customerportal/contracts/v1/details';
// tslint:disable-next-line:completed-docs
const vulnaribilityApi = '/api/customerportal/product-alerts/v1/vulnerabilities/count';
// tslint:disable-next-line:completed-docs
const assetApi = '/api/customerportal/inventory/v1/assets';

/** Default Customer ID */
const customerId = '2431199';

/** Default SerialNumber ID */
const serialNumber = 'FOX1333GGGG';
// const serialNumber = 'FOX1306GFJJ';

/**
 * Mock data for SerialNumber Search API results
 */
export const mockAssetResponse: Assets = {
	data: [
		{
			containingHwId: null,
			contractNumber: 'UNKNOWN',
			criticalAdvisories: null,
			deviceName: 'Catalyst+2960S-24PS-L+Switch',
			equipmentType: 'CHASSIS',
			hwInstanceId: 'FOC1544Y16T,WS-C2960S-24PS-L,NA,FOC1544Y16T,WS-C2960S-24PS-L,NA,NA',
			ipAddress: '10.119.1.125',
			lastScan: null,
			managedNeId: 'NA,FOC1544Y16T,WS-C2960S-24PS-L,NA',
			osType: 'IOS',
			osVersion: '12.2(55)SE3',
			productId: 'WS-C2960S-24PS-L',
			role: null,
			serialNumber: 'FOC1544Y16T',
			supportCovered: true,
		},
	],
};

/**
 * Mock data for SerialNumber Search API results
 */
export const mockHWResponse: HardwareResponse = {
	data: [
		{
			customerId: 'Cisco Test',
			containingHwId: '10.10.10.10',
			equipmentType: 'POWERSUPPLY',
			hostname: 'C4506-E',
			hwInstanceId: 'SON07130AEZ,PWR-C45-1300ACV,NA,NA,FOX1333GGGG,WS-C4506-E,NA',
			managedNeId: 'NA,FOX1333GGGG,WS-C4506-E,NA',
			managementAddress: '172.21.140.40',
			productDescription: '1',
			productFamily: 'Catalyst 4K Series Power Supplies',
			productId: 'PWR-C45-1300ACV',
			productName: 'Catalyst 4K Series Power Supply',
			productType: 'Power Supplies',
			serialNumber: 'FOX1333GGGG',
			swType: 'IOS',
			swVersion: '15.0(2)SG7',
			tags: [],
		},
	],
};

// tslint:disable-next-line:completed-docs
export const mockContractResponse: DeviceContractResponse = {
	data: [
		{
			billtoGuName: null,
			billtoAddressLine1: '116 INVERNESS DRIVE EAST SUITE 375',
			billtoAddressLine2: 'C/O CASTLE PINES CAPITAL',
			billtoAddressLine3: null,
			billtoAddressLine4: null,
			billtoCity: 'ENGLEWOOD',
			billtoCountry: 'US',
			billtoPostalCode: '80112',
			billtoProvince: 'CO',
			billtoSiteId: null,
			billtoSiteName: 'DIMENSION DATA NORTH AMERICA INC',
			billtoState: 'CO',
			contractEndDate: '2020-07-16T00:00:00',
			contractNumber: 93425688,
			contractStartDate: '2013-06-01T00:00:00',
			contractStatus: 'ACTIVE',
			customerId: '2431199',
			cxLevel: null,
			serviceLevel: 'SNT',
			serviceProgram: 'SMARTNET',
		},
	],
};

// tslint:disable-next-line:completed-docs
export const mockVulnerabilityResponse: VulnerabilityResponse = {
	'security-advisories': 1,
		// tslint:disable-next-line:object-literal-sort-keys
	'field-notices': 1,
	bugs: 10,
};

/** The scenarios */
export const SerialNumberScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'HW Response for SN Search',
					response: {
						body: mockHWResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${hwApi}?customerId=${customerId}&serialNumber=${serialNumber}`,
		usecases: ['SN Search'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Contract Response for SN Search',
					response: {
						body: mockContractResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${contractApi}?customerId=${customerId}&serialNumber=${serialNumber}`,
		usecases: ['SN Search'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Vulnerability Response for SN Search',
					response: {
						body: mockVulnerabilityResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${vulnaribilityApi}?customerId=${customerId}&serialNumber=${serialNumber}`,
		usecases: ['SN Search'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Asset Response for SN Search',
					response: {
						body: mockAssetResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${assetApi}?customerId=${customerId}&serialNumber=${serialNumber}`,
		usecases: ['SN Search'],
	},
];
