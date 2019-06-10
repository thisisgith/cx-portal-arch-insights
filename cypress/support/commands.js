/**
* Launches the app under test
*/
Cypress.Commands.add('loadApp', (path = '/') => {
	cy.visit(`pbc${path}`);
});

/**
 * Waits for the app to fully load
 * @param {number} timeout Time in milliseconds to wait
 */
Cypress.Commands.add('waitForAppLoading', (timeout = 30000) => {
	cy.window({ timeout }).should('have.property', 'loading', false);
});
