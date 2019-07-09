import MockService from '../support/mockService';

const accMock = new MockService('ACCScenarios'); // for future changes
const solution = 'IBN';
const useCase = 'Wireless Assurance';
const accScenario = accMock.getScenario('GET', `(ACC) ${solution}-${useCase}-Onboard`);
const accItems = accScenario.response.body.items;

describe('Accelerator (ACC)', () => { // PBC-32
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();

		// Wait for the ACC panel to finish loading
		cy.waitForAppLoading('accLoading', 15000);
	});

	it('Renders Accelerator tile', () => {
		cy.getByAutoId('Accelerator Panel').should('exist');
		cy.getByAutoId('PanelTitle-_Accelerator_').should('have.text', 'Accelerator');
		cy.getByAutoId('recommendedACCTitle').should('have.text', 'Cisco DNA Center Project Planning');
		cy.getByAutoId('recommendedACCWatchButton').should('have.text', 'Request a 1-on-1');
		cy.getByAutoId('moreACCList').should('exist');
		// No other data-auto-id's exist at this time
	});

	it('ACC tile has a view all link to display ACCs in card view', () => { // PBC-159
		cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
		cy.get('.modal__header.acc__header').should('contain', 'Accelerator')
			.and('contain', '1-on-1 Coaching to put you in the fast lane');
		cy.getByAutoId('ACCTopicsAvailable').should(
			'have.text', `${accItems.length} topics available for ${solution} > ${useCase}:`
		);

		accItems.forEach((acc, index) => {
			cy.getByAutoId('ACCCard').eq(index).within(() => {
				if (acc.status === 'recommended') {
					cy.getByAutoId('ACCCardHeader').should('have.class', 'text-info');
				} else {
					cy.getByAutoId('ACCCardHeader').should('have.class', 'text-clear');
				}
				cy.getByAutoId('ACCCardTitle').should('have.text', acc.title);
				cy.get('.atx-card__body').should('contain', acc.description);
				switch (acc.status) {
					case 'scheduled':
						cy.getByAutoId('ACCCardFooter')
							.should('contain', 'Your CSE will be in touch shortly');
						cy.getByAutoId('ACCCardRibbon')
							.should('have.class', 'ribbon__blue');
						break;
					case 'completed':
						cy.getByAutoId('ACCCardFooter')
							.should('contain', 'Completed');
						cy.getByAutoId('ACCCardRibbon')
							.should('have.class', 'ribbon__green');
						cy.get('.star').should('exist');
						break;
					default: // since we have more status now, need to rewrite the below
						// cy.getByAutoId('request1on1').should('contain', 'Request a 1-on-1')
						// 	.and('have.attr', 'href', acc.url);
						// cy.getByAutoId('ACCCardRibbon')
						// 	.should('have.class', 'ribbon__clear');
				}
			});
		});
		cy.getByAutoId('ACCCloseModal').click();
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
