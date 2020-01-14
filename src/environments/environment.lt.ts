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
		ciscoTokenUrl: `${origin}/ws/oauth/v4/token/cisco`,
		referUrl: `${origin}/ws/oauth/v4/sso/`,
		tokenUrl: `${origin}/ws/oauth/v4/token/cway/35ae50e6ff5843f59183da19cc44245d`,
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
		'pk.eyJ1IjoibWljaGhhcnQiLCJhIjoiY2szaGtudW9oMGRvajNubmo1OWgxaG85NSJ9.wwXqdHQ4k-YTqUw1VMvayA',
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
	sdpServiceBasePath: `/api/lt/${defaults.datacenterStub}`,
	sdpServiceClientId: 'ejw4cbpvp3s8cyh4ry8qcnff',
	/**
	 * sdpServiceOrigin MUST be explicitly declared in every single environment file,
	 * because it is used inside of a module forRoot() call
	 */
	sdpServiceOrigin: 'https://api-test.cisco.com',
	sdpServicePaths: {
		contracts: `/api/lt/${defaults.datacenterStub}/v1/contracts`,
		customerportal: `/api/lt/${defaults.datacenterStub}/customerportal`,
		customerportalNoRegion: '/api/lt/customerportal',
		cxportal: `/api/${defaults.datacenterStub}/cxportal`,
		inventory: `/api/lt/${defaults.datacenterStub}/v1/inventory`,
		partner: `/api/lt/${defaults.datacenterStub}/cxportal`,
		cp: `/api/${defaults.datacenterStub}`,
		usa: '/api/usa',
		emea: '/api/emea',
	},
	typeaheadServiceOrigin: 'https://xresps.cloudapps.cisco.com',
};
