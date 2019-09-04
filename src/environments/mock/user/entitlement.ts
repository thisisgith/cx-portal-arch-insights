import { EntitledUser, ServiceInfoResponse } from '@sdp-api';
import * as _ from 'lodash-es';
import { User } from '@interfaces';

/** CustomerId to return  */
const customerId = '2431199';

/** api for user info */
const userApi = '/api/customerportal/entitlement/v1/user';

/** api for service-info */
const serviceApi1 = `/api/customerportal/entitlement/v1/party/service-info/${customerId}`;

/**
 * Mock body of user results
 */
const mockUser1: EntitledUser = {
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
	account: {
		team: [{
			ccoId: 'agonzales',
			emailAddress: 'agonzales@cisco.com',
			familyName: 'Gonzales',
			name: 'Ann',
			phone: '+1-333-333-3333',
			title: 'Customer Sales Specialist',
		}, {
			ccoId: 'mcho',
			emailAddress: 'mcho@cisco.com',
			familyName: 'Cho',
			name: 'Michael',
			phone: '+1-333-333-3333',
			title: 'High Touch Operations Manager Very Long title (HTOM)',
		}, {
			ccoId: 'db',
			emailAddress: 'db@cisco.com',
			familyName: 'Brian',
			name: 'Dan',
			phone: '+1-333-333-3333',
			title: 'High Touch Operations Manager',
		}, {
			ccoId: 'drwho',
			emailAddress: 'drwho@cisco.com',
			familyName: 'Doctor',
			name: 'The',
			phone: '+1-333-333-3333',
			title: 'Time Lord',
		}],
	},
};

/**
 * Mock user 2
 */
const mockUser2 = Object.assign({ }, mockUser1);
mockUser2.customerId = '92736491';

/** api for service-info 2 */
const serviceApi2 = `/api/customerportal/entitlement/v1/party/service-info/${mockUser2.customerId}`;

/**
 * Mock body of service results
 */
const mockServiceInfo: ServiceInfoResponse = [
	{
		cxLevel: 2,
		solution: 'IBN',
		useCase: 'Wireless Assurance',
	},
];

/** Our Default User */
export const user: User = {
	info: mockUser1,
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
					description: 'Entitlement Call User 1',
					response: {
						body: mockUser1,
						status: 200,
					},
					selected: true,
				},
				{
					delay: 100,
					description: 'Entitlement Call User 2',
					response: {
						body: mockUser2,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: userApi,
		usecases: ['Admin Settings', 'Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Entitlement Service info Call for User 1',
					response: {
						body: mockServiceInfo,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: serviceApi1,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Entitlement Service info Call for User 2',
					response: {
						body: mockServiceInfo,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: serviceApi2,
		usecases: ['Admin Settings'],
	},
];
