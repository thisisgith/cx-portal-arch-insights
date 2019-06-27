import { Util } from '@apollo/cypress-util';
import MockService from '../support/mockService';

const util = new Util();
const assetMock = new MockService('AssetScenarios');
const coverageMock = new MockService('CoverageScenarios');
const networkScenario = assetMock.getScenario('GET', 'Assets Page 1');
const assets = networkScenario.response.body.data;
const totalCountScenario = coverageMock.getScenario('GET', 'Coverage');
const coverageElements = totalCountScenario.response.body;

describe('Assets', () => { // PBC-41
	before(() => {
		cy.login();
		cy.loadApp('/solution/assets');
		cy.waitForAppLoading();
	});

	// Skipping until asset360 is re-enabled
	it.skip('Provides an Asset 360 view modal', () => { // PBC-151
		const { halfWidthInPx, widthInPx } = util.getViewportSize();
		cy.get('tr').eq(1).click();
		cy.get('asset-details')
			.should('be.visible')
			.and('have.css', 'width', halfWidthInPx); // default to half width
		cy.getByAutoId('Asset360SerialNumber').should('have.text', `Serial Number${assets[0].serialNumber}`);
		cy.getByAutoId('asset-details-toggle-fullscreen-icon').click();
		cy.get('asset-details').should('have.css', 'width', widthInPx); // expand to full width
		cy.getByAutoId('ClearAsset').click();
		cy.get('tr').eq(2).click();
		cy.get('asset-details').should('have.css', 'width', widthInPx); // remember last width
		cy.getByAutoId('asset-details-toggle-fullscreen-icon').click();
		cy.get('asset-details').should('have.css', 'width', halfWidthInPx); // shrink to half width
		cy.get('tr').eq(3).click(); // switch to new asset without closing modal
		cy.getByAutoId('Asset360SerialNumber').should('have.text', `Serial Number${assets[2].serialNumber}`);
		cy.getByAutoId('ClearAsset').click();
	});

	// Skipping until asset360 is re-enabled
	it.skip('Provides an Activity timeline in the 360 view modal', () => { // PBC-158
		cy.get('tr').eq(1).click();
		cy.getByAutoId('ActivityTab').click();

		// TODO: This is all placeholder data to be replaced when the API is ready
		cy.get('div.timeline__time').eq(0).should('have.text', 'a few seconds ago');
		cy.get('div.timeline__content').eq(0)
			.should('contain', 'Title')
			.and('contain', 'Lorem ipsum');
		cy.getByAutoId('ClearAsset').click();
	});

	context('PBC-178: Assets & Coverage Gauge', () => {
		it('Displays a gauge that shows coverage percentage', () => {
			const total = Cypress._.reduce(coverageElements, (memo, value) => memo + value);
			const coverage = Math.floor((coverageElements.covered / total) * 100);
			cy.getByAutoId('Facet-Assets & Coverage').should('contain', `${coverage}%`)
				.and('contain', 'Assets & Coverage');
		});

		it.skip('Gracefully handles invalid responses from the API', () => {
			// TODO: Percentage should default to 0% if:
			// - X-API-RESULT-COUNT headers are missing from API response (*)
			// - X-API-RESULT-COUNT headers are not valid numbers (*)
			// - API isn't responding - waiting on PBC-227
			// (*) waiting on https://gitlab-sjc.cisco.com/sso-apps/libraries/cui-x-staging/merge_requests/13
		});
	});

	context.only('PBC-36: Asset List', () => {
		it('Displays assets correctly in list view', () => {
			cy.get('tbody > tr').should('have.length', assets.length);
			Cypress._.each(assets, asset => {
				const serial = asset.serialNumber;
				cy.getByAutoId(`InventoryItem-${serial}`).within(() => {
					// TODO: Asset device icon exists after PBC-257
					cy.getByAutoId(`Device-${serial}`).should('have.text', asset.deviceName);
					cy.getByAutoId(`IP Address-${serial}`).should('have.text', asset.ipAddress);
					// TODO: "Last Scan" is not implemented yet
					cy.getByAutoId(`Last Scan-${serial}`).should('have.text', 'Never');
					// TODO: "Critical Advisories" is not implemented yet
					// cy.getByAutoId(`Critical Advisories-${serial}`).should('have.text', '');
					if (asset.supportCovered) {
						cy.getByAutoId('SupportCoveredIcon').should('be.visible');
					} else {
						cy.getByAutoId('SupportCoveredIcon').should('not.be.visible');
					}
					cy.getByAutoId(`Serial Number-${serial}`).should('have.text', asset.serialNumber);
					cy.getByAutoId(`Software Type-${serial}`).should('have.text', asset.osType);
					cy.getByAutoId(`Software Version-${serial}`).should('have.text', asset.osVersion);
					if (asset.role) {
						cy.getByAutoId(`Role-${serial}`).should('have.text', asset.role);
					}
				});
			});
		});

		it('Supports selecting one or more assets in the list', () => {
			cy.get('tbody > tr').eq(0).click() // click row
				.should('have.class', 'active');
			cy.getByAutoId(`InventoryItemSelect-${assets[1].serialNumber}`).click(); // click checkbox
			cy.get('tbody > tr').eq(2).should('not.have.class', 'active');
			cy.getByAutoId('TotalSelectedCount').should('have.text', '2 Selected');
			cy.get('tbody > tr').eq(0).click()
				.should('not.have.class', 'active');
			cy.getByAutoId('AllAssetSelect').click();
			cy.getByAutoId('TotalSelectedCount').should('have.text', `${assets.length} Selected`);
			cy.getByAutoId('AllAssetSelect').click();
			cy.getByAutoId('TotalSelectedCount').should('not.exist');
		});

		it('Renders table gracefully when APIs are unavailable', () => {
			// TODO: Needs mock service changes
		});

		it('Filters asset list with all visual filters', () => {

		});

		it.skip('Renders visual filtes gracefully when APIs are unavailable', () => {
			// TODO: PBC-254
		});

		it('Combines visual filters appropriately', () => {

		});
	});
});
