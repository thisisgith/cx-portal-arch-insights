import {
	RiskCountResponse,
	DeviceCountResponse,
	DeploymentStatusCountResponse,
	SoftwareProfilesResponse,
	SoftwareVersionsResponse,
	DERecommendationsResponse,
	BasicRecommendationsResponse,
} from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/osv/v1/';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for basic recommendations */
const mockBasicRecommendations: BasicRecommendationsResponse = [
	{
		releaseDate: '2013-02-18T13:16:35.000Z',
		status: '',
		version: '1.1',
		versionSummary: 'Current',
	},
	{
		releaseDate: '2014-02-07T13:16:35.000Z',
		status: '',
		version: '1.2',
		versionSummary: 'Minumum',
	},
	{
		releaseDate: '2014-11-07T13:16:35.000Z',
		status: '',
		version: '1.3',
		versionSummary: 'Suggested',
	},
	{
		releaseDate: '2017-11-18T13:16:35.000Z',
		status: '',
		version: '1.3',
		versionSummary: 'Golden Image',
	},
	{
		releaseDate: '2019-01-21T13:16:35.000Z',
		status: '',
		version: '1.3',
		versionSummary: 'Latest',
	},
];

/** The mock response for software versions */
const mockSoftwareVersions: SoftwareVersionsResponse = [
	{
		assetsCount: 2,
		goldenImage: true,
		optimalVersion: true,
		osType: 'IOS-XE',
		releaseDate: '2015-10-10',
		version: '10.1.171.1',
	},
	{
		assetsCount: 4,
		goldenImage: true,
		optimalVersion: true,
		osType: 'IOS-XE',
		releaseDate: '2015-10-10',
		version: '10.1.171.2',
	},
	{
		assetsCount: 6,
		goldenImage: true,
		optimalVersion: true,
		osType: 'IOS-XE',
		releaseDate: '2015-10-10',
		version: '10.1.171.3',
	},
	{
		assetsCount: 8,
		goldenImage: true,
		optimalVersion: true,
		osType: 'IOS-XE',
		releaseDate: '2015-10-10',
		version: '10.1.171.4',
	},
	{
		assetsCount: 10,
		goldenImage: true,
		optimalVersion: true,
		osType: 'IOS-XE',
		releaseDate: '2015-10-10',
		version: '10.1.171.5',
	},
];

/** The mock response for software profiles */
const mockSoftwareProfile: SoftwareProfilesResponse = {
	data: [

		{
			assetCount: 2,
			currentOSVersion: '3',
			optimalVersion: '8.6.100.2',
			osType: 'IOS-XE',
			productFamily: 'XYZ',
			recommendations: '',
			softwareProfile: 'Profile 1',
		},
		{
			assetCount: 2,
			currentOSVersion: '3',
			optimalVersion: '8.6.100.2',
			osType: 'IOS-XE',
			productFamily: 'XYZ',
			recommendations: '',
			softwareProfile: 'Profile 2',

		}, {
			assetCount: 2,
			currentOSVersion: '3',
			optimalVersion: '8.6.100.2',
			osType: 'IOS-XE',
			productFamily: 'XYZ',
			recommendations: '',
			softwareProfile: 'Profile 3',
		}, {
			assetCount: 2,
			currentOSVersion: '3',
			optimalVersion: '8.6.100.2',
			osType: 'IOS-XE',
			productFamily: 'XYZ',
			recommendations: '',
			softwareProfile: 'Profile 4',
		}, {
			assetCount: 2,
			currentOSVersion: '3',
			optimalVersion: '8.6.100.2',
			osType: 'IOS-XE',
			productFamily: 'XYZ',
			recommendations: '',
			softwareProfile: 'Profile 5',
		},

	],
	pagination: {
		page: 1,
		rows: 3,
		total: 5,
	},
};

/** The mock response for role counts */
const mockDERecommendationsCounts: DERecommendationsResponse = [
	{
		deviceCount: 9,
		status: 'in progress',
	},
	{
		deviceCount: 1,
		status: 'none',
	},
	{
		deviceCount: 2,
		status: 'completed',
	},
];

/** The mock response for role counts */
const mockRiskCounts: RiskCountResponse = [
	{
		deviceCount: 9,
		risk: 'High',
	},
	{
		deviceCount: 1,
		risk: 'Low',
	},
	{
		deviceCount: 2,
		risk: 'Medium',
	},
];

/** The mock response for device counts */
const mockDeviceCounts: DeviceCountResponse = [
	{
		deviceCount: 124,
		type: 'softwareProfiles',
	},
	{
		deviceCount: 1880,
		type: 'assetSoftwareProfile',
	},
	{
		deviceCount: 3270,
		type: 'assets',
	},
	{
		deviceCount: 22,
		type: 'softwareVersion',
	},
];

/** The mock response for deploymentstatus counts */
const mockDeploymentStatusCounts: DeploymentStatusCountResponse = [
	{
		deviceCount: 124,
		status: 'none',
	},
	{
		deviceCount: 1880,
		status: 'production',
	},
	{
		deviceCount: 3270,
		status: 'upgrade',
	},
];

/** The scenarios */
export const OSVScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Risk Count',
					response: {
						body: mockRiskCounts,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}risk/count?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 2000,
					description: 'Device Count',
					response: {
						body: mockDeviceCounts,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}device/count?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 2000,
					description: 'Deployment Status Count',
					response: {
						body: mockDeploymentStatusCounts,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}deploymentstatus/count?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Software Profiles',
					response: {
						body: mockSoftwareProfile,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}softwareprofiles?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 2000,
					description: 'Software Versions',
					response: {
						body: mockSoftwareVersions,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}softwareversions?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 2000,
					description: 'DE Recommendations Status Counts',
					response: {
						body: mockDERecommendationsCounts,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}derecommendations/count?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 2000,
					description: 'Basic Recommendations Status Counts',
					response: {
						body: mockBasicRecommendations,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}basicrecommendations?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},

];
