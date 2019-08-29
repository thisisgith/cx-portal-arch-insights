/** Base of URL for SDP API */
const api = 'compliance/v1/service/';

/** Default Customer ID */
const customerId = '7293498';

/** This is mock data for empty response  */
const emptyData: any = {
	data: { },
	error: null,
	message: 'SUCCESS',
	status: 200,
};

/** This is mock data for violationDetails  */
const violationDetails: any = {
	data: {
	  customerId: '7293498',
	  impactedAssets: [
		{
		  deviceId: 'NA,FCW2246E0PB,C9300-24P,NA',
		  hostName: 'border_1.dnaauto.cisco.com',
		  ipAddress: '172.16.0.1',
		  osName: 'IOSXE',
		  osVersion: 'swVersion',
		  productFamily: 'Cisco Catalyst 9300 Series Switches',
		  productModel: 'C9300-24P',
		  violationCount: 1,
		  violations: [
			{
				age: 0,
				message: 'AAA authentication login method configured to ask Username/Password.',
				severity: 'P3',
				suggestedfix: '',
			},
		  ],
		},
	  ],
	  impactedAssetsCount: 7,
	},
	error: null,
	message: 'SUCCESS',
	status: 200,
};

/** This is mock data for violationDetails with empty impacted assets  */
const emptyViolationDetails: any = {
	data: {
	  customerId: '7293498',
	  impactedAssets: [],
	  impactedAssetsCount: 0,
	},
	error: null,
	message: 'SUCCESS',
	status: 200,
};

/** This is mock data for policyRuleDetails  */
const policyRuleDetails: any = {
	data: {
		customerId: '7293498',
		deviceFilterDetails: {
			osName: ['IOSXE'],
			productFamily: [
				'Cisco Catalyst 9300 Series Switches',
				'Cisco Cloud Services Router 1000V Series',
			],
			productModel: [
				'C9300-24P',
				'C9300-24UX, C9300-24UX, C9300-24UX',
				'CSR1000V',
			],
		},
		policy: {
			category: 'AAA Services',
			desc: 'By using AAA along with security server, you ',
			group: 'PCI_IOS_XE_GROUP',
			name: 'AAA Authentication - Login [ IOS-XE ]',
			policyId: '_AAA_Authentication__Login__IOSXE_',
		},
		rule: {
			desc: 'It is always important to choose the right order for the methods',
			name: 'All authentication methods should ask Username And Password',
			recommendedAction: 'Re-arrange the order of aaa authentication methods so that enable',
			ruleId: '_All_authentication_methods_should_ask_Username_And_Password__IOSXE_',
		},
	},
	error: null,
	message: 'SUCCESS',
	status: 200,
};

/** The mock response for violation grid data */
const violationGridData: any = {
	data: {
		customerId: '7293498',
		impassets: 7,
		summary: [{
			impassets: 7,
			policycategory: 'AAA Services',
			policygroupid: 'PCI_IOS_XE_GROUP',
			policyid: '_AAA_Authentication__Login__IOSXE_',
			policyname: 'AAA Authentication - Login [ IOS-XE ]',
			ruleid: '_All_authentication_methods_should_ask_Username_And_Password__IOSXE_',
			ruleseverity: 'P3',
			ruletitle: 'All authentication methods should ask Username And Password [ IOS-XE ]',
			violationcount: 7,
		}],
		violationcount: 77,
	},
	error: null,
	message: 'SUCCESS',
};

/** The empty mock response for violation grid data */
const emptyViolationGridData: any = {
	data: {
		customerId: '7293498',
		impassets: 0,
		summary: [],
		violationcount: 0,
	},
	error: null,
	message: 'SUCCESS',
};

/** The mock response for asset grid data */
const assetGridData: any = {
	data: {
		assetList: [{
			containingHwId: null,
			contractNumber: '',
			criticalAdvisories: null,
			deviceName: '5520-1',
			equipmentType: 'CHASSIS',
			hwInstanceId: 'FCH2139V1B0,AIR-CT5520-K9,NA,FCH2139V1B0,AIR-CT5520-K9,NA,NA',
			ipAddress: '10.105.218.192',
			lastScan: null,
			managedNeId: 'NA,FCH2139V1B0,AIR-CT5520-K9,NA',
			osType: 'AireOS',
			osVersion: '8.8.125.0',
			productId: 'AIR-CT5520-K9',
			role: 'ACCESS',
			serialNumber: 'FCH2139V1B0',
			severity: 'P1',
			supportCovered: false,
			violationCount: 3,
		}],
		percentage: 94,
		totalDeviceCount: 63,
		totalViolatedDevices: 59,
		totalViolationCount: 459,
	},
	message: 'SUCCESS',
	pagination: null,
	status: 200,
};

/** The empryt mock response for asset grid data */
const emprytAssetGridData: any = {
	data: {
		assetList: [],
		percentage: 0,
		totalDeviceCount: 0,
		totalViolatedDevices: 0,
		totalViolationCount: 0,
	},
	message: 'SUCCESS',
	pagination: null,
	status: 200,
};

/** The mock response for rccPolicyRuleDetailsData data */
const rccPolicyRuleDetailsData: any = {
	data: {
		customerId: '7293498',
		deviceFilterDetails: {
			osName: '[IOSXE]',
			productFamily: '[Cisco Catalyst 9300 Series Switches]',
			productModel: '[C9300-24P]',
		},
		policy: {
			category: 'Global Configuration',
			desc: 'The Network Time Protocol (NTP) is a protocol designed to time-synchronize',
			group: 'HIPAA_IOS_XE_GROUP',
			name: 'NTP Configuration [ IOS-XE ]',
			policyId: '_NTP_Configuration__IOSXE_',
		},
		rule: {
			desc: 'All devices in the network should be configured to synchronize',
			name: 'Check if configured number of NTP servers is present [ IOS-XE ]',
			recommendedAction: 'Configure the device to synchronize clock',
			ruleId: '_Check_if_configured_number_of_NTP_servers_is_present__IOSXE_',
		},
	},
	error: null,
	message: 'SUCCESS',
	status: 200,
};

/** The mock response for rccViolationDetailsData data */
const rccViolationDetailsData: any = {
	data: {
		customerId: '7293498',
		impactedAssets: [{
			deviceId: '12345',
			hostName: 'border_1.dnaauto.cisco.com',
			ipAddress: '172.16.0.1',
			osName: 'IOSXE',
			osVersion: 'swVersion',
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productModel: 'C9300-24P',
			violationCount: 10,
			violations: [{
				age: 0,
				message: 'NTP Servers are not configured',
				severity: 'P1',
				suggestedfix: '',
			}, {
				age: 0,
				message: 'NTP Servers are not configured',
				severity: 'P3',
				suggestedfix: '',
			}],
		}],
		impactedAssetsCount: 1,
	},
	error: null,
	message: 'SUCCESS',
	status: 200,
};

/** The mock response for violationFilterData data */
const violationFilterData: any = {
	data: {
		assetCount: 11,
		customerId: '',
		policyFilters: [
			{
				filter: 'PCI',
				label: 'PCI',
				percentage: 56,
				value: 77,
			},
			{
				filter: 'HIPAA',
				label: 'HIPAA',
				percentage: 44,
				value: 61,
			},
		],
		policyViolationCount: 138,
		severityFilters: [
			{
				filter: 'P3',
				label: 'P3',
				percentage: 100,
				value: 138,
			},
		],
	},
	error: null,
	message: 'SUCCESS',
	status: 200,
};
/** The mock response for assetFilterData data */
const assetFilterData: any = {
	data: {
		ostypeList: [
			{
				filter: 'IOSXE',
				label: 'IOSXE',
				percentage: '92.45',
				value: 490,
			},
			{
				filter: 'WLC',
				label: 'WLC',
				percentage: '7.55',
				value: 40,
			},
		],
		severityList: [
			{
				filter: 'P3',
				label: 'P3',
				percentage: '98.49',
				value: 391,
			},
			{
				filter: 'P1',
				label: 'P1',
				percentage: '0.5',
				value: 2,
			},
			{
				filter: 'P2',
				label: 'P2',
				percentage: '0.5',
				value: 2,
			},
			{
				filter: 'P4',
				label: 'P4',
				percentage: '0.25',
				value: 1,
			},
			{
				filter: 'P5',
				label: 'P5',
				percentage: '0.25',
				value: 1,
			},
		],
	},
	error: null,
	message: 'SUCCESS',
	status: 200,
};

/** The scenarios */
export const ComplianceScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: violationGridData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/violation-summary/${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: assetGridData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/asset-detail/${customerId}`,
		usecases: ['Use Case 2'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Details',
					response: {
						body: rccPolicyRuleDetailsData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/summary-filters/${customerId}`,
		usecases: ['Use Case 3'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Details',
					response: {
						body: rccViolationDetailsData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/policy-rule-details/${customerId}`,
		usecases: ['Use Case 4'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Details',
					response: {
						body: violationFilterData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/violation-details/${customerId}`,
		usecases: ['Use Case 5'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Details',
					response: {
						body: assetFilterData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/severity-ostype-detail/${customerId}`,
		usecases: ['Use Case 6'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Violation 360 Details',
					response: {
						body: violationDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/violation-details`,
		usecases: ['Use Case 7'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Policy Rule Details',
					response: {
						body: policyRuleDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/policy-rule-details`,
		usecases: ['Use Case 8'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Violation 360 Details',
					response: {
						body: emptyData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/violation-details`,
		usecases: ['Use Case 9'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Violation 360 Details',
					response: {
						body: emptyViolationDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/violation-details`,
		usecases: ['Use Case 10'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: emptyViolationGridData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/violation-summary/${customerId}`,
		usecases: ['Use Case 11'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Filter Asset Details Empty',
					response: {
						body: emptyViolationGridData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/filter-asset-detail`,
		usecases: ['Use Case 12'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Filter Asset Details Empty',
					response: {
						body: assetGridData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/filter-asset-detail`,
		usecases: ['Use Case 13'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Filter Asset Details Empty',
					response: {
						body: emprytAssetGridData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/filter-asset-detail`,
		usecases: ['Use Case 14'],
	},
];
