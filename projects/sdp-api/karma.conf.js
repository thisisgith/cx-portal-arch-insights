// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const karmaConfig = require('@apollo/configs/karma');
const path = require('path');

const eachValue = 50;
const globalValue = 75;
const each = {
	branches: eachValue,
	functions: eachValue,
	lines: eachValue,
	statements: eachValue,
};
const global = {
	branches: globalValue,
	functions: globalValue,
	lines: globalValue,
	statements: globalValue,
};

module.exports = config => karmaConfig(config, path.join(__dirname, '../../coverage/sdp'), { each, global });
