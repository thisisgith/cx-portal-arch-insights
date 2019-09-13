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
		sessions: [],
	},
	{
		atxId: 'ATX2',
		title: 'Cisco DNA Center Project Plan Best Practices 1',
		description: 'This is a high-level look at the things you should consider as you’re planning your Cisco DNA Center project, including subjects such as prerequisites for network devices',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/atx/images/ATX-Center-Project-Plan-Best-Practices.png',
		status: 'scheduled',
		recordingURL: 'https://tklcs.cloudapps.cisco.com/tklcs/TKLDownloadServlet?nodeRef=workspace://SpacesStore/310232f0-0a44-4286-a374-71edb71835ee&activityId=2&fileId=123051',
		duration: 3600,
		bookmark: false,
		sessions: [],
	},
	{
		atxId: 'DNA3',
		title: 'Cisco DNA Center Project Plan Best Practices 2',
		description: 'This is a high-level look at the things you should consider as you’re planning your Cisco DNA Center project, including subjects such as prerequisites for network devices',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/atx/images/ATX-DNA-Center-Wireless-Assurance.png',
		status: 'recommended',
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
				scheduled: false,
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
				scheduled: false,
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
				scheduled: false,
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
				scheduled: false,
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
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Onboard-twoRecommended',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Onboard', 'twoRecommended'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Onboard-emptyRecordingUrl',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Onboard', 'emptyRecordingUrl'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Onboard-missingRecordingUrl',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Onboard', 'missingRecordingUrl'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Onboard-nullRecordingUrl',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Onboard', 'nullRecordingUrl'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Onboard-emptySessions',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Onboard', 'emptySessions'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Onboard-missingSessions',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Onboard', 'missingSessions'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Onboard-nullSessions',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Onboard', 'nullSessions'),
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?usecase=Campus Network Assurance&solution=IBN&pitstop=Onboard&customerId=${customerId}&suggestedAction=Get to know Cisco DNA Center`,
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
		url: `${api}?usecase=Campus Network Assurance&solution=IBN&pitstop=Implement&customerId=${customerId}&suggestedAction=Build your network & site hierarchy`,
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
		url: `${api}?usecase=Campus Network Assurance&solution=IBN&pitstop=Use&customerId=${customerId}&suggestedAction=Monitor Health of the Network`,
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
		url: `${api}?usecase=Campus Network Segmentation&solution=IBN&pitstop=Onboard&customerId=${customerId}&suggestedAction=Onboard 2`,
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
			`pitstop=Onboard&customerId=${customerId}&suggestedAction=Onboard 2`,
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
			`pitstop=Onboard&customerId=${customerId}&suggestedAction=Onboard 2`,
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
			`pitstop=Onboard&customerId=${customerId}&suggestedAction=Onboard 2`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Onboard-singleNoScheduled',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Onboard', 'singleNoScheduled'),
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?usecase=Campus Software Image Management&solution=IBN&` +
			`pitstop=Onboard&customerId=${customerId}&suggestedAction=Onboard 2`,
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
