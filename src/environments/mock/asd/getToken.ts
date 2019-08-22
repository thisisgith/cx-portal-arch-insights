/** base API */
const api = '/ws/oauth/v3/token/cisco/ae95x38c7zgu5fas59gseyfk';

/**
 * Mock body of results for successful DNAC call
 */
const mockData  = {
	expiration: '3599',
	token: 'bbEPaW6pjQWffUTAs1LeH4rA0hFK',
};

/**
 * The scenarios
 */
export const ASDTokenScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'Get ASD Token',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['ASD'],
	},
];
