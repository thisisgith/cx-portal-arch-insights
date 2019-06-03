/**
* Launches the app under test
*/
Cypress.Commands.add('loadApp', () => {
	cy.visit('/pbc/');
});

Cypress.Commands.add('waitForAppLoading', (timeout = 30000) => {
	cy.window({ timeout }).should('have.property', 'loading', false);
});
