/** Base of URL for SDP API */

const api = '/api/customerportal/syslog/v1';
/** event count URL */
const eventCountUrl = '/events-faults/count';
/** softwareVersion URL */
const messageParams = '/syslogs';
/** syslogsMessage details URL */
const filterdetailsparams = '/syslogDetails';

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
];
