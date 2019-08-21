import { SoftwareEOLBulletinResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/software-eol-bulletins';

/** The mock response for coverage counts */
export const MockSoftwareEOLBulletinsResponse: SoftwareEOLBulletinResponse = {
	/* tslint:disable */
	"data": [
		{
			"swEolInstanceId": 0,
			"bulletinNumber": "string",
			"bulletinTitle": "string",
			"URL": "string",
			"publishedDate": "2019-07-31T19:39:19.750Z",
			"eoLifeExternalAnnouncementDate": "2013-07-31T19:39:19.750Z",
			"eoLifeInternalAnnouncementDate": "2013-07-31T19:39:19.750Z",
			"eoSaleDate": "2013-09-31T19:39:19.750Z",
			"eoEngineeringDate": "2019-07-31T19:39:19.750Z",
			"eoLifeDate": "2019-07-31T19:39:19.750Z",
			"lastDateOfSupport": "2020-01-31T19:39:19.750Z",
			"lastShipDate": "2014-07-31T19:39:19.750Z",
			"eoNewServiceAttachmentDate": "2019-07-31T19:39:19.750Z",
			"eoRoutineFailureAnalysisDate": "2019-07-31T19:39:19.750Z",
			"eoSwMaintenanceReleasesDate": "2014-10-31T19:39:19.750Z",
			"eoBuEngineeringSupportTacDate": "2019-07-31T19:39:19.750Z",
			"eoServiceContractRenewalDate": "2019-07-31T19:39:19.750Z",
			"eoSignatureReleasesDate": "2019-07-31T19:39:19.750Z",
			"eoSoftwareAvailabilityDate": "2019-07-31T19:39:19.750Z",
			"eoSoftwareLicenseAvailabilityDate": "2019-07-31T19:39:19.750Z",
			"eoVulnerabilitySecuritySupport": "2015-05-31T19:39:19.750Z",
			"milestoneInfo": [
				{
					"currentHwEolMilestone": "string",
					"nextHwEolMilestone": "string",
					"currentHwEolMilestoneDate": "2019-07-31T19:39:19.750Z",
					"nextHwEolMilestoneDate": "2019-07-31T19:39:19.750Z"
				}
			]
		}
		
	]
	/* tslint:enable */
};

/** The software eol scenarios */
export const SoftwareEOLBulletinScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 350,
					description: 'Software EOL Bulletins',
					response: {
						body: MockSoftwareEOLBulletinsResponse,
						status: 200,
					},
					selected: true,
				},
				{
					delay: 0,
					description: 'Software EOL Bulletins - Unreachable',
					response: {
						body: { data: [] },
						status: 503,
					},
					selected: false,
				},
				{
					delay: 250,
					description: 'Software EOL Bulletins - Missing fields',
					response: {
						body: { data: [
							{ swEolInstanceId: 0, eoSaleDate: '2013-09-31T19:39:19.750Z' },
						] },
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}?swEolInstanceId=0`,
		usecases: ['Use Case 1'],
	},
];
