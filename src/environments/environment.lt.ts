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
	mock: [],
	production: true,
	rmaServiceOrigin: 'https://api-test.cisco.com/api/lt/customerportal',
	rmaServicePaths: {
		returns: '/return/v1.0/returns',
	},
	sdpServiceClientId: 'ejw4cbpvp3s8cyh4ry8qcnff',
	/**
	 * sdpServiceOrigin MUST be explicitly declared in every single environment file,
	 * because it is used inside of a module forRoot() call
	 */
	sdpServiceOrigin: 'https://api-test.cisco.com/api/lt/customerportal',
	sdpServicePaths: {
		contracts: '/api/lt/v1/contracts',
		controlpoints: '/api/lt/customerportal/controlpoint',
		customerportal: '/api/lt/customerportal',
		inventory: '/api/lt/v1/inventory',
	},
};
