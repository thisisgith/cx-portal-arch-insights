import { GroupTrainingEntitySchema } from '@sdp-api';
import { UserQuota } from '@sdp-api';
import { UserTraining } from '@sdp-api';

/**
 * Base of URL for SDP API
 */
const api = '/api/customerportal/racetrack/v1/grouptraining';

/** Default contractNumbers */
const contract1 = '111111';
const contract2 = '222222';
const contract3 = '333333';

/**
 * Mock
 * @returns mock response for cgtRequest
 */
function MockCGTRequestResponse (): GroupTrainingEntitySchema {
	return {
		ccoId: 'vpriyata',
		contract: '123456789',
		created: 1500000000000,
		customerId: '2431199',
		pitstop: 'test',
		preferredLanguage: 'English',
		preferredSlot: 'Afternoon',
		solution: 'test',
		status: 'Requested',
		technologyArea: 'Cloud',
		timezone: 'EST',
		trainingRequestId: '00000000-0000-0000-0000-000000000000',
		trainingSessionGoal: 'test',
		updated: 1500000000000,
		usecase: 'test',
	};
}

/**
 * Mock
 * @returns mock response for user-quota
 */
//  function MockUserQuotaResponse (): UserQuota {
// 	return {
// 		closed_ilt_courses_available: 0,
// 		closed_ilt_courses_entitled: 0,
// 		closed_ilt_courses_used: 0,
// 		contract_number: `${contract1}`,
// 		end_date: '2020-01-29',
// 		start_date: '2019-01-29',
// 	};
// }

/** Mock Data for contract counts */
const MockUserQuotaResponse: UserQuota[] = [
	{
		closed_ilt_courses_available: 1,
		closed_ilt_courses_entitled: 0,
		closed_ilt_courses_used: 0,
		contract_number: `${contract1}`,
		end_date: '2020-01-29',
		start_date: '2019-01-29',
	},
	{
		closed_ilt_courses_available: 0,
		closed_ilt_courses_entitled: 0,
		closed_ilt_courses_used: 0,
		contract_number: `${contract2}`,
		end_date: '2020-01-29',
		start_date: '2019-01-29',
	},
	{
		closed_ilt_courses_available: 0,
		closed_ilt_courses_entitled: 0,
		closed_ilt_courses_used: 0,
		contract_number: `${contract3}`,
		end_date: '2020-01-29',
		start_date: '2019-01-29',
	},
];

/** Mock Data for contract counts */
const MockCOmpletedTrainingsResponse: UserTraining[] = [
	{
		city: '0',
		country: '0',
		customer: '0',
		duration: 0,
		end_date: '2020-01-29',
		instructors: '',
		start_date: '2019-01-29',
		title: '',
		training_type: '',
	},
	{
		city: '0',
		country: '0',
		customer: '0',
		duration: 0,
		end_date: '2020-01-29',
		instructors: '',
		start_date: '2019-01-29',
		title: '',
		training_type: '',
	},
	{
		city: '0',
		country: '0',
		customer: '0',
		duration: 0,
		end_date: '2020-01-29',
		instructors: '',
		start_date: '2019-01-29',
		title: '',
		training_type: '',
	},
];

/**
 * CGT scenarios
 */
export const CGTScenarios = [
	{
		scenarios: {
			POST: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(CGT) CGT-RequestGroupTraining',
					response: {
						body: MockCGTRequestResponse(),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/request`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(CGT) GetUserQuota',
					response: {
						body: MockUserQuotaResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/user/quotas`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(CGT) GetCompletedTrainingsUserQuota',
					response: {
						body: MockCOmpletedTrainingsResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/user/trainings/completed`,
		usecases: ['Use Case 1'],
	},
];
