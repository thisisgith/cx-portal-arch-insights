import { SoftwareEOLResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/software-eol';

/** Default Customer ID */
const customerId = '2431199';

/** Default managed NE ID */
const managedNeId = 'NA,FOC1544Y16T,WS-C2960S-24PS-L,NA';

/** The mock response for coverage counts */
export const MockSoftwareEOLResponse: SoftwareEOLResponse = {
	/* tslint:disable */
	"data": [
			{
					"customerId": "2431199",
					"managedNeId": "NA,FOC1544Y16T,WS-C2960S-24PS-L,NA",
					"neInstanceId": "NA,FOC1544Y16T,WS-C2960S-24PS-L,NA",
					"swEolInstanceId": "0",
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
					delay: 350,
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
