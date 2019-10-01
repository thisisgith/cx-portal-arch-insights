/** This is an api url  */
const api = '/api/customerportal/archinsights/v1';

/**
 * Customer Id for mock response
 */
const customerId = 2431199;

/** This is a mock data for CBP Rules Count - bar graph  */
const getCBPRulesCount = {
	High: 21,
	Low: 97,
	Medium: 87,
	TotalCounts: 205,
};

/** This is a mock data for getAssetsExceptionsCount  */
const getAssetsExceptionsCount = {
	TotalCounts: 7,
};

/**
 * CBP Rules list
 */

const listAllCBPRules = {
	BPRulesDetails: [
		{
			bpRuleId: 7684,
			bpRuleSummary: 'To enable the sending of Integrated Services Digital Network (ISDN)',
			bpRuleTitle: 'ISDN SNMP Traps Not Enabled',
			collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
			correctiveActions: 'Enable the ISDN SNMP traps with the command  in the global',
			customerId: 9482521,
			description: 'To enable the sending of Integrated Services Digital Network',
			deviceIpsWithExceptions: '172.16.44.24;172.16.44.27;172.16.44.19;',
			exceptions: 'IOS_snmp_server_enable_traps_isdn',
			recommendations: 'SNMP traps are vital for effective network management.',
			severity: 'Low',
			softwareType: 'IOS',
			technology: '*Network Management',
		},
		{
			bpRuleId: 7565,
			bpRuleSummary: 'The device(s) running Appletalk features should not be upgraded beyond',
			bpRuleTitle: 'AppleTalk support discontinued after Cisco IOS 12.4(24)T',
			collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
			correctiveActions: 'When Cisco IOS software is upgraded for this device',
			customerId: 9482521,
			description: 'The devices running Appletalk features should not be upgraded beyond.',
			deviceIpsWithExceptions: '172.16.44.24;172.16.44.27;172.16.44.19;',
			exceptions: 'IOS_AppleTalk_Deprecated_124T',
			recommendations: 'This exception is to facilitate a software planning discussion',
			severity: 'Low',
			softwareType: 'IOS',
			technology: '*Additional & Legacy Protocols',
		 },
	],
	CollectionDate: '2019-09-21T00:46:42.544+0000',
	High: 21,
	Low: 97,
	Medium: 87,
	TotalCounts: 2,
};

/**
 * list all assets with exceptions
 */

const listAllAssets = {
	AssetsExceptionDetails: [
		{
		   collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
		   customerId: '9482521',
		   hostName: 'C2951',
		   ipAddress: '172.16.44.17',
		   lastUpdateDate: '2019-09-21T00:30:32',
		   managedNeId: 'NA,FTX1441AJ65,CISCO2951/K9,NA',
		   neInstanceId: 'NA,FTX1441AJ65,CISCO2951/K9,NA',
		   neName: 'C2951',
		   productFamily: 'Cisco 2900 Series Integrated Services Routers',
		   productId: 'CISCO2951/K9',
		   productType: 'Routers',
		   ruleIdWithExceptions: '8376;8377;8374;',
		   serialNumber: 'FTX1441AJ65',
		   softwareType: 'IOS',
		   softwareVersion: '15.3(3)M3',
		},
		{
		   collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
		   customerId: '9482521',
		   hostName: 'C3750G-12S',
		   ipAddress: '172.16.44.28',
		   lastUpdateDate: '2019-09-21T00:30:34',
		   managedNeId: 'NA,CAT1042RG17,WS-C3750G-12S-E,NA',
		   neInstanceId: 'NA,CAT1042RG17,WS-C3750G-12S-E,NA',
		   neName: 'C3750G-12S',
		   productFamily: 'Cisco Catalyst 3750 Series Switches',
		   productId: 'WS-C3750G-12S-E',
		   productType: 'LAN Switches',
		   ruleIdWithExceptions: '8376;8377;8374;',
		   serialNumber: 'CAT1042RG17',
		   softwareType: 'IOS',
		   softwareVersion: '12.2(55)SE9',
		},
	],
	CollectionDate: '2019-09-21T00:46:42.544+0000',
  	TotalCounts: 2,
};
/**
 * list Exception Device Details
 */
const listExceptionsDeviceDetails =  [
	{
		   collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
		   customerId: '9482521',
		   hostName: 'C2951',
		   ipAddress: '172.16.44.17',
		   lastUpdateDate: '2019-09-21T00:30:32',
		   managedNeId: 'NA,FTX1441AJ65,CISCO2951/K9,NA',
		   neInstanceId: 'NA,FTX1441AJ65,CISCO2951/K9,NA',
		   neName: 'C2951',
		   productFamily: 'Cisco 2900 Series Integrated Services Routers',
		   productId: 'CISCO2951/K9',
		   productType: 'Routers',
		   ruleIdWithExceptions: '8376;8377;8374;7684;7287;7565;7685;7687;7324;8372',
		   serialNumber: 'FTX1441AJ65',
		   softwareType: 'IOS',
		   softwareVersion: '15.3(3)M3',
	},
	{
		   collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
		   customerId: '9482521',
		   hostName: 'C3750G-12S',
		   ipAddress: '172.16.44.28',
		   lastUpdateDate: '2019-09-21T00:30:34',
		   managedNeId: 'NA,CAT1042RG17,WS-C3750G-12S-E,NA',
		   neInstanceId: 'NA,CAT1042RG17,WS-C3750G-12S-E,NA',
		   neName: 'C3750G-12S',
		   productFamily: 'Cisco Catalyst 3750 Series Switches',
		   productId: 'WS-C3750G-12S-E',
		   productType: 'LAN Switches',
		   ruleIdWithExceptions: '8376;8377;8374;7684;7287;7565;7687;7324;8372;8371;9581',
		   serialNumber: 'CAT1042RG17',
		   softwareType: 'IOS',
		   softwareVersion: '12.2(55)SE9',
	},
	{
		collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
		customerId: '9482521',
		hostName: 'C3750G-12S',
		ipAddress: '172.16.44.28',
		lastUpdateDate: '2019-09-21T00:30:34',
		managedNeId: 'NA,CAT1042RG17,WS-C3750G-12S-E,NA',
		neInstanceId: 'NA,CAT1042RG17,WS-C3750G-12S-E,NA',
		neName: 'C3750G-12S',
		productFamily: 'Cisco Catalyst 3750 Series Switches',
		productId: 'WS-C3750G-12S-E',
		productType: 'LAN Switches',
		ruleIdWithExceptions: '8376;8377;8374;7684;7287;7565;7687;7324;8372;8371;9581',
		serialNumber: 'CAT1042RG17',
		softwareType: 'IOS',
		softwareVersion: '12.2(55)SE9',
	 },
	 {
		collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
		customerId: '9482521',
		hostName: 'C3750G-12S',
		ipAddress: '172.16.44.28',
		lastUpdateDate: '2019-09-21T00:30:34',
		managedNeId: 'NA,CAT1042RG17,WS-C3750G-12S-E,NA',
		neInstanceId: 'NA,CAT1042RG17,WS-C3750G-12S-E,NA',
		neName: 'C3750G-12S',
		productFamily: 'Cisco Catalyst 3750 Series Switches',
		productId: 'WS-C3750G-12S-E',
		productType: 'LAN Switches',
		ruleIdWithExceptions: '8376;8377;8374;7684;7287;7565;7687;7324;8372;8371;9581',
		serialNumber: 'CAT1042RG17',
		softwareType: 'IOS',
		softwareVersion: '12.2(55)SE9',
	 },
];
/**
 * list CBP Exception Details
 */
const listCBPExceptionDetails = [
	{
		bpRuleId: '8376',
		bpRuleSummary: 'On the Cisco 12000 platform there is a feature that enhances the',
		bpRuleTitle: 'Receive acl not configured on Cisco 12000',
		collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
		correctiveActions: 'ip receive access-list [acl-number] ! access-list [acl-number 1-199]',
		customerId: '9482521',
		description: 'On the Cisco 12000 platform there is a feature that enhances the protection',
		deviceIpsWithExceptions: '172.16.44.24; 172.16.44.27; 172.16.44.19;',
		exceptions: 'ip_receive_access-list_GSR',
		recommendations: 'The receive access-list feature is a very powerful feature,',
		severity: 'Medium',
		softwareType: 'IOS',
		technology: '*Security and VPN',
	},
	{
		bpRuleId: '8377',
		bpRuleSummary: 'Traps need to be sent to an SNMP trap server. In order to send',
		bpRuleTitle: 'SNMP traps not enabled',
		collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
		correctiveActions: '\'snmp-server enable traps\'\n\'snmp-server host <ip>\'',
		customerId: '9482521',
		description: 'Traps need to be sent to an SNMP trap server. In order to send',
		deviceIpsWithExceptions: '172.16.44.24;172.16.44.27;172.16.44.19;',
		exceptions: 'SNMP_Traps_IOS-v2',
		recommendations: 'Enable desired SNMP traps and configure at least two trap receivers.',
		severity: 'Low',
		softwareType: 'IOS',
		technology: '*Network Management',
	},
	{
		bpRuleId: '8374',
		bpRuleSummary: 'Source routing is a feature of IP whereby individual packets can specify',
		bpRuleTitle: 'IP Source Routing enabled',
		collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
		correctiveActions: 'no ip source-route',
		customerId: '9482521',
		description: 'IP source routing allows the end host to specify its own path through',
		deviceIpsWithExceptions: '172.16.44.24;172.16.44.27;172.16.44.19;',
		exceptions: 'IP_Source_Routing_Disabled-v2',
		recommendations: 'Unless a network depends on source routing, it should be disabled.',
		severity: 'Low',
		softwareType: 'IOS',
		technology: '*Security and VPN',
	},
	{
		bpRuleId: '8374',
		bpRuleSummary: 'Source routing is a feature of IP whereby individual packets can specify',
		bpRuleTitle: 'IP Source Routing enabled',
		collectionId: '6e252e67-3548-4e7d-b827-121f696bfc45',
		correctiveActions: 'no ip source-route',
		customerId: '9482521',
		description: 'IP source routing allows the end host to specify its own path through',
		deviceIpsWithExceptions: '172.16.44.24;172.16.44.27;172.16.44.19;',
		exceptions: 'IP_Source_Routing_Disabled-v2',
		recommendations: 'Unless a network depends on source routing, it should be disabled.',
		severity: 'Low',
		softwareType: 'IOS',
		technology: '*Security and VPN',
	},
];

/** The Scenarios */
export const ArchitectureScenarios = [
	// Valid Case Details
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Get Count Of Assets with Exceptions',
					response: {
						body: getAssetsExceptionsCount,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/assets/exceptions/count?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Get Count Of CBP Rules',
					response: {
						body: getCBPRulesCount,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/cbprules/count?customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'list All CBP Rules',
					response: {
						body: listAllCBPRules,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/cbprules?page=0&pageSize=10&severity=&customerId=${customerId}&searchText=`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'List All the Assets',
					response: {
						body: listAllAssets,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/assets/exceptions?page=0&pageSize=10&customerId=${customerId}&searchText=`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'List All the Device details',
					response: {
						body: listExceptionsDeviceDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/assets/exceptions/devicedetails?page=0&pageSize=10&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'List All CBP Device details',
					response: {
						body: listCBPExceptionDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/cbprules/exceptiondetails?page=0&pageSize=10&customerId=${customerId}`,
		usecases: ['Use Case 1'],
	},
];
