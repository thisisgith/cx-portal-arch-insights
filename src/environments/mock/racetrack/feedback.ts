/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/feedback/cxportal';
/** Default mock feedback id */
const feedbackId = 'feedback-1';

/**
 * The scenarios
 */
export const FeedbackScenarios = [
	{
		scenarios: {
			POST: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: '(Lifecycle) Feedback POST',
					response: {
						body: {
							feedbackId,
							comment: '',
							context: '',
							thumbs: 'UP',
						},
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			PUT: [
				{
					delay: Math.floor(Math.random() * 2000),
					description: '(Lifecycle) Feedback PUT',
					response: {
						body:  {
							feedbackId,
							comment: 'this is awesome',
							context: '',
							thumbs: 'UP',
						},
						status: 200,
					},
					selected: true,
				},

			],
		},
		url: `${api}/${feedbackId}`,
		usecases: ['Use Case 1'],
	},
];
