import { DeviceMessageDescObject } from './syslogdevicepanelmessageobject-data';

/** Device Details panel Grid Data Intereface
 */
export interface SyslogDevicePanelData {
	Syslogtabledat?: SyslogDevicePanelOuter[ ];
	Messageobject?: DeviceMessageDescObject[ ];
}

/**
 * Syslog devicePanel outer
 */
export interface SyslogDevicePanelOuter {
	SyslogSeverity?: number;
	showMessage?: boolean;
	DeviceHost?: number;
	SyslogMsgDesc?: number;
	IcDesc?: string;
	Recommendation?: string;
	MessageCount?: number;
	MsgType?: string;
	MessageDescObject?: DeviceMessageDescObject[ ];

}
