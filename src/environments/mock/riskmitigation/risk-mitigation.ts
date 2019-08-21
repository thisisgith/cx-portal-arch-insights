import { CrashCount, HighCrashRiskDeviceCount } from '@sdp-api';

/** Base of URL for SDP API */

const api = '/rmc/v1';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for allCrashDetails */
const allCrashDetails: CrashCount = {
	customerId: '2431199',
	devicesCrashCount_1d: '0',
	devicesCrashCount_30d: '3',
	devicesCrashCount_7d: '0',
	devicesCrashCount_90d: '9',
};

/** the mock for HighCrashRiskDeviceCount */
const highCrashCount: HighCrashRiskDeviceCount = {
	crashRiskDeviceCount: 5,
	customerId: '15750',
};

/** the mock for deviceDetails */
const deviceDetails: object = {
	customerId: '2431199',
	deviceDetails: [
	  {
		  crashCount: 2,
		  firstOccurrence: 'July 19, 2019 06:08:31',
		  ipAddress: '10.119.1.151',
		  lastOccurrence: 'July 28, 2019 23:26:07',
		  neInstanceId: 'NA,FOC1544Y1AV,WS-C2960S-24PS-L,NA',
		  neName: '1971THE2-swi-LIMDR_P5_1_SD_DR.tbc.limad.net',
		  productFamily: 'Cisco Catalyst 2960-S Series Switches',
		  productId: 'WS-C2960S-24PS-L',
		  serialNumber: null,
		  swVersion: '12.2(55)SE3',
	  },
	  {
		  crashCount: 1,
		  firstOccurrence: 'July 18, 2019 12:30:30',
		  ipAddress: '172.20.70.230',
		  lastOccurrence: 'July 18, 2019 12:30:30',
		  neInstanceId: '172.20.70.230,NA,NA,NA',
		  neName: '',
		  productFamily: 'Cisco Catalyst 2950 Series Switches',
		  productId: 'NA',
		  serialNumber: null,
		  swVersion: '',
	  },
	],
	timePeriod: '30',
};

/** the mock for crashHistory */
const crashHistory: object = {
	crashes: [
		{
			resetReason: 'crash',
			timeStamp: 'July 28, 2019 23:26:07',
	  },
	  {
		  resetReason: 'abort',
		  timeStamp: 'July 19, 2019 06:08:31',
	  },
	],
	customerId: '2431199',
	deviceId: 'NA,FOC1544Y1AV,WS-C2960S-24PS-L,NA',
};

/** The scenarios */
export const RiskScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: allCrashDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/crash-count/${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: highCrashCount,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/crash-risk-device-count/${customerId}`,
		usecases: ['Use Case 2'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Details',
					response: {
						body: deviceDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/crash-risk-device-count/${customerId}`,
		usecases: ['Use Case 3'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Details',
					response: {
						body: crashHistory,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/crash-risk-device-count/${customerId}`,
		usecases: ['Use Case 2'],
	},
];
