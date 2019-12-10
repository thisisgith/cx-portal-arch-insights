import { defaults } from './defaults';
import { mockSettings } from './mock/mock';

/**
 * Contains configurations for development builds, will extend the default configuration
 */
export const environment = {
	...defaults,
	...mockSettings,
	/**
	 * sdpServiceOrigin MUST be explicitly declared in every single environment file,
	 * because it is used inside of a module forRoot() call
	 */
	sdpServiceOrigin: 'https://api-stage.cisco.com',
};
