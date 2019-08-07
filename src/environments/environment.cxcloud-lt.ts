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
		tokenUrl: `${origin}/ws/oauth/v3/token/cway/35ae50e6ff5843f59183da19cc44245d`,
	},
	baseHref: '',
	csc: {
		fileDownloadURL: `https://largefile.cloudapps.cisco.com/Web-Ui?srId=
			{0}&fileName={1}&appId=cxportal`,
		fileList: '/ws/csc/v3/caseFiles',
	},
	csone: {
		clientId: '262556217fbe45ecbbe27af70e443e78',
	},
	ieSetup: {
		DNAC_LS_KEY: 'cxportal.cisco.com:setup-ie:NO_DNAC',
		downloadOvaLink: 'http://engci-maven-master.cisco.com/artifactory/services-' +
			'cf-insight_engine-release/ie/Insight_Engine_1.0/ubuntu/65/CXC_1.0_Build-65-1.ova',
		mockRegistration: false,
		pingURL: '/ie-commonapi/services/version',
		telemetryGuideUrl: 'https://www-author3.cisco.com/c/en/us/td/docs/cloud-systems-' +
			'management/network-automation-and-management/dna-center/1-4/user_guide/' +
			'b_cisco_dna_center_ug_1_4/b_cisco_dna_center_ug_1_4_chapter_01001.html',
	},
	mock: [],
	myCase: 'https://mycase.cloudapps.cisco.com',
	noAuthEndpoints: [
		'https://xresps.cloudapps.cisco.com/esps/search/suggest/cdcpr01zad',
	],
	production: true,
	rmaServiceClientId: 'mj2za65kd42razfxfrvvcgne',
	rmaServiceOrigin: 'https://api-test.cisco.com/api/lt/customerportal',
	rmaServicePaths: {
		returns: '/return/v1.0/returns',
	},
	rmaToolUrl: 'https://ibpm.cisco.com/rma/home',
	sdpServiceClientId: 'ejw4cbpvp3s8cyh4ry8qcnff',
	/**
	 * sdpServiceOrigin MUST be explicitly declared in every single environment file,
	 * because it is used inside of a module forRoot() call
	 */
	sdpServiceOrigin: 'https://api-test.cisco.com/api/lt/customerportal',
	sdpServicePaths: {
		contracts: '/api/lt/v1/contracts',
		controlpoints: '/api/lt/customerportal/controlpoint',
		customerportal: '/api/lt/customerportal',
		inventory: '/api/lt/v1/inventory',
	},
	typeaheadServiceOrigin: 'https://xresps.cloudapps.cisco.com',
};
