module.exports = HTMLHint => {
	HTMLHint.addRule({
		id: 'auto-id-require',
		description: 'Clickable links and elements using angular binding should have auto-id tags.',
		init: (parser, reporter) => {
			parser.addListener('tagstart', event => {
				const autoIds = [
					'data-auto-id',
					'attr.data-auto-id',
				];
				const triggers = [
					'(innerHtml)',
					'[innerHtml]',
					'[(innerHtml)]',
					'(ngModel)',
					'[ngModel]',
					'[(ngModel)]',
					'(click)',
					'[click]',
					'[(click)]',
				];

				const tagName = event.tagName.toLowerCase();
				const mapAttrs = parser.getMapAttrs(event.attrs);
				const col = event.col + tagName.length + 1;
				const lineFlags = [];

				autoIds.forEach((id, i) => {
					lineFlags[i] = false;
					triggers.forEach(attr => {
						if (attr in mapAttrs && !(id in mapAttrs) && !lineFlags[i]) {
							lineFlags[i] = true;
						} else if (tagName === 'a' && ('href' in mapAttrs) && (mapAttrs.href !== '') && !(id in mapAttrs) && !lineFlags[i]) {
							lineFlags[i] = true;
						} else if ((id in mapAttrs) && mapAttrs[id] === '' && !lineFlags[i]) {
							lineFlags[i] = true;
						}
					});
				});
				if (lineFlags.every(e => e)) {
					reporter.warn(`${autoIds[0]} must be present and have a value.`, event.line, col, { id: `${autoIds[0]}-require` }, event.raw);
				}
			});
		},
	});
};
