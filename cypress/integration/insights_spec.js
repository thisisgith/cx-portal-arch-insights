import MockService from '../support/mockService';

const i18n = require('../../src/assets/i18n/en-US.json');

// const searchMock = new MockService('SearchScenarios');

describe('Insights Spec', () => {
	context('Basic Loading Sanity', () => {
		// it('Loads the app', () => {
		// 	cy.loadApp();
		// 	// cy.get('h1.page-title').should('have.text', 'CX Console');
		// });

		it('Requires SSO login', () => {
			MockService.mockUnauthenticatedUser();
			cy.loadApp();
			cy.url().should('contain', 'https://cloudsso-test.cisco.com/idp/SSO.saml2');
		});
	});

	context(' Verify Insights Tab ', () => {
		before(() => {
			cy.login();
			cy.loadApp('/solution/insights/osv');
			cy.waitForAppLoading();
		});

		it('PBC-635 Verify Insights Tab for cxlevel 3', () => {
			// Since svorma1 user is cxlevel 3 - it will see all items below
			cy.getByAutoId('ConfigurationTabNav').should('exist');
			cy.getByAutoId('SyslogsTabNav').should('exist').should('contain', i18n._Syslogs_);
			cy.getByAutoId('Architecture ReviewTabNav').should('exist');
			cy.getByAutoId('SoftwareTabNav').click();
			cy.getByAutoId('ContactExpert').should('exist').should('contain', i18n._CSRequestExpert_);
			cy.getByAutoId('Risk MitigationTabNav').click();
			// TODO check for _CP_FingerprintIntelligence_ tab should exist if/when there is data
			// TODO check for the Compare tab
		});
		it.skip('PBC-635 Verify Insights Tab for cxlevel 2 or 1', () => {
			// TODO Switch to/Find a userID with cxlevel 2 - items below s/b hidden
			// Skip for now
			cy.getByAutoId('ConfigurationTabNav').should('not.be.visible');
			cy.getByAutoId('SyslogsTabNav').should('not.be.visible');
			cy.getByAutoId('Architecture ReviewTabNav').should('not.be.visible');
			cy.getByAutoId('SoftwareTabNav').click();
			cy.getByAutoId('ContactExpert').should('exist').should('not.be.visible');
			cy.getByAutoId('Risk MitigationTabNav').click();
			// TODO check _CP_FingerprintIntelligence_ tab should not.be.visible if/when there is data
			// TODO check the Compare tab should not.be.visible
		});

	});
});
