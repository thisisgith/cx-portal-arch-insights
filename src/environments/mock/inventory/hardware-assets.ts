import { HardwareAssets, HardwareAsset } from '@sdp-api';
import * as _ from 'lodash-es';

/** Base of URL for SDP API */
const api = '/api/customerportal/inventory/v1/assets/hardware';

/** Default Customer ID */
const customerId = '2431199';

/** Mock data for Network Elements API Results */
export const MockHardwareAssetsData: HardwareAsset[] = [
	/* tslint:disable */
	{
		"deviceName": "C3850",
		"ipAddress": "172.16.44.27",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "0",
		"serialNumber": "FOC2045X0WJ",
		"productId": "WS-C3850-48U-L",
		"productType": "LAN Switches",
		"productName": "Cisco Catalyst 3850 48 Port UPOE LAN Base",
		"hasFieldNotices": "true",
		"equipmentType": "CHASSIS",
		"neId": "NA,FOC2045X0WJ,WS-C3850-48U-L,NA",
		"hwInstanceId": "FOC2045X0WJ,WS-C3850-48U-L,NA,FOC2045X0WJ,WS-C3850-48U-L,NA,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C3850",
		"ipAddress": "172.16.44.27",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "0",
		"serialNumber": "FOC20472BD5",
		"productId": "C3850-NM-4-10G",
		"productType": "Modules",
		"productName": "Cisco Catalyst 3850 4 x 10GE Network Module",
		"hasFieldNotices": "false",
		"equipmentType": "MODULE",
		"neId": "NA,FOC2045X0WJ,WS-C3850-48U-L,NA",
		"hwInstanceId": "FOC20472BD5,C3850-NM-4-10G,NA,NA,FOC2045X0WJ,WS-C3850-48U-L,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C2951",
		"ipAddress": "172.16.44.17",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "1",
		"serialNumber": "FOC143641UM",
		"productId": "PVDM3-128",
		"productType": "Modules",
		"productName": "128-channel high-density voice DSP module SPARE",
		"hasFieldNotices": "false",
		"equipmentType": "MODULE",
		"neId": "NA,FTX1441AJ65,CISCO2951/K9,NA",
		"hwInstanceId": "FOC143641UM,PVDM3-128,NA,NA,FTX1441AJ65,CISCO2951/K9,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C2951",
		"ipAddress": "172.16.44.17",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "1",
		"serialNumber": "FOC143738XS",
		"productId": "PVDM2-64",
		"productType": "Modules",
		"productName": "^64-Channel Packet Voice/Fax DSP Module",
		"hasFieldNotices": "false",
		"equipmentType": "MODULE",
		"neId": "NA,FTX1441AJ65,CISCO2951/K9,NA",
		"hwInstanceId": "FOC143738XS,PVDM2-64,NA,NA,FTX1441AJ65,CISCO2951/K9,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C2951",
		"ipAddress": "172.16.44.17",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "1",
		"serialNumber": "FOC143902FA",
		"productId": "SM-NM-ADPTR",
		"productType": "Modules",
		"productName": "Network Module Adapter for SM Slot on Cisco 2900, 3900 ISR",
		"hasFieldNotices": "false",
		"equipmentType": "MODULE",
		"neId": "NA,FTX1441AJ65,CISCO2951/K9,NA",
		"hwInstanceId": "FOC143902FA,SM-NM-ADPTR,NA,NA,FTX1441AJ65,CISCO2951/K9,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C2951",
		"ipAddress": "172.16.44.17",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "1",
		"serialNumber": "FOC14392EJ1",
		"productId": "PVDM3-32",
		"productType": "Modules",
		"productName": "32-channel high-density voice DSP module SPARE",
		"hasFieldNotices": "false",
		"equipmentType": "MODULE",
		"neId": "NA,FTX1441AJ65,CISCO2951/K9,NA",
		"hwInstanceId": "FOC14392EJ1,PVDM3-32,NA,NA,FTX1441AJ65,CISCO2951/K9,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C2951",
		"ipAddress": "172.16.44.17",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "1",
		"serialNumber": "FOC14392N63",
		"productId": "NM-HDV2-2T1/E1",
		"productType": "Modules",
		"productName": "^IP Communications High-Density Digital Voice NM with 2 T1/E1",
		"hasFieldNotices": "false",
		"equipmentType": "MODULE",
		"neId": "NA,FTX1441AJ65,CISCO2951/K9,NA",
		"hwInstanceId": "FOC14392N63,NM-HDV2-2T1/E1,NA,NA,FTX1441AJ65,CISCO2951/K9,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C2951",
		"ipAddress": "172.16.44.17",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "1",
		"serialNumber": "FTX1441AJ65",
		"productId": "CISCO2951/K9",
		"productType": "Routers",
		"productName": "Cisco 2951 Voice Bundle, PVDM3-32, UC License PAK, FL-CUBE5",
		"hasFieldNotices": "false",
		"equipmentType": "CHASSIS",
		"neId": "NA,FTX1441AJ65,CISCO2951/K9,NA",
		"hwInstanceId": "FTX1441AJ65,CISCO2951/K9,NA,FTX1441AJ65,CISCO2951/K9,NA,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "N5K",
		"ipAddress": "172.16.44.21",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "1",
		"serialNumber": "FOC19505BF1",
		"productId": "N55-DL2",
		"productType": "Modules",
		"productName": "Nexus 5548 Layer 2 Daughter Card",
		"hasFieldNotices": "false",
		"equipmentType": "MODULE",
		"neId": "NA,SSI194207AZ,N5K-C5548UP,NA",
		"hwInstanceId": "FOC19505BF1,N55-DL2,NA,NA,SSI194207AZ,N5K-C5548UP,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "N5K",
		"ipAddress": "172.16.44.21",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "1",
		"serialNumber": "SSI194207AZ",
		"productId": "N5K-C5548UP",
		"productType": "Data Center Switches",
		"productName": "Nexus 5548UP in N5548UP-N2K Bundle",
		"hasFieldNotices": "false",
		"equipmentType": "CHASSIS",
		"neId": "NA,SSI194207AZ,N5K-C5548UP,NA",
		"hwInstanceId": "SSI194207AZ,N5K-C5548UP,NA,SSI194207AZ,N5K-C5548UP,NA,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "N3K",
		"ipAddress": "172.16.44.22",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "3",
		"serialNumber": "FOC1610R0L4",
		"productId": "N3K-C3048TP-1GE",
		"productType": "Data Center Switches",
		"productName": "Nexus 3048TP-1GE 1RU 48 x 10/100/1000 and 4 x 10GE ports",
		"hasFieldNotices": "true",
		"equipmentType": "CHASSIS",
		"neId": "NA,FOC1610R0L4,N3K-C3048TP-1GE,NA",
		"hwInstanceId": "FOC1610R0L4,N3K-C3048TP-1GE,NA,FOC1610R0L4,N3K-C3048TP-1GE,NA,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "Cisco2800LAB.cisco.com",
		"ipAddress": "172.16.44.26",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "0",
		"serialNumber": "FOC11052JGD",
		"productId": "HWIC-4ESW",
		"productType": "Modules",
		"productName": "Four port 10/100 Ethernet switch interface card",
		"hasFieldNotices": "false",
		"equipmentType": "MODULE",
		"neId": "NA,FTX1108A1EE,CISCO2811,NA",
		"hwInstanceId": "FOC11052JGD,HWIC-4ESW,NA,NA,FTX1108A1EE,CISCO2811,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "Cisco2800LAB.cisco.com",
		"ipAddress": "172.16.44.26",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "0",
		"serialNumber": "FTX1108A1EE",
		"productId": "CISCO2811",
		"productType": "Routers",
		"productName": "2811 w/ AC PWR,2FE,4HWICs,2PVDMs,1NME,2AIMS,IPBASE,128F/512D",
		"hasFieldNotices": "true",
		"equipmentType": "CHASSIS",
		"neId": "NA,FTX1108A1EE,CISCO2811,NA",
		"hwInstanceId": "FTX1108A1EE,CISCO2811,NA,FTX1108A1EE,CISCO2811,NA,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C2610XM.cisco.com",
		"ipAddress": "172.16.44.23",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "0",
		"serialNumber": "33216555",
		"productId": "NM-16A",
		"productType": "Modules",
		"productName": "^1-Port 4-Wire 56Kbps DSU/CSU WAN Interface Card",
		"hasFieldNotices": "false",
		"equipmentType": "MODULE",
		"neId": "NA,JMX0911L1A9,NA,NA",
		"hwInstanceId": "33216555,NM-16A=,NA,NA,JMX0911L1A9,NA,NA",
		"solutionInfo": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C2610XM.cisco.com",
		"ipAddress": "172.16.44.23",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "0",
		"serialNumber": "JMX0911L1A9",
		"productId": "CISCO2610",
		"productType": "Routers",
		"productName": "^10/100 Ethernet Router w/ Cisco IOS IP, 32F/128D",
		"hasFieldNotices": "false",
		"equipmentType": "CHASSIS",
		"neId": "NA,JMX0911L1A9,NA,NA",
		"hwInstanceId": "JMX0911L1A9,NA,NA,JMX0911L1A9,NA,NA,NA",
		"solutionInfo": [],
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "C3750G-12S",
		"ipAddress": "172.16.44.28",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "2",
		"serialNumber": "FOC2029NJ0Q",
		"productId": "A99-12X100GE=",
		"productType": "LAN Switches",
		"productName": "ASR 9900 12-port 100GE Line card",
		"hasFieldNotices": "true",
		"equipmentType": "CHASSIS",
		"neId": "NA,FOC2029NJ0Q,A99-12X100GE=,NA",
		"hwInstanceId": "FOC2029NJ0Q,A99-12X100GE=,NA,FOC2029NJ0Q,A99-12X100GE=,NA,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "ASR1004",
		"ipAddress": "172.16.44.19",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "0",
		"serialNumber": "FXS1731Q3VJ",
		"productId": "ASR1004",
		"productType": "Routers",
		"productName": "Cisco ASR1004 Chassis, Dual P/S",
		"hasFieldNotices": "false",
		"equipmentType": "CHASSIS",
		"neId": "NA,FXS1731Q3VJ,ASR1004,NA",
		"hwInstanceId": "FXS1731Q3VJ,ASR1004,NA,FXS1731Q3VJ,ASR1004,NA,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "ASR1004",
		"ipAddress": "172.16.44.19",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "0",
		"serialNumber": "JAE173707MT",
		"productId": "ASR1000-SIP10",
		"productType": "Modules",
		"productName": "^Cisco ASR1000 SPA Interface Processor 10",
		"hasFieldNotices": "false",
		"equipmentType": "MODULE",
		"neId": "NA,FXS1731Q3VJ,ASR1004,NA",
		"hwInstanceId": "JAE173707MT,ASR1000-SIP10,NA,NA,FXS1731Q3VJ,ASR1004,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "ASR1004",
		"ipAddress": "172.16.44.19",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "0",
		"serialNumber": "JAE17380CSW",
		"productId": "ASR1000-ESP10",
		"productType": "Modules",
		"productName": "^Cisco ASR1000 Embedded Services Processor, 10G",
		"hasFieldNotices": "false",
		"equipmentType": "MODULE",
		"neId": "NA,FXS1731Q3VJ,ASR1004,NA",
		"hwInstanceId": "JAE17380CSW,ASR1000-ESP10,NA,NA,FXS1731Q3VJ,ASR1004,NA",
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
		"cxLevel": null,
		"saId": null,
		"vaId": null
	},
	{
		"deviceName": "ASR1004",
		"ipAddress": "172.16.44.19",
		"collectorId": "CSP0001048689",
		"wfId": "66417d75-f2d3-4733-9e0a-4afbaf122fbf",
		"criticalAdvisories": "0",
		"serialNumber": "JAE17400HM6",
		"productId": "ASR1000-RP1",
		"productType": "Modules",
		"productName": "^Cisco ASR1000 Route Processor 1,4GB DRAM",
		"hasFieldNotices": "false",
		"equipmentType": "MODULE",
		"neId": "NA,FXS1731Q3VJ,ASR1004,NA",
		"hwInstanceId": "JAE17400HM6,ASR1000-RP1,NA,NA,FXS1731Q3VJ,ASR1004,NA",
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
export function MockHardwareAssets (
	rows: number,
	page: number): HardwareAssets {
	let data = _.cloneDeep(MockHardwareAssetsData);
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
export const HardwareAssetScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Hardware Assets Page 1',
					response: {
						body: MockHardwareAssets(10, 1),
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
