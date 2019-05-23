/* tslint:disable max-line-length ter-max-len */

import {
	ATXResponse,
} from '@cui-x/sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/atx';

/** Default Customer ID */
const customerId = '2431199';

/** Onboard ATX */
const onboardItems = [
	{
		attendeeLink: '',
		description: 'During this session, you will get a deep-dive look at wireless assurance, with a focus on troubleshooting. You also will learn how to use Wireless Client 360 to view device and client connectivity, as well as how to use wireless health metrics, configure wireless sensors, and use sensor tests.',
		duration: '01:15:00',
		moderator: 'Romeo Mazzaluna',
		panelistLink: '',
		registrationUrl: '',
		sessions: [
			{
				date: '2019-03-13',
				time: '7:00 AM PST',
			},
		],
		title: 'Cisco DNA Center Getting started',
		viewOnDemandUrl: '',
	},
	{
		attendeeLink: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=eaf5d9a3c5ad34fc1c9a3e50568439563',
		description: 'During this session, you will get a deep-dive look at wireless assurance, with a focus on troubleshooting. You also will learn how to use Wireless Client 360 to view device and client connectivity, as well as how to use wireless health metrics, configure wireless sensors, and use sensor tests.',
		duration: '01:15:00',
		moderator: 'Romeo Mazzaluna',
		panelistLink: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=eadbe1210193b00b085825344d53f4631',
		registrationUrl: '',
		sessions: [
			{
				date: '2019-06-24',
				time: '7:00 AM PST',
			},
		],
		title: 'Cisco DNA Project Plan Best Practices',
		viewOnDemandUrl: '',
	},
	{
		attendeeLink: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=e87603adbd28cac08fe8abef0ad4f1d3b',
		description: 'During this session, you will get a deep-dive look at wireless assurance, with a focus on troubleshooting. You also will learn how to use Wireless Client 360 to view device and client connectivity, as well as how to use wireless health metrics, configure wireless sensors, and use sensor tests.',
		duration: '01:15:00',
		moderator: 'Romeo Mazzaluna',
		panelistLink: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=e14e84f767a1ee65dbf94bcbfb3a0845a',
		registrationUrl: '',
		sessions: [
			{
				date: '2019-07-31',
				time: '7:00 AM PST',
			},
		],
		title: 'Cisco APIC-EM Infrastructure Transition Best Practices',
		viewOnDemandUrl: '',
	},
	{
		attendeeLink: '',
		description: 'During this session, you will get a deep-dive look at wireless assurance, with a focus on troubleshooting. You also will learn how to use Wireless Client 360 to view device and client connectivity, as well as how to use wireless health metrics, configure wireless sensors, and use sensor tests.',
		duration: '01:15:00',
		moderator: 'Romeo Mazzaluna',
		panelistLink: '',
		registrationUrl: '',
		sessions: [
			{
				date: '2019-02-27',
				time: '7:00 AM PST',
			},
		],
		title: 'Some other Session title',
		viewOnDemandUrl: '',
	},
	{
		attendeeLink: '',
		description: 'During this session, you will get a deep-dive look at wireless assurance, with a focus on troubleshooting. You also will learn how to use Wireless Client 360 to view device and client connectivity, as well as how to use wireless health metrics, configure wireless sensors, and use sensor tests.',
		duration: '01:15:00',
		moderator: 'Romeo Mazzaluna',
		panelistLink: '',
		registrationUrl: '',
		sessions: [
			{
				date: '2019-04-15',
				time: '7:00 AM PST',
			},
		],
		title: 'Some other Session title',
		viewOnDemandUrl: '',
	},
	{
		attendeeLink: '',
		description: 'During this session, you will get a deep-dive look at wireless assurance, with a focus on troubleshooting. You also will learn how to use Wireless Client 360 to view device and client connectivity, as well as how to use wireless health metrics, configure wireless sensors, and use sensor tests.',
		duration: '01:15:00',
		moderator: 'Romeo Mazzaluna',
		panelistLink: '',
		registrationUrl: '',
		sessions: [
			{
				date: '2019-04-29',
				time: '7:00 AM PST',
			},
		],
		title: 'Some other Session title',
		viewOnDemandUrl: '',
	},
	{
		attendeeLink: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=e37fe9173068f6e3dc60b262e6e73f743',
		description: 'This is a high-level look at the things you should consider as you’re planning your Cisco DNA Center project, including subjects such as prerequisites for network devices, scale considerations, cloud connectivity, and the best conditions for setup.',
		duration: '01:15:00',
		moderator: 'Romeo Mazzaluna',
		panelistLink: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=e32413dc94292e5a4850148d35f92e9cf',
		registrationUrl: '',
		sessions: [
			{
				date: '2019-06-19',
				time: '7:00 AM PST',
			},
		],
		title: 'Some other Session title',
		viewOnDemandUrl: '',
	},
	{
		attendeeLink: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=ef7077af8feecd236e9ffd7695e00b856',
		description: 'During this session, you will get a deep-dive look at wireless assurance, with a focus on troubleshooting. You also will learn how to use Wireless Client 360 to view device and client connectivity, as well as how to use wireless health metrics, configure wireless sensors, and use sensor tests.',
		duration: '01:15:00',
		moderator: 'Romeo Mazzaluna',
		panelistLink: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=ef149fc7c21237c4d583e592ccdde042c',
		registrationUrl: '',
		sessions: [
			{
				date: '2019-06-26',
				time: '7:00 AM PST',
			},
		],
		title: 'Some other Session title',
		viewOnDemandUrl: '',
	},
	{
		attendeeLink: '',
		description: 'This is a high-level look at the things you should consider as you’re planning your Cisco DNA Center project, including subjects such as prerequisites for network devices, scale considerations, cloud connectivity, and the best conditions for setup.',
		duration: '01:15:00',
		moderator: 'Romeo Mazzaluna',
		panelistLink: '',
		registrationUrl: '',
		sessions: [
			{
				date: '2018-12-06',
				time: '7:00 AM PST',
			},
		],
		title: 'Some other Session title',
		viewOnDemandUrl: '',
	},
];

/** Items for Adoption Scenario */
const adoptItems = [
	{
		attendeeLink: '',
		description: 'Lorem Ipsum',
		duration: '99:99:99',
		moderator: 'Romeo Mazzaluna',
		panelistLink: '',
		registrationUrl: '',
		sessions: [
			{
				date: '2018-12-06',
				time: '7:00 AM PST',
			},
		],
		title: 'A Different Session Title',
		viewOnDemandUrl: '',
	},
	{
		attendeeLink: '',
		description: 'Lorem Ipsum',
		duration: '99:99:99',
		moderator: 'Romeo Mazzaluna',
		panelistLink: '',
		registrationUrl: '',
		sessions: [
			{
				date: '2018-12-06',
				time: '7:00 AM PST',
			},
		],
		title: 'A Different Session Title',
		viewOnDemandUrl: '',
	},
	{
		attendeeLink: '',
		description: 'Lorem Ipsum',
		duration: '99:99:99',
		moderator: 'Romeo Mazzaluna',
		panelistLink: '',
		registrationUrl: '',
		sessions: [
			{
				date: '2018-12-06',
				time: '7:00 AM PST',
			},
		],
		title: 'A Different Session Title',
		viewOnDemandUrl: '',
	},
];

/**
 * Mock ATX Response
 * @param solution the solution we're at
 * @param usecase the use case
 * @param pitstop the pitstop
 * @returns the ATXResponse
 */
function MockATX (solution: string, usecase: string, pitstop: string): ATXResponse {
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
export const ATXScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 1200,
					description: '(ATX) IBN-Assurance-Onboard',
					response: {
						body: MockATX('ibn', 'assurance', 'onboard'),
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
					delay: 600,
					description: '(ATX) IBN-Assurance-Implement',
					response: {
						body: MockATX('ibn', 'assurance', 'implement'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=assurance&solution=ibn&pitstop=implement&customerId=${customerId}`,
	},
	{
		scenarios: {
			GET: [
				{
					delay: 600,
					description: '(ATX) IBN-SD-Access-Adopt',
					response: {
						body: MockATX('ibn', 'sd-access', 'Adopt'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=sd-access&solution=ibn&pitstop=adopt&customerId=${customerId}`,
	},
];
