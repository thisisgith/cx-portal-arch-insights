import MockService from '../support/mockService';

/// <reference types="Cypress" />


const commMock = new MockService('ATXScenarios');
const commOnboardScenario = commMock.getScenario('GET', '(Communities) IBN-Assurance-Onboard');  //environments/mock/communities.ts
// const commItems = commOnboardScenario.response.body.items;  // will give error if commItems is not used below

describe('Communities (Communities)', () => { // PBC-fedoriw
	before(() => {
		cy.login();
		cy.loadApp();
        cy.waitForAppLoading();
	});

	it('Renders Communities tile', () => {
		cy.getByAutoId('PanelTitle-_Communities_').should('have.text', 'Communities');
		cy.getByAutoId('ShowModalPanel-_Communities_').should('exist');
		// No other data-auto-id's exist at this time
	});
});