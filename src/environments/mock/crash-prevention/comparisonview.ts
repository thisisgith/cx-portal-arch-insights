import { IListdevice } from '@sdp-api';

/**
 * Handle the cache
 *
 * @params {String} directory
 */
const api = '/api/customerportal/inventory/v1/Productfamily';

/**
 *  Mock data for
 *
 *  @params
 */
const productFamilydeatils: any = {
	customerId: '7293498',
	productFamily: [
		{
			productId: '',
			productFamily: 'Cisco 4400 Series Integrated Services Routers',
		},
		{
			productId: 'AIR-CT5760',
			productFamily: 'Cisco 5700 Series Wireless LAN Controllers',
		},
		{
			productId: 'ASA5540',
			productFamily: 'Cisco ASA 5500-X Series Firewalls',
		},
	],
};

/**
 *
 * Base of URL for SDP API
 *
 *  @params
 */
const api1 = '/api/customerportal/inventory/v1/listDevicedeatis';

/**
 * Mock data for
 *
 *  @params
 */
const listDevicedeatils: IListdevice = {
	customerId: '7293498',
	deviceDetail: [
		{
			deviceId: 'NA,6011,C9407R,NA',
			deviceName: 'Device_6_0_1_1',
		},
		{
			deviceId: 'NA,60110,C9407R,NA',
			deviceName: 'Device_6_0_1_10',
		},
		{
			deviceId: 'NA,601101,C9407R,NA',
			deviceName: 'Device_6_0_1_101',
		},
		{
			deviceId: 'NA,601103,C9407R,NA',
			deviceName: 'Device_6_0_1_103',
		},
	],
};

/** Base of URL for SDP API */
const api2 = '/api/customerportal/inventory/v1/comparisonInformation';

/**
 *
 * Mock data for
 *
 * @param
 */
const comparisonInformation: any = {
	customerId: '7293498',
	feature: {
		common: [
			'QoS_Infrastructure_Policy_Maps_IOS',
			'HTTP Server',
			'multiple_rsa_keypair_support',
			'BFD_DISABLE_IOS',
			'Digital_Optical_Monitoring_DOM_IOS',
			'At_Least_One_IP_Interface_IOS',
			'Logging Syslog Server',
			'DNS Client',
			'Error Disable Timeout BPDU IOS',
			'Local User Database',
			'Static Routing',
			'Secure_Copy_SCP',
			'Nonstop_Forwarding_with_Stateful_Switchover',
		],
		unique: [
			{
				data: [],
				deviceId: 'NA,601163,C9407R,NA',
			},
			{
				data: [],
				deviceId: 'NA,60221,C9407R,NA',
			},
		],
	},
	hardware: {
		common: [
			'Cisco Catalyst 9400 Series Switches',
			'C9407R',
		],
		unique: [
			{
				data: [],
				deviceId: 'NA,601163,C9407R,NA',
			},
			{
				data: [],
				deviceId: 'NA,60221,C9407R,NA',
			},
		],
	},
	software: {
		common: [
			null,
			'',
			'CORE',
			'IOS-XE',
			'16.8.1a',
		],
		unique: [
			{
				data: [],
				deviceId: 'NA,601163,C9407R,NA',
			},
			{
				data: [],
				deviceId: 'NA,60221,C9407R,NA',
			},
		],
	},
};
/** Base of URL for SDP API */
const api3 = 'api/customerportal/fingerprint/v1/device-details/7293498/';
/** The mock response for deviceInfoResponse */
const deviceInfoResponse = {
	data: [
		{
			customerId: '7293498',
			deviceId: '12843610',
			deviceName: 'dummy',
			globalRiskRank: 'HIGH',
			ipAddress: '0.0.0.0',
			productFamily: 'Cisco Catalyst 3560-E Series Switches',
			productId: 'WS-C3560E-48TD-S',
			riskScore: '27.73',
			serialNumber: 'FNS121708MX',
			softwareType: 'IOS',
			softwareVersion: '12.2(44)SE2',
		},
	],
};

/** Base of URL for SDP API */
const api4 = 'api/customerportal/fingerprint/v1/device-destribution/7293498/';
/** The mock response for fpIntelligenceInfo */
const fpIntelligenceInfo = {
	customerId: '7293498',
	softwares:
	[
		{
			deviceCount: '316',
			softwareVersion: '16.8.1a',
		},
		{
			deviceCount: '1',
			softwareVersion: '16.9.1',
		},
	],
	productFamilies:
	[
		{
			deviceCount: '317',
			productFamily: 'Cisco Catalyst 9400 Series Switches',
		},
	],
	products:
	[
		{
			deviceCount: '317',
			productId: 'C9407R',
		},
	],
};

/** The mock response for fpIntelligenceInfo with no data */
const fpIntelligenceInfoNodata = {
	customerId: '7293498',
	softwares: [],
	productFamilies: [],
	products: [],
};

/** Base of URL for SDP API */
const api5 = 'api/customerportal/fingerprint/v1/Mlvisualization/7293498/';
/** Mock data for */
const MlvisualizationInfo = {
	count: 634,
	customerId: '7293498',
	scatterPlotDevices: [
		{
			deviceId: 'NA',
			deviceName: 'Device_6_0_2_222',
			featureProfileKcluster: 0,
			featureProfilePCA1: '0.27194448313748254',
			featureProfilePCA2: '-0.6677443614955769',
			featureProfilePCA3: '-0.26921527251480576',
			fingerprintKcluster: 0,
			fingerprintKclusterCrashrate: '0.05',
			fingerprintPCA1: '-0.6536891710909882',
			fingerprintPCA2: '0.4201990688658936',
			fingerprintPCA3: '-0.6212148577636525',
			lemmaFeatureKcluster: 0,
			lemmaFeatureKclusterCrashrate: '5.9',
			lemmaFeaturePCA1: '0.12992399064088117',
			lemmaFeaturePCA2: '0.03928785789397787',
			lemmaFeaturePCA3: '-0.268887363699741',
			productFamily: 'Cisco_Catalyst_9',
			productId: 'C9407R',
		},
		{
			deviceId: 'NA',
			deviceName: 'Device_6_0_2_222',
			featureProfileKcluster: 0,
			featureProfilePCA1: '0.27194448313748254',
			featureProfilePCA2: '-0.6677443614955769',
			featureProfilePCA3: '-0.26921527251480576',
			fingerprintKcluster: 0,
			fingerprintKclusterCrashrate: '0.05',
			fingerprintPCA1: '-0.6536891710909882',
			fingerprintPCA2: '0.4201990688658936',
			fingerprintPCA3: '-0.6212148577636525',
			lemmaFeatureKcluster: 0,
			lemmaFeatureKclusterCrashrate: '5.9',
			lemmaFeaturePCA1: '0.12992399064088117',
			lemmaFeaturePCA2: '0.03928785789397787',
			lemmaFeaturePCA3: '-0.268887363699741',
			productFamily: 'Cisco_Catalyst_9',
			productId: 'C9407R',
		},
	],
};

/** The scenarios */
export const ComparisonViewScenarios = [

	/** The scenarios */
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: ' productFamily Details',
					response: {
						body: productFamilydeatils,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}`,
		usecases: ['Use Case 1'],
	},

	/** The scenarios */

	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'listDevice Deatils',
					response: {
						body: listDevicedeatils,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api1}`,
		usecases: ['Use Case 1'],
	},
	/** The scenarios */
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'comparison Information',
					response: {
						body: comparisonInformation,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api2}`,
		usecases: ['Use Case 1'],
	},

	/** The scenarios */
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'deviceInfo Response',
					response: {
						body: deviceInfoResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api3}`,
		usecases: ['Use Case 1'],
	},

	/** The scenarios */
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'fp IntelligenceInfo',
					response: {
						body: fpIntelligenceInfo,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api4}`,
		usecases: ['Use Case 1'],
	},

	/** The scenarios */
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Ml visualizationInfo',
					// description:'coparisonview scenarios '
					response: {
						body: MlvisualizationInfo,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api5}`,
		usecases: ['Use Case 1'],
	},
	/** The scenarios */
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'fp IntelligenceInfo',
					response: {
						body: fpIntelligenceInfoNodata,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api4}`,
		usecases: ['Use Case 1'],
	},

];
