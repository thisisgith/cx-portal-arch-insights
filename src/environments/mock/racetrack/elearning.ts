import { ELearningResponse } from '@sdp-api';

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
		type: 'E-Learning',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53991',
	},
	{
		description: 'Implementing Cisco Wireless Network Fundamentals (WIFUND) v2.0',
		duration: '18hr 0min',
		ranking: 0,
		rating: '4.5000',
		title: 'Catalyst 9800 Wireless Lan Controller Overview 2',
		type: 'E-Learning',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53992',
		percentagecompleted: 25,
	},
	{
		description: 'Interconnecting Cisco Networking Devices, Part 2 (ICND2) v3.0',
		duration: '40hr 0min',
		ranking: 1,
		rating: '4.5000',
		title: 'Configuring and Using Wireless Analytics in SDA',
		type: 'E-Learning',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53686',
		percentagecompleted: 50,
	},
	{
		description: 'Implementing Cisco IP Routing (ROUTE) v2.0',
		duration: '12hr 0min',
		ranking: 2,
		rating: '3.000',
		title: 'Implementing Cisco IP Routing (ROUTE) v2.0',
		type: 'E-Learning',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53691',
		percentagecompleted: 75,
	},
	{
		description: 'Implementing Cisco IP Switched Networks (SWITCH) v2.0',
		duration: '12hr 0min',
		ranking: 3,
		rating: '2.7000',
		title: 'Implementing Cisco IP Switched Networks (SWITCH) v2.0',
		type: 'E-Learning',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53671',
		percentagecompleted: 100,
	},
	{
		description: 'Troubleshooting and Maintaining Cisco IP Networks (TSHOOT) v2.0',
		duration: '40hr 0min',
		ranking: 4,
		rating: '4.1000',
		title: 'CCNA Wireless',
		type: 'Certification',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53686',
		percentagecompleted: 25,
	},
	{
		description: 'Troubleshooting and Maintaining Cisco IP Networks (TSHOOT) v2.0',
		duration: '40hr 0min',
		ranking: 4,
		rating: '4.1000',
		title: 'Cisco Training on Demand Courses 2',
		type: 'Certification',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53686',
		percentagecompleted: 50,
	},
	{
		description: 'Troubleshooting and Maintaining Cisco IP Networks (TSHOOT) v2.0',
		duration: '40hr 0min',
		ranking: 4,
		rating: '4.1000',
		title: 'Cisco Training on Demand Courses 3',
		type: 'Certification',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53686',
		percentagecompleted: 75,
	},
	{
		description: 'Troubleshooting and Maintaining Cisco IP Networks (TSHOOT) v2.0',
		duration: '40hr 0min',
		ranking: 4,
		rating: '4.1000',
		title: 'Cisco Training on Demand Courses 4',
		type: 'Certification',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53686',
		percentagecompleted: 100,
	},
	{
		description: 'Troubleshooting Cisco Wireless Enterprise Networks (WITSHOOT) v1.1',
		duration: '8hr 0min',
		ranking: 5,
		rating: '5.0000',
		title: 'CCNP Wireless',
		type: 'Videos',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53996',
		percentagecompleted: 25,
	},
	{
		description: 'Troubleshooting Cisco Wireless Enterprise Networks (WITSHOOT) v1.1',
		duration: '8hr 0min',
		ranking: 5,
		rating: '5.0000',
		title: 'Videos 2',
		type: 'Videos',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53996',
		percentagecompleted: 50,
	},
	{
		description: 'Troubleshooting Cisco Wireless Enterprise Networks (WITSHOOT) v1.1',
		duration: '8hr 0min',
		ranking: 5,
		rating: '5.0000',
		title: 'Videos 3',
		type: 'Videos',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53996',
		percentagecompleted: 75,
	},
	{
		description: 'Troubleshooting Cisco Wireless Enterprise Networks (WITSHOOT) v1.1',
		duration: '8hr 0min',
		ranking: 5,
		rating: '5.0000',
		title: 'Videos 4',
		type: 'Videos',
		url: 'https://pilot-digital-learning.cisco.com/cx/#/course/53996',
		percentagecompleted: 100,
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
	{
		cxlevel: 2,
		description: 'Configuring RIPng',
		docId: '61649IBNScalable_Access_Policy',
		duration: '40hr 0min',
		id: '61649IBNScalable_Access_Policy',
		percentagecompleted: 25,
		ranking: 8,
		rating: '4.0',
		title: 'Configuring RIPng',
		type: 'Remote Learning Lab',
		url: 'https://qa.cte.systems/cx/course/61649',
	},
	{
		cxlevel: 2,
		description: 'Configuring and Investigating Basic EIGRP',
		docId: '61650IBNScalable_Access_Policy',
		duration: '40hr 0min',
		id: '61650IBNScalable_Access_Policy',
		percentagecompleted: 50,
		ranking: 9,
		rating: '3.0',
		title: 'Configuring and Investigating Basic EIGRP',
		type: 'Remote Learning Lab',
		url: 'https://qa.cte.systems/cx/course/61650',
	},
	{
		cxlevel: 2,
		description: 'Building the EIGRP Topology Table',
		docId: '61651IBNScalable_Access_Policy',
		duration: '40hr 0min',
		id: '61651IBNScalable_Access_Policy',
		percentagecompleted: 75,
		ranking: 10,
		rating: '3.0',
		title: 'Building the EIGRP Topology Table',
		type: 'Remote Learning Lab',
		url: 'https://qa.cte.systems/cx/course/61651',
	},
	{
		cxlevel: 2,
		description: 'EIGRP Stub Routing',
		docId: '61652IBNScalable_Access_Policy',
		duration: '40hr 0min',
		id: '61652IBNScalable_Access_Policy',
		percentagecompleted: 75,
		ranking: 11,
		rating: '3.0',
		title: 'EIGRP Stub Routing',
		type: 'Remote Learning Lab',
		url: 'https://qa.cte.systems/cx/course/61652',
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
 * @param mockFileName the name of the corresponding json file to pull mock data from
 * @returns response
 */
function MockELearning (
	solution: string, usecase: string, pitstop: string, mockFileName?: string): ELearningResponse {
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

	if (mockFileName && mockFileName !== '') {
		response.items = require(`./elearningMockData/${mockFileName}.json`);
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
					delay: 58,
					description: '(E-Learning) IBN-Campus Network Assurance-Onboard',
					response: {
						body: MockELearning('IBN', 'Campus Network Assurance', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 58,
					description: '(E-Learning) IBN-Campus Network Assurance-Onboard-noProgress',
					response: {
						body: MockELearning('IBN', 'Campus Network Assurance', 'Onboard',
							'noProgress'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 58,
					description:
						'(E-Learning) IBN-Campus Network Assurance-Onboard-progress25Percent',
					response: {
						body: MockELearning('IBN', 'Campus Network Assurance', 'Onboard',
							'progress25Percent'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 58,
					description:
						'(E-Learning) IBN-Campus Network Assurance-Onboard-progress50Percent',
					response: {
						body: MockELearning('IBN', 'Campus Network Assurance', 'Onboard',
							'progress50Percent'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 58,
					description:
						'(E-Learning) IBN-Campus Network Assurance-Onboard-progress75Percent',
					response: {
						body: MockELearning('IBN', 'Campus Network Assurance', 'Onboard',
							'progress75Percent'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 58,
					description:
						'(E-Learning) IBN-Campus Network Assurance-Onboard-progress100Percent',
					response: {
						body: MockELearning('IBN', 'Campus Network Assurance', 'Onboard',
							'progress100Percent'),
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?usecase=Campus Network Assurance&solution=IBN` +
			`&pitstop=Onboard&customerId=${customerId}&suggestedAction=` +
			'Get to know Cisco DNA Center&rows=500',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 58,
					description: '(E-Learning) IBN-Campus Network Segmentation-Onboard',
					response: {
						body: MockELearning('IBN', 'Campus Network Segmentation', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Network Segmentation&solution=IBN&pitstop=Onboard` +
			`&customerId=${customerId}&suggestedAction=Onboard 2&rows=500`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 38,
					description: '(E-Learning) IBN-Scalable Access Policy-Onboard',
					response: {
						body: MockELearning('IBN', 'Scalable Access Policy', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Scalable Access Policy&solution=IBN&` +
			`pitstop=Onboard&customerId=${customerId}&suggestedAction=Onboard 2&rows=500`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 38,
					description: '(E-Learning) IBN-Network Device Onboarding-Onboard',
					response: {
						body: MockELearning('IBN', 'Network Device Onboarding', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Network Device Onboarding&solution=IBN&` +
			`pitstop=Onboard&customerId=${customerId}&suggestedAction=Onboard 2&rows=500`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 38,
					description: '(E-Learning) IBN-Campus Software Image Management-Onboard',
					response: {
						body: MockELearning('IBN', 'Campus Software Image Management', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Software Image Management&solution=IBN&` +
			`pitstop=Onboard&customerId=${customerId}&suggestedAction=Onboard 2&rows=500`,
		usecases: ['Use Case 1'],
	},
];
