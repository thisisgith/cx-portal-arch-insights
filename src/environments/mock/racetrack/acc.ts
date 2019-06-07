import { ACCResponse } from '@cui-x/sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/acc';

/** Default Customer ID */
const customerId = '2431199';

/**
 * Mock
 * @param solution the solution we're at
 * @param usecase the use case
 * @param pitstop the pitstop
 * @returns response
 */
function MockACC (
	solution: string, usecase: string, pitstop: string): ACCResponse {
	let items = [
		{
			description: 'Lorem Ipsum',
			title: 'Cisco DNA Center Project Best Practices',
		},
		{
			description: 'Lorem Ipsum',
			title: 'Cisco DNA Center Feature Planning',
		},
	];

	if (pitstop.toLowerCase() === 'adopt') {
		items = [
			{
				description: 'Lorem Ipsum',
				title: 'This is a title for Adoption',
			},
		];
	}

	return {
		items,
		pitstop,
		solution,
		usecase,
	};
}

/**
 * The scenarios
 */
export const ACCScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: '(ACC) IBN-Wireless Assurance-Onboard',
					response: {
						body: MockACC('IBN', 'Wireless Assurance', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Wireless Assurance&` +
			`solution=IBN&pitstop=Onboard&customerId=${customerId}`,
		usecases: ['ACC'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: '(ACC) IBN-SD Access-Onboard',
					response: {
						body: MockACC('IBN', 'SD Access', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=SD Access&solution=IBN&pitstop=Onboard&customerId=${customerId}`,
		usecases: ['ACC'],
	},
];
