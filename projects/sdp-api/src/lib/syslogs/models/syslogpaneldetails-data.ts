/** Device Details Table Data
 */
export interface DeviceDetailsdata {
	msgCount: number;
	MsgType: string;
	DeviceId: string;
	MsgDesc: string;
	ProductId: number;
	ProductFamily: string;
	SoftwareType: string;
	SoftwareVersion: string;
	MessageDescObject: DeviceDetailsMsgData[];
}

/** Device Details Inner Table Data
 */
export interface DeviceDetailsMsgData {
	SyslogMsgDesc: 'Dev Test';
	MessageCount: '987';
}
