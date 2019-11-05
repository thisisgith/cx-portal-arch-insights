import { IListdevice } from '@sdp-api';

/**
 * Handle the cache
 *
 * @params {String} directory
 */
const api = '/api/customerportal/fingerprint/v1/list-product-families/';

/**
 *  Mock data for
 *
 *  @params
 */
const productFamilydeatils: any = {
	customerId: '7293498',
	crashPredicted: true,
	productFamilies: [
		{
			productFamily: 'Cisco Catalyst 9400 Series Switches',
			productIds: [
				{
					productId: 'C9407R',
					count: 317,
				},
			],
		},
		{
			productFamily: 'Cisco Catalyst 9300 Series Switches',
			productIds: [
				{
					productId: 'C9300-24UX, C9300-24UX, C9300-24UX',
					count: 314,
				},
				{
					productId: 'C9300-48UXM',
					count: 1,
				},
			],
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
	productId: 'AIR-CT5760',
	crashPredicted: true,
	deviceDetail: [
		{
			deviceId: 'NA,FOC1727V051,AIR-CT5760,NA',
			deviceName: 'Controller',
			serialNumber: 'FOC1727V051',
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
const api6 = 'api/customerportal/fingerprint/v1/similar-devices/7293498';
/**
 * The mock response for FP similar assets
 */
const fpSimilarAssetsInfo = {
	customerId: '7293498',
	count: 329,
	crashPredicted: true,
	similarDevices: [
		{
			deviceId: 'NA,FOX1306GFKH,WS-C4506-E,NA',
			deviceName: 'C4506-E',
			riskScore: 1.67,
			productFamily: 'Cisco Catalyst 4500 Series Switches',
			productId: 'WS-C4506-E',
			softwareVersion: '15.0(2)SG7',
			softwareType: 'IOS',
			similarityScore: 68.8033,
			globalRiskRank: 'LOW',
		},
	],
};

/**
 * The mock response for FP similar assets
 */
const fpSimilarAssetsInfoNoData = {
	customerId: '7293498',
	count: 329,
	crashPredicted: true,
	similarDevices: [],
};

/** Base of URL for SDP API */
const api5 = 'api/customerportal/fingerprint/v1/Mlvisualization/7293498/';
/** Mock data for */
export const MlvisualizationInfo = {
	count: 634,
	customerId: '7293498',
	scatterPlotDevices: [
		{
			deviceId: 'TestDevice',
			deviceName: 'Device_6_0_2_222',
			featureProfileKcluster: 0,
			featureProfileKclusterCrashrate: '0.05',
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
			featureProfileKclusterCrashrate: '0.05',
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

/** Base URL for device-details API */
const api7 = `/api/customerportal/fingerprint/v1/device-details/2431199/
TkEsRk9YMjAwOEdCQVQsQVNSMTAwMi1YLE5B`;
/** The mock response for deviceDetailsResponse */
const deviceDetailsResponse = {
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
};

/** Base of URL for SDP API */
const api8 = '/api/customerportal/fingerprint/v1/similar-devices/2431199';
/** Encoded device ID in path parameter */
const encodedDeviceID = 'TkEsRk9YMjAwOEdCQVQsQVNSMTAwMi1YLE5B';
/** Pagination parameters for similar devices API */
const paginationParams = 'similarityCriteria=softwares_features&page=0&size=3';
/** Solution useCase parameters */
const selectedSolution = 'useCase=Campus Network Assurance&solution=IBN';

/** Base URL for device comparison API */
const api9 = '/api/customerportal/fingerprint/v1/compare-devices/2431199';
/** devices to be compared */
const deviceForComparison1 = 'deviceId1=NA%2CFOX2008GBAT%2CASR1002-X%2CNA';
/** devices to be compared */
const deviceForComparison2 = 'deviceId2=NA%2CFOX1306GFKH%2CWS-C4506-E%2CNA';

/**
 * Mock data for MlVisualizationInfo empty state
 */
export const MlVisualizationInfoEmpty = {
	count: 634,
	customerId: '7293498',
	scatterPlotDevices: [],
};
/**
 * Scatter plot data
 */
export const scatterPlotDevices = [
	{
		position: {
			x: 0.4990452157572191,
			y: -0.06881163915251692,
			z: -0.009611822430886645,
		},
		cluster: 5,
		devices: [
			{
				deviceInfo: {
					deviceId: 'NA,FOX1306GFKH,WS-C4506-E,NA',
					productId: 'WS-C4506-E',
				},
				deviceName: 'C4506-E',
			},
		],
		id: 0,
		mass: 1,
		radius: 1,
		x: 0.4990452157572191,
		y: -0.06881163915251692,
		z: -0.009611822430886645,
	},
	{
		position: {
			x: -0.6855702541560552,
			y: 4.192143103082259,
			z: 1.778192935721556,
		},
		cluster: 5,
		devices: [
			{
				deviceInfo: {
					deviceId: 'NA,FOX1335GRHG,WS-C4506-E,NA',
					productId: 'WS-C4506-E',
				},
				deviceName: 'c4500',
			},
		],
		id: 1,
		mass: 1,
		radius: 1,
		x: -0.6855702541560552,
		y: 4.192143103082259,
		z: 1.778192935721556,
	},
];

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
	/** The scenarios */
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'fp Similar Assets',
					response: {
						body: fpSimilarAssetsInfo,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api6}`,
		usecases: ['Use Case 1'],
	},
	/** The scenarios */
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'fp Similar Assets',
					response: {
						body: fpSimilarAssetsInfoNoData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api6}`,
		usecases: ['Use Case 1'],
	},
	/** The scenarios */
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'Ml visualizationInfo',
					response: {
						body: MlVisualizationInfoEmpty,
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
					description: 'deviceInfo Response',
					response: {
						body: deviceDetailsResponse,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api7}/?useCase=Campus Network Assurance&solution=IBN`,
		usecases: ['Use Case 2'],
	},
	/** The scenarios */
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'fp Similar Assets',
					response: {
						body: fpSimilarAssetsInfo,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api8}/${encodedDeviceID}?${paginationParams}&${selectedSolution}`,
		usecases: ['Use Case 2'],
	},
	/** The scenarios */
	{
		scenarios: {
			GET: [
				{
					delay: 100,
					description: 'FP compare devices',
					response: {
						body: comparisonInformation,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api9}?${deviceForComparison1}&${deviceForComparison2}&${selectedSolution}`,
		usecases: ['Use Case 2'],
	},
];
