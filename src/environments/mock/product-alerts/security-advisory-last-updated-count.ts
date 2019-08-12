import { AdvisoriesByLastUpdatedCount } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/security-advisories/last-updated/count';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for coverage counts */
const mockCount: AdvisoriesByLastUpdatedCount = {
	'further-out': {
		numericValue: 5,
	},
	'gt-0-lt-30-days': {
		numericValue: 1,
	},
	'gt-30-lt-60-days': {
		numericValue: 4,
	},
	'gt-60-lt-90-days': {
		numericValue: 4,
	},
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
				{
					delay: 0,
					description: 'Security Advisory Count - Unreachable',
					response: {
						body: { },
						status: 503,
					},
					selected: false,
				},
			],
		},
		url: `${api}?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
