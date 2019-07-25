/* tslint:disable max-line-length ter-max-len */

import { SuccessPathsResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/successPaths';

/** Default Customer ID */
const customerId = '2431199';

/**
 * Mock
 * @param solution the solution we're at
 * @param usecase the use case
 * @param pitstop the pitstop
 * @returns response
 */
function MockSP (
	solution: string, usecase: string, pitstop: string): SuccessPathsResponse {
	return {
		pitstop,
		solution,
		usecase,
		items: [
			{
				archetype: 'Project Planning',
				description: 'How to use Cisco DNA Center Appliance for Assurance and SD-Access',
				duration: '12 minutes',
				title: 'How to use Cisco DNA Center Appliance for Assurance and SD-Access',
				type: 'Video',
				url: 'https://www.youtube.com/watch?v=xh7odohoPEQ',
			},
			{
				archetype: 'Getting Started',
				description: 'Complete First-Time Setup',
				duration: null,
				title: 'Complete First-Time Setup',
				type: 'Web Page',
				url: 'https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center/1-2-10/install/b_dnac_install_1210_M5/b_dnac_install_1210_M5_chapter_0100.html',
			},
			{
				archetype: 'Typical Use Cases',
				description: 'Cisco DNA Assurance Overview',
				duration: null,
				title: 'Cisco DNA Assurance Overview',
				type: 'Web Page',
				url: 'https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center-assurance/1-2-10/b_cisco_dna_assurance_1_2_10_ug/b_cisco_dna_assurance_1_2_10_ug_chapter_01.html',
			},
			{
				archetype: 'Architecture Transition',
				description: 'New and Changed Information',
				duration: null,
				title: 'New and Changed Information',
				type: 'PDF',
				url: 'https://www.cisco.com/c/en/us/products/collateral/cloud-systems-management/smart-net-total-care/q-and-a-c67-735432.pdf?dtid=osscdc000283',
			},
			{
				archetype: 'Project Planning',
				description: 'Set Up Cisco DNA Center to Use Assurance',
				duration: null,
				title: 'Set Up Cisco DNA Center to Use Assurance',
				type: 'Web Page',
				url: 'https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center-assurance/1-2-10/b_cisco_dna_assurance_1_2_10_ug/b_cisco_dna_assurance_1_2_10_ug_chapter_010.html',
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
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(SP) IBN-Wireless Assurance-Onboard',
					response: {
						body: MockSP('IBN', 'Campus network assurance', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Network Assurance&solution=IBN` +
			`&pitstop=Onboard&customerId=${customerId}&rows=100`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(SP) IBN-Campus network segmentation-Onboard',
					response: {
						body: MockSP('IBN', 'Campus network segmentation', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Network Segmentation&solution=IBN&pitstop=Onboard` +
			`&customerId=${customerId}&rows=100`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-Scalable-Onboard',
					response: {
						body: MockSP('IBN', 'Scalable Accesss Policy', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Scalable Access Policy&solution=IBN&` +
			`pitstop=Onboard&customerId=${customerId}&rows=100`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-Network device onboarding-Onboard',
					response: {
						body: MockSP('IBN', 'Network device onboarding', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Network Device Onboarding&solution=IBN&` +
			`pitstop=Onboard&customerId=${customerId}&rows=100`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(ACC) IBN-Campus software iamge-Onboard',
					response: {
						body: MockSP('IBN', 'Campus software image management', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Campus Software Image Management&solution=IBN&` +
			`pitstop=Onboard&customerId=${customerId}&rows=100`,
		usecases: ['Use Case 1'],
	},
];
