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
	csc: {
		fileDownloadURL: `https://largefile-stage.cloudapps.cisco.com/Web-Ui?srId=
			{0}&fileName={1}&appId=cxportal`,
		fileList: '/ws/csc/v3/caseFiles',
	},
	csone: {
		clientId: '07e418ac71284560944ea92f653a01c2',
	},
	myCase: 'https://mycase.cloudapps.cisco.com',
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
	rmaToolUrl: 'https://ibpm-stage.cisco.com/rma-qa1/home',
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
	typeaheadServiceOrigin: 'https://xresps-stage.cloudapps.cisco.com',
};
