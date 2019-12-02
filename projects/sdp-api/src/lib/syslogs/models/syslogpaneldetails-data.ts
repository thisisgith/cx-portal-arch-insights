/** Device Details Table Data
 */
export interface DeviceDetailsdata {
	deviceHost: string;
	icDesc: string;
	msgDesc: string;
	msgType: string;
	recommendation: string;
	syslogSeverity: number;
	neInstanceId: string;
}

/** Device Details Inner Table Data
 */
export interface DeviceDetailsMsgData {
	SyslogMsgDesc: 'Dev Test';
	MessageCount: '987';
}
