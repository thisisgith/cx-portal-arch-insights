import { defaults } from './defaults';

/**
 * Stage Internal origin
 */
const origin = 'https://apollo-stage.cisco.com';

/**
 * Contains configurations for production builds, will extend the default configuration
 */
export const environment = {
	...defaults,
	origin,
	mock: {
		origin,
		tags: {
			appId: 'pbc',
		},
	},
	production: true,
};
