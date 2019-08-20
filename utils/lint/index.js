#!/usr/bin/env node

/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const yargs = require('yargs');

const baseDir = process.cwd();
const apolloLintDir = __dirname;
const eslintDir = path.join(__dirname, './eslint-config-javascript');
let processStatus = 0;

/**
 * Parsed the gitignore file and returns valid files to lint
 *
 * @returns {string[]} Array of strings to parse
 */
function parseGitIgnore () {
	let gitIgnore = '';
	const ignorePath = path.join(baseDir, '.gitignore');
	const ignoreExists = fs.existsSync(ignorePath);

	if (ignoreExists) {
		gitIgnore = fs.readFileSync(path.join(baseDir, '.gitignore'), 'utf-8');
	}
	const ignored = [];

	gitIgnore.split(/\r?\n/).forEach(line => {
		const firstChar = line.charAt(0);

		if (line.trim() !== '' && firstChar !== '#') {
			let pushLine = line;
			if (firstChar === '/' || firstChar === '!' || firstChar === '*') {
				pushLine = line.substring(1, line.length);
			}

			ignored.push(pushLine.split('/')[0]);
		}
	});

	ignored.push('.git', '.gitlab', '.eslintrc.js');

	return [...new Set(ignored)];
}

/**
 * Uses the parsed git ignore file to generate a listing of files to lint
 *
 * @param {string[]} types The types to add in (ie ['html', 'js'])
 * @returns {object} Object with files to lint separated by extension
 */
function getFilesForLinting (types) {
	const files = {};

	const ignoredFiles = parseGitIgnore();
	const items = fs.readdirSync(baseDir);
	const filtered = items.filter(item => !ignoredFiles.includes(item));

	filtered.forEach(item => {
		const stat = fs.statSync(item);

		if (stat.isDirectory()) {
			types.forEach(type => {
				if (!files[type]) {
					files[type] = [];
				}
				files[type].push(`${item}/**/*.${type}`);
			});
		} else {
			const ext = path.extname(item).split('.')[1];
			if (ext && ext.trim() !== '') {
				if (!files[ext]) {
					files[ext] = [];
				}
				files[ext].push(item);
			}
		}
	});

	return files;
}

/**
 * Runs the given linter command for the given paths, appending each path to the end of the command
 * @param {string[]} paths paths to run the command against, appended individually at the end
 * @param {string} command exec string to run
 */
function runLinter (paths, command) {
	paths.forEach(p => {
		const lintCommand = `${command} "${p}"`;
		console.log('\x1b[44m%s\x1b[0m', `\nLinting path ${p}`);
		console.log(`Lint Command: ${lintCommand}`);

		try {
			const lint = spawnSync(lintCommand, {
				encoding: 'utf-8',
				shell: true,
				stdio: ['inherit', 'inherit', 'pipe'],
			});

			if (processStatus < 1
				&& lint.stderr
				&& (lint.stderr.indexOf('No files match') !== -1
				|| lint.stderr.indexOf('Cannot find module \'typescript\'') !== -1)) {
				processStatus = 0;
			} else if (processStatus < 1) {
				processStatus = lint.status;
			}
		} catch (err) {
			console.error(`Errored running ${lintCommand}`, err);
		}
	});
}

/**
 * The linter for HTML, passes the paths and htmlhint command to runLinter
 * @param {string[]} paths paths to run the command against
 */
function htmlLinter (paths) {
	const rulesDir = path.join(apolloLintDir, 'HTML', 'rules');
	const configDir = path.join(apolloLintDir, 'HTML', 'defaults.json');
	runLinter(paths, `npx htmlhint --rulesdir ${rulesDir} --config ${configDir}`);
}

/**
 * The linter for javascript, passes the paths and eslint command to runLinter
 * @param {string[]} paths paths to run the command against
 * @param {string} lintModule the module used for javascript linting
 * 	(ie javascript resolves to eslint-config-javascript)
 */
function javascriptLinter (paths, lintModule) {
	const config = path.join(eslintDir, lintModule);
	runLinter(paths, `npx eslint --config ${config} --no-eslintrc --no-inline-config`);
}

/**
 * The linter for typescript, passes the paths and tslint command to runLinter
 * @param {string[]} paths paths to run the command against
 */
function typescriptLinter (paths) {
	const items = fs.readdirSync(baseDir);
	const tsconfig = items.filter(item => (item.indexOf('tsconfig') !== -1 && item.indexOf('tsconfig.spec') === -1))[0];
	const configDir = path.join(apolloLintDir, 'ts');
	let project = '';

	if (tsconfig) {
		project = `--project ${tsconfig}`;
	}

	runLinter(paths, `npx tslint ${project} --config ${configDir} --format stylish`);
}

/**
 * The linter for styles, passes the paths and stylelint command to runLinter
 * @param {string[]} paths paths to run the command against
 */
function styleLinter (paths) {
	runLinter(paths, 'npx stylelint --config ./utils/lint/style');
}

/**
 * Function which will return the types based on if * is passed or separate paths
 *
 * @param {yargs.argv} argv representation of yargs argv which contains commands and arguments
 * @param {string[]} types types to lint ['html', 'js']
 * @returns {object} Object with files to lint separated by extension
 */
function getPaths (argv, types) {
	const paths = Array.isArray(argv.path) ? argv.path : argv.path.split(',');

	if (paths.includes('*')) {
		return getFilesForLinting(types);
	}

	const files = {};
	types.forEach(type => {
		files[type] = [];

		paths.forEach(p => {
			const ext = path.extname(p).split('.')[1] || '*';
			let adjPath = p;
			let isDirectory = false;

			try {
				const stats = fs.statSync(path.join(baseDir, p));
				isDirectory = stats.isDirectory();
			} catch (e) {
				// We're not a directory or we don't exist
				isDirectory = false;
			}

			if (isDirectory) {
				adjPath = path.join(p, '**', '*');
			}

			if (ext === type || ext === '*') {
				files[type].push((ext === '*') ? `${adjPath}.${type}` : p);
			}
		});
	});

	return files;
}

/**
 * Resolves the types passed in from arguments
 *
 * @param {yargs.argv} argv representation of yargs argv which contains commands and arguments
 * @returns {string[]} string array of types ['html', 'js']
 */
function getTypes (argv) {
	const types = Array.isArray(argv.type) ? argv.type : argv.type.split(',');

	return (types.includes('*') ? ['html', 'ts', 'js', 'scss'] : types);
}

/**
 * Initialization function which will accept the yargs argument
 * and then build the types/files and pass
 * it to the correct linters
 * @param {yargs.argv} argv representation of yargs argv which contains commands and arguments
 * @param {string} type optional argument which will specify the types,
 * 	if not it will fetch the types from the arguments
 */
function typeLinter (argv, type) {
	const types = (type) ? [type] : getTypes(argv);
	const paths = getPaths(argv, types);

	types.forEach(t => {
		let parseType = t;
		if (t === 'jsWeb') {
			parseType = 'js';
		}
		if (paths[parseType] && paths[parseType].length) {
			console.log('\x1b[44m%s\x1b[0m', `\nLinting ${parseType} at paths:`);
			console.log(paths[parseType]);
			console.log('\n');

			switch (parseType) {
				case 'js':
					return javascriptLinter(paths.js, (t === 'js') ? 'index.js' : 'web.js');
				case 'html':
					return htmlLinter(paths.html);
				case 'ts':
					return typescriptLinter(paths.ts);
				case 'scss':
					return styleLinter(paths.scss);
				default:
					console.log(`\nNo linter available for ${parseType}, skipping\n`);
			}
		}
	});
	process.exit(processStatus);
}

/**
 * Initialization function for parsing arguments passed to apolloLint
 * @returns {object} yargs commands
 */
function parseArguments () {
	return yargs
		.usage('Usage: $0 <command>')

		.command('lint', 'Lint the files given the types and paths', y => {
			const args = y
				.usage('$0 lint --type=*')
				.usage('$0 lint --type=js,ts')
				.default('type', '*')
				.argv;

			typeLinter(args);
		})
		.example('$0 lint --type=js,ts --path=*', 'lint the given types in the given paths')

		.command(
			'html', 'Lint the HTML files in the given paths',
			() => {}, args => typeLinter(args, 'html'),
		)
		.example('$0 html --path=*', 'lint the given html in the paths')

		.command(
			'js', 'Lint the javascript files in the given paths',
			() => {}, args => typeLinter(args, 'js'),
		)
		.example('$0 js --path="src/**/*.js"', 'lint the given js in the paths')

		.command(
			'jsWeb', 'Lint the javascript files in the given paths with the web rules',
			() => {}, args => typeLinter(args, 'jsWeb'),
		)
		.example('$0 jsWeb --path="src/**/*.js"', 'lint the given js in the paths')

		.command(
			'ts', 'Lint the typescript files in the given paths',
			() => {}, args => typeLinter(args, 'ts'),
		)
		.example('$0 ts --path="src/**/*.ts"', 'lint the given ts in the paths')

		.command(
			'scss', 'Lint the scss files in the given paths',
			() => {}, args => typeLinter(args, 'scss'),
		)
		.example('$0 scss --path="src/**/*.scss"', 'lint the given scss in the paths')
		.default('path', '*')

		.argv;
}

parseArguments();
