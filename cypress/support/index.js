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
