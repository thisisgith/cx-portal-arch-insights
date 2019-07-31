import MockService from '../support/mockService';

const atxMock = new MockService('ATXScenarios');
const atxOnboardScenario = atxMock.getScenario('GET', '(ATX) IBN-Campus Network Assurance-Onboard');
const atxItems = atxOnboardScenario.response.body.items;

describe('Ask The Expert (ATX)', () => { // PBC-31
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();

		// Wait for the ATX panel to finish loading
		cy.waitForAppLoading('atxLoading', 15000);
	});

	it.skip('Renders ATX tile', () => {
		cy.getByAutoId('PanelTitle-_AskTheExpert_').should('have.text', 'Ask The Expert');
		cy.getByAutoId('recommendedATX-Title')
			.should('have.text', atxItems[0].title);
		cy.getByAutoId('recommendedATXScheduleButton').should('exist');
		cy.getByAutoId('recommendedATXWatchButton').should('exist');
		cy.getByAutoId('moreATXList').then($list => {
			atxItems.forEach((item, index) => {
				if (index !== 0) { // Ignore recommended title
					cy.wrap($list).should('contain', item.title);
				}
			});
		});
	});

	it('Displays a modal with all available sessions', () => {
		cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
		cy.get('#atxModal').should('be.visible');
		cy.get('#atxModal .modal__header')
			.should('contain', 'Ask The Expert')
			.and('contain', 'Available live or on-demand');
		cy.get('#atxModal .modal__body')
			.should('contain', `${atxItems.length} Topics Available`);
		cy.get('#atxModal .card').each(($card, index) => {
			const atxItem = atxItems[index];
			cy.wrap($card).within(() => {
				cy.get('.card__header').should('have.text', atxItem.title);
				cy.get('.card__body').should('have.text', atxItem.description);
				cy.get('.card__footer').should('contain', atxItem.duration);
			});
		});
		cy.getByAutoId('ATXCloseModal').click();
	});

	it('ATX Tile Tooltip', () => { // PBC-166
		// Don't assume there is only one recommended item, so ensure the shown tooltip is recommended
		cy.get('#hover-panel-recommendedATX h6').then($panel => {
			let foundItem;
			Cypress._.each(atxItems, item => {
				// TODO: Resolving PBC-189 should change 'completed' to 'recommended' below
				if ($panel[0].innerText === item.title && item.status === 'completed') {
					foundItem = item;
				}
			});
			cy.get('#hover-panel-recommendedATX').should('exist');
			cy.get('#hover-panel-recommendedATX h6').should('have.text', foundItem.title);
			cy.get('#hover-panel-recommendedATX div:first').should('have.class', 'divider');
			cy.get('#hover-panel-recommendedATX div').should('have.text', foundItem.description);
		});
	});
});
