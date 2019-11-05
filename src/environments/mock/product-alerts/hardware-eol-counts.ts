import { HardwareEOLCountResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/hardware-eol/top/count';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for coverage counts */
const mockAdvisoryCounts: HardwareEOLCountResponse = {
	'gt-0-lt-12-months': {
		numericValue: 5,
	},
	'gt-12-lt-24-months': {
		numericValue: 26,
	},
	'gt-24-lt-36-months': {
		numericValue: 8,
	},
	'gt-36-months': {
		numericValue: 8,
	},
};

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
