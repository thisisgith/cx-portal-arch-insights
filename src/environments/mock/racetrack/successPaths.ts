/* tslint:disable max-line-length ter-max-len */

import { SuccessPathsResponse } from '@cui-x/sdp-api';

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
				title: 'How to use Cisco DNA Center Appliance for Assurance and SD-Access',
				description: 'How to use Cisco DNA Center Appliance for Assurance and SD-Access',
				duration: '12 minutes',
				type: 'Video',
				url: 'https://www.youtube.com/watch?v=xh7odohoPEQ',
				archetype: 'Project Planning How-to',
			},
			{
				title: 'Complete First-Time Setup',
				description: 'Complete First-Time Setup',
				duration: '45 mins',
				type: 'Web Page',
				url: 'https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center/1-2-10/install/b_dnac_install_1210_M5/b_dnac_install_1210_M5_chapter_0100.html',
				archetype: 'Getting Started How-to',
			},
			{
				title: 'Cisco DNA Assurance Overview',
				description: 'Cisco DNA Assurance Overview',
				duration: null,
				type: 'Web Page',
				url: 'https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center-assurance/1-2-10/b_cisco_dna_assurance_1_2_10_ug/b_cisco_dna_assurance_1_2_10_ug_chapter_01.html',
				archetype: 'Typical Use Cases',
			},
			{
				title: 'New and Changed Information',
				description: 'New and Changed Information',
				duration: null,
				type: 'PDF',
				url: 'https://www.cisco.com/c/en/us/products/collateral/' +
					'cloud-systems-management/smart-net-total-care/' +
					'q-and-a-c67-735432.pdf?dtid=osscdc000283',
				archetype: 'Architecture Transition',
			},
			{
				title: 'Set Up Cisco DNA Center to Use Assurance',
				description: 'Set Up Cisco DNA Center to Use Assurance',
				duration: null,
				type: 'Web Page',
				url: 'https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center-assurance/1-2-10/b_cisco_dna_assurance_1_2_10_ug/b_cisco_dna_assurance_1_2_10_ug_chapter_010.html',
				archetype: 'Project Planning How-to',
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
					delay: 250,
					description: '(SP) IBN-Wireless Assurance-Onboard',
					response: {
						body: MockSP('IBN', 'Wireless Assurance', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=Wireless Assurance&solution=IBN` +
			`&pitstop=Onboard&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: '(SP) IBN-SD Access-Onboard',
					response: {
						body: MockSP('IBN', 'SD Access', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?usecase=SD Access&solution=IBN&pitstop=Onboard&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
