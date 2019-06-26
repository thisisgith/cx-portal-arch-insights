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
	rmaNumber: '88346234, 88346235',
	serialNumber: 'FOX1306GFKH',
	status: 'Customer Pending',
	summary: 'Router not working',
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
		url: `${api}/453b7e10f08b428c90d48432312889ad/details?statusTypes=O,C&pageSize=1&page=1&sortBy=caseNumber&sortOrder=ASC&caseNumbers=688296392`,
	},
];
