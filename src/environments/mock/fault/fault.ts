import { FaultResponse, FaultSummary, FaultAffectedSystems,
	FaultFilterData, FaultIcSettings } from '@sdp-api';

/**
 * API URL
 */
const api = '/api/customerportal/syslog/v1';

/**
 * API IC
 */
const apiIc = '/api/customerportal/afm/v1/fault/setIcSettings';

/**
 * Fault response data
 */
const getFaultData: FaultResponse = {
	afmStatus: 'Fail',
	count: 12,
	lastUpdateTime: '3h : 15m : 33s ago',
	lastUpdateDate: '',
	message: 'Success',
	offlineTime: '7Day(s) : 2h : 56m : 23s ago',
	responseData: [
		{
			category: 'Environment',
			faultSeverity: 'Critical',
			msgType: '%THERMAL_WARNING.*Temperature.*Warn',
			systemCount: 2,
			tacCount: 1,
			title: 'THERMAL_WARNING Temperature Warn',
		},
		{
			category: 'Environment',
			faultSeverity: 'High',
			msgType: '%THERMAL_WARNING.*Temperature--test',
			systemCount: 2,
			tacCount: 1,
			title: 'THERMAL_WARNING Temperature test',
		},
		{
			category: 'Environment',
			faultSeverity: 'Medium',
			msgType: '%THERMAL_WARNING.*Temperature.*Warn',
			systemCount: 2,
			tacCount: 1,
			title: 'THERMAL_WARNING Temperature Warn',
		},
		{
			category: 'Environment',
			faultSeverity: 'Low',
			msgType: '%THERMAL_WARNING.*Temperature--test',
			systemCount: 2,
			tacCount: 1,
			title: 'THERMAL_WARNING Temperature test',
		},
		{
			category: 'Environment',
			faultSeverity: 'Informational',
			msgType: '%THERMAL_WARNING.*Temperature.*Warn',
			systemCount: 2,
			tacCount: 1,
			title: 'THERMAL_WARNING Temperature Warn',
		},
		{
			category: 'Environment',
			faultSeverity: 'High',
			msgType: '%THERMAL_WARNING.*Temperature--test',
			systemCount: 2,
			tacCount: 1,
			title: 'THERMAL_WARNING Temperature test',
		},
		{
			category: 'Environment',
			faultSeverity: 'Low',
			msgType: '%THERMAL_WARNING.*Temperature.*Warn',
			systemCount: 2,
			tacCount: 1,
			title: 'THERMAL_WARNING Temperature Warn',
		},
		{
			category: 'Environment',
			faultSeverity: 'High',
			msgType: '%THERMAL_WARNING.*Temperature--test',
			systemCount: 2,
			tacCount: 1,
			title: 'THERMAL_WARNING Temperature test',
		},
		{
			category: 'Environment',
			faultSeverity: 'Low',
			msgType: '%THERMAL_WARNING.*Temperature.*Warn',
			systemCount: 2,
			tacCount: 1,
			title: 'THERMAL_WARNING Temperature Warn',
		},
		{
			category: 'Environment',
			faultSeverity: 'High',
			msgType: '%THERMAL_WARNING.*Temperature--test',
			systemCount: 2,
			tacCount: 1,
			title: 'THERMAL_WARNING Temperature test',
		},
		{
			category: 'Environment',
			faultSeverity: 'Low',
			msgType: '%THERMAL_WARNING.*Temperature.*Warn',
			systemCount: 2,
			tacCount: 1,
			title: 'THERMAL_WARNING Temperature Warn',
		},
		{
			category: 'Environment',
			faultSeverity: 'High',
			msgType: '%THERMAL_WARNING.*Temperature--test',
			systemCount: 2,
			tacCount: 1,
			title: 'THERMAL_WARNING Temperature test',
		},
	],
};

/**
 * Fault Summary data
 */
const getFaultSummaryData: FaultSummary = {
	message: 'Success',
	responseData: [
		{
			description: 'testdesc',
			faultIC: '%THERMAL_WARNING.*Temperature--test',
			impact: 'test',
			remediation: 'test1 test2 test3',
			severity: '2',
			tacEnabled: true,
		},
	],
};

/**
 * Get Fault Affected Systems Data
 */
const getFaultAffectedSystemData: FaultAffectedSystems = {
	count: 2,
	message: 'Success',
	responseData: [
		{
			alarmCreatedDate: '01/11/2019 09:52:50',
			productId: '10101',
			serialNumber: 'FCW2124B0S0',
			softwareType: 'mac',
			srStatus: '',
			systemName: 'ucseco01094p01-B',
			tacCaseCreatedDate: '01/11/2019 09:52:50',
			tacCaseNo: '686767787',
		},
		{
			alarmCreatedDate: '01/11/2019 09:52:50',
			productId: '10101',
			serialNumber: 'FCW2124B0S0',
			softwareType: 'mac',
			srStatus: '',
			systemName: 'ucseco01094p01-B',
			tacCaseCreatedDate: '',
			tacCaseNo: '',
		},
	],
};

/**
 * Get Fault filter data
 */
const getFaultFilterData: FaultFilterData = {
	message: 'Success',
	responseData: [
		{
			productId: [
				{
					count: 1,
					value: '10101',
				},
			],
			swType: [
				{
					count: 1,
					value: 'mac',
				},
			],
		},
		{
			productId: [
				{
					count: 1,
					value: '10101',
				},
			],
			swType: [
				{
					count: 1,
					value: 'mac',
				},
			],
		},
	],
};

/**
 * Get fault empty data
 */
const getFaultEmptyData: FaultResponse = {
	afmStatus: 'Fail',
	count: 0,
	lastUpdateTime: '',
	lastUpdateDate: '',
	message: 'Fail',
	offlineTime: '',
	responseData: [],
};

/**
 * update Ic settings
 */
const getUpdateIcSettings: FaultIcSettings = {
	status: null,
	statusCode: 'Ok',
	statusMessage: 'Sucessfuly updated existing record',
};

/**
 * Fault service scenarios
 */
export const FaultScenarios = [
	{
		scenarios: {
			POST: [
				{
					delay: 30,
					description: 'Fault Data',
					response: {
						body: getFaultData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/message/faults`,
		usecases: ['Fault use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 30,
					description: 'Fault Summary Data',
					response: {
						body: getFaultSummaryData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/faultSummary`,
		usecases: ['Fault use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 30,
					description: 'Fault Affected System Data',
					response: {
						body: getFaultAffectedSystemData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/affectedSystems`,
		usecases: ['Fault use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 30,
					description: 'Fault Filter Data',
					response: {
						body: getFaultFilterData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/filters/data`,
		usecases: ['Fault use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 30,
					description: 'Fault Empty Data',
					response: {
						body: getFaultEmptyData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/message/faults`,
		usecases: ['Fault use cases'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 30,
					description: 'Fault Update Ic Settings',
					response: {
						body: getUpdateIcSettings,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${apiIc}`,
		usecases: ['Fault use cases'],
	},
];
