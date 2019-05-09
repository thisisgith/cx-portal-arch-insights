/**
 * Default Origin
 */
const origin = 'https://swtgdev-apollo-2.cisco.com';

/**
 * Our default mock settings
 */
export const mock = {
	mock: {
		origin,
		settings: [
			{
				method: 'GET',
				scenario: '200ok Example Response',
				url: '/ws/search',
			},
			{
				method: 'GET',
				scenario: '200ok',
				url: '/ws/webinars',
			},
			{
				method: 'GET',
				scenario: '200Ok',
				url: '/ws/inventory',
			},
			{
				method: 'GET',
				scenario: 'Example Response',
				url: '/ws/alert',
			},
			{
				method: 'GET',
				scenario: '200ok',
				url: '/api/v1/racetrack',
			},
			{
				method: 'GET',
				scenario: '200Ok Example Response',
				url: '/ws/inventory/hardware',
			},
			{
				method: 'GET',
				scenario: '200Ok',
				url: '/ws/inventory/hardware?_id=1',
			},
			{
				method: 'GET',
				scenario: '200ok',
				url: '/api/v1/racetrack/atx',
			},
			{
				method: 'GET',
				scenario: '200 OK',
				url: '/api/customerportal/v1/racetrack?customerId=9998000000091',
			},
		],
		tags: {
			appId: 'pbc',
		},
	},
};
