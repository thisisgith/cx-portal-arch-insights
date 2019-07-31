import { AdvisoriesByLastUpdatedCount } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/security-advisories/last-updated/count';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for coverage counts */
const mockCount: AdvisoriesByLastUpdatedCount = {
	'further-out': 5,
	'gt-0-lt-30-days': 1,
	'gt-30-lt-60-days': 4,
	'gt-60-lt-90-days': 4,
};

/** The scenarios */
export const SecurityAdvisoryLastUpdatedCountScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Mock Last Updated Count',
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