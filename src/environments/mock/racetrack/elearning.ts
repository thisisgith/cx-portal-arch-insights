import { ELearningResponse } from '@cui-x/sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/elearning';

/** Default Customer ID */
const customerId = '2431199';

/**
 * Onboard Learning
 */
const onboardItems = [
	{
		title: 'Catalyst 9800 Wireless Lan Controller Overview',
		type: 'elearning',
	},
	{
		title: 'Configuring and Using Wireless Analytics in SDA',
		type: 'elearning',
	},
	{
		title: 'Monitoring Against Wireless Attacks and Ensuring Compliance',
		type: 'elearning',
	},
	{
		title: 'Using CMX to Evaluate Wireless Network Operation and Troubleshooting',
		type: 'elearning',
	},
	{
		title: 'CCNA Wireless',
		type: 'certifications',
	},
	{
		title: 'CCNP Wireless',
		type: 'certifications',
	},
	{
		title: 'Cisco Digital Network Architecture Implementation Essentials (DNAIE) v2.0',
		type: 'training',
	},
];

/**
 * Adoption Learning
 */
const adoptItems = [
	{
		title: 'Lan Overview',
		type: 'elearning',
	},
	{
		title: 'Stuff we can Configure',
		type: 'elearning',
	},
	{
		title: 'tracerT Learning',
		type: 'elearning',
	},
];

/**
 * Mock
 * @param solution the solution we're at
 * @param usecase the use case
 * @param pitstop the pitstop
 * @returns response
 */
function MockELearning (
	solution: string, usecase: string, pitstop: string): ELearningResponse {
	const response = {
		pitstop,
		solution,
		usecase,
		items: [],
	};

	if (pitstop.toLowerCase() === 'adopt') {
		response.items = adoptItems;
	} else {
		response.items = onboardItems;
	}

	return response;
}

/**
 * The scenarios
 */
export const ELearningScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 800,
					description: '(E-Learning) IBN-Assurance-Onboard',
					response: {
						body: MockELearning('ibn', 'assurance', 'onboard'),
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
					delay: 800,
					description: '(E-Learning) IBN-SD-Access-Adopt',
					response: {
						body: MockELearning('ibn', 'sd-access', 'Adopt'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=sd-access&solution=ibn&pitstop=adopt&customerId=${customerId}`,
	},
];