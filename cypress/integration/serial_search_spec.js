// import MockService from '../support/mockService';

const i18n = require('../../src/assets/i18n/en-US.json');

describe('Serial Spec', () => {
	context('Serial Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('Serial Search FOX1306GFKH', () => {
			// PBC-170
			const serialVal = 'FOX1306GFKH';
			cy.server();
			cy.route('**/esps/search/suggest/cdcpr01zad?*').as('serial');
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(serialVal.concat('{enter}'));
			cy.wait('@serial').then(() => {
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
			});

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
			cy.wait('@serial').then(() => {
				cy.getByAutoId('serialHeader').should('not.exist');
				cy.get('app-general-search').should('contain', '10 Results for "'.concat(serialVal).concat('"'));
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
		});
	});
});
