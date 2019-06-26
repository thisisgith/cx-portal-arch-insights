import { defaults } from './defaults';

/**
 * Contains configurations for production builds, will extend the default configuration
 */
export const environment = {
	...defaults,
	origin: 'https://cway.cisco.com',
	production: true,
	sdpServiceOrigin: 'https://api-stage.cisco.com',
};
