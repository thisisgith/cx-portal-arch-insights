/**
 * Api url
 */
const api = '/api/customerportal/asset-tagging/v1';
/** Default Customer ID */
const customerId = '2431199';

const leftSideResponse = {
	"customerId":"cid1",
	"tags":[
		{
			"tagName":"T1",
			"tagValue":"TID1",
			"devices":["D1","D2","D3"],
			"deviceCount":"3"
		},
		{
			"tagName":"T2",
			"tagValue":"TID2",
			"devices":["D4","D5","D6","D1"],
			"deviceCount":"3"
		}
	]
}


const rightSideResponse = {
	"customerId":"cid1",
	"policyGroups":[
		{
			"policyName":"PCI",
			"devices":["D1","D2","D3"],
			"toBeScanned":"true",
			"tags":[
				{
					"tagName":"T1",
					"tagValue":"TID1"
				},{
					"tagName":"T2",
					"tagValue":"TID2"
				}
			]
			
		},
		{
			"policyName":"HIPPA",
			"devices":["D4","D5","D6"],
			"toBeScanned":"false",
			"tags":[
				{
					"tagName":"T3",
					"tagValue":"TID3"
				},{
					"tagName":"T4",
					"tagValue":"TID4"
				}
			]
			
		}
	
	]
};

/**
 * Afm service scenarios
 */
export const AdminComplience = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
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
					delay: 100,
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
