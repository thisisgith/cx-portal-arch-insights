module.exports = {
	extends: [
		'stylelint-config-standard',
		'stylelint-config-recommended',
	],
	plugins: [
		'stylelint-scss',
	],
	rules: {
		'at-rule-no-unknown': null,
		'scss/at-rule-no-unknown': true,
		'block-no-empty': null,
		'color-no-invalid-hex': true,
		'comment-empty-line-before': ['always', {
			ignore: ['stylelint-commands', 'after-comment'],
		}],
		'declaration-colon-space-after': 'always-single-line',
		indentation: ['tab', {
			except: ['value'],
		}],
		'max-empty-lines': 2,
		'rule-empty-line-before': ['always', {
			except: ['first-nested'],
			ignore: ['after-comment'],
		}],
		'selector-pseudo-element-no-unknown': [true, {
			ignorePseudoElements: ['/ng-deep/'],
		}],
		'unit-whitelist': ['em', 'rem', '%', 's', 'px', 'vw', 'vh', 'deg', 'rad', 'fr', 'ms'],
	},
};
