import { defaults } from './defaults';
import { mockSettings } from './mock/mock';

/**
 * Stage Internal origin
 */
const origin = 'https://apollo-stage.cisco.com';

/**
 * Contains configurations for internal stage builds, will extend the default configuration
 * and currently the mock configuration
 */
export const environment = {
	...defaults,
	...mockSettings,
	origin,
	auth: {
		ciscoTokenUrl: `${origin}/ws/oauth/v3/token/cisco/{INSERT_CLIENT_ID}`,
		referUrl: `${origin}/ws/oauth/v3/sso/`,
		tokenUrl: `${origin}/ws/oauth/v3/token/cway/35ae50e6ff5843f59183da19cc44245d`,
	},
	production: true,
	sdpOrigin: 'https://api-stage.cisco.com',
};
