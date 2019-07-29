import { PolicyResponseModel } from '@sdp-api';
/** base API for controlpoints info */
const api = '/api/customerportal/controlpoint/v1/policies/92736491';

/**
 * Mock body of results
 */
const mockData: PolicyResponseModel[] = [
	{
		deviceCount: 5,
		formattedSchedule: 'at 06:00',
		policyId: 'b5a7a0bd-26a8-4c29-b8ec-7c3c2c40d3f4',
		policyType: 'SCAN',
		schedule: '0 0 6 * * *',
	},
	{
		deviceCount: 5,
		formattedSchedule: 'at 10:00 at Tuesday day',
		policyId: '6ded3658-1a21-47d9-ad7b-7a459b3a5e51',
		policyType: 'SCAN',
		schedule: '0 0 10 ? * TUE',
	},
	{
		deviceCount: 5,
		formattedSchedule: 'at 10:15 every day between Monday and Wednesday',
		policyId: 'ce458106-9c1b-44b0-a86b-89a23e99bf7e',
		policyType: 'SCAN',
		schedule: '0 15 10 ? * MON-WED',
	},
	{
		deviceCount: 5,
		formattedSchedule: 'at 07:00',
		policyId: '66fb15c7-65fb-485b-8889-35730c357bd5',
		policyType: 'SCAN',
		schedule: '0 0 7 * * *',
	},
	{
		formattedSchedule: 'at 10:00 at 26 day',
		policyId: 'ab8ee334-d7b9-4288-abd9-808373f4d21a',
		policyType: 'COLLECTION',
		schedule: '0 0 10 26 * *',
	},
];

/**
 * The scenarios
 */
export const PolicesScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'Call to get policies',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
				{
					delay: 500,
					description: 'Policies - Failure',
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
					description: 'Patch CollectionPolicy',
					response: {
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: '/api/customerportal/controlpoint/v1/collectionPolicy',
		usecases: ['Admin Settings', 'General'],
	},
];
