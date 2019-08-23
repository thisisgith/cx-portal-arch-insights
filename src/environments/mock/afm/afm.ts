/**
 * Api url
 */
const api = '/pbc/solution/insights/fault-management';

/**
 * Ignored event response
 */
const getIgnoreEventData = [
	{
		connectionStatus: '',
		data: '',
		eventInfo: '',
		eventList: '',
		pagination: '',
		status: 'Success',
		statusCode: 'OK',
		statusMessage: 'Ignored',
	},
];

/**
 * Alarm data
 */
const getAfmAlarmsData = {
	aggregationsCount: '',
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
			status: 'Success',
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
	status: 'Success',
	statusCode: 'OK',
	statusMessage: '',
};

/**
 * Alarm with no status data
 */
const getAfmAlarmsNoStatusData = {
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
			status: 'Success',
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
			status: 'Success',
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
 * Get Export dada
 */
const getExportAllData = {
	connectionStatus: '',
	data: '',
	eventInfo: '',
	eventList: [
		{
			alarmCreated: '2019-08-19T14:10:30.000+0000',
			alarmId: 1218,
			customerId: '7293498',
			faultIC: '%HAS-ATAKEN-7-SESSMGR_ERROR',
			id: 0,
			raiseSr: false,
			serialNumber: 'RR777',
			severity: '1',
			status: 'Success',
			syslogMsg: '%HAS-ATAKEN-7-SESSMGR_ERROR : Ravi syslog Naren',
			tacCaseNo: '88888',
		},
		{
			alarmCreated: '2019-08-19T14:10:30.000+0000',
			alarmId: 1116,
			customerId: '7293498',
			faultIC: '%PLATFORM_THERMAL-2-UNDERTEMP_SHUTDOWN',
			id: 0,
			raiseSr: false,
			serialNumber: 'FCW2238C16W',
			severity: '1',
			status: 'Success',
			syslogMsg: '%HAS-ATAKEN-7-SESSMGR_ERROR : Ravi syslog Naren',
			tacCaseNo: '88888',
		},
	],
	pagination: '',
	status: 'Success',
	statusCode: 'OK',
	statusMessage: 'Successfully retrived records',
};

/**
 * Time range data
 */
const getTimeRangeData = {
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
			status: 'Success',
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
	status: 'Success',
	statusCode: 'OK',
	statusMessage: '',
};

/**
 * Tac case data
 */
const getTacCaseData = {
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
			status: 'Success',
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
	status: 'Success',
	statusCode: 'OK',
	statusMessage: '',
};

/**
 * Tac case data
 */
const getAfmEventData = {
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
			status: 'Success',
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
	status: 'Success',
	statusCode: 'OK',
	statusMessage: '',
};

/**
 * Search filter Info data
 */
const getSearchInfoData = {
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
			status: 'Success',
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
	status: 'Success',
	statusCode: 'OK',
	statusMessage: '',
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
					description: 'Ignored event details',
					response: {
						body: getIgnoreEventData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: getAfmAlarmsData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Use Case 2'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: getTacCaseData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Use Case 3'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: getTimeRangeData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Use Case 4'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: getAfmEventData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Use Case 5'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: getSearchInfoData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Use Case 6'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: getAfmAlarmsNoStatusData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Use Case 7'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: getExportAllData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Use Case 8'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: getAfmAlarmsFailStatusData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Use Case 9'],
	},
];
