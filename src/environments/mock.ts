/**
 * Default Origin
 */
const origin = 'https://swtgdev-apollo-2.cisco.com';

/**
 * Our default mock settings
 */
export const mock = {
	mock: {
		origin,
		settings: [
			{
				method: 'GET',
				scenario: '200ok Example Response',
				url: '/ws/search',
			},
			{
				method: 'GET',
				scenario: '200ok',
				url: '/ws/webinars',
			},
			{
				method: 'GET',
				scenario: 'Example Response',
				url: '/ws/alert',
			},
		],
		tags: {
			appId: 'pbc',
		},
	},
};
