
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
			cy.getByAutoId('Facet-Problem Resolution').should('exist').click();
			cy.getByAutoId('OPEN CASESTab').should('exist');
			cy.getByAutoId('RMAsTab').should('exist');
			cy.getByAutoId('rmaCasesHeader').should('exist');
			cy.getByAutoId('rmaShowingXcasesHeader').should('exist');
			cy.getByAutoId('caseSearchBox').should('exist');
		});

		it('Case List table contents', () => {
			cy.getByAutoId('Facet-Problem Resolution').should('exist').click();
			//  Verify auto-id's for each column header
			cy.getByAutoId('Severity-Header').should('exist').should('contain', i18n._RMACaseSeverity_);
			cy.getByAutoId('Case ID-Header').should('exist').should('contain', i18n._RMACaseID_);
			cy.getByAutoId('Device-Header').should('exist').should('contain', i18n._RMACaseDevice_);
			cy.getByAutoId('Summary-Header').should('exist').should('contain', i18n._RMACaseSummary_);
			cy.getByAutoId('Status-Header').should('exist').should('contain', i18n._RMACaseStatus_);
			cy.getByAutoId('Updated-Header').should('exist').should('contain', i18n._RMACaseUpdatedDate_);
			// Verify auto-id's for each row element
			cy.getByAutoId('severityValue').should('exist').should('have.length', 10);
			cy.getByAutoId('severityIcon').should('exist').should('have.length', 10);
			cy.getByAutoId('Case ID-Cell').should('exist').should('have.length', 10);
			cy.getByAutoId('Device-Cell').should('exist').should('have.length', 10);
			cy.getByAutoId('Summary-Cell').should('exist').should('have.length', 10);
			cy.getByAutoId('Status-Cell').should('exist').should('have.length', 10);
			// TODO need assert for updated-cell
			// cy.getByAutoId('caseUpdatedDate').should('exist').should('have.length', 10);
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
	context.skip('Case Detail Notes', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Case Details Notes test TBD', () => {
			// PBC-234
		});

		it('Case Details Notes test TBD', () => {
			// PBC-234
		});
	});
});
