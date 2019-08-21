import {
	SoftwareGroupsResponse,
	SoftwareVersionsResponse,
	AssetRecommendationsResponse,
	AssetsResponse,
	SummaryResponse,
} from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/osv-ui/v1/';

/** Default Customer ID */
const customerId = '2431199';

/** Default Asset Id */
const assetId = '231215372_NA,FXS2202Q11R,C9407R,NA_C9407R_FXS2202Q11R';

/** softwareVersion Params */
const svParams = '&pageIndex=1&pageSize=10&sort=swVersion&sortOrder=desc';
/** AssetList params */
const assetParams = '&pageIndex=1&pageSize=10&sort=hostName&sortOrder=desc&filter=';
/** The mock response for basic recommendations */
const mockBasicRecommendations: AssetRecommendationsResponse = [
	{
		error: 'some error',
		name: 'suggested',
		postDate: '2019-03-21T18:30:00.000+0000',
		recommendationSummary: null,
		swVersion: '16.9.3',
	},
	{
		error: null,
		name: 'latest',
		postDate: '2019-06-20T18:30:00.000+0000',
		recommendationSummary: null,
		swVersion: '16.11.1c',
	},
	{
		error: null,
		name: 'current',
		postDate: '2018-07-17T18:30:00.000+0000',
		recommendationSummary: null,
		swVersion: '16.9.1',
	},
];

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
			customerId: 231215372,
			id: 'Prfoile_231215372_73-14312-05, 73-14312-05, 73-14312-05',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: '73-14312-05, 73-14312-05, 73-14312-05',
			profileName: '73-14312-05, 73-14312-05, 73-14312-05',
			recommendation: null,
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
		{
			assetCount: 1,
			customerId: 231215372,
			id: 'Prfoile_231215372_73-15664-05, 73-15664-05, 73-15664-05',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: '73-15664-05, 73-15664-05, 73-15664-05',
			profileName: '73-15664-05, 73-15664-05, 73-15664-05',
			recommendation: null,
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
		{
			assetCount: 1,
			customerId: 231215372,
			id: 'Prfoile_231215372_73-14311-06, 73-14311-06, 73-14311-06',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: '73-14311-06, 73-14311-06, 73-14311-06',
			profileName: '73-14311-06, 73-14311-06, 73-14311-06',
			recommendation: null,
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
		{
			assetCount: 1,
			customerId: 231215372,
			id: 'Prfoile_231215372_QSFP-100G-SM-SR=, QSFP-100G-SM-SR=, QSFP-100G-SM-SR=',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: 'QSFP-100G-SM-SR=, QSFP-100G-SM-SR=, QSFP-100G-SM-SR=',
			profileName: 'QSFP-100G-SM-SR=, QSFP-100G-SM-SR=, QSFP-100G-SM-SR=',
			recommendation: null,
			swType: 'IOS-XE',
			swVersions: [
				'16.8.1a',
			],
		},
		{
			assetCount: 1,
			customerId: 231215372,
			id: 'Prfoile_231215372_CFP-100G-LR4=, CFP-100G-LR4=, CFP-100G-LR4=',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productId: 'CFP-100G-LR4=, CFP-100G-LR4=, CFP-100G-LR4=',
			profileName: 'CFP-100G-LR4=, CFP-100G-LR4=, CFP-100G-LR4=',
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
		total: 10,
	},
	uiAssetList: [
		{
			deployment: 'None',
			hostName: 'AP4800.8DEC',
			id: '231215372_NA,FCW2238N7LG,AIR-AP4800-B-K9,NA_AIR-AP4800-B-K9_FCW2238N7LG',
			ipAddress: '10.13.5.117',
			optimalVersion: '16.11.1c',
			productFamily: 'Cisco Aironet 4800 Series',
			recommAcceptedDate: null,
			recommendations: null,
			swType: 'IOS',
			swVersion: '16.10.1.130',
		},
		{
			deployment: 'None',
			hostName: 'Pod5-AP4800',
			id: '231215372_NA,FCW2235NF4L,AIR-AP4800-B-K9,NA_AIR-AP4800-B-K9_FCW2235NF4L',
			ipAddress: '192.168.59.100',
			optimalVersion: null,
			productFamily: 'Cisco Aironet 4800 Series',
			recommAcceptedDate: null,
			recommendations: null,
			swType: 'IOS',
			swVersion: '8.8.111.0',
		},
		{
			deployment: 'None',
			hostName: 'Pod5-AP3800',
			id: '231215372_NA,FCW2236N7JZ,AIR-AP3802I-B-K9,NA_AIR-AP3802I-B-K9_FCW2236N7JZ',
			ipAddress: '192.168.58.100',
			optimalVersion: null,
			productFamily: 'Cisco Aironet 3800 Series Access Points',
			recommAcceptedDate: null,
			recommendations: null,
			swType: 'IOS',
			swVersion: '8.8.111.0',
		},
		{
			deployment: 'None',
			hostName: 'AP4800.8DAC',
			id: '231215372_NA,FCW2238N7JF,AIR-AP4800-B-K9,NA_AIR-AP4800-B-K9_FCW2238N7JF',
			ipAddress: '10.13.5.114',
			optimalVersion: null,
			productFamily: 'Cisco Aironet 4800 Series',
			recommAcceptedDate: null,
			recommendations: null,
			swType: 'IOS',
			swVersion: '8.8.120.6',
		},
		{
			deployment: 'None',
			id: '231215372_NA,FCW2238N7CN,AIR-AP4800-B-K9,NA_AIR-AP4800-B-K9_FCW2238N7CN',
			hostName: 'AP4800.90A4',
			ipAddress: '10.13.5.119',
			optimalVersion: null,
			productFamily: 'Cisco Aironet 4800 Series',
			recommAcceptedDate: null,
			recommendations: null,
			swType: 'IOS',
			swVersion: '8.8.120.6',
		},
		{
			deployment: 'None',
			id: '231215372_NA,KWC214106R7,AIR-AP1800S-B-K9,NA_AIR-AP1800S-B-K9_KWC214106R7',
			hostName: 'Sensor-0860',
			ipAddress: '10.13.5.115',
			optimalVersion: null,
			productFamily: null,
			recommAcceptedDate: null,
			recommendations: null,
			swType: '8.8.1.10',
			swVersion: '8.8.1.10',
		},
		{
			deployment: 'None',
			id: '231215372_NA,RFDP2BFA022,AIR-AP1800S-B-K9,NA_AIR-AP1800S-B-K9_RFDP2BFA022',
			hostName: 'Sensor-5A00',
			ipAddress: '10.13.4.246',
			optimalVersion: null,
			productFamily: null,
			recommAcceptedDate: null,
			recommendations: null,
			swType: '8.8.1.10',
			swVersion: '8.8.1.10',
		},
		{
			deployment: 'None',
			id: '231215372_NA,DTN1915R1BZ,C3KX-PWR-1100WAC=,NA_C3KX-PWR-1100WAC=_DTN1915R1BZ',
			hostName: 'Device_6_0_1_253',
			ipAddress: '6.0.1.253',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9400 Series Switches',
			recommAcceptedDate: null,
			recommendations: null,
			swType: 'IOS-XE',
			swVersion: '16.8.1a',
		},
		{
			deployment: 'None',
			id: '231215372_NA,FCW1812J05D,AIR-CAP3602I-A-K9,NA_AIR-CAP3602I-A-K9_FCW1812J05D',
			hostName: 'Device_6_0_2_94',
			ipAddress: '6.0.2.94',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9400 Series Switches',
			recommAcceptedDate: null,
			recommendations: null,
			swType: 'IOS-XE',
			swVersion: '16.8.1a',
		},
		{
			deployment: 'None',
			id: '231215372_NA,FCW2044NN41,AIR-AP3802I-E-K9,NA_AIR-AP3802I-E-K9_FCW2044NN41',
			hostName: 'Device_6_0_2_98',
			ipAddress: '6.0.2.98',
			optimalVersion: null,
			productFamily: 'Cisco Catalyst 9400 Series Switches',
			recommAcceptedDate: null,
			recommendations: null,
			swType: 'IOS-XE',
			swVersion: '16.8.1a',
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
			deployment: 'None',
			hostName: 'AP4800.8DEC',
			id: '231215372_NA,FCW2238N7LG,AIR-AP4800-B-K9,NA_AIR-AP4800-B-K9_FCW2238N7LG',
			ipAddress: '10.13.5.117',
			optimalVersion: '16.11.1c',
			productFamily: 'Cisco Aironet 4800 Series',
			recommAcceptedDate: null,
			recommendations: null,
			swType: 'IOS',
			swVersion: '16.10.1.130',
		},
		{
			deployment: 'None',
			hostName: 'Pod5-AP4800',
			id: '231215372_NA,FCW2235NF4L,AIR-AP4800-B-K9,NA_AIR-AP4800-B-K9_FCW2235NF4L',
			ipAddress: '192.168.59.100',
			optimalVersion: null,
			productFamily: 'Cisco Aironet 4800 Series',
			recommAcceptedDate: null,
			recommendations: null,
			swType: 'IOS',
			swVersion: '8.8.111.0',
		},
		{
			deployment: 'None',
			hostName: 'Pod5-AP3800',
			id: '231215372_NA,FCW2236N7JZ,AIR-AP3802I-B-K9,NA_AIR-AP3802I-B-K9_FCW2236N7JZ',
			ipAddress: '192.168.58.100',
			optimalVersion: null,
			productFamily: 'Cisco Aironet 3800 Series Access Points',
			recommAcceptedDate: null,
			recommendations: null,
			swType: 'IOS',
			swVersion: '8.8.111.0',
		},
		{
			deployment: 'None',
			hostName: 'AP4800.8DAC',
			id: '231215372_NA,FCW2238N7JF,AIR-AP4800-B-K9,NA_AIR-AP4800-B-K9_FCW2238N7JF',
			ipAddress: '10.13.5.114',
			optimalVersion: null,
			productFamily: 'Cisco Aironet 4800 Series',
			recommAcceptedDate: null,
			recommendations: null,
			swType: 'IOS',
			swVersion: '8.8.120.6',
		},
		{
			deployment: 'None',
			id: '231215372_NA,FCW2238N7CN,AIR-AP4800-B-K9,NA_AIR-AP4800-B-K9_FCW2238N7CN',
			hostName: 'AP4800.90A4',
			ipAddress: '10.13.5.119',
			optimalVersion: null,
			productFamily: 'Cisco Aironet 4800 Series',
			recommAcceptedDate: null,
			recommendations: null,
			swType: 'IOS',
			swVersion: '8.8.120.6',
		},
		{
			deployment: 'None',
			id: '231215372_NA,KWC214106R7,AIR-AP1800S-B-K9,NA_AIR-AP1800S-B-K9_KWC214106R7',
			hostName: 'Sensor-0860',
			ipAddress: '10.13.5.115',
			optimalVersion: null,
			productFamily: null,
			recommAcceptedDate: null,
			recommendations: null,
			swType: '8.8.1.10',
			swVersion: '8.8.1.10',
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
		url: `${api}profiles?customerId=${customerId}&pageIndex=1&pageSize=10`,
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
					description: 'Basic Recommendations Status Counts',
					response: {
						body: mockBasicRecommendations,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}assetDetails?customerId=${customerId}&id=${assetId}`,
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
];
