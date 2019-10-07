/**
 * Api url
 */
const api = '/api/customerportal/afm/v1/fault';

/**
 * Ignored event response
 */
const getIgnoreEventData = {
	aggregationsCount: null,
	connectionStatus: null,
	data: null,
	eventInfo: null,
	eventList: null,
	pagination: null,
	status: 'Success',
	statusCode: null,
	statusMessage: 'Event ignored successfully',
};

/**
 * Revert Ignored event response
 */
const getRevevtIngoredData = {
	aggregationsCount: null,
	connectionStatus: null,
	data: null,
	eventInfo: null,
	eventList: null,
	pagination: null,
	status: 'Failed',
	statusCode: null,
	statusMessage: 'Event unignored successfully',
};

/**
 * Alarm data
 */
const getAfmAlarmsData = {
	aggregationsCount: {
		alarmCount: 2,
		Day1: 0,
		Days30: 2,
		Days7: 0,
		Days90: 2,
		ignoredCount: 2,
		tacCaseCount: 1,
	},
	connectionStatus: {
		status: 'Success',
		statusMessage: 'Afm is Connected',
		timeInMins: 0,
	},
	data: null,
	eventInfo: null,
	eventList: [
		{
			alarmCreated: '2019-09-10T16:29:34.000+0000',
			alarmId: 10039,
			customerId: '2431199',
			deviceName: 'C3750G-12S',
			faultIC: '%PLATFORM_THERMAL-1-FRU_FAN_FAILURE',
			hostName: 'C3750G-12S',
			id: 0,
			raiseSr: false,
			serialNumber: 'CAT1042RG17',
			severity: '1',
			status: 'Success',
			syslogMsg: 'There is more than one failure with the Power',
		},
		{
			alarmCreated: '2019-09-09T16:17:41.000+0000',
			alarmId: 1512,
			customerId: '2431199',
			deviceName: 'Pod5-Core1',
			faultIC: '%HARDWARE-1-THERMAL_CRITICAL.*Temperature.*critical.*',
			hostName: 'Pod5-Core1',
			id: 0,
			raiseSr: false,
			serialNumber: 'FTX1512ALQK',
			severity: '1',
			status: 'Success',
			syslogMsg: 'Temperature is below minimum limit and will be immediately shut down.',
			tacCaseNo: '686571059',
		},
	],
	pagination: {
		page: 1,
		pages: 1,
		rows: 2,
		total: 2,
	},
	status: 'Success',
	statusCode: 'OK',
	statusMessage: null,
};

/**
 * Get Export dada
 */
const getExportAllData = {
	aggregationsCount: null,
	connectionStatus: null,
	data: 'Event Severity,Title,System Name,Case Number,Case Created,Status,',
	eventInfo: null,
	eventList: null,
	pagination: null,
	status: 'Success',
	statusCode: 'OK',
	statusMessage: 'Successfully retrived records',
};

/**
 * Time range data
 */
const getTimeRangeData = {
	aggregationsCount: null,
	connectionStatus: null,
	data: null,
	eventInfo: null,
	eventList: [
		{
			alarmCreated: '2019-09-10T16:29:34.000+0000',
			alarmId: 10039,
			customerId: '2431199',
			deviceName: 'C3750G-12S',
			faultIC: '%PLATFORM_THERMAL-1-FRU_FAN_FAILURE',
			hostName: 'C3750G-12S',
			id: 0,
			raiseSr: false,
			serialNumber: 'CAT1042RG17',
			severity: '1',
			status: 'Success',
			syslogMsg: 'There is more than one failure with the Power',
		},
		{
			alarmCreated: '2019-09-09T16:17:41.000+0000',
			alarmId: 1512,
			customerId: '2431199',
			deviceName: 'Pod5-Core1',
			faultIC: '%HARDWARE-1-THERMAL_CRITICAL.*Temperature.*critical.*',
			hostName: 'Pod5-Core1',
			id: 0,
			raiseSr: false,
			serialNumber: 'FTX1512ALQK',
			severity: '1',
			status: 'Success',
			syslogMsg: 'Temperature is below minimum limit and will be immediately shut down.',
			tacCaseNo: '686571059',
		},
	],
	pagination: {
		page: 1,
		pages: 1,
		rows: 2,
		total: 2,
	},
	status: 'Success',
	statusCode: 'OK',
	statusMessage: null,
};

/**
 * Tac case data
 */
const getTacCaseData = {
	aggregationsCount: {
		alarmCount: 2,
		Day1: 0,
		Days30: 2,
		Days7: 0,
		Days90: 2,
		ignoredCount: 2,
		tacCaseCount: 1,
	},
	connectionStatus: {
		status: 'Success',
		statusMessage: 'Afm is Connected',
		timeInMins: 0,
	},
	data: null,
	eventInfo: null,
	eventList: [
		{
			alarmCreated: '2019-09-09T16:17:41.000+0000',
			alarmId: 1512,
			customerId: '2431199',
			deviceName: 'Pod5-Core1',
			faultIC: '%HARDWARE-1-THERMAL_CRITICAL.*Temperature.*critical.*',
			hostName: 'Pod5-Core1',
			id: 0,
			raiseSr: false,
			serialNumber: 'FTX1512ALQK',
			severity: '1',
			status: 'Success',
			syslogMsg: 'Temperature is below minimum limit and will be immediately shut down.',
			tacCaseNo: '686571059',
		},
	],
	pagination: {
		page: 1,
		pages: 1,
		rows: 1,
		total: 1,
	},
	status: 'Success',
	statusCode: 'OK',
	statusMessage: null,
};

/**
 * Event case data
 */
const getAfmEventData = {
	aggregationsCount: null,
	connectionStatus: null,
	data: null,
	eventInfo: {
		alarmCreated: '2019-09-11T17:18:49.000+0000',
		alarmId: 10045,
		alarmSource: 'CX_COLLECTOR',
		alarmType: 'SYSLOG',
		cliOutput: [],
		contactEmail: 'vadr@cisco.com',
		customerCCOId: 'sntcuser1',
		customerId: '2431199',
		description: 'The chassis inside temperature exceeds the' +
		'max temperature threshold and will be shut down immediately.',
		deviceName: 'Pod5-Core1',
		errorDesc: 'Cisco CSOne Case Create or Update failed!\nErrorCode: 400 - ENTITLEMENT_FAILED',
		faultIC: '%PLATFORM_THERMAL-2-OVERTEMP_SHUTDOWN',
		hostName: 'Pod5-Core1',
		id: 10045,
		impact: 'The switch will power down to protect itself of actual overheating.',
		ipAddress: '192.168.50.95',
		productId: 'C9300-24P',
		productSeries: 'Cisco Catalyst 9300 Series Switches',
		raiseSr: true,
		remediation: 'Check the temperature of the room where the device is located.',
		serialNumber: 'FCW2238C16W',
		severity: '2',
		srStatus: 'Failed',
		status: 'Success',
		syslogMsg: 'Sep 11 22:51:05 192.168.50.95 %PLATFORM_THERMAL-2-OVERTEMP_SHUTDOWN',
		tacSeverity: '3',
	},
	eventList: null,
	pagination: null,
	status: 'Success',
	statusCode: 'OK',
	statusMessage: 'Successfully fetched the event',
};

/**
 * Search filter Info data
 */
const getSearchInfoData = {
	aggregationsCount: {
		alarmCount: 2,
		Day1: 0,
		Days30: 2,
		Days7: 0,
		Days90: 2,
		ignoredCount: 0,
		tacCaseCount: 0,
	},
	connectionStatus: '',
	data: '',
	eventInfo: '',
	eventList: [
		{
			alarmCreated: '2019-08-19T14:10:30.000+0000',
			alarmId: 1218,
			customerId: '231215372',
			faultIC: '%HAS-ATAKEN-7-SESSMGR_ERROR',
			id: 0,
			raiseSr: false,
			serialNumber: 'RR777',
			severity: '1',
			status: 'success',
			syslogMsg: '%HAS-ATAKEN-7-SESSMGR_ERROR : Ravi syslog Naren',
			tacCaseNo: '88888',
		},
	],
	pagination: [
		{
			ignoredEventCount: 0,
			page: 1,
			pages: 1,
			rows: 9,
			total: 9,
			totalTacCases: 0,
		},
	],
	status: 'success',
	statusCode: 'OK',
	statusMessage: '',
};

/**
 * Alarm with no status data
 */
const getAfmAlarmsNoStatusData = {
	aggregationsCount: {
		alarmCount: 2,
		Day1: 0,
		Days30: 2,
		Days7: 0,
		Days90: 2,
		ignoredCount: 0,
		tacCaseCount: 0,
	},
	connectionStatus: '',
	data: '',
	eventInfo: '',
	eventList: [
		{
			alarmCreated: '2019-08-19T14:10:30.000+0000',
			alarmId: 1218,
			customerId: '231215372',
			faultIC: '%HAS-ATAKEN-7-SESSMGR_ERROR',
			id: 0,
			raiseSr: false,
			serialNumber: 'RR777',
			severity: '1',
			status: 'success',
			syslogMsg: '%HAS-ATAKEN-7-SESSMGR_ERROR : Ravi syslog Naren',
			tacCaseNo: '88888',
		},
	],
	pagination: [
		{
			ignoredEventCount: 0,
			page: 1,
			pages: 1,
			rows: 9,
			total: 9,
			totalTacCases: 0,
		},
	],
	status: '',
	statusCode: 'OK',
	statusMessage: '',
};

/**
 * Alarm with Failed status data
 */
const getAfmAlarmsFailStatusData = {
	aggregationsCount: {
		alarmCount: 2,
		Day1: 0,
		Days30: 2,
		Days7: 0,
		Days90: 2,
		ignoredCount: 0,
		tacCaseCount: 0,
	},
	connectionStatus: '',
	data: '',
	eventInfo: '',
	eventList: [
		{
			alarmCreated: '2019-08-19T14:10:30.000+0000',
			alarmId: 1218,
			customerId: '231215372',
			faultIC: '%HAS-ATAKEN-7-SESSMGR_ERROR',
			id: 0,
			raiseSr: false,
			serialNumber: 'RR777',
			severity: '1',
			status: 'success',
			syslogMsg: '%HAS-ATAKEN-7-SESSMGR_ERROR : Ravi syslog Naren',
			tacCaseNo: '88888',
		},
	],
	pagination: [
		{
			ignoredEventCount: 0,
			page: 1,
			pages: 1,
			rows: 9,
			total: 9,
			totalTacCases: 0,
		},
	],
	status: 'Fail',
	statusCode: 'OK',
	statusMessage: '',
};

/**
 * Failed to Get Export dada
 */
const getFailedExportAllData = {
	aggregationsCount: {
		alarmCount: 2,
		Day1: 0,
		Days30: 2,
		Days7: 0,
		Days90: 2,
		ignoredCount: 0,
		tacCaseCount: 0,
	},
	connectionStatus: '',
	data: '',
	eventInfo: '',
	eventList: [],
	pagination: '',
	status: 'fail',
	statusCode: 'OK',
	statusMessage: 'failed retrived records',
};

/**
 * Failed to Get Export dada
 */
const getExceptionExportAllData = {
	aggregationsCount: {
		alarmCount: 2,
		Day1: 0,
		Days30: 2,
		Days7: 0,
		Days90: 2,
		ignoredCount: 0,
		tacCaseCount: 0,
	},
	connectionStatus: '',
	data: '',
	eventInfo: '',
	eventList: [],
	pagination: '',
	status: 'Exception',
	statusCode: 'OK',
	statusMessage: 'Server is down, please try again.',
};

/**
 * Afm service scenarios
 */
export const AfmScenarios = [
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Alarms Data',
					response: {
						body: getAfmAlarmsData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/alarms`,
		usecases: ['AFM use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Ignored event details',
					response: {
						body: getIgnoreEventData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/ignoreevent`,
		usecases: ['AFM use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Tac Case Data',
					response: {
						body: getTacCaseData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/taccases`,
		usecases: ['AFM use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Time Range Data',
					response: {
						body: getTimeRangeData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/timerangefilter`,
		usecases: ['AFM use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Event Data',
					response: {
						body: getAfmEventData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/event`,
		usecases: ['AFM use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Search Info',
					response: {
						body: getSearchInfoData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['AFM use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Alarms No Status Data',
					response: {
						body: getAfmAlarmsNoStatusData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['AFM use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Export all',
					response: {
						body: getExportAllData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/exportall/`,
		usecases: ['AFM use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Alarms Failed Status Data',
					response: {
						body: getAfmAlarmsFailStatusData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['AFM use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Revert Ignored Data',
					response: {
						body: getRevevtIngoredData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/revertignoreevent`,
		usecases: ['AFM use cases'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Export Data',
					response: {
						body: getFailedExportAllData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['AFM use cases'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Export all',
					response: {
						body: getExceptionExportAllData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/exportall/`,
		usecases: ['AFM use cases'],
	},
];
