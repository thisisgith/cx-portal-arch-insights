import { VulnerabilityResponse } from '@sdp-api';
import * as _ from 'lodash-es';

/** Base of URL for SDP API */
const system_api = '/api/customerportal/product-alerts/v1/assets/system/vulnerabilities/count';
const hardwar_api = '/api/customerportal/product-alerts/v1/assets/hardware/vulnerabilities/count';
/** Default Customer ID */
const customerId = '2431199_0';
/** Default Use Case */
const useCase = 'Campus Network Assurance';
/** Default Solution */
const solution = 'IBN';

/** The mock response for coverage counts */
const mockAdvisoryCounts: VulnerabilityResponse = {
	bugs: 2,
	'field-notices': 3,
	'security-advisories': 6,
};

/** The mock response for a large coverage count */
const mockLargeAdvisoryCounts: VulnerabilityResponse = {
	bugs: 4562,
	'field-notices': 67546,
	'security-advisories': 4121,
};

/** The scenarios */
export const VulnerabilityScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: 'System Advisory Counts',
					response: {
						body: mockAdvisoryCounts,
						status: 200,
					},
					selected: true,
				},
				{
					delay: 0,
					description: 'Advisory Counts - Unreachable',
					response: {
						body: { },
						status: 503,
					},
					selected: false,
				},
				{
					delay: 30,
					description: 'Advisory Counts - Missing keys',
					response: {
						body: _.pick(mockAdvisoryCounts, ['bugs']),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 30,
					description: 'Advisory Counts - Large',
					response: {
						body: mockLargeAdvisoryCounts,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${system_api}?customerId=${customerId}&useCase=${useCase}&solution=${solution}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Hardware Advisory Counts',
					response: {
						body: { 'field-notices': 10 },
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${hardwar_api}?customerId=${customerId}&useCase=${useCase}&solution=${solution}`,
		usecases: ['Use Case 1'],
	},
];
