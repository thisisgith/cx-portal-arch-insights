import { RiskCountResponse, DeviceCountResponse, DeploymentStatusCountResponse, SoftwareProfilesResponse } from '@sdp-api';


/** Base of URL for SDP API */
const api = '/api/customerportal/osv/v1/';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for software profiles */
const mockSoftwareProfile: SoftwareProfilesResponse = [

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

/** The mock response for role counts */
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

/** The mock response for role counts */
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

];
