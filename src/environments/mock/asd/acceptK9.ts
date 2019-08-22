/** base API */
const api = '/software/preview/v3.0/compliance/k9?business_div_function=' +
	'COMM_OR_CIVIL&confirmation=Confirm_Checked&download_session_id=11598' +
	'38637&user_action=Accepted';

/**
 * Mock body of results for successful DNAC call
 */
const mockData  = {
	download_session_id: '1159838637',
	status_message: 'SUCCESS',
	status_number: '0',
};

/**
 * The scenarios
 */
export const ASDAcceptK9Scenarios = [
	{
		scenarios: {
			POST: [
				{
					delay: 500,
					description: 'Accept K9 Agreement',
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
