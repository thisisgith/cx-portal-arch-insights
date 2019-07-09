import { HardwareEOLCountResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/hardware-eol/counts';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for coverage counts */
const mockAdvisoryCounts: HardwareEOLCountResponse = [
	{
		deviceCount: 5,
		range: '< 30',
	},
	{
		deviceCount: 78,
		range: '30 - 60',
	},
	{
		deviceCount: 41,
		range: '61 - 90',
	},
];

/** The scenarios */
export const HardwareEOLCountScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Advisory Counts',
					response: {
						body: mockAdvisoryCounts,
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
