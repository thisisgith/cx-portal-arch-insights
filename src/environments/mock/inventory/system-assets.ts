import { SystemAssets, SystemAsset } from '@sdp-api';
import * as _ from 'lodash-es';

/** Base of URL for SDP API */
const api = '/api/customerportal/inventory/v1/assets/system';

/** Default Customer ID */
const customerId = '2431199';

/** Mock data for Network Elements API Results */
export const MockSystemAssetsData: SystemAsset[] = [
	/* tslint:disable */
	{
		"deviceName": "N9K",
		"ipAddress": "172.16.44.29",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"lastScan": null,
		"criticalAdvisories": "0",
		"serialNumber": "SAL1833YM7D",
		"osType": "NX-OS",
		"osVersion": "7.0(3)I7(4)",
		"role": "CORE",
		"managedNeId": "NA,SAL1833YM7D,N9K-C9396PX,NA",
		"neId": "NA,SAL1833YM7D,N9K-C9396PX,NA",
		"productId": "N9K-C9396PX",
		"productType": "Data Center Switches",
		"productName": "",
		"productFamily": "Cisco Nexus 9000 Series Switches",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Network Segmentation",
				"solution": "IBN"
			},
			{
				"useCase": "Scalable Access Policy",
				"solution": "IBN"
			},
			{
				"useCase": "Campus Network Assurance",
				"solution": "IBN"
			},
			{
				"useCase": "Network Device Onboarding",
				"solution": "IBN"
			}
		],
		"tags": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "N3K",
		"ipAddress": "172.16.44.22",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"lastScan": null,
		"criticalAdvisories": "3",
		"serialNumber": "FOC1610R0L4",
		"osType": "NX-OS",
		"osVersion": "5.0(3)U2(2b)",
		"role": "CORE",
		"managedNeId": "NA,FOC1610R0L4,N3K-C3048TP-1GE,NA",
		"neId": "NA,FOC1610R0L4,N3K-C3048TP-1GE,NA",
		"productId": "N3K-C3048TP-1GE",
		"productType": "Data Center Switches",
		"productName": "",
		"productFamily": "Cisco Nexus 3000 Series Switches",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Network Segmentation",
				"solution": "IBN"
			},
			{
				"useCase": "Scalable Access Policy",
				"solution": "IBN"
			},
			{
				"useCase": "Campus Network Assurance",
				"solution": "IBN"
			},
			{
				"useCase": "Network Device Onboarding",
				"solution": "IBN"
			}
		],
		"tags": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "AIR-CT5760",
		"ipAddress": "172.16.44.24",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"lastScan": null,
		"criticalAdvisories": "1",
		"serialNumber": "FOC1841V02P",
		"osType": "IOS-XE",
		"osVersion": "03.02.03.SE",
		"role": "ACCESS",
		"managedNeId": "NA,FOC1841V02P,AIR-CT5760,NA",
		"neId": "NA,FOC1841V02P,AIR-CT5760,NA",
		"productId": "AIR-CT5760",
		"productType": "Wireless",
		"productName": "",
		"productFamily": "Cisco 5700 Series Wireless LAN Controllers",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Network Segmentation",
				"solution": "IBN"
			},
			{
				"useCase": "Scalable Access Policy",
				"solution": "IBN"
			},
			{
				"useCase": "Campus Network Assurance",
				"solution": "IBN"
			},
			{
				"useCase": "Network Device Onboarding",
				"solution": "IBN"
			}
		],
		"tags": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C2951",
		"ipAddress": "172.16.44.17",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"lastScan": null,
		"criticalAdvisories": "1",
		"serialNumber": "FTX1441AJ65",
		"osType": "IOS",
		"osVersion": "15.3(3)M3",
		"role": "BORDER ROUTER",
		"managedNeId": "NA,FTX1441AJ65,CISCO2951/K9,NA",
		"neId": "NA,FTX1441AJ65,CISCO2951/K9,NA",
		"productId": "CISCO2951/K9",
		"productType": "Routers",
		"productName": "",
		"productFamily": "Cisco 2900 Series Integrated Services Routers",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Network Segmentation",
				"solution": "IBN"
			},
			{
				"useCase": "Scalable Access Policy",
				"solution": "IBN"
			},
			{
				"useCase": "Campus Network Assurance",
				"solution": "IBN"
			},
			{
				"useCase": "Network Device Onboarding",
				"solution": "IBN"
			}
		],
		"tags": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C3850",
		"ipAddress": "172.16.44.27",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"lastScan": null,
		"criticalAdvisories": "0",
		"serialNumber": "FOC2045X0WJ",
		"osType": "IOS-XE",
		"osVersion": "16.12.1",
		"role": "ACCESS",
		"managedNeId": "NA,FOC2045X0WJ,WS-C3850-48U-L,NA",
		"neId": "NA,FOC2045X0WJ,WS-C3850-48U-L,NA",
		"productId": "WS-C3850-48U-L",
		"productType": "LAN Switches",
		"productName": "",
		"productFamily": "Cisco Catalyst 3850 Series Switches",
		"hasSecurityAdvisories": false,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Network Segmentation",
				"solution": "IBN"
			},
			{
				"useCase": "Scalable Access Policy",
				"solution": "IBN"
			},
			{
				"useCase": "Campus Network Assurance",
				"solution": "IBN"
			},
			{
				"useCase": "Network Device Onboarding",
				"solution": "IBN"
			}
		],
		"tags": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C3560X-24T-L",
		"ipAddress": "172.16.44.25",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"lastScan": null,
		"criticalAdvisories": "3",
		"serialNumber": "FDO1503P0D7",
		"osType": "IOS",
		"osVersion": "12.2(55)SE1",
		"role": "ACCESS",
		"managedNeId": "NA,FDO1503P0D7,WS-C3560X-24T-L,NA",
		"neId": "NA,FDO1503P0D7,WS-C3560X-24T-L,NA",
		"productId": "WS-C3560X-24T-L",
		"productType": "LAN Switches",
		"productName": "",
		"productFamily": "Cisco Catalyst 3560-X Series Switches",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Network Segmentation",
				"solution": "IBN"
			},
			{
				"useCase": "Scalable Access Policy",
				"solution": "IBN"
			},
			{
				"useCase": "Campus Network Assurance",
				"solution": "IBN"
			},
			{
				"useCase": "Network Device Onboarding",
				"solution": "IBN"
			}
		],
		"tags": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C2610XM.cisco.com",
		"ipAddress": "172.16.44.23",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"lastScan": null,
		"criticalAdvisories": "0",
		"serialNumber": "JMX0911L1A9",
		"osType": "IOS",
		"osVersion": "12.4(25d)",
		"role": "CORE",
		"managedNeId": "NA,JMX0911L1A9,NA,NA",
		"neId": "NA,JMX0911L1A9,NA,NA",
		"productId": "NA",
		"productType": "Routers",
		"productName": "",
		"productFamily": "Cisco 2600 Series Multiservice Platforms",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": null,
		"tags": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "N5K",
		"ipAddress": "172.16.44.20",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"lastScan": null,
		"criticalAdvisories": "0",
		"serialNumber": "SSI142007VP",
		"osType": "NX-OS",
		"osVersion": "5.2(1)N1(5)",
		"role": "CORE",
		"managedNeId": "NA,SSI142007VP,N5K-C5010P-BF,NA",
		"neId": "NA,SSI142007VP,N5K-C5010P-BF,NA",
		"productId": "N5K-C5010P-BF",
		"productType": "Data Center Switches",
		"productName": "",
		"productFamily": "Cisco Nexus 5000 Series Switches",
		"hasSecurityAdvisories": false,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Network Segmentation",
				"solution": "IBN"
			},
			{
				"useCase": "Scalable Access Policy",
				"solution": "IBN"
			},
			{
				"useCase": "Campus Network Assurance",
				"solution": "IBN"
			},
			{
				"useCase": "Network Device Onboarding",
				"solution": "IBN"
			}
		],
		"tags": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "ASR1004",
		"ipAddress": "172.16.44.19",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"lastScan": null,
		"criticalAdvisories": "0",
		"serialNumber": "FXS1731Q3VJ",
		"osType": "IOS-XE",
		"osVersion": "15.4(3)S",
		"role": "BORDER ROUTER",
		"managedNeId": "NA,FXS1731Q3VJ,ASR1004,NA",
		"neId": "NA,FXS1731Q3VJ,ASR1004,NA",
		"productId": "ASR1004",
		"productType": "Routers",
		"productName": "",
		"productFamily": "Cisco ASR 1000 Series Aggregation Services Routers",
		"hasSecurityAdvisories": false,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Network Segmentation",
				"solution": "IBN"
			},
			{
				"useCase": "Scalable Access Policy",
				"solution": "IBN"
			},
			{
				"useCase": "Campus Network Assurance",
				"solution": "IBN"
			},
			{
				"useCase": "Network Device Onboarding",
				"solution": "IBN"
			}
		],
		"tags": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "N5K",
		"ipAddress": "172.16.44.21",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"lastScan": null,
		"criticalAdvisories": "1",
		"serialNumber": "SSI194207AZ",
		"osType": "NX-OS",
		"osVersion": "6.0(2)N2(1b)",
		"role": "CORE",
		"managedNeId": "NA,SSI194207AZ,N5K-C5548UP,NA",
		"neId": "NA,SSI194207AZ,N5K-C5548UP,NA",
		"productId": "N5K-C5548UP",
		"productType": "Data Center Switches",
		"productName": "",
		"productFamily": "Cisco Nexus 5000 Series Switches",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Network Segmentation",
				"solution": "IBN"
			},
			{
				"useCase": "Scalable Access Policy",
				"solution": "IBN"
			},
			{
				"useCase": "Campus Network Assurance",
				"solution": "IBN"
			},
			{
				"useCase": "Network Device Onboarding",
				"solution": "IBN"
			}
		],
		"tags": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "Cisco2800LAB.cisco.com",
		"ipAddress": "172.16.44.26",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"lastScan": null,
		"criticalAdvisories": "0",
		"serialNumber": "FTX1108A1EE",
		"osType": "IOS",
		"osVersion": "12.4(24)GC5",
		"role": "BORDER ROUTER",
		"managedNeId": "NA,FTX1108A1EE,CISCO2811,NA",
		"neId": "NA,FTX1108A1EE,CISCO2811,NA",
		"productId": "CISCO2811",
		"productType": "Routers",
		"productName": "",
		"productFamily": "Cisco 2800 Series Integrated Services Routers",
		"hasSecurityAdvisories": false,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Network Segmentation",
				"solution": "IBN"
			},
			{
				"useCase": "Scalable Access Policy",
				"solution": "IBN"
			},
			{
				"useCase": "Campus Network Assurance",
				"solution": "IBN"
			},
			{
				"useCase": "Network Device Onboarding",
				"solution": "IBN"
			}
		],
		"tags": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C3750G-12S",
		"ipAddress": "172.16.44.28",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"lastScan": null,
		"criticalAdvisories": "2",
		"serialNumber": "FOC2029NJ0Q",
		"osType": "IOS",
		"osVersion": "12.2(55)SE9",
		"role": "ACCESS",
		"managedNeId": "NA,FOC2029NJ0Q,A99-12X100GE=,NA",
		"neId": "NA,FOC2029NJ0Q,A99-12X100GE=,NA",
		"productId": "A99-12X100GE=",
		"productType": "LAN Switches",
		"productName": "",
		"productFamily": "Cisco Catalyst 3750 Series Switches",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Network Segmentation",
				"solution": "IBN"
			},
			{
				"useCase": "Scalable Access Policy",
				"solution": "IBN"
			},
			{
				"useCase": "Campus Network Assurance",
				"solution": "IBN"
			},
			{
				"useCase": "Network Device Onboarding",
				"solution": "IBN"
			}
		],
		"tags": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	}
	/* tslint:enable */
];

/**
 * Function to generate the mock Assets Response
 * @param rows the rows to return
 * @param page the page to return
 * @returns the assets response
 */
export function MockSystemAssets (
	rows: number,
	page: number): SystemAssets {
	let data = _.cloneDeep(MockSystemAssetsData);
	const total = data.length;
	const pages = Math.ceil(data.length / rows);

	data = data.slice((rows * (page - 1)), (rows * page));

	return {
		data,
		Pagination: {
			page,
			pages,
			rows,
			total,
		},
	};
}

/** The scenarios */
export const SystemAssetScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'System Assets Page 1',
					response: {
						body: MockSystemAssets(10, 1),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=1&page=1`,
		usecases: ['Use Case 1'],
	},
];
