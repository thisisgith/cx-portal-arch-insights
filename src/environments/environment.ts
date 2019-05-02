import { defaults } from './defaults';
import { mock } from './mock';

/**
 * Contains configurations for development builds, will extend the default configuration
 */
export const environment = {
	...defaults,
	...mock,
};
