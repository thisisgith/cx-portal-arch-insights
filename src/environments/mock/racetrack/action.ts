import { PitstopActionUpdateResponse } from '@cui-x/sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/pitstop/v1/action/status';

/** Default Customer ID */
const customerId = '2431199';

/**
 * Stuff
 * @param isAtxChanged boolean
 * @param isAccChanged boolean
 * @param isElearningChanged boolean
 * @param isCommunitiesChanged boolean
 * @param isSuccessPathChanged boolean
 * @returns response
 */
function MockActionUpdate (
	isAtxChanged: boolean,
	isAccChanged: boolean,
	isElearningChanged: boolean,
	isCommunitiesChanged: boolean,
	isSuccessPathChanged: boolean): PitstopActionUpdateResponse {
	return {
		isAtxChanged,
		isAccChanged,
		isElearningChanged,
		isCommunitiesChanged,
		isSuccessPathChanged,
	};
}

/**
 * The scenarios
 */
export const ActionScenarios = [
	{
		scenarios: {
			PATCH: [
				{
					delay: 50,
					description: 'Update to complete the first Action',
					response: {
						body: MockActionUpdate(true, false, false, false, false),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}`,
	},
];
