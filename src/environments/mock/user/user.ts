import { UserResponse } from '@sdp-api';
/** base API for user info */
const api = '/api/customerportal/party/v1/system/users';

/**
 * Mock body of results
 */
const mockData: UserResponse = {
	data: {
		customerId: '92736491',
		domainName: 'cisco.com',
		genId: '1234',
		individual: {
			ccoId: 'josmith',
			email: 'josmith@cisco.com',
			familyName: 'Smith',
			middleName: 'Eugene',
			name: 'John',
			phoneNumber: '5555555',
			role: 'member',
		},
	},
};

/**
 * The scenarios
 */
export const UserScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'Call to get user',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['IE Setup', 'General'],
	},
];
