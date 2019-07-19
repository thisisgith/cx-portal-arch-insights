import { Assets, Asset } from '@sdp-api';
import * as _ from 'lodash-es';

/** Base of URL for SDP API */
const api = '/api/customerportal/inventory/v1/assets';

/** Default Customer ID */
const customerId = '2431199';

/** Mock data for Network Elements API Results */
export const mockResponse: Asset[] = [
	/* tslint:disable */
	{
			"deviceName": "Catalyst+2960S-24PS-L+Switch",
			"ipAddress": "10.119.1.125",
			"supportCovered": true,
			"serialNumber": "FOC1544Y16T",
			"osType": "IOS",
			"osVersion": "12.2(55)SE3",
			"role": "ACCESS",
			"contractNumber": "93425688",
			"managedNeId": "NA,FOC1544Y16T,WS-C2960S-24PS-L,NA",
			"hwInstanceId": "FOC1544Y16T,WS-C2960S-24PS-L,NA,FOC1544Y16T,WS-C2960S-24PS-L,NA,NA",
			"containingHwId": null,
			"productId": "WS-C2960S-24PS-L",
			"equipmentType": "CHASSIS",
			"lastScan": "2019-07-09T09:27:32.483",
	},
	{
			"deviceName": "Cisco+Catalyst+2960X-24PS-L+Switch",
			"ipAddress": "10.119.1.131",
			"supportCovered": false,
			"serialNumber": "FOC1922S6JU",
			"osType": "IOS",
			"osVersion": "15.0(2a)EX5",
			"role": null,
			"contractNumber": "UNKNOWN",
			"managedNeId": "NA,FOC1922S6JU,WS-C2960X-24PS-L,NA",
			"hwInstanceId": "FOC1922S6JU,WS-C2960X-24PS-L,NA,FOC1922S6JU,WS-C2960X-24PS-L,NA,NA",
			"containingHwId": null,
			"productId": "WS-C2960X-24PS-L",
			"equipmentType": "CHASSIS",
 			"lastScan": "2019-07-09T09:27:32.483",
	},
	{
			"deviceName": "Catalyst+2960S-24PS-L+Switch",
			"ipAddress": "10.119.1.141",
			"supportCovered": false,
			"serialNumber": "FOC1446W570",
			"osType": "IOS",
			"osVersion": "12.2(53)SE2",
			"role": null,
			"contractNumber": "UNKNOWN",
			"managedNeId": "NA,FOC1446W570,WS-C2960S-24PS-L,NA",
			"hwInstanceId": "FOC1446W570,WS-C2960S-24PS-L,NA,FOC1446W570,WS-C2960S-24PS-L,NA,NA",
			"containingHwId": null,
			"productId": "WS-C2960S-24PS-L",
			"equipmentType": "CHASSIS",
 			"lastScan": "2019-07-09T09:27:32.483",
	},
	{
			"deviceName": "Catalyst+2960S-24PS-L+Switch",
			"ipAddress": "10.119.1.171",
			"supportCovered": false,
			"serialNumber": "FOC1544Y175",
			"osType": "IOS",
			"osVersion": "12.2(55)SE3",
			"role": null,
			"contractNumber": "UNKNOWN",
			"managedNeId": "NA,FOC1544Y175,WS-C2960S-24PS-L,NA",
			"hwInstanceId": "FOC1544Y175,WS-C2960S-24PS-L,NA,FOC1544Y175,WS-C2960S-24PS-L,NA,NA",
			"containingHwId": null,
			"productId": "WS-C2960S-24PS-L",
			"equipmentType": "CHASSIS",
 			"lastScan": "2019-07-09T09:27:32.483",
	},
	{
			"deviceName": "Cisco+Catalyst+2960-24PC-L+Switch",
			"ipAddress": "172.20.92.246",
			"supportCovered": false,
			"serialNumber": "FOC1348W6JP",
			"osType": "IOS",
			"osVersion": "12.2(44)SE6",
			"role": "ACCESS",
			"contractNumber": "UNKNOWN",
			"managedNeId": "NA,FOC1348W6JP,WS-C2960-24PC-L,NA",
			"hwInstanceId": "FOC1348W6JP,WS-C2960-24PC-L,NA,FOC1348W6JP,WS-C2960-24PC-L,NA,NA",
			"containingHwId": null,
			"productId": "WS-C2960-24PC-L",
			"equipmentType": "CHASSIS",
 			"lastScan": "2019-07-09T09:27:32.483",
	},
	{
			"deviceName": "VWIC-2MFT-T1",
			"ipAddress": "172.20.70.42",
			"supportCovered": false,
			"serialNumber": "35334200",
			"osType": "IOS",
			"osVersion": "12.4(15)T",
			"role": "BORDER ROUTER",
			"contractNumber": "UNKNOWN",
			"managedNeId": "NA,FTX1046A57N,CISCO3825,NA",
			"hwInstanceId": "35334200,VWIC-2MFT-T1=,NA,NA,FTX1046A57N,CISCO3825,NA",
			"containingHwId": null,
			"productId": "VWIC-2MFT-T1",
			"equipmentType": "MODULE"
	},
	{
			"deviceName": "PWR-C1-350WAC",
			"ipAddress": "10.119.1.101",
			"supportCovered": false,
			"serialNumber": "ART1939F247",
			"osType": "IOS-XE",
			"osVersion": "03.03.05SE",
			"role": null,
			"contractNumber": "UNKNOWN",
			"managedNeId": "NA,FCW1915C0GL,WS-C3850-24S,NA",
			"hwInstanceId": "ART1939F247,PWR-C1-350WAC,NA,NA,FCW1915C0GL,WS-C3850-24S,NA",
			"containingHwId": "FCW1915C0GL,WS-C3850-24S,NA,FCW1915C0GL,WS-C3850-24S,NA,NA",
			"productId": "PWR-C1-350WAC",
			"equipmentType": "POWERSUPPLY"
	},
	{
			"deviceName": "Catalyst+2960S-24PS-L+Switch+Catalyst+2960S-24PS-L+Switch",
			"ipAddress": "10.119.1.151",
			"supportCovered": false,
			"serialNumber": "FOC1544Y1AV",
			"osType": "IOS",
			"osVersion": "12.2(55)SE3",
			"role": null,
			"contractNumber": "UNKNOWN",
			"managedNeId": "NA,FOC1544Y1AV,WS-C2960S-24PS-L,NA",
			"hwInstanceId": "FOC1544Y1AV,WS-C2960S-24PS-L,NA,FOC1544Y1AV,WS-C2960S-24PS-L,NA,NA",
			"containingHwId": null,
			"productId": "WS-C2960S-24PS-L",
			"equipmentType": "CHASSIS",
 			"lastScan": "2019-07-09T09:27:32.483",
	},
	{
			"deviceName": "Cisco+ASR+1004+Router",
			"ipAddress": "172.20.92.247",
			"supportCovered": false,
			"serialNumber": "FXS1731Q3VJ",
			"osType": "IOS-XE",
			"osVersion": "15.4(3)S",
			"role": null,
			"contractNumber": "UNKNOWN",
			"managedNeId": "NA,FXS1731Q3VJ,ASR1004,NA",
			"hwInstanceId": "FXS1731Q3VJ,ASR1004,NA,FXS1731Q3VJ,ASR1004,NA,NA",
			"containingHwId": null,
			"productId": "ASR1004",
			"equipmentType": "CHASSIS",
 			"lastScan": "2019-07-09T09:27:32.483",
	},
	{
			"deviceName": "ASR1000-SIP10",
			"ipAddress": "172.20.92.247",
			"supportCovered": false,
			"serialNumber": "JAE173707MT",
			"osType": "IOS-XE",
			"osVersion": "15.4(3)S",
			"role": null,
			"contractNumber": "UNKNOWN",
			"managedNeId": "NA,FXS1731Q3VJ,ASR1004,NA",
			"hwInstanceId": "JAE173707MT,ASR1000-SIP10,NA,NA,FXS1731Q3VJ,ASR1004,NA",
			"containingHwId": null,
			"productId": "ASR1000-SIP10",
			"equipmentType": "MODULE"
	},
	{
			"deviceName": "Cisco+Catalyst+4506-E+Switch",
			"ipAddress": "172.21.140.40",
			"supportCovered": true,
			"serialNumber": "FOX1306GFKH",
			"osType": "IOS",
			"osVersion": "15.0(2)SG7",
			"role": null,
			"contractNumber": "93425688",
			"managedNeId": "NA,FOX1306GFKH,WS-C4506-E,NA",
			"hwInstanceId": "FOX1306GFKH,WS-C4506-E,NA,FOX1306GFKH,WS-C4506-E,NA,NA",
			"containingHwId": null,
			"productId": "WS-C4506-E",
			"equipmentType": "CHASSIS",
 			"lastScan": "2019-07-09T09:27:32.483",
	},
	{
			"deviceName": "Cisco+Catalyst+3750G-12S+Switch",
			"ipAddress": "172.20.70.10",
			"supportCovered": false,
			"serialNumber": "CAT1042RG17",
			"osType": "IOS",
			"osVersion": "12.2(55)SE9",
			"role": "ACCESS",
			"contractNumber": "UNKNOWN",
			"managedNeId": "NA,CAT1042RG17,WS-C3750G-12S-E,NA",
			"hwInstanceId": "CAT1042RG17,WS-C3750G-12S-E,NA,CAT1042RG17,WS-C3750G-12S-E,NA,NA",
			"containingHwId": null,
			"productId": "WS-C3750G-12S-E",
			"equipmentType": "CHASSIS",
 			"lastScan": "2019-07-09T09:27:32.483",
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": "FOC1844X089,WS-C3850-24S,NA,FOC1844X089,WS-C3850-24S,NA,NA",
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
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
			"containingHwId": null,
			"productId": "C3850-NM-4-10G",
			"equipmentType": "MODULE"
	}
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
function MockAssets (
	rows: number,
	page: number,
	contractNumber?: string[],
	supportCovered?: boolean[],
	role?: string[]): Assets {
	let data = _.cloneDeep(mockResponse);

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
			GET: [
				{
					delay: 100,
					description: 'Assets Count',
					response: {
						body: MockAssets(1, 1),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=1&page=1`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Covered Assets',
					response: {
						body: MockAssets(10, 1, null , [true]),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=10&page=1&coverage=covered`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Covered Assets - Grid View',
					response: {
						body: MockAssets(12, 1, null , [true]),
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
					delay: 900,
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
					delay: 900,
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
					delay: 500,
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
		url: `${api}?customerId=${customerId}&rows=10&page=1`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: 'Assets Page 2',
					response: {
						body: MockAssets(10, 2),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=10&page=2`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 325,
					description: 'Assets Page 3',
					response: {
						body: MockAssets(10, 3),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=10&page=3`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 150,
					description: 'Assets Page 4',
					response: {
						body: MockAssets(10, 4),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=10&page=4`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
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
					delay: 0,
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
		url: `${api}?customerId=${customerId}&rows=12&page=1`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Assets Page 2 - Grid View',
					response: {
						body: MockAssets(12, 2),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=12&page=2`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Assets Page 3 - Grid View',
					response: {
						body: MockAssets(12, 3),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=12&page=3`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Assets Page 4 - Grid View',
					response: {
						body: MockAssets(12, 4),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=12&page=4`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 225,
					description: 'Contract 93856991 Filtering',
					response: {
						body: MockAssets(10, 1, ['93856991']),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=10&page=1&contractNumber=93856991`,
		usecases: ['Use Case 1'],
	},
];
