import { HttpHeaders } from '@angular/common/http';
import { NetworkElementResponse, NetworkElement } from '@cui-x/sdp-api';
import * as _ from 'lodash-es';

/** Base of URL for SDP API */
const api = '/api/customerportal/inventory/v1/network-elements';

/** Default Customer ID */
const customerId = '2431199';

/** Mock data for Network Elements API Results */
export const mockResponse: NetworkElement[] = [
	{
		customerId: '2431199',
		hostName: '1971THE2-swi-LIMDR_P7_1_SD_DR',
		ipAddress: '10.119.1.171',
		isManagedNE: true,
		lastUpdateDate: '2019-05-14T18:27:06',
		managedNeId: '10.119.1.172,NA,NA,NA',
		managementAddress: '10.119.1.172',
		neInstanceId: 'NA,FOC1544Y175,WS-C2960S-24PS-L,NA',
		neName: '1971THE2-swi-LIMDR_P7_1_SD_DR.tbc.limad.net',
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 2960-S Series Switches',
		productId: 'WS-C2960S-24PS-L',
		productType: 'LAN Switches',
		serialNumber: 'FOC1544Y175',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: '12.2(55)SE3',
		systemUptime: '1970-01-11T02:43:05',
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: '1971THE2-swi-LIMDR_P5_1_SD_DR',
		ipAddress: '10.119.1.151',
		isManagedNE: true,
		lastUpdateDate: '2019-05-14T18:27:06',
		managedNeId: '10.119.1.172,NA,NA,NA',
		managementAddress: '10.119.1.172',
		neInstanceId: 'NA,FOC1544Y1AV,WS-C2960S-24PS-L,NA',
		neName: '1971THE2-swi-LIMDR_P5_1_SD_DR.tbc.limad.net',
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 2960-S Series Switches',
		productId: 'WS-C2960S-24PS-L',
		productType: 'LAN Switches',
		serialNumber: 'FOC1544Y1AV',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: '12.2(55)SE3',
		systemUptime: '1970-02-05T01:07:56',
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: '1971THE2-swi02-C3850_Core2_SD_DR',
		ipAddress: '10.119.1.102',
		isManagedNE: true,
		lastUpdateDate: '2019-05-14T18:27:06',
		managedNeId: '10.119.1.172,NA,NA,NA',
		managementAddress: '10.119.1.172',
		neInstanceId: 'NA,FOC1844X089,WS-C3850-24S,NA',
		neName: '1971THE2-swi02-C3850_Core2_SD_DR.tbc.limad.net',
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 3850 Series Switches',
		productId: 'WS-C3850-24S',
		productType: 'LAN Switches',
		serialNumber: 'FOC1844X089',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS-XE',
		swVersion: '03.03.05SE',
		systemUptime: '1970-01-06T01:35:00',
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: '1971THE2-swi-LIMDR_P5_1_SD_DR',
		ipAddress: '10.119.1.151',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T19:54:59',
		managedNeId: 'NA,FOC1544Y1AV,WS-C2960S-24PS-L,NA',
		managementAddress: '10.119.1.151',
		neInstanceId: 'NA,FOC1544Y1AV,WS-C2960S-24PS-L,NA',
		neName: '1971THE2-swi-LIMDR_P5_1_SD_DR.tbc.limad.net',
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 2960-S Series Switches',
		productId: 'WS-C2960S-24PS-L',
		productType: 'LAN Switches',
		serialNumber: 'FOC1544Y1AV',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: '12.2(55)SE3',
		systemUptime: '1970-02-05T01:07:56',
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'ASA-v',
		ipAddress: '172.21.31.144',
		isManagedNE: true,
		lastUpdateDate: '2019-05-13T07:16:23',
		managedNeId: '172.20.70.10,NA,NA,NA',
		managementAddress: '172.20.70.10',
		neInstanceId: 'NA,9A86PVSCGD3,ASAv,NA',
		neName: 'ASA-v',
		neRegistrationStatus: '',
		productFamily: 'Adaptive Security Appliances (ASA)',
		productId: 'ASAv',
		productType: 'Security',
		serialNumber: '9A86PVSCGD3',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'ASA',
		swVersion: '9.10(1)',
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'C2960S-48TS-S',
		ipAddress: '172.21.140.184',
		isManagedNE: true,
		lastUpdateDate: '2019-05-28T21:10:09',
		managedNeId: '172.21.140.184,NA,NA,NA',
		managementAddress: '172.21.140.184',
		neInstanceId: '172.21.140.184,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 2960-S Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'C2950-24',
		ipAddress: '172.20.70.230',
		isManagedNE: true,
		lastUpdateDate: '2019-05-28T21:10:09',
		managedNeId: '172.20.70.230,NA,NA,NA',
		managementAddress: '172.20.70.230',
		neInstanceId: '172.20.70.230,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 2950 Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw41.pat',
		ipAddress: '10.99.10.86',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:12',
		managedNeId: '10.99.10.86,NA,NA,NA',
		managementAddress: '10.99.10.86',
		neInstanceId: '10.99.10.86,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 3560 Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw1.o7661',
		ipAddress: '10.196.122.196',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:12',
		managedNeId: '10.196.122.196,NA,NA,NA',
		managementAddress: '10.196.122.196',
		neInstanceId: '10.196.122.196,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 2960-Plus Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw95.fri.cie',
		ipAddress: '10.100.10.110',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:12',
		managedNeId: '10.100.10.110,NA,NA,NA',
		managementAddress: '10.100.10.110',
		neInstanceId: '10.100.10.110,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 3560 Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'ro1076a.vit',
		ipAddress: '10.104.10.5',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:13',
		managedNeId: '10.104.10.5,NA,NA,NA',
		managementAddress: '10.104.10.5',
		neInstanceId: '10.104.10.5,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco 2900 Series Integrated Services Routers',
		productId: 'NA',
		productType: 'Routers',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw950bh.hue',
		ipAddress: '10.100.194.254',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:15',
		managedNeId: '10.100.194.254,NA,NA,NA',
		managementAddress: '10.100.194.254',
		neInstanceId: '10.100.194.254,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 3750 Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw24.sec.abr',
		ipAddress: '10.103.138.73',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:14',
		managedNeId: '10.103.138.73,NA,NA,NA',
		managementAddress: '10.103.138.73',
		neInstanceId: '10.103.138.73,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 2960-Plus Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw21.sec.abr',
		ipAddress: '10.103.138.70',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:14',
		managedNeId: '10.103.138.70,NA,NA,NA',
		managementAddress: '10.103.138.70',
		neInstanceId: '10.103.138.70,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 2960-Plus Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw54.sec.abr',
		ipAddress: '10.103.138.85',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:16',
		managedNeId: '10.103.138.85,NA,NA,NA',
		managementAddress: '10.103.138.85',
		neInstanceId: '10.103.138.85,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 2960-Plus Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw72.sec.cie',
		ipAddress: '10.100.10.83',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:15',
		managedNeId: '10.100.10.83,NA,NA,NA',
		managementAddress: '10.100.10.83',
		neInstanceId: '10.100.10.83,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 3560 Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw91.sec.cie',
		ipAddress: '10.100.10.92',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:15',
		managedNeId: '10.100.10.92,NA,NA,NA',
		managementAddress: '10.100.10.92',
		neInstanceId: '10.100.10.92,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 3560 Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw33.alb',
		ipAddress: '10.99.138.51',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:15',
		managedNeId: '10.99.138.51,NA,NA,NA',
		managementAddress: '10.99.138.51',
		neInstanceId: '10.99.138.51,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 3560 Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'ap3.o7685',
		ipAddress: '10.196.170.229',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:15',
		managedNeId: '10.196.170.229,NA,NA,NA',
		managementAddress: '10.196.170.229',
		neInstanceId: '10.196.170.229,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Aironet 1140 Series',
		productId: 'NA',
		productType: 'Wireless',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'NA',
		ipAddress: '172.29.17.24',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:15',
		managedNeId: '172.29.17.24,NA,NA,NA',
		managementAddress: '172.29.17.24',
		neInstanceId: '172.29.17.24,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco 5500 Series Wireless Controllers',
		productId: 'NA',
		productType: 'Wireless',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'AireOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw61.sec.abr',
		ipAddress: '10.103.138.120',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:18',
		managedNeId: '10.103.138.120,NA,NA,NA',
		managementAddress: '10.103.138.120',
		neInstanceId: '10.103.138.120,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 2960-Plus Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw44.sec.abr',
		ipAddress: '10.103.138.81',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:19',
		managedNeId: '10.103.138.81,NA,NA,NA',
		managementAddress: '10.103.138.81',
		neInstanceId: '10.103.138.81,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 2960-Plus Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw909ah.ban',
		ipAddress: '10.102.133.250',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:16',
		managedNeId: '10.102.133.250,NA,NA,NA',
		managementAddress: '10.102.133.250',
		neInstanceId: '10.102.133.250,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 3750 Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'swA2.sec.cie',
		ipAddress: '10.100.10.97',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:17',
		managedNeId: '10.100.10.97,NA,NA,NA',
		managementAddress: '10.100.10.97',
		neInstanceId: '10.100.10.97,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 3560 Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
	{
		customerId: '2431199',
		hostName: 'sw63.sec.cie',
		ipAddress: '10.100.10.72',
		isManagedNE: true,
		lastUpdateDate: '2019-06-07T20:06:17',
		managedNeId: '10.100.10.72,NA,NA,NA',
		managementAddress: '10.100.10.72',
		neInstanceId: '10.100.10.72,NA,NA,NA',
		neName: null,
		neRegistrationStatus: '',
		productFamily: 'Cisco Catalyst 3560 Series Switches',
		productId: 'NA',
		productType: 'LAN Switches',
		serialNumber: 'NA',
		smartLicenseProductInstanceIdentifier: '',
		smartLicenseVirtualAccountName: '',
		swType: 'IOS',
		swVersion: null,
		systemUptime: null,
		tags: [],
		udiProductIdentifier: '',
	},
];

/**
 * Function to generate the mock Network Response
 * @param rows the rows to return
 * @param page the page to return
 * @returns the network element response
 */
function MockNetwork (rows: number, page: number): NetworkElementResponse {
	const data = _.cloneDeep(mockResponse)
		.slice((rows * (page - 1)), (rows * page));

	return {
		data,
		Pagination: {
			page,
			rows,
			pages: Math.ceil(mockResponse.length / rows),
			total: mockResponse.length,
		},
	};
}

/** The scenarios */
export const NetworkScenarios = [
	{
		scenarios: {
			HEAD: [
				{
					delay: 100,
					description: 'Network Elements Count',
					response: {
						headers: new HttpHeaders({
							'X-API-RESULT-COUNT': mockResponse.length.toString(),
						}),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Network Elements Page 1',
					response: {
						body: MockNetwork(10, 1),
						status: 200,
					},
					selected: true,
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
					delay: 100,
					description: 'Network Elements Page 2',
					response: {
						body: MockNetwork(10, 2),
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
					delay: 100,
					description: 'Network Elements Page 3',
					response: {
						body: MockNetwork(10, 3),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}&rows=10&page=3`,
		usecases: ['Use Case 1'],
	},
];
