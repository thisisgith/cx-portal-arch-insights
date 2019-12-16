/**
 * Search params used to send data to rest call as body
 *
 * @exports
 * @interface faultSearchParams
 */
export interface FaultSearchParams {
	contractLevel?: string;
	customerId: string;
	fromDate?: string;
	toDate?: string;
	syslogSeverity?: string;
	systemFilter?: string;
	localSearch?: string;
	sortField?: string;
	sortOrder?: string;
	pageNo?: number;
	vaId?: string;
	useCase?: string;
	solution?: string;
	size?: number;
	eventType?: string;
	software?: string;
	productId?: string;
	tacEnabled?: string;
	days?: number;
	filterTypes?: string;
	faultSeverity?: string;
	lastUpdateTime?: string;
	msgType?: string;
}

/**
 * Search params used to send data to rest call as body for Update IC settings
 *
 * @exports
 * @interface FaultICSearchParams
 */
export interface FaultICSearchParams {
	syslogsignature: string;
	enable: boolean;
}

/**
 * Fault response
 * @exports
 * @interface FaultResponse
 */
export interface FaultResponse {
	afmStatus: string;
	count: number;
	lastUpdateTime: string;
	lastUpdateDate: string;
	offlineTime: string;
	message: string;
	responseData: FaultGridData[];
}

/**
 * Fault summary
 * @exports
 * @interface FaultSummary
 */
export interface FaultSummary {
	message: string;
	responseData: FaultSummaryDetails[];
}

/**
 * Fault Affeceted systems
 *
 * @exports
 * @interface FaultAffectedSystems
 */
export interface FaultAffectedSystems {
	count: number;
	message: string;
	responseData: FaultAffectedSystemDetails[];
}

/**
 * Fault Filters data
 *
 * @exports
 * @interface FaultFilterData
 */
export interface FaultFilterData {
	message: string;
	responseData: FaultFilter[];
}

/**
 * Fault Grid information
 *
 * @exports
 * @interface FaultGridData
 */
export interface FaultGridData {
	category: string;
	tacCount: number;
	systemCount: number;
	msgType: string;
	faultSeverity: string;
	title: string;
}

/**
 * Fault summary details
 *
 * @exports
 * @interface FaultSummaryDetails
 */
export interface FaultSummaryDetails {
	severity: string;
	remediation: string;
	impact: string;
	description: string;
	faultIC: string;
	tacEnabled: boolean;
}

/**
 * Fault Affected system details
 *
 * @exports
 * @interface FaultAffectedSystemDetails
 */
export interface FaultAffectedSystemDetails {
	systemName: string;
	serialNumber: string;
	productId: string;
	softwareType: string;
	srStatus: string;
	tacCaseNo: string;
	alarmCreatedDate: string;
	tacCaseCreatedDate: string;
}

/**
 * Fault details filter
 * @exports
 * @interface FaultFilter
 */
export interface FaultFilter {
	productId: FaultProductId[];
	swType: FaultSwType[];
}

/**
 * Product Id for the fault details filter
 *
 * @exports
 * @interface FaultProductId
 */
export interface FaultProductId {
	value: string;
	count: number;
}

/**
 * OS for the fault details filter
 *
 * @exports
 * @interface FaultOS
 */
export interface FaultSwType {
	value: string;
	count: number;
}

/**
 * Ic settings response
 *
 * @exports
 * @interface FaultIcSettings
 */
export interface FaultIcSettings {
	status: number;
	statusCode: string;
	statusMessage: string;
}
