/** This is an api url  */
const api = '/api/customerportal/archinsights/v1';
/**
 * Customer Id for mock response
 */
const customerId = 2431199;

/**
 * get DNAC data
 */
const getDnacList = {
	CollectionDate: '2019-08-27T06:15:40.636+0000',
	dnacDetails: [
		{
			collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
			collectorId: 'CSP0001047974',
			customerId: '2431199',
			devicesPublishedLimits: '5000',
			devicesPublishedViolated: 'No',
			dnacCpu: '',
			dnacFilesystem: '',
			dnacHostname: '172.16.44.31',
			dnacIpaddress: '172.16.44.31',
			dnacMemory: '',
			dnacSiteLocation: 'NA',
			dnacVersion: '1.3',
			endpointsPublishedLimits: '20000',
			endpointsPublishedViolated: 'No',
			fabricsPublishedLimits: '10',
			fabricsPublishedViolated: 'No',
			haCluster: 'NA',
			haClusterNodes: 'NA',
			inventoryCollectionDate: '2019-09-20T17:46:42.000Z',
			noOfDevices: '0',
			noOfEndpoints: '11',
			noOfFabrics: '0',
			noOfWlc: '0',
			wlcPublishedLimits: '500',
			wlcPublishedViolated: 'No',
		},
	],
	TotalCounts: 1,
};

/**
 * get all device data
 */
const getDevicesSDAResponseData = {
	CollectionDate: '2019-08-27T06:15:40.636+0000',
	dnacDeviceDetails: [
		{
			assurance: 'N/A',
			collectionId: 'a655cc77-bb6f-448c-b106-015c9e4d0ebc',
			customerId: '2431199',
			hardwareCompliance: 'No',
			hostName: 'C3750E.domain1.com',
			ipAddress: '192.168.99.215',
			lastUpdateDate: '2019-08-27T12:44:20.000+0000',
			managedNeId: 'NA,FDO1734H1MQ,WS-C3750X-24T-L,NA',
			minimumSwVersion: 'N/A',
			neInstanceId: 'NA,FDO1734H1MQ,WS-C3750X-24T-L,NA',
			neName: 'C3750E.domain1.com',
			productFamily: 'Cisco Catalyst 3750 Series Switches',
			productId: 'WS-C3750X-24T-L',
			productType: 'LAN Switches',
			recommendedVersions: [],
			sda: 'N/A',
			serialNumber: 'FDO1734H1MQ',
			softwareCompliance: 'No',
			softwareType: 'IOS',
			softwareVersion: '15.0(2)SE',
			transactionId: 'a72dc4c7-bd4d-4358-85aa-d3b528282231',
		},
		{
			assurance: 'N/A',
			collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
			customerId: '7293498',
			hardwareCompliance: 'Yes',
			hostName: 'N9Kprk',
			ipAddress: '192.168.99.215',
			lastUpdateDate: '2019-08-27T12:44:20.000+0000',
			managedNeId: 'NA,FDO1734H1MQ,WS-C3750X-24T-L,NA',
			minimumSwVersion: 'N/A',
			neInstanceId: 'NA,FDO1734H1MQ,WS-C3750X-24T-L,NA',
			neName: 'N9Kprk',
			productFamily: 'Cisco Catalyst Series Switches',
			productId: 'FS-C3750X-24T-L',
			productType: 'LAN Switches',
			recommendedVersions: [],
			sda: 'N/A',
			serialNumber: 'FDO1734H1MQ',
			softwareCompliance: 'Yes',
			softwareType: 'IOS',
			softwareVersion: '15.0(2)SE',
			transactionId: 'a72dc4c7-bd4d-4358-85aa-d3b528282231',
		},
		{
			assurance: 'N/A',
			collectionId: 'a655cc77-bb6f-448c-b106-015c9e4d0ebc',
			customerId: '7293498',
			hardwareCompliance: 'Yes',
			hostName: 'ASA-v',
			ipAddress: '192.168.99.215',
			lastUpdateDate: '2019-08-27T12:44:20.000+0000',
			managedNeId: 'NA,FDO1734H1MQ,WS-C3750X-24T-L,NA',
			minimumSwVersion: 'N/A',
			neInstanceId: 'NA,FDO1734H1MQ,WS-C3750X-24T-L,NA',
			neName: 'ASA-v',
			productFamily: 'Cisco Catalyst 3750 Series Switches',
			productId: 'WS-C3750X-24T-L',
			productType: 'LAN Switches',
			recommendedVersions: [],
			sda: 'N/A',
			serialNumber: 'FDO1734H1MQ',
			softwareCompliance: 'No',
			softwareType: 'IOS',
			softwareVersion: '15.0(2)SE',
			transactionId: 'a72dc4c7-bd4d-4358-85aa-d3b528282231',
		},
	],
	dnacVersion: 1.0,
	TotalCounts: 3,
};

/**
 * Get reponse for SDA Product Compatability
 */
const getSDAproductCompatabilityResponseData = {
	dnacDeviceDetails: {
	   assurance: 'No',
	   collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
	   customerId: '2431199',
	   hardwareCompliance: 'Yes',
	   hostName: 'ASA-v',
	   ipAddress: '172.21.31.144',
	   lastUpdateDate: '2019-09-21T07:30:35.000+0000',
	   managedNeId: 'NA,9A86PVSCGD3,ASAv,NA',
	   neInstanceId: 'NA,9A86PVSCGD3,ASAv,NA',
	   neName: 'ASA-v',
	   productFamily: 'Adaptive Security Appliances (ASA)',
	   productId: 'ASAv',
	   productType: 'Security',
	   recommendedVersions: [
		{
		  deviceRole: 'SD-Access Wireless',
		  hardware: '802.11 Wave 1 access points: Cisco Aironet 1700 Series (AP 1700)',
		  minimumSwVersion: 'AireOS 8.5.120',
		  pid: 'AP 1700',
		   recommendedSwVersions: [
			  'IOS XE 16.10.1e',
			  'IOS XE 16.11.1c',
			  'AireOS 8.9.111.0',
			  'AireOS 8.9.100.0',
			  'AireOS 8.8.120.0',
			  'AireOS 8.8.111.0',
			  'AireOS 8.8.100.0',
			  'AireOS 8.7.106.0',
			  'AireOS 8.5.140.0',
			  'AireOS 8.5.135.0',
		   ],
		},
		{
		   deviceRole: 'SD-Access Wireless',
		   hardware: '802.11 Wave 1 access points: Cisco Aironet 2700 Series (AP 2700)',
		   minimumSwVersion: 'AireOS 8.5.120',
		   pid: 'AP 2700',
		   recommendedSwVersions: [
			  'IOS XE 16.10.1e',
			  'IOS XE 16.11.1c',
			  'AireOS 8.9.111.0',
			  'AireOS 8.9.100.0',
			  'AireOS 8.8.120.0',
			  'AireOS 8.8.111.0',
			  'AireOS 8.8.100.0',
			  'AireOS 8.7.106.0',
			  'AireOS 8.5.140.0',
			  'AireOS 8.5.135.0',
		   ],
		},
		{
		   deviceRole: 'SD-Access Wireless',
		   hardware: '802.11 Wave 1 access points: Cisco Aironet 3700 Series (AP 3700)',
		   minimumSwVersion: 'AireOS 8.5.120',
		   pid: 'AP 3700',
		   recommendedSwVersions: [
			  'IOS XE 16.10.1e',
			  'IOS XE 16.11.1c',
			  'AireOS 8.9.111.0',
			  'AireOS 8.9.100.0',
			  'AireOS 8.8.120.0',
			  'AireOS 8.8.111.0',
			  'AireOS 8.8.100.0',
			  'AireOS 8.7.106.0',
			  'AireOS 8.5.140.0',
			  'AireOS 8.5.135.0',
		   ],
		},
	 ],
	   sda: 'No',
	   serialNumber: '9A86PVSCGD3',
	   softwareCompliance: 'No',
	   softwareType: 'ASA',
	   softwareVersion: '9.10(1)',
	   transactionId: 'f23a56a8-337d-422d-9cd3-9cdf0071b61c',
	},
	dnacVersion: '1.3',

};

/**
 * get DNAC Details Data
 */

const getDNACDetails = {
	'End Points':
	{
		Label: 'End Points',
		Published: '0',
		PublishedLimit: '2000',
	},
	Fabrics:
	{
		Label: 'Fabrics',
		Published: '0',
		PublishedLimit: '2000',
	},
	'Network Devices':
	{
		Label: 'Network Devices',
		Published: '0',
		PublishedLimit: '2000',
	},
	WLC:
	{
		Label: 'WLC',
		Published: '0',
		PublishedLimit: '2000',
	},
};

/**
 * Get the dnac count
 */
const getDNACCountResponseData = {
	TotalCounts : 1,
};

/**
 * Get the Devices count
 */
const getDevicesCountResponseData = {
	TotalCounts : 51,
};

/**
 * Get the SDA Chart Filter count
 */
const getSDAChartFilterCountResponseData = {
	Compliant: 8,
	'Non-Compliant' : 43,
};
/**
 * Architecture Review Scenarios
 */
export const ArchitectureReviewScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Get DNAC List',
					response: {
						body: getDnacList,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/dnac/` +
		`details?page=0&pageSize=10&customerId=${customerId}&searchText=&dnacIP=`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Devices SDA Response',
					response: {
						body: getDevicesSDAResponseData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/dnac/` +
		`devicedetails?page=0&pageSize=10&deviceCompliance=&customerId=${customerId}&searchText=`,
		usecases: ['Use Case 2'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Bullet Chart Details',
					response: {
						body: getDNACDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/dnac/details?customerId=${customerId}&dnacIP=172.16.44.31`,
		usecases: ['Use Case 3'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'DNAC Count',
					response: {
						body: getDNACCountResponseData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/dnac/count?customerId=${customerId}`,
		usecases: ['Use Case 4'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Devices Count',
					response: {
						body: getDevicesCountResponseData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/dnac/devicecount?customerId=${customerId}`,
		usecases: ['Use Case 5'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'SDA Chart Filter Count',
					response: {
						body: getSDAChartFilterCountResponseData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/dnac/devicecompliance?customerId=${customerId}`,
		usecases: ['Use Case 6'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'SDA Product Compatability',
					response: {
						body: getSDAproductCompatabilityResponseData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/dnac/deviceinsight?page=0&pageSize=10&customerId=${customerId}`,
		usecases: ['Use Case 7'],
	},
];
