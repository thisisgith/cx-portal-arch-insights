const path = require('path');
const karmaJasmine = require('karma-jasmine');
const karmaChromeLauncher = require('karma-chrome-launcher');
const karmaHtmlReporter = require('karma-jasmine-html-reporter');
const karmaIstanbulReporter = require('karma-coverage-istanbul-reporter');
const karmaSpecReporter = require('karma-spec-reporter');
const buildAngular = require('@angular-devkit/build-angular/plugins/karma');

module.exports = config => {
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			karmaJasmine,
			karmaChromeLauncher,
			karmaHtmlReporter,
			karmaIstanbulReporter,
			karmaSpecReporter,
			buildAngular,
		],
		client: {
			clearContext: false, // leave Jasmine Spec Runner output visible in browser
			jasmine: {
				random: true,
				oneFailurePerSpec: true,
				hideDisabled: true,
			},
		},
		coverageIstanbulReporter: {
			dir: path.join(__dirname, '../coverage'),
			thresholds: {
				each: {
					branches: 50,
					functions: 50,
					lines: 50,
					statements: 50,
				},
				global: {
					branches: 75,
					functions: 75,
					lines: 75,
					statements: 75,
				}
			},
			reports: ['html', 'lcovonly', 'text', 'text-summary', 'json', 'json-summary'],
			fixWebpackSourcePaths: true,
		},
		reporters: ['spec'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['Chrome'],
		browserNoActivityTimeout: 400000,
		browserDisconnectTimeout: 400000,
		browserDisconnectTolerance: 3,
		captureTimeout: 400000,
		singleRun: false,
	});
};
