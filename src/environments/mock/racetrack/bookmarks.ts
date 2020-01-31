/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/bookmarks';

/**
 * The scenarios
 */
export const BookmarkScenarios = [
	{
		scenarios: {
			POST: [
				{
					delay: 30,
					description: '(Lifecycle) IBN-Bookmark',
					response: {
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
