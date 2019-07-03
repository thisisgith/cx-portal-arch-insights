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
		description: 'Implementing Cisco Wireless Network Fundamentals (WIFUND) v1.0',
		duration: '18hr 0min',
		ranking: 0,
		rating: '4.5000',
		title: 'Catalyst 9800 Wireless Lan Controller Overview',
		type: 'E-Courses',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53991',
	},
	{
		description: 'Interconnecting Cisco Networking Devices, Part 2 (ICND2) v3.0',
		duration: '40hr 0min',
		ranking: 1,
		rating: '4.5000',
		title: 'Configuring and Using Wireless Analytics in SDA',
		type: 'E-Courses',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53686',
	},
	{
		description: 'Implementing Cisco IP Routing (ROUTE) v2.0',
		duration: '12hr 0min',
		ranking: 2,
		rating: '3.000',
		title: 'Implementing Cisco IP Routing (ROUTE) v2.0',
		type: 'E-Courses',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53691',
	},
	{
		description: 'Implementing Cisco IP Switched Networks (SWITCH) v2.0',
		duration: '12hr 0min',
		ranking: 3,
		rating: '2.7000',
		title: 'Implementing Cisco IP Switched Networks (SWITCH) v2.0',
		type: 'E-Courses',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53671',
	},
	{
		description: 'Troubleshooting and Maintaining Cisco IP Networks (TSHOOT) v2.0',
		duration: '40hr 0min',
		ranking: 4,
		rating: '4.1000',
		title: 'CCNA Wireless',
		type: 'Cisco Training on Demand Courses',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53686',
	},
	{
		description: 'Troubleshooting and Maintaining Cisco IP Networks (TSHOOT) v2.0',
		duration: '40hr 0min',
		ranking: 4,
		rating: '4.1000',
		title: 'Cisco Training on Demand Courses 2',
		type: 'Cisco Training on Demand Courses',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53686',
	},
	{
		description: 'Troubleshooting and Maintaining Cisco IP Networks (TSHOOT) v2.0',
		duration: '40hr 0min',
		ranking: 4,
		rating: '4.1000',
		title: 'Cisco Training on Demand Courses 3',
		type: 'Cisco Training on Demand Courses',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53686',
	},
	{
		description: 'Troubleshooting and Maintaining Cisco IP Networks (TSHOOT) v2.0',
		duration: '40hr 0min',
		ranking: 4,
		rating: '4.1000',
		title: 'Cisco Training on Demand Courses 4',
		type: 'Cisco Training on Demand Courses',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53686',
	},
	{
		description: 'Troubleshooting Cisco Wireless Enterprise Networks (WITSHOOT) v1.1',
		duration: '8hr 0min',
		ranking: 5,
		rating: '5.0000',
		title: 'CCNP Wireless',
		type: 'Videos',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53996',
	},
	{
		description: 'Troubleshooting Cisco Wireless Enterprise Networks (WITSHOOT) v1.1',
		duration: '8hr 0min',
		ranking: 5,
		rating: '5.0000',
		title: 'Videos 2',
		type: 'Videos',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53996',
	},
	{
		description: 'Troubleshooting Cisco Wireless Enterprise Networks (WITSHOOT) v1.1',
		duration: '8hr 0min',
		ranking: 5,
		rating: '5.0000',
		title: 'Videos 3',
		type: 'Videos',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53996',
	},
	{
		description: 'Troubleshooting Cisco Wireless Enterprise Networks (WITSHOOT) v1.1',
		duration: '8hr 0min',
		ranking: 5,
		rating: '5.0000',
		title: 'Videos 4',
		type: 'Videos',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53996',
	},
	{
		title: 'Designing Cisco Wireless Enterprise Networks',
		type: 'training',
	},
	{
		title: 'Deploying Cisco Wireless Enterprise Networks',
		type: 'training',
	},
	{
		title: 'training 3',
		type: 'training',
	},
	{
		title: 'training 4',
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
					delay: Math.floor(Math.random() * 2000) + 800,
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
			`&pitstop=Onboard&customerId=${customerId}&rows=100`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 800,
					description: '(E-Learning) IBN-SD Access-Onboard',
					response: {
						body: MockELearning('IBN', 'SD Access', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=SD Access&solution=IBN&pitstop=Onboard` +
			`&customerId=${customerId}&rows=100`,
		usecases: ['Use Case 1'],
	},
];
