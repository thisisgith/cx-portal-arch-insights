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
			title: 'Lifecycle',
			url: 'https://community.cisco.com/t5/technology-and-support/ct-p/technology-support',
		},
		{
			title: 'Public',
			url: 'https://community.cisco.com/t5/technology-and-support/ct-p/technology-support',
		},
		{
			title: 'Partner',
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
					description: '(Communities) IBN-Assurance-Onboard',
					response: {
						body: MockCommunities('ibn', 'assurance', 'onboard'),
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
					delay: 750,
					description: '(Communities) IBN-SD-Access-Adopt',
					response: {
						body: MockCommunities('ibn', 'sd-access', 'adopt'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=sd-access&solution=ibn&pitstop=adopt&customerId=${customerId}`,
	},
];
