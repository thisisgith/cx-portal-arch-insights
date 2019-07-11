
const i18n = require('../../src/assets/i18n/en-US.json');

describe('RMA Spec', () => {
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
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('rma');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(rmaVal.concat('{enter}'));

			cy.wait('@rma').then(() => {
				cy.getByAutoId('rmaStatus').should('exist').should('contain', i18n._Status_);
				cy.getByAutoId('rmaNumber').should('exist');
				cy.getByAutoId('caseNumber').should('exist');
				cy.getByAutoId('rmaTrackingNumber').should('exist');
				cy.getByAutoId('contractNumber').should('exist');
				cy.getByAutoId('rmaViewDetButton').should('exist');
				cy.getByAutoId('rmaProduct').should('exist');
				cy.getByAutoId('rmaProdID').should('exist');
				cy.getByAutoId('rmaProdSeries').should('exist');
				cy.getByAutoId('rmaEOSaleD').should('exist');
				cy.getByAutoId('rmaEOSupportD').should('exist');
				cy.getByAutoId('rmaViewDetButton').should('exist');
			});
			// General Search section
			cy.getByAutoId('searchHeader').should('exist');
			cy.getByAutoId('filterBy').should('exist');
			cy.getByAutoId('cui-select')
				.should($cuiselect => {
					expect($cuiselect).to.have.length(2);
				}); // Unavailable 2 times
			cy.getByAutoId('relGenRes').should('exist');
			cy.getByAutoId('searchClose').should('exist').click();
		});

		it('RMA 800000000 four replacement parts', () => {
			// RMA with 4 replacement part PBC-171
			// mock set at "RMA with four replacement parts"
			cy.window().then(win => {
				// cy.log(win.mockService.getEnabledScenarios());
				win.mockService.enable('RMA with four replacement parts'); // enable the desired
				cy.getByAutoId('Facet-Assets & Coverage').should('exist').click(); // refresh after making a mock change
			});
			// cy.log("one");
			const rmaVal = '800000000';
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('rma');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(rmaVal.concat('{enter}'));
			cy.wait('@rma').then(() => {
				cy.getByAutoId('rmaStatus').should('exist').should('contain', i18n._Status_);
				cy.getByAutoId('rmaNumber').should('exist');
				cy.getByAutoId('caseNumber').should('exist');
				cy.getByAutoId('rmaProductNames').should('exist');
				cy.getByAutoId('rmaProductIDs').should('exist');
				// Confirm replacement product contains four product rows
				cy.getByAutoId('rmaProdDescr')
					.should($rmaProdDescr => {
						expect($rmaProdDescr).to.have.length(4);
					});
				cy.getByAutoId('rmaProdID')
					.should($rmaProdID => {
						expect($rmaProdID).to.have.length(4);
					});
				cy.getByAutoId('rmaViewDetButton').should('exist');
				// General Search section
				cy.getByAutoId('searchHeader').should('exist');
				cy.getByAutoId('filterBy').should('exist');
				cy.getByAutoId('cui-select')
					.should($cuiselect => {
						expect($cuiselect).to.have.length(2);
					});
				cy.getByAutoId('relGenRes').should('exist');
				cy.getByAutoId('searchClose').should('exist').click();
			});
		});

		it('RMA 800000000 no replacement parts', () => {
			// RMA with no replacement part PBC-171
			// mock set at "RMA with no replacement parts"
			cy.window().then(win => {
				// cy.log(win.mockService.getEnabledScenarios());
				win.mockService.enable('RMA with no replacement parts'); // enable the desired
				cy.getByAutoId('Facet-Assets & Coverage').should('exist').click(); // refresh after making a mock change
			});

			const rmaVal = '800000000';
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('rma');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(rmaVal.concat('{enter}'));
			cy.wait('@rma').then(() => {
				cy.getByAutoId('rmaStatus').should('exist').should('contain', i18n._Status_);
				cy.getByAutoId('rmaNumber').should('exist');
				cy.getByAutoId('caseNumber').should('exist');
				cy.getByAutoId('rmaTrackingNumber').should('exist');
				cy.getByAutoId('contractNumber').should('exist');
				cy.getByAutoId('rmaViewDetButton').should('exist');
				cy.getByAutoId('rmaProduct').should('exist');
				cy.getByAutoId('rmaUnavail')
					.should($rmaUnavail => {
						expect($rmaUnavail).to.have.length(5);
					});
				cy.getByAutoId('rmaProdID').should('exist');
				cy.getByAutoId('rmaProdSeries').should('exist');
				cy.getByAutoId('rmaEOSaleD').should('exist');
				cy.getByAutoId('rmaEOSupportD').should('exist');
				cy.getByAutoId('rmaViewDetButton').should('exist');
				// General Search section
				cy.getByAutoId('searchHeader').should('exist');
				cy.getByAutoId('filterBy').should('exist');
				cy.getByAutoId('cui-select')
					.should($cuiselect => {
						expect($cuiselect).to.have.length(2);
					});
				cy.getByAutoId('relGenRes').should('exist');
				cy.getByAutoId('searchClose').should('exist').click();
			});
		});

		it('RMA 800000009', () => {
			const inputVal = '800000009';
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('rma');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(inputVal.concat('{enter}'));
			cy.wait('@rma').then(() => {
				cy.get('app-general-search').should('contain', '10 Results for "'.concat(inputVal).concat('"'));
				cy.getByAutoId('searchSiteSelect').should('exist');
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
