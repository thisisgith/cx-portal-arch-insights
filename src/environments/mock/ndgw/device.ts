import { Transaction, TransactionStatusResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/ndgw/v1/device';

/** Default Customer ID */
const customerId = '2431199';

/** Scan transaction ID */
const transactionId = 'cd2e25ce-649f-483c-afa4-8664c4be277d';

/** Mock data for Transaction API Results */
export const MockTransactionRequestResponse: Transaction[] = [
	{
		customerId,
		transactionId,
		remoteNodeId: 'CAT2034B1H6',
	},
];

/** Mock data for Scan Status (IN_PROGRESS) */
export const MockInProgressResponse: TransactionStatusResponse[] = [
	{
		customerId,
		status: 'IN_PROGRESS',
		transactionType: transactionId,
	},
];

/** Mock data for Scan Status (SUCCESS) */
export const MockSuccessResponse: TransactionStatusResponse = {
	customerId,
	status: 'SUCCESS',
	transactionType: transactionId,
};

/** The scenarios */
export const DeviceScenarios = [
	{
		scenarios: {
			POST: [
				{
					delay: 250,
					description: 'scan',
					response: {
						body: MockTransactionRequestResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/transactions`,
		usecases: ['Diagnostic Scanning'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: 'Scan Status by SN & PID for CAT2034B1H6',
					response: {
						body: MockInProgressResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/scan-request/status/${customerId}/CAT2034B1H6/WS-C2960X-24PS-L`,
		usecases: ['Diagnostic Scanning'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 250,
					description: 'Scan Status by Transaction ID',
					response: {
						body: MockSuccessResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/scan-request/status/${customerId}/${transactionId}`,
		usecases: ['Diagnostic Scanning'],
	},
];
