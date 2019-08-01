import { defaults } from '../../defaults';
// tslint:disable-next-line:completed-docs
const clientId = defaults.csone.clientId;
// tslint:disable-next-line:completed-docs
const caseDetailNum = '688296392';

/** Base of URL for CSOne Case API */
const api = '/ws/cases/v3/proxy';

/** Mock data for valid CSOne Case Details API results */
const caseDetailsResponse = {
	caseNumber: `${caseDetailNum}`,
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
	caseNumber: `${caseDetailNum}`,
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
		noteDetail: 'worked with customer to collect debug, reviewing log now',
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

/** Mock data for valid CSOne Case List API results - Page 1 (assuming size per page is 4) */
const caseListResponse1 = {
	content: [
		{
			bugId: '',
			caseAccepted: false,
			caseNumber: `${caseDetailNum}`,
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

/** Mock data for valid CSOne Case List API results - Page 2 (assuming size per page is 4) */
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
			caseNumber: `${caseDetailNum}`,
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

/** Mock data for case files data */
const caseFilesResponse = {
	getBrokerResponse: {
		responseHeader: {
			responseCode: 0,
			responseDesc: 'success',
		},
		downloadInfo: {
			noOfFiles: 12,
			token: '7eaac568c5b4cd6569b6cfa21511ffd5',
			keyInfo: {
				initializationVector: '87F88BA7047FF720D12CF6F1F5A51978',
				decryptKeyChecksum: '1490160048',
				decryptionKey: 'EA96C18746F4EFF27CCB06B11527F2A0',
			},
			ebResponse: true,
			fileDetail: [
				{
					downloadURL: 'https://storageconnect-prd.cisco.com/Hi5Cloud/ContentManagement/downloadFile/bMWI9u8G5s2EsPWhIuLbr9NSLvAi/TAC._SCM._bXNhbmd3YW4%3D/686715483/Screen+Shot+2019-05-08+at+10.36.20.jpg',
					storageParam: [
						{
							paramValue: 'bMWI9u8G5s2EsPWhIuLbr9NSLvAi',
							paramKey: 'DownloadToken',
						},
						{
							paramValue: '686715483/Screen Shot 2019-05-08 at 10.36.20.jpg',
							paramKey: 'destFolderPath',
						},
					],
					userInfo: {
						userName: 'Joseph Kipping',
						userEmail: 'jkipp@cisco.com',
					},
					fileInfo: {
						fileSize: 68420,
						fileId: 316677274,
						visibilityFlag: 'E',
						fileContentType: 'image/jpeg',
						fileStatus: 'COMPLETED',
						fileName: 'New Screen Shot 2019-05-08 at 10.36.20.jpg',
						fileCategory: 'Web Uploaded',
						fileUploadDate: '11 May 2019 05:00 GMT',
					},
					downloadHost: 'storageconnect-prd.cisco.com',
				},
				{
					downloadURL: 'https://storageconnect-prd.cisco.com/Hi5Cloud/ContentManagement/downloadFile/bMWI9u8G5s2EsPWhIuLbr9NSLvAi/TAC._SCM._bXNhbmd3YW4%3D/686715483/Screen+Shot+2019-05-10+at+13.06.01.jpg',
					storageParam: [
						{
							paramValue: 'bMWI9u8G5s2EsPWhIuLbr9NSLvAi',
							paramKey: 'DownloadToken',
						},
						{
							paramValue: '686715483/Screen Shot 2019-05-10 at 13.06.01.jpg',
							paramKey: 'destFolderPath',
						},
					],
					userInfo: {
						userName: 'Joseph Kipping',
						userEmail: 'jkipp@cisco.com',
					},
					fileInfo: {
						fileSize: 103468,
						fileId: 316677275,
						visibilityFlag: 'E',
						fileContentType: 'image/jpeg',
						fileStatus: 'COMPLETED',
						fileName: '2019-05-10 at 13.06.01.jpg',
						fileCategory: 'Web Uploaded',
						fileUploadDate: '11 May 2019 05:00 GMT',
					},
					downloadHost: 'storageconnect-prd.cisco.com',
				},
				{
					downloadURL: 'https://storageconnect-prd.cisco.com/Hi5Cloud/ContentManagement/downloadFile/bMWI9u8G5s2EsPWhIuLbr9NSLvAi/TAC._SCM._bXNhbmd3YW4%3D/686715483/Screen+Shot+2019-05-06+at+13.51.35.jpg',
					storageParam: [
						{
							oparamValue: 'bMWI9u8G5s2EsPWhIuLbr9NSLvAi',
							oparamKey: 'DownloadToken',
						},
						{
							oparamValue: '686715483/Screen Shot 2019-05-06 at 13.51.35.jpg',
							oparamKey: 'destFolderPath',
						},
					],
					userInfo: {
						userName: 'Joseph Kipping',
						userEmail: 'jkipp@cisco.com',
					},
					fileInfo: {
						fileSize: 114988,
						fileId: 316675703,
						visibilityFlag: 'E',
						fileContentType: 'image/jpeg',
						fileStatus: 'COMPLETED',
						fileName: 'Screen Shot 2019-05-06 at 13.51.35.jpg',
						fileCategory: 'Web Uploaded',
						fileUploadDate: '11 May 2019 05:00 GMT',
					},
					downloadHost: 'storageconnect-prd.cisco.com',
				},
				{
					downloadURL: 'https://storageconnect-prd.cisco.com/Hi5Cloud/ContentManagement/downloadFile/bMWI9u8G5s2EsPWhIuLbr9NSLvAi/TAC._SCM._bXNhbmd3YW4%3D/686715483/Screen+Shot+2019-05-08+at+10.27.43.jpg',
					storageParam: [
						{
							paramValue: 'bMWI9u8G5s2EsPWhIuLbr9NSLvAi',
							paramKey: 'DownloadToken',
						},
						{
							paramValue: '686715483/Screen Shot 2019-05-08 at 10.27.43.jpg',
							paramKey: 'destFolderPath',
						},
					],
					userInfo: {
						userName: 'Joseph Kipping',
						userEmail: 'jkipp@cisco.com',
					},
					fileInfo: {
						fileSize: 414129,
						fileId: 316675705,
						visibilityFlag: 'E',
						fileContentType: 'image/jpeg',
						fileStatus: 'COMPLETED',
						fileName: 'Screen Shot 2019-05-08 at 10.27.43.jpg',
						fileCategory: 'Web Uploaded',
						fileUploadDate: '11 May 2019 05:00 GMT',
					},
					downloadHost: 'storageconnect-prd.cisco.com',
				},
				{
					downloadURL: 'https://storageconnect-prd.cisco.com/Hi5Cloud/ContentManagement/downloadFile/bMWI9u8G5s2EsPWhIuLbr9NSLvAi/TAC._SCM._bXNhbmd3YW4%3D/686715483/Screen+Shot+2019-05-07+at+08.30.15.jpg',
					storageParam: [
						{
							paramValue: 'bMWI9u8G5s2EsPWhIuLbr9NSLvAi',
							paramKey: 'DownloadToken',
						},
						{
							paramValue: '686715483/Screen Shot 2019-05-07 at 08.30.15.jpg',
							paramKey: 'destFolderPath',
						},
					],
					userInfo: {
						userName: 'Joseph Kipping',
						userEmail: 'jkipp@cisco.com',
					},
					fileInfo: {
						fileSize: 959375,
						fileId: 316675706,
						visibilityFlag: 'E',
						fileContentType: 'image/jpeg',
						fileStatus: 'COMPLETED',
						fileName: 'Screen Shot 2019-05-07 at 08.30.15.jpg',
						fileCategory: 'Web Uploaded',
						fileUploadDate: '11 May 2019 05:00 GMT',
					},
					downloadHost: 'storageconnect-prd.cisco.com',
				},
				{
					downloadURL: 'https://storageconnect-prd.cisco.com/Hi5Cloud/ContentManagement/downloadFile/bMWI9u8G5s2EsPWhIuLbr9NSLvAi/TAC._SCM._bXNhbmd3YW4%3D/686715483/Screen+Shot+2019-05-08+at+10.03.49.jpg',
					storageParam: [
						{
							paramValue: 'bMWI9u8G5s2EsPWhIuLbr9NSLvAi',
							paramKey: 'DownloadToken',
						},
						{
							paramValue: '686715483/Screen Shot 2019-05-08 at 10.03.49.jpg',
							paramKey: 'destFolderPath',
						},
					],
					userInfo: {
						userName: 'Joseph Kipping',
						userEmail: 'jkipp@cisco.com',
					},
					fileInfo: {
						fileSize: 1108522,
						fileId: 316677276,
						visibilityFlag: 'E',
						fileContentType: 'image/jpeg',
						fileStatus: 'COMPLETED',
						fileName: 'Screen Shot 2019-05-08 at 10.03.49.jpg',
						fileCategory: 'Web Uploaded',
						fileUploadDate: '11 May 2019 05:00 GMT',
					},
					downloadHost: 'storageconnect-prd.cisco.com',
				},
				{
					downloadURL: 'https://storageconnect-prd.cisco.com/Hi5Cloud/ContentManagement/downloadFile/bMWI9u8G5s2EsPWhIuLbr9NSLvAi/TAC._SCM._bXNhbmd3YW4%3D/686715483/good-jkipp-cfu2.1-upload-download-1.tar',
					storageParam: [
						{
							paramValue: 'bMWI9u8G5s2EsPWhIuLbr9NSLvAi',
							paramKey: 'DownloadToken',
						},
						{
							paramValue: '686715483/good-jkipp-cfu2.1-upload-download-1.tar',
							paramKey: 'destFolderPath',
						},
					],
					userInfo: {
						userName: 'Joseph Kipping',
						userEmail: 'jkipp@cisco.com',
					},
					fileInfo: {
						fileSize: 95150080,
						fileId: 316675708,
						visibilityFlag: 'E',
						fileContentType: 'application/x-tar',
						fileStatus: 'COMPLETED',
						fileName: 'good-jkipp-cfu2.1-upload-download-1.tar',
						fileCategory: 'Web Uploaded',
						fileUploadDate: '11 May 2019 05:03 GMT',
					},
					downloadHost: 'storageconnect-prd.cisco.com',
				},
				{
					downloadURL: 'https://storageconnect-prd.cisco.com/Hi5Cloud/ContentManagement/downloadFile/bMWI9u8G5s2EsPWhIuLbr9NSLvAi/TAC._SCM._bXNhbmd3YW4%3D/686715483/Screenshot+2019-05-14+at+14.53.11.png',
					storageParam: [
						{
							paramValue: 'bMWI9u8G5s2EsPWhIuLbr9NSLvAi',
							paramKey: 'DownloadToken',
						},
						{
							paramValue: '686715483/Screenshot 2019-05-14 at 14.53.11.png',
							paramKey: 'destFolderPath',
						},
					],
					userInfo: {
						userName: 'Sharanabasayya Hiremath',
						userEmail: 'shahirem@cisco.com',
					},
					fileInfo: {
						fileSize: 120860,
						fileId: 317190745,
						visibilityFlag: 'E',
						fileContentType: 'image/png',
						fileStatus: 'COMPLETED',
						fileName: 'Screenshot 2019-05-14 at 14.53.11.png',
						fileCategory: 'Web Uploaded',
						fileUploadDate: '15 May 2019 06:14 GMT',
					},
					downloadHost: 'storageconnect-prd.cisco.com',
				},
				{
					downloadURL: 'https://storageconnect-prd.cisco.com/Hi5Cloud/ContentManagement/downloadFile/bMWI9u8G5s2EsPWhIuLbr9NSLvAi/TAC._SCM._bXNhbmd3YW4%3D/686715483/Screen+Shot+2019-06-24+at+12.55.19.jpg',
					storageParam: [
						{
							paramValue: 'bMWI9u8G5s2EsPWhIuLbr9NSLvAi',
							paramKey: 'DownloadToken',
						},
						{
							paramValue: '686715483/Screen Shot 2019-06-24 at 12.55.19.jpg',
							paramKey: 'destFolderPath',
						},
					],
					userInfo: {
						userName: 'Joseph Kipping',
						userEmail: 'jkipp@cisco.com',
					},
					fileInfo: {
						fileSize: 1140911,
						fileId: 323064730,
						visibilityFlag: 'E',
						fileContentType: 'image/jpeg',
						fileStatus: 'COMPLETED',
						fileName: 'Screen Shot 2019-06-24 at 12.55.19.jpg',
						fileCategory: 'Web Uploaded',
						fileUploadDate: '24 Jun 2019 20:13 GMT',
					},
					downloadHost: 'storageconnect-prd.cisco.com',
				},
			],
		},
		xmlns: 'http://www.cisco.com/ts/csc/FileBrokerModel',
	},
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
		url: `${api}/${clientId}/details/${caseDetailNum}`,
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
		url: `${api}/${clientId}/notes/${caseDetailNum}`,
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
		url: `${api}/${clientId}/details?statusTypes=O,C&pageSize=1&page=1&sortBy=caseNumber&sortOrder=ASC&caseNumbers=${caseDetailNum}`,
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
					description: 'Case List p1',
					response: {
						body: caseListResponse1,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/${clientId}/details?statusTypes=O&pageSize=10&page=1&sortBy=lastModifiedDate&sortOrder=DESC&caseNumbers=`,
		usecases: ['Use Case 1'],
	},
	// Valid Case List - Page 2
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Case List p2',
					response: {
						body: caseListResponse2,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/${clientId}/details?statusTypes=O&pageSize=10&page=2&sortBy=lastModifiedDate&sortOrder=DESC&caseNumbers=`,
		usecases: ['Use Case 1'],
	},
	// Valid Case List - For single case
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Case List single',
					response: {
						body: caseListResponseSingle,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/${clientId}/details?statusTypes=O&pageSize=10&page=1&sortBy=lastModifiedDate&sortOrder=DESC&caseNumbers=${caseDetailNum}`,
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
		url: `${api}/${clientId}/details?statusTypes=O&pageSize=20&page=1&sortBy=lastModifiedDate&sortOrder=DESC&serialNumbers=FOC1544Y16T`,
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
		url: `${api}/${clientId}/details?statusTypes=O&pageSize=20&page=1&sortBy=lastModifiedDate&sortOrder=DESC&serialNumbers=FOC1544Y16T`,
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
		url: `${api}/${clientId}`,
		usecases: ['Use Case 1'],
	},
	// cases download files
	{
		scenarios: {
			GET: [
				{
					delay: 200,
					description: 'Files for Case',
					response: {
						body: caseFilesResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/453b7e10f08b428c90d48432312889ad/casefiles`,
		usecases: ['Use Case 1'],
	},
];
