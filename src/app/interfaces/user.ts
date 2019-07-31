import { EntitledUser, ServiceInfo } from '@sdp-api';

/**
 * Interface representing our User
 */
export interface User {
	info: EntitledUser;
	service: ServiceInfo;
}
