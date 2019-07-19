import { RiskCountResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/osv/v1/risk/device/count';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for role counts */
const mockRiskCounts: RiskCountResponse = [
	{
		deviceCount: 9,
		risk: 'High',
	},
	{
		deviceCount: 1,
		risk: 'Low',
	},
	{
		deviceCount: 2,
		risk: 'Medium',
	},
];

/** The scenarios */
export const OSVScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Risk Count',
					response: {
						body: mockRiskCounts,
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
