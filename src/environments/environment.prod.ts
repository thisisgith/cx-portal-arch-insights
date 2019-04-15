import { defaults } from './defaults';

/**
 * Contains configurations for production builds, will extend the default configuration
 */
export const environment = {
	...defaults,
	mock: false,
	origin: 'https://cway.cisco.com',
	production: true,
};
