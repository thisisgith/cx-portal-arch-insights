
const i18n = require('../../src/assets/i18n/en-US.json');

const validCaseID = '699159996';

describe('Case Detail Spec', () => {
	context('Case List View', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('PBC-231 Case List Assets', () => {
			// PBC-231 - Check for expected assets on the case listing
			cy.getByAutoId('Facet-Problem Resolution').click();
			cy.getByAutoId('OPEN CASESTab', { timeout: 10000 }).should('exist');
			cy.getByAutoId('RMAsTab').should('exist');
			cy.getByAutoId('rmaCasesHeader').should('exist');
			cy.getByAutoId('rmaShowingXcasesHeader').should('exist');
			cy.getByAutoId('caseSearchBox').should('exist');
		});

		it('PBC-231 Case List Table Contents', () => {
			cy.getByAutoId('Facet-Problem Resolution').click();
			//  Verify auto-id's for each column header
			cy.getByAutoId('Severity-Header', { timeout: 10000 })
				.should('exist').should('contain', i18n._RMACaseSeverity_);
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

		it('PBC-231 Case List Invalid Case ID', () => {
			// PBC-231 - Check for "invalid" message.
			const invalidSearchVal = 'abcdefghij';
			cy.getByAutoId('Facet-Problem Resolution').click();
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

		it('PBC-233 Case Details Click on case from List', () => {
			// PBC-233
			cy.getByAutoId('Facet-Problem Resolution').click();
			cy.getByAutoId('caseSearchBox', { timeout: 10000 }).should('exist').clear()
				.type(validCaseID.concat('{enter}'));
			cy.getByAutoId('Case ID-Cell', { timeout: 10000 }).click();
			cy.get('details-panel').should('be.visible');
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
			cy.getByAutoId('CloseDetails').click();
		});

		it('PBC-233 Closes 360 view when leaving the case page', () => {
			// PBC-233
			cy.getByAutoId('Facet-Problem Resolution').click();
			cy.getByAutoId('caseSearchBox', { timeout: 6000 }).should('exist').clear()
				.type(validCaseID.concat('{enter}'));
			cy.getByAutoId('Case ID-Cell', { timeout: 6000 }).click(); // case will load in app-panel360 details-panel
			cy.get('details-panel').should('be.visible');
			cy.getByAutoId('CloseDetails').click();
			cy.get('details-panel').should('not.be.visible');
		});

		it('PBC-233 Case Details Verify Buttons Exist', () => {
			// PBC-233
			cy.getByAutoId('Facet-Problem Resolution').click();
			cy.getByAutoId('caseSearchBox', { timeout: 6000 }).should('exist').clear()
				.type(validCaseID.concat('{enter}'));
			cy.getByAutoId('Case ID-Cell', { timeout: 6000 }).click(); // case will load in app-panel360 details-panel
			cy.get('details-panel', { timeout: 10000 }).should('be.visible');
			cy.getByAutoId('CaseAttachFile').should('exist');
			cy.getByAutoId('CaseAddNote').should('exist');
			cy.getByAutoId('CloseDetails').click();
		});
	});
	context('Case Detail Notes and Files', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});
		beforeEach(() => {
			cy.loadApp('/solution/resolution');
			cy.getByAutoId('Facet-Problem Resolution').click();
			cy.getByAutoId('caseSearchBox', { timeout: 6000 }).should('exist').clear()
				.type(validCaseID.concat('{enter}'));
			cy.getByAutoId('Case ID-Cell', { timeout: 6000 }).click(); // case will load in app-panel360 details-panel
			cy.get('details-panel').should('be.visible');
		});


		it('PBC-234 Case Details Notes Tab, Add a Note', () => {
			const currDatestamp = new Date().getTime();
			// cy.log(`current date is ${currDatestamp}`);

			cy.getByAutoId('notesTab').click();
			// Add a case note
			cy.getByAutoId('CaseAddNote').click();
			cy.getByAutoId('title').should('exist').clear()
				.type(`Title for current date of ${currDatestamp}`);
			cy.getByAutoId('description').should('exist').clear()
				.type(`Description for current date of ${currDatestamp}`);
			cy.getByAutoId('AddNote', { timeout: 10000 }).click();
			// Verify case note was added, look in app-case-notes for string
			cy.get('app-case-notes div')
				.should('contain', `Description for current date of ${currDatestamp}`);
			cy.get('app-case-notes div')
				.should('contain', `Title for current date of ${currDatestamp}`);
			cy.getByAutoId('CloseDetails').click();
		});

		it('PBC-234 Case Details Notes: Cancel Adding a note', () => {
			const currDatestamp = new Date().getTime();
			// cy.log(`current date is ${currDatestamp}`);

			cy.getByAutoId('notesTab').click();
			// Add a case note
			cy.getByAutoId('CaseAddNote').click();
			cy.getByAutoId('title').should('exist').clear()
				.type(`Title for current date of ${currDatestamp}`);
			cy.getByAutoId('description').should('exist').clear()
				.type(`Description for current date of ${currDatestamp}`);
			cy.getByAutoId('CancelAddNote', { timeout: 10000 }).click();
			// Verify case note was NOT added, look in app-case-notes for string
			cy.get('app-case-notes div')
				.should('not.contain', `Description for current date of ${currDatestamp}`);
			cy.get('app-case-notes div')
				.should('not.contain', `Title for current date of ${currDatestamp}`);
			cy.getByAutoId('CloseDetails').click();
		});

		it('PBC-232 Case Detail Attachments - List & Download', () => {
			// Verify elements of the files tab
			cy.getByAutoId('filesTab', { timeout: 10000 }).click();
			cy.getByAutoId('Name-Header').should('exist');
			cy.getByAutoId('Type-Header').should('exist');
			cy.getByAutoId('Size-Header').should('exist');
			cy.getByAutoId('DownloadUrl').should('have.length.gte', 0)
				.and('have.attr', 'href');
			cy.getByAutoId('CloseDetails').click();
		});

		it('PBC-345 Case Detail Attachments - Upload - Cancel and X buttons', () => {
			cy.getByAutoId('CaseAttachFile').click();
			cy.getByAutoId('CSC-UploadFilesDialogTitle').should('exist');
			cy.getByAutoId('CSC-UploadFilesDialogSubmit').should('exist');

			cy.getByAutoId('CSC-UploadFilesDialogCancel').click();

			cy.getByAutoId('CaseAttachFile', { timeout: 10000 }).click();
			cy.getByAutoId('CSC-UploadFilesDialogClose').click();
		});

		it('PBC-345 Case Detail Attachments - Upload - Attach a file', () => {
			const pdfFile = './sampleFiles/20kFile.pdf';
			// const zipFile = './sampleFiles/20kFile.zip';
			// const csvFile = './sampleFiles/20kFile.csv';
			// const xlsxFile = './sampleFiles/20kFile.xlsx';
			// const txtFile = './sampleFiles/20kFile.txt';

			cy.getByAutoId('CaseAttachFile').click();

			cy.fixture(pdfFile).then(fileContent => {
				cy.get('h4').upload( // TODO cui-dropzone would be better using force:true or something better than h4
					// cui-dropzone has size of 0 x 0 so can't be clicked on
					{ fileContent, fileName: '20kFile.pdf', mimeType: 'application/pdf' },
					{ subjectType: 'drag-n-drop' },
				);
			});
			// Verify various assets on drag-n-drop screen
			cy.getByAutoId('CSC-UploadDescriptionValue').should('have.length', 3);
			// Verify assets after 'single' selection
			cy.get('[ng-reflect-value="single"]').click({ force: true }); // TODO is force true fine? better way?
			cy.getByAutoId('CSC-FileCategory').should('exist');
			cy.getByAutoId('CSC-FileDescription').should('exist');
			cy.getByAutoId('CSC-UploadFilesDialogTitle').should('exist');
			cy.getByAutoId('CSC-UploadFilesDialogSubmit').should('exist');
			// Verify assets after 'individual' selection
			cy.get("[ng-reflect-value='individual']").click({ force: true }); // TODO is force true fine? better way?
			cy.get('legend').should('exist');
			cy.getByAutoId('CSC-SelectFile').should('exist');
			cy.getByAutoId('CSC-FileCategory').should('exist');
			cy.getByAutoId('CSC-FileDescription').should('exist');
			// Verify assets after default selection
			cy.get('[ng-reflect-value="none"]').click({ force: true }); // TODO is force true fine? better way?
			cy.getByAutoId('CSC-UploadFilesDialogSubmit').click();

			cy.get('[class="modal__content"]').should('contain.text', 'Upload Status');
			cy.get('[class="modal__content"]').should('contain.text', 'Upload Details');
			cy.get('[ng-reflect-value="100%"]', { timeout: 10000 }).should('exist');
			cy.getByAutoId('CSC-UploadFilesDialogClose').click();
		});
	});
});
