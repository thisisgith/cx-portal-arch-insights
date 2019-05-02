import { AlertResults, Lifecycle, Health, Vulnerability } from '../alert';

/**
 * Health Declaration
 */
const health: Health = {
	bugs: [
		{
			affected: 27,
			affectedReleases: [
				'10.0 (1)',
				'10.0 (2)',
			],
			conditions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
			id: 'CSCul50066',
			knownFixedReleases: [
				'11.5 (0.98000.126)',
				'11.0 (0.98000.89)',
				'11.1 (123123)',
			],
			lastUpdated: '2019-04-13',
			severity: 4,
			status: 'fixed',
			symptom: 'Lorem ipsum',
			title: 'Upgrade fails due to lack of disk space in the / common partition',
			workaround: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
		},
	],
	cases: [
		{
			affected: 1,
			customerActivity: 'Configuration Type',
			description: 'Lorem ipsum dolor sit amet.',
			id: '667488839',
			lastUpdateDate: '2019-04-02',
			problemCodeName: 'Data Corruption',
			severity: 2,
			status: 'customer updated',
			subTechnologyName: 'CBR8 Cable Line Card Crashes',
			technologyName: 'Broadband Cable',
			title: 'ISM Malformed Authentication Header Packet Denial of Service Vulnerability',
		},
		{
			affected: 3,
			customerActivity: 'Configuration Type',
			description: 'Lorem ipsum dolor sit amet.',
			id: '667488839',
			lastUpdateDate: '2019-04-02',
			problemCodeName: 'Data Corruption',
			severity: 3,
			status: 'customer updated',
			subTechnologyName: 'CBR8 Cable Line Card Crashes',
			technologyName: 'Broadband Cable',
			title: 'Boot sequence shows corrupted configuration file but device still boots',
		},
		{
			affected: 2,
			customerActivity: 'Configuration Type',
			description: 'Lorem ipsum dolor sit amet.',
			id: '667488839',
			lastUpdateDate: '2019-04-02',
			problemCodeName: 'Data Corruption',
			severity: 2,
			status: 'customer updated',
			subTechnologyName: 'CBR8 Cable Line Card Crashes',
			technologyName: 'Broadband Cable',
			title: 'IOS which allows one to see the config with its lines numbered.',
		},
		{
			affected: 1,
			customerActivity: 'Configuration Type',
			description: 'Lorem ipsum dolor sit amet.',
			id: '667488839',
			lastUpdateDate: '2019-04-02',
			problemCodeName: 'Data Corruption',
			severity: 1,
			status: 'customer updated',
			subTechnologyName: 'CBR8 Cable Line Card Crashes',
			technologyName: 'Broadband Cable',
			title: 'Using a ASA 5540 with 3 interfaces. Version 8.2(1)',
		},
	],
	rmas: [
		{
			affected: 1,
			affectedAssets: [
				'SJ-ASA-5505-X',
			],
			id: '877909802',
			status: 'Approved',
			submitted: '2019-03-03',
			summary: 'Malfunctioning cricuit board in my ASA causing constant reboot.',
			timeline: [
				{
					date: '2019-04-03',
					title: 'Submitted',
				},
				{
					date: '2019-04-08',
					title: 'Processing',
				},
				{
					date: '2019-04-26',
					title: 'Approved',
				},
				{
					date: '2019-05-10',
					title: 'Delivery',
				},
			],
		},
	],
};

/**
 * Lifecycle Declaration
 */
const lifecycle: Lifecycle = {
	announcements: [
		{
			affected: 21,
			expiration: '2019-04-29',
			migration: 'Customers are encouraged to migrate to the Cisco',
			summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
			timeline: [
				{
					date: '2014-06-03',
					title: 'End of Life Announced',
				},
				{
					date: '2014-03-03',
					title: 'End of Sale Date',
				},
				{
					date: '2018-06-03',
					title: 'End of Service Renewal',
				},
				{
					date: '2019-06-03',
					title: 'Last Date of Support',
				},
			],
			title: 'Cisco 7304 Series Router',
			type: 'End of Support',
		},
	],
	contracts: [
		{
			affected: 5,
			expiration: '2019-04-29',
			id: '1000998372',
			status: 'ACTIVE',
			summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
			title: 'SNTC 8x5 Next Business Day',
		},
	],
	licenses: [
		{
			affected: 2,
			expiration: '2019-04-29',
			id: '33230984',
			summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
			title: 'DNA Advantage',
		},
	],
};

/**
 * Vulnerability Declaration
 */
const vulnerabilities: Vulnerability = {
	advisories: [
		{
			affected: 14,
			current: '1.1',
			published: '2019-04-02',
			related: 'CSCub92025',
			severity: 1,
			summary: 'A vulnerability in authentication header packets processing',
			title: 'ISM Malformed Authentication Header Packet Denial of Service Vulnerability',
			workarounds: 'Administrators are advised to apply the appropriate updats',
		},
		{
			affected: 11,
			current: '1.1',
			published: '2019-03-14',
			related: 'CSCub92025',
			severity: 1,
			summary: 'A vulnerability in authentication header packets processing',
			title: 'Cisco small business RV320 and RV325 router',
			workarounds: 'Administrators are advised to apply the appropriate updats',
		},
		{
			affected: 4,
			current: '1.1',
			published: '2019-03-01',
			related: 'CSCub92025',
			severity: 1,
			summary: 'A vulnerability in authentication header packets',
			title: 'Cisco SD-WAN solution unauthorized access vulnerability',
			workarounds: 'Administrators are advised to apply the appropriate updats',
		},
		{
			affected: 4,
			current: '1.1',
			published: '2019-02-09',
			related: 'CSCub92025',
			severity: 2,
			summary: 'A vulnerability in authentication header packets',
			title: 'Cisco small business RV320 and RV325 routers',
			workarounds: 'Administrators are advised to apply the appropriate updats',
		},
		{
			affected: 3,
			current: '1.1',
			published: '2019-01-03',
			related: 'CSCub92025',
			severity: 2,
			summary: 'A vulnerability in authentication header packets processing',
			title: 'Cisco SD Wan solution buffer overflow vulnerability',
			workarounds: 'Administrators are advised to apply the appropriate updats',
		},
		{
			affected: 6,
			current: '1.1',
			published: '2019-01-03',
			related: 'CSCub92025',
			severity: 3,
			summary: 'A vulnerability in authentication header packets processing',
			title: 'Cisco SD Wan solution buffer overflow vulnerability',
			workarounds: 'Administrators are advised to apply the appropriate updats',
		},
		{
			affected: 3,
			current: '1.1',
			published: '2019-01-03',
			related: 'CSCub92025',
			severity: 3,
			summary: 'A vulnerability in authentication header packets processing',
			title: 'Cisco SD Wan solution buffer overflow vulnerability',
			workarounds: 'Administrators are advised to apply the appropriate updats',
		},
		{
			affected: 8,
			current: '1.1',
			published: '2019-01-03',
			related: 'CSCub92025',
			severity: 3,
			summary: 'A vulnerability in authentication header packets processing',
			title: 'Cisco SD Wan solution buffer overflow vulnerability',
			workarounds: 'Administrators are advised to apply the appropriate updats',
		},
	],
	fieldNotices: [
		{
			affected: 6,
			current: '1.0',
			published: '2019-04-02',
			related: 'CSCub92025',
			summary: 'ASR-920-12SZ-IM routers that run on Certian Cisco IOS',
			title: 'Routers might not boot up due to an incorrect autoboot',
			workarounds: 'Refer to the how to identify affected products',
		},
		{
			affected: 6,
			current: '1.0',
			published: '2019-04-02',
			related: 'CSCub92025',
			summary: 'ASR-920-12SZ-IM routers that run on Certian',
			title: 'Switches: Field Notice: FN - 70359 - C3650/C3850',
			workarounds: 'Refer to the how to identify affected product',
		},
		{
			affected: 5,
			current: '1.0',
			published: '2019-04-02',
			related: 'CSCub92025',
			summary: 'ASR-920-12SZ-IM routers that run on Certian Cisco',
			title: 'Collaboration endpoints: Field Notice: FN - 63265',
			workarounds: 'Refer to the how to identify affected products section',
		},
	],
};

/**
 * Mock Data for alert results
 * @ignore
 */
export const mockData: AlertResults = {
	health,
	lifecycle,
	vulnerabilities,
};
