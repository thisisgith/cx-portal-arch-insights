/** Base of URL for CSOne Case API */
const api = '/ws/cases/v3/proxy';

/** Mock data for valid CSOne Case Details API results */
const caseDetailsResponse = {
	caseNumber: '688296392',
	contractId: '912512343',
	createdDate: '22 Apr 2019 07:50 AM PST',
	description: 'CP DIAG Diagnostic Request for Device swtg-9404',
	hostName: 'SJ-BLD3-02-147',
	ownerEmail: 'testUser@cisco.com',
	ownerName: 'Test User',
	priority: '3',
	rmaNumber: '88346234, 88346235, 800000000',
	serialNumber: 'FOC1544Y16T',
	status: 'Customer Updated',
	summary: 'Test CIN Proxy Employee Subscription - testing case update.',
	trackingNumber: '',
};

/** Mock data for valid CSOne Case Details API results with no description. */
const caseDetailsResponseAlt = {
	caseNumber: '688296392',
	contractId: '912512343',
	createdDate: '22 Apr 2019 07:50 AM PST',
	description: '',
	hostName: 'SJ-BLD3-02-147',
	ownerEmail: 'testUser@cisco.com',
	ownerName: '',
	priority: '3',
	rmaNumber: '88346234, 88346235',
	serialNumber: 'FOC1544Y16T',
	status: 'Customer Updated',
	summary: 'Test CIN Proxy Employee Subscription - testing case update.',
	trackingNumber: '',
};

/** Mock data for valid CSOne Case Notes API results */
const caseNotesResponse = [
	// tslint:disable:max-line-length ter-max-len
	{
		createdDate: '21 Jun 2019 01:16 PM EST',
		noteDetail: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.',
	},
];

/** Mock data for valid CSOne Case Summary API results */
const caseSummaryResponse = {
	content: [
		{
			caseOwner: 'Thomas Ortiz',
		},
	],
};

/** Mock data for valid CSOne Case List API results - Page 1 */
const caseListResponse1 = {
	content: [
		{
			bugId: '',
			caseAccepted: false,
			caseNumber: '688296392',
			caseOrigin: 'Phone',
			caseOwner: '',
			caseType: 'TAC',
			ccsUUId: 'jkipp@cisco.com',
			childContainerId: '111731',
			ciUUId: 'd2348285-e427-4720-8647-364a28eb9f32',
			closedDate: '',
			contactEmail: 'jkipp@cisco.com',
			contactFirstName: 'Joseph',
			contactId: 'jkipp',
			contactLastName: 'Kipping',
			contactPhone: '+14692551107',
			containerType: 'S',
			contractNumber: '912512343',
			country: '',
			createdDate: '22 Apr 2019 07:50 AM PST',
			customerTicketNumber: '',
			deviceName: 'SWTG-9404',
			discussionThreadId: '',
			hwProductId: '',
			hwProductName: '',
			initialPriority: '1',
			jbrUUId: 'U6WPE6ZW1NHJY47A25CLTX2X2O',
			kacUUId: '',
			lastModifiedDate: '2019-06-03T16:41:00.000Z',
			owner: 'Test User',
			parentContainerId: '109185',
			partnerCaseOwnerName: '',
			picaId: '',
			priority: '3',
			problemCode: 'ERROR_MESSAGES',
			problemDescription: 'Test CIN Proxy Employee Subscription',
			rmaCreatedDate: '',
			rmaNumber: '88346234, 88346235, 800000000',
			serialNumber: 'FOC1544Y16T',
			softwareVersion: 'abcd',
			spokenLanguage: 'US',
			status: 'Customer Updated',
			statusType: 'O',
			subscriptionRefId: 'Sub2146937',
			subTechnologyId: '801',
			subTechnologyName: 'WCCP (Web Cache Control Protocol)',
			summary: 'Test CIN Proxy Employee Subscription - testing case update.',
			swProductId: '',
			swProductName: '',
			technologyId: '14',
			technologyName: 'Application Networking Services',
		},
		{
			bugId: '',
			caseAccepted: false,
			caseNumber: '686285187',
			caseOrigin: 'Phone',
			caseOwner: '',
			caseType: 'TAC',
			ccsUUId: 'jkipp@cisco.com',
			childContainerId: '',
			ciUUId: 'd2348285-e427-4720-8647-364a28eb9f32',
			closedDate: '',
			contactEmail: 'jkipp@cisco.com',
			contactFirstName: 'Joseph',
			contactId: 'jkipp',
			contactLastName: 'Kipping',
			contactPhone: '+14692551107',
			containerType: '',
			contractNumber: '',
			country: '',
			createdDate: '2019-05-20T13:16:35.000Z',
			customerTicketNumber: '',
			deviceName: 'SWTG-9404',
			discussionThreadId: '',
			hwProductId: '',
			hwProductName: '',
			initialPriority: '1',
			jbrUUId: 'U6WPE6ZW1NHJY47A25CLTX2X2O',
			kacUUId: '',
			lastModifiedDate: '2019-05-20T13:16:42.000Z',
			owner: '',
			parentContainerId: '',
			partnerCaseOwnerName: '',
			picaId: '',
			priority: '1',
			problemCode: 'SOFTWARE_FAILURE',
			problemDescription: 'Test CIN Sev1',
			rmaCreatedDate: '',
			rmaNumber: '',
			serialNumber: '',
			softwareVersion: '',
			spokenLanguage: 'US',
			status: 'Cisco Pending',
			statusType: 'O',
			subscriptionRefId: '',
			subTechnologyId: '0',
			subTechnologyName: 'Other',
			summary: 'Test CIN Sev1',
			swProductId: '',
			swProductName: '',
			technologyId: '0',
			technologyName: 'Other',
		},
		{
			bugId: '',
			caseAccepted: false,
			caseNumber: '686285188',
			caseOrigin: 'Phone',
			caseOwner: '',
			caseType: 'TAC',
			ccsUUId: 'jkipp@cisco.com',
			childContainerId: '',
			ciUUId: 'd2348285-e427-4720-8647-364a28eb9f32',
			closedDate: '',
			contactEmail: 'jkipp@cisco.com',
			contactFirstName: 'Joseph',
			contactId: 'jkipp',
			contactLastName: 'Kipping',
			contactPhone: '+14692551107',
			containerType: '',
			contractNumber: '',
			country: '',
			createdDate: '2019-05-20T13:16:35.000Z',
			customerTicketNumber: '',
			deviceName: 'SWTG-9404',
			discussionThreadId: '',
			hwProductId: '',
			hwProductName: '',
			initialPriority: '1',
			jbrUUId: 'U6WPE6ZW1NHJY47A25CLTX2X2O',
			kacUUId: '',
			lastModifiedDate: '2019-05-20T13:16:42.000Z',
			owner: '',
			parentContainerId: '',
			partnerCaseOwnerName: '',
			picaId: '',
			priority: '4',
			problemCode: 'SOFTWARE_FAILURE',
			problemDescription: 'Test CIN Sev1',
			rmaCreatedDate: '',
			rmaNumber: '',
			serialNumber: '',
			softwareVersion: '',
			spokenLanguage: 'US',
			status: 'Cisco Pending',
			statusType: 'O',
			subscriptionRefId: '',
			subTechnologyId: '0',
			subTechnologyName: 'Other',
			summary: 'Test CIN Sev1',
			swProductId: '',
			swProductName: '',
			technologyId: '0',
			technologyName: 'Other',
		},
		{
			bugId: '',
			caseAccepted: false,
			caseNumber: '686285189',
			caseOrigin: 'Phone',
			caseOwner: '',
			caseType: 'TAC',
			ccsUUId: 'jkipp@cisco.com',
			childContainerId: '',
			ciUUId: 'd2348285-e427-4720-8647-364a28eb9f32',
			closedDate: '',
			contactEmail: 'jkipp@cisco.com',
			contactFirstName: 'Joseph',
			contactId: 'jkipp',
			contactLastName: 'Kipping',
			contactPhone: '+14692551107',
			containerType: '',
			contractNumber: '',
			country: '',
			createdDate: '2019-05-20T13:16:35.000Z',
			customerTicketNumber: '',
			deviceName: 'SWTG-9404',
			discussionThreadId: '',
			hwProductId: '',
			hwProductName: '',
			initialPriority: '1',
			jbrUUId: 'U6WPE6ZW1NHJY47A25CLTX2X2O',
			kacUUId: '',
			lastModifiedDate: '2019-05-20T13:16:42.000Z',
			owner: '',
			parentContainerId: '',
			partnerCaseOwnerName: '',
			picaId: '',
			priority: '2',
			problemCode: 'SOFTWARE_FAILURE',
			problemDescription: 'Test CIN Sev1',
			rmaCreatedDate: '',
			rmaNumber: '',
			serialNumber: '',
			softwareVersion: '',
			spokenLanguage: 'US',
			status: 'Cisco Pending',
			statusType: 'O',
			subscriptionRefId: '',
			subTechnologyId: '0',
			subTechnologyName: 'Other',
			summary: 'Test CIN Sev1',
			swProductId: '',
			swProductName: '',
			technologyId: '0',
			technologyName: 'Other',
		},
	],
	numberOfElements: 4,
	totalElements: 5,
};

/** Mock data for valid CSOne Case List API results - Page 2 */
const caseListResponse2 = {
	content: [
		{
			bugId: '',
			caseAccepted: false,
			caseNumber: '686285990',
			caseOrigin: 'Phone',
			caseOwner: '',
			caseType: 'TAC',
			ccsUUId: 'jkipp@cisco.com',
			childContainerId: '',
			ciUUId: 'd2348285-e427-4720-8647-364a28eb9f32',
			closedDate: '',
			contactEmail: 'jkipp@cisco.com',
			contactFirstName: 'Joseph',
			contactId: 'jkipp',
			contactLastName: 'Kipping',
			contactPhone: '+14692551107',
			containerType: '',
			contractNumber: '',
			country: '',
			createdDate: '2019-05-20T13:16:35.000Z',
			customerTicketNumber: '',
			deviceName: 'SWTG-9404',
			discussionThreadId: '',
			hwProductId: '',
			hwProductName: '',
			initialPriority: '1',
			jbrUUId: 'U6WPE6ZW1NHJY47A25CLTX2X2O',
			kacUUId: '',
			lastModifiedDate: '2019-05-20T13:16:42.000Z',
			owner: '',
			parentContainerId: '',
			partnerCaseOwnerName: '',
			picaId: '',
			priority: '3',
			problemCode: 'SOFTWARE_FAILURE',
			problemDescription: 'Test CIN Sev1',
			rmaCreatedDate: '',
			rmaNumber: '',
			serialNumber: '',
			softwareVersion: '',
			spokenLanguage: 'US',
			status: 'Cisco Pending',
			statusType: 'O',
			subscriptionRefId: '',
			subTechnologyId: '0',
			subTechnologyName: 'Other',
			summary: 'Test CIN Sev1',
			swProductId: '',
			swProductName: '',
			technologyId: '0',
			technologyName: 'Other',
		},
	],
	numberOfElements: 1,
	totalElements: 5,
};

/** Mock data for valid CSOne Case List API results - For single case - result of search */
const caseListResponseSingle = {
	content: [
		{
			caseNumber: '688296392',
			contractId: '912512343',
			createdDate: '22 Apr 2019 07:50 AM PST',
			description: 'CP DIAG Diagnostic Request for Device swtg-9404',
			hostName: 'SJ-BLD3-02-147',
			ownerEmail: 'testUser@cisco.com',
			ownerName: 'Test User',
			priority: '3',
			rmaNumber: '88346234, 88346235',
			serialNumber: 'FOX1306GFKH',
			status: 'Customer Pending',
			summary: 'Router not working',
			trackingNumber: '',
		},
	],
	numberOfElements: 1,
	totalElements: 1,
};

/** Mock data for CSOne Case Create Success */
const caseCreatedResponse = {
	caseNumber: '686351315',
	created: '2019-07-22T17:57:44.929Z',
	timestamp: 1563818265222,
};

/** The scenarios */
export const CaseScenarios = [
	// Valid Case Details
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Case Details',
					response: {
						body: caseDetailsResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/07e418ac71284560944ea92f653a01c2/details/688296392`,
		usecases: ['Use Case 1'],
	},
	// Valid Case Notes
	{
		scenarios: {
			GET: [
				{
					delay: 150,
					description: 'Case Notes',
					response: {
						body: caseNotesResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/07e418ac71284560944ea92f653a01c2/notes/688296392`,
		usecases: ['Use Case 1'],
	},
	// Valid Case Summary
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Case Summary',
					response: {
						body: caseSummaryResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/07e418ac71284560944ea92f653a01c2/details?statusTypes=O,C&pageSize=1&page=1&sortBy=caseNumber&sortOrder=ASC&caseNumbers=688296392`,
		usecases: ['Use Case 1'],
	},
	// Valid Case Details with no Description
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Case Details',
					response: {
						body: caseDetailsResponseAlt,
						status: 200,
					},
					selected: true,
				},
			],
		},
		usecases: ['Use Case 1'],
	},
	// Valid Case List - Page 1
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Case List',
					response: {
						body: caseListResponse1,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/07e418ac71284560944ea92f653a01c2/details?statusTypes=O&pageSize=4&page=1&sortBy=lastModifiedDate&sortOrder=DESC&caseNumbers=`,
		usecases: ['Use Case 1'],
	},
	// Valid Case List - Page 2
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Case List',
					response: {
						body: caseListResponse2,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/07e418ac71284560944ea92f653a01c2/details?statusTypes=O&pageSize=4&page=2&sortBy=lastModifiedDate&sortOrder=DESC&caseNumbers=`,
		usecases: ['Use Case 1'],
	},
	// Valid Case List - For single case
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Case List',
					response: {
						body: caseListResponseSingle,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/07e418ac71284560944ea92f653a01c2/details?statusTypes=O&pageSize=4&page=1&sortBy=lastModifiedDate&sortOrder=DESC&caseNumbers=688296392`,
		usecases: ['Use Case 1'],
	},
	// Open cases for an asset (used by asset 360)
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Cases for SN FOC1544Y16T',
					response: {
						body: caseListResponse1,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/07e418ac71284560944ea92f653a01c2/details?statusTypes=O&pageSize=20&page=1&sortBy=lastModifiedDate&sortOrder=DESC&serialNumbers=FOC1544Y16T`,
		usecases: ['Use Case 1'],
	},
	// Case list used by problem resolution
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Cases for SN FOC1544Y16T',
					response: {
						body: caseListResponse1,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/07e418ac71284560944ea92f653a01c2/details?statusTypes=O&pageSize=20&page=1&sortBy=lastModifiedDate&sortOrder=DESC&serialNumbers=FOC1544Y16T`,
		usecases: ['Use Case 1'],
	},
	// Create a Case
	{
		scenarios: {
			POST: [
				{
					delay: 200,
					description: 'Cases Create Response',
					response: {
						body: caseCreatedResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/07e418ac71284560944ea92f653a01c2`,
		usecases: ['Use Case 1'],
	},
];
