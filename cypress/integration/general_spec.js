import MockService from '../support/mockService';

// const searchMock = new MockService('SearchScenarios');
// const rmaMock = new MockService('RMAResponse');
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
		// TODO  Skipped for now since mock only allows for results or not
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it.skip('General Search and close', () => {
			const searchVal = '639530286';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(searchVal.concat('{enter}'));
			cy.wait(1000);
			cy.getByAutoId('searchSiteSelect').should('exist');
			cy.getByAutoId('cui-select').should('exist');			// 2 found
			cy.getByAutoId('searchResultLink').should('exist');		// 3 found
			cy.getByAutoId('loadMoreButton').should('exist').click();
			cy.wait(1000);
			cy.getByAutoId('loadMoreButton').should('exist').click();
			cy.wait(1000);
			cy.getByAutoId('searchResultLink').should('exist');		// now 9 found
			cy.getByAutoId('searchClose').should('exist').click();
		});

		it.skip('Search No Result Found', () => { // PBC-173
			// TODO With existing mock limitations we still need to fully integrate automation
			// for 'no results' scenario into all runs.  This will be accomplished in the near
			// future with new mock functionality to enable/disable as desired.
			const rmaVal = '639530286639530286';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(rmaVal.concat('{enter}'));
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
			cy.getByAutoId('searchClose').should('exist').click();
		});
	});
	context('RMA Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('RMA 800000000 one replacement parts', () => {
			// RMA with 1 replacement part PBC-171
			// mock set at "RMA with one replacement part"
			const rmaVal = '800000000';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(rmaVal.concat('{enter}'));
			cy.wait(4000);
			cy.get('app-rma-search').should('contain', 'RMA: '.concat(rmaVal));
			// cy.get('table').should('contain', 'STATUS');
			cy.get('app-rma-search table th').eq(0).should('have.text', 'Status');
			cy.get('app-rma-search table th').eq(1).should('have.text', 'Case Number');
			cy.get('app-rma-search table th').eq(2).should('have.text', 'Carrier Tracking Number');
			cy.get('app-rma-search table th').eq(3).should('have.text', 'Contract Number');
			cy.get('app-rma-search table th').eq(4).should('have.text', 'Replacement Product');
			// TODO confirm replacement product contains one product string
			cy.get('app-rma-search table th').eq(5).should('have.text', 'Replacement Product ID');
			cy.getByAutoId('RMAViewDetailsButton').should('exist').click();
			cy.get('h5').should('contain', 'Related to this Product');
			// cy.get('app-no-results').should('contain', 'Suggestions');
			// cy.get('app-no-results').should('contain', 'Check your spelling');
			// cy.get('app-no-results').should('contain', 'Try different keyword');
			// cy.get('app-no-results').should('contain', 'Try more general keywords');
			// cy.get('app-no-results').should('contain', 'Did you know you can search on');
			// cy.get('app-no-results').should('contain', 'Serial Number');
			// cy.get('app-no-results').should('contain', 'Case Number');
			// cy.get('app-no-results').should('contain', 'Contract Number');
			// cy.get('app-no-results').should('contain', 'RMA Number');
			// eslint-disable-next-line max-len
			// cy.get('app-no-results').should('contain', 'Information about that item will be displayed if you are entitled to view it.');
			cy.getByAutoId('searchClose').should('exist').click();
		});

		it.only('RMA 800000000 four replacement parts', () => {
			// RMA with 4 replacement part PBC-171
			// mock set at "RMA with four replacement parts"
			cy.window().then(win => {
				win.mockService.disable('RMA with one replacement part'); // disable the default
				// cy.log(win.mockService.getEnabledScenarios());
				win.mockService.enable('RMA with four replacement parts'); // enable the desired
			});
			// cy.log("one");
			const rmaVal = '800000000';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(rmaVal.concat('{enter}'));
			cy.wait(4000);
			cy.get('app-rma-search').should('contain', 'RMA: '.concat(rmaVal));
			cy.get('app-rma-search table th').eq(0).should('have.text', 'Status');
			cy.get('app-rma-search table th').eq(1).should('have.text', 'Case Number');
			cy.get('app-rma-search table th').eq(2).should('have.text', 'Carrier Tracking Number');
			cy.get('app-rma-search table th').eq(3).should('have.text', 'Contract Number');
			cy.get('app-rma-search table th').eq(4).should('have.text', 'Replacement Product');
			// TODO confirm replacement product contains four product strings
			// cy.get('app-rma-search table th').eq(5).should('have.text', 'Replacement Product ID');
			cy.getByAutoId('RMAViewDetailsButton').should('exist').click();
			cy.get('h5').should('contain', 'Related to this Product');
			// cy.get('app-no-results').should('contain', 'Suggestions');
			// cy.get('app-no-results').should('contain', 'Check your spelling');
			// cy.get('app-no-results').should('contain', 'Try different keyword');
			// cy.get('app-no-results').should('contain', 'Try more general keywords');
			// cy.get('app-no-results').should('contain', 'Did you know you can search on');
			// cy.get('app-no-results').should('contain', 'Serial Number');
			// cy.get('app-no-results').should('contain', 'Case Number');
			// cy.get('app-no-results').should('contain', 'Contract Number');
			// cy.get('app-no-results').should('contain', 'RMA Number');
			// eslint-disable-next-line max-len
			// cy.get('app-no-results').should('contain', 'Information about that item will be displayed if you are entitled to view it.');
			cy.getByAutoId('searchClose').should('exist').click();
		});

		it.only('RMA 800000000 no replacement parts', () => {
			// RMA with no replacement part PBC-171
			// mock set at "RMA with no replacement parts"
			cy.window().then(win => {
				win.mockService.disable('RMA with four replacement parts');
				// cy.log(win.mockService.getEnabledScenarios());
				win.mockService.enable('RMA with no replacement parts'); // enable the desired
			});

			const rmaVal = '800000000';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(rmaVal.concat('{enter}'));
			cy.wait(4000);
			cy.get('app-rma-search').should('contain', 'RMA: '.concat(rmaVal));
			cy.get('app-rma-search table th').eq(0).should('have.text', 'Status');
			cy.get('app-rma-search table th').eq(1).should('have.text', 'Case Number');
			cy.get('app-rma-search table th').eq(2).should('have.text', 'Carrier Tracking Number');
			cy.get('app-rma-search table th').eq(3).should('have.text', 'Contract Number');
			cy.get('app-rma-search table th').eq(4).should('have.text', 'Replacement Product');
			// TODO confirm replacement product contains "N/A"
			cy.get('app-rma-search table th').eq(5).should('have.text', 'Replacement Product ID');
			cy.getByAutoId('RMAViewDetailsButton').should('exist').click();
			cy.get('h5').should('contain', 'Related to this Product');
			// cy.get('app-no-results').should('contain', 'Suggestions');
			// cy.get('app-no-results').should('contain', 'Check your spelling');
			// cy.get('app-no-results').should('contain', 'Try different keyword');
			// cy.get('app-no-results').should('contain', 'Try more general keywords');
			// cy.get('app-no-results').should('contain', 'Did you know you can search on');
			// cy.get('app-no-results').should('contain', 'Serial Number');
			// cy.get('app-no-results').should('contain', 'Case Number');
			// cy.get('app-no-results').should('contain', 'Contract Number');
			// cy.get('app-no-results').should('contain', 'RMA Number');
			// eslint-disable-next-line max-len
			// cy.get('app-no-results').should('contain', 'Information about that item will be displayed if you are entitled to view it.');
			cy.getByAutoId('searchClose').should('exist').click();
		});
		it('RMA 800000009', () => {
			const inputVal = '800000009';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(inputVal.concat('{enter}'));
			cy.wait(4000);
			cy.get('app-general-search').should('contain', '10 Results for "'.concat(inputVal).concat('"'));
			// cy.get('app-general-search').should('contain', '10 Results for');
			cy.getByAutoId('searchSiteSelect').should('exist');
			cy.getByAutoId('cui-select').should('exist');			// 2 found
			cy.getByAutoId('searchClose').should('exist').click();
		});
	});
});
