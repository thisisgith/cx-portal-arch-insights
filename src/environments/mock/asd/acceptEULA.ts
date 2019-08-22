/** base API */
const api = '/software/preview/v3.0/compliance/eula?download_session_id=1159838637&' +
	'user_action=Accepted';

/**
 * Mock body of results for successful DNAC call
 */
const mockData  = {
	download_session_id: '1159838637',
	status_message: 'You have Successfully Accepted EULA',
	status_number: 'Y',
};

/**
 * The scenarios
 */
export const ASDAcceptEulaScenarios = [
	{
		scenarios: {
			POST: [
				{
					delay: 500,
					description: 'Accept EULA Agreement',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['ASD'],
	},
];
