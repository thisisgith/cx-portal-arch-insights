import { Assets, Asset } from '@sdp-api';
import * as _ from 'lodash-es';
import { HttpHeaders } from '@angular/common/http';

/** Base of URL for SDP API */
const api = '/api/customerportal/inventory/v1/assets/system';

/** Default Customer ID */
const customerId = '2431199_0';

/** Mock data for Network Elements API Results */
export const MockAssetsData: Asset[] = [
	/* tslint:disable */
	{
		"deviceName": "C2960-24PC-L",
		"ipAddress": "172.20.92.246",
		"collectorId": "CSP0001048910",
		"wfId": "a2bb2145-1512-4f43-95a7-89e2e0ec67ff",
		"lastScan": null,
		"criticalAdvisories": "1",
		"serialNumber": "FOC1348W6JP",
		"osType": "IOS",
		"osVersion": "12.2(44)SE6",
		"role": "ACCESS",
		"managedNeId": "NA,FOC1348W6JP,WS-C2960-24PC-L,NA",
		"neId": "NA,FOC1348W6JP,WS-C2960-24PC-L,NA",
		"productId": "WS-C2960-24PC-L",
		"productType": "LAN Switches",
		"productName": "",
		"productFamily": "Cisco Catalyst 2960 Series Switches",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Software Image Management",
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
		"tags": [
			{
				"tagName": "AT-Tag4",
				"tagValue": "e3f07a63-aec4-4ab7-8125-c685f0dc9edc"
			},
			{
				"tagName": "C2900",
				"tagValue": "9fbe56fb-7f92-4b3e-9211-ebb69e7d32ea"
			},
			{
				"tagName": "cp-asset-tagging-test-tag2",
				"tagValue": "5b8968b5-6789-4ebe-a0c3-3510c1ee4339"
			}
		],
		"isScanCapable": true,
		"cxLevel": "",
	},
	{
		"deviceName": "C2960-24TC-L",
		"ipAddress": "192.168.99.114",
		"collectorId": "CSP0001048910",
		"wfId": "a2bb2145-1512-4f43-95a7-89e2e0ec67ff",
		"lastScan": null,
		"criticalAdvisories": "1",
		"serialNumber": "FHK1045Y01E",
		"osType": "IOS",
		"osVersion": "12.2(50)SE",
		"role": "ACCESS",
		"managedNeId": "NA,FHK1045Y01E,WS-C2960-24TC-L,NA",
		"neId": "NA,FHK1045Y01E,WS-C2960-24TC-L,NA",
		"productId": "WS-C2960-24TC-L",
		"productType": "LAN Switches",
		"productName": "",
		"productFamily": "Cisco Catalyst 2960 Series Switches",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Software Image Management",
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
		"tags": [
			{
				"tagName": "AT-Tag4",
				"tagValue": "e3f07a63-aec4-4ab7-8125-c685f0dc9edc"
			},
			{
				"tagName": "C2900",
				"tagValue": "9fbe56fb-7f92-4b3e-9211-ebb69e7d32ea"
			},
			{
				"tagName": "cp-asset-tagging-test-tag2",
				"tagValue": "5b8968b5-6789-4ebe-a0c3-3510c1ee4339"
			}
		],
		"isScanCapable": true,
		"cxLevel": "2",
	},
	{
		"deviceName": "EGY-MPLS-R4351",
		"ipAddress": "10.203.255.1",
		"collectorId": "CSP0001049183",
		"wfId": "7add7add-a02b-4f1b-ab2b-b00862054fef",
		"lastScan": "2019-12-24T02:08:41Z",
		"criticalAdvisories": "1",
		"serialNumber": "FLM1915W03F",
		"osType": "IOS-XE",
		"osVersion": "16.9.1",
		"role": "BORDER ROUTER",
		"managedNeId": "NA,FLM1915W03F,ISR4351/K9,NA",
		"neId": "NA,FLM1915W03F,ISR4351/K9,NA",
		"productId": "ISR4351/K9",
		"productType": "Routers",
		"productName": "",
		"productFamily": "Cisco 4000 Series Integrated Services Routers",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "SUCCESS",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Software Image Management",
				"solution": "IBN"
			},
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
		"isScanCapable": true,
		"cxLevel": "",
	},
	{
		"deviceName": "MX1-ASR1001X-1.corp.local",
		"ipAddress": "10.32.255.1",
		"collectorId": "CSP0001049183",
		"wfId": "7add7add-a02b-4f1b-ab2b-b00862054fef",
		"lastScan": null,
		"criticalAdvisories": "1",
		"serialNumber": "FXS2130Q70V",
		"osType": "IOS-XE",
		"osVersion": "16.3.7",
		"role": "BORDER ROUTER",
		"managedNeId": "NA,FXS2130Q70V,ASR1001-X,NA",
		"neId": "NA,FXS2130Q70V,ASR1001-X,NA",
		"productId": "ASR1001-X",
		"productType": "Routers",
		"productName": "",
		"productFamily": "Cisco ASR 1000 Series Aggregation Services Routers",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Software Image Management",
				"solution": "IBN"
			},
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
		"isScanCapable": true,
		"cxLevel": "",
	},
	{
		"deviceName": "PnP-WLC5520-1",
		"ipAddress": "172.23.111.11",
		"collectorId": "CSP0001049183",
		"wfId": "7add7add-a02b-4f1b-ab2b-b00862054fef",
		"lastScan": null,
		"criticalAdvisories": "1",
		"serialNumber": "FCH2008V0TK",
		"osType": "AireOS",
		"osVersion": "8.8.111.0",
		"role": "ACCESS",
		"managedNeId": "NA,FCH2008V0TK,AIR-CT5520-K9,NA",
		"neId": "NA,FCH2008V0TK,AIR-CT5520-K9,NA",
		"productId": "AIR-CT5520-K9",
		"productType": "Wireless",
		"productName": "",
		"productFamily": "Cisco 5500 Series Wireless Controllers",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Software Image Management",
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
		"isScanCapable": true,
		"cxLevel": "",
	},
	{
		"deviceName": "MX1-ISR4431-3.corp.local",
		"ipAddress": "10.32.255.3",
		"collectorId": "CSP0001049183",
		"wfId": "7add7add-a02b-4f1b-ab2b-b00862054fef",
		"lastScan": null,
		"criticalAdvisories": "0",
		"serialNumber": "FJC2139D179",
		"osType": "IOS-XE",
		"osVersion": "3.16.4",
		"role": "BORDER ROUTER",
		"managedNeId": "NA,FJC2139D179,ISR4431/K9,NA",
		"neId": "NA,FJC2139D179,ISR4431/K9,NA",
		"productId": "ISR4431/K9",
		"productType": "Routers",
		"productName": "",
		"productFamily": "Cisco 4000 Series Integrated Services Routers",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Software Image Management",
				"solution": "IBN"
			},
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
		"isScanCapable": true,
		"cxLevel": "",
	},
	{
		"deviceName": "C2960-24PC-L",
		"ipAddress": "172.20.92.246",
		"collectorId": "CSP0001048910",
		"wfId": "a2bb2145-1512-4f43-95a7-89e2e0ec67ff",
		"lastScan": null,
		"criticalAdvisories": "1",
		"serialNumber": "FOC1348W6JP",
		"osType": "IOS",
		"osVersion": "12.2(44)SE6",
		"role": "ACCESS",
		"managedNeId": "NA,FOC1348W6JP,WS-C2960-24PC-L,NA",
		"neId": "NA,FOC1348W6JP,WS-C2960-24PC-L,NA",
		"productId": "WS-C2960-24PC-L",
		"productType": "LAN Switches",
		"productName": "",
		"productFamily": "Cisco Catalyst 2960 Series Switches",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Software Image Management",
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
		"tags": [
			{
				"tagName": "AT-Tag4",
				"tagValue": "e3f07a63-aec4-4ab7-8125-c685f0dc9edc"
			},
			{
				"tagName": "C2900",
				"tagValue": "9fbe56fb-7f92-4b3e-9211-ebb69e7d32ea"
			},
			{
				"tagName": "cp-asset-tagging-test-tag2",
				"tagValue": "5b8968b5-6789-4ebe-a0c3-3510c1ee4339"
			}
		],
		"isScanCapable": true,
		"cxLevel": "",
	},
	{
		"deviceName": "C2960-24TC-L",
		"ipAddress": "192.168.99.114",
		"collectorId": "CSP0001048910",
		"wfId": "a2bb2145-1512-4f43-95a7-89e2e0ec67ff",
		"lastScan": null,
		"criticalAdvisories": "1",
		"serialNumber": "FHK1045Y01E",
		"osType": "IOS",
		"osVersion": "12.2(50)SE",
		"role": "ACCESS",
		"managedNeId": "NA,FHK1045Y01E,WS-C2960-24TC-L,NA",
		"neId": "NA,FHK1045Y01E,WS-C2960-24TC-L,NA",
		"productId": "WS-C2960-24TC-L",
		"productType": "LAN Switches",
		"productName": "",
		"productFamily": "Cisco Catalyst 2960 Series Switches",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Software Image Management",
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
		"tags": [
			{
				"tagName": "AT-Tag4",
				"tagValue": "e3f07a63-aec4-4ab7-8125-c685f0dc9edc"
			},
			{
				"tagName": "C2900",
				"tagValue": "9fbe56fb-7f92-4b3e-9211-ebb69e7d32ea"
			},
			{
				"tagName": "cp-asset-tagging-test-tag2",
				"tagValue": "5b8968b5-6789-4ebe-a0c3-3510c1ee4339"
			}
		],
		"isScanCapable": true,
		"cxLevel": "2",
	},
	{
		"deviceName": "EGY-MPLS-R4351",
		"ipAddress": "10.203.255.1",
		"collectorId": "CSP0001049183",
		"wfId": "7add7add-a02b-4f1b-ab2b-b00862054fef",
		"lastScan": "2019-12-24T02:08:41Z",
		"criticalAdvisories": "1",
		"serialNumber": "FLM1915W03F",
		"osType": "IOS-XE",
		"osVersion": "16.9.1",
		"role": "BORDER ROUTER",
		"managedNeId": "NA,FLM1915W03F,ISR4351/K9,NA",
		"neId": "NA,FLM1915W03F,ISR4351/K9,NA",
		"productId": "ISR4351/K9",
		"productType": "Routers",
		"productName": "",
		"productFamily": "Cisco 4000 Series Integrated Services Routers",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "SUCCESS",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Software Image Management",
				"solution": "IBN"
			},
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
		"isScanCapable": true,
		"cxLevel": "",
	},
	{
		"deviceName": "MX1-ASR1001X-1.corp.local",
		"ipAddress": "10.32.255.1",
		"collectorId": "CSP0001049183",
		"wfId": "7add7add-a02b-4f1b-ab2b-b00862054fef",
		"lastScan": null,
		"criticalAdvisories": "1",
		"serialNumber": "FXS2130Q70V",
		"osType": "IOS-XE",
		"osVersion": "16.3.7",
		"role": "BORDER ROUTER",
		"managedNeId": "NA,FXS2130Q70V,ASR1001-X,NA",
		"neId": "NA,FXS2130Q70V,ASR1001-X,NA",
		"productId": "ASR1001-X",
		"productType": "Routers",
		"productName": "",
		"productFamily": "Cisco ASR 1000 Series Aggregation Services Routers",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Software Image Management",
				"solution": "IBN"
			},
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
		"isScanCapable": true,
		"cxLevel": "",
	},
	{
		"deviceName": "PnP-WLC5520-1",
		"ipAddress": "172.23.111.11",
		"collectorId": "CSP0001049183",
		"wfId": "7add7add-a02b-4f1b-ab2b-b00862054fef",
		"lastScan": null,
		"criticalAdvisories": "1",
		"serialNumber": "FCH2008V0TK",
		"osType": "AireOS",
		"osVersion": "8.8.111.0",
		"role": "ACCESS",
		"managedNeId": "NA,FCH2008V0TK,AIR-CT5520-K9,NA",
		"neId": "NA,FCH2008V0TK,AIR-CT5520-K9,NA",
		"productId": "AIR-CT5520-K9",
		"productType": "Wireless",
		"productName": "",
		"productFamily": "Cisco 5500 Series Wireless Controllers",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Software Image Management",
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
		"isScanCapable": true,
		"cxLevel": "",
	},
	{
		"deviceName": "MX1-ISR4431-3.corp.local",
		"ipAddress": "10.32.255.3",
		"collectorId": "CSP0001049183",
		"wfId": "7add7add-a02b-4f1b-ab2b-b00862054fef",
		"lastScan": null,
		"criticalAdvisories": "0",
		"serialNumber": "FJC2139D179",
		"osType": "IOS-XE",
		"osVersion": "3.16.4",
		"role": "BORDER ROUTER",
		"managedNeId": "NA,FJC2139D179,ISR4431/K9,NA",
		"neId": "NA,FJC2139D179,ISR4431/K9,NA",
		"productId": "ISR4431/K9",
		"productType": "Routers",
		"productName": "",
		"productFamily": "Cisco 4000 Series Integrated Services Routers",
		"hasSecurityAdvisories": true,
		"hasBugs": false,
		"scanStatus": "",
		"isManagedNE": true,
		"solutionInfo": [
			{
				"useCase": "Campus Software Image Management",
				"solution": "IBN"
			},
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
		"isScanCapable": true,
		"cxLevel": "",
	},
	{
		"deviceName": "ASR1000-ESP10",
		"ipAddress": "172.20.92.247",
		"supportCovered": false,
		"serialNumber": "JAE17380CSW",
		"osType": "IOS-XE",
		"osVersion": "15.4(3)S",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FXS1731Q3VJ,ASR1004,NA",
		"hwInstanceId": "JAE17380CSW,ASR1000-ESP10,NA,NA,FXS1731Q3VJ,ASR1004,NA",
		"productId": "ASR1000-ESP10",
		"equipmentType": "MODULE"
	},
	{
		"deviceName": "Catalyst+3560X-24T-L+Switch",
		"ipAddress": "172.21.140.183",
		"supportCovered": true,
		"serialNumber": "FDO1503P0D7",
		"osType": "IOS",
		"osVersion": "12.2(55)SE1",
		"role": "ACCESS",
		"contractNumber": "93425688",
		"managedNeId": "NA,FDO1503P0D7,WS-C3560X-24T-L,NA",
		"hwInstanceId": "FDO1503P0D7,WS-C3560X-24T-L,NA,FDO1503P0D7,WS-C3560X-24T-L,NA,NA",
		"productId": "WS-C3560X-24T-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Cisco+Catalyst+4506-E+Switch",
		"ipAddress": "172.23.164.88",
		"supportCovered": false,
		"serialNumber": "FOX1335GRHG",
		"osType": "IOS",
		"osVersion": "15.0(2)SG7",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOX1335GRHG,WS-C4506-E,NA",
		"hwInstanceId": "FOX1335GRHG,WS-C4506-E,NA,FOX1335GRHG,WS-C4506-E,NA,NA",
		"productId": "WS-C4506-E",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "ASR1000-RP1",
		"ipAddress": "172.20.92.247",
		"supportCovered": false,
		"serialNumber": "JAE17400HM6",
		"osType": "IOS-XE",
		"osVersion": "15.4(3)S",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FXS1731Q3VJ,ASR1004,NA",
		"hwInstanceId": "JAE17400HM6,ASR1000-RP1,NA,NA,FXS1731Q3VJ,ASR1004,NA",
		"productId": "ASR1000-RP1",
		"equipmentType": "MODULE"
	},
	{
		"deviceName": "PVDM2-64",
		"ipAddress": "172.20.70.42",
		"supportCovered": false,
		"serialNumber": "FOC10443XH6",
		"osType": "IOS",
		"osVersion": "12.4(15)T",
		"role": "BORDER ROUTER",
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FTX1046A57N,CISCO3825,NA",
		"hwInstanceId": "FOC10443XH6,PVDM2-64,NA,NA,FTX1046A57N,CISCO3825,NA",
		"productId": "PVDM2-64",
		"equipmentType": "MODULE"
	},
	{
		"deviceName": "Catalyst+2960S-24PS-L+Switch",
		"ipAddress": "10.119.1.143",
		"supportCovered": false,
		"serialNumber": "FOC1446Z640",
		"osType": "IOS",
		"osVersion": "12.2(53)SE2",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC1446Z640,WS-C2960S-24PS-L,NA",
		"hwInstanceId": "FOC1446Z640,WS-C2960S-24PS-L,NA,FOC1446Z640,WS-C2960S-24PS-L,NA,NA",
		"productId": "WS-C2960S-24PS-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Catalyst+2960S-24PS-L+Switch",
		"ipAddress": "10.119.1.124",
		"supportCovered": false,
		"serialNumber": "FOC1446W5E6",
		"osType": "IOS",
		"osVersion": "12.2(53)SE2",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC1446W5E6,WS-C2960S-24PS-L,NA",
		"hwInstanceId": "FOC1446W5E6,WS-C2960S-24PS-L,NA,FOC1446W5E6,WS-C2960S-24PS-L,NA,NA",
		"productId": "WS-C2960S-24PS-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Catalyst+2960S-24PS-L+Switch",
		"ipAddress": "10.119.1.152",
		"supportCovered": false,
		"serialNumber": "FOC1544Y13S",
		"osType": "IOS",
		"osVersion": "12.2(55)SE3",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC1544Y13S,WS-C2960S-24PS-L,NA",
		"hwInstanceId": "FOC1544Y13S,WS-C2960S-24PS-L,NA,FOC1544Y13S,WS-C2960S-24PS-L,NA,NA",
		"productId": "WS-C2960S-24PS-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Catalyst+2960S-24PS-L+Switch",
		"ipAddress": "10.119.1.161",
		"supportCovered": false,
		"serialNumber": "FOC1544Y16V",
		"osType": "IOS",
		"osVersion": "12.2(55)SE3",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC1544Y16V,WS-C2960S-24PS-L,NA",
		"hwInstanceId": "FOC1544Y16V,WS-C2960S-24PS-L,NA,FOC1544Y16V,WS-C2960S-24PS-L,NA,NA",
		"productId": "WS-C2960S-24PS-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Catalyst+2960S-24PS-L+Switch",
		"ipAddress": "10.119.1.144",
		"supportCovered": false,
		"serialNumber": "FOC1544Y17Q",
		"osType": "IOS",
		"osVersion": "12.2(55)SE3",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC1544Y17Q,WS-C2960S-24PS-L,NA",
		"hwInstanceId": "FOC1544Y17Q,WS-C2960S-24PS-L,NA,FOC1544Y17Q,WS-C2960S-24PS-L,NA,NA",
		"productId": "WS-C2960S-24PS-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Catalyst+2960S-24PS-L+Switch",
		"ipAddress": "10.119.1.135",
		"supportCovered": false,
		"serialNumber": "FOC1544Y16S",
		"osType": "IOS",
		"osVersion": "12.2(55)SE3",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC1544Y16S,WS-C2960S-24PS-L,NA",
		"hwInstanceId": "FOC1544Y16S,WS-C2960S-24PS-L,NA,FOC1544Y16S,WS-C2960S-24PS-L,NA,NA",
		"productId": "WS-C2960S-24PS-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Catalyst+2960S-24PS-L+Switch",
		"ipAddress": "10.119.1.121",
		"supportCovered": false,
		"serialNumber": "FOC1446Z641",
		"osType": "IOS",
		"osVersion": "12.2(53)SE2",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC1446Z641,WS-C2960S-24PS-L,NA",
		"hwInstanceId": "FOC1446Z641,WS-C2960S-24PS-L,NA,FOC1446Z641,WS-C2960S-24PS-L,NA,NA",
		"productId": "WS-C2960S-24PS-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Cisco+Catalyst+2950+24+Switch",
		"ipAddress": "172.20.70.230",
		"supportCovered": false,
		"serialNumber": "FAB0550Q1GT",
		"osType": "IOS",
		"osVersion": "12.1(22)EA11",
		"role": "CORE",
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FAB0550Q1GT,WS-C2950-24,NA",
		"hwInstanceId": "FAB0550Q1GT,WS-C2950-24,NA,FAB0550Q1GT,WS-C2950-24,NA,NA",
		"productId": "WS-C2950-24",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Cisco+Catalyst+3850-48U-L+Switch",
		"ipAddress": "172.25.121.6",
		"supportCovered": false,
		"serialNumber": "FOC2045X0WJ",
		"osType": "IOS-XE",
		"osVersion": "03.06.05E",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC2045X0WJ,WS-C3850-48U-L,NA",
		"hwInstanceId": "FOC2045X0WJ,WS-C3850-48U-L,NA,FOC2045X0WJ,WS-C3850-48U-L,NA,NA",
		"productId": "WS-C3850-48U-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Cisco+Catalyst+2960C-12PC-L+Switch",
		"ipAddress": "172.21.142.148",
		"supportCovered": false,
		"serialNumber": "FOC1634Y28U",
		"osType": "IOS",
		"osVersion": "15.0(2)SE8",
		"role": "ACCESS",
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC1634Y28U,WS-C2960C-12PC-L,NA",
		"hwInstanceId": "FOC1634Y28U,WS-C2960C-12PC-L,NA,FOC1634Y28U,WS-C2960C-12PC-L,NA,NA",
		"productId": "WS-C2960C-12PC-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Cisco+Catalyst+3560G-24TS+Switch",
		"ipAddress": "172.23.164.92",
		"supportCovered": false,
		"serialNumber": "FOC1138Y1YS",
		"osType": "IOS",
		"osVersion": "12.2(55)SE5",
		"role": "ACCESS",
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC1138Y1YS,WS-C3560G-24TS-E,NA",
		"hwInstanceId": "FOC1138Y1YS,WS-C3560G-24TS-E,NA,FOC1138Y1YS,WS-C3560G-24TS-E,NA,NA",
		"productId": "WS-C3560G-24TS-E",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "SSM-4GE",
		"ipAddress": "172.20.92.251",
		"supportCovered": false,
		"serialNumber": "JAF1239BDNB",
		"osType": "ASA",
		"osVersion": "8.4(7)",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,JMX1243L1VF,ASA5540,NA",
		"hwInstanceId": "JAF1239BDNB,SSM-4GE,NA,NA,JMX1243L1VF,ASA5540,NA",
		"productId": "SSM-4GE",
		"equipmentType": "MODULE"
	},
	{
		"deviceName": "SPA-2X1GE-V2",
		"ipAddress": "172.20.92.247",
		"supportCovered": false,
		"serialNumber": "SAL1737CVP1",
		"osType": "IOS-XE",
		"osVersion": "15.4(3)S",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FXS1731Q3VJ,ASR1004,NA",
		"hwInstanceId": "SAL1737CVP1,SPA-2X1GE-V2,NA,NA,FXS1731Q3VJ,ASR1004,NA",
		"productId": "SPA-2X1GE-V2",
		"equipmentType": "MODULE"
	},
	{
		"deviceName": "PWR-C1-350WAC",
		"ipAddress": "10.119.1.102",
		"supportCovered": false,
		"serialNumber": "ART1930F1YN",
		"osType": "IOS-XE",
		"osVersion": "03.03.05SE",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC1844X089,WS-C3850-24S,NA",
		"hwInstanceId": "ART1930F1YN,PWR-C1-350WAC,NA,NA,FOC1844X089,WS-C3850-24S,NA",
		"productId": "PWR-C1-350WAC",
		"equipmentType": "POWERSUPPLY"
	},
	{
		"deviceName": "Catalyst+2960S-24PS-L+Switch",
		"ipAddress": "10.119.1.133",
		"supportCovered": false,
		"serialNumber": "FOC1446Z63M",
		"osType": "IOS",
		"osVersion": "12.2(53)SE2",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC1446Z63M,WS-C2960S-24PS-L,NA",
		"hwInstanceId": "FOC1446Z63M,WS-C2960S-24PS-L,NA,FOC1446Z63M,WS-C2960S-24PS-L,NA,NA",
		"productId": "WS-C2960S-24PS-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Catalyst+2960S-24PS-L+Switch",
		"ipAddress": "10.119.1.122",
		"supportCovered": false,
		"serialNumber": "FOC1446W5E3",
		"osType": "IOS",
		"osVersion": "12.2(53)SE2",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC1446W5E3,WS-C2960S-24PS-L,NA",
		"hwInstanceId": "FOC1446W5E3,WS-C2960S-24PS-L,NA,FOC1446W5E3,WS-C2960S-24PS-L,NA,NA",
		"productId": "WS-C2960S-24PS-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Cisco+Catalyst+2960-24TC+Switch",
		"ipAddress": "192.168.99.114",
		"supportCovered": true,
		"serialNumber": "FHK1045Y01E",
		"osType": "IOS",
		"osVersion": "12.2(50)SE",
		"role": "ACCESS",
		"contractNumber": "93856991",
		"managedNeId": "NA,FHK1045Y01E,WS-C2960-24TC-L,NA",
		"hwInstanceId": "FHK1045Y01E,WS-C2960-24TC-L,NA,FHK1045Y01E,WS-C2960-24TC-L,NA,NA",
		"productId": "WS-C2960-24TC-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Cisco+Catalyst+3750X-24T-L+Switch",
		"ipAddress": "192.168.99.215",
		"supportCovered": false,
		"serialNumber": "FDO1734H1MQ",
		"osType": "IOS",
		"osVersion": "15.0(2)SE",
		"role": "ACCESS",
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FDO1734H1MQ,WS-C3750X-24T-L,NA",
		"hwInstanceId": "FDO1734H1MQ,WS-C3750X-24T-L,NA,FDO1734H1MQ,WS-C3750X-24T-L,NA,NA",
		"productId": "WS-C3750X-24T-L",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Catalyst+2960S-48TS-S+Switch",
		"ipAddress": "172.21.140.184",
		"supportCovered": true,
		"serialNumber": "FOC1448Z4U9",
		"osType": "IOS",
		"osVersion": "12.2(55)SE3",
		"role": "ACCESS",
		"contractNumber": "93425688",
		"managedNeId": "NA,FOC1448Z4U9,WS-C2960S-48TS-S,NA",
		"hwInstanceId": "FOC1448Z4U9,WS-C2960S-48TS-S,NA,FOC1448Z4U9,WS-C2960S-48TS-S,NA,NA",
		"productId": "WS-C2960S-48TS-S",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "Cisco+Catalyst+3750G-24T+Switch",
		"ipAddress": "172.23.183.31",
		"supportCovered": true,
		"serialNumber": "CAT1107NHD6",
		"osType": "IOS",
		"osVersion": "12.2(55)SE8",
		"role": "ACCESS",
		"contractNumber": "93425688",
		"managedNeId": "NA,CAT1107NHD6,WS-C3750G-24T-S,NA",
		"hwInstanceId": "CAT1107NHD6,WS-C3750G-24T-S,NA,CAT1107NHD6,WS-C3750G-24T-S,NA,NA",
		"productId": "WS-C3750G-24T-S",
		"equipmentType": "CHASSIS",
		"lastScan": "2019-07-09T09:27:32.483",
	},
	{
		"deviceName": "WS-X4516",
		"ipAddress": "172.23.164.88",
		"supportCovered": false,
		"serialNumber": "JAE1051HKZW",
		"osType": "IOS",
		"osVersion": "15.0(2)SG7",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOX1335GRHG,WS-C4506-E,NA",
		"hwInstanceId": "JAE1051HKZW,WS-X4516,NA,NA,FOX1335GRHG,WS-C4506-E,NA",
		"productId": "WS-X4516",
		"equipmentType": "MODULE"
	},
	{
		"deviceName": "C3850-NM-4-10G",
		"ipAddress": "172.25.121.6",
		"supportCovered": false,
		"serialNumber": "FOC20472BD5",
		"osType": "IOS-XE",
		"osVersion": "03.06.05E",
		"role": null,
		"contractNumber": "UNKNOWN",
		"managedNeId": "NA,FOC2045X0WJ,WS-C3850-48U-L,NA",
		"hwInstanceId": "FOC20472BD5,C3850-NM-4-10G,NA,NA,FOC2045X0WJ,WS-C3850-48U-L,NA",
		"productId": "C3850-NM-4-10G",
		"equipmentType": "MODULE"
	},
	{
		"deviceName": "C3850-NM-4-10G",
		"ipAddress": "172.25.121.6",
		"supportCovered": true,
		// This is a serial number for which we can open a case. It passes the CSOne
		// entitlement checks for svorma1.
		"serialNumber": "35641136A1621",
		"osType": "IOS-XE",
		"osVersion": "03.06.05E",
		"role": null,
		"contractNumber": "200758679",
		"managedNeId": "NA,FOC2045X0WJ,WS-C3850-48U-L,NA",
		"hwInstanceId": "FOC20472BD5,C3850-NM-4-10G,NA,NA,FOC2045X0WJ,WS-C3850-48U-L,NA",
		"productId": "C3850-NM-4-10G",
		"equipmentType": "MODULE"
	},
	/* tslint:enable */
];

/**
 * Function to generate the mock Assets Response
 * @param rows the rows to return
 * @param page the page to return
 * @param contractNumber the contractNumber to filter on
 * @param supportCovered the values to filter coverage
 * @param role the roles to filter on
 * @returns the assets response
 */
export function MockAssets (
	rows: number,
	page: number,
	contractNumber?: string[],
	supportCovered?: boolean[],
	role?: string[]): Assets {
	let data = _.cloneDeep(MockAssetsData);

	if (contractNumber) {
		const filtered = [];

		_.each(contractNumber, (cNumber: string) => {
			filtered.push(_.filter(data, { contractNumber: cNumber }));
		});

		data = _.flatten(filtered);
	}

	if (supportCovered) {
		data = _.filter(
			data,
			i => _.indexOf(supportCovered, i.supportCovered) >= 0);
	}

	if (role) {
		const filtered = [];

		_.each(role, (r: string) => {
			filtered.push(_.filter(data, { role: r }));
		});

		data = _.flatten(filtered);
	}

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
export const AssetScenarios = [
	{
		scenarios: {
			HEAD: [
				{
					delay: 30,
					description: 'Assets Count',
					response: {
						headers: new HttpHeaders({
							'X-API-RESULT-COUNT': '40',
						}),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance&solution=IBN`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: 'Covered Assets',
					response: {
						body: MockAssets(10, 1, null, [true]),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=deviceName:ASC&rows=10&page=1&coverage=covered`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 44,
					description: 'Covered Assets - Grid View',
					response: {
						body: MockAssets(12, 1, null, [true]),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=12&page=1&coverage=covered`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 60,
					description: 'ACCESS Assets Page 1',
					response: {
						body: MockAssets(10, 1, null, null, ['ACCESS']),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=10&role=ACCESS&page=1`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 60,
					description: 'ACCESS Assets Page 1 - Grid',
					response: {
						body: MockAssets(12, 1, null, null, ['ACCESS']),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=12&role=ACCESS&page=1`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: 'Assets Page 1',
					response: {
						body: MockAssets(10, 1),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 0,
					description: '(Assets) Unreachable API',
					response: {
						body: { },
						status: 503,
					},
					selected: false,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance` +
			'&sort=criticalAdvisories:DESC&sort=deviceName:ASC&solution=IBN&rows=10&page=1',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: 'Assets Page 1 (no page param)',
					response: {
						body: MockAssets(10, 1),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=deviceName:ASC&rows=10`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 38,
					description: 'Assets Page 2',
					response: {
						body: MockAssets(10, 2),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance` +
			'&sort=criticalAdvisories:DESC&sort=deviceName:ASC&solution=IBN&rows=10&page=2',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 43,
					description: 'Assets Page 3',
					response: {
						body: MockAssets(10, 3),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance` +
			'&sort=criticalAdvisories:DESC&sort=deviceName:ASC&solution=IBN&rows=10&page=3',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 33,
					description: 'Assets Page 4',
					response: {
						body: MockAssets(10, 4),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance` +
			'&sort=criticalAdvisories:DESC&sort=deviceName:ASC&solution=IBN&rows=10&page=4',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 44,
					description: 'Assets Page 1 - Grid View',
					response: {
						body: MockAssets(12, 1),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 0,
					description: '(Assets) Unreachable API - Grid View',
					response: {
						body: { },
						status: 503,
					},
					selected: false,
				},
				{
					delay: 38,
					description: '(Assets) Missing data - Grid View',
					response: {
						body: (() => {
							const { data, Pagination } = MockAssets(1, 1);

							return {
								Pagination,
								data: [_.pick(data[0], ['deviceName', 'serialNumber'])],
							};
						})(),
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=deviceName:ASC&rows=12&page=1`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 44,
					description: 'Assets Page 2 - Grid View',
					response: {
						body: MockAssets(12, 2),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=deviceName:ASC&rows=12&page=2`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 44,
					description: 'Assets Page 3 - Grid View',
					response: {
						body: MockAssets(12, 3),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=deviceName:ASC&rows=12&page=3`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 44,
					description: 'Assets Page 4 - Grid View',
					response: {
						body: MockAssets(12, 4),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=deviceName:ASC&rows=12&page=4`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 36,
					description: 'Contract 93856991 Filtering',
					response: {
						body: MockAssets(10, 1, ['93856991']),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=deviceName:ASC&rows=10` +
			'&page=1&contractNumber=93856991',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: 'Serial Number ',
					response: {
						body: {
							data: [MockAssetsData[0]],
						},
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?customerId=${customerId}&serialNumber=FOC1544Y16T`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: 'Asset by managedNeId',
					response: {
						body: {
							data: [MockAssetsData[0]],
						},
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&sort=deviceName:ASC` +
			'&managedNeId=NA,FOC1544Y16T,WS-C2960S-24PS-L,NA',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Asset by NeId',
					response: {
						body: {
							data: [MockAssetsData[1]],
						},
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&useCase=Campus Network Assurance&solution=IBN` +
			'&rows=1&page=1&neId=NA,FHK1045Y01E,WS-C2960-24TC-L,NA',
		usecases: ['Use Case 1'],
	},
];
