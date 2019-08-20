module.exports = HTMLHint => {
	HTMLHint.addRule({
		id: 'balanced-brackets-parens',
		description: 'Use of [] and () in HTML attributes should be balanced',
		init: (parser, reporter) => {
			parser.addListener('tagstart', event => {
				if (event.attrs && event.attrs.length) {
					event.attrs.forEach(attr => {
						const col = event.raw.indexOf(attr.name) + 1;
						const leftBracketCount = (attr.name.match(/\[/)) || [];
						const rightBracketCount = (attr.name.match(/\]/)) || [];
						const leftParenCount = (attr.name.match(/\(/)) || [];
						const rightParenCount = (attr.name.match(/\)/)) || [];
						if (leftBracketCount.length !== rightBracketCount.length) {
							reporter.error('Mismatched [] brackets', event.line, col, { id: 'balanced-brackets' }, event.raw);
						}
						if (leftParenCount.length !== rightParenCount.length) {
							reporter.error('Mismatched () parenthesis', event.line, col, { id: 'balanced-parens' }, event.raw);
						}
					});
				}
			});
		},
	});
};
