/* tslint:disable */
import {CrashCount, HighCrashRiskDeviceCount, RiskAssets} from '@sdp-api';

/** Base of URL for SDP API */

const api = '/api/customerportal/fingerprint/v1';
const riskApi = '/api/customerportal/rmc/v1';

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
	devicesCrashCount_1d: '10',
	devicesCrashCount_30d: '30',
	devicesCrashCount_7d: '70',
	devicesCrashCount_90d: '90',
};
/** The mock response for fp details */
// const aaFpDetails: HighCrashRiskDeviceCount = {
// 	customerId : '15750',
// 	crashRiskDeviceCount:15,
// };

const highCrashCount: HighCrashRiskDeviceCount = {
	customerId: "15750",
	crashRiskDeviceCount:15,
	crashPredicted:true
};


const deviceDetails: any = {
	'customerId': '2431199',
	'timePeriod': '1',
	'deviceDetails': [
	  {
		"neInstanceId": "NA,FOC1544Y1AV,WS-C2960S-24PS-L,NA",
		"neName": "1971THE2-swi-LIMDR_P5_1_SD_DR.tbc.limad.net",
		"ipAddress": "10.119.1.151",
		"productFamily": "Cisco Catalyst 2960-S Series Switches",
		"productId": "WS-C2960S-24PS-L",
		"swVersion": "12.2(55)SE3",
		"swType": "IOS",
		"serialNumber": null,
		"firstOccurrence": "July 19, 2019 06:08:31",
		"lastOccurrence": "July 28, 2019 23:26:07",
		"crashCount": 2
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
  /** The mock data for High Crash Risk Systems */
  const highCrashRiskGridData:any= {
    "customerId": "231215372",
    "count": 3,
    "crashPredicted": true,
    "devices": [{
        "deviceId": "NA,FOX2008GBAT,ASR1002-X,NA",
        "deviceName": "ASR1002-X.cisco.com",
        "productId": "ASR1002-X",
        "productFamily": "Cisco ASR 1000 Series Aggregation Services Routers",
        "softwareVersion": "16.6.4",
        "softwareType": "IOS-XE",
        "serialNumber": "FOX2008GBAT",
        "riskScore": 1.39,
        "globalRiskRank": "LOW"
    }, {
        "deviceId": "NA,FOC1645V0E6,WS-C3850-48P-E,NA",
        "deviceName": "c3850",
        "productId": "WS-C3850-48P-E",
        "productFamily": "Cisco Catalyst 3850 Series Switches",
        "softwareVersion": "16.6.2",
        "softwareType": "IOS-XE",
        "serialNumber": "FOC1645V0E6",
        "riskScore": 0.51,
        "globalRiskRank": "LOW"
    }, {
        "deviceId": "NA,FCW2146L0A3, FCW2146L02A,C9300-48UXM, C9300-48UXM,NA",
        "deviceName": "C9300-1",
        "productId": "C9300-48UXM, C9300-48UXM",
        "productFamily": "Cisco Catalyst 9300 Series Switches",
        "softwareVersion": "16.6.2",
        "softwareType": "IOS-XE",
        "serialNumber": "FCW2146L0A3, FCW2146L02A",
        "riskScore": 0.17,
        "globalRiskRank": "LOW"
    }]
}

const crashHistoryTable :any = {
	customerId: 7293498,
	deviceId: "NA,FOC2045X0WJ,WS-C3850-48U-L,NA",
	crashes: [
	{
	resetReason: "error",
	timeStamp: "August 18, 2019 19:39:49"
	},
	{
	resetReason: "crash",
	timeStamp: "August 11, 2019 23:52:42"
	},
	{
	resetReason: "crash",
	timeStamp: "August 01, 2019 10:23:54"
		}
	]}
/** The scenarios */
export const RiskScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Graph Chart Data',
					response: {
						body: allCrashDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${riskApi}/crash-count/${customerId}`,
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
		usecases: ['Use Case 4'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'HCR table Data',
					response: {
						body: highCrashRiskGridData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/crash-risk-devices/2431199?${customerId}&page=0&size=10`,
		usecases: ['Use Case 5'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'HCR table Data',
					response: {
						body: deviceDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${riskApi}/crash-detail/2431199?timePeriod=1`,
		usecases: ['Use Case 6'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'HCR table Data',
					response: {
						body: crashHistoryTable,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${riskApi}/device-frequent-crash-detail/2431199?deviceId=NA,FOC1544Y1AV,WS-C2960S-24PS-L,NA`,
		usecases: ['Use Case 7'],
	},
];
