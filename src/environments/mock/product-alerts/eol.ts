import {
	HardwareEOLResponseObjectDetails,
	HardwareEOLBulletinResponseObjectDetails,
} from '@cui-x/sdp-api';

/** Base of URL for SDP API */
const api = '/api/customerportal/v1/product-alerts/';

/** Default Customer ID */
const customerId = '2431199';
/** Default network ID */
const managedNeId = 'NA,FOC1544Y16T,WS-C2960S-24PS-L,NA';

/** The mock response for GET hardware eol */
const mockHardwareEOLResponse: HardwareEOLResponseObjectDetails = {
	data: [
		  {
			customerId,
			managedNeId,
			bulletinName: 'string',
			equipmentType: 'string',
			hwEolInstanceId: 0,
			hwInstanceId: 'string',
			neInstanceId: 'string',
			productId: 'string',
		  },
	],
};

/** The mock response for GET hardware eol bulletin */
const mockHardwareEOLBulletinsResponse: HardwareEOLBulletinResponseObjectDetails = {
	data: [
		{
			bulletinFirstPublished: '2019-07-02T12:29:16.672Z',
			bulletinNumber: 'string',
			bulletinProductId: 'string',
			bulletinTitle: 'string',
			eoBuEngineeringSupportTacDate: '2019-07-02T12:29:16.672Z',
			eoLifeExternalAnnouncementDate: '2019-07-02T12:29:16.672Z',
			eoLifeInternalAnnouncementDate: '2019-07-02T12:29:16.672Z',
			eoNewServiceAttachmentDate: '2019-07-02T12:29:16.672Z',
			eoRoutineFailureAnalysisDate: '2019-07-02T12:29:16.672Z',
			eoSaleDate: '2019-07-02T12:29:16.672Z',
			eoServiceContractRenewalDate: '2019-07-02T12:29:16.672Z',
			eoSignatureReleasesDate: '2019-07-02T12:29:16.672Z',
			eoSoftwareAvailabilityDate: '2019-07-02T12:29:16.672Z',
			eoSoftwareLicenseAvailabilityDate: '2019-07-02T12:29:16.672Z',
			eoSwMaintenanceReleasesDate: '2019-07-02T12:29:16.672Z',
			eoVulnerabilitySecuritySupport: '2019-07-02T12:29:16.672Z',
			hwEolInstanceId: 0,
			internalAnnouncementDate: '2019-07-02T12:29:16.672Z',
			lastDateOfSupport: '2019-07-02T12:29:16.672Z',
			lastShipDate: '2019-07-02T12:29:16.672Z',
			migrationPid: 'string',
			migrationProductDataUrl: 'string',
			migrationProductModel: 'string',
			migrationProductPageUrl: 'string',
			migrationProductSeries: 'string',
			migrationPromotionText: 'string',
			milestoneInfo: [
				{
					  currentHwEolMilestone: 'string',
					  currentHwEolMilestoneDate: '2019-07-02T12:29:16.672Z',
					  nextHwEolMilestone: 'string',
					  nextHwEolMilestoneDate: '2019-07-02T12:29:16.672Z',
				},
			],
			URL: 'string',
		},
	],
};

/** The scenarios */
export const EOLScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Hardware EOL',
					response: {
						body: mockHardwareEOLResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}hardware-eol?customerId=${customerId}&managedNeId=${managedNeId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Hardware EOL Bulletins',
					response: {
						body: mockHardwareEOLBulletinsResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}hardware-eol-bulletins?hwEolInstanceId=0`,
		usecases: ['Use Case 1'],
	},
];
