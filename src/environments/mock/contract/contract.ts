import { DeviceContractResponse } from '@cui-x/sdp-api';
/** base API for contract details */
const api = '/api/customerportal/contracts/v1/details';

/**
 * Mock body of results
 */
const mockData: DeviceContractResponse = {
	/* tslint:disable:max-line-length ter-max-len no-irregular-whitespace object-literal-sort-keys*/
	data: [
		{
		  billtoAddressLine1: 'Kit Creek Rd',
		  customerId: '21131',
		  contractStatus: 'Active',
		  contractStartDate: '2012-02-01T00:00:00Z',
		  contractEndDate: '2020-06-22T00:00:00Z',
		  serviceProgram: 'A Program',
		  serviceLevel: 'Level 2',
		  contractNumber: 23000000,
		},
	],
};

/**
 * Mock body of results
 */
const mockDataOther: DeviceContractResponse = {
	/* tslint:disable:max-line-length ter-max-len no-irregular-whitespace object-literal-sort-keys*/
	data: [
		{
		  billtoAddressLine1: 'Kit Creek Rd',
		  customerId: '21131',
		  contractStatus: 'Active',
		  contractStartDate: '2011-02-01T00:00:00Z',
		  contractEndDate: '2021-06-22T00:00:00Z',
		  serviceProgram: 'A Different Program',
		  serviceLevel: 'Level 1',
		  contractNumber: 90000000,
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
					description: 'Contract Details Success',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=2431199&contractNumber=230000000`,
		usecases: ['Example', 'More Example'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 800,
					description: 'Contract Details Success Other',
					response: {
						body: mockDataOther,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}?customerId=2431199&contractNumber=90000000`,
		usecases: ['Example', 'More Example'],
	},
];
