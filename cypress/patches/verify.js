/**
 * Overrides the Cypress 'verify' command that is used to validate its binary
 * This will automatically pass no matter what, effectively skipping the check
 * See:
 * https://github.com/cypress-io/cypress/issues/4625
 * https://github.com/cypress-io/cypress/issues/4624
 */

const start = function start () {
	return new Promise(resolve => resolve(true));
};

module.exports = { start };
