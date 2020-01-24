/**
 * Syslog data
 */
export interface SyslogData {
	faultsCount: string;
	eventsCount: string;
}

/**
 * Syslogs severity response
 */
export interface SyslogsSeverityResponse {
	message: string;
	filterCounts: SyslogsSeverity;
}

/**
 * Syslogs severity response
 */
export interface SyslogsSeverity {
	syslogSeverity4: number;
	syslogSeverity5: number;
	syslogSeverity6: number;
	syslogSeverity7: number;
	syslogSeverity0: number;
	syslogSeverity1: number;
	syslogSeverity2: number;
	syslogSeverity3: number;
}

/**
 * Syslogs timeRange response
 */
export interface SyslogsTimeRangeResponse {
	message: string;
	filterCounts: SyslogsTimeRange;
}

/**
 * Syslogs TimeRange response
 */
export interface SyslogsTimeRange {
	days_1: number;
	days_7: number;
	days_15: number;
	days_30: number;
}

/**
 * Fault severity response
 */
export interface FaultSeverityResponse {
	message: string;
	filterCounts: FaultSeverity;
}

/**
 * Fault severity response
 */
export interface FaultSeverity {
	critical: number;
	high: number;
	medium: number;
	low: number;
	info: number;
}

/**
 * Fault State response
 */
export interface FaultStateResponse {
	message: string;
	filterCounts: FaultState;
}

/**
 * Fault State response
 */
export interface FaultState {
	Active: number;
	Inactive: number;
}
