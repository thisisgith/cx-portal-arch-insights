import { UserEntitlement, OrgUserResponse } from '@sdp-api';

/** CustomerId to return  */
const customerId = '12345:0';

/** api for cx-entitlement-wrapper accounts call */
const accountsApi = '/api/cxportal/cxpp-entitlement-wrapper/v1/entitlement/user/accounts?accountType=CUSTOMER';

/** api for cx-entitlement-wrapper accounts call */
const v2UserApi = '/api/cxportal/entitlement/v2/user';

const adminRole = {
	roleName: 'AccountAdmin',
	roleDisplayName: 'Smart Account Administrator',
	tenant: 'SMARTACC',
	tenantDisplayName: 'Smart Account Management',
	attribType: null,
	attribValue: null,
	attribName: null,
};

const accountsResponseMock: UserEntitlement = {
	companyList: [{
		companyName: 'CISCO USA',
		companyId: 12345,
		domainIdentifier: 'cisco-us',
		accountType: 'CUSTOMER',
		roleList: [adminRole],
	}, {
		companyName: 'CISCO CANADA',
		companyId: 67890,
		domainIdentifier: 'cisco-ca',
		accountType: 'CUSTOMER',
		roleList: [adminRole],
	}],
	env: 'dev',
	internalAssignableRoleList: [adminRole],
	internalRoleList: [adminRole],
	locale: 'en',
	user: {
		firstName: 'Test',
		accessLevel: 'ADMIN',
		city: 'Toronto',
		company: 'CISCO CAN',
		country: 'Canada',
		dplAddressFlag: '99',
		emailId: 'abc@xyz.com',
		encryptSwAccess: '',
		billToIds: ['bill0', 'bill1'],
		lastName: 'Analyst',
		prefLanguage: 'eng',
		state: 'ON',
		street: 'Queens Quay',
		telephone: '1234567890',
		userId: 'user123',
		userTitle: 'Dev',
		zipCode: 'M5J 0B8',
	},
};

const v2UserResponseMock: OrgUserResponse = {
	customerId,
	orgName: 'CISCO',
	cxBUId: 'qwerty',
	individualAccount: {
		ccoId: 'abcde',
		saId: '12345',
		vaId: '0',
		role: 'ADMIN',
		userMethods: ['Administrator'],
		cxBUId: 'qwerty1',
	},
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
	subscribedServiceLevel: {
		serviceLineName: 'ABC',
		cxLevel: '1',
	},
	dataCenter: {
		dataCenter: 'usa',
		apiDoman: 'cisco-us',
	},
};

/** Our Default User */
export const v2User = {
	info: {
		...accountsResponseMock,
		...v2UserResponseMock,
	},
	service: v2UserResponseMock.subscribedServiceLevel,
};

const smartAccountMock = accountsResponseMock.companyList[0];
const accountUserMock = accountsResponseMock.user;

export const mappedUser = {
	...v2User,
	info: {
		...v2User.info,
		customerId,
		name: smartAccountMock.companyName,
		individual: {
			name: accountUserMock.firstName,
			familyName: accountUserMock.lastName,
			emailAddress: accountUserMock.emailId,
			ccoId: v2UserResponseMock.individualAccount.ccoId,
			cxBUId: v2UserResponseMock.individualAccount.cxBUId,
			role: v2UserResponseMock.individualAccount.role,
		},
		account: v2UserResponseMock.account,
		subscribedSolutions: {
			cxLevel: v2UserResponseMock.subscribedServiceLevel.cxLevel,
		},
	},
};

/**
 * The scenarios
 */
export const v2EntitlementScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Entitlement Wrapper Accounts Call',
					response: {
						body: accountsResponseMock,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: accountsApi,
		usecases: ['Test User Account'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Entitlement v2 User Call',
					response: {
						body: v2UserResponseMock,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: v2UserApi,
		usecases: ['Test User v2'],
	},
];
