const { Tagger, Lexer } = require('pos');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const { extendLexicon, extendVocabulary } = require('./extendLexiconVocabulary');
const colors = require('colors/safe');
const SpellChecker = require('spellchecker');
const path = require('path');

const { CI_DEFAULT_BRANCH, CI_MERGE_REQUEST_TARGET_BRANCH_NAME } = process.env;
const [argBranch] = process.argv.slice(2);

const spellChecker = new SpellChecker.Spellchecker();
spellChecker.setSpellcheckerType(SpellChecker.ALWAYS_USE_SYSTEM);

const diffBranch = CI_MERGE_REQUEST_TARGET_BRANCH_NAME 
	|| CI_DEFAULT_BRANCH 
	|| argBranch 
	|| 'develop';

async function checkGitCommits () {
	try {
		const { stdout: newCommits } = await exec(`git log origin/${diffBranch}.. --pretty=format:%h`);

		const newCommitsArr = newCommits.split('\n');

		console.log(`\n\n 🔎 Linting the format for new commit message(s) against ${diffBranch}\n${newCommitsArr.join(' ')}`)

		await Promise.all(newCommitsArr.map(async hash => {
			try {
				let { stdout: wholeCommit } = await exec(`git log ${hash} --pretty=format:%B -1`);
				wholeCommit = wholeCommit.split(/\n/);
				const [commitTitle, commitTitleBodyBreak, ...commitBody] = wholeCommit;
				checkCommit(commitTitle, commitTitleBodyBreak, commitBody, hash);
			} catch(e) {
				throw new Error(e.message);
			}
		}));
	} catch(e) {
		console.error(`\n\n${colors.red(e.message)}`, '\n\n');
		process.exit(1);
	}
}

function verifyType (givenType) {
	const validTypes = ['feat', 'fix', 'tweak', 'refactor', 'style', 'docs', 'test', 'build', 'tool', 'deps', 'misc'];
	if (validTypes.every(validType => validType !== givenType)) {
		return new Error(`Commit title has invalid type: ${givenType}.\n`
			+ `\tValid types include: ${validTypes}`);
	}
}

function verifyScope (givenScope) {
	if (givenScope) {
		const validScopes = [
			'framework',
			'day0',
			'lifecycle',
			'admin',
			'assets',
			'assets/360',
			'adv',
			'adv/sa',
			'adv/sa/360',
			'adv/fn',
			'adv/fn/360',
			'adv/pb',
			'adv/pb/360',
			'prob-res',
			'prob-res/rma',
			'prob-res/rma/360',
			'prob-res/oc',
			'prob-res/rma/360',
			'ins',
			'ins/sw',
			'ins/sw/360',
			'ins/rcc',
			'ins/rcc/360',
		];
		if (validScopes.every(validScope => validScope !== givenScope)) {
			return new Error(`Commit title has invalid scope: ${givenScope}.\n`
				+ `\tValid scopes include: ${validScopes}`);
		}
	}
	// else, giving a scope is optional anyway
}

/**
 * We don't want to use the provided tagger.
 * It has inconsistencies between capitalized and uncapitalized verbs.
 * There may be scenarios where those discrepancies are relevant,
 * but not ours.
 * Therefore, we'll combine both to increase the likelihood we will get
 * an accurate reading on a verb.
 */
function getAllTags (word) {
		const tagger = new Tagger();
		extendLexicon(tagger);
		const allTags = { };
		if (tagger.lexicon[word]) {
			tagger.lexicon[word].forEach(tag => allTags[tag] = true);
		}
		if (tagger.lexicon[word.toLowerCase()]) {
			tagger.lexicon[word.toLowerCase()].forEach(tag => allTags[tag] = true);
		}
		const results = Object.keys(allTags);
		if (results.length > 0) {
			return results;
		}
		throw new Error(`First word of description, '${word}', is not in the lexicon! Please add it in extendPOSLexicon.js and include that change as part of your commit.`);
}

function verifyDescription (description, bodyAndTitleText) {
	const lexer = new Lexer();
	const firstWord = lexer.lex(description)[0];
	const tags = getAllTags(firstWord);
	extendVocabulary(spellChecker);

	const misspelledWords = bodyAndTitleText.split(' ').filter(word => {
		return spellChecker.isMisspelled(word) && word.split('')[0] !== '`';
	});

	if (tags.every(tag =>  tag !== 'VBD')) {
		return new Error(`First word of description, '${firstWord}' (tags: ${tags}), does not appear to be a verb in the past tense.\nThis is so the commit log can read like a history.`);
	} else if (misspelledWords.length) {
		return new Error(`There appears to be a spelling mistake${misspelledWords.length > 1 ? 's' : ''}.\nMisspelled: ${misspelledWords.join(', ')}.\n\nHint: If you need to use a file name or unrecognizable word please put in backticks. \`\``);
	}
}

function checkCommit (commitTitle, commitTitleBodyBreak = '', commitBody = [], hash) {
	let errors = [];

	if (commitTitle.slice(0, 5) === 'Merge') {
		console.log(`Commit ${hash} is a merge commit.`);
		return;
	}

	// Find pr number in commit title
	const prNum = /\s\(#[0-9]*\)/;
	const prNumMatch = prNum.exec(commitTitle)
	if (commitTitle.length > 80) {
		if (prNumMatch === null || commitTitle.slice(0, prNumMatch.index).length > 80) {
			errors.push(new Error(`The title of the commit ${hash} exceeds 80 characters.`));
		}
	} 

	if (commitBody.length) {
		let longLineNumbers = commitBody.map((line, i) => { if (line.length > 80) return i + 1; });
		longLineNumbers = longLineNumbers.filter(Boolean);
		if (longLineNumbers.length) {
			errors.push(new Error(`Line${longLineNumbers.length > 1 ? 's' : ''} ${longLineNumbers.join(', ')} ${longLineNumbers.length > 1 ? 'are' : 'is'} over 80 characters`));
		}
	}

	const regex = /^\b(?<type>.*)\b(\(\b(?<scope>.*)\b\))?: (?<description>.*)$/g;
	const regexMatch = regex.exec(commitTitle);

	const bodyAndTitleText = commitTitle.split(':')[1] + ' ' + commitBody.join(' ');
	
	if (!regexMatch) {
		errors.push(new Error(`The title of commit ${hash} does not match the required format.`));
	} else if (commitTitleBodyBreak.length && commitBody.length) {
		errors.push(new Error('There appears to be no new line between the title of the commit and the body.'));
	} else {
		errors.push(verifyType(regexMatch.groups.type));
		// @TODO add verify scope errors.push(verifyScope(regexMatch.groups.scope));
		errors.push(verifyDescription(regexMatch.groups.description, bodyAndTitleText));
	}

	errors = errors.filter(error => !!error);
	if (errors.length > 0) {
		console.log(colors.yellow(`\nErrors have been detected when validating your commit. Please refer to ${path.resolve(__dirname, '../CONTRIBUTING.md')} for the proper format\n`));
		throw new Error(errors.join('\n'));
	}

	console.log(colors.green(`Commit ${hash} looks good. 🚀`));
}

(async function() {
	await checkGitCommits();
})();
