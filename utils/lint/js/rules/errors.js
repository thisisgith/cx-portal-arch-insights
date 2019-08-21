module.exports = {
	rules: {
		'no-alert': 'error',
		'one-var-declaration-per-line': ['error', 'initializations'],
		'no-plusplus': 'error',
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: true,
				optionalDependencies: false,
				peerDependencies: true,
			},
		],
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'newline-per-chained-call': ['error', { ignoreChainWithDepth: 3 }],
		'no-empty-function': 'error',
		'no-param-reassign': ['error', { props: false }], // allow reassignment of fn param props
		'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
		'space-before-function-paren': ['error', 'always'],
		'valid-jsdoc': ['error', {
			requireReturn: false,
			requireReturnType: true,
			requireParamDescription: false,
			requireReturnDescription: false,
		}],
	},
};
