/** This is an api url  */
const api = '/pbc/solution/insights/architecture-review';

/**
 * get all device data
 */
const getDeviceData = {
	CollectionDate: '2019-08-27T06:15:40.636+0000',
	dnacDeviceDetails: [
		{
			assurance: 'N/A',
			collectionId: 'a655cc77-bb6f-448c-b106-015c9e4d0ebc',
			customerId: '7293498',
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
	],
	TotalCounts: 91,
};

/**
 * Get empty device data
 */
const getEmptyDeviceData = null;

/**
 * Architecture Review Scenarios
 */
export const ArchitectureReviewScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Get device data',
					response: {
						body: getDeviceData,
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
					description: 'Empty device data',
					response: {
						body: getEmptyDeviceData,
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
