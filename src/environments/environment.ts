import { defaults } from './defaults';
import { mockSettings } from './mock/mock';

/**
 * Contains configurations for development builds, will extend the default configuration
 */
export const environment = {
	...defaults,
	...mockSettings,
	sdpServiceOrigin: 'https://api-stage.cisco.com',
};
