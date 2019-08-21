import { DeviceDetailsdata } from './syslog360details-data';

/** Grid Data Intereface
 */
export interface Syslog360GridData {
	count?: number;
	message?: string;
	responseData: DeviceDetailsdata[];
}
