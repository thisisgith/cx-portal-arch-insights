
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
} from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/osv-ui/v1/';

/** Default Customer ID */
const customerId = '2431199';

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
const sgParams = '&pageIndex=1&pageSize=10&sort=profileName&sortOrder=asc&filter=';

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

/** The mock response for machine recommendations */
const mockMachineRecommendations: MachineRecommendationsResponse = [
	{
		bugFixed: 13,
		bugs: [],
		bugSeverity: {
			OPEN: {
				H: 0,
				M: 0,
				L: 1,
			},
			NEW_OPEN: {
				H: 0,
				M: 0,
				L: 1,
			},
			RESOLVED: {
				H: 2,
				M: 0,
				L: 0,
			},
		},
		name: 'Recommendation #1',
		expectedProfileRisk: '60',
		osType: 'NX-OS',
		psirts: [],
		psirtFixed: 32,
		psirtSeverity: {
			OPEN: {
				H: 0,
				M: 0,
				L: 1,
			},
			NEW_OPEN: {
				H: 0,
				M: 0,
				L: 1,
			},
		},
		release: '7.3(2)N1(1b)',
		score: 640,
	},
	{
		bugFixed: 12,
		bugs: [],
		bugSeverity: {
			OPEN: {
				H: 0,
				M: 0,
				L: 2,
			},
		},
		expectedProfileRisk: '60',
		name: 'Recommendation #2',
		osType: 'NX-OS',
		psirts: [],
		psirtFixed: 32,
		psirtSeverity: {
			OPEN: {
				H: 0,
				M: 0,
				L: 1,
			},
		},
		release: '7.3(2)N1(1c)',
		score: 640,
	},
	{
		bugFixed: 11,
		bugs: [],
		bugSeverity: {
			OPEN: {
				H: 0,
				M: 0,
				L: 1,
			},
		},
		expectedProfileRisk: '60',
		name: 'Recommendation #3',
		osType: 'NX-OS',
		psirts: [],
		psirtFixed: 32,
		psirtSeverity: {
			OPEN: {
				H: 0,
				M: 0,
				L: 1,
			},
		},
		release: '7.3(4)N1(1)',
		score: 640,
	}
	,
	{
		bugFixed: 11,
		bugs: [],
		bugSeverity: {
			OPEN: {
				H: 0,
				M: 0,
				L: 1,
			},
		},
		name: 'profile current',
		osType: 'NX-OS',
		psirts: [],
		psirtFixed: 32,
		psirtSeverity: {
			OPEN: {
				H: 0,
				M: 0,
				L: 1,
			},
		},
		release: '7.3(4)N1(1)',
		score: 640,
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
		{
			error: null,
			name: 'Recommendation #3',
			postDate: '2019-04-16T00:00:00.000+0000',
			swVersion: '7.3(2)N1(1a)',
		},
		{
			error: null,
			name: 'Recommendation #2',
			postDate: '2019-04-16T00:00:00.000+0000',
			swVersion: '7.3(2)N1(1b)',
		},
		{
			error: null,
			name: 'Recommendation #1',
			postDate: '2019-04-16T00:00:00.000+0000',
			swVersion: '7.3(2)N1(1c)',
		},
	],
	recommendationSummaries: mockMachineRecommendations,
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
			recommendation: null,
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
			recommendation: null,
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
			recommendation: null,
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
			recommendation: null,
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
			recommendation: null,
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
			recommendation: null,
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
			recommendation: null,
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
			recommendation: null,
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
			recommendation: null,
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
			recommendation: null,
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
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
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
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
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
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
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
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
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
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
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
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
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
			recommAcceptedDate: '2014-05-30T00:00:00.000+0000',
			recommendationCount: 3,
			swType: 'IOS',
			swVersion: '8',
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
		none: 963,
		upgrade: 400,
	},
	profiles: 441,
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
		url: `${api}profiles?customerId=${customerId}${sgParams}`,
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
		url: `${api}versions?customerId=${customerId}${svParams}`,
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
		url: `${api}assetDetails?customerId=2431199&profileName=${assetId}&pid=${pid}` +
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
		url: `${api}assets?customerId=${customerId}${assetParams}`,
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
		url: `${api}assets?customerId=${customerId}${assetParams}`,
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
		url: `${api}profileAssets?customerId=2431199&id=7293498_NA` +
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
		url: `${api}profileVersions?customerId=2431199&id=7293498_NA` +
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
		url: `${api}profileRecommendations?customerId=${customerId}&profileName=${assetId}`,
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
];
