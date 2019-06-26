import { HttpHeaders } from '@angular/common/http';

/** Base of URL for SDP API */
const api = '/api/customerportal/contracts/v1/products/coverages';

/** Default Customer ID */
const customerId = '2431199';

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
		url: `${api}?customerId=${customerId}&coverage=covered`,
		usecases: ['Use Case 1'],
	},
];
