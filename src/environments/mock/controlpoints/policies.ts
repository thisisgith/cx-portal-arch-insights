import { IEHealthStatusResponseModel } from '@sdp-api';
import { PolicyResponseModel } from '@sdp-api';
/** base API for controlpoints info */
const api = '/api/customerportal/controlpoint/v1/policies/92736491';

/**
 * Mock body of results
 */
const mockData: PolicyResponseModel[] = [
	{
		'policyType': 'SCAN',
		'schedule': '0 0 10 ? * TUE',
		"deviceCount": 5,
		'policyId': '6ded3658-1a21-47d9-ad7b-7a459b3a5e51',
		'formattedSchedule': 'at 10:00 at Tuesday day',
	},
	{
		'policyType': 'SCAN',
		'schedule': '0 0 6 * * *',
		"deviceCount": 5,
		'policyId': 'b5a7a0bd-26a8-4c29-b8ec-7c3c2c40d3f4',
		formattedSchedule: 'at 06:00',
	},
	{
		'policyType': 'SCAN',
		'schedule': '0 15 10 ? * MON-WED',
		"deviceCount": 3,
		'policyId': 'ce458106-9c1b-44b0-a86b-89a23e99bf7e',
		'formattedSchedule': 'at 10:15 every day between Monday and Wednesday',
	},
	{
		'policyType': 'SCAN',
		'schedule': '0 0 7 * * *',
		"deviceCount": 2,
		'policyId': '66fb15c7-65fb-485b-8889-35730c357bd5',
		'formattedSchedule': 'at 07:00',
	},
	{
		'policyType': 'SCAN',
		'schedule': '0 0 7 * * *',
		"deviceCount": 2,
		'policyId': '902cfffc-a617-4435-9e0b-29dab644dd28',
		'formattedSchedule': 'at 07:00',
	},
	{
		'policyType': 'SCAN',
		'schedule': '0 0 7 * * *',
		"deviceCount": 2,
		'policyId': 'a457f59c-3a20-41a7-bbd4-7510623735a6',
		'formattedSchedule': 'at 07:00',
	},
	{
		'policyType': 'COLLECTION',
		'schedule': '0 0 10 26 * *',
		"policyId": 'ab8ee334-d7b9-4288-abd9-808373f4d21a',
		'formattedSchedule': 'at 10:00 at 26 day',
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
];
