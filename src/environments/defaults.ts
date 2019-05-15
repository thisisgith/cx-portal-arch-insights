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
		tokenUrl: `${origin}/ws/oauth/v3/token/cway/35ae50e6ff5843f59183da19cc44245d`,
		ciscoTokenUrl: `${origin}/ws/oauth/v3/token/cisco/{INSERT_CLIENT_ID}`,
	},
	production: false,
	services: {
		alert: '/ws/alert',
		inventory: '/ws/inventory',
		sdp: {
			clientId: '4jr3csg78pg7ws7gwvj82sfa',
			origin: 'https://api-stage.cisco.com',
		},
		search: '/ws/search',
		solution: {
			customerId: '123',
			racetrack: '/api/v1/racetrack',
			webinar: '/ws/webinars',
		},
	},
};
