/**
 * Default Origin
 */
const origin = 'https://swtgdev-apollo-2.cisco.com';

/**
 * Contains default configurations to be used to import into other environment files,
 * should not be imported directly by anything other than environment files
 */
export const defaults = {
	origin,
	auth: {
		accountUrl: `${origin}/ws/account/v2/`,
		ciscoTokenUrl: `${origin}/ws/oauth/v3/token/cisco`,
		referUrl: `${origin}/ws/oauth/v3/sso/`,
		tokenUrl: `${origin}/ws/oauth/v3/token/cway/35ae50e6ff5843f59183da19cc44245d`,
	},
	baseHref: '/pbc/',
	controlPointsOrigin: 'https://cpp-api.sdp12-istg.csco.cloud/controlpoint',
	csc: {
		fileDownloadURL: `https://largefile-stage.cloudapps.cisco.com/Web-Ui?srId=
			{0}&fileName={1}&appId=cxportal`,
		fileList: '/ws/csc/v3/caseFiles',
	},
	csone: {
		clientId: '07e418ac71284560944ea92f653a01c2',
	},
	ieSetup: {
		DNAC_LS_KEY: 'cxportal.cisco.com:setup-ie:NO_DNAC',
		downloadOvaLink: 'http://engci-maven-master.cisco.com/artifactory/services-' +
			'cf-insight_engine-release/ie/Insight_Engine_1.0/ubuntu/65/CXC_1.0_Build-65-1.ova',
		mockRegistration: true,
		pingURL: '/ie-commonapi/services/version',
		telemetryGuideUrl: 'https://www-author3.cisco.com/c/en/us/td/docs/cloud-systems-' +
			'management/network-automation-and-management/dna-center/1-4/user_guide/' +
			'b_cisco_dna_center_ug_1_4/b_cisco_dna_center_ug_1_4_chapter_01001.html',
	},
	myCase: 'https://mycase2.cloudapps.cisco.com',
	// ClientSSOInterceptor: No auth token for the typeahead url
	noAuthEndpoints: [
		'https://xresps-stage.cloudapps.cisco.com/esps/search/suggest/cdcpr01zad',
	],
	production: false,
	rmaServiceClientId: 'yvgjnzruyuh9a7tdnbj8ka3n',
	rmaServiceOrigin: 'https://api-stage.cisco.com',
	rmaServicePaths: {
		returns: '/return/v1.0/returns',
	},
	rmaToolUrl: 'https://ibpm-stage.cisco.com/rma-qa3/home',
	sdpServiceClientId: '4jr3csg78pg7ws7gwvj82sfa',
	/**
	 * sdpServiceOrigin MUST be explicitly declared in every single environment file,
	 * because it is used inside of a module forRoot() call
	 */
	sdpServiceOrigin: 'https://api-stage.cisco.com',
	sdpServicePaths: {
		contracts: '/api/v1/contracts',
		controlpoints: '/api/customerportal/controlpoint',
		customerportal: '/api/customerportal',
		inventory: '/api/v1/inventory',
	},
	supportEmailLink: 'mailto:help@cisco.com',
	typeaheadServiceOrigin: 'https://xresps-stage.cloudapps.cisco.com',
	communityLink: 'https://community.cisco.com/t5/technology-and-support/ct-p/technology-support',
	learningLink: 'https://pilot-digital-learning.cisco.com/cx/#/',
	cuiColors: {
		vibrantBlue: '#017cad',
	},
	logoutUrl: 'https://www.cisco.com/autho/logout.html',
	manageProfileUrl: 'https://rpfa.cloudapps.cisco.com/rpfa/profile/profile_management.do',
};
