/**
 * Syslog complete resoponse
 */
export interface SyslogFullResponse {
	count?: number;
	message?: string;
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