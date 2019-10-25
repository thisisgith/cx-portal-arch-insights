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
	baseHref: '/portal/',
	csc: {
		fileDownloadURL: `https://largefile.cloudapps.cisco.com/Web-Ui?srId=
			{0}&fileName={1}&appId=cxportal`,
		fileList: '/ws/csc/v3/caseFiles',
	},
	csone: {
		classifyAppId: 'CXPortal',
		clientId: '262556217fbe45ecbbe27af70e443e78',
		maxCasesPerRequest: 1000,
	},
	emailToID: 'cx-portal-support-nonprod@cisco.com',
	feedbackToEmail: 'cxportal-feedback@cisco.com',
	mapboxToken:
	'sk.eyJ1Ijoic3NhbHRzZ2EiLCJhIjoiY2syMmVwd2h4MGp5aTNscGczNjlkbjRueSJ9.nAeOj3bDf0ePEUvb7q9F2g',
	mock: [],
	myCase: 'https://mycase.cloudapps.cisco.com',
	noAuthEndpoints: [
		'https://xresps.cloudapps.cisco.com/esps/search/suggest/cdcpr01zad',
	],
	production: true,
	rmaServiceClientId: 'mj2za65kd42razfxfrvvcgne',
	rmaServiceOrigin: 'https://api-test.cisco.com',
	rmaServicePaths: {
		returns: '/return/v1.0/returns',
	},
	rmaToolUrl: 'https://ibpm.cisco.com/rma/home',
	sdpServiceBasePath: '/api/lt',
	sdpServiceClientId: 'ejw4cbpvp3s8cyh4ry8qcnff',
	/**
	 * sdpServiceOrigin MUST be explicitly declared in every single environment file,
	 * because it is used inside of a module forRoot() call
	 */
	sdpServiceOrigin: 'https://api-test.cisco.com',
	sdpServicePaths: {
		contracts: '/api/lt/v1/contracts',
		controlpoints: '/api/lt/customerportal/controlpoint',
		customerportal: '/api/lt/customerportal',
		inventory: '/api/lt/v1/inventory',
	},
	typeaheadServiceOrigin: 'https://xresps.cloudapps.cisco.com',
};
