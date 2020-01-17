import { ProductTypeResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/inventory/v1/assets/system/productType/count';

/** Default Customer ID */
const customerId = '2431199_0';

/** The mock response for role counts */
const mockHardwareProductCount: ProductTypeResponse = [
	{
		deviceCount: 10,
		productType: 'Routers',
	},
	{
		deviceCount: 25,
		productType: 'Switches',
	},
	{
		deviceCount: 13,
		productType: 'Modules',
	},
	{
		deviceCount: 9,
		productType: 'Wireless',
	},
];

/** The scenarios */
export const ProductTypeScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Hardware Product Count',
					response: {
						body: mockHardwareProductCount,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
