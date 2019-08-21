import { PoliciesGroupByDayInAMonthModel } from '@sdp-api';
/** base API for controlpoints info */
const api = '/api/customerportal/controlpoint/v1/policies/2431199/08/2019';

/**
 * Mock body of results
 */
const mockData: PoliciesGroupByDayInAMonthModel [] = [
	{
		dayOfGivenMonth: 1,
		policyList: [],
	},
	{
		dayOfGivenMonth: 2,
		policyList: [],
	},
	{
		dayOfGivenMonth: 3,
		policyList: [],
	},
	{
		dayOfGivenMonth: 4,
		policyList: [],
	},
	{
		dayOfGivenMonth: 5,
		policyList: [],
	},
	{
		dayOfGivenMonth: 6,
		policyList: [],
	},
	{
		dayOfGivenMonth: 7,
		policyList: [],
	},
	{
		dayOfGivenMonth: 8,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
		],
	},
	{
		dayOfGivenMonth: 9,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
		],
	},
	{
		dayOfGivenMonth: 10,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
		],
	},
	{
		dayOfGivenMonth: 11,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'IGNORE',
				schedule: '0 7 * * *',
			},
		],
	},
	{
		dayOfGivenMonth: 12,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
		],
	},
	{
		dayOfGivenMonth: 13,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-08T15:14:56.263',
				deviceCount: 6,
				policyId: '1e908d88-331f-43f1-8a2e-ed876134a83b',
				policyType: 'SCAN',
				schedule: '0 0 12 ? * 3',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 14,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 15,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 16,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 17,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 18,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 19,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 20,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-08T15:14:56.263',
				deviceCount: 6,
				policyId: '1e908d88-331f-43f1-8a2e-ed876134a83b',
				policyType: 'SCAN',
				schedule: '0 0 12 ? * 3',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 21,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-07-31T18:24:44.828',
				deviceCount: 2,
				policyId: 'a99d5f8b-1d9e-4326-b157-efceeb892953',
				policyType: 'SCAN',
				schedule: '0 30 23 21 * ?',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 22,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 23,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 24,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 25,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 26,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 27,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-08T15:14:56.263',
				deviceCount: 6,
				policyId: '1e908d88-331f-43f1-8a2e-ed876134a83b',
				policyType: 'SCAN',
				schedule: '0 0 12 ? * 3',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 28,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 29,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 30,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
	{
		dayOfGivenMonth: 31,
		policyList: [
			{
				createdDate: '2019-08-07T19:25:07.859',
				deviceCount: 1,
				policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
				policyType: 'SCAN',
				schedule: '0 7 * * *',
			},
			{
				createdDate: '2019-08-12T16:00:19.071',
				policyId: '221cef60-d0b6-4353-ab25-e773a6c060b2',
				policyType: 'COLLECTION',
				schedule: '0 0 8 * * ?',
			},
		],
	},
];

/**
 * The scenarios
 */
export const CalendarScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'Call to get policies by month',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Admin Settings'],
	},
];
