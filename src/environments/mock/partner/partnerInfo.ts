import { CompanyInfoList } from '@sdp-api';

/** Base of URL for SDP API */
const api = '/cxpp-partner-info/partnerInfo/v1/';

/** Default Customer ID */
const customerId = '2431199';

/** Mock getPartnerList response */
const PartnerList: CompanyInfoList = {
	companyList: [
		{
			companyName: 'CentrexIT',
			companyId: '293531',
		},
		{
			companyName: 'Logicallis',
			companyId: '293532',
		},
		{
			companyName: 'Proxios',
			companyId: '293533',
		},
		{
			companyName: 'Indiqube',
			companyId: '293534',
		},
		{
			companyName: 'PureStorage',
			companyId: '293535',
		},
		{
			companyName: 'RegentUniversity',
			companyId: '293536',
		},
		{
			companyName: 'Salesforce',
			companyId: '293537',
		},
	],
};

/**
 * The scenarios
 */
export const PartnerInfoScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: Math.floor(Math.random() * 2000) + 500,
					description: '(Lifecycle) PartnerInfoListUsingGET',
					response: {
						body: PartnerList,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}${customerId}/partners`,
		usecases: ['Use Case 1'],
	},
];
