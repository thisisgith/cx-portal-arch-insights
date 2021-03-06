import { defaults } from './defaults';

/**
 * Cway origin
 */
const origin = 'https://apollo-stage.cisco.com';

/**
 * Contains configurations for production builds, will extend the default configuration
 */
export const environment = {
	...defaults,
	origin,
	auth: {
		accountUrl: `${origin}/ws/account/v2/`,
		ciscoTokenUrl: `${origin}/ws/oauth/v4/token/cisco`,
		referUrl: `${origin}/ws/oauth/v4/sso/`,
		tokenUrl: `${origin}/ws/oauth/v4/token/cway/35ae50e6ff5843f59183da19cc44245d`,
	},
	baseHref: '/portal/',
	csc: {
		fileDownloadURL: `https://largefile-stage.cloudapps.cisco.com/Web-Ui?srId=
			{0}&fileName={1}&appId=cxportal`,
		fileList: '/ws/csc/v3/caseFiles',
	},
	csone: {
		classifyAppId: 'CXPortal',
		clientId: '07e418ac71284560944ea92f653a01c2',
		maxCasesPerRequest: 1000,
	},
	emailToID: 'cx-portal-support-nonprod@cisco.com',
	feedbackToEmail: 'cxportal-feedback@cisco.com',
	ieSetup: {
		asdAuthURL: 'https://cway.cisco.com/ws/oauth/v3/token/cisco/ae95x38c7zgu5fas59gseyfk',
		asdBaseURL: 'https://api.cisco.com/software/preview/v3.0',
		CX_Coll_Reg_LS_KEY: 'cxportal.cisco.com:setup-ie:HAS_CX_COLLECTOR',
		cxCollectorUserGuideLink: 'https://www.cisco.com/c/dam/en/us/support/docs/' +
			'cloud-systems-management/Cisco-CX-Collector/Collector_Overview.pdf',
		DNAC_LS_KEY: 'cxportal.cisco.com:setup-ie:NO_DNAC',
		downloadOvaLink: 'http://engci-maven-master.cisco.com/artifactory/services-cf-insight' +
			'_engine-release/ie/Insight_Engine_1.0/ubuntu/103/CXC_1.0_Build-103.ova',
		imageDownloadRetries: 6,
		mockASD: true,
		mockRegistration: false,
		pingURL: '/ie-commonapi/services/version',
		telemetryGuideUrl: 'https://www-author3.cisco.com/c/en/us/td/docs/cloud-systems-' +
			'management/network-automation-and-management/dna-center/1-4/user_guide/' +
			'b_cisco_dna_center_ug_1_4/b_cisco_dna_center_ug_1_4_chapter_01001.html',
	},
	learningLink: 'https://qa.cte.systems/cx/#/',
	mapboxToken:
	'pk.eyJ1IjoibWljaGhhcnQiLCJhIjoiY2szaGtvbnc1MGRxODNkcWc4a3dodWxjdSJ9.55emo88LB7ahEdrdkELIcQ',
	mock: [],
	myCase: 'https://mycase2.cloudapps.cisco.com',
	noAuthEndpoints: [
		'https://xresps.cloudapps.cisco.com/esps/search/suggest/cdcpr01zad',
	],
	production: true,
	rmaServiceClientId: 'yvgjnzruyuh9a7tdnbj8ka3n',
	rmaServiceOrigin: 'https://api-stage.cisco.com',
	rmaServicePaths: {
		returns: '/return/v1.0/returns',
	},
	rmaToolUrl: 'https://ibpm-stage.cisco.com/rma-qa3/home',
	sdpServiceBasePath: `/api/${defaults.datacenterStub}`,
	sdpServiceClientId: '4jr3csg78pg7ws7gwvj82sfa',
	/**
	 * sdpServiceOrigin MUST be explicitly declared in every single environment file,
	 * because it is used inside of a module forRoot() call
	 */
	sdpServiceOrigin: 'https://api-stage.cisco.com',
	sdpServicePaths: {
		contracts: `/api/${defaults.datacenterStub}/v1/contracts`,
		customerportal: `/api/${defaults.datacenterStub}/customerportal`,
		customerportalNoRegion: '/api/customerportal',
		cxportal: `/api/${defaults.datacenterStub}/cxportal`,
		inventory: `/api/${defaults.datacenterStub}/v1/inventory`,
		partner: `/api/${defaults.datacenterStub}/cxportal`,
		cp: `/api/${defaults.datacenterStub}`,
		usa: '/api/usa',
		emea: '/api/emea',
	},
	typeaheadServiceOrigin: 'https://xresps.cloudapps.cisco.com',
};
