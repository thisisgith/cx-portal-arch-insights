import { defaults } from './defaults';
import { mockSettings } from './mock';

/**
 * Contains configurations for development builds, will extend the default configuration
 */
export const environment = {
	...defaults,
	...mockSettings,
};
