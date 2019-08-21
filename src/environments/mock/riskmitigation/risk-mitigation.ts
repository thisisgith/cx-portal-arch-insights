/* tslint:disable */
import {CrashCount, HighCrashRiskDeviceCount, RiskAssets} from '@sdp-api';

/** Base of URL for SDP API */

const api = '/rmc/v1';

/** Default Customer ID */
const customerId = '2431199';

/** Default Asset Id */
const assetId = '231215372_NA,FXS2202Q11R,C9407R,NA_C9407R_FXS2202Q11R';

/** softwareVersion Params */
const svParams = '&pageIndex=1&pageSize=10&sort=swVersion&sortOrder=desc';
/** AssetList params */
const assetParams = '&pageIndex=1&pageSize=10&sort=hostName&sortOrder=desc&filter=';
/** The mock response for allCrashDetails */
const allCrashDetails: CrashCount = {
	customerId: '2431199',
	devicesCrashCount_1d: '0',
	devicesCrashCount_30d: '3',
	devicesCrashCount_7d: '0',
	devicesCrashCount_90d: '9',
};
/** The mock response for fp details */
// const aaFpDetails: HighCrashRiskDeviceCount = {
// 	customerId : '15750',
// 	crashRiskDeviceCount:15,
// };

const highCrashCount: HighCrashRiskDeviceCount = {
	customerId: "15750",
	crashRiskDeviceCount:5,
};


const deviceDetails: any = {
	'customerId': '2431199',
	'timePeriod': '30',
	'deviceDetails': [
	  {
		"neInstanceId": "NA,FOC1544Y1AV,WS-C2960S-24PS-L,NA",
		"neName": "1971THE2-swi-LIMDR_P5_1_SD_DR.tbc.limad.net",
		"ipAddress": "10.119.1.151",
		"productFamily": "Cisco Catalyst 2960-S Series Switches",
		"productId": "WS-C2960S-24PS-L",
		"swVersion": "12.2(55)SE3",
		"serialNumber": null,
		"firstOccurrence": "July 19, 2019 06:08:31",
		"lastOccurrence": "July 28, 2019 23:26:07",
		"crashCount": 2
	  },
	  {
		"neInstanceId": "172.20.70.230,NA,NA,NA",
		"neName": "",
		"ipAddress": "172.20.70.230",
		"productFamily": "Cisco Catalyst 2950 Series Switches",
		"productId": "NA",
		"swVersion": "",
		"serialNumber": null,
		"firstOccurrence": "July 18, 2019 12:30:30",
		"lastOccurrence": "July 18, 2019 12:30:30",
		"crashCount": 1
	  }
	]
  };


  const crashHistory:any = {
	"customerId": "2431199",
	"deviceId": "NA,FOC1544Y1AV,WS-C2960S-24PS-L,NA",
	"crashes": [
	  {
		"resetReason": "crash",
		"timeStamp": "July 28, 2019 23:26:07"
	  },
	  {
		"resetReason": "abort",
		"timeStamp": "July 19, 2019 06:08:31"
	  },
	],
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
