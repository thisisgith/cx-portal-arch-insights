import { SecurityAdvisorySeverityCountResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/security-advisories/severity/count';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for coverage counts */
const mockCount: SecurityAdvisorySeverityCountResponse  = {
	critical: 1,
	high: 2,
	info: 4,
	low: 1,
	medium: 2,
};

/** The scenarios */
export const SecurityAdvisorySeverityCountScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Mock Severity Count',
					response: {
						body: mockCount,
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
