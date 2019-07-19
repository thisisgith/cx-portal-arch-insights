// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

require('@apollo/cypress-util');
// const path = require('path')

/**
 * Mocha's root scope afterEach hook
 * Note: Cannot use arrow function here without breaking the scope of `this`.
 */
afterEach(function afterEachHook () {
	cy.task('log', Cypress.env('CI'));
	cy.task('log', Cypress.env('CI_JOB_URL'));
	// const test = this;
	// if (test.currentTest.state === 'failed') {
	// 	const report = {
	// 		error: test.currentTest.err.message,
	// 		parent: test.currentTest.parent.title,
	// 		spec: path.basename(global.window.location.pathname),
	// 		state: test.currentTest.state,
	// 		test: test.currentTest.title,
	// 	};
	// 	cy.request('POST', 'http://localhost:8888/report', report); // TODO: real URL
	// }
});

// Whitelist ObSSOCookie from getting cleared before each test
Cypress.Cookies.defaults({
	whitelist: ['ObSSOCookie'],
});

// Use the data-auto-id in the selector playground if available
Cypress.SelectorPlayground.defaults({
	onElement: $el => {
		const customId = $el.attr('data-auto-id');

		if (customId) {
			return `[data-auto-id="${customId}"]`;
		}
	},
});
