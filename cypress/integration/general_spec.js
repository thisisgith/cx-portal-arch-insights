import MockService from '../support/mockService';

describe('General Spec', () => {
	it('Loads the app', () => {
		cy.loadApp();
		cy.get('h1.page-title').should('have.text', 'CX Console');
	});

	it('Requires SSO login', () => {
		MockService.mockUnauthenticatedUser();
		cy.loadApp();
		cy.url().should('contain', 'https://cloudsso-test.cisco.com/idp/SSO.saml2');
	});

	context('Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Search and close', () => {
			const rmaVal = '639530286';
			cy.getByAutoId('searchBarInput').should('exist').type(rmaVal.concat('{enter}'));
			cy.wait(1000);
			cy.getByAutoId('searchSiteSelect').should('exist');
			cy.getByAutoId('cui-select').should('exist');			// 2 found
			cy.getByAutoId('searchResultLink').should('exist');		// 3 found
			cy.getByAutoId('loadMoreButton').should('exist').click();
			cy.wait(1000);
			cy.getByAutoId('loadMoreButton').should('exist').click();
			cy.wait(1000);
			cy.getByAutoId('searchResultLink').should('exist');		// now 9 found
			cy.getByAutoId('searchClose').click();
		});

		it('Search No Result Found', () => { // PBC-173
			const rmaVal = '639530286';
			cy.getByAutoId('searchBarInput').should('exist').type(rmaVal.concat('{enter}'));
			cy.wait(800);
			cy.get('h4').should('have.text', 'No Results Found');
			cy.get('h5').should('contain', 'We did not find results for: '.concat(rmaVal));
			cy.get('app-no-results').should('contain', 'Suggestions');
			cy.get('app-no-results').should('contain', 'Check your spelling');
			cy.get('app-no-results').should('contain', 'Try different keyword');
			cy.get('app-no-results').should('contain', 'Try more general keywords');
			cy.get('app-no-results').should('contain', 'Did you know you can search on');
			cy.get('app-no-results').should('contain', 'Serial Number');
			cy.get('app-no-results').should('contain', 'Case Number');
			cy.get('app-no-results').should('contain', 'Contract Number');
			cy.get('app-no-results').should('contain', 'RMA Number');
			cy.get('app-no-results').should('contain', 'Information about that item will be displayed if you are entitled to view it.');
			cy.getByAutoId('searchClose').click();
		});
	});
});
