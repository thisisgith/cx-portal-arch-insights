import { defaults } from './defaults';
import { mockSettings } from './mock/mock';

/**
 * Stage Internal origin
 */
const origin = 'https://apollo-stage.cisco.com';

/**
 * Contains configurations for internal stage builds, will extend the default configuration
 * and currently the mock configuration
 */
export const environment = {
	...defaults,
	...mockSettings,
	origin,
	auth: {
		accountUrl: `${origin}/ws/account/v2/`,
		ciscoTokenUrl: `${origin}/ws/oauth/v3/token/cisco`,
		referUrl: `${origin}/ws/oauth/v3/sso/`,
		tokenUrl: `${origin}/ws/oauth/v3/token/cway/35ae50e6ff5843f59183da19cc44245d`,
	},
	emailToID: 'cx-portal-support-nonprod@cisco.com',
	baseHref: '/pbc/',
	ieSetup: {
		asdAuthURL: 'https://cway.cisco.com/ws/oauth/v3/token/cisco/ae95x38c7zgu5fas59gseyfk',
		asdBaseURL: 'https://api.cisco.com/software/preview/v3.0',
		CX_Coll_Reg_LS_KEY: 'cxportal.cisco.com:setup-ie:HAS_CX_COLLECTOR',
		cxCollectorUserGuideLink: 'https://www.cisco.com/c/dam/en/us/support/docs/cloud-' +
			'systems-management/Cisco-CX-Collector/CX_Collector_FAQ_TB_Guide.pdf',
		DNAC_LS_KEY: 'cxportal.cisco.com:setup-ie:NO_DNAC',
		downloadOvaLink: 'http://engci-maven-master.cisco.com/artifactory/services-cf-insight' +
			'_engine-release/ie/Insight_Engine_1.0/ubuntu/103/CXC_1.0_Build-103.ova',
		hasDNAC: true,
		mockASD: true,
		mockRegistration: true,
		pingURL: '/ie-commonapi/services/version',
		telemetryGuideUrl: 'https://www-author3.cisco.com/c/en/us/td/docs/cloud-systems-' +
			'management/network-automation-and-management/dna-center/1-4/user_guide/' +
			'b_cisco_dna_center_ug_1_4/b_cisco_dna_center_ug_1_4_chapter_01001.html',
	},
	production: true,
	/**
	 * sdpServiceOrigin MUST be explicitly declared in every single environment file,
	 * because it is used inside of a module forRoot() call
	 */
	sdpServiceBasePath: '/api',
	sdpServiceOrigin: 'https://api-stage.cisco.com',
	sdpServicePaths: {
		contracts: '/api/v1/contracts',
		controlpoints: '/api/customerportal/controlpoint',
		customerportal: '/api/customerportal',
		inventory: '/api/v1/inventory',
	},
};
