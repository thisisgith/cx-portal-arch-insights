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
});
