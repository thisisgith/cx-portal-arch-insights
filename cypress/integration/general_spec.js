import MockService from '../support/mockService';

const i18n = require('../../src/assets/i18n/en-US.json');

const searchMock = new MockService('SearchScenarios');
const coverageMock = new MockService('CoverageScenarios');
const contractMock = new MockService('ContractScenrios');
const searchVal = 'a';
let pitstop;

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

	context('Verify pitStop Parameter w/ CDC search', () => {
		before(() => {
			cy.login();
			cy.loadApp('/solution/lifecycle');
			cy.waitForAppLoading();
		});

		it('verify pitstop', () => { // PBC-507
			cy.server();
			cy.route('POST', '**/search/v1/cdcSearch*').as('case');
			searchMock.disable('Generic Example');
			cy.getByAutoId('setup-wizard-header-close-btn').click();
			cy.get('h3[class="text-primary"]').then(str => {
				pitstop = str.text();
			});

			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(searchVal.concat('{enter}'));
			cy.wait('@case').then(xhr => {
				const req = xhr.request.body;
				cy.log(`req is ${req}`);
				expect(req).to.include(`pitStop=${pitstop}`);
			});
		});
	});

	context('Case Search', () => {
		const caseVal = '699159996';
		const anotherCaseVal = '699160599';

		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
			cy.getByAutoId('setup-wizard-header-close-btn').click();
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

		it('PBC-483 Case Related RMA link', () => {
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('case');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(anotherCaseVal.concat('{enter}'));
			cy.wait('@case').then(() => {
				cy.getByAutoId('rmaNumber', { timeout: 10000 })
					.should('have.attr', 'href');
				cy.getByAutoId('rmaNumber')
					.should('have.attr', 'target', '_blank');
			});
		});
	});

	context('RMA Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
			cy.getByAutoId('setup-wizard-header-close-btn').click();
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
				.type(rmaVal.concat('{enter}'));

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
		it.skip('PBC-172 Contract Search 93425688', () => {
			// skip: Contract number data missing
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
		it('PBC-172 Contract search not found 93425333', () => {
			coverageMock.enable('HEAD Coverage 93425688');
			contractMock.enable('Contract Details Success Other Other');
			const contractVal = '93425333';
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('contract'); // TODO might need to update route
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(contractVal.concat('{enter}'));
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
				// const serialVal = 'FOC1544Y16T'; // real SN
				const serialVal = 'FOX1333GGGG';
				cy.server();
				cy.route('**/esps/search/suggest/cdcpr01zad?*').as('serial');
				cy.getByAutoId('searchBarInput').should('exist').clear()
					.type(serialVal.concat('{enter}'));
				cy.wait('@serial');
			});

			it.skip('PBC-247 Serial Number Intercept - Last Scan Text', () => {
				// TODO  Need to mock lastScan with data in FOX1333GGGG
				// TODO First need to find sample SN with lastScan populated
				cy.getByAutoId('clockIcon').should('exist'); // PBC-247 specific
				cy.getByAutoId('lastScanText').should('exist').should('contain', 'Based on last scan'); // PBC-247 specific
			});

			it('PBC-248 Serial Number intercept - View Device Details', () => {
				cy.getByAutoId('viewDeviceButton').should('exist').click(); // PBC-248 specific
				cy.getByAutoId('Asset360SerialNumber').should('exist'); // app360 panel opened
				cy.getByAutoId('CloseDetails').should('exist').click();
			});

			it('PBC-249 Serial Number Intercept - Open a Case', () => {
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

	context('Portal Support', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('PBC-369 Portal Support', () => {
			const DescriptionText = 'Sample Description Text for Portal Support';
			cy.getByAutoId('HeaderPortalHelpButton').click();
			cy.getByAutoId('HeaderDropdownClose').click(); // close it
			cy.getByAutoId('HeaderPortalHelpButton').click(); // open it again
			cy.getByAutoId('portalHelp').click(); // open the Contact Support modal
			cy.getByAutoId('supportTopic').should('exist');
			cy.getByAutoId('cui-select').click();
			cy.get('a[title="CX Collector Support"]').click(); // select any value
			cy.getByAutoId('supportDescription').should('exist');
			cy.get('textarea').click()
				.type(DescriptionText);
			// PBC- 393: Typing 32000 characters into text box test case
			// was manually verified
			cy.getByAutoId('submit').click();
			// Info: localhost blocked by CORS policy
			cy.getByAutoId('portalSupportHide').should('exist');
			cy.getByAutoId('done').should('exist').click();
		});
	});

	context('PBC-25: Header View', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Verify the Header links', () => { // PBC-25
			// Cisco Logo
			cy.getByAutoId('HeaderCiscoLink').should('exist').should('have.attr', 'href', 'https://www.cisco.com');
			cy.get('h5.text-nowrap.base-margin-right').contains(i18n._ApplicationName_);
			cy.getByAutoId('HeaderCommunityLink').should('exist').should('have.attr', 'href', 'https://community.cisco.com/t5/technology-and-support/ct-p/technology-support');
			cy.getByAutoId('HeaderLearningLink').should('exist').should('have.attr', 'href', 'https://pilot-digital-learning.cisco.com/cx/#/');
			cy.getByAutoId('searchBarInput').should('exist').should('have.attr', 'placeholder', 'Products, Docs, Serial #, Case #, Contract #, RMA #...');
			cy.getByAutoId('SearchBarButton').should('exist');
			cy.getByAutoId('HeaderUserProfileButton').should('exist');
			cy.getByAutoId('HeaderUserProfileButton').click();
			cy.getByAutoId('HeaderUserProfileDropdownImage').should('exist');
			cy.getByAutoId('HeaderUserFullName').should('exist');
			cy.getByAutoId('HeaderUserEmail').should('exist');
			cy.get('header-dropdown > div > div > div:nth-child(3) > a').should('have.attr', 'href', 'https://rpfa.cloudapps.cisco.com/rpfa/profile/profile_management.do');
			cy.get('header-dropdown > div > div > div:nth-child(4) > a').should('have.attr', 'href', 'https://www.cisco.com/autho/logout.html');
			cy.getByAutoId('HeaderDropdownClose').click();
			// Admin icon
			cy.getByAutoId('Admin').should('have.attr', 'title', 'Admin');
			cy.getByAutoId('Admin').should('have.attr', 'ng-reflect-router-link', 'admin'); // URL is : pbc/admin/settings
			// Portal Help
			cy.getByAutoId('HeaderPortalHelpButton').should('exist').should('have.attr', 'title', 'Portal Help');
			cy.getByAutoId('HeaderPortalHelpButton').click();
			cy.get('header-dropdown > div > div > div.text-muted.text-small.text-uppercase').contains(i18n._PortalHelp_);
			cy.get('a[data-auto-id="portalHelp"]').contains('Portal Support');
			cy.get('a[data-auto-id="portalHelp"]').click();
			cy.get('h1.modal-title').contains(i18n._ContactSupport_);
		    // Test cases covered in PBC-369
			cy.getByAutoId('portalSupportHide').click();
		});
	});

	context('PBC-128, PBC-653, PBC-722: Feedback modal window feature', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('PBC-128: Feedback modal window feature', () => { // PBC-128
			cy.getByAutoId('FeedbackModal').click();
			cy.get('div.modal__title').should('have.text', i18n._Feedback_);
			cy.get('div.modal__body > form > span').should('have.text', i18n._HowWouldYouRateYourExp_);
			cy.getByAutoId('thumbUpBtn').should('exist');
			cy.getByAutoId('thumbDownBtn').should('exist');
			cy.getByAutoId('closeModalIcon').should('exist');
			cy.get('div.form-group__text > label').should('have.text', i18n._WhatCanWeDoToImprove_);
			cy.get('div.text-right.help-block.text-muted > div > span').should('have.text', '0/2000'); // PBC-653
			cy.get('span.checkbox__input').should('exist');
			cy.get('[class="checkbox__label hidden-xs text-small"]').should('have.text', i18n._CiscoCanContactMe_);
			cy.getByAutoId('thumbUpBtn').click(); // PBC-722
			cy.getByAutoId('thumbUpBtn').should('have.attr', 'class', 'btn btn--icon btn--large btn--secondary active');
			cy.getByAutoId('thumbDownBtn').click();
			cy.getByAutoId('thumbDownBtn').should('have.attr', 'class', 'btn btn--icon btn--large btn--secondary base-margin-left active');
			cy.getByAutoId('submitBtn').should('be.disabled');
			cy.get('[placeholder="Comments"]').click().type('QA test');
			cy.get('div.text-right.help-block.text-muted > div > span').should('have.text', '7/2000');
			cy.getByAutoId('submitBtn').should('be.enabled');
			cy.getByAutoId('closeModalIcon').click();
		});
	});
});
