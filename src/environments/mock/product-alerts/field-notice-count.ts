import {
	FieldNoticeUpdatedResponse,
} from '@sdp-api';

/** The customerId */
const customerId = '2431199';

/** base API for user info */
const api = '/api/customerportal/product-alerts/v1/field-notices';

/**
 * Mock body of results
 */
const mockCounts: FieldNoticeUpdatedResponse = {
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

/**
 * The scenarios
 */
export const FieldNoticeCountScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Field Notice Update Counts',
					response: {
						body: mockCounts,
						status: 200,
					},
					selected: true,
				},
				{
					delay: 0,
					description: 'Field Notice Counts - Unreachable',
					response: {
						body: { },
						status: 503,
					},
					selected: true,
				},
			],
		},
		url: `${api}/last-updated/count?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
