/* tslint:disable max-line-length ter-max-len */

import { SuccessPathsResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/successPaths';

/** Default Customer ID */
const customerId = '2431199';
/** Default successByteIds */
const successByteId = '111111';

/**
 * Mock
 * @param solution the solution we're at
 * @param usecase the use case
 * @param pitstop the pitstop
 * @returns response
 */
function MockSP (
	solution: string, usecase: string, pitstop: string): SuccessPathsResponse {
	/* tslint:disable object-literal-sort-keys */
	return {
		pitstop,
		solution,
		usecase,
		items: [
			{
				archetype: 'Project Planning',
				bookmark: true,
				description: 'How to use Cisco DNA Center Appliance for Assurance and SD-Access',
				duration: '12 minutes',
				successByteId: `${successByteId}`,
				title: 'How to use Cisco DNA Center Appliance for Assurance and SD-Access',
				type: 'Video',
				url: 'https://www.youtube.com/watch?v=xh7odohoPEQ',
			},
			{
				archetype: 'Getting Started',
				bookmark: false,
				description: 'Complete First-Time Setup',
				duration: null,
				successByteId: `${successByteId}`,
				title: 'Complete First-Time Setup',
				type: 'Web Page',
				url: 'https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center/1-2-10/install/b_dnac_install_1210_M5/b_dnac_install_1210_M5_chapter_0100.html',
			},
			{
				archetype: 'Typical Use Cases',
				bookmark: true,
				description: 'Cisco DNA Assurance Overview',
				duration: null,
				successByteId: `${successByteId}`,
				title: 'Cisco DNA Assurance Overview',
				type: 'Data Sheet',
				url: 'https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center-assurance/1-2-10/b_cisco_dna_assurance_1_2_10_ug/b_cisco_dna_assurance_1_2_10_ug_chapter_01.html',
			},
			{
				archetype: 'Architecture Transition',
				bookmark: false,
				description: 'New and Changed Information',
				duration: null,
				successByteId: `${successByteId}`,
				title: 'New and Changed Information',
				type: 'PDF',
				url: 'https://www.cisco.com/c/en/us/products/collateral/cloud-systems-management/smart-net-total-care/q-and-a-c67-735432.pdf?dtid=osscdc000283',
			},
			{
				archetype: 'Project Planning',
				bookmark: true,
				description: 'Set Up Cisco DNA Center to Use Assurance',
				duration: null,
				successByteId: `${successByteId}`,
				title: 'Set Up Cisco DNA Center to Use Assurance',
				type: 'Web Page',
				url: 'https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center-assurance/1-2-10/b_cisco_dna_assurance_1_2_10_ug/b_cisco_dna_assurance_1_2_10_ug_chapter_010.html',
			},
		],
	};
}

/**
 * Mocks Product Documentation & Videos
 * @param solution the solution requested
 * @param usecase the usecase requested
 * @param mockFileName the file to load mock data from
 * @returns the mock data for the requested solution and usecase
 */
function MockProductGuides (solution: string, usecase: string, mockFileName?: string): SuccessPathsResponse {
	if (mockFileName) {
		return require(`./pgMockData/${mockFileName}.json`);
	}

	return {
		solution,
		usecase,
		totalCount: 10,
		items: [
			{
				title: 'Install the Appliance',
				description: 'Cisco Digital Network Architecture Center Appliance Installation Guide discusses workflow, inspection, warnings, rack requirements and LED.',
				duration: '15 minutes',
				type: 'Web Page',
				url: 'https://cisco.lookbookhq.com/ibn-customer-portal/install-the-appliance?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: true,
				successByteId: 'SB1',
			},
			{
				title: 'Configure the Appliance',
				description: 'This guide discusses configuration workflow, browser access to CIMC, pre-flight checks, network interface card, bootable USB drive, reimage the appliance, ISO Image, master node, add-on nodes, and more.',
				duration: '15 minutes',
				type: 'Web Page',
				url: 'https://cisco.lookbookhq.com/ibn-customer-portal/configure-the-appliance?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: false,
				successByteId: 'SB2',
			},
			{
				title: 'Cisco DNA Center Appliance Setup',
				description: 'In this 3-minute video you will learn the basics of the DNA appliance including a description of the appliance. What the ports are used for along with tips for ordering.',
				duration: '3 minutes',
				type: 'Video',
				url: 'https://cisco.lookbookhq.com/ibn-customer-portal/dna-center-appliance?utm_campaign=IBN&utm_content=Video&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: false,
				successByteId: 'SB3',
			},
			{
				title: 'Complete First-Time Setup',
				description: 'This guide provides information on first-time setup workflow, compatible browsers, first time login, Integration ISE With Cisco DNA Center, configure authentication, policy servers, configure SNMP properties and redistribute services.',
				duration: '30 minutes',
				type: 'Web Page',
				url: 'https://cisco.lookbookhq.com/ibn-customer-portal/ibn-firsttime-setup?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: true,
				successByteId: 'SB4',
			},
			{
				title: 'New and Changed Information - Center',
				description: 'This guide summarizes the new and changed features for Cisco DNA Center and tells you where they are documented.',
				duration: '10 minutes',
				type: 'Web Page',
				url: 'https://cisco.lookbookhq.com/ibn-customer-portal/ibn-new-changed-info?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: true,
				successByteId: 'SB5',
			},
			{
				title: 'Get Started with Cisco IBN',
				description: 'Get Started with Cisco DNA Center provides information you need to get started including about Cisco DNA Center, log in, first time as a Network Administrator, default home page, use global search and where to start.',
				duration: '30 minutes',
				type: 'Web Page',
				url: 'https://explore.cisco.com/ibn-customer-portal/install-the-appliance?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: true,
				successByteId: 'SB6',
			},
			{
				title: 'Introduction to Cisco DNA Center Interface',
				description: 'This 2-minute video introduces you to the Cisco DNA interface.',
				duration: '2 minutes',
				type: 'Video',
				url: 'https://cisco.lookbookhq.com/ibn-customer-portal/dnac-ui-intro?utm_campaign=IBN&utm_content=Video&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: false,
				successByteId: 'SB7',
			},
			{
				title: 'Enable Shared Services and External Connectivity',
				description: 'In this video you will work through a lab and configure connectivity to shared services.',
				duration: '11 minutes',
				type: 'Video',
				url: 'https://cisco.lookbookhq.com/ibn-customer-portal/enable-shared-services-and-external-connectivity?utm_campaign=IBN&utm_content=Video&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: false,
				successByteId: 'SB8',
			},
			{
				title: 'Review the Appliance Features',
				description: 'This guide reviews appliance features. It includes a feature summary, describes front and rear panels, physical specifications, environmental specifications and power specifications.',
				duration: '10 minutes',
				type: 'Web Page',
				url: 'https://cisco.lookbookhq.com/ibn-customer-portal/appliance-features?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Project Planning',
				bookmark: false,
				successByteId: 'SB9',
			},
			{
				title: 'Plan the Deployment',
				description: 'This guide provides information on DNA deployment it includes workflow, about Cisco DNA Center and Software-Defined Access and cable connections. It also discusses required subnets, additional IP addresses, SD-access ports and more.',
				duration: '30 minutes',
				type: 'Web Page',
				url: 'https://cisco.lookbookhq.com/ibn-customer-portal/plan-the-deployment?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Project Planning',
				bookmark: true,
				successByteId: 'SB10',
			},
		],
	};
}

/**
 * The scenarios
 */
export const SuccessPathScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: '(SP) IBN-Campus Network Assurance-Onboard',
					response: {
						body: MockSP('IBN', 'Campus Network Assurance', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=Campus Network Assurance&suggestedAction=Get to know Cisco DNA Center` +
			'&solution=IBN&rows=500&pitstop=Onboard',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: '(SP) IBN-Campus Network Segmentation-Onboard',
					response: {
						body: MockSP('IBN', 'Campus Network Segmentation', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=Campus Network Segmentation&suggestedAction=Onboard 2` +
			'&solution=IBN&rows=500&pitstop=Onboard',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: '(SP) IBN-Scalable Access Policy-Onboard',
					response: {
						body: MockSP('IBN', 'Scalable Accesss Policy', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=Scalable Access Policy&suggestedAction=Onboard 2` +
			'&solution=IBN&rows=500&pitstop=Onboard',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: '(SP) IBN-Network Device Onboarding-Onboard',
					response: {
						body: MockSP('IBN', 'Network Device Onboarding', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=Network Device Onboarding&suggestedAction=Onboard 2` +
			'&solution=IBN&rows=500&pitstop=Onboard',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: '(SP) IBN-Campus Software Image Management-Onboard',
					response: {
						body: MockSP('IBN', 'Campus Software Image Management', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=Campus Software Image Management&suggestedAction=Onboard 2` +
			'&solution=IBN&rows=500&pitstop=Onboard',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Product Guides IBN - Campus Network Assurance',
					response: {
						body: MockProductGuides('IBN', 'Campus Network Assurance',
							'IBN-Campus Network Assurance'),
						status: 200,
					},
					selected: true,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Product Guides IBN - Campus Network Assurance - twoBookmarked',
					response: {
						body: MockProductGuides('IBN', 'Campus Network Assurance',
							'IBN-Campus Network Assurance-twoBookmarked'),
						status: 200,
					},
					selected: true,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Product Guides IBN - Campus Network Assurance - twoUnbookmarked',
					response: {
						body: MockProductGuides('IBN', 'Campus Network Assurance',
							'IBN-Campus Network Assurance-twoUnbookmarked'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=Campus Network Assurance` +
			'&solution=IBN&rows=500',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Product Guides IBN - Network Device Onboarding',
					response: {
						body: MockProductGuides('IBN', 'Network Device Onboarding',
							'IBN-Network Device Onboarding'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=Network Device Onboarding` +
			'&solution=IBN&rows=500',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Product Guides IBN - Campus Software Image Management',
					response: {
						body: MockProductGuides('IBN', 'Campus Software Image Management',
							'IBN-Campus Software Image Management'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=Campus Software Image Management` +
			'&solution=IBN&rows=500',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Product Guides IBN - Campus Network Segmentation',
					response: {
						body: MockProductGuides('IBN', 'Campus Network Segmentation',
							'IBN-Campus Network Segmentation'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=Campus Network Segmentation` +
			'&solution=IBN&rows=500',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Product Guides IBN - Scalable Access Policy',
					response: {
						body: MockProductGuides('IBN', 'Scalable Access Policy',
							'IBN-Scalable Access Policy'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=Scalable Access Policy` +
			'&solution=IBN&rows=500',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: 'Product Guides IBN - Unit test-friendly mock data',
					response: {
						body: MockProductGuides('IBN', 'Campus Network Assurance'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=Campus Network Assurance` +
			'&solution=IBN&rows=500',
		usecases: ['Use Case 1'],
	},
];
