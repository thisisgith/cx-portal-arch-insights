/* tslint:disable */
import {RccData, RccGridData, RccAssetGridData} from '@sdp-api';

/** Base of URL for SDP API */

const api = 'compliance/v1/service/';

/** Default Customer ID */
const customerId = '90019449';

/** Default Asset Id */
const assetId = '231215372_NA,FXS2202Q11R,C9407R,NA_C9407R_FXS2202Q11R';

/** softwareVersion Params */
const violationParams = '&pageIndex=1&pageSize=10&sort=swVersion&sortOrder=desc';
/** AssetList params */
const assetParams = '&pageIndex=1&pageSize=10&sort=hostName&sortOrder=desc&filter=';
/** The mock response for violation grid data */
const violationGridData: any = {
	 "message": "SUCCESS",
	 "data": {
	 	"summary": [{
	 		"ruleseverity": "P3",
	 		"policygroupid": "PCI_IOS_XE_GROUP",
	 		"policyid": "_AAA_Authentication__Login__IOSXE_",
	 		"ruleid": "_All_authentication_methods_should_ask_Username_And_Password__IOSXE_",
	 		"policyname": "AAA Authentication - Login [ IOS-XE ]",
	 		"ruletitle": "All authentication methods should ask Username And Password [ IOS-XE ]",
	 		"violationcount": 7,
	 		"impassets": 7,
	 		"policycategory": "AAA Services"
	 	}, {
	 		"ruleseverity": "P3",
	 		"policygroupid": "PCI_IOS_XE_GROUP",
	 		"policyid": "_AAA_Authentication__Login__IOSXE_",
	 		"ruleid": "_Minimum_Number_of_RADIUS_Servers_to_be_used_for_User_Authentication__IOSXE_",
	 		"policyname": "AAA Authentication - Login [ IOS-XE ]",
	 		"ruletitle": "Minimum Number of RADIUS Servers to be used for User Authentication [ IOS-XE ]",
	 		"violationcount": 7,
	 		"impassets": 7,
	 		"policycategory": "AAA Services"
	 	}],
	 	"impassets": 7,
	 	"violationcount": 77,
	 	"customerId": "90019449"
	 },
	 "error": null
};
/** The mock response for asset grid data */
const assetGridData: any = {
	"message": "SUCCESS",
	 "data": {
	 	"assetData": [{
			"deviceName": "border_2.dnaauto.cisco.com",
			"ipaddress": "10.109.1.122",
			"lastScan": "2019-06-01T09:27:32.482",
			"criticalAdvisories": null,
			"supportCovered": false,
			"serialNumber": "FOC2246Z0MU",
			"osType": "IOS",
			"osVersion": "12.2(53)SE2",
			"role": "ACCESS",
			"contractNumber": "UNKNOWN",
			"managedNeId": "NA,FOC1446W5E3,WS-C2960S-24PS-L,NA",
			"hwInstanceId": "FOC1446W5E3,WS-C2960S-24PS-L,NA,FOC1446W5E3,WS-C2960S-24PS-L,NA,NA",
			"containingHwId": "FOC1844X089,WS-C3850-24S,NA,FOC1844X089,WS-C3850-24S,NA,NA",
			"productId": "WS-C2960S-24PS-L",
			"equipmentType": "CHASSIS",
			"violationCount": 0,
			"severity":"p1"
		}],
	 },
};

const rccPolicyRuleDetailsData:any = {
	"status": 200,
	"message": "SUCCESS",
	"data": {
		"deviceFilterDetails": {
			"productFamily": ["Cisco Catalyst 9300 Series Switches"],
			"productModel": ["C9300-24P"],
			"osName": ["IOSXE"]
		},
		"customerId": "90019449",
		"rule": {
			"name": "Check if configured number of NTP servers is present [ IOS-XE ]",
			"desc": "All devices in the network should be configured to synchronize their times with an authoritative NTP Server. It is recommended that the border router be configured to synchronize time from at least two reliable NTP servers and all the devices in the protected network can be configured as clients to this border router.\n<br>\n<br>\n<b>Implementation details </b>\n<br>\n<br>\nRule checks for the count of occurences of  <i>‘ntp server hostname or ipaddress </i> command in configuration and compares with user input.\n<br>\n<br>\nRaises violation if user input count differs with servers count present in configuration\n<br>\n<br>\nFix CLI\n<br>\n<br>\nNA\n<br>",
			"recommendedAction": "Configure the device to synchronize clock from the desired NTP servers using the command \n<br><br>\n<i>ntp server</i>\n<br>\n<br>",
			"ruleId": "_Check_if_configured_number_of_NTP_servers_is_present__IOSXE_"
		},
		"policy": {
			"desc": "The Network Time Protocol (NTP) is a protocol designed to time-synchronize a network of machines. NTP is designed to make time synchronization automatic and efficient across all devices in the network. Having accurate time is important for security, especially for intrusion and forensic analysis.",
			"group": "HIPAA_IOS_XE_GROUP",
			"name": "NTP Configuration [ IOS-XE ]",
			"category": "Global Configuration",
			"policyId": "_NTP_Configuration__IOSXE_"
		}
	},
	"error": null
};

const rccViolationDetailsData: any = {
	"status": 200,
	"message": "SUCCESS",
	"data": {
		"customerId": "90019449",
		"impactedAssetsCount": 1,
		"impactedAssets": [{
			"deviceId": "12345",
			"hostName": "border_1.dnaauto.cisco.com",
			"ipAddress": "172.16.0.1",
			"productFamily": "Cisco Catalyst 9300 Series Switches",
			"productModel": "C9300-24P",
			"osName": "IOSXE",
			"osVersion": "swVersion",
			"violationCount": 10,
			"violations": [{
				"message": "NTP Servers are not configured",
				"suggestedfix": "",
				"age": 0,
				"severity": "P1"
			}, {
				"message": "NTP Servers are not configured",
				"suggestedfix": "",
				"age": 0,
				"severity": "P3"
			}]
		}]
	},
	"error": null
};

const violationFilterData:any = {
	"status": 200,
	"message": "SUCCESS",
	"data": {
		"severityFilters": [{
			"filter": "P3",
			"percentage": 100,
			"label": "P3",
			"value": 138
		}],
		"customerId": "90019449",
		"policyFilters": [{
			"filter": "PCI",
			"percentage": 56,
			"label": "PCI",
			"value": 77
		}, {
			"filter": "HIPAA",
			"percentage": 44,
			"label": "HIPAA",
			"value": 61
		}],
		"assetCount": 11,
		"policyViolationCount": 138
	},
	"error": null
};

const assetFilterData: any = {
	"status": 200,
	"message": "SUCCESS",
	"data": {
		"severityList": [
			{
				"filter": "P3",
				"percentage": "98.49",
				"label": "P3",
				"value": 391
			},
			{
				"filter": "P1",
				"percentage": "0.5",
				"label": "P1",
				"value": 2
			},
			{
				"filter": "P2",
				"percentage": "0.5",
				"label": "P2",
				"value": 2
			},
			{
				"filter": "P4",
				"percentage": "0.25",
				"label": "P4",
				"value": 1
			},
			{
				"filter": "P5",
				"percentage": "0.25",
				"label": "P5",
				"value": 1
			}
		],
		"ostypeList": [
			{
				"filter": "IOSXE",
				"percentage": "92.45",
				"label": "IOSXE",
				"value": 490
			},
			{
				"filter": "WLC",
				"percentage": "7.55",
				"label": "WLC",
				"value": 40
			}
		]
	},
};
/** The scenarios */
export const ComplianceScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: violationGridData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/violation-summary/${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: assetGridData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/asset-detail/${customerId}`,
		usecases: ['Use Case 2'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Details',
					response: {
						body: rccPolicyRuleDetailsData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/summary-filters/${customerId}`,
		usecases: ['Use Case 3'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Details',
					response: {
						body: rccViolationDetailsData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/policy-rule-details/${customerId}`,
		usecases: ['Use Case 4'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Details',
					response: {
						body: violationFilterData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/violation-details/${customerId}`,
		usecases: ['Use Case 5'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Details',
					response: {
						body: assetFilterData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/severity-ostype-detail/${customerId}`,
		usecases: ['Use Case 6'],
	},
];
