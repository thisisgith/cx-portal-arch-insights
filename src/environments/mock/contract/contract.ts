import { ContractsResponse } from '@cui-x/sdp-api';
/** base API for contract details */
const api = '/api/v1/contracts';

/**
 * Mock body of results
 */
const mockData: ContractsResponse = {
	/* tslint:disable:max-line-length ter-max-len no-irregular-whitespace object-literal-sort-keys*/
	data: [
		{
		  billtoAddressLine1: 'Kit Creek Rd',
		  customerId: '21131',
		  contractStatus: 'Active',
		  contractStartDate: '03/03/2016',
		  contractEndDate: '03/04/2020',
		  serviceProgram: 'A Program',
		  serviceLevel: 'Level 2',
		  contractNumber: 23000000,
		},
	],
};

/**
 * The scenarios
 */
export const ContractScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'Details Success',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=2431199&contractNumber=23000000`,
		usecases: ['Example', 'More Example'],
	},
];
