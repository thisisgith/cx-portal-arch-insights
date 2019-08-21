/* tslint:disable */
import { RccData, RccGridData, RccAssetGridData } from '@sdp-api';

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

const violationDetails : any = {
	"status": 200,
	"message": "SUCCESS",
	"data": {
	  "customerId": "90019449",
	  "impactedAssetsCount": 7,
	  "impactedAssets": [
		{
		  "deviceId": "NA,FCW2246E0PB,C9300-24P,NA",
		  "hostName": "border_1.dnaauto.cisco.com",
		  "ipAddress": "172.16.0.1",
		  "productFamily": "Cisco Catalyst 9300 Series Switches",
		  "productModel": "C9300-24P",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		},
		{
		  "deviceId": "NA,FOC2246Z0MU,C9300-24P,NA",
		  "hostName": "border_2.dnaauto.cisco.com",
		  "ipAddress": "172.16.0.2",
		  "productFamily": "Cisco Catalyst 9300 Series Switches",
		  "productModel": "C9300-24P",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		},
		{
		  "deviceId": "NA,9NW3OP1G1S7,CSR1000V,NA",
		  "hostName": "csr1000v_1.dnaauto.cisco.com",
		  "ipAddress": "10.122.21.7",
		  "productFamily": "Cisco Cloud Services Router 1000V Series",
		  "productModel": "CSR1000V",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		},
		{
		  "deviceId": "NA,602247, E602247, H602247,C9300-24UX, C9300-24UX, C9300-24UX,NA",
		  "hostName": "Device_6_0_2_247",
		  "ipAddress": "6.0.2.247",
		  "productFamily": "Cisco Catalyst 9300 Series Switches",
		  "productModel": "C9300-24UX, C9300-24UX, C9300-24UX",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		},
		{
		  "deviceId": "NA,FOC2246Q0T2,C9300-24P,NA",
		  "hostName": "edge_1.dnaauto.cisco.com",
		  "ipAddress": "172.16.0.4",
		  "productFamily": "Cisco Catalyst 9300 Series Switches",
		  "productModel": "C9300-24P",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		},
		{
		  "deviceId": "NA,FCW2246E0PE,C9300-24P,NA",
		  "hostName": "edge_2.dnaauto.cisco.com",
		  "ipAddress": "172.16.0.5",
		  "productFamily": "Cisco Catalyst 9300 Series Switches",
		  "productModel": "C9300-24P",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		},
		{
		  "deviceId": "NA,FOC2246Z0MW,C9300-24P,NA",
		  "hostName": "fusion_shared_serv.dnaauto.cisco.com",
		  "ipAddress": "172.16.0.3",
		  "productFamily": "Cisco Catalyst 9300 Series Switches",
		  "productModel": "C9300-24P",
		  "osName": "IOSXE",
		  "osVersion": "swVersion",
		  "violationCount": 1,
		  "violations": [
			{
			  "message": "AAA authentication login method configured to ask Username/Password.",
			  "suggestedfix": "",
			  "age": 0,
			  "severity": "P3"
			}
		  ]
		}
	  ]
	},
	"error": null
  }

const policyRuleDetails : any ={
  "status": 200,
  "message": "SUCCESS",
  "data": {
    "deviceFilterDetails": {
      "productFamily": [
        "Cisco Catalyst 9300 Series Switches",
        "Cisco Cloud Services Router 1000V Series"
      ],
      "productModel": [
        "C9300-24P",
        "C9300-24UX, C9300-24UX, C9300-24UX",
        "CSR1000V"
      ],
      "osName": [
        "IOSXE"
      ]
    },
    "customerId": "90019449",
    "rule": {
      "name": "All authentication methods should ask Username And Password [ IOS-XE ]",
      "desc": "It is always important to choose the right order for the methods on a method list for 'AAA authentication'. For AAA login authentication, the first method on the list determines whether the user will be prompted for a username. Methods requiring only a password (e.g. the line method) should never be placed ahead of methods requiring a both username and password, because the user will never be prompted for a username and the mechanism will always fail.",
      "recommendedAction": "Re-arrange the order of aaa authentication methods so that enable and line are always at the end in the command: \n<br><br>\naaa authentication login \n<br>",
      "ruleId": "_All_authentication_methods_should_ask_Username_And_Password__IOSXE_"
    },
    "policy": {
      "desc": "By using AAA along with security server, you can control access to routers and other network services from a centralized location. This allows for easier management of user accounts and privileges and provides additional capabilities for auditing of network service usage. Login authentication specifies a series of authentication methods that are used to determine whether a user can access network device.",
      "group": "PCI_IOS_XE_GROUP",
      "name": "AAA Authentication - Login [ IOS-XE ]",
      "category": "AAA Services",
      "policyId": "_AAA_Authentication__Login__IOSXE_"
    }
  },
  "error": null
}

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
			"severity": "p1"
		}],
	},
};

const rccPolicyRuleDetailsData: any = {
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

const violationFilterData: any = {
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
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Violation 360 Details',
					response: {
						body: violationDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/violation-details`,
		usecases: ['Use Case 7'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Policy Rule Details',
					response: {
						body: policyRuleDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/policy-rule-details`,
		usecases: ['Use Case 8'],
	},
];
