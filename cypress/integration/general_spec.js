import MockService from '../support/mockService';

const i18n = require('../../src/assets/i18n/en-US.json');

const searchMock = new MockService('SearchScenarios');
const coverageMock = new MockService('CoverageScenarios');
const contractMock = new MockService('ContractScenrios');

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

		it.skip('General Search and close', () => { // PBC-167
			const searchVal = '688296392'; // orig value:639530286  686569178
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('case');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(searchVal.concat('{enter}'));
			cy.wait('@case').then(() => {
				cy.getByAutoId('searchSiteSelect').should('exist');
				cy.getByAutoId('cui-select').should('have.length', 2);
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

		it.skip('Search No Result Found', () => { // PBC-173
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

		it('Search Type Ahead', () => { // PBC-168
			const searchVal = 'cat';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(searchVal);
			cy.getByAutoId('searchBarTypeAhead')
				.should($searchBarTypeahead => {
					expect($searchBarTypeahead).to.have.length(7);
				});
		});
	});

	context('Case Search', () => {
		const caseVal = '699159996';

		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Case Search', () => {
			// PBC-169
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
				// cy.getByAutoId('rmaNumber').should('exist');
				// api-roulette, not all cases have rmaNumber
				cy.getByAutoId('viewCaseDetailsB').should('exist')
					.should('contain', i18n._ViewCaseDetails_);
				// .should('have.attr', 'href', '/urlDetail'); // TODO currently not linked to anything
				cy.getByAutoId('viewAllOpenCasesB').should('exist')
					.should('contain', i18n._ViewAllOpenCases_);
				// .should('have.attr', 'href', '/urlDetail'); // TODO currently not linked to anything
				cy.getByAutoId('searchSiteSelect').should('exist');
				cy.getByAutoId('searchTypeSelect').should('exist');
				cy.getByAutoId('cui-select').should('have.length', 2);
				cy.getByAutoId('searchResultLinkPre0').should('exist');
				cy.getByAutoId('searchResultLinkPre1').should('exist');
				cy.getByAutoId('searchResultLinkPre2').should('exist');
				cy.getByAutoId('searchClose').should('exist').click();
			});
		});

		it('Case not found', () => {
			// PBC-169
			const invalidCaseVal = '686568888';
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('case');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(invalidCaseVal.concat('{enter}'));
			cy.wait('@case').then(() => {
				cy.getByAutoId('caseNum').should('not.exist'); // .should('contain', i18n._Case_);
				cy.get('app-general-search').should('contain', '10 Results for "'.concat(invalidCaseVal).concat('"'));
				cy.getByAutoId('searchSiteSelect').should('exist');
				cy.getByAutoId('searchTypeSelect').should('exist');
				cy.getByAutoId('cui-select').should('have.length', 2);
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
				cy.getByAutoId('rmaTrackingNumber').should('exist')
					.should('contain', i18n._CarrierTrackingNumber_);
				cy.getByAutoId('rmaCourierLink').children()
					.should('have.attr', 'href'); // PBC-243
				cy.getByAutoId('rmaCourierLink').children()
					.should('have.attr', 'target', '_blank'); // PBC-243
				cy.getByAutoId('contractNumber').should('exist');
				cy.getByAutoId('rmaViewDetButton').should('exist');
				cy.getByAutoId('rmaProduct').should('exist');
				cy.getByAutoId('rmaProdID').should('exist');
				cy.getByAutoId('rmaViewDetButton').should('exist');
			});
			// General Search section
			cy.getByAutoId('searchHeader').should('exist');
			cy.getByAutoId('filterBy').should('exist');
			cy.getByAutoId('cui-select').should('have.length', 2);
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
				cy.getByAutoId('rmaProdDescr').should('have.length', 4);
				cy.getByAutoId('rmaProdID').should('have.length', 4);
				cy.getByAutoId('rmaViewDetButton').should('exist');
				// General Search section
				cy.getByAutoId('searchHeader').should('exist');
				cy.getByAutoId('filterBy').should('exist');
				cy.getByAutoId('cui-select').should('have.length', 2);
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
				cy.getByAutoId('rmaCourierLink').children()
					.should('have.attr', 'href'); // PBC-243
				cy.getByAutoId('rmaCourierLink').children()
					.should('have.attr', 'target', '_blank'); // PBC-243
				cy.getByAutoId('contractNumber').should('exist');
				cy.getByAutoId('rmaViewDetButton').should('exist');
				cy.getByAutoId('rmaProduct').should('exist');
				cy.getByAutoId('rmaUnavail').should('have.length', 2);
				cy.getByAutoId('rmaProdID').should('exist');
				cy.getByAutoId('rmaViewDetButton').should('exist');
				// .should('have.attr', 'href', '/urlDetail'); // TODO currently not linked to anything
				// General Search section
				cy.getByAutoId('searchHeader').should('exist');
				cy.getByAutoId('filterBy').should('exist');
				cy.getByAutoId('cui-select').should('have.length', 2);
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
				cy.getByAutoId('cui-select').should('have.length', 2);
				cy.getByAutoId('searchResultLinkPre0').should('exist');
				cy.getByAutoId('searchResultLinkPre1').should('exist');
				cy.getByAutoId('searchResultLinkPre2').should('exist');
				cy.getByAutoId('searchClose').should('exist').click();
			});
		});
		it('RMA 800000000 click the case link', () => {
			// PBC-250
			// mock set at "RMA with one replacement part"
			const rmaVal = '800000000';
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('rma');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(rmaVal.concat('{ enter }'));

			cy.wait('@rma').then(() => {
				cy.wait(3000);
				cy.getByAutoId('rmaStatus').should('exist').should('contain', i18n._Status_);
				cy.getByAutoId('rmaNumber').should('exist');
				cy.getByAutoId('caseNumber').should('exist').click({ multiple: true });
				// TODO rather than click multiple, how to click the second caseNumber?
				cy.wait(3000);
				cy.get('details-panel').should('be.visible');
				cy.getByAutoId('CloseDetails').should('exist').click();
			});
		});
	});

	context('Contract Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});
		it('Contract Search 93425688', () => {
			// PBC-172
			coverageMock.enable('HEAD Coverage 93425688');
			coverageMock.enable('GET Coverage 93425688');
			const contractVal = '93425688';
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('contract');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(contractVal.concat('{enter}'));
			cy.wait('@contract').then(() => {
				cy.getByAutoId('contractStatus').should('exist');
				cy.getByAutoId('contractHeader').should('exist');
				cy.getByAutoId('contractType').should('exist').should('contain', i18n._Type_);
				// cy.getByAutoId('contractLevel').should('exist');
				cy.getByAutoId('contractStart').should('exist').should('contain', i18n._StartDate_);
				cy.getByAutoId('contractExpire').should('exist').should('contain', i18n._ExpirationDate_);
				cy.getByAutoId('contractAssets').should('exist').should('contain', i18n._AssetsCovered_);
				cy.getByAutoId('contractAssetsCount').should('exist');
			});
			// General Search section
			cy.getByAutoId('searchHeader').should('exist');
			cy.getByAutoId('filterBy').should('exist');
			cy.getByAutoId('cui-select').should('have.length', 2);
			cy.getByAutoId('relGenRes').should('exist');
			cy.getByAutoId('searchClose').should('exist').click();
		});
		it('Contract search not found 93425333', () => {
			// PBC-172
			coverageMock.enable('HEAD Coverage 93425688');
			contractMock.enable('Contract Details Success Other Other');
			const serialVal = '93425333';
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('contract'); // TODO might need to update route
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(serialVal.concat('{enter}'));
			cy.wait('@contract').then(() => {
				cy.getByAutoId('serialHeader').should('not.exist');
				cy.get('app-general-search').should('contain', '10 Results for "contract"');
				cy.getByAutoId('searchSiteSelect').should('exist');
				cy.getByAutoId('searchTypeSelect').should('exist');
				cy.getByAutoId('cui-select').should('have.length', 2);
				cy.getByAutoId('searchResultLinkPre0').should('exist');
				cy.getByAutoId('searchResultLinkPre1').should('exist');
				cy.getByAutoId('searchResultLinkPre2').should('exist');
				cy.getByAutoId('searchClose').should('exist').click();
			});
		});
	});

	context('Serial Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Serial Search FOX1333GGGG', () => {
			// PBC-170
			const serialVal = 'FOX1333GGGG';
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('serial');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(serialVal.concat('{enter}'));
			cy.wait('@serial');
			cy.getByAutoId('serialHeader').should('exist');
			cy.getByAutoId('serialProd').should('exist').should('contain', i18n._Product_);
			cy.getByAutoId('serialCoverage').should('exist').should('contain', i18n._SupportCoverage_);
			cy.getByAutoId('serialContract').should('exist').should('contain', i18n._Contract_);
			cy.getByAutoId('serialConNum').should('exist');
			cy.getByAutoId('serialExpDate').should('exist').should('contain', i18n._ExpirationDate_);
			cy.getByAutoId('serialSWTypeOS').should('exist').should('contain', i18n._SoftwareTypeOS_);
			cy.getByAutoId('serialCurrentVer').should('exist').should('contain', i18n._CurrentVersion_);
			cy.getByAutoId('serialOpenCases').should('exist').should('contain', i18n._OpenCases_);
			cy.getByAutoId('serialOpenRMAs').should('exist').should('contain', i18n._OpenRMAs_);
			cy.getByAutoId('serialFieldNotice').should('exist').should('contain', i18n._RelatedFieldNotices_);
			cy.getByAutoId('serialSecAdv').should('exist').should('contain', i18n._RelatedSecurityAdvisories_);
			cy.getByAutoId('serialBugs').should('exist').should('contain', i18n._RelatedBugs_);
			cy.getByAutoId('serialProdID').should('exist').should('contain', i18n._ProductID_);
			cy.getByAutoId('serialProdSeries').should('exist').should('contain', i18n._ProductSeries_);
			cy.getByAutoId('serialIP').should('exist').should('contain', i18n._IPAddress_);
			cy.getByAutoId('serialHost').should('exist').should('contain', i18n._HostName_);
			cy.getByAutoId('viewDeviceButton').should('exist').should('contain', i18n._ViewDeviceDetails_);
			cy.getByAutoId('openCaseButton').should('exist').should('contain', i18n._OpenACase_);

			// General Search section
			cy.getByAutoId('searchHeader').should('exist');
			cy.getByAutoId('filterBy').should('exist');
			cy.getByAutoId('cui-select')
				.should($cuiselect => {
					expect($cuiselect).to.have.length(2);
				}); // 2 times
			cy.getByAutoId('relGenRes').should('exist');
			cy.getByAutoId('searchClose').should('exist').click();
		});

		it('Serial search not found FOX1306GFJJ', () => {
			// PBC-170
			const serialVal = 'FOX1306GFJJ';
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('serial'); // TODO might need to update route
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(serialVal.concat('{enter}'));
			cy.wait('@serial');
			cy.getByAutoId('serialHeader').should('not.exist');
			cy.get('app-general-search').should('contain', `10 Results for "${serialVal}"`);
			cy.getByAutoId('searchSiteSelect').should('exist');
			cy.getByAutoId('searchTypeSelect').should('exist');
			cy.getByAutoId('cui-select')
				.should($cuiselect => {
					expect($cuiselect).to.have.length(2);
				}); // 2 times
			cy.getByAutoId('searchResultLinkPre0').should('exist');
			cy.getByAutoId('searchResultLinkPre1').should('exist');
			cy.getByAutoId('searchResultLinkPre2').should('exist');
			cy.getByAutoId('searchClose').should('exist').click();
		});

		describe('Search enhancements - PBC-247 PBC-248 PBC-249', () => {
			beforeEach(() => {
				// Search for the chosen Serial Number
				const serialVal = 'FOC1544Y16T'; // real SN
				cy.server();
				cy.route('**/esps/search/suggest/cdcpr01zad?*').as('serial');
				cy.getByAutoId('searchBarInput').should('exist').clear()
					.type(serialVal.concat('{enter}'));
				cy.wait('@serial');
			});

			it('Serial Number Intercept - Last Scan Text', () => {
				// PBC-247
				cy.getByAutoId('clockIcon').should('exist'); // PBC-247 specific
				cy.getByAutoId('lastScanText').should('exist').should('contain', 'Based on last scan'); // PBC-247 specific
			});

			it('Serial Number intercept - View Device Details', () => {
				// PBC-248
				cy.getByAutoId('viewDeviceButton').should('exist').click(); // PBC-248 specific
				cy.getByAutoId('Asset360SerialNumber').should('exist'); // app360 panel opened
				cy.getByAutoId('CloseDetails').should('exist').click();
			});

			it('Serial Number Intercept - Open a Case', () => {
				// PBC-249
				cy.getByAutoId('openCaseButton').should('exist').should('contain', 'Open a Case') // PBC-249 specific
					.click(); // PBC-249 specific
				cy.getByAutoId('CaseOpenNextButton').should('exist');
				cy.getByAutoId('CaseOpenCancelButton').should('exist');
				cy.getByAutoId('CaseOpenClose').should('exist').click(); // Click the X
				cy.getByAutoId('CaseOpenContinue').should('exist');
				cy.getByAutoId('CaseOpenCancel').should('exist').click(); // Cancel case open
				cy.getByAutoId('searchClose').should('exist').click(); // Close the search results - X
			});
		});
	});
});
