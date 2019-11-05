/** This is an api url  */
const api = '/api/customerportal/archinsights/v1';
/**
 * Customer Id for mock response
 */
const customerId = 2431199;

/**
 * sample deviceIp
 */
const deviceIp = '192.168.46.100';
/**
 * collectionId for mock response
 */

const collectionId = '9ecf600a-d38b-4aed-9a34-ace3ca733e31';

/**
 * collectionDate for mock response
 */
const collectionDate = '1';
/**
 * dnacIp for mock response
 */
const dnacIp = '172.16.44.31';

/**
 * get collectionId
 */

const collectionIdResponse = {
	collectionDate: '2019-09-01T05:38:59.619+0000',
	collectionId: '9ecf600a-d38b-4aed-9a34-ace3ca733e31',
};
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
			devicesPublishedPercentage: 75,
			devicesPublishedViolated: 'No',
			dnacCpu: '',
			dnacFilesystem: '',
			dnacHostname: '172.16.44.31',
			dnacIpaddress: '172.16.44.31',
			dnacMemory: '',
			dnacSiteLocation: 'NA',
			dnacVersion: '1.3',
			endpointsPublishedLimits: '20000',
			endpointsPublishedPercentage: 75,
			endpointsPublishedViolated: 'No',
			fabricsPublishedLimits: '10',
			fabricsPublishedPercentage: 75,
			fabricsPublishedViolated: 'No',
			haCluster: 'NA',
			haClusterNodes: 'NA',
			inventoryCollectionDate: '2019-09-20T17:46:42.000Z',
			noOfDevices: '0',
			noOfEndpoints: '11',
			noOfFabrics: '0',
			noOfWlc: '0',
			wlcPublishedLimits: '500',
			wlcPublishedPercentage: 75,
			wlcPublishedViolated: 'No',
		},
	],
	totalCount: 1,
};

/**
 * get all device data
 */
const getDevicesSDAResponseData = {
	CollectionDate: '2019-08-27T06:15:40.636+0000',
	dnacDeviceDetails: [
		{
			assuranceCompliance: 'Yes',
			currentDeviceRole: 'Controller',
			dnacCompliance : 'Yes',
			dnacVersion: '1.2',
			hardwarePidCompliant: 'Yes',
			hostName: 'AP70F3.5A7E.44C8',
			ipAddress: '192.168.46.100',
			overallCompliance: 'Yes',
			pnpCompliance: 'Yes',
			productFamily: 'N/A',
			productId: 'AIR-AP1800S-B-K9',
			sdaCompliance: 'Yes',
			softwareType: 'AireOs',
			softwareTypeCompliant: 'Yes',
			softwareVersion: '8.8.300.49',
			softwareVersionCompliant: 'Yes',
			swimCompliance: 'Yes',
		},
		{
			assuranceCompliance: 'No',
			currentDeviceRole: 'Controller',
			dnacCompliance : 'No',
			dnacVersion: '1.2',
			hardwarePidCompliant: 'No',
			hostName: 'AP70F3.5A7E.44C8',
			ipAddress: '192.168.46.100',
			overallCompliance: 'No',
			pnpCompliance: 'Yes',
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: '7293498_NA',
			sdaCompliance: 'Yes',
			softwareType: 'AireOs',
			softwareTypeCompliant: 'Yes',
			softwareVersion: '8.8.300.49',
			softwareVersionCompliant: 'Yes',
			swimCompliance: 'Yes',
		},
		{
			assuranceCompliance: 'Yes',
			currentDeviceRole: 'Controller',
			dnacCompliance : 'Yes',
			dnacVersion: '1.2',
			hardwarePidCompliant: 'No',
			hostName: 'AP70F3.5A7E.44C8',
			ipAddress: '192.168.46.100',
			overallCompliance: 'No',
			pnpCompliance: 'Yes',
			productFamily: 'N/A',
			productId: 'AIR-AP1800S-B-K9',
			sdaCompliance: 'No',
			softwareType: 'AireOs',
			softwareTypeCompliant: 'Yes',
			softwareVersion: '8.8.300.49',
			softwareVersionCompliant: 'Yes',
			swimCompliance: 'Yes',
		},
		{
			assuranceCompliance: 'Yes',
			currentDeviceRole: 'Controller',
			dnacCompliance : 'Yes',
			dnacVersion: '1.2',
			hardwarePidCompliant: 'Yes',
			hostName: 'AP70F3.5A7E.44C8',
			ipAddress: '192.168.46.100',
			overallCompliance: 'Yes',
			pnpCompliance: 'Yes',
			productFamily: 'N/A',
			productId: 'AIR-AP1800S-B-K9',
			sdaCompliance: 'Warning',
			softwareType: 'AireOs',
			softwareTypeCompliant: 'Yes',
			softwareVersion: '8.8.300.49',
			softwareVersionCompliant: 'Yes',
			swimCompliance: 'Yes',
		},
		{
			assuranceCompliance: 'NA',
			currentDeviceRole: 'Controller',
			dnacCompliance : 'NA',
			dnacVersion: '1.2',
			hardwarePidCompliant: 'Yes',
			hostName: 'AP70F3.5A7E.44C8',
			ipAddress: '192.168.46.100',
			overallCompliance: 'NA',
			pnpCompliance: 'NA',
			productFamily: 'N/A',
			productId: 'AIR-AP1800S-B-K9',
			sdaCompliance: 'NA',
			softwareType: 'AireOs',
			softwareTypeCompliant: 'NA',
			softwareVersion: '8.8.300.49',
			softwareVersionCompliant: 'No',
			swimCompliance: 'NA',
		},
		{
			assuranceCompliance: 'Yes',
			currentDeviceRole: 'Controller',
			dnacCompliance : 'Yes',
			dnacVersion: '1.2',
			hardwarePidCompliant: 'Yes',
			hostName: 'AP70F3.5A7E.44C8',
			ipAddress: '192.168.46.100',
			overallCompliance: 'No',
			pnpCompliance: 'Yes',
			productFamily: 'N/A',
			productId: 'AIR-AP1800S-B-K9',
			sdaCompliance: 'No',
			softwareType: 'AireOs',
			softwareTypeCompliant: 'Yes',
			softwareVersion: '8.8.300.49',
			softwareVersionCompliant: 'Yes',
			swimCompliance: 'Yes',
		},
	],
	totalCount: 6,
};

/**
	* get SDA Supported hardware and software
	*/
const getSdaSupportedData = {
	dnacDeviceDetails:	{
		dnacVersion: '1.2',
		failedCriteria: [
			'We detected a software non-compliance for SDA.',
			'We detected a non-compliance for SDA. L3 switching is not enabled on device C9300-24',
		],
		hardwareRecommendation: 'CX-9300L',
		hostName: 'AP70F3.5A7E.44C8',
		ipAddress: '192.168.46.100',
		sdaL3AccessEnabled: 'Yes',

		sdaNoOfMtuNonOptimalInterfaces: 7,
		sdaRedundantLinks: 'Yes',
		sdaSupportedHardware: [
			{
				deviceRole: 'controller',
				productFamily: ['Cisco Catalyst 9300 Series Switches',
					'Cisco Catalyst 9300 Series Switches'],
				productId: [
					'pid1',
					'pid2',
				],
			},
		],
		sdaSupportedSoftware: [
			{
				deviceRole: 'Fabric Edge',
				productFamily: 'Cisco Catalyst 9300 Series Switches',
				software: [
					'IOS XE 16.10.1e',
					'IOS XE 16.11.1c',
					'AireOS 8.9.111.0',
					'AireOS 8.9.100.0',
					'AireOS 8.8.120.0',
					'AireOS 8.8.111.0',
				],
			},
		],
		serialNumber: 'KWC21420A6L',
	},
};
/**
 * Non optimal links response
 */
const nonOptimalLinksResponse = {
	dnacDeviceDetails: {
		mtuNonOptimalLinks: [
			{
				destinationDevice: '78654',
				destinationInterface: 'interface2',
				linkId: 'link1',
				linkStatus: 'UP',
				mtuValue: 1300,
				sourceDevice: '6767999',
				sourceInterface: 'interface1',
			},
			{
				destinationDevice: '78654',
				destinationInterface: 'interface2',
				linkId: 'link1',
				linkStatus: 'UP',
				mtuValue: 5000,
				sourceDevice: '6767999',
				sourceInterface: 'interface1',
			},
		],
		totalCount: 2,
	},
};

/**
 * moc data for DNAC scale response
 */
const dnacScaleResponse = [
	{
		collectionDate: '1571443200',
		endpointsPeakTime: '1571443700',
		noOfDevices: 30,
		noOfEndpoints: 70,
		noOfFabrics: 40,
		noOfWlc: 90,
	},
	{
		collectionDate: '1571443300',
		endpointsPeakTime: '1571439700',
		noOfDevices: 20,
		noOfEndpoints: 30,
		noOfFabrics: 60,
		noOfWlc: 20,
	},
	{
		collectionDate: '1571444200',
		endpointsPeakTime: '1571447500',
		noOfDevices: 90,
		noOfEndpoints: 40,
		noOfFabrics: 60,
		noOfWlc: 90,
	},
	{
		collectionDate: '1571445240',
		endpointsPeakTime: '1571448400',
		noOfDevices: 80,
		noOfEndpoints: 40,
		noOfFabrics: 80,
		noOfWlc: 10,
	},
	{
		collectionDate: '1571443360',
		endpointsPeakTime: '1571449000',
		noOfDevices: 40,
		noOfEndpoints: 20,
		noOfFabrics: 80,
		noOfWlc: 90,
	},
	{
		collectionDate: '1571427200',
		endpointsPeakTime: '1571444800',
		noOfDevices: 30,
		noOfEndpoints: 50,
		noOfFabrics: 10,
		noOfWlc: 70,
	},
];

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
	totalCount : 1,
};

/**
 * Get the Devices count
 */
const getDevicesCountResponseData = {
	totalCount : 51,
};

/**
 * Get the SDA Chart Filter count
 */
const getSDAChartFilterCountResponseData = {
	assuranceCompliance: {
		NA: 1,
		No: 3,
		Yes: 4,
	},
	overallCompliance: {
		NA: 4,
		No: 4,
		Yes: 4,
	},
	pnpCompliance: {
		NA: 2,
		No: 4,
		Yes: 2,
	},
	sdaCompliance: {
		NA: 2,
		No: 4,
		Warning: 1,
		Yes: 2,
	},
	swimCompliance: {
		NA: 1,
		No: 3,
		Yes: 6,
	},
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
		url: `${api}/dnac/details?page=0` +
		`&pageSize=10&customerId=${customerId}&collectionId=${collectionId}&searchText=&dnacIP=`,
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
		url: `${api}/dnac/devicedetails?page=0&pageSize=10` +
		`&filterBy=&customerId=${customerId}&collectionId=${collectionId}&searchText=&useCase=`,
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
		url: `${api}/dnac/count?customerId=${customerId}&collectionId=${collectionId}`,
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
		url: `${api}/dnac/devicecount?customerId=${customerId}&collectionId=${collectionId}`,
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
		url: `${api}/dnac/devicecompliance/count` +
		`?customerId=${customerId}&collectionId=${collectionId}`,
		usecases: ['Use Case 6'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'SDA Data',
					response: {
						body: getSdaSupportedData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/dnac/deviceinsight?page=0&pageSize=10&customerId=${customerId}` +
		`&deviceIp=${deviceIp}&collectionId=${collectionId}`,
		usecases: ['Use Case 7'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Non Optimal Links',
					response: {
						body: nonOptimalLinksResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/dnac/deviceinsight/nonoptimallinks?page=1&pageSize=10&` +
		`customerId=${customerId}&deviceIp=${deviceIp}&collectionId=${collectionId}`,
		usecases: ['Use Case 8'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'collection Id',
					response: {
						body: collectionIdResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/collectiondetails?customerId=${customerId}`,
		usecases: ['Use Case 9'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'collection Id',
					response: {
						body: dnacScaleResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/dnac/sdaTrends?customerId=${customerId}` +
		`&collectionId=${collectionId}&dnacIp=${dnacIp}&collectionDate=${collectionDate}`,
		usecases: ['Use Case 10'],
	},
];
