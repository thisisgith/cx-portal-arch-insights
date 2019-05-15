import { defaults } from './defaults';
import { mockSettings } from './mock';

/**
 * Stage Internal origin
 */
const origin = 'https://apollo-stage.cisco.com';

/**
 * Contains configurations for production builds, will extend the default configuration
 * and currently the mock configuration
 */
export const environment = {
	...defaults,
	...mockSettings,
	origin,
	production: true,
};
