import { SecurityAdvisorySummary } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/security-advisories/summary';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for coverage counts */
const mockSummary: SecurityAdvisorySummary = {
	advisoryCount: 5,
	advisorySummary: [
		{
			alertCount: 1,
			alertSeverity: 'critical',
		},
		{
			alertCount: 1,
			alertSeverity: 'high',
		},
		{
			alertCount: 1,
			alertSeverity: 'medium',
		},
		{
			alertCount: 1,
			alertSeverity: 'low',
		},
		{
			alertCount: 1,
			alertSeverity: 'info',
		},
	],
};

/** The scenarios */
export const SecurityAdvisorySummaryScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Mock Advisory Summary',
					response: {
						body: mockSummary,
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
