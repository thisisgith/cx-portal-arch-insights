import MockService from '../support/mockService';

const accMock = new MockService('ACCScenarios');
const accOnboardScenario = accMock.getScenario('GET', '(ACC) IBN-Wireless Assurance-Onboard');
const accItems = accOnboardScenario.response.body.items;

describe('Accelerator (Accelerator)', () => { // Jira: PBC-tbd
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();
	});

	it('Renders Accelerator tile', () => {
		cy.getByAutoId('Accelerator Panel').should('exist');
		cy.getByAutoId('PanelTitle-_Accelerator_').should('have.text', 'Accelerator');
		cy.getByAutoId('recommendedACCTitle').should('have.text', 'Cisco DNA Center Project Planning');
		cy.getByAutoId('recommendedACCWatchButton').should('have.text', 'Request a 1-on-1');
		cy.getByAutoId('moreACCList').should('exist');
		// No other data-auto-id's exist at this time
	});

	it('Accelerator Tile Tooltip', () => { // PBC-166
		// Don't assume there is only one recommended item, so ensure the shown tooltip is recommended
		cy.get('#hover-panel-recommendedACCTitle h6').then($panel => {
			let foundItem;
			Cypress._.each(accItems, item => {
				if ($panel[0].innerText === item.title && item.status === 'recommended') {
					foundItem = item;
				}
			});
			cy.get('#hover-panel-recommendedACCTitle').should('exist');
			cy.get('#hover-panel-recommendedACCTitle h6').should('have.text', foundItem.title);
			cy.get('#hover-panel-recommendedACCTitle div:first').should('have.class', 'divider');
			cy.get('#hover-panel-recommendedACCTitle div').should('have.text', foundItem.description);
		});
	});
});
