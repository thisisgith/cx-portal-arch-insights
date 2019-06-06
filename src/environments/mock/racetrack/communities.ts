import { CommunitiesResponse } from '@cui-x/sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/communities';

/** Default Customer ID */
const customerId = '2431199';

/**
 * Mock
 * @param solution the solution we're at
 * @param usecase the use case
 * @param pitstop the pitstop
 * @returns response
 */
function MockCommunities (
	solution: string, usecase: string, pitstop: string): CommunitiesResponse {

	let items = [
		{
			description: 'Avoid common pitfalls with how-tos and step-by-step videos ' +
			'that cruise you through installation of your new appliance from start to finish',
			title: 'Lifecycle',
			url: 'https://community.cisco.com/t5/technology-and-support/ct-p/technology-support',
		},
		{
			description: 'Avoid common pitfalls with how-tos and step-by-step videos ' +
			'that cruise you through installation of your new appliance from start to finish',
			title: 'Public',
			url: 'https://community.cisco.com/t5/technology-and-support/ct-p/technology-support',
		},
	];

	if (pitstop.toLowerCase() === 'adopt') {
		items = [items[0]];
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
export const CommunitiesScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 750,
					description: '(Communities) IBN-Wireless Assurance-Onboard',
					response: {
						body: MockCommunities('IBN', 'Wireless Assurance', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Wireless Assurance&solution=IBN` +
			`&pitstop=Onboard&customerId=${customerId}`,
	},
	{
		scenarios: {
			GET: [
				{
					delay: 750,
					description: '(Communities) IBN-SD Access-Onboard',
					response: {
						body: MockCommunities('IBN', 'SD Access', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=SD Access&solution=IBN&pitstop=Onboard&customerId=${customerId}`,
	},
];
