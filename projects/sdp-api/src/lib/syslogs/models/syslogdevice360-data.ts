import { DeviceMessageDescObject } from './syslogdevice360messageobject-data';

/** Device Details 360 Grid Data Intereface
 */
export interface SyslogDevice360Data {
	Syslogtabledat?: SyslogDevice360Outer[ ];
	Messageobject?: DeviceMessageDescObject[ ];
}

/**
 * Syslog device360 outer
 */
export interface SyslogDevice360Outer {
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
