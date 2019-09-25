import { FileSizePipe } from '@cisco-ngx/cui-pipes/fesm5/cisco-ngx-cui-pipes';
import MockService from '../support/mockService';
import RouteWatch from '../support/routeWatch';
import { caseFileIcons } from '../../src/app/classes/case';

const i18n = require('../../src/assets/i18n/en-US.json');

const caseMock = new MockService('CaseScenarios');
const caseListScenario = caseMock.getScenario('GET', 'Case List p1');
const caseList = caseListScenario.response.body;
const caseFilesScenario = caseMock.getScenario('GET', 'Case Files');
const caseFiles = caseFilesScenario.response.body.result.response.getBrokerResponse.downloadInfo;
const caseOpenScenario = caseMock.getScenario('POST', 'Cases Create Response');
const createdCase = caseOpenScenario.response.body.caseNumber;

const dateFormat = 'MMM D, YYYY';
const fileSizePipe = new FileSizePipe();

const severityIconMap = sev => {
	switch (sev) {
		case '1':
			return 'danger';
		case '2':
			return 'warning';
		case '3':
			return 'warning-alt';
		case '4':
		default:
			return 'info';
	}
};

describe('Case Detail Spec', () => {
	before(() => {
		cy.login();
		cy.loadApp('/solution/resolution');
		cy.window().then(win => { // Must be done after app loads
			win.Cypress.hideDNACHeader = true;
		});
		cy.waitForAppLoading();
	});

	context('Case List View', () => {
		it('PBC-231 Case List Assets', () => {
			// PBC-231 - Check for expected assets on the case listing
			cy.getByAutoId('Open CasesTab').should('exist');
			cy.getByAutoId('rmaShowingXcasesHeader')
				.should(
					'have.text',
					`Showing 1-${caseList.numberOfElements} of ${caseList.totalElements} open cases`
				);
		});

		it('PBC-231 Case List Table Contents', () => {
			//  Verify auto-id's for each column header
			cy.getByAutoId('Severity-Header').should('contain', i18n._RMACaseSeverity_);
			cy.getByAutoId('Case ID-Header').should('contain', i18n._RMACaseID_);
			cy.getByAutoId('Device-Header').should('contain', i18n._RMACaseDevice_);
			cy.getByAutoId('Summary-Header').should('contain', i18n._RMACaseSummary_);
			cy.getByAutoId('Status-Header').should('contain', i18n._RMACaseStatus_);
			cy.getByAutoId('Updated-Header').should('contain', i18n._RMACaseUpdatedDate_);

			// Verify auto-id's for each row element
			Cypress._.each(caseList.content, (caseItem, index) => {
				cy.get('[data-auto-id="caseListTable"] tbody tr').eq(index).within(() => {
					cy.getByAutoId('severityIcon')
						.should('have.class', severityIconMap(caseItem.priority));
					cy.getByAutoId('severityValue').should('have.text', ` S${caseItem.priority}`);
					cy.getByAutoId('Case ID-Cell').should('have.text', caseItem.caseNumber);
					cy.getByAutoId('Device-Cell').should('have.text', caseItem.deviceName);
					cy.getByAutoId('Summary-Cell').should('have.text', caseItem.summary);
					cy.getByAutoId('Status-Cell').should('have.text', caseItem.status);
					const date = Cypress.moment(caseItem.lastModifiedDate).format(dateFormat);
					cy.getByAutoId('CaseListUpdated').should('have.text', date);
				});
			});
		});

		it('PBC-231 Case List Invalid Case ID', () => {
			// PBC-231 - Check for "invalid" message.
			const invalidSearchVal = 'abcdefghij';
			cy.getByAutoId('caseSearchBox').clear().type(`${invalidSearchVal}{enter}`);
			cy.getByAutoId('invalidCaseNumber').should('contain', i18n._RMAInvalidCaseNo_);
			cy.getByAutoId('caseSearchBox').clear();
		});

		it('PBC-537 Last Updated and Duration Open Visual Filters', () => {
			cy.getByAutoId('VisualFilter-lastUpdated')
				.should('contain', 'LAST UPDATED');
			cy.getByAutoId('lastUpdatedFilter')
				.should('contain', '≤24 hr')
				.should('contain', '>1 day')
				.should('contain', '>1 week');
			cy.getByAutoId('VisualFilter-durationOpen')
				.should('contain', 'TOTAL TIME OPEN');
			cy.getByAutoId('durationOpenFilter')
				.should('contain', '≤24 hr')
				.should('contain', '>1 day')
				.should('contain', '>1 week')
				.should('contain', '>2 weeks');
		});
	});

	context('Case Detail View', () => {
		before(() => cy.get('[data-auto-id="caseListTable"] tbody tr').eq(0).click());

		it('PBC-233 Case Details Click on case from List', () => {
			// PBC-233
			const caseDetails = caseList.content[0];

			cy.get('[detailspaneltitle]').should('have.text', `Case ${caseDetails.caseNumber}`);
			cy.getByAutoId('CaseDetailsSeverityIcon')
				.should('have.class', severityIconMap(caseDetails.priority));
			cy.getByAutoId('CaseDetailsSeverity').should('have.text', `S${caseDetails.priority}`);
			// cy.getByAutoId('CaseDetailsRequestType').should('have.text', caseDetails.requestType);
			cy.getByAutoId('CaseDetailsStatus').should('have.text', caseDetails.status);
			const createdDate = Cypress.moment(caseDetails.createdDate).format(dateFormat);
			cy.getByAutoId('CaseDetailsCreatedDate').should('have.text', createdDate);
			// const lastUpdatedDate = Cypress.moment(caseDetails.lastUpdatedDate).format(dateFormat);
			// cy.getByAutoId('CaseDetailsLastUpdatedDate').should('have.text', lastUpdatedDate);
		});

		it('PBC-233 Closes 360 view when leaving the case page', () => {
			// PBC-233
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.get('details-panel').should('not.exist');

			cy.getByAutoId('Facet-Problem Resolution').click();
			cy.waitForAppLoading();
		});
	});

	context('Case Detail Notes and Files', () => {
		before(() => cy.get('[data-auto-id="caseListTable"] tbody tr').eq(0).click());

		after(() => cy.getByAutoId('CloseDetails').click());

		it('PBC-234 Case Details Notes Tab, Add a Note', () => {
			const currDatestamp = new Date().getTime();
			cy.server();
			cy.route('POST', `**/notes/${caseList.content[0].caseNumber}`, {}).as('notes');

			// Add a case note
			const note = `Title for current date of ${currDatestamp}`;
			const description = `Description for current date of ${currDatestamp}`;

			cy.getByAutoId('CaseAddNote').click();
			cy.getByAutoId('title').type(note);
			cy.getByAutoId('description').type(description);
			cy.getByAutoId('AddNote').click();

			cy.wait('@notes').its('requestBody').then(body => {
				cy.wrap(body.note).should('eq', note);
				cy.wrap(body.noteDetail).should('eq', description);
				cy.wrap(body.noteStatus).should('eq', 'external');
				cy.wrap(body.noteType).should('eq', 'WEB UPDATE');
			});

			cy.getByAutoId('CancelAddNote').click();
		});

		it('PBC-234 Case Details Notes: Cancel Adding a note', () => {
			const notesPOST = new RouteWatch(`**/notes/${caseList.content[0].caseNumber}`, 'POST');

			cy.getByAutoId('CaseAddNote').click();
			cy.getByAutoId('title').type('test');
			cy.getByAutoId('description').type('test');
			cy.getByAutoId('CancelAddNote').click();
			cy.wrap(notesPOST.called).should('eq', 0);
		});

		it('PBC-232 Case Detail Attachments - List & Download', () => {
			// Verify elements of the files tab
			cy.getByAutoId('filesTab').click();
			cy.getByAutoId('Name-Header').should('have.text', 'Name');
			cy.getByAutoId('Type-Header').should('have.text', 'Type');
			cy.getByAutoId('Size-Header').should('have.text', 'Size');

			Cypress._.each(caseFiles.fileDetail, (file, index) => {
				const { fileInfo } = file;
				cy.get('app-case-files tbody tr').eq(index).within(() => {
					cy.getByAutoId('CaseFileName').should('have.text', fileInfo.fileName);
					cy.getByAutoId('CaseFileTypeIcon')
						.should('have.class', caseFileIcons[fileInfo.fileContentType].icon);
					cy.getByAutoId('CaseFileType')
						.should('have.text', caseFileIcons[fileInfo.fileContentType].label);
					cy.getByAutoId('CaseFileSize')
						.should('have.text', fileSizePipe.transform(fileInfo.fileSize));
					cy.getByAutoId('DownloadUrl')
						.should('have.text', 'download')
						.should('have.attr', 'href')
						.and('contain', `fileName=${fileInfo.fileName}`);
				});
			});
		});

		it('PBC-345 Case Detail Attachments - Upload - Cancel and X buttons', () => {
			cy.getByAutoId('filesTab').click();
			cy.getByAutoId('CaseAttachFile').click();
			cy.getByAutoId('CSC-UploadFilesDialogTitle').should('have.text', 'Attach Files');
			cy.getByAutoId('CSC-UploadFilesDialogSubmit').should('have.text', 'Attach');

			cy.getByAutoId('CSC-UploadFilesDialogCancel').click({ force: true });
			cy.get('csc-upload-files').should('not.exist');

			cy.getByAutoId('CaseAttachFile').click();
			cy.get('csc-upload-files').should('exist');
			cy.getByAutoId('CSC-UploadFilesDialogClose').click({ force: true });
			cy.get('csc-upload-files').should('not.exist');
		});

		it('PBC-345 Case Detail Attachments - Upload - Attach a file', () => {
			const pdfFile = '20kFile.pdf';
			// const zipFile = './sampleFiles/20kFile.zip';
			// const csvFile = './sampleFiles/20kFile.csv';
			// const xlsxFile = './sampleFiles/20kFile.xlsx';
			// const txtFile = './sampleFiles/20kFile.txt';

			cy.server();
			cy.route('POST', '**/csc/v3/create/', 'fixture:csc/create.json').as('create');

			cy.getByAutoId('filesTab').click();
			cy.getByAutoId('CaseAttachFile').click();

			cy.fixture(`./sampleFiles/${pdfFile}`).then(fileContent => {
				cy.get('csc-upload-files form').upload(
					{ fileContent, fileName: pdfFile, mimeType: 'application/pdf' },
					{ subjectType: 'drag-n-drop' },
				);
			});
			// Verify various assets on drag-n-drop screen
			cy.getByAutoId('CSC-UploadDescriptionValue').should('have.length', 3);
			// Verify assets after 'single' selection
			cy.get('[ng-reflect-value="single"]').click({ force: true });
			cy.getByAutoId('CSC-FileCategory').should('exist');
			cy.getByAutoId('CSC-FileDescription').should('exist');
			cy.getByAutoId('CSC-UploadFilesDialogTitle').should('exist');
			cy.getByAutoId('CSC-UploadFilesDialogSubmit').should('exist');
			// Verify assets after 'individual' selection
			cy.get("[ng-reflect-value='individual']").click({ force: true });
			cy.get('legend').should('exist');
			cy.getByAutoId('CSC-SelectFile').should('exist');
			cy.getByAutoId('CSC-FileCategory').should('exist');
			cy.getByAutoId('CSC-FileDescription').should('exist');
			// Verify assets after default selection
			cy.get('[ng-reflect-value="none"]').click({ force: true });
			cy.getByAutoId('CSC-UploadFilesDialogSubmit').click({ force: true });

			cy.wait('@create');
			cy.get('[class="modal__content"]').should('contain.text', 'Upload Status');
			cy.get('[class="modal__content"]').should('contain.text', 'Upload Details');
			cy.get('[ng-reflect-value="100%"]').should('exist');
			cy.getByAutoId('CSC-UploadFilesDialogClose').click({ force: true });
		});
	});

	context('Case - Opened RMAs and Cases', () => {
		it('PBC-83 Cases - Number of Open Cases', () => {
			// Look in Visual Filters of Open Cases
			cy.getByAutoId('VisualFilterCollapse')
				.should('contain', i18n._VisualFilters_)
				.click(); // To collapse
			cy.getByAutoId('VisualFilterCollapse').click(); // To expand
			cy.getByAutoId('TotalVisualFilter').should('exist');
			// TODO RMAs tab is currently(8/6/2019) disabled, planned for a future release
		});

		it('PBC-86 Cases - Filter by Status', () => {
			cy.getByAutoId('VisualFilter-status').should('exist');
			cy.getByAutoId('statusFilter')
				.should('contain', 'CustomerUpdated')
				.should('contain', 'CiscoPending');
		});

		it('PBC-87 Cases - Filter by Severity', () => {
			cy.getByAutoId('VisualFilter-severity').should('exist');
			cy.getByAutoId('severityFilter').within(() => {
				cy.get('tspan').contains('S3'); // The majority is P3
				// FilterTag testing covered in assets_spec
			});
		});

		it('PBC-85 Cases - Filter by RMA', () => {
			cy.getByAutoId('VisualFilter-rma').should('exist');
			cy.getByAutoId('No RMAsPoint').click();
			cy.getByAutoId('FilterTag-F').should('have.text', 'No RMAs');
			cy.getByAutoId('With RMAsPoint').click();
			cy.getByAutoId('FilterTag-T').should('have.text', 'With RMAs');
		});
	});

	context('Asset Case Open: PBC-92 PBC-591', () => {
		before(() => cy.getByAutoId('Facet-Advisories').click());

		const verifyImpactedAssetFunctionality = (multiple = false) => {
			cy.getByAutoId('SecurityAdvisoryOpenCaseBtn').click();
			cy.getByAutoId('PanelSelectOption1').click();
			// Select the dropdown option
			cy.get('cui-select[formcontrolname="problemArea"] .dropdown-chevron')
				.click({ force: true });
			cy.get('[title="Configuration Assistance"]').eq(0).click({ force: true });
			cy.getByAutoId('CaseOpenSubmitButton').click();

			cy.wait('Cases Create Response').then(xhr => {
				const assert = multiple ? 'contain' : 'not.contain';
				cy.wrap(xhr.request.body.description)
					.should(assert, 'Additional Impacted Asset Serial Numbers');
			});
			cy.get('[class="icon-check-outline icon-small text-success qtr-margin-right"]')
				.should('exist');
			cy.getByAutoId('CaseNumberLink').should('have.text', createdCase);

			cy.getByAutoId('CaseOpenClose').should('exist');
			cy.getByAutoId('CaseNumberButton').should('exist');
			cy.getByAutoId('CaseOpenDoneButton').click();
			cy.getByAutoId('CloseDetails').click();
		};

		it('PBC-92 - Assets - Cases - Event Based Case Open (Single Asset)', () => {
			cy.get('tbody tr').eq(0).click();
			verifyImpactedAssetFunctionality();
		});

		// TODO: Case description doesn't contain multiple serial numbers
		it.skip('PBC-591 - Assets - Cases - Event Based Case Open (Multiple Assets)', () => {
			cy.get('tbody tr').eq(0).click();
			verifyImpactedAssetFunctionality(true);
		});
	});
});
