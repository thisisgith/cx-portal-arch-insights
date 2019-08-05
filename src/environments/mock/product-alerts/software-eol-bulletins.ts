import { SoftwareEOLBulletinResponse } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/product-alerts/v1/software-eol-bulletins';

/** Default Customer ID */
const customerId = '2431199';

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
			"eoLifeExternalAnnouncementDate": "2019-07-31T19:39:19.750Z",
			"eoLifeInternalAnnouncementDate": "2019-07-31T19:39:19.750Z",
			"eoSaleDate": "2019-07-31T19:39:19.750Z",
			"eoEngineeringDate": "2019-07-31T19:39:19.750Z",
			"eoLifeDate": "2019-07-31T19:39:19.750Z",
			"lastDateOfSupport": "2019-07-31T19:39:19.750Z",
			"lastShipDate": "2019-07-31T19:39:19.750Z",
			"eoNewServiceAttachmentDate": "2019-07-31T19:39:19.750Z",
			"eoRoutineFailureAnalysisDate": "2019-07-31T19:39:19.750Z",
			"eoSwMaintenanceReleasesDate": "2019-07-31T19:39:19.750Z",
			"eoBuEngineeringSupportTacDate": "2019-07-31T19:39:19.750Z",
			"eoServiceContractRenewalDate": "2019-07-31T19:39:19.750Z",
			"eoSignatureReleasesDate": "2019-07-31T19:39:19.750Z",
			"eoSoftwareAvailabilityDate": "2019-07-31T19:39:19.750Z",
			"eoSoftwareLicenseAvailabilityDate": "2019-07-31T19:39:19.750Z",
			"eoVulnerabilitySecuritySupport": "2019-07-31T19:39:19.750Z",
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
			],
		},
		url: `${api}?swEolInstanceId=0`,
		usecases: ['Use Case 1'],
	},
];
