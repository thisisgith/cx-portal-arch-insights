// import MockService from '../support/mockService';
const i18n = require('../../src/assets/i18n/en-US.json');

describe('Case Spec', () => {
	context('Case Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Case Search', () => {
			// PBC-169
			const caseVal = '688296392'; // '686569178' '688296392' also works
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('case');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(caseVal.concat('{enter}'));
			cy.wait('@case').then(() => {
				cy.getByAutoId('caseNum').should('exist').should('contain', ('Case ').concat(caseVal));
				cy.getByAutoId('latestUpdate').should('exist').should('contain', i18n._LatestUpdate_);
				cy.getByAutoId('caseStatus').should('exist').should('contain', i18n._Status_);
				cy.getByAutoId('caseOwner').should('exist').should('contain', i18n._CaseOwner_);
				cy.getByAutoId('caseSeverity').should('exist').should('contain', i18n._Severity_);
				cy.getByAutoId('caseCreated').should('exist').should('contain', i18n._Created_);
				cy.getByAutoId('caseContract').should('exist').should('contain', i18n._Contract_);
				cy.getByAutoId('caseDevice').should('exist').should('contain', i18n._Device_);
				cy.getByAutoId('caseTACEng').should('exist').should('contain', i18n._TACEngineer_);
				cy.getByAutoId('caseTracking').should('exist').should('contain', i18n._TrackingNumber_);
				cy.getByAutoId('caseRelRMAs').should('exist').should('contain', i18n._RelatedRMAs_);
				cy.getByAutoId('viewCaseDetailsB').should('exist').should('contain', i18n._ViewCaseDetails_);
				cy.getByAutoId('viewAllOpenCasesB').should('exist').should('contain', i18n._ViewAllOpenCases_);
			});
			cy.getByAutoId('searchSiteSelect').should('exist');
			cy.getByAutoId('searchTypeSelect').should('exist');
			cy.getByAutoId('cui-select')
				.should($cuiselect => {
					expect($cuiselect).to.have.length(2);
				});
			cy.getByAutoId('searchResultLinkPre0').should('exist');
			cy.getByAutoId('searchResultLinkPre1').should('exist');
			cy.getByAutoId('searchResultLinkPre2').should('exist');
			cy.getByAutoId('searchClose').should('exist').click();
		});

		it('Case not found', () => {
			// PBC-169
			const caseVal = '686568888';
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('case');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(caseVal.concat('{enter}'));
			cy.wait('@case').then(() => {
				cy.getByAutoId('caseNum').should('not.exist'); // .should('contain', i18n._Case_);
				cy.get('app-general-search').should('contain', '10 Results for "'.concat(caseVal).concat('"'));
				cy.getByAutoId('searchSiteSelect').should('exist');
				cy.getByAutoId('searchTypeSelect').should('exist');
				cy.getByAutoId('cui-select')
					.should($cuiselect => {
						expect($cuiselect).to.have.length(2);
					});
				cy.getByAutoId('searchResultLinkPre0').should('exist');
				cy.getByAutoId('searchResultLinkPre1').should('exist');
				cy.getByAutoId('searchResultLinkPre2').should('exist');
				cy.getByAutoId('searchClose').should('exist').click();
			});
		});
	});
});
