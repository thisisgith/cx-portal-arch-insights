import { HardwareResponse } from '@sdp-api';
import * as _ from 'lodash-es';

/** Base of URL for SDP API */
const api = '/api/customerportal/inventory/v1/hardware';

/** Default Customer ID */
const customerId = '2431199';

/** Default Product ID */
const productId = 'WS-C2960S-24PS-L';

/**
 * Mock data for Inventory API results
 */
export const MockHardwareResponse: HardwareResponse = {
	data: [
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C3750G-12S',
			hwInstanceId: '9A86PVSCGD3,ASAv,NA,9A86PVSCGD3,ASAv,NA,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: '2',
			productFamily: 'Adaptive Security Appliances (ASA)',
			productId: 'ASAv',
			productName: 'Adaptive Security Appliance',
			productType: 'Security',
			serialNumber: '1234',
			swType: 'IOS',
			swVersion: '3.4.1',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'NA',
			equipmentType: 'MODULE',
			hostname: 'C3750G-12S',
			hwInstanceId: 'JAE0612031D,WS-X4232-GB-RJ,NA,NA,FOX1306GFKH,WS-C4506-E,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: '2',
			productFamily: 'Catalyst 4K Series Modules',
			productId: 'WS-X4232-GB-RJ',
			productName: 'Catalyst 4K Series Module',
			productType: 'Modules',
			serialNumber: 'AAA',
			swType: 'IOS',
			swVersion: '3.4.1',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'NA',
			equipmentType: 'MODULE',
			hostname: 'C3750G-12S',
			hwInstanceId: 'JAE1051HKZW,WS-X4516,NA,NA,FOX1335GRHG,WS-C4506-E,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: '1',
			productFamily: 'Catalyst 4K Series Supervisor Modules',
			productId: 'WS-X4516',
			productName: 'Catalyst 4K Series Module',
			productType: 'Modules',
			serialNumber: '1234',
			swType: 'IOS',
			swVersion: '3.1.1',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'MODULE',
			hostname: 'C4506-E',
			hwInstanceId: 'JAE0612031D,WS-X4232-GB-RJ,NA,NA,FOX1306GFKH,WS-C4506-E,NA',
			managedNeId: 'NA,FOX1306GFKH,WS-C4506-E,NA',
			managementAddress: '172.21.140.40',
			productDescription: '1',
			productFamily: 'Catalyst 4K Series Modules',
			productId: 'WS-X4232-GB-RJ',
			productName: 'Catalyst 4K Series Module',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.0(2)SG7',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'POWERSUPPLY',
			hostname: 'C4506-E',
			hwInstanceId: 'SON07130AEZ,PWR-C45-1300ACV,NA,NA,FOX1306GFKH,WS-C4506-E,NA',
			managedNeId: 'NA,FOX1306GFKH,WS-C4506-E,NA',
			managementAddress: '172.21.140.40',
			productDescription: '1',
			productFamily: 'Catalyst 4K Series Power Supplies',
			productId: 'PWR-C45-1300ACV',
			productName: 'Catalyst 4K Series Power Supply',
			productType: 'Power Supplies',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.0(2)SG7',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C3560G-24TS',
			hwInstanceId: 'NA,NA,172.23.164.92,NA,NA,NA,-1',
			managedNeId: '172.23.164.92,NA,NA,NA',
			managementAddress: '172.23.164.92',
			productDescription: '1',
			productFamily: 'Cisco Catalyst 3560 Series Switches',
			productId: '',
			productName: 'Cisco Catalyst 3560 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '1.1.1',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C2960S-48TS-S',
			hwInstanceId: 'NA,NA,172.21.140.184,NA,NA,NA,-1',
			managedNeId: '172.21.140.184,NA,NA,NA',
			managementAddress: '172.21.140.184',
			productDescription: null,
			productFamily: 'Cisco Catalyst 2960-S Series Switches',
			productId: 'WS-C2960S-48TS-S',
			productName: 'Cisco Catalyst 2960 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '2.2(3)',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C3560X-24T-L',
			hwInstanceId: 'NA,NA,172.21.140.183,NA,NA,NA,-1',
			managedNeId: '172.21.140.183,NA,NA,NA',
			managementAddress: '172.21.140.183',
			productDescription: '2',
			productFamily: 'Cisco Catalyst 3560-X Series Switches',
			productId: '',
			productName: 'Cisco Catalyst 3560-X Series Switches',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'MODULE',
			hostname: 'ASR1004',
			hwInstanceId: 'JAE173707MT,ASR1000-SIP10,NA,NA,FXS1731Q3VJ,ASR1004,NA',
			managedNeId: 'NA,FXS1731Q3VJ,ASR1004,NA',
			managementAddress: '172.20.92.247',
			productDescription: '2',
			productFamily: 'ASR 1000 Series Cards',
			productId: 'ASR1000-SIP10',
			productName: 'ASR 1000 Series Card',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS-XE',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'MODULE',
			hostname: 'ASR1004',
			hwInstanceId: 'JAE17380CSW,ASR1000-ESP10,NA,NA,FXS1731Q3VJ,ASR1004,NA',
			managedNeId: 'NA,FXS1731Q3VJ,ASR1004,NA',
			managementAddress: '172.20.92.247',
			productDescription: '2',
			productFamily: 'ASR 1000 Series Cards',
			productId: 'ASR1000-ESP10',
			productName: 'ASR 1000 Series Card',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS-XE',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C3750G-24T',
			hwInstanceId: 'NA,NA,172.23.183.31,NA,NA,NA,-1',
			managedNeId: '172.23.183.31,NA,NA,NA',
			managementAddress: '172.23.183.31',
			productDescription: '2',
			productFamily: 'Cisco Catalyst 3750 Series Switches',
			productId: '',
			productName: 'Cisco Catalyst 3750 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C3750G-12S',
			hwInstanceId: 'NA,NA,172.20.92.246,NA,NA,NA,-1',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'Cisco Catalyst 2960 Series Switches',
			productId: 'WS-C2960-24PC-L',
			productName: 'Cisco Catalyst 2960 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C3750G-12S',
			hwInstanceId: 'NA,NA,172.21.140.184,NA,NA,NA,-1',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: '1',
			productFamily: 'Cisco Catalyst 2960-S Series Switches',
			productId: 'WS-C2960S-48TS-S',
			productName: 'Cisco Catalyst 2960-S Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C3750G-12S',
			hwInstanceId: 'FOC2045X0WJ,WS-C3850-48U,NA,NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: '1',
			productFamily: 'Cisco Catalyst 3850 Series Switches',
			productId: 'WS-C3850-48U',
			productName: 'Cisco Catalyst 3850 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'NA',
			equipmentType: 'MODULE',
			hostname: 'C3750G-12S',
			hwInstanceId: 'FOC20472BD5,C3850-NM-4-10G,NA,NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'Catalyst 2K/3K Series Modules',
			productId: 'C3850-NM-4-10G',
			productName: 'Catalyst 2K/3K Series Modules',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'NA',
			equipmentType: 'FAN',
			hostname: 'C3750G-12S',
			hwInstanceId: 'FOX1335GF0Q,WS-X4596-E,NA,NA,FOX1335GRHG,WS-C4506-E,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: '1',
			productFamily: 'Catalyst 4K Series Fans',
			productId: 'WS-X4596-E=',
			productName: 'Catalyst 4K Series Fan',
			productType: 'Fans',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'NA',
			equipmentType: 'POWERSUPPLY',
			hostname: 'C3750G-12S',
			hwInstanceId: 'ART1728K037,ASR1004-PWR-AC,NA,NA,FXS1731Q3VJ,ASR1004,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: '1',
			productFamily: 'ASR 1000 Series Power Supplies',
			productId: 'ASR1004-PWR-AC',
			productName: 'ASR 1000 Series Power Supply',
			productType: 'Power Supplies',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'NA',
			equipmentType: 'MODULE',
			hostname: 'C3750G-12S',
			hwInstanceId: 'JAE173707MT,ASR1000-SIP10,NA,NA,FXS1731Q3VJ,ASR1004,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: '1',
			productFamily: 'ASR 1000 Series Cards',
			productId: 'ASR1000-SIP10',
			productName: 'ASR 1000 Series Card',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'MODULE',
			hostname: 'C3850',
			hwInstanceId: 'FOC20472BD5,C3850-NM-4-10G,NA,NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			managedNeId: 'NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			managementAddress: '172.25.121.6',
			productDescription: '1',
			productFamily: 'Catalyst 2K/3K Series Modules',
			productId: 'C3850-NM-4-10G',
			productName: 'Catalyst 2K/3K Series Module',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS-XE',
			swVersion: '03.06.05E',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C3750G-12S',
			hwInstanceId: 'NA,NA,172.20.70.10,NA,NA,NA,-1',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: '2',
			productFamily: 'Cisco Catalyst 3750 Series Switches',
			productId: '',
			productName: 'Cisco Catalyst 3750 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C2950-24',
			hwInstanceId: 'NA,NA,172.20.70.230,NA,NA,NA,-1',
			managedNeId: '172.20.70.230,NA,NA,NA',
			managementAddress: '172.20.70.230',
			productDescription: '2',
			productFamily: 'Cisco Catalyst 2950 Series Switches',
			productId: 'WS-C2950-24',
			productName: 'Cisco Catalyst 2950 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'JMX1243L1VF,ASA5540,NA,JMX1243L1VF,ASA5540,NA,NA',
			equipmentType: 'MODULE',
			hostname: 'ASA-5540',
			hwInstanceId: 'JAF1239BDNB,SSM-4GE,NA,NA,JMX1243L1VF,ASA5540,NA',
			managedNeId: 'NA,JMX1243L1VF,ASA5540,NA',
			managementAddress: '172.20.92.251',
			productDescription: '2',
			productFamily: 'ASA 5500 Modules',
			productId: 'SSM-4GE',
			productName: 'ASA 5500 Module',
			productType: 'Modules',
			serialNumber: null,
			swType: 'ASA',
			swVersion: '8.4(7)',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'MODULE',
			hostname: 'c4500',
			hwInstanceId: 'JAB072204VM,WS-X4448-GB-RJ45,NA,NA,FOX1335GRHG,WS-C4506-E,NA',
			managedNeId: 'NA,FOX1335GRHG,WS-C4506-E,NA',
			managementAddress: '172.23.164.88',
			productDescription: '2',
			productFamily: 'Catalyst 4K Series Modules',
			productId: 'WS-X4448-GB-RJ45',
			productName: 'Catalyst 4K Series Module',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.0(2)SG7',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'MODULE',
			hostname: 'ASR1004',
			hwInstanceId: 'JAE17400HM6,ASR1000-RP1,NA,NA,FXS1731Q3VJ,ASR1004,NA',
			managedNeId: 'NA,FXS1731Q3VJ,ASR1004,NA',
			managementAddress: '172.20.92.247',
			productDescription: '1',
			productFamily: 'ASR 1000 Series Cards',
			productId: 'ASR1000-RP1',
			productName: 'ASR 1000 Series Card',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS-XE',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'MODULE',
			hostname: 'ASR1004',
			hwInstanceId: 'SAL1737CVP1,SPA-2X1GE-V2,NA,NA,FXS1731Q3VJ,ASR1004,NA',
			managedNeId: 'NA,FXS1731Q3VJ,ASR1004,NA',
			managementAddress: '172.20.92.247',
			productDescription: '1',
			productFamily: 'Shared Port Adapters',
			productId: 'SPA-2X1GE-V2',
			productName: 'Shared Port Adapter',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS-XE',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'NA',
			equipmentType: 'POWERSUPPLY',
			hostname: 'C3750G-12S',
			hwInstanceId: 'SON07130AC0,PWR-C45-1300ACV,NA,NA,FOX1335GRHG,WS-C4506-E,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: '2',
			productFamily: 'Catalyst 4K Series Power Supplies',
			productId: 'PWR-C45-1300ACV',
			productName: 'Catalyst 4K Series Power Supply',
			productType: 'Power Supplies',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'FOC1922S6JU,WS-C2960X-24PS-L,NA,FOC1922S6JU,WS-C2960X-24PS-L,NA,NA',
			equipmentType: 'MODULE',
			hostname: '1971THE2-swi-LIMDR_P7_2_SD_DR',
			hwInstanceId: 'AGM1538L4ZG,Unspecified,NA,NA,FOC1922S6JU,WS-C2960X-24PS-L,NA',
			managedNeId: '10.119.1.172,NA,NA,NA',
			managementAddress: '10.119.1.172',
			productDescription: null,
			productFamily: 'Transceiver Modules',
			productId: '',
			productName: 'Transceiver Module',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: '1971THE2-swi-LIMDR_P7_2_SD_DR',
			hwInstanceId: 'FOC1922S6JU,WS-C2960X-24PS-L,NA,FOC1922S6JU,WS-C2960X-24PS-L,NA,NA',
			managedNeId: '10.119.1.172,NA,NA,NA',
			managementAddress: '10.119.1.172',
			productDescription: null,
			productFamily: 'Cisco Catalyst 2960-X Series Switches',
			productId: 'WS-C2960X-24PS-L',
			productName: 'Cisco Catalyst 2960-X Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'POWERSUPPLY',
			hostname: 'C3850',
			hwInstanceId: 'DTN2046V1R0,PWR-C1-1100WAC,NA,NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			managedNeId: 'NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			managementAddress: '172.25.121.6',
			productDescription: null,
			productFamily: 'Catalyst 2K/3K Series Power Supplies',
			productId: 'PWR-C1-1100WAC',
			productName: 'Catalyst 2K/3K Series Power Supply',
			productType: 'Power Supplies',
			serialNumber: null,
			swType: 'IOS-XE',
			swVersion: '03.06.05E',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'c4500',
			hwInstanceId: 'FOX1335GRHG,WS-C4506-E,NA,FOX1335GRHG,WS-C4506-E,NA,NA',
			managedNeId: 'NA,FOX1335GRHG,WS-C4506-E,NA',
			managementAddress: '172.23.164.88',
			productDescription: null,
			productFamily: 'Cisco Catalyst 4500 Series Switches',
			productId: 'WS-C4506-E',
			productName: 'Cisco Catalyst 4500 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.0(2)SG7',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'POWERSUPPLY',
			hostname: 'c4500',
			hwInstanceId: 'SON07130AC0,PWR-C45-1300ACV,NA,NA,FOX1335GRHG,WS-C4506-E,NA',
			managedNeId: 'NA,FOX1335GRHG,WS-C4506-E,NA',
			managementAddress: '172.23.164.88',
			productDescription: null,
			productFamily: 'Catalyst 4K Series Power Supplies',
			productId: 'PWR-C45-1300ACV',
			productName: 'Catalyst 4K Series Power Supply',
			productType: 'Power Supplies',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.0(2)SG7',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'ASR1004',
			hwInstanceId: 'FXS1731Q3VJ,ASR1004,NA,FXS1731Q3VJ,ASR1004,NA,NA',
			managedNeId: 'NA,FXS1731Q3VJ,ASR1004,NA',
			managementAddress: '172.20.92.247',
			productDescription: null,
			productFamily: 'Cisco ASR 1000 Series Aggregation Services Routers',
			productId: 'ASR1004',
			productName: 'Cisco ASR 1000 Series Aggregation Services Router',
			productType: 'Routers',
			serialNumber: null,
			swType: 'IOS-XE',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C3750G-12S',
			hwInstanceId: 'NA,NA,172.20.70.230,NA,NA,NA,-1',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'Cisco Catalyst 2950 Series Switches',
			productId: 'WS-C2950-24',
			productName: 'Cisco Catalyst 2950 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'FOC2045X0WJ,WS-C3850-48U,NA,NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			equipmentType: 'CHASSIS',
			hostname: 'C3750G-12S',
			hwInstanceId: 'FOC2045X0WJ,WS-C3850-48U-L,NA,FOC2045X0WJ,WS-C3850-48U-L,NA,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'Cisco Catalyst 3850 Series Switches',
			productId: 'WS-C3850-48U-L',
			productName: 'Cisco Catalyst 3850 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'JAE141705ME,WS-X4515,NA,NA,FOX1306GFKH,WS-C4506-E,NA',
			equipmentType: 'MODULE',
			hostname: 'C3750G-12S',
			hwInstanceId: 'JAE14150M8K,WS-F4531,NA,NA,FOX1306GFKH,WS-C4506-E,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'Catalyst 4K Series Modules',
			productId: 'WS-F4531',
			productName: 'Catalyst 4K Series Module',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'NA',
			equipmentType: 'MODULE',
			hostname: 'C3750G-12S',
			hwInstanceId: 'JAE141705ME,WS-X4515,NA,NA,FOX1306GFKH,WS-C4506-E,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'Catalyst 4K Series Supervisor Modules',
			productId: 'WS-X4515',
			productName: 'Catalyst 4K Series Supervisor Module',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: '1971THE2-swi-LIMDR_P7_2_SD_DR',
			hwInstanceId: 'NA,NA,172.28.136.10,NA,NA,NA,-3',
			managedNeId: '10.119.1.172,NA,NA,NA',
			managementAddress: '10.119.1.172',
			productDescription: null,
			productFamily: 'Cisco 2800 Series Integrated Services Routers',
			productId: 'CISCO2811',
			productName: 'Cisco 2800 Series Integrated Services Router',
			productType: 'Routers',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'FOC1844X089,WS-C3850-24S,NA,FOC1844X089,WS-C3850-24S,NA,NA',
			equipmentType: 'POWERSUPPLY',
			hostname: '1971THE2-swi-LIMDR_P7_2_SD_DR',
			hwInstanceId: 'ART1930F1YN,PWR-C1-350WAC,NA,NA,FOC1844X089,WS-C3850-24S,NA',
			managedNeId: '10.119.1.172,NA,NA,NA',
			managementAddress: '10.119.1.172',
			productDescription: null,
			productFamily: 'Catalyst 2K/3K Series Power Supplies',
			productId: 'PWR-C1-350WAC',
			productName: 'Catalyst 2K/3K Series Power Supply',
			productType: 'Power Supplies',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: '1971THE2-swi-LIMDR_P7_2_SD_DR',
			hwInstanceId: 'FOC1844X089,WS-C3850-24S,NA,FOC1844X089,WS-C3850-24S,NA,NA',
			managedNeId: '10.119.1.172,NA,NA,NA',
			managementAddress: '10.119.1.172',
			productDescription: null,
			productFamily: 'Cisco Catalyst 3850 Series Switches',
			productId: 'WS-C3850-24S',
			productName: 'Cisco Catalyst 3850 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'FOC1844X089,WS-C3850-24S,NA,FOC1844X089,WS-C3850-24S,NA,NA',
			equipmentType: 'FAN',
			hostname: '1971THE2-swi-LIMDR_P7_2_SD_DR',
			hwInstanceId: 'NA,NA,1012,NA,FOC1844X089,WS-C3850-24S,NA',
			managedNeId: '10.119.1.172,NA,NA,NA',
			managementAddress: '10.119.1.172',
			productDescription: null,
			productFamily: 'Catalyst 2K/3K Series Fans',
			productId: 'C3850-FAN-T1=',
			productName: 'Catalyst 2K/3K Series Fan',
			productType: 'Fans',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C3850',
			hwInstanceId: 'FOC2045X0WJ,WS-C3850-48U,NA,NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			managedNeId: 'NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			managementAddress: '172.25.121.6',
			productDescription: null,
			productFamily: 'Cisco Catalyst 3850 Series Switches',
			productId: 'WS-C3850-48U',
			productName: 'Cisco Catalyst 3850 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS-XE',
			swVersion: '03.06.05E',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C2960-24PC-L',
			hwInstanceId: 'NA,NA,172.20.92.246,NA,NA,NA,-1',
			managedNeId: '172.20.92.246,NA,NA,NA',
			managementAddress: '172.20.92.246',
			productDescription: null,
			productFamily: 'Cisco Catalyst 2960 Series Switches',
			productId: 'WS-C2960-24PC-L',
			productName: 'Cisco Catalyst 2960 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'FAN',
			hostname: 'C4506-E',
			hwInstanceId: 'FOX1306GFFA,WS-X4596-E,NA,NA,FOX1306GFKH,WS-C4506-E,NA',
			managedNeId: 'NA,FOX1306GFKH,WS-C4506-E,NA',
			managementAddress: '172.21.140.40',
			productDescription: null,
			productFamily: 'Catalyst 4K Series Fans',
			productId: 'WS-X4596-E=',
			productName: 'Catalyst 4K Series Fan',
			productType: 'Fans',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.0(2)SG7',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C4506-E',
			hwInstanceId: 'FOX1306GFKH,WS-C4506-E,NA,FOX1306GFKH,WS-C4506-E,NA,NA',
			managedNeId: 'NA,FOX1306GFKH,WS-C4506-E,NA',
			managementAddress: '172.21.140.40',
			productDescription: null,
			productFamily: 'Cisco Catalyst 4500 Series Switches',
			productId: 'WS-C4506-E',
			productName: 'Cisco Catalyst 4500 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.0(2)SG7',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'JAE141705ME,WS-X4515,NA,NA,FOX1306GFKH,WS-C4506-E,NA',
			equipmentType: 'MODULE',
			hostname: 'C4506-E',
			hwInstanceId: 'JAE14150M8K,WS-F4531,NA,NA,FOX1306GFKH,WS-C4506-E,NA',
			managedNeId: 'NA,FOX1306GFKH,WS-C4506-E,NA',
			managementAddress: '172.21.140.40',
			productDescription: null,
			productFamily: 'Catalyst 4K Series Modules',
			productId: 'WS-F4531',
			productName: 'Catalyst 4K Series Module',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.0(2)SG7',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'ASA-5540',
			hwInstanceId: 'JMX1243L1VF,ASA5540,NA,JMX1243L1VF,ASA5540,NA,NA',
			managedNeId: 'NA,JMX1243L1VF,ASA5540,NA',
			managementAddress: '172.20.92.251',
			productDescription: null,
			productFamily: 'Cisco ASA 5500-X Series Firewalls',
			productId: 'ASA5540',
			productName: 'Cisco ASA 5500-X Series Firewall',
			productType: 'Security',
			serialNumber: null,
			swType: 'ASA',
			swVersion: '8.4(7)',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'FAN',
			hostname: 'c4500',
			hwInstanceId: 'FOX1335GF0Q,WS-X4596-E,NA,NA,FOX1335GRHG,WS-C4506-E,NA',
			managedNeId: 'NA,FOX1335GRHG,WS-C4506-E,NA',
			managementAddress: '172.23.164.88',
			productDescription: null,
			productFamily: 'Catalyst 4K Series Fans',
			productId: 'WS-X4596-E=',
			productName: 'Catalyst 4K Series Fan',
			productType: 'Fans',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.0(2)SG7',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'POWERSUPPLY',
			hostname: 'ASR1004',
			hwInstanceId: 'ART1728K037,ASR1004-PWR-AC,NA,NA,FXS1731Q3VJ,ASR1004,NA',
			managedNeId: 'NA,FXS1731Q3VJ,ASR1004,NA',
			managementAddress: '172.20.92.247',
			productDescription: null,
			productFamily: 'ASR 1000 Series Power Supplies',
			productId: 'ASR1004-PWR-AC',
			productName: 'ASR 1000 Series Power Supply',
			productType: 'Power Supplies',
			serialNumber: null,
			swType: 'IOS-XE',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C3750G-12S',
			hwInstanceId: 'FOX1335GRHG,WS-C4506-E,NA,FOX1335GRHG,WS-C4506-E,NA,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'Cisco Catalyst 4500 Series Switches',
			productId: 'WS-C4506-E',
			productName: 'Cisco Catalyst 4500 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'NA',
			equipmentType: 'MODULE',
			hostname: 'C3750G-12S',
			hwInstanceId: 'JAB072204VM,WS-X4448-GB-RJ45,NA,NA,FOX1335GRHG,WS-C4506-E,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'Catalyst 4K Series Modules',
			productId: 'WS-X4448-GB-RJ45',
			productName: 'Catalyst 4K Series Module',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C3750G-12S',
			hwInstanceId: 'FXS1731Q3VJ,ASR1004,NA,FXS1731Q3VJ,ASR1004,NA,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'Cisco ASR 1000 Series Aggregation Services Routers',
			productId: 'ASR1004',
			productName: 'Cisco ASR 1000 Series Aggregation Services Router',
			productType: 'Routers',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'NA',
			equipmentType: 'MODULE',
			hostname: 'C3750G-12S',
			hwInstanceId: 'JAE17380CSW,ASR1000-ESP10,NA,NA,FXS1731Q3VJ,ASR1004,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'ASR 1000 Series Cards',
			productId: 'ASR1000-ESP10',
			productName: 'ASR 1000 Series Card',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'NA',
			equipmentType: 'MODULE',
			hostname: 'C3750G-12S',
			hwInstanceId: 'JAE17400HM6,ASR1000-RP1,NA,NA,FXS1731Q3VJ,ASR1004,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'ASR 1000 Series Cards',
			productId: 'ASR1000-RP1',
			productName: 'ASR 1000 Series Card',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'NA',
			equipmentType: 'MODULE',
			hostname: 'C3750G-12S',
			hwInstanceId: 'SAL1737CVP1,SPA-2X1GE-V2,NA,NA,FXS1731Q3VJ,ASR1004,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'Shared Port Adapters',
			productId: 'SPA-2X1GE-V2',
			productName: 'Shared Port Adapter',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'JMX1243L1VF,ASA5540,NA,JMX1243L1VF,ASA5540,NA,NA',
			equipmentType: 'MODULE',
			hostname: 'C3750G-12S',
			hwInstanceId: 'JAF1239BDNB,SSM-4GE,NA,NA,JMX1243L1VF,ASA5540,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'ASA 5500 Modules',
			productId: 'SSM-4GE',
			productName: 'ASA 5500 Module',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'C3750G-12S',
			hwInstanceId: 'JMX1243L1VF,ASA5540,NA,JMX1243L1VF,ASA5540,NA,NA',
			managedNeId: '172.20.70.10,NA,NA,NA',
			managementAddress: '172.20.70.10',
			productDescription: null,
			productFamily: 'Cisco ASA 5500-X Series Firewalls',
			productId: 'ASA5540',
			productName: 'Cisco ASA 5500-X Series Firewall',
			productType: 'Security',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: '1971THE2-swi-LIMDR_P7_2_SD_DR',
			hwInstanceId: 'FOC1544Y1AV,WS-C2960S-24PS-L,NA,FOC1544Y1AV,WS-C2960S-24PS-L,NA,NA',
			managedNeId: '10.119.1.172,NA,NA,NA',
			managementAddress: '10.119.1.172',
			productDescription: null,
			productFamily: 'Cisco Catalyst 2960-S Series Switches',
			productId: 'WS-C2960S-24PS-L',
			productName: 'Cisco Catalyst 2960-S Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'FOC1844X089,WS-C3850-24S,NA,FOC1844X089,WS-C3850-24S,NA,NA',
			equipmentType: 'MODULE',
			hostname: '1971THE2-swi-LIMDR_P7_2_SD_DR',
			hwInstanceId: 'FNS16430DQA,GLC-SX-MM,NA,NA,FOC1844X089,WS-C3850-24S,NA',
			managedNeId: '10.119.1.172,NA,NA,NA',
			managementAddress: '10.119.1.172',
			productDescription: null,
			productFamily: 'Transceiver Modules',
			productId: 'GLC-SX-MMD',
			productName: 'Transceiver Module',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.4(3)S',
			tags: [],
		},
		{
			customerId,
			containingHwId: 'FOC2045X0WJ,WS-C3850-48U,NA,NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			equipmentType: 'CHASSIS',
			hostname: 'C3850',
			hwInstanceId: 'FOC2045X0WJ,WS-C3850-48U-L,NA,FOC2045X0WJ,WS-C3850-48U-L,NA,NA',
			managedNeId: 'NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			managementAddress: '172.25.121.6',
			productDescription: null,
			productFamily: 'Cisco Catalyst 3850 Series Switches',
			productId: 'WS-C3850-48U-L',
			productName: 'Cisco Catalyst 3850 Series Switch',
			productType: 'LAN Switches',
			serialNumber: null,
			swType: 'IOS-XE',
			swVersion: '03.06.05E',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'MODULE',
			hostname: 'C4506-E',
			hwInstanceId: 'JAE141705ME,WS-X4515,NA,NA,FOX1306GFKH,WS-C4506-E,NA',
			managedNeId: 'NA,FOX1306GFKH,WS-C4506-E,NA',
			managementAddress: '172.21.140.40',
			productDescription: null,
			productFamily: 'Catalyst 4K Series Supervisor Modules',
			productId: 'WS-X4515',
			productName: 'Cisco Catalyst 3850 Series Switch',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.0(2)SG7',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'MODULE',
			hostname: 'c4500',
			hwInstanceId: 'JAE1051HKZW,WS-X4516,NA,NA,FOX1335GRHG,WS-C4506-E,NA',
			managedNeId: 'NA,FOX1335GRHG,WS-C4506-E,NA',
			managementAddress: '172.23.164.88',
			productDescription: null,
			productFamily: 'Catalyst 4K Series Supervisor Modules',
			productId: 'WS-X4516',
			productName: 'Catalyst 4K Series Supervisor Module',
			productType: 'Modules',
			serialNumber: null,
			swType: 'IOS',
			swVersion: '15.0(2)SG7',
			tags: [],
		},
		{
			customerId,
			containingHwId: null,
			equipmentType: 'CHASSIS',
			hostname: 'ASA-v',
			hwInstanceId: '9A86PVSCGD3,ASAv,NA,9A86PVSCGD3,ASAv,NA,NA',
			managedNeId: 'NA,9A86PVSCGD3,ASAv,NA',
			managementAddress: '172.21.31.144',
			productDescription: null,
			productFamily: 'Adaptive Security Appliances (ASA)',
			productId: 'ASAv',
			productName: 'Adaptive Security Appliance (ASA)',
			productType: 'Security',
			serialNumber: null,
			swType: 'ASA',
			swVersion: '9.10(1)',
			tags: [],
		},
	],
};

/**
 * Function to generate the mock Assets Response
 * @param rows the rows to return
 * @param page the page to return
 * @param contractNumber the contractNumber to filter on
 * @param supportCovered the values to filter coverage
 * @param role the roles to filter on
 * @returns the assets response
 */
function MockHardware (
	rows: number,
	page: number) {
	let data = _.cloneDeep(MockHardwareResponse.data);

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
export const HardwareScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Hardware',
					response: {
						body: MockHardwareResponse,
						status: 200,
					},
					selected: true,
				},
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Empty Hardware',
					response: {
						body: { data: [] },
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?customerId=${customerId}&equipmentType=MODULE&containingHwId=` +
		'FOC1922S6JU,WS-C2960X-24PS-L,NA,FOC1922S6JU,WS-C2960X-24PS-L,NA,NA',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Hardware productId',
					response: {
						body: MockHardware(1, 1),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=1&productId=${productId}&page=1`,
		usecases: ['Use Case 1'],
	},
];
