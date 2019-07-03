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
				{
					delay: 100,
					description: 'Coverage - Empty Body',
					response: {
						body: { },
						status: 200,
					},
					selected: false,
				},
				{
					delay: 100,
					description: 'Coverage - Invalid Body',
					response: {
						body: { covered: true },
						status: 200,
					},
					selected: false,
				},
				{
					delay: 500,
					description: 'Coverage 500 Failure',
					response: {
						status: 500,
						statusText: 'Internal Server Error',
					},
					selected: false,
				},
				{
					delay: 500,
					description: 'Coverage < 1%',
					response: {
						body: {
							covered: 8,
							expired: 0,
							uncovered: 3,
							unknown: 8915,
						},
					},
					selected: false,
				},
			],
		},
		url: `${api}coverages/count?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
