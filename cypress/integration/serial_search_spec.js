import MockService from '../support/mockService';

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

			cy.getByAutoId('contractNumber').should('exist');
			cy.getByAutoId('softwareTypeOS').should('exist');
			cy.getByAutoId('currentVersion').should('exist');
			cy.get('app-search').within(() => {
				cy.get('h4').should('contain', 'Serial Number '.concat(serialVal));
				cy.get('h5').should('contain', 'Cat4500 E-Series 6-Slot Chassis, fan, no ps');
				cy.get('span').should('contain', 'CX Level');
				cy.get('span').should('contain', 'Contract Number');
				cy.get('span').should('contain', 'Expiration Date');
				cy.get('span').should('contain', 'Software Type (OS)');
				cy.get('span').should('contain', 'Current Version');
				cy.get('span').should('contain', 'Latest Version');
				cy.get('span').should('contain', 'Open Cases');
				cy.get('span').should('contain', 'Open RMAs');
				cy.get('span').should('contain', 'Related Field Notices');
				cy.get('span').should('contain', 'Related Security Advisories');
				cy.get('span').should('contain', 'Related Bugs');
				// TODO - PBC-219 & https://gitlab-sjc.cisco.com/sso-apps/persona-based-console/merge_requests/161 address the 4 fields below
				// cy.get('div').should('contain', 'Product ID');
				// cy.get('div').should('contain', 'Product Series');
				// cy.get('div').should('contain', 'IP Address');
				// cy.get('div').should('contain', 'Host Name');
			});
			cy.getByAutoId('viewDeviceButton').should('exist');
			cy.getByAutoId('openCaseButton').should('exist');

			cy.getByAutoId('searchSiteSelect').should('exist');
			cy.getByAutoId('searchTypeSelect').should('exist');
			cy.getByAutoId('cui-select').should('exist');			// 2 found
			cy.getByAutoId('searchResultLinkPre0').should('exist');
			cy.getByAutoId('searchResultLinkPre1').should('exist');
			cy.getByAutoId('searchResultLinkPre2').should('exist');
			cy.getByAutoId('searchClose').should('exist').click();
		});


		it('Serial not found FOX1306GFJJ', () => {
			// PBC-170
			const serialVal = 'FOX1306GFJJ';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(serialVal.concat('{enter}'));
			cy.wait(4000);
			cy.get('h4').should('not.exist', 'Serial Number '.concat(serialVal));
			cy.get('app-general-search').should('contain', '10 Results for "'.concat(serialVal).concat('"'));
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
