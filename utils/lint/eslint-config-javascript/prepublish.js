#!/usr/bin/env node

/* eslint-disable no-console */

const { execSync } = require('child_process');

const publishedVersion = execSync(
	'npm view @apollo/eslint-config-javascript version',
	{
		encoding: 'utf-8',
	}
);

const parsedConfig = require('./package.json');

if (parsedConfig.version.trim() === publishedVersion.trim()) {
	console.log('Not Publishing, current published version is equal');
} else {
	const publish = execSync('npm publish');
	console.log(publish);
}
