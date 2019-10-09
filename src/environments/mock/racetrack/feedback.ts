import { UserFeedbackEntitySchema } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/racetrack/v1/feedback/cxportal';

const feedbackId = 'feedback-1';

/**
 * Mock FeedbackResponst
 * @returns response
 */
function MockSaveFeedbackResponse (): any {
	return {
		comment: "",
		context: {
			
		},
		thumbs: "UP"
	};
}

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
							comment: '',
							context: '',
							feedbackId: feedbackId,
							thumbs: 'UP'
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
							comment: 'this is awesome',
							context: '',
							feedbackId,
							thumbs: 'UP'
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
