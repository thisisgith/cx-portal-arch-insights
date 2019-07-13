import { defaults } from './defaults';

/**
 * Production origin
 */
const origin = 'https://d2wff6n80ugrz8.cloudfront.net';

/**
 * Cway origin
 */
const authOrigin = 'https://cway.cisco.com';

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
	baseHref: '',
	production: true,
	sdpServiceClientId: 'bqvnsm6qc9fda66d4xttpst6',
	/**
	 * sdpServiceOrigin MUST be explicitly declared in every single environment file,
	 * because it is used inside of a module forRoot() call
	 */
	sdpServiceOrigin: 'https://api-test.cisco.com/api/stg/customerportal',
};
