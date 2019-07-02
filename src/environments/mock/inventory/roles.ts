import { RoleCountResponse } from '@cui-x/sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/inventory/v1/role/device/count';

/** Default Customer ID */
const customerId = '2431199';

/** The mock response for role counts */
const mockRoleCounts: RoleCountResponse = [
	{
		deviceCount: 9,
		role: 'ACCESS',
	},
	{
		deviceCount: 1,
		role: 'CORE',
	},
	{
		deviceCount: 2,
		role: 'BORDER ROUTER',
	},
	{
		deviceCount: 1,
		role: 'DISTRIBUTION',
	},
];

/** The scenarios */
export const RoleScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Role Count',
					response: {
						body: mockRoleCounts,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
