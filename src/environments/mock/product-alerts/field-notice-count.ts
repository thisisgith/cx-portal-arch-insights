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
	'further-out': 1,
	'gt-0-lt-30-days': 1,
	'gt-30-lt-60-days': 1,
	'gt-60-lt-90-days': 0,
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
			],
		},
		url: `${api}/last-updated/count?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
