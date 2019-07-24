
// const i18n = require('../../src/assets/i18n/en-US.json');

describe('Case Detail Spec', () => {
	context('Case List View', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it.skip('Case Details ', () => {
			// PBC-TBD
			cy.getByAutoId('Facet-Problem Resolution').should('exist').click(); // refresh after making a mock change
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('serial');
			cy.getByAutoId('OPEN CASESTab').should('exist');
			cy.getByAutoId('RMASTab').should('exist');
		});
	});
});