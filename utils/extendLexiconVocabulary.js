/**
 * You can add new words to the lexicon here,
 * or, unlike the library's built-in extendLexicon function,
 * you can add tags to currently existing words.
 */

function extendLexicon (tagger) {
	const newTerms = [
		['finagle', ['VB', 'VBP']],
		['tweak', ['VB', 'VBP']],
	];
	newTerms.forEach(pair => {
		const word = pair[0];
		const tagsToAdd = pair[1];
		const tags = { };
		if (tagger.lexicon[word]) {
			tagger.lexicon[word].forEach(tag => { tags[tag] = true; });
		}
		tagsToAdd.forEach(tag => { tags[tag] = true; });
		tagger.lexicon[word] = Object.keys(tags);
	});
};

const newVocabulary = [
	'git',
	'Git',
	'node',
	'Node',
	'CX',
	'JS',
	'CSS',
	'SCSS',
	'Typescript',
	'Javascript',
	'Util',
	'util',
];

function extendVocabulary (spellChecker) {
	for (word of newVocabulary) {
		spellChecker.add(word);
	}
};

module.exports = {
	extendLexicon,
	extendVocabulary,
};
