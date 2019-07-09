import MockService from '../support/mockService';

const searchMock = new MockService('SearchScenarios');
// import { mockSettings } from '../../src/environments/mock/mock';

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

	context('General Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('General Search and close', () => { // PBC-173
			const searchVal = '639530286';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(searchVal.concat('{enter}'));
			cy.wait(5000);
			cy.getByAutoId('searchSiteSelect').should('exist');
			cy.getByAutoId('cui-select').should('exist');			// 2 found
			cy.getByAutoId('searchResultLinkPre0').should('exist');
			cy.getByAutoId('searchResultLinkPre1').should('exist');
			cy.getByAutoId('searchResultLinkPre2').should('exist');
			cy.getByAutoId('loadMoreButton').should('exist').click();
			cy.wait(1000);
			cy.getByAutoId('loadMoreButton').should('exist').click();
			cy.wait(1000);
			cy.getByAutoId('searchResultLinkPost0').should('exist');
			cy.getByAutoId('searchResultLinkPost1').should('exist');
			cy.getByAutoId('searchResultLinkPost2').should('exist');
			cy.getByAutoId('searchClose').should('exist').click();
		});

		// TODO: Unskip and fix once PBC-219 is merged
		it.skip('Search No Result Found', () => { // PBC-173
			// disable default mock and enable desired for this test
			searchMock.disable('Generic Example');
			searchMock.enable('Unable to find results');
			const rmaVal = '639530286639530286';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(rmaVal.concat('{enter}'));
			cy.wait(5000);
			cy.get('h3').should('have.text', 'No Results Found');
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
			cy.getByAutoId('searchClose').should('exist').click();

			searchMock.disable('Unable to find results');
			searchMock.enable('Generic Example');
		});
	});
});
