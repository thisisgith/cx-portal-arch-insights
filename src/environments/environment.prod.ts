import { defaults } from './defaults';

/**
 * Cway origin
 */
const origin = 'https://cway.cisco.com';

/**
 * Contains configurations for production builds, will extend the default configuration
 */
export const environment = {
	...defaults,
	origin,
	auth: {
		accountUrl: `${origin}/ws/account/v2/`,
		ciscoTokenUrl: `${origin}/ws/oauth/v3/token/cisco`,
		referUrl: `${origin}/ws/oauth/v3/sso/`,
		tokenUrl: `${
			origin
		}/ws/oauth/v3/token/cway/e4f602992449cdb1d4aea2df5849f7d6ebd4280c1c8e1398fcfec534422533b8`,
	},
	baseHref: '/pbc',
	communityLink: 'https://cloudsso.cisco.com/idp/startSSO.ping?PartnerSpId=' +
		'https://community.cisco.com/auth/saml&TARGET=https://community.cisco.com',
	csc: {
		fileDownloadURL: `https://largefile.cloudapps.cisco.com/Web-Ui?srId=
			{0}&fileName={1}&appId=cxportal`,
		fileList: '/ws/csc/v3/caseFiles',
	},
	csone: {
		classifyAppId: 'CXPortal',
		clientId: '262556217fbe45ecbbe27af70e443e78',
	},
	// Curated Communities/Private Communitites/SuccessTrack URL
	curatedCommunityUrl: 'https://community.cisco.com/t5',
	DNACommunititesPath: 'cisco-digital-network',
	feedbackToEmail: 'cx-portal-support@cisco.com',
	ieSetup: {
		asdAuthURL: 'https://cway.cisco.com/ws/oauth/v3/token/cisco/ae95x38c7zgu5fas59gseyfk',
		asdBaseURL: 'https://api.cisco.com/software/preview/v3.0',
		CX_Coll_Reg_LS_KEY: 'cxportal.cisco.com:setup-ie:HAS_CX_COLLECTOR',
		cxCollectorUserGuideLink: 'https://www.cisco.com/c/dam/en/us/support/docs/cloud-' +
			'systems-management/Cisco-CX-Collector/CX_Collector_FAQ_TB_Guide.pdf',
		DNAC_LS_KEY: 'cxportal.cisco.com:setup-ie:NO_DNAC',
		downloadOvaLink: 'http://engci-maven-master.cisco.com/artifactory/services-cf-insight' +
			'_engine-release/ie/Insight_Engine_1.0/ubuntu/103/CXC_1.0_Build-103.ova',
		imageDownloadRetries: 6,
		mockASD: false,
		mockRegistration: false,
		pingURL: '/ie-commonapi/services/version',
		telemetryGuideUrl: 'https://www-author3.cisco.com/c/en/us/td/docs/cloud-systems-' +
			'management/network-automation-and-management/dna-center/1-4/user_guide/' +
			'b_cisco_dna_center_ug_1_4/b_cisco_dna_center_ug_1_4_chapter_01001.html',
	},
	logoutUrl: 'https://www.cisco.com/autho/logout.html',
	mapboxToken:
	'pk.eyJ1IjoibWlzY2htaTIiLCJhIjoiY2p4eDl2ODVnMGpmODNkcDhsbG5nNXQ0YyJ9.vpfGffFASSUfANAU4Yvtxg',
	mock: [],
	myCase: 'https://mycase.cloudapps.cisco.com',
	noAuthEndpoints: [
		'https://xresps.cloudapps.cisco.com/esps/search/suggest/cdcpr01zad',
	],
	production: true,
	// Public community URL
	publicCommunityUrl: 'https://cloudsso.cisco.com/idp/startSSO.ping?PartnerSpId=' +
		'https://community.cisco.com/auth/saml&TARGET=https://community.cisco.com/t5',
	rmaServiceClientId: 'mj2za65kd42razfxfrvvcgne',
	rmaServicePaths: {
		returns: '/return/v1.0/returns',
	},
	rmaToolUrl: 'https://ibpm.cisco.com/rma/home',
	sdpServiceBasePath: '/api/stg',
	sdpServiceClientId: 'ejw4cbpvp3s8cyh4ry8qcnff',
	/**
	 * sdpServiceOrigin MUST be explicitly declared in every single environment file,
	 * because it is used inside of a module forRoot() call
	 */
	sdpServiceOrigin: 'https://api-test.cisco.com',
	sdpServicePaths: {
		contracts: '/api/stg/v1/contracts',
		controlpoints: '/api/stg/customerportal/controlpoint',
		customerportal: '/api/stg/customerportal',
		inventory: '/api/stg/v1/inventory',
	},
	// ClientSSOInterceptor: No auth token for the typeahead url
	typeaheadServiceOrigin: 'https://xresps.cloudapps.cisco.com',
};
