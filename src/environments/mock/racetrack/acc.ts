// tslint:disable: completed-docs
// tslint:disable: ter-max-len
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
			accId: `${accId6}`,
			description: 'Experience this live coaching engagement on general Assurance ' +
				'concepts and features such as network, device, client, and application ' +
				'analytics. Help your team hit the ground running',
			bookmark: false,
			status: 'requested',
			title: 'Cisco Software-Defined Access Transition Planning',
			url: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/acc/images/' +
				'acc_policy-enforcement-sda.png',
			datasheetURL: 'www.cisco.com',
			feedbackInfo: {
				available: false,
			},
			providerInfo: {
				id: '293532',
				logoURL: '',
				name: 'Salesforce',
			},
		},
		{
			accId: `${accId2}`,
			description: 'Gain actionable insights into Cisco DNA Center use case ' +
				'deployments and assists. Understand how to design, adopt, and leverage to ' +
				'save time and resources within your network',
			bookmark: true,
			status: 'in-progress',
			title: 'Cisco DNA Pilot Usecase Deployment',
			url: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/acc/' +
				'images/acc_sda-segregation-strategy.png',
			datasheetURL: 'www.cisco.com',
			feedbackInfo: {
				available: true,
				feedbackId: 'feedback1',
				thumbs: <const> 'UP',
			},
			providerInfo: {
				id: '293532',
				logoURL: '',
				name: 'Salesforce',
			},
		},
		{
			accId: `${accId3}`,
			description: 'Experience this live coaching engagement on general Assurance ' +
				'concepts and features such as network, device, client, and application ' +
				'analytics. Help your team hit the ground running',
			bookmark: false,
			status: 'in-progress',
			title: 'Cisco DNA Center Use Cases',
			url: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/acc/' +
				'images/acc_deployment-best-practices.png',
			datasheetURL: 'www.cisco.com',
			feedbackInfo: {
				available: false,
			},
			providerInfo: {
				id: '239533',
				logoURL: '',
				name: 'Logitec',
			},
		},
		{
			accId: `${accId1}`,
			description: 'Discover the standard steps required to engineer and commission ' +
				'your appliance from an experienced Cisco DNA Center project manager. Understand ' +
				'basic deployment requirements and schedules',
			bookmark: false,
			status: 'completed',
			title: 'Cisco DNA Center Project Planning',
			url: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/acc/' +
				'images/acc_access-overview-demo.png',
			datasheetURL: 'www.cisco.com',
			feedbackInfo: {
				available: false,
			},
			providerInfo: {
				id: '239533',
				logoURL: '',
				name: 'Logitec',
			},
		},
		{
			accId: `${accId4}`,
			description: 'Experience this live coaching engagement on general Assurance ' +
				'concepts and features such as network, device, client, and application ' +
				'analytics. Help your team hit the ground running',
			bookmark: false,
			status: 'recommended',
			title: 'Cisco DNA Center Wireless Assurance Feature Planning',
			url: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/acc/' +
				'images/acc_access-infra-readiness.png',
			datasheetURL: 'www.cisco.com',
			feedbackInfo: {
				available: false,
			},
			providerInfo: null,
		},
		{ },
	];

	if (pitstop.toLowerCase() === 'adopt') {
		items = [
			{
				accId: `${accId5}`,
				description: 'This is a title for Adoption',
				bookmark: false,
				status: 'completed',
				title: 'This is a title for Adoption',
				url: 'https://www.cisco.com/web/fw/tools/ssue/cp/lifecycle/acc/' +
				'images/acc_access-overview-demo.png',
				datasheetURL: 'www.cisco.com',
				feedbackInfo: {
					available: false,
				},
				providerInfo: {
					id: '293533',
					logoURL: '',
					name: 'Logitec',
				},
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
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Onboard', ''),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard-allButRecommended',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Onboard', 'allButRecommended'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard-Empty',
					response: {
						body: {
							items: [],
							pitstop: 'Onboard',
							solution: 'IBN',
							usecase: 'Campus Network Assurance',
						},
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard-oneRecommended',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Onboard', 'oneRecommended'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Onboard', 'twoRecommended'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard-oneNonRecommended',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Onboard', 'oneNonRecommended'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard-completedInProgress',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Onboard',
							'completedInProgress'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard-twoCompleted',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Onboard', 'twoCompleted'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard-twoInProgress',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Onboard', 'twoInProgress'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard-twoRequested',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Onboard', 'twoRequested'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard-twoBookmarked',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Onboard', 'twoBookmarked'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard-twoWithPartner',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Onboard', 'twoWithPartner'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard-twoWithBlankPartner',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Onboard', 'twoWithBlankPartner'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Onboard-feedbackNeeded',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Onboard', 'feedbackNeeded'),
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?usecase=Campus Network Assurance&` +
			`solution=IBN&pitstop=Onboard&customerId=${customerId}&` +
			'suggestedAction=Get to know Cisco DNA Center',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Implement-twoRecommended',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Implement', 'twoRecommended'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Network Assurance&` +
			`solution=IBN&pitstop=Implement&customerId=${customerId}&` +
			'suggestedAction=Build your network & site hierarchy',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Assurance-Use-twoRecommended',
					response: {
						body: MockACC('IBN', 'Campus Network Assurance', 'Use', 'twoRecommended'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Network Assurance&` +
			`solution=IBN&pitstop=Use&customerId=${customerId}&` +
			'suggestedAction=Monitor Health of the Network',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: '(ACC) IBN-Campus Network Segmentation-Onboard',
					response: {
						body: MockACC('IBN', 'Campus Network Segmentation', 'Onboard', ''),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Network Segmentation&solution=IBN&` +
			`pitstop=Onboard&customerId=${customerId}&suggestedAction=Onboard 2`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: '(ACC) IBN-Scalable Access Policy-Onboard',
					response: {
						body: MockACC('IBN', 'Scalable Access Policy', 'Onboard', ''),
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
					delay: 30,
					description: '(ACC) IBN-Network Device Onboarding-Onboard',
					response: {
						body: MockACC('IBN', 'Network Device Onboarding', 'Onboard', ''),
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
					delay: 30,
					description: '(ACC) IBN-Campus Software Image Management-Onboard',
					response: {
						body: MockACC('IBN', 'Campus Software Image Management', 'Onboard', ''),
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
			POST: [
				{
					delay: 30,
					description: `(ACC) IBN-Bookmark-${accId1}`,
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
					delay: 30,
					description: `(ACC) IBN-Bookmark-${accId2}`,
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
					delay: 30,
					description: `(ACC) IBN-Bookmark-${accId3}`,
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
					delay: 30,
					description: `(ACC) IBN-Bookmark-${accId4}`,
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
					delay: 30,
					description: '(ACC) IBN-ACCRequestSubmit1',
					response: {
						status: 200,
					},
					selected: true,
				},
				{
					delay: 30,
					description: '(ACC) IBN-WirelessAssurance/SDAccess-Onboard ACCRequestSubmit1 Error',
					response: {
						status: 500,
					},
					selected: false,
				},
			],
		},
		url: `${api}/${accId4}/request?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 30,
					description: `(ACC) IBN-Bookmark-${accId6}`,
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
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: '(ATX) IBN-Campus Network Assurance-Onboard-twoProviders(293531,293532)',
					response: {
						body: {
							pitstop: 'Onboard',
							solution: 'IBN',
							usecase: 'Campus Network Assurance',
							items: require('./accMockData/twoProvidersOneAcc.json'),
						},
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Network Assurance&solution=IBN&pitstop=Onboard&customerId=${customerId}&suggestedAction=Get to know Cisco DNA Center&providerId=293531&providerId=293532`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: '(ATX) IBN-Campus Network Assurance-Onboard-InProgress-Filter',
					response: {
						body: {
							pitstop: 'Onboard',
							solution: 'IBN',
							usecase: 'Campus Network Assurance',
							items: require('./accMockData/twoInProgress.json'),
						},
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Network Assurance&solution=IBN&pitstop=Onboard&customerId=${customerId}&suggestedAction=Get to know Cisco DNA Center&status=in-progress`,
		usecases: ['Use Case 1'],
	},
];
