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
		tags: {
			appId: 'pbc',
		},
	},
	production: false,
	services: {
		search: '/ws/search',
		solution: {
			webinar: '/ws/webinars',
		},
	},
};
