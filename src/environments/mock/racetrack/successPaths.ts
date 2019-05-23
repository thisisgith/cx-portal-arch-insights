import { SuccessPathsResponse } from '@cui-x/sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/successPaths';

/** Default Customer ID */
const customerId = '2431199';

/**
 * Mock
 * @param solution the solution we're at
 * @param usecase the use case
 * @param pitstop the pitstop
 * @returns response
 */
function MockSP (
	solution: string, usecase: string, pitstop: string): SuccessPathsResponse {
	return {
		pitstop,
		solution,
		usecase,
		items: [
			{
				title: 'Meraki S350 Family Datasheet',
			},
			{
				title: 'Network Patch Requirements for Cisco DNA applicances',
			},
		],
	};
}

/**
 * The scenarios
 */
export const SuccessPathScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: '(SP) IBN-Assurance-Onboard',
					response: {
						body: MockSP('ibn', 'assurance', 'onboard'),
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
					description: '(SP) IBN-SD-Access-Adopt',
					response: {
						body: MockSP('ibn', 'sd-access', 'adopt'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=sd-access&solution=ibn&pitstop=adopt&customerId=${customerId}`,
	},
];
