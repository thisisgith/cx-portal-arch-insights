import { HttpHeaders } from '@angular/common/http';
/** Base of URL for SDP API */
const api = '/api/customerportal/inventory/v1/assets/hardware';

/** Default Customer ID */
const customerId = '2431199_0';

/** The scenarios */
export const HardwareTypeCountScenarios = [
	{
		scenarios: {
			HEAD: [
				{
					delay: 100,
					description: 'Hardware Type Chassis Count',
					response: {
						headers: new HttpHeaders({
							'X-API-RESULT-COUNT': '10',
						}),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance&solution=IBN&equipmentType=CHASSIS`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			HEAD: [
				{
					delay: 100,
					description: 'Hardware Type Module Count',
					response: {
						headers: new HttpHeaders({
							'X-API-RESULT-COUNT': '10',
						}),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance&solution=IBN&equipmentType=MODULE`,
		usecases: ['Use Case 1'],
	},
];
