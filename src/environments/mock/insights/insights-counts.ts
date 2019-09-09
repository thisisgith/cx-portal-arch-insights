import { InsightsResponse } from '@sdp-api';

/** Base of URL for SDP API insights */
const api = '/api/customerportal/insightsCounts/v1/allCounts/customer/7293498/timePeriod/0';

/** The mock response for insights count */
const mockInsightsCounts: InsightsResponse = {
	complianceIssueCnt: 0,
	predictedCrashCnt: 3,
	recentCrashCnt: 5,
	totalCnt: 8,
};

/** The insights scenarios */
export const InsightsScenarios = [
	{
		scenarios: {
			GET:
			{
				delay: 100,
				description: 'Insights Counts',
				response: {
					body: mockInsightsCounts,
					status: 200,
				},
				selected: true,
			},
		},
		url: `${api}`,
		usecases: ['Use Case 1'],
	},
];