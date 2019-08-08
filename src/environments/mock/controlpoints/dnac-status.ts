import { CSDFResponseModel } from '@sdp-api';
/** base API for controlpoints info */
const api = '/api/customerportal/controlpoint/v1/dnac/status/2431199';

/**
 * Mock body of results for successful DNAC call
 */
const mockData: CSDFResponseModel = {
	dnacInstalled: true,
};

/**
 * Mock body of results for unsuccessful DNAC call
 */
const mockData2: CSDFResponseModel = {
	dnacInstalled: false,
};

/**
 * The scenarios
 */
export const DNACStatusScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'dnacInstalled true',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
				{
					delay: 500,
					description: 'dnacInstalled false',
					response: {
						body: mockData2,
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: api,
		usecases: ['IE Setup'],
	},
];
