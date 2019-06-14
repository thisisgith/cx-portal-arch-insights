import { SearchResults } from '../../../app/services/search';
/** base API for search */
const api = '/api/customerportal/search/v1';

/**
 * Mock body of results
 */
const mockData: SearchResults = {
	cdcSearch: [
		{
			domain: 'cdc',
			search: [
				{
					title: 'Error when setting up new node in DNA',
					uri: 'https://community.cisco.com',
				},
				{
					title:
						'Cisco Digital Network Architecture Center Installation Guide, Release 1.2',
					uri: 'https://community.cisco.com',
				},
			],
		},
	],
};

/**
 * The scenarios
 */
export const SearchScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'Generic Example',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
				{
					delay: 5000,
					description: 'Empty Response',
					response: {
						body: {
							results: [],
						},
						status: 200,
					},
				},
				{
					delay: 1000,
					description: 'Failure Response',
					response: {
						status: 404,
						statusText: 'Unable to find results',
					},
				},
			],
		},
		url: `${api}/cdcSearch`,
		usecases: ['Example', 'More Example'],
	},
];
