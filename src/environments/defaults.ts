/**
 * Contains default configurations to be used to import into other environment files,
 * should not be imported directly by anything other than environment files
 */
export const defaults = {
	auth: {
		referUrl: 'https://swtgdev-apollo-2.cisco.com/ws/oauth/v3/sso/',
		tokenUrl: 'https://swtgdev-apollo-2.cisco.com/ws/oauth/v3/token/cway/{INSERT_CLIENT_ID}',
	},
	origin: 'https://swtgdev-apollo-2.cisco.com',
	production: false,
};
