import MockService from '../support/mockService';

// const searchMock = new MockService('SearchScenarios');
// const rmaMock = new MockService('RMAResponse');
// import { mockSettings } from '../../src/environments/mock/mock';

describe('Serial Spec', () => {
	it.skip('Loads the app', () => {
		cy.loadApp();
		cy.get('h1.page-title').should('have.text', 'CX Console');
	});

	it.skip('Requires SSO login', () => {
		MockService.mockUnauthenticatedUser();
		cy.loadApp();
		cy.url().should('contain', 'https://cloudsso-test.cisco.com/idp/SSO.saml2');
	});

	context('Serial Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Serial FOX1306GFKH Search', () => {
			// PBC-170
			const serialVal = 'FOX1306GFKH';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(serialVal.concat('{enter}'));
			cy.wait(4000);
			cy.get('h4').should('exist', 'Serial Number '.concat(serialVal));
			cy.getByAutoId('contractNumber').should('exist');
			cy.getByAutoId('softwareTypeOS').should('exist');
			cy.getByAutoId('currentVersion').should('exist');
			// cy.get('app-rma-search table th').eq(0).should('have.text', 'CS Level');
			// cy.get('app-rma-search table th').eq(1).should('have.text', 'Contract Number');
			// cy.get('app-rma-search table th').eq(2).should('have.text', 'Expiration Date');
			// cy.get('app-rma-search table th').eq(3).should('have.text', 'Software Type (OS)');
			// cy.get('app-rma-search table th').eq(4).should('have.text', 'Current Version');
			// cy.get('app-rma-search table th').eq(4).should('have.text', 'Latest Version');
			// cy.get('app-rma-search table th').eq(4).should('have.text', 'Open Cases');
			// cy.get('app-rma-search table th').eq(4).should('have.text', 'Open RMAs');
			// cy.get('app-rma-search table th').eq(4).should('have.text', 'Related Field Notices');
			// cy.get('app-rma-search table th').eq(4).should('have.text', 'Related Security Advisories');
			// cy.get('app-rma-search table th').eq(4).should('have.text', 'Current Related Bugs');
			// TODO confirm replacement product contains one product string
			cy.getByAutoId('searchClose').should('exist').click();
		});


		it('Serial not found FOX1306GFJJ', () => {
			const serialVal = 'FOX1306GFJJ';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(serialVal.concat('{enter}'));
			cy.wait(4000);
			cy.get('h4').should('not.exist', 'Serial Number '.concat(serialVal));
			cy.get('app-general-search').should('contain', '10 Results for "'.concat(serialVal).concat('"'));
			// cy.get('app-general-search').should('contain', '10 Results for');
			cy.getByAutoId('searchSiteSelect').should('exist');
			cy.getByAutoId('cui-select').should('exist');			// 2 found
			cy.getByAutoId('searchClose').should('exist').click();
		});
	});
});
