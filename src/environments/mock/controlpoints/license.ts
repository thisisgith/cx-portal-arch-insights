import { LicenseDataResponseModel } from '@sdp-api';
/** base API for controlpoints info */
const api = '/api/customerportal/controlpoint/v1/license';

/** customer ID */
const customerId = 2431199;
/**
 * Mock body of results
 */
const mockData: LicenseDataResponseModel = {
	license: [
		{
			licenseExpiry: 'No Expiry',
			licenseName: 'base-ap-cnt-G7',
			licenseType: 'permanent',
			status: 'In Use',
			usageCount: 48,
		},
		{
			licenseExpiry: '8 weeks, 4 days',
			licenseName: 'base-wl-ap-G6',
			licenseType: 'evaluation',
			status: 'Inactive',
			usageCount: 12,
		},
	],
};

/**
 * The scenarios
 */
export const LicenseScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'License data',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/${customerId}/Catalyst+2960S-24PS-L+Switch`,
		usecases: ['Use Case 1'],
	},
];
