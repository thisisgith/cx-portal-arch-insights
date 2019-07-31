import { EntitledUser, ServiceInfoResponse } from '@sdp-api';
import * as _ from 'lodash-es';
import { User } from '@interfaces';

/** CustomerId to return  */
const customerId = '2431199';

/** api for user info */
const userApi = '/api/customerportal/entitlement/v1/user';

/** api for service-info */
const serviceApi = `/api/customerportal/entitlement/v1/party/service-info/${customerId}`;

/**
 * Mock body of user results
 */
const mockUser: EntitledUser = {
	customerId,
	individual: {
		ccoId: 'fakeCco',
		cxBUId: customerId,
		emailAddress: 'fakeCco@cisco.com',
		familyName: 'Test',
		name: 'Demo',
		role: 'admin',
	},
	name: 'Test User',
};

/**
 * Mock body of service results
 */
const mockServiceInfo: ServiceInfoResponse = [
	{
		cxLevel: 3,
		solution: 'IBN',
		useCase: 'Wireless Assurance',
	},
];

/** Our Default User */
export const user: User = {
	info: mockUser,
	service: _.head(mockServiceInfo),
};

/**
 * The scenarios
 */
export const EntitlementScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Entitlement Call',
					response: {
						body: mockUser,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: userApi,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Entitlement Service info Call',
					response: {
						body: mockServiceInfo,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: serviceApi,
		usecases: ['Use Case 1'],
	},
];
