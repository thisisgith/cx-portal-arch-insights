/**
 * Api url
 */
const api = '/api/customerportal/asset-tagging/v1';
/** Default Customer ID */
const customerId = '2431199';

/**
 * Mock data for Left side response
 */
const leftSideResponse = {
	customerId: 'cid1',
	tags: [
		{
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			tagName: 'T1',
			tagValue: 'TID1',
		},
		{
			deviceCount: '3',
			devices: ['D4', 'D5', 'D6', 'D1'],
			tagName: 'T2',
			tagValue: 'TID2',
		},
	],
};

/**
 * Mock data for right side response
 */
const rightSideResponse = {
	customerId: 'cid1',
	policyGroups: [
		{
			devices: ['D1', 'D2', 'D3'],
			policyName: 'PCI',
			tags: [
				{
					tagName: 'T1',
					tagValue: 'TID1',
				}, {
					tagName: 'T2',
					tagValue: 'TID2',
				},
			],
			toBeScanned: 'true',
		},
		{
			devices: ['D4', 'D5', 'D6'],
			policyName: 'HIPAA',
			tags: [
				{
					tagName: 'T3',
					tagValue: 'TID3',
				}, {
					tagName: 'T4',
					tagValue: 'TID4',
				},
			],
			toBeScanned: 'false',
		},

	],
};

/**
 * Admin Compliance service scenarios
 */
export const AdminComplience = [
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: 'Admin Complience Data',
					response: {
						body: leftSideResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/tag-to-device-api/${customerId}`,
		usecases: ['Admin complience use case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: 'Admin Complience Data',
					response: {
						body: rightSideResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/tag-policy-mapping-api/${customerId}`,
		usecases: ['Admin complience use case 2'],
	},
];
