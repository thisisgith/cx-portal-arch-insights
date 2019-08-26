import { DeviceDetailsdata } from './syslogpaneldetails-data';

/** Grid Data Intereface
 */
export interface SyslogPanelGridData {
	count?: number;
	message?: string;
	responseData: DeviceDetailsdata[];
}
