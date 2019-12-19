/**
 * Syslog complete resoponse
 */
export interface SyslogResponseData {
	count?: number;
	message?: string;
	lastUpdateTime?: string;
	responseData: SyslogGridData[];
}

/**
 * Syslog grid data
 */
export interface SyslogGridData {
	msgType: string;
	severity: number;
	deviceHost: string;
	timestamp: string;
	id: string;
}
