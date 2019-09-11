import { AdvisoriesByLastUpdatedCount } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/security-advisories/last-updated/count';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for coverage counts */
const mockCount: AdvisoriesByLastUpdatedCount = {
	'further-out': {
		fromTimestampInMillis: 1568125813000,
		numericValue: 5,
		toTimestampInMillis: 1568125813000,
	},
	'gt-0-lt-30-days': {
		fromTimestampInMillis: 1568125813000,
		numericValue: 1,
		toTimestampInMillis: 1570717813000,
	},
	'gt-30-lt-60-days': {
		fromTimestampInMillis: 1570717813000,
		numericValue: 4,
		toTimestampInMillis: 1573396213000,
	},
	'gt-60-lt-90-days': {
		fromTimestampInMillis: 1573396213000,
		numericValue: 4,
		toTimestampInMillis: 1575988213000,
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
