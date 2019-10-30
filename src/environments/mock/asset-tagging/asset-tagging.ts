/** This is an api url  */
const api = '/api/v1';
/**
 * Customer Id for mock response
 */
const customerId = 2431199;

/**
 * sample deviceId
 */
const deviceId = '192.168.46.100';
/**
 * Mock Data for all Tags and Associated Devices
 */
const getAllTags = {
	customerId : 'cid1',
	tags: [
		{
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			tagName: 'T1',
			tagValue: 'TID1',
		},
		{
			deviceCount: '3',
			devices: ['D4', 'D5', 'D6'],
			tagName: 'T2',
			tagValue: 'TID2',
		},
	],
};

/**
 * Mock Data for Tags associated with policies
 */
const getAssociatedPolicyTags = {
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
			toBeScanned: true,

		},
		{
			devices: ['D4', 'D5', 'D6'],
			policyName: 'HIPPA',
			tags: [
				{
					tagName: 'T3',
					tagValue: 'TID3',
				}, {
					tagName: 'T4',
					tagValue: 'TID4',
				},
			],
			toBeScanned: false,

		},

	],
};

/**
 * Mock data for tags in asset 360 page
 */
const getTagForAssets = {
	customerId: 'cid1',
	deviceId: 'deviceId1',
	tags: [
		{
			tagName: 'T1',
			tagValue: 'TID1',
		}, {
			tagName: 'T2',
			tagValue: 'TID2',
		},
	],
};

/**
 * Mock data for policy list
 */
const getPolicyList = {
	customerId: 'cid1',
	policyGroups: ['PCI', 'HIPPA'],
};

/**
 *  Asset Tagging Component Scenarios
 */
export const AssetTaggingScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'To get all Tags and Associated Devices',
					response: {
						body: getAllTags,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/tag-to-device-api?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'To get Tags associated with policies',
					response: {
						body: getAssociatedPolicyTags,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/tag-policy-mapping-api?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'To get tags in asset 360 page',
					response: {
						body: getTagForAssets,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/device-tag-api?customerId=${customerId}&deviceId=${deviceId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'To get policy list',
					response: {
						body: getPolicyList,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/all-policies-api?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'To save a policy group',
					response: {
						body: null,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/save-tag-policy-mapping-api?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
