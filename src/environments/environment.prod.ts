import { defaults } from './defaults';

/**
 * Production origin
 */
const origin = 'https://d2wff6n80ugrz8.cloudfront.net';

/**
 * Cway origin
 */
const authOrigin = 'https://apollo-stage.cisco.com';

/**
 * Contains configurations for production builds, will extend the default configuration
 */
export const environment = {
	...defaults,
	origin,
	auth: {
		ciscoTokenUrl: `${authOrigin}/ws/oauth/v3/token/cisco`,
		referUrl: `${authOrigin}/ws/oauth/v3/sso/`,
		tokenUrl: `${authOrigin}/ws/oauth/v3/token/cway/35ae50e6ff5843f59183da19cc44245d`,
	},
	baseHref: '/',
	production: true,
	sdpServiceOrigin: 'https://api-stage.cisco.com',
};
