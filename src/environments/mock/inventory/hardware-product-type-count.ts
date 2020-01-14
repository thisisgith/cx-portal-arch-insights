import { ProductTypeResponse } from "@sdp-api";

/** Base of URL for SDP API */
const api = '/api/customerportal/inventory/v1/assets/hardware/productType/count';

/** Default Customer ID */
const customerId = '2431199_0';

/** The mock response for role counts */
const mockHardwareProductCount: ProductTypeResponse = 
	
	[
		{
			count: 10,
			ProductType: 'Routers',
		},
		{
			count: 25,
			ProductType: 'Switches',
		},
		{
			count: 13,
			ProductType: 'Modules',
		},
		{
			count: 9,
			ProductType: 'Wireless',
		},
		{
			count: 18,
			ProductType: 'Cables',
		}
	];
	
	


/** The scenarios */
export const HardwareProductTypeScenarios = [
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
