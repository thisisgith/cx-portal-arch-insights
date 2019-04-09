/**
* Launches the app under test
*/
Cypress.Commands.add('loadApp', () => {
	cy.visit('/pbc/');
});

/**
* Gets an element using it's data-auto-id attribute.
* @param {String} id - The data-auto-id attribute's value used to locate an element
* @param {Object} [options] - Additional options to pass to cy.get()
*/
Cypress.Commands.add('getByAutoId', (id, options) => cy.get(`[data-auto-id="${id}"]`, options));
