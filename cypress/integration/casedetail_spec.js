
const i18n = require('../../src/assets/i18n/en-US.json');

describe('Case Detail Spec', () => {
	context('Case List View', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Case List', () => {
			// PBC-231 - Check for expected assets
			cy.getByAutoId('Facet-Problem Resolution').should('exist').click(); // refresh after making a mock change
			// cy.server();
			// cy.route('**/esps/search/suggest/cdcpr01zad?*').as('serial');
			cy.getByAutoId('OPEN CASESTab').should('exist');
			cy.getByAutoId('RMAsTab').should('exist');
			cy.getByAutoId('rmaCasesHeader').should('exist');
			cy.getByAutoId('rmaShowingXcasesHeader').should('exist');
			cy.getByAutoId('caseSearchBox').should('exist');
			// cui-table build means cases in the table rows don't have a data-auto-id
			// waiting for 2 MR's (add autoid's)
		});
		it('Case List Invalid Case ID', () => {
			// PBC-231 - Check for "invalid" message.
			const invalidSearchVal = 'abcdefghij';
			cy.getByAutoId('Facet-Problem Resolution').should('exist').click();
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('case');
			cy.getByAutoId('caseSearchBox').should('exist').clear()
				.type(invalidSearchVal.concat('{enter}'));
			cy.getByAutoId('invalidCaseNumber').should('exist').should('contain', i18n._RMAInvalidCaseNo_);
			cy.getByAutoId('caseSearchBox').should('exist').clear();
		});
	});
	context.skip('Case Detail View', () => {	
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Case Details Click on case from List', () => {
			// PBC-233
		});

		it('Case Details Click on case', () => {
			// PBC-233
		});
	});
});