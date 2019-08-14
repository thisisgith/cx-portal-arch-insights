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
		atxId: 'ATX-01',
		title: 'Cisco DNA Center Project Planning',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/atx/images/ATX-DNA-Getting-Started.png',
		status: 'in-progress',
		recordingURL: 'https://tklcs.cloudapps.cisco.com/tklcs/TKLDownloadServlet?nodeRef=workspace://SpacesStore/2ccb9372-82dc-4700-afc7-0a4ed0630685&activityId=2&fileId=123052',
		duration: 2323423,
		bookmark: false,
		sessions: [
			{
				sessionStartDate: 1565127052000,
				presenterName: 'John Doe',
				registrationURL: 'https://www.cisco.com/register',
			},
		],
	},
	{
		atxId: 'ATX-02',
		title: 'Cisco DNA Install Appliance',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/acc/images/acc_access-infra-readiness.png',
		status: 'completed',
		recordingURL: 'https://tklcs.cloudapps.cisco.com/tklcs/TKLDownloadServlet?nodeRef=workspace://SpacesStore/2ccb9372-82dc-4700-afc7-0a4ed0630685&activityId=2&fileId=123052',
		duration: 3600,
		bookmark: true,
		sessions: [
			{
				sessionStartDate: 1565127052000,
				presenterName: 'John Doe',
				registrationURL: 'https://www.cisco.com/register',
			},
		],
	},
];

/** Implement ATX */
const implementItems = [
	{
		atxId: 'ATX-01',
		title: 'Cisco DNA Center Project Planning',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/acc/images/acc_access-infra-readiness.png',
		status: 'in-progress',
		recordingURL: 'https://tklcs.cloudapps.cisco.com/tklcs/TKLDownloadServlet?nodeRef=workspace://SpacesStore/2ccb9372-82dc-4700-afc7-0a4ed0630685&activityId=2&fileId=123052',
		duration: 2323423,
		bookmark: true,
		sessions: [
			{
				sessionStartDate: 1565127052000,
				presenterName: 'John Doe',
				registrationURL: 'https://www.cisco.com/register',
			},
		],
	},
	{
		atxId: 'ATX-02',
		title: 'Cisco DNA Install Appliance',
		imageURL: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/acc/images/acc_deployment-best-practices.png',
		status: 'completed',
		recordingURL: 'https://tklcs.cloudapps.cisco.com/tklcs/TKLDownloadServlet?nodeRef=workspace://SpacesStore/2ccb9372-82dc-4700-afc7-0a4ed0630685&activityId=2&fileId=123052',
		duration: 3600,
		bookmark: true,
		sessions: [
			{
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
 * @returns the ATXResponse
 */
function MockATX (solution: string, usecase: string, pitstop: string): ATXResponseModel {
	const response = {
		pitstop,
		solution,
		usecase,
		items: [],
	};

	if (pitstop.toLowerCase() === 'implement') {
		response.items = implementItems;
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
					delay: Math.floor(Math.random() * 2000) + 100,
					description: '(ATX) IBN-Campus Network Assurance-Onboard',
					response: {
						body: MockATX('IBN', 'Campus Network Assurance', 'Onboard'),
						status: 200,
					},
					selected: true,
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
