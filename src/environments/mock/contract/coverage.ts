import { HttpHeaders } from '@angular/common/http';
import { CoverageCountsResponse } from '@cui-x/sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/contracts/v1/';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for coverage counts */
const mockCoverageCounts: CoverageCountsResponse = {
	covered: 8,
	expired: 0,
	uncovered: 93,
	unknown: 0,
};

/** The scenarios */
export const CoverageScenarios = [
	{
		scenarios: {
			HEAD: [
				{
					delay: 100,
					description: 'Coverage',
					response: {
						headers: new HttpHeaders({
							'X-API-RESULT-COUNT': '7',
						}),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}products/coverages?customerId=${customerId}&coverage=covered`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Coverage',
					response: {
						body: mockCoverageCounts,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}coverages/count?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
