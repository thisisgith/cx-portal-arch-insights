import * as util from '@apollo/cypress-util/lib/util';
import MockService from '../support/mockService';

const assetMock = new MockService('NetworkScenarios');
const networkScenario = assetMock.getScenario('GET', 'Network Elements Page 1');
const assets = networkScenario.response.body.data;

describe('Assets', () => { // PBC-41
	before(() => {
		cy.login();
		cy.loadApp('/solution/assets');
		cy.waitForAppLoading();
	});

	it('Provides an Asset 360 view modal', () => { // PBC-151
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

	it('Provides an Activity timeline in the 360 view modal', () => { // PBC-158
		cy.get('tr').eq(1).click();
		cy.getByAutoId('ActivityTab').click();

		// TODO: This is all placeholder data to be replaced when the API is ready
		cy.get('div.timeline__time').eq(0).should('have.text', 'a few seconds ago');
		cy.get('div.timeline__content').eq(0)
			.should('contain', 'Title')
			.and('contain', 'Lorem ipsum');
	});
});
