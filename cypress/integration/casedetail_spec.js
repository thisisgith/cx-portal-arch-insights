
const i18n = require('../../src/assets/i18n/en-US.json');

describe('Case Detail Spec', () => {
	context('Case List View', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Case List Assets', () => {
			// PBC-231 - Check for expected assets on the case listing
			cy.getByAutoId('Facet-Problem Resolution').should('exist').click();
			cy.getByAutoId('OPEN CASESTab').should('exist');
			cy.getByAutoId('RMAsTab').should('exist');
			cy.getByAutoId('rmaCasesHeader').should('exist');
			cy.getByAutoId('rmaShowingXcasesHeader').should('exist');
			cy.getByAutoId('caseSearchBox').should('exist');
		});

		it('Case List Table Contents', () => {
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
	context('Case Detail View', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Case Details Click on case from List', () => {
			// PBC-233
			const validCaseID = '686350448';
			cy.getByAutoId('Facet-Problem Resolution').should('exist').click();
			cy.getByAutoId('caseSearchBox').should('exist').clear()
				.type(validCaseID.concat('{enter}'));
			cy.wait(3000);
			cy.getByAutoId('Case ID-Cell').should('exist').click();
			cy.wait(3000);
			cy.get('app-panel360').should('be.visible');
			cy.getByAutoId('caseTechnology').should('exist').should('contain', i18n._RMACaseTechnology_.toUpperCase());
			cy.getByAutoId('caseProbType').should('exist').should('contain', i18n._RMACaseProblemType_.toUpperCase());
			cy.getByAutoId('caseAsset').should('exist').should('contain', i18n._RMACaseAsset_.toUpperCase());
			cy.getByAutoId('caseSW').should('exist').should('contain', i18n._RMACaseSoftwareVersion_.toUpperCase());
			cy.getByAutoId('caseContract').should('exist').should('contain', i18n._RMACaseContract_.toUpperCase());
			cy.getByAutoId('caseTracking').should('exist').should('contain', i18n._RMACaseTrackingNumber_.toUpperCase());
			cy.getByAutoId('caseOwnerEmail').should('exist').should('contain', i18n._RMACaseOwnerEmail_.toUpperCase());
			cy.getByAutoId('caseTacEng').should('exist').should('contain', i18n._RMACaseTacEngineer_.toUpperCase());
			cy.getByAutoId('caseSummaryTitle').should('exist').should('contain', i18n._RMACaseSummaryTitle_.toUpperCase());
			cy.getByAutoId('caseDescription').should('exist').should('contain', i18n._RMACaseDescription_.toUpperCase());
			cy.getByAutoId('CloseDetails').should('exist').click();
		});

		it('Closes 360 view when leaving the case page', () => {
			// PBC-233
			const validCaseID = '686350448';
			cy.getByAutoId('Facet-Problem Resolution').should('exist').click();
			cy.getByAutoId('caseSearchBox').should('exist').clear()
				.type(validCaseID.concat('{enter}'));
			cy.wait(3000);
			cy.getByAutoId('Case ID-Cell').should('exist').click(); // case will load in app-panel360
			cy.wait(3000);
			cy.get('app-panel360').should('be.visible');
			cy.getByAutoId('CloseDetails').should('exist').click();
			cy.get('app-panel360').should('not.be.visible');
		});

		it('Case Details Verify Buttons Exist', () => {
			// PBC-233
			const validCaseID = '686350448';
			cy.getByAutoId('Facet-Problem Resolution').should('exist').click();
			cy.getByAutoId('caseSearchBox').should('exist').clear()
				.type(validCaseID.concat('{enter}'));
			cy.wait(3000);
			cy.getByAutoId('Case ID-Cell').should('exist').click(); // case will load in app-panel360
			cy.wait(3000);
			cy.get('app-panel360').should('be.visible');
			cy.getByAutoId('CaseAttachFile').should('exist');
			cy.getByAutoId('CaseAddNote').should('exist');
			cy.getByAutoId('CloseDetails').should('exist').click();
		});
	});
	context('Case Detail Notes', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Case Details Notes Tab, Add a Note', () => {
			// PBC-234
			const validCaseID = '686350448';
			const currDatestamp = new Date().getTime();
			// cy.log(`current date is ${currDatestamp}`);

			cy.getByAutoId('Facet-Problem Resolution').should('exist').click();
			cy.getByAutoId('caseSearchBox').should('exist').clear()
				.type(validCaseID.concat('{enter}'));
			cy.wait(3000);
			cy.getByAutoId('Case ID-Cell').should('exist').click(); // case will load in app-panel360
			cy.wait(3000);
			cy.get('app-panel360').should('be.visible');
			cy.getByAutoId('notesTab').should('exist').click();
			// Add a case note
			cy.getByAutoId('CaseAddNote').should('exist').click();
			cy.getByAutoId('title').should('exist').clear()
				.type(`Title for current date of ${currDatestamp}`);
			cy.getByAutoId('description').should('exist').clear()
				.type(`Description for current date of ${currDatestamp}`);
			cy.getByAutoId('AddNote').should('exist').click();
			cy.wait(6000);
			// Verify case note was added, look in app-case-notes for string
			cy.get('app-case-notes div')
				.should('contain', `Description for current date of ${currDatestamp}`);
			cy.get('app-case-notes div')
				.should('contain', `Title for current date of ${currDatestamp}`);
			cy.getByAutoId('CloseDetails').click();
		});

		it('Case Details Notes: Cancel Adding a note', () => {
			// TODO skipping until we have a userID with cases (swtg.test.1 does not)
			// svorma1 has cases but is not the user in the pipeline
			// PBC-234
			const validCaseID = '686350448';
			const currDatestamp = new Date().getTime();
			// cy.log(`current date is ${currDatestamp}`);
			cy.loadApp('/solution/resolution');
			cy.getByAutoId('Facet-Problem Resolution').should('exist').click();
			cy.getByAutoId('caseSearchBox').should('exist').clear()
				.type(validCaseID.concat('{enter}'));
			cy.wait(3000);
			cy.getByAutoId('Case ID-Cell').should('exist').click(); // case will load in app-panel360
			cy.wait(3000);
			cy.get('app-panel360').should('be.visible');
			cy.getByAutoId('notesTab').should('exist').click();
			// Add a case note
			cy.getByAutoId('CaseAddNote').should('exist').click();
			cy.getByAutoId('title').should('exist').clear()
				.type(`Title for current date of ${currDatestamp}`);
			cy.getByAutoId('description').should('exist').clear()
				.type(`Description for current date of ${currDatestamp}`);
			cy.getByAutoId('CancelAddNote').should('exist').click();
			cy.wait(8000);
			// Verify case note was NOT added, look in app-case-notes for string
			cy.get('app-case-notes div')
				.should('not.contain', `Description for current date of ${currDatestamp}`);
			cy.get('app-case-notes div')
				.should('not.contain', `Title for current date of ${currDatestamp}`);
			cy.getByAutoId('CloseDetails').click();
		});
	});
});
