/** Base of URL for SDP API */

const api = '/syslog/v1';

/** softwareVersion Params */
const messageParams = 'pageNo=1&size=10&severity=7&days=1&catalog=&includeMsgType=&excludeMsgType=';
/** AssetList params */
const assetParams = 'pageNo=1&size=10&severity=7&days=1&catalog=&asset=';
/** Device Message grid params */
const devicemessageParams = 'fromSeverity=1&toSeverity=7&days=100&device=Device_6_0_3_115';
/** Syslog grid data after filter */
// tslint:disable-next-line: max-line-length
const filterdetailsparams = 'https://cpp-api.sdp11-idev.csco.cloud/syslog/v1/syslog-view/details?days=90&msgType=CLNS-4-AUTH_FAIL&productFamily=&productId=WS-C2960S-24PS-L&severity=3&software=';
/** Syslog folters dropdown data */
// tslint:disable-next-line: max-line-length
const filtergridparam = 'https://cpp-api.sdp11-idev.csco.cloud/syslog/v1/syslog-view/filters?msgType=CLNS-4-AUTH_FAIL&filterTypes=ProductId&filterTypes=SoftwareType&filterTypes=ProductFamily';
/** The mock response for allCrashDetails */
const syslogCount: any = {
	assetsCount: '5',
	sysLogMsgCount: '10',
};

// tslint:disable-next-line: completed-docs
const syslogMessages: any = [
	{
		deviceCount: 1,
		IcDesc: 'This is syslog message description',
		MsgType: 'INTERNAL',
		Recommendation: '',
		syslogMsgCount: 25,
		SyslogSeverity: 3,
	},
	{
		deviceCount: 1,
		IcDesc: 'This is syslog message description',
		MsgType: 'INTERNAL',
		Recommendation: '',
		syslogMsgCount: 25,
		SyslogSeverity: 3,
	},
	{
		deviceCount: 1,
		IcDesc: 'This is syslog message description',
		MsgType: 'INTERNAL',
		Recommendation: '',
		syslogMsgCount: 25,
		SyslogSeverity: 3,
	},
];

// tslint:disable-next-line: completed-docs
const syslogAssets: any = {
	count: 3,
	message: 'Success',
	responseData: [{
		DeviceHost: '10.10.10.10',
		ProductFamily: 'Cisco Catalyst 2960-S Series Switches',
		ProductId: 'WS-C2960S-24PS-L',
		SoftwareType: 'IOS',
		SoftwareVersion: '12.2(53)SE2',
		syslogCount: 6,
	},
		{
			DeviceHost: '10.10.10.10',
			ProductFamily: 'Cisco Catalyst 2960-S Series Switches',
			ProductId: 'WS-C2960S-24PS-L',
			SoftwareType: 'IOS',
			SoftwareVersion: '12.2(53)SE2',
			syslogCount: 6,
		},
		{
			DeviceHost: '10.10.10.10',
			ProductFamily: 'Cisco Catalyst 2960-S Series Switches',
			ProductId: 'WS-C2960S-24PS-L',
			SoftwareType: 'IOS',
			SoftwareVersion: '12.2(53)SE2',
			syslogCount: 6,
		},
	],
};
// tslint:disable-next-line: completed-docs
const syslogdevicedetailsdata: any = [
	{
		DeviceHost: 'Device_6_0_3_115',
		IcDesc: 'Bug:This message seen when MD5 authentication is enabled in the ISIS network ',
		MessageCount: 3,
		MsgType: 'CLNS-4-AUTH_FAIL',
		Recommendation: 'Disable ISIS LSP MD5 authentication.',
		SyslogMsgDesc: 'MPLS packet received on non MPLS enabled interface',
		SyslogSeverity: 4,
		// tslint:disable-next-line: object-literal-sort-keys
		MessageDescObject: [
			{
				MessageCount: '3',
				SyslogMsgDesc: 'MPLS packet received on non MPLS',
			},
		],
	},
];
/** filterdataresponse grid */
const filterdataresponse: any = {
	count: 3,
	message: 'Success',
	responseData: [
		{
			ProductId: [
				{
					count: 6,
					value: 'WS-C2960S-24PS-L',
				},
			],
		},
		{
			SoftwareType: [
				{
					count: 6,
					value: 'IOS',
				},
			],
		},
		{
			ProductFamily: [
				{
					count: 6,
					value: 'Cisco Catalyst 2960-S Series Switches',
				},
			],
		},
	],
};

// tslint:disable-next-line: completed-docs
export const SyslogScenarios = [
	{
		scenarios: {
			GET: [
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
		url: `${api}/messages-assets/count`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: syslogMessages,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/message/details?/${messageParams}`,
		usecases: ['Use Case 2'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Details',
					response: {
						body: syslogAssets,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/asset/details/${assetParams}`,
		usecases: ['Use Case 3'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Details',
					response: {
						body: syslogAssets,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/asset/details/${assetParams}`,
		usecases: ['Use Case 4'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'DeviceDetails',
					response: {
						body: syslogdevicedetailsdata,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/asset/messages?/${devicemessageParams}`,
		usecases: ['Use Case 5'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: syslogAssets,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/syslog-view/details?/${filterdetailsparams}`,
		usecases: ['Use Case 6'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: filterdataresponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/syslog-view/filters?/${filtergridparam}`,
		usecases: ['Use Case 7'],
	},

];