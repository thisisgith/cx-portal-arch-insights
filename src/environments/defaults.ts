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
		accountUrl: `${origin}/ws/account/v2/`,
		ciscoTokenUrl: `${origin}/ws/oauth/v3/token/cisco/{INSERT_CLIENT_ID}`,
		referUrl: `${origin}/ws/oauth/v3/sso/`,
		tokenUrl: `${origin}/ws/oauth/v3/token/cway/35ae50e6ff5843f59183da19cc44245d`,
	},
	csone: {
		clientId: '453b7e10f08b428c90d48432312889ad',
	},
	production: false,
	sdpOrigin: 'https://api-stage.cisco.com',
	services: {
		sdp: {
			clientId: '4jr3csg78pg7ws7gwvj82sfa',
			origin: 'https://api-stage.cisco.com',
		},
		search: '/ws/search',
	},
};
