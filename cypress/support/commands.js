/**
* Launches the app under test
*/
Cypress.Commands.add('loadApp', () => {
	cy.visit('/pbc/');
});

/**
 * Waits for the specified loading property in the app to be set to false (finished loading)
 * @param {String} property - Property to check to be set to false
 * @param {Integer} timeout - Time in milliseconds to wait before failing
 */
Cypress.Commands.add('waitForAppLoading', (property = 'loading', timeout = 30000) => {
	cy.window({ timeout }).should('have.property', property, false);
});
