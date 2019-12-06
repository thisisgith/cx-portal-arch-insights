/**
 * Syslog category data
 */
export interface SyslogCategoryData {
	message: string;
	responseData: SyslogCategoryList[];
}

/**
 * Syslog category List
 */
export interface SyslogCategoryList {
	name: string;
	value: string;
}

/**
 * Syslog category to push to fault
 */
export interface PushToFaultResponse {
	statusMessage: string;
	statusCode: string;
}
