
// const i18n = require('../../src/assets/i18n/en-US.json');

describe('Case Detail Spec', () => {
	context('Case List View', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Case Details ', () => {
			// PBC-TBD
			// const serialVal = 'FOX1306GFKH';
			cy.getByAutoId('Facet-Problem Resolution').should('exist').click(); // refresh after making a mock change
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('serial');
		});
	});
});
