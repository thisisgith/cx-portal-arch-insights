/* tslint:disable max-line-length ter-max-len */

import {
	ATXResponseModel,
} from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/atx';

/** Default Customer ID */
const customerId = '2431199';

/** Onboard ATX */
const onboardItems = [
	{
		atxId: 'ATX1',
		title: 'Cisco DNA Center Getting Started',
		description: 'We cover subjects including interface and network design overview, policy \nmanagement and deployment, device provisioning, and automation/assurance.',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/atx/images/ATX-DNA-Getting-Started.png',
		status: 'scheduled',
		recordingURL: 'https://tklcs.cloudapps.cisco.com/tklcs/TKLDownloadServlet?nodeRef=workspace://SpacesStore/2ccb9372-82dc-4700-afc7-0a4ed0630685&activityId=2&fileId=123052',
		duration: 4500,
		bookmark: true,
		sessions: [
			{
				sessionId: 'Session1',
				sessionStartDate: 1565127052000,
				scheduled: false,
				presenterName: 'John Doe',
				registrationURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=ec89a0c8c89abb903864c873b2a71ece2',
			},
			{
				sessionId: 'Session2',
				sessionStartDate: 1565082000000,
				scheduled: true,
				presenterName: 'Jakub Horbacewicz',
				registrationURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=ee54d58c50a23de754bd0616b5a21e9f1',
			},
			{
				sessionId: 'Session3',
				sessionStartDate: 1565060400000,
				scheduled: false,
				presenterName: 'Dheebshiba “D.B.” Dinakaran',
				registrationURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=e1543c7456f4a94a5f770842e5ca728b0',
			},
			{
				sessionId: 'Session4',
				sessionStartDate: 1566486000000,
				scheduled: false,
				presenterName: 'Mike Brown',
				registrationURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=e3b7dd5d97c4e380413e566793fd199a0',
			},
			{
				sessionId: 'Session5',
				sessionStartDate: 1566464400000,
				scheduled: false,
				presenterName: 'Jakub Horbacewicz',
				registrationURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=ec0bddbdce411e15f41eb5d991eb1d4b6',
			},
			{
				sessionId: 'Session6',
				sessionStartDate: 1566442800000,
				scheduled: false,
				presenterName: 'Dheebshiba “D.B.” Dinakaran',
				registrationURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=eeb86d0ab10129d5f1ac30e416ffd5af7',
			},
		],
	},
	{
		atxId: 'ATX2',
		title: 'Cisco DNA Center Project Plan Best Practices 1',
		description: 'This is a high-level look at the things you should consider as you’re planning your Cisco DNA Center project, including subjects such as prerequisites for network devices',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/atx/images/ATX-Center-Project-Plan-Best-Practices.png',
		status: 'completed',
		recordingURL: 'https://tklcs.cloudapps.cisco.com/tklcs/TKLDownloadServlet?nodeRef=workspace://SpacesStore/310232f0-0a44-4286-a374-71edb71835ee&activityId=2&fileId=123051',
		duration: 3600,
		bookmark: false,
		sessions: [
			{
				sessionId: 'Session7',
				sessionStartDate: 1565190000000,
				presenterName: 'Billy Manashi',
				scheduled: false,
				registrationURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=edfcb532bb594518ca707aa19c3a55feb',
			},
			{
				sessionId: 'Session8',
				sessionStartDate: 1565168400000,
				presenterName: 'Angelique de Vos',
				scheduled: false,
				attendeeURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=e823bc2471db63055c6d001a5e4212435',
			},
			{
				sessionId: 'Session9',
				sessionStartDate: 1565146800000,
				presenterName: 'Induraj Nadarajan',
				scheduled: false,
				attendeeURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=efe04ab188b9e982b765c0f6f7fc6616e',
			},
			{
				sessionId: 'Session10',
				sessionStartDate: 1567004400000,
				presenterName: 'Billy Manashi',
				scheduled: false,
				attendeeURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=ec1974e4f4fb728e3515b3ae70fa49bd7',
			},
			{
				sessionId: 'Session11',
				sessionStartDate: 1566982800000,
				presenterName: 'Angelique de Vos',
				scheduled: false,
				attendeeURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=e72cdaec14f278787116bab2eff9fc8e9',
			},
			{
				sessionId: 'Session12',
				sessionStartDate: 1566961200000,
				presenterName: 'Induraj Nadarajan',
				scheduled: false,
				attendeeURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=e322a6bd38bc72e8d34057240ebd0be7e',
			},
		],
	},
	{
		atxId: 'DNA3',
		title: 'Cisco DNA Center Project Plan Best Practices 2',
		description: 'This is a high-level look at the things you should consider as you’re planning your Cisco DNA Center project, including subjects such as prerequisites for network devices',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/atx/images/ATX-DNA-Center-Wireless-Assurance.png',
		status: 'in-progress',
		recordingURL: 'https://tklcs.cloudapps.cisco.com/tklcs/TKLDownloadServlet?nodeRef=workspace://SpacesStore/310232f0-0a44-4286-a374-71edb71835ee&activityId=2&fileId=123051',
		duration: 3600,
		bookmark: false,
		sessions: [
			{
				sessionId: 'Session13',
				sessionStartDate: 1565200000000,
				presenterName: 'Billy Manashi',
				scheduled: false,
				registrationURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=edfcb532bb594518ca707aa19c3a55feb',
			},
		],
	},
	{
		atxId: 'DNA4',
		title: 'Cisco DNA Center Project Plan Best Practices 3',
		description: 'This is a high-level look at the things you should consider as you’re planning your Cisco DNA Center project, including subjects such as prerequisites for network devices',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/atx/images/ATX-DNA-Center-Feature-Overview.png',
		status: 'requested',
		recordingURL: 'https://tklcs.cloudapps.cisco.com/tklcs/TKLDownloadServlet?nodeRef=workspace://SpacesStore/310232f0-0a44-4286-a374-71edb71835ee&activityId=2&fileId=123051',
		duration: 3600,
		bookmark: false,
		sessions: [
			{
				sessionId: 'Session14',
				sessionStartDate: 1565210000000,
				presenterName: 'Billy Manashi',
				scheduled: false,
				registrationURL: 'https://cisco.webex.com/cisco/onstage/g.php?MTID=edfcb532bb594518ca707aa19c3a55feb',
			},
		],
	},
];

/** Implement ATX */
const implementItems = [
	{
		atxId: 'ATX-01',
		title: 'Cisco DNA Center Project Planning',
		description: 'This is a high-level look at the things you should consider as you’re planning your Cisco DNA Center project, including subjects such as prerequisites for network devices',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/acc/images/acc_access-infra-readiness.png',
		status: 'in-progress',
		recordingURL: 'https://tklcs.cloudapps.cisco.com/tklcs/TKLDownloadServlet?nodeRef=workspace://SpacesStore/2ccb9372-82dc-4700-afc7-0a4ed0630685&activityId=2&fileId=123052',
		duration: 2323423,
		bookmark: true,
		sessions: [
			{
				sessionId: 'Session1',
				sessionStartDate: 1565127052000,
				presenterName: 'John Doe',
				registrationURL: 'https://www.cisco.com/register',
			},
		],
	},
	{
		atxId: 'ATX-02',
		title: 'Cisco DNA Install Appliance',
		description: 'We cover subjects including interface and network design overview, policy \nmanagement and deployment, device provisioning, and automation/assurance.',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/acc/images/acc_deployment-best-practices.png',
		status: 'completed',
		recordingURL: 'https://tklcs.cloudapps.cisco.com/tklcs/TKLDownloadServlet?nodeRef=workspace://SpacesStore/2ccb9372-82dc-4700-afc7-0a4ed0630685&activityId=2&fileId=123052',
		duration: 3600,
		bookmark: true,
		sessions: [
			{
				sessionId: 'Session2',
				sessionStartDate: 1565127052000,
				presenterName: 'John Doe',
				registrationURL: 'https://www.cisco.com/register',
			},
		],
	},
];

/** Use ATX */
const useItems = [
	{
		atxId: 'ATX-01',
		title: 'Cisco DNA Center Project Planning',
		description: 'This is a high-level look at the things you should consider as you’re planning your Cisco DNA Center project, including subjects such as prerequisites for network devices',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/acc/images/acc_access-infra-readiness.png',
		status: 'in-progress',
		recordingURL: 'https://tklcs.cloudapps.cisco.com/tklcs/TKLDownloadServlet?nodeRef=workspace://SpacesStore/2ccb9372-82dc-4700-afc7-0a4ed0630685&activityId=2&fileId=123052',
		duration: 2323423,
		bookmark: true,
		sessions: [
			{
				sessionId: 'Session1',
				sessionStartDate: 1565127052000,
				presenterName: 'John Doe',
				registrationURL: 'https://www.cisco.com/register',
			},
		],
	},
	{
		atxId: 'ATX-02',
		title: 'Cisco DNA Install Appliance',
		description: 'We cover subjects including interface and network design overview, policy \nmanagement and deployment, device provisioning, and automation/assurance.',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/acc/images/acc_deployment-best-practices.png',
		status: 'completed',
		recordingURL: 'https://tklcs.cloudapps.cisco.com/tklcs/TKLDownloadServlet?nodeRef=workspace://SpacesStore/2ccb9372-82dc-4700-afc7-0a4ed0630685&activityId=2&fileId=123052',
		duration: 3600,
		bookmark: true,
		sessions: [
			{
				sessionId: 'Session2',
				sessionStartDate: 1565127052000,
				presenterName: 'John Doe',
				registrationURL: 'https://www.cisco.com/register',
			},
		],
	},
];
/**
 * Mock ATX Response
 * @param solution the solution we're at
 * @param usecase the use case
 * @param pitstop the pitstop
 * @param mockFileName the name of the corresponding json file to pull mock data from
 * @returns the ATXResponse
 */
function MockATX (solution: string, usecase: string, pitstop: string, mockFileName?: string): ATXResponseModel {
	const response = {
		pitstop,
		solution,
		usecase,
		items: [],
	};

	if (pitstop.toLowerCase() === 'implement') {
		response.items = implementItems;
	} else if (pitstop.toLowerCase() === 'use') {
		response.items = useItems;
	} else {
		response.items = onboardItems;
	}

	if (mockFileName && mockFileName !== '') {
		response.items = require(`./atxMockData/${mockFileName}.json`);
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
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Onboard',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Implement',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Implement'),
						status: 200,
					},
					selected: true,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Use',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Use'),
						status: 200,
					},
					selected: true,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Onboard-singleNoScheduled',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Onboard', 'singleNoScheduled'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Onboard-twoCompleted',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Onboard', 'twoCompleted'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Onboard-twoScheduled',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Onboard', 'twoScheduled'),
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?usecase=Campus Network Assurance&solution=IBN&pitstop=Onboard&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Implement',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Implement'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Network Assurance&solution=IBN&pitstop=Implement&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Use',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Use'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Network Assurance&solution=IBN&pitstop=Use&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Segmentation-Onboard',
					response: {
						body: MockATX('IBN', 'Campus Network Segmentation', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Network Segmentation&solution=IBN&pitstop=Onboard&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ATX) IBN-Scalable Access Policy-Onboard',
					response: {
						body: MockATX('IBN', 'Scalable Access Policy', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Scalable Access Policy&solution=IBN&` +
			`pitstop=Onboard&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ATX) IBN-Network Device Onboarding-Onboard',
					response: {
						body: MockATX('IBN', 'Network Device Onboarding', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Network Device Onboarding&solution=IBN&` +
			`pitstop=Onboard&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ATX) IBN-Campus Software Image Management-Onboard',
					response: {
						body: MockATX('IBN', 'Campus Software Image Management', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Software Image Management&solution=IBN&` +
			`pitstop=Onboard&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];

/**
 * The scenarios
 */
export const CancelATXScenarios = [
	{
		scenarios: {
			DELETE: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ATX) IBN-Cancel ATX Session1',
					response: {
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/registration?sessionId=Session1&atxId=ATX1`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			DELETE: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ATX) IBN-Cancel ATX Session2',
					response: {
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/registration?sessionId=Session2&atxId=ATX1`,
		usecases: ['Use Case 1'],
	},
];
