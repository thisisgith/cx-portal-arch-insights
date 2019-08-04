import { GroupTrainingEntitySchema, UserQuota, UserTraining } from '@sdp-api';

/**
 * Base of URL for SDP API
 */
const api = '/api/customerportal/racetrack/v1/grouptraining';

/** Default contract ID */
const contract1 = '111111';
/** Default contract ID */
const contract2 = '222222';
/** Default contract ID */
const contract3 = '333333';

/**
 * Mock response for groupTraining POST
 * @returns response
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
 * Mock response for getUserQuotas
 * @returns response
 */
function MockUserQuotaResponse (): UserQuota[] {
	return [
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
			end_date: '2020-02-28',
			start_date: '2019-02-28',
		},
		{
			closed_ilt_courses_available: 0,
			closed_ilt_courses_entitled: 0,
			closed_ilt_courses_used: 0,
			contract_number: `${contract3}`,
			end_date: '2020-03-29',
			start_date: '2019-03-29',
		},
	];
}

/**
 * Mock response for getCompletedTrainings
 * @returns response
 */
function MockCompletedTrainingsResponse (): UserTraining[] {
	return [
		{
			city: 'London',
			country: 'UK',
			customer: '0',
			duration: 0,
			end_date: '2019-02-02',
			instructors: 'John Doe',
			start_date: '2019-01-29',
			title: '',
			training_type: '',
		},
		{
			city: 'London',
			country: 'UK',
			customer: '0',
			duration: 0,
			end_date: '2019-01-02',
			instructors: 'John Doe',
			start_date: '2018-12-29',
			title: '',
			training_type: '',
		},
		{
			city: 'RTP',
			country: 'USA',
			customer: '0',
			duration: 0,
			end_date: '2019-01-28',
			instructors: 'JohnDoe',
			start_date: '2019-01-24',
			title: '',
			training_type: '',
		},
	];
}

/**
 * ACC User info scenarios
 */
export const CGTScenarios = [
	{
		scenarios: {
			POST: [
				{
					delay: Math.floor(Math.random() * 2000) + 250,
					description: '(CGT) CGT-Request Training',
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
					description: '(CGT) CGT-GetUserQuota',
					response: {
						body: MockUserQuotaResponse(),
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
					description: '(CGT) CGT-GetCompletedTrainings',
					response: {
						body: MockCompletedTrainingsResponse(),
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
