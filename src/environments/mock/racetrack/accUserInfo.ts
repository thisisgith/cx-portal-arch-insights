import { ACCUserInfoSchema } from '@sdp-api';

/**
 * base API URL
 */
const api = '/api/customerportal/racetrack/v1/acc/request/user-info';

/**
 * Mock
 * @returns response
 */
function MockACCUserInfoResponse (): ACCUserInfoSchema {
	return {
		ccoId: 'vpriyata',
		ciscoContact: 'John Doe',
		companyName: 'Cisco Systems',
		country: 'USA',
		jobTitle: 'NETWORK SPECIALIST',
		userEmail: 'johndoe@cisco.com',
		userFullName: 'John Doe',
		userPhoneNumber: '1-888-555-5555',
	};
}

/**
 * ACC User info scenarios
 */
export const ACCUserInfoScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 38,
					description: '(ACC) ACC-Request User Info',
					response: {
						body: MockACCUserInfoResponse(),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Use Case 1'],
	},
];
