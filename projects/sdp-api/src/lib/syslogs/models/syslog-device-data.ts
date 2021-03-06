import { SyslogDeviceDetailsData } from './syslog-device-details-data';

/** Grid Data Intereface
 */
export interface SyslogDeviceData {
	count?: number;
	message?: string;
	responseData: SyslogDeviceDetailsData[];
}
