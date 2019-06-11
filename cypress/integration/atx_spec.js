import MockService from '../support/mockService';

const atxMock = new MockService('ATXScenarios');
const atxOnboardScenario = atxMock.getScenario('GET', '(ATX) IBN-Wireless Assurance-Onboard');
const atxItems = atxOnboardScenario.response.body.items;

describe('Ask The Expert (ATX)', () => { // PBC-31
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();
	});

	it('Renders ATX tile', () => {
		cy.getByAutoId('PanelTitle-_AskTheExpert_').should('have.text', 'Ask The Expert');
		cy.getByAutoId('recommendedATXTitle')
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
});
