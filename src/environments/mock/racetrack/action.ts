
/** Base of URL for SDP API */
const api = '/api/customerportal/pitstop/v1/action/status';

/** Default Customer ID */
// const customerId = '2431199';

/**
 * Stuff
 * @param isAtxChanged boolean
 * @param isAccChanged boolean
 * @param isElearningChanged boolean
 * @param isCommunitiesChanged boolean
 * @param isCgtChanged boolean
 * @param isSuccessPathChanged boolean
 * @returns response
 */

/**
 * The scenarios
 */
export const ActionScenarios = [
	{
		scenarios: {
			PUT: [
				{
					delay: Math.floor(Math.random() * 2000) + 50,
					description: 'Update to complete the first Action',
					response: {
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}`,
		usecases: ['Use Case 1'],
	},
];
