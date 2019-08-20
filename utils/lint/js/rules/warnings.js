module.exports = {
	rules: {
		'arrow-parens': ['warn', 'as-needed'],
		'comma-dangle': ['warn', 'always-multiline'],
		'object-shorthand': ['warn', 'properties'],
		'prefer-const': 'warn',
		'prefer-template': 'warn',
		'require-jsdoc': ['warn', {
			require: {
				FunctionDeclaration: true,
				MethodDefinition: true,
				ClassDeclaration: true,
			},
		}],
		'no-await-in-loop': 'warn',
	},
};
