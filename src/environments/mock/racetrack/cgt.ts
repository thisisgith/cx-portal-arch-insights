import { GroupTrainingEntitySchema, ContractQuota, UserTraining } from '@sdp-api';

/**
 * Base of URL for SDP API
 */
const api = '/api/customerportal/racetrack/v1/grouptraining';

/** Default contract ID */
const customerId = '2431199';
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
 * Mock response for getCustomerQuotas
 * @returns response
 */
function MockCustomerQuotaResponse (): ContractQuota[] {
	return [
		{
			closed_ilt_courses_inprocess: 2,
			closed_ilt_courses_used: 0,
			tsa_contract_no: `${contract1}`,
			contract_end_date: '2019-10-29',
			contract_start_date: '2018-10-29',
			customer_admin: 'John Doe, Jane Doe',
			learning_advisor: 'jdoe',
		},
		{
			closed_ilt_courses_inprocess: 0,
			closed_ilt_courses_used: 0,
			tsa_contract_no: `${contract2}`,
			contract_end_date: '2020-02-28',
			contract_start_date: '2019-02-28',
			customer_admin: 'John Doe, Jane Doe',
			learning_advisor: 'jdoe',
		},
		{
			closed_ilt_courses_inprocess: 0,
			closed_ilt_courses_used: 0,
			tsa_contract_no: `${contract3}`,
			contract_end_date: '2020-03-29',
			contract_start_date: '2019-03-29',
			customer_admin: 'John Doe, Jane Doe',
			learning_advisor: 'jdoe',
		},
	];
}

/**
 * Mock response for getCompletedTrainings
 * @param mockFileName the name of the corresponding json file to pull mock data from
 * @returns response
 */
function MockCompletedTrainingsResponse (mockFileName?: string): UserTraining[] {
	if (mockFileName && mockFileName !== '') {
		return require(`./cgtMockData/${mockFileName}.json`);
	}

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
			contract_number: `${contract1}`,
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
			contract_number: `${contract3}`,
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
			contract_number: `${contract1}`,
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
					delay: 38,
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
					delay: 38,
					description: '(CGT) CGT-GetCustomerQuota',
					response: {
						body: MockCustomerQuotaResponse(),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/customer/quotas?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 38,
					description: '(CGT) CGT-GetCompletedTrainings',
					response: {
						body: MockCompletedTrainingsResponse(),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 38,
					description: '(CGT) CGT-GetCompletedTrainings-Empty',
					response: {
						body: [],
						status: 200,
					},
					selected: false,
				},
				{
					delay: 38,
					description: '(CGT) CGT-GetCompletedTrainings-fourCompleted',
					response: {
						body: MockCompletedTrainingsResponse('fourCompleted'),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 38,
					description: '(CGT) CGT-GetCompletedTrainings-twoCompletedThisYear',
					response: {
						body: MockCompletedTrainingsResponse('twoCompletedThisYear'),
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}/customer/trainings/completed?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
