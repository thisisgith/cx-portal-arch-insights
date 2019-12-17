import { SoftwareEOLResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/software-eol';

/** Default Customer ID */
const customerId = '2431199_0';

/** Default managed NE ID */
const managedNeId = 'NA,FHK1045Y01E,WS-C2960-24TC-L,NA';

/** The mock response for coverage counts */
export const MockSoftwareEOLResponse: SoftwareEOLResponse = {
	/* tslint:disable */
	"data": [
			{
					"customerId": "2431199",
					"managedNeId": "NA,FHK1045Y01E,WS-C2960-24TC-L,NA",
					"neInstanceId": "NA,FHK1045Y01E,WS-C2960-24TC-L,NA",
					"swEolInstanceId": 349,
					"productId": "GLC-SX-MM,GLC-SX-MM-RGD,GLC-SX-MMD,GLC-T,SFP-GE-S,WS-G5484",
					"equipmentType": "MODULE",
					"bulletinHeadline": "string",
					"swType": "string",
					"swVersion": "string",
			},
	],
	/* tslint:enable */
};

/** The software eol scenarios */
export const SoftwareEOLScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 44,
					description: 'Software EOL',
					response: {
						body: MockSoftwareEOLResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&managedNeId=${managedNeId}`,
		usecases: ['Use Case 1'],
	},
];
