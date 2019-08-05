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
	mock: [],
	myCase: 'https://mycase.cloudapps.cisco.com',
	noAuthEndpoints: [
		'https://xresps.cloudapps.cisco.com/esps/search/suggest/cdcpr01zad',
	],
	production: true,
	rmaServiceClientId: 'mj2za65kd42razfxfrvvcgne',
	rmaServicePaths: {
		returns: '/return/v1.0/returns',
	},
	rmaToolUrl: 'https://ibpm.cisco.com/rma/home',
	sdpServiceClientId: 'ejw4cbpvp3s8cyh4ry8qcnff',
	/**
	 * sdpServiceOrigin MUST be explicitly declared in every single environment file,
	 * because it is used inside of a module forRoot() call
	 */
	sdpServiceOrigin: 'https://api-test.cisco.com/api/stg/customerportal',
	sdpServicePaths: {
		contracts: '/api/stg/v1/contracts',
		controlpoints: '/api/stg/customerportal/controlpoint',
		customerportal: '/api/stg/customerportal',
		inventory: '/api/stg/v1/inventory',
	},
	// ClientSSOInterceptor: No auth token for the typeahead url
	typeaheadServiceOrigin: 'https://xresps.cloudapps.cisco.com',
};
