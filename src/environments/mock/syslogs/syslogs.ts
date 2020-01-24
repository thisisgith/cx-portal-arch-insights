import { SyslogsSeverityResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/syslog/v1';
/** event count URL */
const eventCountUrl = '/events-faults/count';
/** Syslogs Grid URL */
const messageParams = '/syslogs';
/** syslogsMessage details URL */
const filterdetailsparams = '/syslogDetails';
/** getCategory URL */
const categoryListParams = '/findallCategory';
/** MovetoFaults URL */
const moveToFaultsParams = '/afm/v1/fault/pushtoAFM';
const syslogSeverityPath = '/syslogSeverityCounts';
const syslogTimeRangePath = '/syslogTimeRangeCounts';
const faultSeverityPath = '/faultSeverityCount';
const faultStatePath = '/tacEnabledCount';
const faultTimeRangePath = '/faultTimeIntervalCount';
/** The mock response for syslogCount */
const syslogCount: any = {
	faultsCount: '10',
	eventsCount: '5',
};

/** The mock data for syslogMessages */
const syslogMessages: any = {
	count: 11,
	message: 'Success',
	responseData: [
		{
			deviceHost: '10.126.77.250',
			msgDesc: 'MPLS packet received on non MPLS enabled interface',
			msgType: 'RP-6-REDMODE',
			syslogId: 'qQGTOm4BrWkCTzuIUFLA',
			syslogSeverity: 0,
			timestamp: '2019-10-30T04:37:31.031-07:00',
		},
		{
			deviceHost: '10.126.77.250',
			msgDesc: 'MPLS packet received on non MPLS enabled interface',
			msgType: 'RP-6-REDMODE',
			syslogId: 'qQGTOm4BrWkCTzuIUFLA',
			syslogSeverity: 1,
			timestamp: '2019-10-30T04:37:31.031-07:00',
		},
		{
			deviceHost: '10.126.77.250',
			msgDesc: 'MPLS packet received on non MPLS enabled interface',
			msgType: 'RP-6-REDMODE',
			syslogId: 'qQGTOm4BrWkCTzuIUFLA',
			syslogSeverity: 2,
			timestamp: '2019-10-30T04:37:31.031-07:00',
		},
		{
			deviceHost: '10.126.77.250',
			msgDesc: 'MPLS packet received on non MPLS enabled interface',
			msgType: 'RP-6-REDMODE',
			syslogId: 'qQGTOm4BrWkCTzuIUFLA',
			syslogSeverity: 3,
			timestamp: '2019-10-30T04:37:31.031-07:00',
		},
		{
			deviceHost: '10.126.77.250',
			msgDesc: 'MPLS packet received on non MPLS enabled interface',
			msgType: 'RP-6-REDMODE',
			syslogId: 'qQGTOm4BrWkCTzuIUFLA',
			syslogSeverity: 4,
			timestamp: '2019-10-30T04:37:31.031-07:00',
		},
		{
			deviceHost: '10.126.77.250',
			msgDesc: 'MPLS packet received on non MPLS enabled interface',
			msgType: 'RP-6-REDMODE',
			syslogId: 'qQGTOm4BrWkCTzuIUFLA',
			syslogSeverity: 5,
			timestamp: '2019-10-30T04:37:31.031-07:00',
		},
		{
			deviceHost: '10.126.77.250',
			msgDesc: 'MPLS packet received on non MPLS enabled interface',
			msgType: 'RP-6-REDMODE',
			syslogId: 'qQGTOm4BrWkCTzuIUFLA',
			syslogSeverity: 6,
			timestamp: '2019-10-30T04:37:31.031-07:00',
		},
		{
			deviceHost: '10.126.77.250',
			msgDesc: 'MPLS packet received on non MPLS enabled interface',
			msgType: 'RP-6-REDMODE',
			syslogId: 'qQGTOm4BrWkCTzuIUFLA',
			syslogSeverity: 7,
			timestamp: '2019-10-30T04:37:31.031-07:00',
		},
		{
			deviceHost: '10.126.77.250',
			msgDesc: 'MPLS packet received on non MPLS enabled interface',
			msgType: 'RP-6-REDMODE',
			syslogId: 'qQGTOm4BrWkCTzuIUFLA',
			syslogSeverity: 6,
			timestamp: '2019-10-30T04:37:31.031-07:00',
		},
		{
			deviceHost: '10.126.77.250',
			msgDesc: 'MPLS packet received on non MPLS enabled interface',
			msgType: 'RP-6-REDMODE',
			syslogId: 'qQGTOm4BrWkCTzuIUFLA',
			syslogSeverity: 7,
			timestamp: '2019-10-30T04:37:31.031-07:00',
		},
		{
			deviceHost: '10.126.77.250',
			msgDesc: 'MPLS packet received on non MPLS enabled interface',
			msgType: 'RP-6-REDMODE',
			syslogId: 'qQGTOm4BrWkCTzuIUFLA',
			syslogSeverity: 7,
			timestamp: '2019-10-30T04:37:31.031-07:00',
		},
	],
};
/** The mock data for syslogDetail */
const syslogDetail: any = {
	count: 1,
	message: 'Success',
	responseData: [
		{
			deviceHost: '10.126.77.250',
			icDesc: 'This message says the Operating redundancy mode',
			msgDesc: 'MPLS packet received on non MPLS enabled interface - L3',
			msgType: 'RP-6-REDMODE',
			recommendation: 'The secondary has been reset and should reload back',
			syslogSeverity: 0,
		},
	],

};
/** The mock data for syslogDetail */
const categoryListData: any = {
	message: 'Success',
	responseData: [
			{ name: 'Management', value: 'Management' },
			{ name: 'Forwarding', value: 'Forwarding' },
	],
};
/** The mock response for pushToFault */
const pushToFaultResponse: any = {
	statusCode: 'OK',
	statusMessage: 'Signature is pushed from Syslog to AFM',
};
/** The mock response for syslogServerityCount */
const syslogServerityCount: SyslogsSeverityResponse = {
	message: 'Success',
	filterCounts: {
		syslogSeverity4: 50,
		syslogSeverity5: 41,
		syslogSeverity6: 55,
		syslogSeverity7: 3,
		syslogSeverity0: 5,
		syslogSeverity1: 74,
		syslogSeverity2: 38,
		syslogSeverity3: 102,
	},
};
/** The mock response for timeRangeCount */
const timeRangeCount: any = {
	message: 'Success',
	filterCounts: {
		days_1: 0,
		days_7: 368,
		days_15: 368,
		days_30: 368,
	},
};
/** The mock response for faultStateCount */
const faultStateCount: any = {
	message: 'Success',
	filterCounts: {
		Active: 3,
		Inactive: 1,
	},
};
/** The mock response for faultStateCount */
const faultSeverityCount: any = {
	message: 'Success',
	filterCounts: {
		critical: 3,
		high: 1,
		medium: 4,
		low: 2,
		informational: 5,

	},
};
/** SyslogScenarios */
export const SyslogScenarios = [
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: syslogCount,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}${eventCountUrl}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Message Grid',
					response: {
						body: syslogMessages,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}${messageParams}`,
		usecases: ['Use Case 2'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: syslogDetail,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}${filterdetailsparams}`,
		usecases: ['Syslogs Details'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'CategoryList',
					response: {
						body: categoryListData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}${categoryListParams}`,
		usecases: ['CategoryList'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Push To Fault',
					response: {
						body: pushToFaultResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${moveToFaultsParams}`,
		usecases: ['Push To Fault'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Syslogs severity',
					response: {
						body: syslogServerityCount,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}${syslogSeverityPath}`,
		usecases: ['Syslogs severity'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Syslogs timeRange',
					response: {
						body: timeRangeCount,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}${syslogTimeRangePath}`,
		usecases: ['Syslogs timeRange'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Fault Severity',
					response: {
						body: faultSeverityCount,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}${faultSeverityPath}`,
		usecases: ['Fault Severity'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Fault State',
					response: {
						body: faultStateCount,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}${faultStatePath}`,
		usecases: ['Fault State'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'Fault timeRange',
					response: {
						body: timeRangeCount,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}${faultTimeRangePath}`,
		usecases: ['Fault timeRange'],
	},
];
