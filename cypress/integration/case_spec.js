// import MockService from '../support/mockService';

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
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(caseVal.concat('{enter}'));
			cy.wait(6000);

			cy.get('app-case-search').within(() => {
				cy.get('h4').should('exist', 'Case '.concat(caseVal));
				cy.get('span').should('contain', 'Status:');
				cy.get('h5').should('contain', 'Latest Update');
				cy.getByAutoId('seeMore').should('exist');
				cy.getByAutoId('viewCaseDetails').should('exist');
				cy.getByAutoId('viewAllOpenCases').should('exist');
			});

			cy.getByAutoId('searchSiteSelect').should('exist');
			cy.getByAutoId('searchTypeSelect').should('exist');
			cy.getByAutoId('cui-select').should('exist');			// 2 found
			cy.getByAutoId('searchResultLinkPre0').should('exist');
			cy.getByAutoId('searchResultLinkPre1').should('exist');
			cy.getByAutoId('searchResultLinkPre2').should('exist');
			cy.getByAutoId('searchClose').should('exist').click();
		});


		it('Case not found', () => {
			// PBC-169
			const caseVal = '686568888';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(caseVal.concat('{enter}'));
			cy.wait(6000);
			cy.get('h4').should('not.exist', 'Case '.concat(caseVal));
			cy.get('app-general-search').should('contain', '10 Results for "'.concat(caseVal).concat('"'));
			cy.getByAutoId('searchSiteSelect').should('exist');
			cy.getByAutoId('searchTypeSelect').should('exist');
			cy.getByAutoId('cui-select').should('exist');			// 2 found
			cy.getByAutoId('searchResultLinkPre0').should('exist');
			cy.getByAutoId('searchResultLinkPre1').should('exist');
			cy.getByAutoId('searchResultLinkPre2').should('exist');
			cy.getByAutoId('searchClose').should('exist').click();
		});
	});
});
