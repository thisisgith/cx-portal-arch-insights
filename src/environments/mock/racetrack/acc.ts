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
					description: '(ACC) IBN-Assurance-Onboard',
					response: {
						body: MockACC('ibn', 'assurance', 'onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=assurance&solution=ibn&pitstop=onboard&customerId=${customerId}`,
	},
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: '(ACC) IBN-SD-Access-Adopt',
					response: {
						body: MockACC('ibn', 'sd-access', 'adopt'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=sd-access&solution=ibn&pitstop=adopt&customerId=${customerId}`,
	},
];
