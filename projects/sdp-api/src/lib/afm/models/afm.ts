/**
 * All the model interfaces are configured here which are using in afm service and components.
 */
import { TemplateRef } from '@angular/core';

/**
 * Alarm Object which is used to show in grid data
 * @export
 * @interface AfmResponse
 */
export interface Alarm {
	syslogMsg?: string;
	faultIC?: string;
	serialNumber?: string;
	tacCaseNo?: string;
	severity?: string;
	alarmCreated?: string;
	status?: string;
	alarmId?: number;
	remediation?: string;
	impact?: string;
	description?: string;
	cliOutput?: AfmCliOutput[];
	raiseSr?: boolean;
	hostName?: string;
	customerId?: string;  // this is a CustomerId
	errorDesc?: string;
	srStatus?: string;
}

/**
 * Response Object which is coming from rest call
 * @export
 * @interface AfmResponse
 */
export interface AfmResponse {
	statusCode?: string;
	status?: string;
	data?: string;
	statusMessage?: string;
	eventList?: Alarm[];
	eventInfo?: Alarm;
	pagination?: AfmPagination;
	connectionStatus?: AfmConnectivity;
	aggregationsCount?: Map<string, number>;
}

/**
 * Search params used to send data to rest call as body
 *
 * @export
 * @interface AfmSearchParams
 */
export interface AfmSearchParams {
	pageNumber?: number;
	pageSize?: number;
	alarmId?: number;
	customerId?: string; // this is a CustomerId
	customer?: string;
	company?: string;
	saId?: string;
	vaId?: string;
	serialNumber?: string;
	deviceIp?: string;
	hostName?: string;
	faultIC?: string;
	signatureName?: string;
	tacCase?: string;
	fromDate?: Date;
	toDate?: Date;
	alarmStatus?: string;
	firstTimeLoading?: boolean;
	noOfDaysFilter?: number;
	severityFilter?: string;
	statusFilter?: string;
	searchTerm?: string;
	sortField?: string;
	sortType?: string;
	headerFilterType?: string;
}

/**
 * Pagination Object
 *
 * @export
 * @interface AfmPagination
 */
export interface AfmPagination {
	page?: number;
	pages?: number;
	rows?: number;
	total?: number;
}

/**
 * Connectivity Objcet
 * @export
 * @interface AfmConnectivity
 */
export interface AfmConnectivity {
	status?: string;
	statusMessage?: string;
	timeInMins?: number;
}

/**
 * CliOutput Object
 * @export
 * @interface AfmCliOutput
 */
export interface AfmCliOutput {
	command?: string;
	commandResponse?: string;
	status?: string;
}

/**
 * Interface repersents graph Model data
 */
export interface AfmFilter {
	key: string;
	selected?: boolean;
	template?: TemplateRef<{ }>;
	title: string;
	loading: boolean;
	seriesData: {
		filter: string;
		label: string;
		selected: boolean;
		value: number;
	}[];
}
