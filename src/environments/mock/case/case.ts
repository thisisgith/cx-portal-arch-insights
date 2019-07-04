/** Base of URL for CSOne Case API */
const api = '/ws/cases/v3/proxy';

/** Params of URL for CSOne Case API- Part1 */
const apiParams1 = 'statusTypes=O,C&pageSize=1&page=1&sortBy=caseNumber';

/** Params of URL for CSOne Case API- Part2 */
const apiParams2 = '&sortOrder=ASC&caseNumbers=688296392';

/** Mock data for valid CSOne Case Summary API results */
const caseDetailsResponse = {
	statusCode: 'SUCCESS',
	responseOut: '2019-07-02T10:00:58.941Z',
	responseDetails: {
		caseDetail: {
			managerEmail: '',
			managerPhone: '', managerName: '',
			rmaCreatedDate: '',
			hwProductName: '',
			resolutionCode: '',
			currentContactName: 'Charlene Hall',
			caseType: 'TAC',
			surveyPreference: '',
			ownerGroupName: 'CRC-GLOBAL',
			ownerUserId: '',
			lastModifiedC3UserId: 'binte',
			partnerName: '',
			tag: '',
			parentContainerName: '',
			containerType: '',
			ciUUId: 'f2f7254a-7306-4a5e-9cfb-004d29f3e363',
			ccsUUId: '',
			interimContactEmail: '',
			interimContactName: '',
			customerActivity: 'Operate',
			scheduleResponseTz: '',
			problemOriginCountry: '',
			endCustomerEmail: '',
			communicationPreference: 'Email',
			subTechnologyId: '1572',
			trackingDate: '',
			serviceLineExpiryDate: '',
			productDescription: '',
			lastUpdateDate: '2019-06-25T10:29:36Z',
			contractType: '',
			partnerCaseOwnerUserId: '',
			ownerName: '',
			serialNumber: '',
			contractStatus: '',
			customerCompanyName: 'C3 TO BE ASSIGNED CPR COMPANY',
			serviceLineStatus: '',
			caseNotification: 'OFF',
			status: 'New',
			productId: '',
			bugId: '',
			contactMeTime: '',
			kacUUId: '',
			jbrUUId: 'U8SEAJ0YWGNPB5FPTCWC9GGEWI',
			closeFlag: 'false',
			billToId: '',
			recentChanges: '',
			scheduleResponseDate: '',
			summary: 'case toast',
			problemCode: 'INTEROP',
			contactMe: 'As soon as the Engineer is Available',
			problemCodeName: 'Interoperability',
			mobilePhone: '',
			caseOrigin: 'Web',
			swProductName: '',
			swProductId: '',
			hwProductId: '',
			crossLaunchSource: '',
			description: 'case toast',
			contactEmail: 'sss@cc.co.TS2SVC',
			rmaNumber: '',
			deviceName: 'SJ-Wireless-1920-D',
			technologyId: '10',
			lossOfServices: 'No',
			contactNotification: 'OFF',
			picaId: '',
			createdDate: '2019-06-25T10:29:34Z',
			partnerCaseOwnerGroupName: '',
			b2bFlag: 'false',
			partnerCaseNumber: '',
			partnerCaseOwnerName: '',
			closedDate: '',
			contactName: 'Charlene Hall',
			urgency: 'NONE',
			priority: '3',
			partnerCaseOwnerPhone: '',
			contractExpiryDate: '',
			contactId: 'charhall',
			trackingNumber: 'INC001923603',
			contactPhone: '+19195745321',
			contractId: '618642324',
			childContainerId: '',
			EFProductName: '',
			nmtgProductVersion: '',
			troubleshootingTime: '',
			caseNumber: '699158496',
			additionalEmail: 'svaanipe@ccc.com.TS2SVC',
			ownerEmail: '',
			softwareVersion: '15.3.3-JJ1(ED)',
			technologyName: 'Broadband Aggregation and DSL',
			requestType: 'Diagnose and Fix my Problem',
			troubleshootingDescription: '',
			subscriptionRefId: '',
			parentContainerId: '',
			discussionThreadId: '',
			partnerCaseOwnerEmail: '',
			ownerPhone: '',
			subTechnologyName: 'DSL Customer Premise Equipment (CPE) - IOS/IOS-XE',
		},
	},
	recordCount: 1,
	errorMessages: null,
	requestId: '4a102520-9cb0-11e9-afa9-005056bc2cda',
};

/** Mock data for valid CSOne Case Notes API results */
const caseNotesResponse = {
	responseDetails: {
		pageAttributes: { },
		notesList: [
			{
				partnerName: '',
				createdByID: 'binte',
				createdBy: 'BRE Integration User',
				noteDetail: 'This is a Routing Decision Note\nEPiC.',
				note: '',
				noteStatus: 'Internal',
				createdDate: '2019-05-24T07:01:40Z',
				noteType: 'ROUTING DECISION',
			},
			{
				partnerName: '',
				createdByID: 'charhall',
				createdBy: 'Charlene Hall',
				noteDetail: 'This is a case review note',
				note: 'Note Title for note T2',
				noteStatus: 'Internal',
				createdDate: '2019-05-24T05:36:00Z',
				noteType: 'Other',
			},
			{
				partnerName: '',
				createdByID: 'charhall',
				createdBy: 'Charlene Hall',
				noteDetail: 'Note Detail 1',
				note: 'Note Title 1',
				noteStatus: 'External',
				createdDate: '2019-05-24T05:36:00Z',
				noteType: 'Case Review',
			},
			{
				partnerName: '',
				createdByID: 'charhall',
				createdBy: 'Charlene Hall',
				noteDetail: 'Problem Occurred On: 2014-04-18 09:14:30',
				note: '',
				noteStatus: 'External',
				createdDate: '2019-05-24T05:35:58Z',
				noteType: 'INITIAL CUSTOMER TROUBLESHOOTING',
			},
			{
				partnerName: '',
				createdByID: 'charhall',
				createdBy: 'Charlene Hall',
				noteDetail: 'Technology: Voice-Communications Manager',
				note: '',
				noteStatus: 'External',
				createdDate: '2019-05-24T05:35:58Z',
				noteType: 'CUSTOMER SYMPTOM',
			},
		],
	},
};

/** Mock data for valid CSOne Case Summary API results */
const caseSummaryResponse = {
	content: [
		{
			caseOwner: 'Thomas Ortiz',
		},
	],
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
		url: `${api}/453b7e10f08b428c90d48432312889ad/details/688296392`,
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
		url: `${api}/453b7e10f08b428c90d48432312889ad/notes/688296392`,
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
		url: `${api}/453b7e10f08b428c90d48432312889ad/details?${apiParams1}${apiParams2}`,
		usecases: ['Use Case 1'],
	},
];
