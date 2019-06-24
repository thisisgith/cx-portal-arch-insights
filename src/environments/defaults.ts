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
		ciscoTokenUrl: `${origin}/ws/oauth/v3/token/cisco`,
		referUrl: `${origin}/ws/oauth/v3/sso/`,
		tokenUrl: `${origin}/ws/oauth/v3/token/cway/35ae50e6ff5843f59183da19cc44245d`,
	},
	csone: {
		clientId: '453b7e10f08b428c90d48432312889ad',
	},
	production: false,
	rmaToolUrl: 'https://ibpm-stage.cisco.com/rma-qa1/home',
	services: {
		rma: {
			clientId: 'yvgjnzruyuh9a7tdnbj8ka3n',
			origin: 'https://api-stage.cisco.com',
			paths: {
				returns: '/return/v1.0/returns',
			},
		},
		sdp: {
			clientId: '4jr3csg78pg7ws7gwvj82sfa',
			origin: 'https://api-stage.cisco.com',
			paths: {
				contracts: '/api/v1/contracts',
				customerportal: '/api/customerportal',
				inventory: '/api/v1/inventory',
			},
		},
		typeahead: {
			origin: 'https://xresps-stage.cloudapps.cisco.com',
		},
	},
};
