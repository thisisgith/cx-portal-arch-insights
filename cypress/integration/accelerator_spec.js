import MockService from '../support/mockService';

const accMock = new MockService('ACCScenarios'); // for future changes
const solution = 'IBN';
const useCase = 'Wireless Assurance';
const accScenario = accMock.getScenario('GET', `(ACC) ${solution}-${useCase}-Onboard`);
const accItems = accScenario.response.body.items;

const i18n = require('../../src/assets/i18n/en-US.json');

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
		cy.getByAutoId('PanelTitle-_Accelerator_').should('have.text', i18n._Accelerator_);
		cy.getByAutoId('recommendedACCTitle').should('have.text', 'Cisco DNA Center Project Planning');
		cy.getByAutoId('recommendedACCWatchButton').should('have.text', i18n._Request1on1_);
		cy.getByAutoId('moreACCList').should('exist');
		// No other data-auto-id's exist at this time
	});

	it('ACC tile has a view all link to display ACCs in card view', () => { // PBC-159
		cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
		cy.get('.modal__header.acc__header').should('contain', i18n._Accelerator_)
			.and('contain', i18n._1on1Coaching_);
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
					case 'completed':
						cy.getByAutoId('ACCCardFooter')
							.should('contain', 'Completed');
						break;
					case 'in-progress':
						cy.getByAutoId('ACCCardFooter')
							.should('contain', i18n._CSETouch_);
						break;
					default:	// Default: recommended
						cy.getByAutoId('Reqest1on1Button')
							.should('contain', i18n._Request1on1_)
							.parent()
							.should('have.attr', 'href', acc.url);
				}

				// PBC-237 Check bookmark ribbon
				if (acc.status === 'completed') {
					cy.getByAutoId('ACCCardRibbon')
						.should('have.class', 'ribbon__green');
					cy.get('.star').should('exist');
				} else if (acc.isFavorite) {
					cy.getByAutoId('ACCCardRibbon')
						.should('have.class', 'ribbon__blue');
				} else {
					cy.getByAutoId('ACCCardRibbon')
						.should('have.class', 'ribbon__clear');
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
			cy.get('#hover-panel-recommendedACCTitle div').should('have.class', 'divider');
			// New items: button, and clickable ribbon added on this panel, should rewrite the below
			// cy.get('#hover-panel-recommendedACCTitle div').should('have.text', foundItem.description);
		});
	});

	describe('PBC-237: (UI) View -  Lifecycle - ACC Status Ribbons', () => {
		before(() => {
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
		});

		after(() => {
			cy.getByAutoId('ACCCloseModal').click();
		});

		it('Should be able to bookmark an ACC item', () => {
			cy.getByAutoId('accViewAllModal').within(() => {
				accItems.forEach((acc, index) => {
					if (!acc.isFavorite && acc.status !== 'completed') {
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__clear')
							.click();
						cy.waitForAppLoading('accLoading', 5000);
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__blue');
					}
				});
			});
		});

		it('Should be able to UN-bookmark an ACC item', () => {
			cy.getByAutoId('accViewAllModal').within(() => {
				accItems.forEach((acc, index) => {
					if (acc.isFavorite && acc.status !== 'completed') {
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__blue')
							.click();
						cy.waitForAppLoading('accLoading', 5000);
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__clear');
					}
				});
			});
		});

		it('Should NOT be able to bookmark a completed ACC item', () => {
			cy.getByAutoId('accViewAllModal').within(() => {
				accItems.forEach((acc, index) => {
					if (acc.status === 'completed') {
						// For completed items, the ribbon is behind the star, so force the click through
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.click({ force: true });
						cy.waitForAppLoading('accLoading', 5000);
						// Ribbon should remain green
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__green');
					}
				});
			});
		});
	});
});
