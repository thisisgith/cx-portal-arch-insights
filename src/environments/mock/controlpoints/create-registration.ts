import { IERegistrationResponseModel } from '@sdp-api';
/** base API for controlpoints info */
const api = '/api/customerportal/controlpoint/v1/register/ie';

/**
 * Mock body of results
 */
const mockData: IERegistrationResponseModel = {
	errors: [
		'string',
	],
	message: 'string',
	status: 0,
};

/**
 * The scenarios
 */
export const CreateRegistrationScenarios = [
	{
		scenarios: {
			POST: [
				{
					delay: 500,
					description: 'Call to create registration file',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['IE Setup'],
	},
];
