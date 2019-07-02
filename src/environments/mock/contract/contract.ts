import {
	ContractDeviceCountsResponse,
	DeviceContractResponse,
} from '@sdp-api';

/** base API for contract details */
const api = '/api/customerportal/contracts/v1/';

/**
 * Mock body of results
 */
const mockData: DeviceContractResponse = {
	data: [
		{
		  billtoAddressLine1: 'Kit Creek Rd',
		  contractEndDate: '2020-06-22T00:00:00Z',
		  contractNumber: 23000000,
		  contractStartDate: '2012-02-01T00:00:00Z',
		  contractStatus: 'Active',
		  customerId: '21131',
		  serviceLevel: 'Level 2',
		  serviceProgram: 'A Program',
		},
	],
};

/**
 * Mock body of results
 */
const mockDataOther: DeviceContractResponse = {
	data: [
		{
		  billtoAddressLine1: 'Kit Creek Rd',
		  contractEndDate: '2021-06-22T00:00:00Z',
		  contractNumber: 90000000,
		  contractStartDate: '2011-02-01T00:00:00Z',
		  contractStatus: 'Active',
		  customerId: '21131',
		  serviceLevel: 'Level 1',
		  serviceProgram: 'A Different Program',
		},
	],
};

/** Mock Data for contract counts */
const contractCountData: ContractDeviceCountsResponse = [
	{
		contractNumber: 'UNKNOWN',
		deviceCount: 34,
	},
	{
		contractNumber: '93425688',
		deviceCount: 4,
	},
	{
		contractNumber: '93856991',
		deviceCount: 1,
	},
];

/**
 * The scenarios
 */
export const ContractScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: 'Contract Details Success',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}details?customerId=2431199&contractNumber=230000000`,
		usecases: ['Example', 'More Example'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 800,
					description: 'Contract Details Success Other',
					response: {
						body: mockDataOther,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}details?customerId=2431199&contractNumber=90000000`,
		usecases: ['Example', 'More Example'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 800,
					description: 'Contract Counts Data',
					response: {
						body: contractCountData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}device/count?customerId=2431199`,
		usecases: ['Example'],
	},
];
