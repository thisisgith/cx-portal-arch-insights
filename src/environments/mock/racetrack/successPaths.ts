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
 * @param suffix a specific identifier for the file requested
 * @returns the mock data for the requested solution and usecase
 */
function MockProductGuides (solution: string, usecase: string, suffix?: string): SuccessPathsResponse {
	try {
		return require(`./pgMockData/${solution}-${usecase}-${suffix}.json`);
	} catch {
		return { };
	}
	/* tslint:enable object-literal-sort-keys */
}

/**
 * The scenarios
 */
export const SuccessPathScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
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
					delay: Math.floor(Math.random() * 2000) + 250,
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
					delay: Math.floor(Math.random() * 2000) + 250,
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
					delay: Math.floor(Math.random() * 2000) + 250,
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
					delay: Math.floor(Math.random() * 2000) + 250,
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
					delay: Math.floor(Math.random() * 2000) + 250,
					description: 'Product Guides IBN - Campus Network Assurance',
					response: {
						body: MockProductGuides('IBN', 'Campus Network Assurance'),
						status: 200,
					},
					selected: true,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: 'Product Guides IBN - Campus Network Assurance - twoBookmarked',
					response: {
						body: MockProductGuides('IBN', 'Campus Network Assurance', 'twoBookmarked'),
						status: 200,
					},
					selected: true,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: 'Product Guides IBN - Campus Network Assurance - twoUnbookmarked',
					response: {
						body: MockProductGuides('IBN', 'Campus Network Assurance', 'twoUnbookmarked'),
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
					delay: Math.floor(Math.random() * 2000) + 250,
					description: 'Product Guides IBN - Network Device Onboarding',
					response: {
						body: MockProductGuides('IBN', 'Network Device Onboarding'),
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
					delay: Math.floor(Math.random() * 2000) + 250,
					description: 'Product Guides IBN - Campus Software Image Management',
					response: {
						body: MockProductGuides('IBN', 'Campus Software Image Management'),
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
					delay: Math.floor(Math.random() * 2000) + 250,
					description: 'Product Guides IBN - Campus Network Segmentation',
					response: {
						body: MockProductGuides('IBN', 'Campus Network Segmentation'),
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
					delay: Math.floor(Math.random() * 2000) + 250,
					description: 'Product Guides IBN - Scalable Access Policy',
					response: {
						body: MockProductGuides('IBN', 'Scalable Access Policy'),
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
];
