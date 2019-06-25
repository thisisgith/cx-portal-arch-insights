const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

(function main () {
	const dirList = fs.readdirSync(path.join(__dirname, '../src/assets/i18n'));
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.stdoutMuted = true;
	rl.question(`
NAME
	clean-i8n-keys.js

SYNOPSIS
	node utils/clean-i18n-keys.js

DESCRIPTION
	Finds keys in the i18n json files that do not appear
	in any files inside the ./src directory, and deletes them
	from the i18n json file.


Warning: This will rewrite the following files in src/assets/i18n: ${dirList}.
Do you wish to continue? [y/n] `, response => {
		if (response === 'y' || response === 'Y') {
			dirList.forEach(filename => {
				const i18nFileName = path.join(__dirname, `../src/assets/i18n/${filename}`);
				const i18nFile = JSON.parse(fs.readFileSync(i18nFileName));
				const keys = Object.keys(i18nFile);
				const orphans = [];
				keys.forEach(key => {
					try {
						execSync(`find ./src \\( -type d \\( -path ./src/assets \\) -prune \\) -o -type f -exec grep '${key}' {} +`);
					} catch (err) {
						orphans.push(key);
					}
				});
				orphans.forEach(key => {
					delete i18nFile[key];
				});
				fs.writeFileSync(i18nFileName, JSON.stringify(i18nFile, null, 4));
			});
			process.exit(0);
		} else {
			process.exit(0);
		}
	});
}());
