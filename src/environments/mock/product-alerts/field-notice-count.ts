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
