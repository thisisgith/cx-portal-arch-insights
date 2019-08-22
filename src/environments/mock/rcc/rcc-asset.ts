/** getRccAssetFilterData params */
const assetFilterParams = `customerId=this.customerId&pageIndex=1&pageSize=10
&serialNumber=serialNumber&sortBy=asc&policyGroupName=&policyName=&severity=`;
/** The mock response for allCrashDetails */
const assetPolicyFilterInfo: any = {
	data: {
		customerid: '7293498',
		policygroupname: [
			'PCI',
			'HIPAA',
		],
		policyname: [
			'Terminal Access [ IOS-XE ]',
			'AAA Authentication - Login [ IOS-XE ]',
			'NTP Configuration [ IOS-XE ]',
			'Console Access [ IOS-XE ]',
			'AAA Accounting - Network [ IOS-XE ]',
		],
		rulehighseverity: [
			'P3',
			'P1',
			'P2',
			'P5',
		],
		serialnumber: 'FOC2246Z0MU',
	},
	message: 'SUCCESS',
	status: '200',
};
	/**
	 * const response decleration for table
	 */
const assetViolationSummaryTableData: any  = {
	data: {
		hostName: 'border_2.dnaauto.cisco.com',
		violation: [
			{
				conditionList: [
					{
						age: 0,
						conditionCount: 1,
						message: 'Exec timeout is not defined for <C2.1>',
						severity: 'P3',
						suggestedFix: '',
					},
				],
				policyDesc: 'This policy checks for various  of Cisco routers is ',
				policyGroup: 'HIPAA',
				policyGroupPolicyRuleId: 'HIPAA_IOS_XE_GROUP__Terminal_Access__IOSXE___',
				policyName: 'Terminal Access [ IOS-XE ]',
				ruleDesc: 'Each terminal line should be configured with some type of ',
				ruleSeverity: 'P3',
				violationCount: 1,
			}],
	},
	error: null,
	message: 'SUCCESS',
	status: '200',
};

	/**
	 * Scenariors for the api calls
	 */
export const RCCScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'AssetFilterSummary',
					response: {
						body: assetPolicyFilterInfo,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `https://violationaudit.sdp11-idev.csco.cloud/compliance/
		violationaudit/api/fetch-violation-details-filter/${assetFilterParams}`,
		usecases: ['Use Case 1'],
	}, {
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'AssetViolationSummary',
					response: {
						body: assetViolationSummaryTableData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `https://violationaudit.sdp11-idev.csco.cloud/compliance/violationaudit/
		getAssetSummaryData/${assetFilterParams}`,
		usecases: ['Use Case 2'],
	},
];
