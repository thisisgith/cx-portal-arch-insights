import MockService from '../support/mockService';

const i18n = require('../../src/assets/i18n/en-US.json');

const searchMock = new MockService('SearchScenarios');

describe('General Spec', () => {
	context('Basic Loading Sanity', () => {
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

	context('General Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('General Search and close', () => { // PBC-167
			const searchVal = '688296392'; // orig value:639530286  686569178
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('case');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(searchVal.concat('{enter}'));
			cy.wait('@case').then(() => {
				cy.getByAutoId('searchSiteSelect').should('exist');
				cy.getByAutoId('cui-select')
					.should($cuiselect => { // variables can't have a hyphen
						expect($cuiselect).to.have.length(2);
					});
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
		});

		it('Search No Result Found', () => { // PBC-173
			// disable default mock and enable desired for this test
			searchMock.disable('Generic Example');
			searchMock.enable('Unable to find results');
			const rmaVal = '639530286639530286';
			cy.server();
			cy.route('**/api/customerportal/inventory/v1/hardware?*').as('case');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(rmaVal.concat('{enter}'));
			cy.wait('@case').then(() => {
				cy.getByAutoId('noResultsFound').should('exist').should('contain', i18n._NoResultsFound_);
				cy.getByAutoId('nrfSuggestions').should('exist').should('contain', i18n._Suggestions_);
				cy.getByAutoId('nrfSpelling').should('exist').should('contain', i18n._CheckYourSpelling_);
				cy.getByAutoId('nrfTryDiff').should('exist').should('contain', i18n._TryDifferentKeyword_);
				cy.getByAutoId('nrfTryGen').should('exist').should('contain', i18n._TryMoreGeneralKeywords_);
				cy.getByAutoId('nrfDYNSerial').should('exist').should('contain', i18n._SerialNumber_);
				cy.getByAutoId('nrfDYNCaseNum').should('exist').should('contain', i18n._CaseNumber_);
				cy.getByAutoId('nrfDYNConNum').should('exist').should('contain', i18n._ContractNumber_);
				cy.getByAutoId('nrfDYNrmaNum').should('exist').should('contain', i18n._RMANumber_);
				cy.getByAutoId('nrfDYNInfo').should('exist').should('contain', i18n._InformationAboutThatItem_);
				cy.getByAutoId('searchClose').should('exist').click();
			});
		});

		// TODO add the auto-id's to the html and retest
		it.skip('Search Type Ahead PBC-168', () => {
			const searchVal = 'cat';
			cy.getByAutoId('searchBarinput').should('exist').clear()
				.type(searchVal);
			cy.getByAutoId('searchBarTypeahead').should('exist');
			cy.getByAutoId('searchBarTypeahead')
				.should($searchBarTypeahead => {
					expect($searchBarTypeahead).to.have.length(7);
				});
		});
	});

	context('Case Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Case Search', () => {
			// PBC-169
			const caseVal = '688296392'; // '686569178' '688296392' also works
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('case');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(caseVal.concat('{enter}'));
			cy.wait('@case').then(() => {
				cy.getByAutoId('caseNum').should('exist').should('contain', ('Case ').concat(caseVal));
				cy.getByAutoId('latestUpdate').should('exist').should('contain', i18n._LatestUpdate_);
				cy.getByAutoId('caseStatus').should('exist').should('contain', i18n._Status_);
				cy.getByAutoId('caseOwner').should('exist').should('contain', i18n._CaseOwner_);
				cy.getByAutoId('caseSeverity').should('exist').should('contain', i18n._Severity_);
				cy.getByAutoId('caseCreated').should('exist').should('contain', i18n._Created_);
				cy.getByAutoId('caseContract').should('exist').should('contain', i18n._Contract_);
				cy.getByAutoId('caseDevice').should('exist').should('contain', i18n._Device_);
				cy.getByAutoId('caseTACEng').should('exist').should('contain', i18n._TACEngineer_);
				cy.getByAutoId('caseTracking').should('exist').should('contain', i18n._TrackingNumber_);
				cy.getByAutoId('caseRelRMAs').should('exist').should('contain', i18n._RelatedRMAs_);
				cy.getByAutoId('viewCaseDetailsB').should('exist').should('contain', i18n._ViewCaseDetails_);
				cy.getByAutoId('viewAllOpenCasesB').should('exist').should('contain', i18n._ViewAllOpenCases_);
			});
			cy.getByAutoId('searchSiteSelect').should('exist');
			cy.getByAutoId('searchTypeSelect').should('exist');
			cy.getByAutoId('cui-select')
				.should($cuiselect => {
					expect($cuiselect).to.have.length(2);
				});
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
				cy.getByAutoId('caseNum').should('not.exist'); // .should('contain', i18n._Case_);
				cy.get('app-general-search').should('contain', '10 Results for "'.concat(caseVal).concat('"'));
				cy.getByAutoId('searchSiteSelect').should('exist');
				cy.getByAutoId('searchTypeSelect').should('exist');
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
						expect($rmaUnavail).to.have.length(2);
					});
				cy.getByAutoId('rmaProdID').should('exist');
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

		it('RMA Not Found 800000009', () => {
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

	context('Contract Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});
	});
	context('Serial Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});
	});
});
