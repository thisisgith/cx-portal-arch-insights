// import MockService from '../support/mockService';

describe('Case Spec', () => {
	context('Case Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		// TODO: Unskip and refactor test once PBC-219 is merged
		it.skip('Case Search', () => {
			// PBC-169
			const caseVal = '688296392'; // '686569178' '688296392' also works
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('case');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(caseVal.concat('{enter}'));
			cy.wait('@case').then(() => {
				cy.get('app-case-search').within(() => {
					cy.get('h3').should('exist', 'Case '.concat(caseVal));
					cy.get('span').should('contain', 'Status:');
					cy.get('h5').should('contain', 'Latest Update');
					cy.getByAutoId('seeMore').should('exist');
					cy.getByAutoId('viewCaseDetails').should('exist');
					cy.getByAutoId('viewAllOpenCases').should('exist');
				});
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
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('case');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(caseVal.concat('{enter}'));
			cy.wait('@case').then(() => {
				// cy.get('h3').should('not.exist', 'Case '.concat(caseVal));
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
});
