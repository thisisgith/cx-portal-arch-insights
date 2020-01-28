
import {
	SoftwareGroupsResponse,
	SoftwareVersionsResponse,
	AssetRecommendationsResponse,
	AssetsResponse,
	SummaryResponse,
	SoftwareGroupAssetsResponse,
	SoftwareGroupVersionsResponse,
	MachineRecommendationsResponse,
	ProfileRecommendationsResponse,
	ExpertRecommendations,
} from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/osv-ui/v1/';

/** Default Customer ID */
const customerId = '2431199_0';

/** Mock pid */
const pid = 'AIR-CT5520-K9';

/** Mock ProductFamily */
const pf = 'Cisco_5500';

/** Default Asset Id */
const assetId = '7293498_NA';

/** softwareVersion Params */
const svParams = '&pageIndex=1&pageSize=10&sort=swType&sortOrder=asc';

/** AssetList params */
const assetParams = '&pageIndex=1&pageSize=10&sort=hostName&sortOrder=asc&filter=';

/** Software Group Params */
const sgParams = '&pageIndex=1&pageSize=10&sort=profileName&sortOrder=asc';

/** SoftwareGroup Assets */
const sgAssetsParams = '&pageIndex=1&pageSize=10&sort=hostName&sortOrder=asc';

/** SoftwareGroup Versions */
const sgVerParams = '&pageIndex=1&pageSize=10&sort=swType&sortOrder=asc';

/** The mock response for basic recommendations */
const mockBasicRecommendations: AssetRecommendationsResponse = [
	{
		accepted: true,
		error: null,
		name: 'suggested',
		postDate: '2019-05-16T00:00:00.000+0000',
		swVersion: '15.7(3)M4b',
	},
	{
		error: null,
		name: 'latest',
		postDate: '2019-05-14T00:00:00.000+0000',
		swVersion: '15.7(2)M4b',
	},
	{
		error: null,
		name: 'minimum',
		postDate: '2017-05-16T00:00:00.000+0000',
		swVersion: '15.7(5)M4b',
	},
	{
		error: null,
		name: 'golden',
		postDate: '2018-04-16T00:00:00.000+0000',
		swVersion: 'NA',
	},
	{
		error: null,
		name: 'current',
		postDate: '2014-05-30T00:00:00.000+0000',
		swVersion: '15.3(3)M3',
	},
];

/** mock response of bug detail */
const mockBugDetails = {
	id: 'CSCvq69471',
	severity: 'High',
	source: 'SLM',
	status: 'Fixed',
	title: 'Sint nisi excepteur sunt enim cillum veniam enim.',
	description: `$$PREFCS\n\nOSV F8885 requirements\n\n<B>Symptom:</B>\nAll headers in OSV
	screen tables should be  click sort-able\n\nAsset list view - these need to be sortable
	too\nIP Address\nSoftware Group\nOS Type\nCurrent OS\nDeployment Status\nRecommendations
	 not sortable.\n\nSoftware group list view - these need to be sortable\nAs
	above plus\n# Asset\n\nSoftware Version View\n+ Version\n+ # assets not
	in software group\n+ # assets in software group\n\n<B>Conditions:</B>
	Click header to see it does not sort A-Z, then Z-A order.\n\n
	<B>Workaround:</B>\nNone\n\n<B>Further Problem Description:</B>\n\n\n`,
};

/** mock response of psirt detail */
const mockPsirtDetail = {
	id: 'CSCvr08842',
	severity: 'High',
	source: 'SLM',
	status: 'Fixed',
	title: 'Sint nisi excepteur sunt enim cillum veniam enim.',
	description: `A vulnerability in the Cisco Discovery Protocol (CDP) module of\r\nCisco IOS
	XE Software Releases 16.6.1 and 16.6.2 could allow an unauthenticated, adjacent\r\nattacker
	to cause a memory leak that may lead to a denial of service\r\n(DoS) condition.<br />\r\n<br/>
	\r\nThe vulnerability is due to incorrect processing\r\nof certain CDP packets. An attacker
	could exploit this vulnerability by\r\nsending certain CDP packets to an affected device.'
	A successful exploit\r\ncould cause an affected device to continuously consume memory
	and\r\neventually result in a memory allocation failure that leads to a crash,
	\r\ntriggering a reload of the affected device.\r\n<p>Cisco has released software
	updates that address this vulnerability. There are no workarounds that address this
	vulnerability.</p>\r\n<p>This advisory is available at the following link:<br />\r\n
	<a href=\'https://tools.cisco.com/security/center/content/CiscoSecurityAdvisory/
	cisco-sa-20180926-cdp-memleak\'>https://tools.cisco.com/security/center/content/
	CiscoSecurityAdvisory/cisco-sa-20180926-cdp-memleak</a></p>\r\nThis advisory is
	part of the September 26, 2018, release of the Cisco IOS and IOS XE Software
	Security Advisory Bundled Publication, which includes 12 Cisco Security Advisories
	that describe 13 vulnerabilities. For a complete list of the advisories and links
	to them, see <a href=\'http://tools.cisco.com/security/center/viewErp.x?alertId
	=ERP-69981\'>Cisco Event Response: September 2018 Semiannual Cisco IOS and IOS
	XE Software Security Advisory Bundled Publication</a>`,
};

/** The mock response for machine recommendations */
const mockMachineRecommendations: MachineRecommendationsResponse = [
	{
		bugs: [
			{
				id: 'CSCvq69471',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
				title: 'Sint nisi excepteur sunt enim cillum veniam enim.',
			},
			{
				id: 'CSCvr08961',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
				title: 'Consectetur adipisicing irure mollit quis laboris aute.',
			},
			{
				id: 'CSCvq98433',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr05056',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq77657',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr08842',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq85913',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr06060',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq62439',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq94679',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq95645',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq79315',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr09093',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCva38503',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq97906',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
		],
		bugSeverity: {
			RESOLVED: {
				H: 39,
				L: 2,
				M: 44,
			},
		},
		expectedProfileRisk: 64,
		name: 'Recommendation #1',
		osType: 'IOS-XE',
		postDate: '04 September 2019',
		psirts: [],
		fns: [
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
		],
		psirtSeverity: { },
		release: '17.1.1EFT',
		score: 122.5,
	},
	{
		bugs: [
			{
				id: 'CSCvq69471',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr08961',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq98433',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr05056',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq77657',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr08842',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq85913',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr06060',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq62439',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq94679',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq95645',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq79315',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr09093',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
		],
		bugSeverity: {
			RESOLVED: {
				H: 39,
				L: 2,
				M: 44,
			},
		},
		expectedProfileRisk: 64,
		name: 'Recommendation #2',
		osType: 'IOS-XE',
		postDate: '01 November 2018',
		psirts: [],
		fns: [
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
		],
		psirtSeverity: { },
		release: '16.6.4a',
		score: 122.5,
	},
	{
		bugs: [
			{
				id: 'CSCvq69471',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr08961',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq98433',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr05056',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq77657',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr08842',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq85913',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr06060',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
		],
		bugSeverity: {
			RESOLVED: {
				H: 39,
				L: 2,
				M: 44,
			},
		},
		expectedProfileRisk: 64,
		name: 'Recommendation #3',
		osType: 'IOS-XE',
		postDate: '06 April 2018',
		psirts: [],
		fns: [
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
		],
		psirtSeverity: { },
		release: '16.8.1a',
		score: 122.5,
	},
	{
		bugs: [
			{
				id: 'CSCvp81190',
				severity: 'High',
				source: 'SLM',
				status: 'RESOLVED',
				title: 'Laboris laboris cupidatat eiusmod Lorem esse velit',
			},
			{
				id: 'CSCvq77657',
				severity: 'Medium',
				source: 'SLM',
				status: 'OPEN',
				title: 'Anim laboris aute fugiat enim dolor nulla ipsum ex amet labore.',
			},
			{
				id: 'CSCvr08842',
				severity: 'Low',
				source: 'SLM',
				status: 'NEW_OPEN',
			},
			{
				id: 'CSCvq85913',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr06060',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq62439',
				severity: 'High',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq94679',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq95645',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvq79315',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
			{
				id: 'CSCvr09093',
				severity: 'Medium',
				source: 'SLM',
				status: 'Fixed',
			},
		],
		bugsExposed: 10,
		bugSeverity: {
			OPEN: {
				H: 39,
				L: 2,
				M: 44,
			},
			RESOLVED: {
				H: 10,
				L: 5,
				M: 4,
			},
		},
		expectedProfileRisk: 138.5,
		name: 'profile current',
		osType: 'IOS-XE',
		postDate: null,
		psirtExposed: 5,
		psirtResolvedCount: 10,
		psirts: [
			{
				psirtId: 'CSCvr08842',
				severity: 'High',
				status: 'Fixed',
				title: 'Laboris laboris cupidatat eiusmod Lorem esse velit',
			},
			{
				psirtId: 'CSCvr08843',
				severity: 'Medium',
				status: 'Fixed',
				title: 'Anim laboris aute fugiat enim dolor nulla ipsum ex amet labore.',
			},
		],
		fns: [
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
			{
				status: 'OPEN',
				fnId: '70067',
				firstPublishedDate: '26th',
				lastUpdatedDate: '30 DEC',
				title: 'sahbvshjaFVdsh',
			},
		],
		psirtSeverity: { },
		totalBugsSeverity: {
			H: 1,
			M: 2,
			L: 0,
		},
		totalPsirtsSeverity: {
			H: 1,
			M: 2,
			L: 0,
		},
		release: '16.9.2,16.9.2,16.9.2,16.9.2',
		resolvedBugsCount: 10,
		score: 0,
	},
];

/** The mock response for DE recommendations */
const mockExpertRecommendations: ExpertRecommendations[] = [
	{
		recommSubmittedDate: '2008-01-10T18:30:00.000+0000',
		status: 'completed',
		releaseDate: '2008-01-10T18:30:00.000+0000',
		release: '16.9.2',
		downloadLink: '',
		summary: 'Reprehenderit cupidatat ut excepteur velit cillum. Sint fugiat anim dolor ipsum' +
			'sint nisi occaecat et cupidatat ullamco enim. Culpa sit voluptate est dolor' +
			'cupidatat nostrud cillum elit. Sit velit veniam mollit exercitation duis ea' +
			'culpa cillum aliquip. Reprehenderit proident dolore voluptate exercitation ' +
			'ad est occaecat occaecat. Esse incididunt consectetur culpa eiusmod amet ' +
			'consequat ut. Est non mollit anim veniam commodo laboris incididunt.' +
			'Et cillum ad cillum sunt adipisicing ex occaecat laboris mollit minim elit.' +
			'Occaecat eiusmod esse anim magna in enim Lorem cillum sint exercitation eu ' +
			'Exercitation exercitation eiusmod mollit veniam duis nostrud voluptate. ' +
			'Quis nostrud duis incididunt proident incididunt irure. Tempor velit nulla' +
			'voluptate commodo aute consectetur veniam ipsum ea. Mollit pariatur consequat' +
			'nostrud pariatur eiusmod reprehenderit ut duis voluptate sit ut laborum.' +
			'Deserunt dolor deserunt ipsum consequat ipsum labore laborum sunt. Pariatur' +
			'culpa occaecat tempor nisi anim dolore incididunt voluptate aute fugiat.',
	},
	{
		recommSubmittedDate: '2008-01-10T18:30:00.000+0000',
		status: 'inprogress',
		releaseDate: '2008-01-10T18:30:00.000+0000',
		release: '16.9.2',
		downloadLink: '',
		summary: 'Dolore ipsum elit pariatur in aliqua sunt culpa.',
	},
];

/** The mock response for basic recommendations */
const mockSoftwareGroupRecommendations: ProfileRecommendationsResponse = {
	recommendations: [
		{
			accepted: true,
			error: null,
			name: 'suggested',
			postDate: '2019-05-16T00:00:00.000+0000',
			swVersion: '15.7(3)M4b',
		},
		{
			error: null,
			name: 'latest',
			postDate: '2019-05-16T00:00:00.000+0000',
			swVersion: '15.7(3)M4b',
		},
		{
			error: null,
			name: 'minimum',
			postDate: null,
			swVersion: 'NA',
		},
		{
			error: null,
			name: 'golden',
			postDate: '2019-04-16T00:00:00.000+0000',
			swVersion: 'NA',
		},
	],
	recommendationSummaries: mockMachineRecommendations,
	expertRecommendations: mockExpertRecommendations,
};

/** The mock response for software versions */
const mockSoftwareVersions: SoftwareVersionsResponse = {
	pagination: {
		page: 1,
		rows: 10,
		total: 6,
	},
	uiSwVersionList: [
		{
			assetCount: 1,
			goldenVersion: false,
			optimalVersion: false,
			postDate: null,
			profileAssetCount: 0,
			swType: 'IOS-XE',
			swVersion: '03.02.02.SE',
		},
		{
			assetCount: 1,
			goldenVersion: false,
			optimalVersion: false,
			postDate: null,
			profileAssetCount: 0,
			swType: 'IOS-XE',
			swVersion: '03.02.03.SE',
		},
		{
			assetCount: 1,
			goldenVersion: false,
			optimalVersion: false,
			postDate: null,
			profileAssetCount: 0,
			swType: 'IOS-XE',
			swVersion: '03.06.05E',
		},
		{
			assetCount: 1,
			goldenVersion: false,
			optimalVersion: false,
			postDate: null,
			profileAssetCount: 0,
			swType: 'Switch Firmware',
			swVersion: '1.2.0.97',
		},
		{
			assetCount: 1,
			goldenVersion: false,
			optimalVersion: false,
			postDate: '2008-01-10T18:30:00.000+0000',
			profileAssetCount: 0,
			swType: 'IOS',
			swVersion: '12.1(22)EA11',
		},
		{
			assetCount: 1,
			goldenVersion: false,
			optimalVersion: false,
			postDate: '2009-03-16T18:30:00.000+0000',
			profileAssetCount: 0,
			swType: 'IOS',
			swVersion: '12.2(44)SE6',
		},
	],
};

/** The mock response for software versions */
const mockSoftwareVersions1: SoftwareVersionsResponse = {
	pagination: {
		page: 1,
		rows: 10,
		total: 100,
	},
	uiSwVersionList: [
		{
			assetCount: 1,
			goldenVersion: false,
			optimalVersion: false,
			postDate: null,
			profileAssetCount: 0,
			swType: 'IOS-XE',
			swVersion: '03.02.02.SE',
		},
		{
			assetCount: 1,
			goldenVersion: false,
			optimalVersion: false,
			postDate: null,
			profileAssetCount: 0,
			swType: 'IOS-XE',
			swVersion: '03.02.03.SE',
		},
		{
			assetCount: 1,
			goldenVersion: false,
			optimalVersion: false,
			postDate: null,
			profileAssetCount: 0,
			swType: 'IOS-XE',
			swVersion: '03.06.05E',
		},
		{
			assetCount: 1,
			goldenVersion: false,
			optimalVersion: false,
			postDate: null,
			profileAssetCount: 0,
			swType: 'Switch Firmware',
			swVersion: '1.2.0.97',
		},
		{
			assetCount: 1,
			goldenVersion: false,
			optimalVersion: false,
			postDate: '2008-01-10T18:30:00.000+0000',
			profileAssetCount: 0,
			swType: 'IOS',
			swVersion: '12.1(22)EA11',
		},
		{
			assetCount: 1,
			goldenVersion: false,
			optimalVersion: false,
			postDate: '2009-03-16T18:30:00.000+0000',
			profileAssetCount: 0,
			swType: 'IOS',
			swVersion: '12.2(44)SE6',
		},
	],
};

/** The mock response for software groups */
const mockSoftwareGroups: SoftwareGroupsResponse = {
	pagination: {
		page: 1,
		rows: 10,
		total: 10,
	},
	uiProfileList: [
		{
			assetCount: 1,
			currentOSVersion: '2',
			customerId: 231215372,
			id: '7293498_NA',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: '73-14312-05, 73-14312-05, 73-14312-05',
			profileName: '7293498_NA',
			recommendation: 'none',
			recommendationStatus: 'inprogress',
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
		{
			assetCount: 1,
			customerId: 231215372,
			id: '7293498_NA',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: '73-15664-05, 73-15664-05, 73-15664-05',
			profileName: '7293498_NA',
			recommendation: 'expert',
			recommendationStatus: 'completed',
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
		{
			assetCount: 1,
			customerId: 231215372,
			id: '7293498_NA',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: '73-14311-06, 73-14311-06, 73-14311-06',
			profileName: '7293498_NA',
			recommendation: 'automated',
			recommendationStatus: '',
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
		{
			assetCount: 1,
			customerId: 231215372,
			id: '7293498_NA',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: 'QSFP-100G-SM-SR=, QSFP-100G-SM-SR=, QSFP-100G-SM-SR=',
			profileName: '7293498_NA',
			recommendation: 'expert',
			recommendationStatus: 'inprogress',
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
		{
			assetCount: 1,
			customerId: 231215372,
			id: '7293498_NA',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: 'CFP-100G-LR4=, CFP-100G-LR4=, CFP-100G-LR4=',
			profileName: '7293498_NA',
			recommendation: 'none',
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
		{
			assetCount: 1,
			customerId: 231215372,
			id: 'Prfoile_231215372_PK-SFP-10G-SR=, PK-SFP-10G-SR=, PK-SFP-10G-SR=',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: 'PK-SFP-10G-SR=, PK-SFP-10G-SR=, PK-SFP-10G-SR=',
			profileName: 'PK-SFP-10G-SR=, PK-SFP-10G-SR=, PK-SFP-10G-SR=',
			recommendation: 'expert',
			recommendationStatus: 'inprogress',
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
		{
			assetCount: 1,
			customerId: 231215372,
			id: 'Prfoile_231215372_C3850-NM-4-10G, C3850-NM-4-10G, C3850-NM-4-10G',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: 'C3850-NM-4-10G, C3850-NM-4-10G, C3850-NM-4-10G',
			profileName: 'C3850-NM-4-10G, C3850-NM-4-10G, C3850-NM-4-10G',
			recommendation: 'automated',
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
		{
			assetCount: 1,
			customerId: 231215372,
			id: 'Prfoile_231215372_ASR1002X-10G-K9, ASR1002X-10G-K9, ASR1002X-10G-K9',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: 'ASR1002X-10G-K9, ASR1002X-10G-K9, ASR1002X-10G-K9',
			profileName: 'ASR1002X-10G-K9, ASR1002X-10G-K9, ASR1002X-10G-K9',
			recommendation: 'none',
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
		{
			assetCount: 1,
			customerId: 231215372,
			id: 'Prfoile_231215372_XFP-10G-MM-SR, XFP-10G-MM-SR, XFP-10G-MM-SR',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: 'XFP-10G-MM-SR, XFP-10G-MM-SR, XFP-10G-MM-SR',
			profileName: 'XFP-10G-MM-SR, XFP-10G-MM-SR, XFP-10G-MM-SR',
			recommendation: 'none',
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
		{
			assetCount: 1,
			customerId: 231215372,
			id: 'Prfoile_231215372_C3850-NM-4-10G=, C3850-NM-4-10G=, C3850-NM-4-10G=',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: 'C3850-NM-4-10G=, C3850-NM-4-10G=, C3850-NM-4-10G=',
			profileName: 'C3850-NM-4-10G=, C3850-NM-4-10G=, C3850-NM-4-10G=',
			recommendation: 'expert',
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
	],
};
/** The mock response for assets */
const mockAssets: AssetsResponse = {
	pagination: {
		page: 1,
		rows: 10,
		total: 120,
	},
	uiAssetList: [
		{
			alert: 'NA',
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: '5520-1',
			id: '7293498_NA',
			imageName: 'NA',
			ipAddress: '10.105.218.192',
			mdfId: 284464214,
			optimalVersion: null,
			postDate: null,
			productFamily: 'Cisco_5500',
			productId: 'AIR-CT5520-K9',
			profileName: '7293498_NA',
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
			recommendationType: 'automated',
			swType: 'IOS',
			swVersion: '8',
		},
		{
			alert: 'NA',
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: '5520-1',
			id: '7293498_NA',
			imageName: 'NA',
			ipAddress: '10.105.218.192',
			mdfId: 284464214,
			optimalVersion: null,
			postDate: null,
			productFamily: 'Cisco_5500',
			productId: 'AIR-CT5520-K9',
			profileName: '7293498_NA',
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
			recommendationType: 'automated',
			swType: 'IOS',
			swVersion: '8',
		},
		{
			alert: 'NA',
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: '5520-1',
			id: '7293498_NA',
			imageName: 'NA',
			ipAddress: '10.105.218.192',
			mdfId: 284464214,
			optimalVersion: null,
			postDate: null,
			productFamily: 'Cisco_5500',
			productId: 'AIR-CT5520-K9',
			profileName: '7293498_NA',
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
			recommendationType: 'none',
			swType: 'IOS',
			swVersion: '8',
		},
		{
			alert: 'NA',
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: '5520-1',
			id: '7293498_NA',
			imageName: 'NA',
			ipAddress: '10.105.218.192',
			mdfId: 284464214,
			optimalVersion: null,
			postDate: null,
			productFamily: 'Cisco_5500',
			productId: 'AIR-CT5520-K9',
			profileName: '7293498_NA',
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
			recommendationType: 'none',
			swType: 'IOS',
			swVersion: '8',
		},
		{
			alert: 'NA',
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: '5520-1',
			id: '7293498_NA',
			imageName: 'NA',
			ipAddress: '10.105.218.192',
			mdfId: 284464214,
			optimalVersion: null,
			postDate: null,
			productFamily: 'Cisco_5500',
			productId: 'AIR-CT5520-K9',
			profileName: '7293498_NA',
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
			recommendationType: 'none',
			swType: 'IOS',
			swVersion: '8',
		},
		{
			alert: 'NA',
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: '5520-1',
			id: '7293498_NA',
			imageName: 'NA',
			ipAddress: '10.105.218.192',
			mdfId: 284464214,
			optimalVersion: null,
			postDate: null,
			productFamily: 'Cisco_5500',
			productId: 'AIR-CT5520-K9',
			profileName: '7293498_NA',
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
			recommendationType: 'automated',
			swType: 'IOS',
			swVersion: '8',
		},
		{
			alert: 'NA',
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: '5520-1',
			id: '7293498_NA',
			imageName: 'NA',
			ipAddress: '10.105.218.192',
			mdfId: 284464214,
			optimalVersion: null,
			postDate: null,
			productFamily: 'Cisco_5500',
			productId: 'AIR-CT5520-K9',
			profileName: '7293498_NA',
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
			recommendationType: 'none',
			swType: 'IOS',
			swVersion: '8',
		},
		{
			alert: null,
			customerId: 7293498,
			deploymentStatus: 'Production',
			hostName: 'AIR-CT5760',
			id: '7293498_NA,FOC1841V02P,AIR-CT5760,NA_AIR-CT5760_FOC1841V02P',
			imageName: 'NA',
			ipAddress: '172.16.44.24',
			mdfId: 0,
			optimalVersion: null,
			postDate: '2013-09-20T00:00:00.000+0000',
			productFamily: 'Cisco 5700 Series Wireless LAN Controllers',
			productId: 'AIR-CT5760',
			recommAcceptedDate: null,
			recommendationCount: 0,
			recommendationType: 'none',
			swType: 'IOS-XE',
			swVersion: '15.0(1)EX3',
		},
		{
			alert: null,
			customerId: 7293498,
			deploymentStatus: 'Upgrade',
			hostName: 'AMS-AP3702-28',
			id: '7293498_NA,FTX1927S1K5,AIR-CAP3702E-A-K9,NA_AIR-CAP3702E-A-K9_FTX1927S1K5',
			imageName: 'NA',
			ipAddress: '10.11.16.170',
			mdfId: 0,
			optimalVersion: null,
			postDate: '2019-03-29T00:00:00.000+0000',
			productFamily: 'Cisco Aironet 3700 Series',
			productId: 'AIR-CAP3702E-A-K9',
			recommAcceptedDate: null,
			recommendationCount: 0,
			recommendationType: 'automated',
			swType: 'IOS',
			swVersion: '8.8.120.0',
		},
		{
			alert: 'NA',
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: 'AMS-AP3802-14',
			id: '7293498_NA,FCW2136NCB4,AIR-AP3802I-B-K9,NA_AIR-AP3802I-B-K9_FCW2136NCB4',
			imageName: 'NA',
			ipAddress: '10.11.17.1',
			mdfId: 286304536,
			optimalVersion: null,
			postDate: '2019-03-29T00:00:00.000+0000',
			productFamily: 'Cisco Aironet 3800 Series Access Points',
			productId: 'AIR-AP3802I-B-K9',
			recommAcceptedDate: null,
			recommendationCount: 3,
			recommendationType: 'none',
			swType: 'IOS',
			swVersion: '8.8.120.0',
		},
	],
};

/** The mock response for assets */
const mockAssets1: AssetsResponse = {
	pagination: {
		page: 1,
		rows: 10,
		total: 6,
	},
	uiAssetList: [
		{
			alert: 'NA',
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: '5520-1',
			id: '7293498_NA,FCH2139V1B0,AIR-CT5520-K9,NA_AIR-CT5520-K9_FCH2139V1B0',
			imageName: 'NA',
			ipAddress: '10.105.218.192',
			mdfId: 284464214,
			optimalVersion: null,
			postDate: '2019-07-02T00:00:00.000+0000',
			productFamily: 'Cisco 5500 Series Wireless Controllers',
			productId: 'AIR-CT5520-K9',
			recommAcceptedDate: null,
			recommendationCount: 3,
			swType: 'AireOS',
			swVersion: '8.8.125.0',
		},
		{
			alert: 'information',
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: '9407-dualsup.cisco.com',
			id: '7293498_NA,FXS2202Q11R,C9407R,NA_C9407R_FXS2202Q11R',
			imageName: 'NA',
			ipAddress: '10.104.249.221',
			mdfId: 286315691,
			optimalVersion: null,
			postDate: '2018-07-18T00:00:00.000+0000',
			productFamily: 'Cisco Catalyst 9400 Series Switches',
			productId: 'C9407R',
			recommAcceptedDate: null,
			recommendationCount: 3,
			swType: 'IOS-XE',
			swVersion: '16.9.1',
		},
		{
			alert: null,
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: 'AIR-CT5760',
			id: '7293498_NA,FOC1841V02P,AIR-CT5760,NA_AIR-CT5760_FOC1841V02P',
			imageName: 'NA',
			ipAddress: '172.16.44.24',
			mdfId: 0,
			optimalVersion: null,
			postDate: '2013-09-20T00:00:00.000+0000',
			productFamily: 'Cisco 5700 Series Wireless LAN Controllers',
			productId: 'AIR-CT5760',
			recommAcceptedDate: null,
			recommendationCount: 0,
			swType: 'IOS-XE',
			swVersion: '15.0(1)EX3',
		},
		{
			alert: null,
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: 'AMS-AP3702-28',
			id: '7293498_NA,FTX1927S1K5,AIR-CAP3702E-A-K9,NA_AIR-CAP3702E-A-K9_FTX1927S1K5',
			imageName: 'NA',
			ipAddress: '10.11.16.170',
			mdfId: 0,
			optimalVersion: null,
			postDate: '2019-03-29T00:00:00.000+0000',
			productFamily: 'Cisco Aironet 3700 Series',
			productId: 'AIR-CAP3702E-A-K9',
			recommAcceptedDate: null,
			recommendationCount: 0,
			swType: 'IOS',
			swVersion: '8.8.120.0',
		},
		{
			alert: 'NA',
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: 'AMS-AP3802-14',
			id: '7293498_NA,FCW2136NCB4,AIR-AP3802I-B-K9,NA_AIR-AP3802I-B-K9_FCW2136NCB4',
			imageName: 'NA',
			ipAddress: '10.11.17.1',
			mdfId: 286304536,
			optimalVersion: null,
			postDate: '2019-03-29T00:00:00.000+0000',
			productFamily: 'Cisco Aironet 3800 Series Access Points',
			productId: 'AIR-AP3802I-B-K9',
			recommAcceptedDate: null,
			recommendationCount: 3,
			swType: 'IOS',
			swVersion: '8.8.120.0',
		},
		{
			alert: 'NA',
			customerId: 7293498,
			deploymentStatus: 'None',
			hostName: 'AMS-AP3802-14',
			id: '7293498_NA,FCW2136NCB4,AIR-AP3802I-B-K9,NA_AIR-AP3802I-B-K9_FCW2136NCB4',
			imageName: 'NA',
			ipAddress: '10.11.17.1',
			mdfId: 286304536,
			optimalVersion: null,
			postDate: '2019-03-29T00:00:00.000+0000',
			productFamily: 'Cisco Aironet 3800 Series Access Points',
			productId: 'AIR-AP3802I-B-K9',
			recommAcceptedDate: null,
			recommendationCount: 3,
			swType: 'IOS',
			swVersion: '8.8.120.0',
		},
	],
};

/** The mock response for summary */
const mockSummaryResponse: SummaryResponse = {
	asset_profile: {
		assets_profile: 444,
		assets_without_profile: 520,
	},
	assets: 964,
	deployment: {
		na: 10,
		none: 364,
		production: 200,
		upgrade: 400,
	},
	profiles: 441,
	recommendations: {
		automated: 15,
		none: 13,
	},
	recommendation_status: {
		completed: 10,
		inprogress: 15,
	},
	versions: 50,
};

/** The mock response for software group assets */
const mockSoftwareGroupAssets: SoftwareGroupAssetsResponse = {
	pagination: {
		page: 1,
		rows: 10,
		total: 11,
	},
	uiAssetList: [
		{
			deploymentStatus: 'None',
			id: '231215372_NA,FOC1842PJG4,EFOC1842PJG4',
			ipAddress: '6.0.3.223',
			hostName: 'Device_6_0_3_223',
			optimalVersion: null,
			postDate: '2018-04-06T00:00:00.000+0000',
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			recommAcceptedDate: null,
			recommendationCount: 0,
			recommendations: null,
			swType: 'IOS-XE',
			swVersion: '16.8.1a',
		},
	],
};

/** The mock response for software gropu versions */
const mockSoftwareGroupVersions: SoftwareGroupVersionsResponse = {
	pagination: {
		page: 1,
		rows: 10,
		total: 11,
	},
	uiProfileSwVersion: [
		{
			assetCount: 1,
			deploymentStatus: '',
			optimalVersion: '',
			postDate: '06 April 2018',
			swType: 'IOS-XE',
			swVersion: '16.8.1a',
		},
	],
};
/** The scenarios */
export const OSVScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Summary',
					response: {
						body: mockSummaryResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}summary?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Software Groups',
					response: {
						body: mockSoftwareGroups,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}profiles?customerId=${customerId}${sgParams}` +
			'&filter=recommendationType:automated&search=',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Software Versions',
					response: {
						body: mockSoftwareVersions,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}versions?customerId=${customerId}${svParams}` +
			'&search=',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Basic Recommendations',
					response: {
						body: mockBasicRecommendations,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}assetDetails?customerId=${customerId}&profileName=${assetId}&pid=${pid}` +
			`&pf=${pf}&swType=IOS&swVersion=8&image=NA&postDate=null`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Basic Assets List',
					response: {
						body: mockAssets,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}assets?customerId=${customerId}${assetParams}` +
			'&search=',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Basic Assets List',
					response: {
						body: mockAssets1,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}assets?customerId=${customerId}${assetParams}` +
			'&search=',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Software Versions',
					response: {
						body: mockSoftwareVersions1,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}versions?customerId=${customerId}${svParams}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 1000,
					description: 'Software Group Assets',
					response: {
						body: mockSoftwareGroupAssets,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}profileAssets?customerId=${customerId}&id=7293498_NA` +
			`&profileName=7293498_NA${sgAssetsParams}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Software Group Versions',
					response: {
						body: mockSoftwareGroupVersions,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}profileVersions?customerId=${customerId}&id=7293498_NA` +
			`&profileName=7293498_NA${sgVerParams}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Software Profile Recommendations',
					response: {
						body: mockSoftwareGroupRecommendations,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}profileRecommendations?customerId=${customerId}&profileName=${assetId}` +
			'&productFamily=Cisco Catalyst 9300 Series Switches&profileId=7293498_NA',
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Machine Recommendations',
					response: {
						body: mockMachineRecommendations,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}machineRecommendations?customerId=${customerId}&profileName=${assetId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 4000,
					description: 'Bug Details',
					response: {
						body: mockBugDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}bugDetail?bugId=CSCvp81190`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Psirt Details',
					response: {
						body: mockPsirtDetail,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}psirtDetail?psirtId=CSCvr08842`,
		usecases: ['Use Case 1'],
	},
];
