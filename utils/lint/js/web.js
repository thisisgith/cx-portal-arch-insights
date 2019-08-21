module.exports = {
	extends: [
		'eslint-config-airbnb-base',
		'./rules/overrides',
		'./rules/warnings',
		'./rules/errors',
		'./webRules/overrides',
		'./webRules/warnings',
		'./webRules/errors',
	].map(require.resolve),
	env: {
		browser: true,
	},
	globals: {
		angular: false,
		async: false,
		cisco: false,
		CryptoJS: false,
		define: false,
		escape: false,
		ga: false,
		nw: false,
		requirejs: false,
		unescape: false,
		$: false,
		jQuery: false,
	},
};
