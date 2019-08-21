module.exports = {
	env: {
		amd: true,
		es6: true,
		mocha: true,
		node: true,
	},
	globals: {
		cy: false,
		Cypress: false,
		expect: false,
		assert: false,
	},
	extends: [
		'eslint-config-airbnb-base',
		'./rules/overrides',
		'./rules/warnings',
		'./rules/errors',
	].map(require.resolve),
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
};
