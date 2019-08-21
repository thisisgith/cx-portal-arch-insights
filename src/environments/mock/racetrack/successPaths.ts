/* tslint:disable max-line-length ter-max-len completed-docs */

import { SuccessPathsResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/successPaths';

/** Default Customer ID */
const customerId = '2431199';
/** Default successByteIds */
const successByteId1 = '111111';
const successByteId2 = '111111';
const successByteId3 = '111111';
const successByteId4 = '111111';
const successByteId5 = '111111';

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
				bookmark: true,
				description: 'How to use Cisco DNA Center Appliance for Assurance and SD-Access',
				duration: '12 minutes',
				successByteId: `${successByteId1}`,
				title: 'How to use Cisco DNA Center Appliance for Assurance and SD-Access',
				type: 'Video',
				url: 'https://www.youtube.com/watch?v=xh7odohoPEQ',
			},
			{
				archetype: 'Getting Started',
				bookmark: false,
				description: 'Complete First-Time Setup',
				duration: null,
				successByteId: `${successByteId2}`,
				title: 'Complete First-Time Setup',
				type: 'Web Page',
				url: 'https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center/1-2-10/install/b_dnac_install_1210_M5/b_dnac_install_1210_M5_chapter_0100.html',
			},
			{
				archetype: 'Typical Use Cases',
				bookmark: true,
				description: 'Cisco DNA Assurance Overview',
				duration: null,
				successByteId: `${successByteId3}`,
				title: 'Cisco DNA Assurance Overview',
				type: 'Data Sheet',
				url: 'https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center-assurance/1-2-10/b_cisco_dna_assurance_1_2_10_ug/b_cisco_dna_assurance_1_2_10_ug_chapter_01.html',
			},
			{
				archetype: 'Architecture Transition',
				bookmark: false,
				description: 'New and Changed Information',
				duration: null,
				successByteId: `${successByteId4}`,
				title: 'New and Changed Information',
				type: 'PDF',
				url: 'https://www.cisco.com/c/en/us/products/collateral/cloud-systems-management/smart-net-total-care/q-and-a-c67-735432.pdf?dtid=osscdc000283',
			},
			{
				archetype: 'Project Planning',
				bookmark: true,
				description: 'Set Up Cisco DNA Center to Use Assurance',
				duration: null,
				successByteId: `${successByteId5}`,
				title: 'Set Up Cisco DNA Center to Use Assurance',
				type: 'Web Page',
				url: 'https://www.cisco.com/c/en/us/td/docs/cloud-systems-management/network-automation-and-management/dna-center-assurance/1-2-10/b_cisco_dna_assurance_1_2_10_ug/b_cisco_dna_assurance_1_2_10_ug_chapter_010.html',
			},
		],
	};
}

function MockProductDocumentationVideos (): SuccessPathsResponse {
	return {
		items: [
			{
				title: 'Configure the Appliance',
				description: 'Configure the Appliance',
				duration: '15 minutes',
				type: 'Web Page',
				url: 'http://cisco.lookbookhq.com/ibn-customer-portal/configure-the-appliance?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: false,
				successByteId: 'SB2',
			},
			{
				title: 'Cisco DNA Center Appliance Setup',
				description: 'Cisco DNA Center Appliance Setup',
				duration: '3 minutes',
				type: 'Video',
				url: 'http://cisco.lookbookhq.com/ibn-customer-portal/dna-center-appliance?utm_campaign=IBN&utm_content=Video&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: false,
				successByteId: 'SB3',
			},
			{
				title: 'Complete First-Time Setup',
				description: 'Complete First-Time Setup',
				duration: '30 minutes',
				type: 'Web Page',
				url: 'http://cisco.lookbookhq.com/ibn-customer-portal/ibn-firsttime-setup?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: false,
				successByteId: 'SB4',
			},
			{
				title: 'New and Changed Information - Center',
				description: 'New and Changed Information - Center',
				duration: '10 minutes',
				type: 'Web Page',
				url: 'http://cisco.lookbookhq.com/ibn-customer-portal/ibn-new-changed-info?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: false,
				successByteId: 'SB5',
			},
			{
				title: 'Get Started with Cisco IBN',
				description: 'Get Started with Cisco IBN',
				duration: '30 minutes',
				type: 'Web Page',
				url: 'https://explore.cisco.com/ibn-customer-portal/install-the-appliance?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: false,
				successByteId: 'SB6',
			},
			{
				title: 'Introduction to Cisco DNA Center Interface',
				description: 'Introduction to Cisco DNA Center Interface',
				duration: '2 minutes',
				type: 'Video',
				url: 'http://cisco.lookbookhq.com/ibn-customer-portal/dnac-ui-intro?utm_campaign=IBN&utm_content=Video&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: false,
				successByteId: 'SB7',
			},
			{
				title: 'Enable Shared Services and External Connectivity',
				description: 'Enable Shared Services and External Connectivity',
				duration: '11 minutes',
				type: 'Video',
				url: 'http://cisco.lookbookhq.com/ibn-customer-portal/enable-shared-services-and-external-connectivity?utm_campaign=IBN&utm_content=Video&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Getting Started',
				bookmark: false,
				successByteId: 'SB8',
			},
			{
				title: 'Review the Appliance Features',
				description: 'Review the Appliance Features',
				duration: '10 minutes',
				type: 'Web Page',
				url: 'http://cisco.lookbookhq.com/ibn-customer-portal/appliance-features?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Project Planning',
				bookmark: true,
				successByteId: 'SB9',
			},
			{
				title: 'Plan the Deployment',
				description: 'Plan the Deployment',
				duration: '30 minutes',
				type: 'Web Page',
				url: 'http://cisco.lookbookhq.com/ibn-customer-portal/plan-the-deployment?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Project Planning',
				bookmark: true,
				successByteId: 'SB10',
			},
			{
				title: 'New and Changed Assurance Info',
				description: 'New and Changed Assurance Info',
				duration: '30 minutes',
				type: 'Web Page',
				url: 'http://cisco.lookbookhq.com/ibn-customer-portal/new-changed-assurance?utm_campaign=IBN&utm_content=Guide&utm_source=Customer-Portal&utm_medium=IBN-Customer-Portal-Page&pfhide=true',
				archetype: 'Project Planning',
				bookmark: true,
				successByteId: 'SB11',
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
					description: '(SP) IBN-Campus Network Assurance-Onboard',
					response: {
						body: MockSP('IBN', 'Campus Network Assurance', 'Onboard'),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&usecase=Campus Network Assurance` +
			'&solution=IBN&rows=100&pitstop=Onboard',
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
		url: `${api}?customerId=${customerId}&usecase=Campus Network Segmentation` +
			'&solution=IBN&rows=100&pitstop=Onboard',
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
		url: `${api}?customerId=${customerId}&usecase=Scalable Access Policy` +
			'&solution=IBN&rows=100&pitstop=Onboard',
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
		url: `${api}?customerId=${customerId}&usecase=Network Device Onboarding` +
			'&solution=IBN&rows=100&pitstop=Onboard',
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
		url: `${api}?customerId=${customerId}&usecase=Campus Software Image Management` +
			'&solution=IBN&rows=100&pitstop=Onboard',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: 'Product Documenation & Videos response for all',
					response: {
						body: MockProductDocumentationVideos(),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
