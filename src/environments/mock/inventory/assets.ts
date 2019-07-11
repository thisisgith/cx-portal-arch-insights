import { Assets, Asset } from '@sdp-api';
import * as _ from 'lodash-es';

/** Base of URL for SDP API */
const api = '/api/customerportal/inventory/v1/assets';

/** Default Customer ID */
const customerId = '2431199';

/** Mock data for Network Elements API Results */
export const mockResponse: Asset[] = [
	{
		contractNumber: '93425688',
		criticalAdvisories: 2,
		deviceName: 'Catalyst+3560X-24T-L+Switch',
		ipAddress: '172.21.140.183',
		osType: '',
		osVersion: '12.2(55)SE1',
		role: 'ACCESS',
		serialNumber: 'FDO1503P0D7',
		supportCovered: true,
	},
	{
		contractNumber: '',
		deviceName: 'Cisco+Catalyst+4506-E+Switch',
		ipAddress: '172.23.164.88',
		osType: '',
		osVersion: '15.0(2)SG7',
		role: null,
		serialNumber: 'FOX1335GRHG',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Catalyst+2960S-24PS-L+Switch',
		ipAddress: '10.119.1.143',
		osType: 'IOS',
		osVersion: '12.2(53)SE2',
		role: null,
		serialNumber: 'FOC1446Z640',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Catalyst+2960S-24PS-L+Switch',
		ipAddress: '10.119.1.124',
		osType: 'IOS',
		osVersion: '12.2(53)SE2',
		role: null,
		serialNumber: 'FOC1446W5E6',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'ASR1000-RP1',
		ipAddress: '172.20.92.247',
		osType: '',
		osVersion: '15.4(3)S',
		role: null,
		serialNumber: 'JAE17400HM6',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'PVDM2-64',
		ipAddress: '172.20.70.42',
		osType: '',
		osVersion: '12.4(15)T',
		role: 'BORDER ROUTER',
		serialNumber: 'FOC10443XH6',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Cisco+Catalyst+2960-24PC-L+Switch',
		ipAddress: '172.20.92.246',
		osType: '',
		osVersion: '12.2(44)SE6',
		role: 'ACCESS',
		serialNumber: 'FOC1348W6JP',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Cisco+Catalyst+2960X-24PS-L+Switch',
		ipAddress: '10.119.1.131',
		osType: 'IOS',
		osVersion: '15.0(2a)EX5',
		role: null,
		serialNumber: 'FOC1922S6JU',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Catalyst+2960S-24PS-L+Switch',
		ipAddress: '10.119.1.125',
		osType: 'IOS',
		osVersion: '12.2(55)SE3',
		role: 'DISTRIBUTION',
		serialNumber: 'FOC1544Y16T',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Catalyst+2960S-24PS-L+Switch',
		ipAddress: '10.119.1.141',
		osType: 'IOS',
		osVersion: '12.2(53)SE2',
		role: null,
		serialNumber: 'FOC1446W570',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Catalyst+2960S-24PS-L+Switch',
		ipAddress: '10.119.1.171',
		osType: 'IOS',
		osVersion: '12.2(55)SE3',
		role: null,
		serialNumber: 'FOC1544Y175',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'VWIC-2MFT-T1',
		ipAddress: '172.20.70.42',
		osType: '',
		osVersion: '12.4(15)T',
		role: 'BORDER ROUTER',
		serialNumber: '35334200',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Cisco+ASR+1004+Router',
		ipAddress: '172.20.92.247',
		osType: '',
		osVersion: '15.4(3)S',
		role: null,
		serialNumber: 'FXS1731Q3VJ',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'ASR1000-SIP10',
		ipAddress: '172.20.92.247',
		osType: '',
		osVersion: '15.4(3)S',
		role: null,
		serialNumber: 'JAE173707MT',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'ASR1000-ESP10',
		ipAddress: '172.20.92.247',
		osType: '',
		osVersion: '15.4(3)S',
		role: null,
		serialNumber: 'JAE17380CSW',
		supportCovered: false,
	},
	{
		contractNumber: '93425688',
		criticalAdvisories: 3,
		deviceName: 'Cisco+Catalyst+4506-E+Switch',
		ipAddress: '172.21.140.40',
		osType: '',
		osVersion: '15.0(2)SG7',
		role: null,
		serialNumber: 'FOX1306GFKH',
		supportCovered: true,
	},
	{
		contractNumber: '',
		deviceName: 'PWR-C1-350WAC',
		ipAddress: '10.119.1.101',
		osType: 'IOS-XE',
		osVersion: '03.03.05SE',
		role: null,
		serialNumber: 'ART1939F247',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Cisco+Catalyst+3750G-12S+Switch',
		ipAddress: '172.20.70.10',
		osType: '',
		osVersion: '12.2(55)SE9',
		role: 'ACCESS',
		serialNumber: 'CAT1042RG17',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Catalyst+2960S-24PS-L+Switch',
		ipAddress: '10.119.1.151',
		osType: 'IOS',
		osVersion: '12.2(55)SE3',
		role: null,
		serialNumber: 'FOC1544Y1AV',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Cisco+Catalyst+2960C-12PC-L+Switch',
		ipAddress: '172.21.142.148',
		osType: '',
		osVersion: '15.0(2)SE8',
		role: 'ACCESS',
		serialNumber: 'FOC1634Y28U',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Cisco+Catalyst+3560G-24TS+Switch',
		ipAddress: '172.23.164.92',
		osType: '',
		osVersion: '12.2(55)SE5',
		role: 'ACCESS',
		serialNumber: 'FOC1138Y1YS',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Cisco+Catalyst+2950+24+Switch',
		ipAddress: '172.20.70.230',
		osType: '',
		osVersion: '12.1(22)EA11',
		role: 'CORE',
		serialNumber: 'FAB0550Q1GT',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Cisco+Catalyst+3850-48U-L+Switch',
		ipAddress: '172.25.121.6',
		osType: '',
		osVersion: '03.06.05E',
		role: null,
		serialNumber: 'FOC2045X0WJ',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Catalyst+2960S-24PS-L+Switch',
		ipAddress: '10.119.1.121',
		osType: 'IOS',
		osVersion: '12.2(53)SE2',
		role: null,
		serialNumber: 'FOC1446Z641',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Catalyst+2960S-24PS-L+Switch',
		ipAddress: '10.119.1.152',
		osType: 'IOS',
		osVersion: '12.2(55)SE3',
		role: null,
		serialNumber: 'FOC1544Y13S',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Catalyst+2960S-24PS-L+Switch',
		ipAddress: '10.119.1.161',
		osType: 'IOS',
		osVersion: '12.2(55)SE3',
		role: null,
		serialNumber: 'FOC1544Y16V',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'SSM-4GE',
		ipAddress: '172.20.92.251',
		osType: '',
		osVersion: '8.4(7)',
		role: null,
		serialNumber: 'JAF1239BDNB',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'SPA-2X1GE-V2',
		ipAddress: '172.20.92.247',
		osType: '',
		osVersion: '15.4(3)S',
		role: null,
		serialNumber: 'SAL1737CVP1',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Catalyst+2960S-24PS-L+Switch',
		ipAddress: '10.119.1.135',
		osType: 'IOS',
		osVersion: '12.2(55)SE3',
		role: null,
		serialNumber: 'FOC1544Y16S',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Catalyst+2960S-24PS-L+Switch',
		ipAddress: '10.119.1.144',
		osType: 'IOS',
		osVersion: '12.2(55)SE3',
		role: null,
		serialNumber: 'FOC1544Y17Q',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Catalyst+2960S-24PS-L+Switch',
		ipAddress: '10.119.1.133',
		osType: 'IOS',
		osVersion: '12.2(53)SE2',
		role: null,
		serialNumber: 'FOC1446Z63M',
		supportCovered: false,
	},
	{
		contractNumber: '93856991',
		criticalAdvisories: 1,
		deviceName: 'Cisco+Catalyst+2960-24TC+Switch',
		ipAddress: '192.168.99.114',
		osType: '',
		osVersion: '12.2(50)SE',
		role: 'ACCESS',
		serialNumber: 'FHK1045Y01E',
		supportCovered: true,
	},
	{
		contractNumber: '93425688',
		criticalAdvisories: 0,
		deviceName: 'Cisco+Catalyst+3750G-24T+Switch',
		ipAddress: '172.23.183.31',
		osType: '',
		osVersion: '12.2(55)SE8',
		role: 'ACCESS',
		serialNumber: 'CAT1107NHD6',
		supportCovered: true,
	},
	{
		contractNumber: '',
		deviceName: 'PWR-C1-350WAC',
		ipAddress: '10.119.1.102',
		osType: 'IOS-XE',
		osVersion: '03.03.05SE',
		role: null,
		serialNumber: 'ART1930F1YN',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'Catalyst+2960S-24PS-L+Switch',
		ipAddress: '10.119.1.122',
		osType: 'IOS',
		osVersion: '12.2(53)SE2',
		role: null,
		serialNumber: 'FOC1446W5E3',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'C3850-NM-4-10G',
		ipAddress: '172.25.121.6',
		osType: '',
		osVersion: '03.06.05E',
		role: null,
		serialNumber: 'FOC20472BD5',
		supportCovered: false,
	},
	{
		contractNumber: '93425688',
		criticalAdvisories: 7,
		deviceName: 'Catalyst+2960S-48TS-S+Switch',
		ipAddress: '172.21.140.184',
		osType: '',
		osVersion: '12.2(55)SE3',
		role: 'ACCESS',
		serialNumber: 'FOC1448Z4U9',
		supportCovered: true,
	},
	{
		contractNumber: '',
		deviceName: 'Cisco+Catalyst+3750X-24T-L+Switch',
		ipAddress: '192.168.99.215',
		osType: '',
		osVersion: '15.0(2)SE',
		role: 'ACCESS',
		serialNumber: 'FDO1734H1MQ',
		supportCovered: false,
	},
	{
		contractNumber: '',
		deviceName: 'WS-X4516',
		ipAddress: '172.23.164.88',
		osType: '',
		osVersion: '15.0(2)SG7',
		role: null,
		serialNumber: 'JAE1051HKZW',
		supportCovered: false,
	},
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
					delay: 250,
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
					delay: 250,
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
					delay: 250,
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
