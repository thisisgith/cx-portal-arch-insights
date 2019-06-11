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
					description: '(E-Learning) IBN-Wireless Assurance-Onboard',
					response: {
						body: MockELearning('ibn', 'Wireless Assurance', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Wireless Assurance&solution=IBN` +
			`&pitstop=Onboard&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 800,
					description: '(E-Learning) IBN-SD Access-Onboard',
					response: {
						body: MockELearning('IBN', 'SD Access', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=SD Access&solution=IBN&pitstop=Onboard&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
