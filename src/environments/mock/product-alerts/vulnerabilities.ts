import { VulnerabilityResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/vulnerabilities/count';
/** Default Customer ID */
const customerId = '2431199';

/** The mock response for coverage counts */
const mockAdvisoryCounts: VulnerabilityResponse = {
	bugs: 2,
	'field-notices': 3,
	'security-advisories': 6,
};

/** The scenarios */
export const VulnerabilityScenarios = [
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
