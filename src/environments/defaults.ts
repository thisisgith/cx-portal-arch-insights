/**
 * Default Origin
 */
const origin = 'https://swtgdev-apollo-2.cisco.com';

/**
 * Contains default configurations to be used to import into other environment files,
 * should not be imported directly by anything other than environment files
 */
export const defaults = {
	origin,
	auth: {
		referUrl: `${origin}/ws/oauth/v3/sso/`,
		tokenUrl: `${origin}/ws/oauth/v3/token/cway/{INSERT_CLIENT_ID}`,
	},
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
				scenario: '200ok',
				url: '/api/v1/racetrack',
			},
		],
		tags: {
			appId: 'pbc',
		},
	},
	production: false,
	services: {
		alert: '/ws/alert',
		inventory: '/ws/inventory',
		search: '/ws/search',
		solution: {
			customerId: '123',
			racetrack: '/api/v1/racetrack',
			webinar: '/ws/webinars',
		},
	},
};
