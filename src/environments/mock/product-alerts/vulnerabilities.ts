import { VulnerabilityResponse } from '@sdp-api';
import * as _ from 'lodash-es';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/vulnerabilities/count';
/** Default Customer ID */
const customerId = '2431199';
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
					delay: 100,
					description: 'Advisory Counts',
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
					delay: 100,
					description: 'Advisory Counts - Missing keys',
					response: {
						body: _.pick(mockAdvisoryCounts, ['bugs']),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 100,
					description: 'Advisory Counts - Large',
					response: {
						body: mockLargeAdvisoryCounts,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=${useCase}&solution=${solution}`,
		usecases: ['Use Case 1'],
	},
];
