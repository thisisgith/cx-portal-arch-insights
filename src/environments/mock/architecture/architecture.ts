/** This is an api url  */
const api = '/cparchinsights';

/** This is a mock data for getAllCBPDeviceAffectedResponse  */

const getAllCBPDeviceAffectedResponse = [
	{
		bootstrapVersion: 'NA',
		collectorId: 'CSP0001039747',
		configAvailability: 'Available',
		configCollectionDate: '2012-06-19T14:15:33Z',
		configRegister: '0x2102',
		createDate: '2017-10-24T09:19:17Z',
		customerId: '167866829',
		featureSet: 'IP BASE, IP BASE W/O CRYPTO',
		hostname: 'TSPM-SJ-P1C1R11',
		imageName: 'C2800NM-IPBASE-M',
		inventoryAvailability: 'Inventory Availability',
		inventoryCollectionDate: '2017-04-08T04:22:45Z',
		inventoryName: 'SNTC_API_Test123',
		ipAddress: '172.21.34.94',
		isManagedNe: '1',
		lastConfigRegister: 'Last Config Register 0*2102',
		lastReset: '2012-01-20T22:38:03Z',
		macAddress: '00:06:28:d9:00:20',
		managedNeInstanceId: '7676767',
		managementAddress: '172.21.34.57',
		neInstanceId: '23493613',
		neSubtype: 'Child Device for ex:- Daughter Card in a Device',
		neType: 'APPLICATION',
		productFamily: 'Cisco Catalyst 4500 Series Switches',
		productId: 'WS-C4506-E',
		productType: 'LAN Switches',
		reachabilityStatus: 'REACHABLE',
		resetReason: 'power-on',
		ruleIdsWithExceptions: '8323;8324;8325;8326;8327;8328;8329;8330;8331;8332;8333;',
		swType: 'IOS',
		swVersion: '15.0(1)M4',
		sysContact: 'Mark Doering',
		sysDescr: 'Cisco IOS Software, IOS-XE Software, Catalyst 4500 L3 Switch Software',
		sysLocation: 'SJC-J/2',
		sysName: 'bocgrp-ipswich-596313-WAP-11',
		sysObjectId: '1.3.6.1.4.1.9.1.576',
	},
	{
		bootstrapVersion: 'NA',
		collectorId: 'CSP0001039747',
		configAvailability: 'Available',
		configCollectionDate: '2012-06-19T14:15:33Z',
		configRegister: '0x2102',
		createDate: '2017-10-24T09:19:17Z',
		customerId: '167866829',
		featureSet: 'IP BASE, IP BASE W/O CRYPTO',
		hostname: 'TSPM-SJ-P1C1R11',
		imageName: 'C2800NM-IPBASE-M',
		inventoryAvailability: 'Inventory Availability',
		inventoryCollectionDate: '2017-04-08T04:22:45Z',
		inventoryName: 'SNTC_API_Test123',
		ipAddress: '172.21.34.94',
		isManagedNe: '1',
		lastConfigRegister: 'Last Config Register 0*2102',
		lastReset: '2012-01-20T22:38:03Z',
		macAddress: '00:06:28:d9:00:20',
		managedNeInstanceId: '7676767',
		managementAddress: '172.21.34.57',
		neInstanceId: '23493620',
		neSubtype: 'Child Device for ex:- Daughter Card in a Device',
		neType: 'APPLICATION',
		productFamily: 'Cisco Catalyst 4500 Series Switches',
		productId: 'WS-C4506-E',
		productType: 'LAN Switches',
		reachabilityStatus: 'REACHABLE',
		resetReason: 'power-on',
		ruleIdsWithExceptions: '8391',
		swType: 'IOS',
		swVersion: '15.0(1)M4',
		sysContact: 'Mark Doering',
		sysDescr: 'Cisco IOS Software, IOS-XE Software, Catalyst 4500',
		sysLocation: 'SJC-J/2',
		sysName: 'bocgrp-ipswich-596313-WAP-11',
		sysObjectId: '1.3.6.1.4.1.9.1.576',
	},
];

/** This is a mock data for getAllCBPExceptionDetailsResponse  */
const getAllCBPExceptionDetailsResponse = [
	{
		bpPrimaryTechnologies: 'Network Management,Wireless',
		bpRecommendation: 'IOS switches should not be sending interface syslog',
		bpRuleId: '8331',
		bpRuleSummary: 'IGMP snooping is disabled by default on the Catalyst switches',
		bpRuleTitle: 'Interface level syslog events not disabled',
		bpSecondaryTechnology: 'null',
		bpSeverity: 'Low',
		correctiveAction: 'Re-enable IGMP snooping by configuring "ip igmp snooping" globally',
		customerId: '167866829',
		deviceIdsWithExceptions: '23493649;23493618;23493648;23493647;23493640;23493646',
		exceptions: 'exception1;exception2;exception3',
		uuid: '64836746289847',
	},
	{
		bpPrimaryTechnologies: 'Network Management,Wireless',
		bpRecommendation: 'IOS switches should not be sending interface',
		bpRuleId: '8333',
		bpRuleSummary: 'IGMP snooping is disabled by default on the Catalyst switches',
		bpRuleTitle: 'Interface level syslog events not disabled',
		bpSecondaryTechnology: 'null',
		bpSeverity: 'Low',
		correctiveAction: 'Re-enable IGMP snooping by configuring "ip igmp snooping" globally',
		customerId: '167866829',
		deviceIdsWithExceptions: '23493649;23493618;23493648;23493647;23493640;23493646',
		exceptions: 'exception1;exception2;exception3',
		uuid: '64836746289847',
	},
];

// The Scenarios
/** This is a mock data for getAllAssetsWithExceptions  */
const getAllAssetsWithExceptions = {
	AssetsExceptionDetails: [
		{
			bootstrapVersion: 'NA',
			collectorId: 'CSP0001039747',
			configAvailability: 'Available',
			configCollectionDate: '2012-06-19T14:15:33Z',
			configRegister: '0x2102',
			createDate: '2017-10-24T09:19:17Z',
			customerId: '167866829',
			featureSet: 'IP BASE, IP BASE W/O CRYPTO',
			hostname: 'TSPM-SJ-P1C1R11',
			imageName: 'C2800NM-IPBASE-M',
			inventoryAvailability: 'Inventory Availability',
			inventoryCollectionDate: '2017-04-08T04:22:45Z',
			inventoryName: 'SNTC_API_Test123',
			ipAddress: '172.21.34.94',
			isManagedNe: '1',
			lastConfigRegister: 'Last Config Register 0*2102',
			lastReset: '2012-01-20T22:38:03Z',
			macAddress: '00:06:28:d9:00:20',
			managedNeInstanceId: '7676767',
			managementAddress: '172.21.34.57',
			neInstanceId: '23493613',
			neSubtype: 'Child Device for ex:- Daughter Card in a Device',
			neType: 'APPLICATION',
			productFamily: 'Cisco Catalyst 4500 Series Switches',
			productId: 'WS-C4506-E',
			productType: 'LAN Switches',
			reachabilityStatus: 'REACHABLE',
			resetReason: 'power-on',
			ruleIdsWithExceptions: '8323;8324;8325;8326;8327;8328;8329;8330;',
			swType: 'IOS',
			swVersion: '15.0(1)M4',
			sysContact: 'Mark Doering',
			sysDescr: 'Cisco IOS Software, IOS-XE Software, Catalyst 4500 L3 Switch Software',
			sysLocation: 'SJC-J/2',
			sysName: 'bocgrp-ipswich-596313-WAP-11',
			sysObjectId: '1.3.6.1.4.1.9.1.576',
		},
		{
			bootstrapVersion: 'NA',
			collectorId: 'CSP0001039747',
			configAvailability: 'Available',
			configCollectionDate: '2012-06-19T14:15:33Z',
			configRegister: '0x2102',
			createDate: '2017-10-24T09:19:17Z',
			customerId: '167866829',
			featureSet: 'IP BASE, IP BASE W/O CRYPTO',
			hostname: 'TSPM-SJ-P1C1R11',
			imageName: 'C2800NM-IPBASE-M',
			inventoryAvailability: 'Inventory Availability',
			inventoryCollectionDate: '2017-04-08T04:22:45Z',
			inventoryName: 'SNTC_API_Test123',
			ipAddress: '172.21.34.94',
			isManagedNe: '1',
			lastConfigRegister: 'Last Config Register 0*2102',
			lastReset: '2012-01-20T22:38:03Z',
			macAddress: '00:06:28:d9:00:20',
			managedNeInstanceId: '7676767',
			managementAddress: '172.21.34.57',
			neInstanceId: '23493620',
			neSubtype: 'Child Device for ex:- Daughter Card in a Device',
			neType: 'APPLICATION',
			productFamily: 'Cisco Catalyst 4500 Series Switches',
			productId: 'WS-C4506-E',
			productType: 'LAN Switches',
			reachabilityStatus: 'REACHABLE',
			resetReason: 'power-on',
			ruleIdsWithExceptions: '8391',
			swType: 'IOS',
			swVersion: '15.0(1)M4',
			sysContact: 'Mark Doering',
			sysDescr: 'Cisco IOS Software, IOS-XE Software, Catalyst 4500 L3 Switch Software',
			sysLocation: 'SJC-J/2',
			sysName: 'bocgrp-ipswich-596313-WAP-11',
			sysObjectId: '1.3.6.1.4.1.9.1.576',
		},
	],
	TotalCounts: 101,
};

/** This is a mock data for getExceptionsCount  */
const getExceptionsCount = {
	CBPRulesCount: 5000,
	HighRisk: 1243,
	MediumRisk: 1308,
};

/** This is a mock data for getAssetsExceptionsCount  */
const getAssetsExceptionsCount = {
	AssestsExceptionCount: 101,
};

/** This is a mock data for getAllCBPRulesDetails  */
const getAllCBPRulesDetails = {
	BPRulesDetails: [
		{
			bpPrimaryTechnologies: 'Network Management,Wireless',
			bpRecommendation: 'IOS switches should not be sending interface syslog',
			bpRuleId: '8325',
			bpRuleSummary: 'IGMP snooping is disabled by default on the Catalyst switches',
			bpRuleTitle: 'Interface level syslog events not disabled',
			bpSecondaryTechnology: 'null',
			bpSeverity: 'Low',
			correctiveAction: 'Re-enable IGMP snooping by configuring "ip igmp snooping" globally',
			customerId: '167866829',
			deviceIdsWithExceptions:
				'23493649;23493618;23493648;23493647;23493640;23493646',
			exceptions: 'exception1;exception2;exception3',
			uuid: '64836746289847',
		},
		{
			bpPrimaryTechnologies: 'Network Management,Wireless',
			bpRecommendation: 'IOS switches should not be sending interface syslog',
			bpRuleId: '8329',
			bpRuleSummary: 'IGMP snooping is disabled by default on the Catalyst switches',
			bpRuleTitle: 'Interface level syslog events not disabled',
			bpSecondaryTechnology: 'null',
			bpSeverity: 'Low',
			correctiveAction: 'Re-enable IGMP snooping by configuring "ip igmp snooping" globally',
			customerId: '167866829',
			deviceIdsWithExceptions:
				'23493649;23493618;23493648;23493647;23493640;23493646',
			exceptions: 'exception1;exception2;exception3',
			uuid: '64836746289847',
		},
	],
	High: '27',
	Info: '25',
	Low: '27',
	Medium: '23',
};

/** mock data of getCBPHighRiskData */
const getCBPHighRiskData = {
	BPRulesDetails: [
		{
			bpPrimaryTechnologies: 'Network Management,Wireless',
			bpRecommendation: 'IOS switches should not be sending interface syslog',
			bpRuleId: '8347',
			bpRuleSummary: 'IGMP snooping is disabled by default on the Catalyst switches',
			bpRuleTitle: 'Interface level syslog events not disabled',
			bpSecondaryTechnology: 'null',
			bpSeverity: 'Low',
			correctiveAction: 'Re-enable IGMP snooping by configuring "ip igmp snooping" globally',
			customerId: '167866829',
			deviceIdsWithExceptions:
				'23493649;23493618;23493648;23493647;23493640;23493646',
			exceptions: 'exception1;exception2;exception3',
			uuid: '64836746289847',
		},
		{
			bpPrimaryTechnologies: 'Network Management,Wireless',
			bpRecommendation: 'IOS switches should not be sending interface syslog',
			bpRuleId: '8381',
			bpRuleSummary: 'IGMP snooping is disabled by default on the Catalyst switches',
			bpRuleTitle: 'Interface level syslog events not disabled',
			bpSecondaryTechnology: 'null',
			bpSeverity: 'Low',
			correctiveAction: 'Re-enable IGMP snooping by configuring "ip igmp snooping" globally',
			customerId: '167866829',
			deviceIdsWithExceptions:
				'23493649;23493618;23493648;23493647;23493640;23493646',
			exceptions: 'exception1;exception2;exception3',
			uuid: '64836746289847',
		},
	],
	High: '27',
};

/** mock data of getCBPMediumRiskData */
const getCBPMediumRiskData = {
	BPRulesDetails: [
		{
			bpPrimaryTechnologies: 'Network Management,Wireless',
			bpRecommendation: 'IOS switches should not be sending interface syslog',
			bpRuleId: '8349',
			bpRuleSummary: 'IGMP snooping is disabled by default on the Catalyst switches',
			bpRuleTitle: 'Interface level syslog events not disabled',
			bpSecondaryTechnology: 'null',
			bpSeverity: 'Low',
			correctiveAction: 'Re-enable IGMP snooping by configuring "ip igmp snooping" globally',
			customerId: '167866829',
			deviceIdsWithExceptions: '23493649;23493618;23493648;23493647;23493640;23493646',
			exceptions: 'exception1;exception2;exception3',
			uuid: '64836746289847',
		},
		{
			bpPrimaryTechnologies: 'Network Management,Wireless',
			bpRecommendation: 'IOS switches should not be sending interface',
			bpRuleId: '8408',
			bpRuleSummary: 'IGMP snooping is disabled by default on the Catalyst switches',
			bpRuleTitle: 'Interface level syslog events not disabled',
			bpSecondaryTechnology: 'null',
			bpSeverity: 'Low',
			correctiveAction: 'Re-enable IGMP snooping by configuring "ip igmp snooping" globally',
			customerId: '167866829',
			deviceIdsWithExceptions:
				'23493649;23493618;23493648;23493647;23493640;23493646',
			exceptions: 'exception1;exception2;exception3',
			uuid: '64836746289847',
		},
	],
	Low: '27',
};

/** The Scenarios */
export const ArchitectureScenarios = [
	// Valid Case Details
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'List Assets with Exceptions',
					response: {
						body: getAllAssetsWithExceptions,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/getAllAssetsWithExceptions`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'List All the Exceptions',
					response: {
						body: getAllCBPRulesDetails,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/getAllCBPRulesDetails`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'List High Severity Exceptions',
					response: {
						body: getCBPHighRiskData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/getAllCBPRulesDetails?severity=High`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'List Medium Severity Exceptions',
					response: {
						body: getCBPMediumRiskData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/getAllCBPRulesDetails?severity=Medium`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'List CBP Device Affected',
					response: {
						body: getAllCBPDeviceAffectedResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/v1/affectedDeviceDetails`,
		usecases: ['Use Case 2'],
	},
	{
		scenarios: {
			POST: [
				{
					delay: 100,
					description: 'List CBP Exception Details',
					response: {
						body: getAllCBPExceptionDetailsResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/v1/cbpExceptionDetails`,
		usecases: ['Use Case 3'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Get Count Of Exceptions',
					response: {
						body: getExceptionsCount,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/getExceptionsCount`,
		usecases: ['Use Case 1'],
	},
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
		url: `${api}/getAssetsExceptionsCount`,
		usecases: ['Use Case 1'],
	},
];
