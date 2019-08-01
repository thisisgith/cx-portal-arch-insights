import { DeviceDetailsByPage } from '@sdp-api';
/** base API for controlpoints info */
const api = '/api/customerportal/controlpoint/v1/devices/92736491';

/**
 * Mock body of results
 */
const mockData: DeviceDetailsByPage = {
	data: [
		{
			hostName: 'C3850',
			ipAddress: '172.25.121.6',
			serialNumber: 'FOC2045X0WJ',
			productId: 'WS-C3850-48U-L',
			managedNeId: 'NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			softwareType: 'IOS-XE',
			softwareVersion: '03.06.05E',
			role: 'ACCESS',
			reachabilityStatus: 'Reachable',
		},
		{
			hostName: 'C3850',
			ipAddress: '172.25.121.6',
			serialNumber: 'FOC2045X0WJ',
			productId: 'WS-C3850-48U-L',
			managedNeId: 'NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			softwareType: 'IOS-XE',
			softwareVersion: '03.06.05E',
			role: 'ACCESS',
			reachabilityStatus: 'Reachable',
		},
		{
			hostName: 'C3850',
			ipAddress: '172.25.121.6',
			serialNumber: 'FOC2045X0WJ',
			productId: 'WS-C3850-48U-L',
			managedNeId: 'NA,FOC2045X0WJ,WS-C3850-48U-L,NA',
			softwareType: 'IOS-XE',
			softwareVersion: '03.06.05E',
			role: 'ACCESS',
			reachabilityStatus: 'Reachable',
		},
	],
	pagination: {
		pageNumber: 1,
		totalPages: 2,
		rowPerPage: 25,
		totalRows: 26,
	},
};

/**
 * The scenarios
 */
export const DevicePolicesScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'Call to get device list given customerId (92736491)',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
				{
					delay: 500,
					description: 'Failure - Call to get device list given customerId (92736491)',
					response: {
						body: '',
						status: 500,
					},
					selected: false,
				},
			],
		},
		url: api,
		usecases: ['Admin Settings', 'General'],
	},
	{
		scenarios: {
			PATCH: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: 'Patch Policy',
					response: {
						status: 200,
					},
					selected: true,
				},
			],
			POST: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: 'Post Policy',
					response: {
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: '/api/customerportal/controlpoint/v1/policy',
		usecases: ['Admin Settings', 'General'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: 'Get Devices given CustomerID',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: '/api/customerportal/controlpoint/v1/policy/devices/92736491',
		usecases: ['Admin Settings', 'General'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: 'Get Devices given CustomerID and Policy',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: '/api/customerportal/controlpoint/v1/policy/devices/92736491/b5a7a0bd-26a8-4c29-b8ec-7c3c2c40d3f4',
		usecases: ['Admin Settings', 'General'],
	},
];
