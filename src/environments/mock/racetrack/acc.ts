// tslint:disable: completed-docs
import { ACCResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/acc';

/** Default Customer ID */
const customerId = '2431199';
/** Default acc ID */
const accId1 = '111111';
const accId2 = '222222';
const accId3 = '333333';
const accId4 = '444444';
const accId5 = '555555';
const accId6 = '666666';

/**
 * Mock
 * @param solution the solution we're at
 * @param usecase the use case
 * @param pitstop the pitstop
 * @param mockFileName the name of the corresponding json file to pull mock data from
 * @returns response
 */
function MockACC (
	solution: string, usecase: string, pitstop: string, mockFileName: string): ACCResponse {
	let items = [
		{
			accId: `${accId1}`,
			description: 'Discover the standard steps required to engineer and commission ' +
				'your appliance from an experienced Cisco DNA Center project manager. Understand ' +
				'basic deployment requirements and schedules',
			isFavorite: false,
			status: 'recommended',
			title: 'Cisco DNA Center Project Planning',
			url: 'https://gtcroutingops.cloudapps.cisco.com/RDMT/CSSRequest',
		},
		{
			accId: `${accId2}`,
			description: 'Gain actionable insights into Cisco DNA Center use case ' +
				'deployments and assists. Understand how to design, adopt, and leverage to ' +
				'save time and resources within your network',
			isFavorite: true,
			status: 'in-progress',
			title: 'Cisco DNA Pilot Usecase Deployment',
			url: 'https://gtcroutingops.cloudapps.cisco.com/RDMT/CSSRequest',
		},
		{
			accId: `${accId3}`,
			description: 'Experience this live coaching engagement on general Assurance ' +
				'concepts and features such as network, device, client, and application ' +
				'analytics. Help your team hit the ground running',
			isFavorite: false,
			status: 'in-progress',
			title: 'Cisco DNA Center Use Cases',
			url: 'https://gtcroutingops.cloudapps.cisco.com/RDMT/CSSRequest',
		},
		{
			accId: `${accId4}`,
			description: 'Experience this live coaching engagement on general Assurance ' +
				'concepts and features such as network, device, client, and application ' +
				'analytics. Help your team hit the ground running',
			isFavorite: false,
			status: 'completed',
			title: 'Cisco DNA Center Wireless Assurance Feature Planning',
			url: 'https://gtcroutingops.cloudapps.cisco.com/RDMT/CSSRequest',
		},
		{
			accId: `${accId6}`,
			description: 'Experience this live coaching engagement on general Assurance ' +
				'concepts and features such as network, device, client, and application ' +
				'analytics. Help your team hit the ground running',
			isFavorite: false,
			status: 'requested',
			title: 'Cisco Software-Defined Access Transition Planning',
			url: 'https://gtcroutingops.cloudapps.cisco.com/RDMT/CSSRequest',
		},
		{ },
	];

	if (pitstop.toLowerCase() === 'adopt') {
		items = [
			{
				accId: `${accId5}`,
				description: 'This is a title for Adoption',
				isFavorite: false,
				status: 'completed',
				title: 'This is a title for Adoption',
				url: 'https://gtcroutingops.cloudapps.cisco.com/RDMT/CSSRequest',
			},
		];
	}

	if (mockFileName !== '') {
		items = require(`./accMockData/${mockFileName}.json`);
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
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-Wireless Assurance-Onboard',
					response: {
						body: MockACC('IBN', 'Wireless Assurance', 'Onboard', ''),
						status: 200,
					},
					selected: true,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-Wireless Assurance-Onboard-allButRecommended',
					response: {
						body: MockACC('IBN', 'Wireless Assurance', 'Onboard', 'allButRecommended'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-Wireless Assurance-Onboard-Empty',
					response: {
						body: { },
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-Wireless Assurance-Onboard-oneRecommended',
					response: {
						body: MockACC('IBN', 'Wireless Assurance', 'Onboard', 'oneRecommended'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-Wireless Assurance-Onboard-oneNonRecommended',
					response: {
						body: MockACC('IBN', 'Wireless Assurance', 'Onboard', 'oneNonRecommended'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-Wireless Assurance-Onboard-twoCompleted',
					response: {
						body: MockACC('IBN', 'Wireless Assurance', 'Onboard', 'twoCompleted'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-Wireless Assurance-Onboard-twoInProgress',
					response: {
						body: MockACC('IBN', 'Wireless Assurance', 'Onboard', 'twoInProgress'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-Wireless Assurance-Onboard-twoRequested',
					response: {
						body: MockACC('IBN', 'Wireless Assurance', 'Onboard', 'twoRequested'),
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?usecase=Wireless Assurance&` +
			`solution=IBN&pitstop=Onboard&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-SD Access-Onboard',
					response: {
						body: MockACC('IBN', 'SD Access', 'Onboard', ''),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=SD Access&solution=IBN&pitstop=Onboard&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-WirelessAssurance/SDAccess Bookmark1',
					response: {
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/${accId1}/bookmark`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-WirelessAssurance/SDAccess-Onboard Bookmark2',
					response: {
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/${accId2}/bookmark`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-WirelessAssurance/SDAccess-Onboard Bookmark3',
					response: {
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/${accId3}/bookmark`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-WirelessAssurance/SDAccess-Onboard Bookmark4',
					response: {
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/${accId4}/bookmark`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-WirelessAssurance/SDAccess-Onboard ACCRequestSubmit1',
					response: {
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/${accId1}/request`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-WirelessAssurance/SDAccess-Onboard Bookmark6',
					response: {
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/${accId6}/bookmark`,
		usecases: ['Use Case 1'],
	},
];
