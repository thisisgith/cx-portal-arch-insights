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
		cy.getByAutoId('recommendedACC-Title').should('have.text', 'Cisco DNA Center Project Planning');
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

	describe('PBC-166: Mouse hover to show recommended ACC/ATX description', () => {
		// NOTE: Cypress can not trigger elements with :hover css property, so we'll just check
		// that the hover modal and it's elements exist in the DOM. See below for reference:
		// https://docs.cypress.io/api/commands/hover.html#Workarounds
		// https://github.com/cypress-io/cypress/issues/10

		afterEach(() => {
			// Ensure we are set back to mock data with a recommended item
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-No Recommended');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard');

			// Refresh the data by clicking the lifecycle tab, and wait for load
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading', 5000);
		});

		it('Accelerator Tile Tooltip', () => {
			// The recommended panel should only show the first recommended ACC item
			const firstRecommendedACC = Cypress._.head(Cypress._.filter(accItems, { status: 'recommended' }));

			if (firstRecommendedACC) {
				// Recommended panel should show title, image (placeholder), and request button
				cy.getByAutoId('recommendedACC').should('exist');
				cy.getByAutoId('recommendedACC-Title').should('exist')
					.and('contain', firstRecommendedACC.title);
				cy.getByAutoId('recommendedACC-Image').should('exist')
					.and('have.attr', 'src', 'assets/img/solutions/acc.png');
				cy.getByAutoId('recommendedACCWatchButton').should('exist')
					.and('have.text', 'Request a 1-on-1');

				// Recommended hover modal should show title and description
				cy.getByAutoId('recommendedACC-HoverModal').should('exist');
				cy.getByAutoId('recommendedACC-HoverModal-Title').should('exist')
					.and('contain', firstRecommendedACC.title);
				cy.getByAutoId('recommendedACC-HoverModal-Description').should('exist')
					.and('contain', firstRecommendedACC.description);
			}
		});

		it('Should not have hover modal if there are no recommended ACC', () => {
			// Switch the mock data to one with no recommended items
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard-No Recommended');

			// Refresh the data by clicking the lifecycle tab, and wait for load
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading', 5000);

			cy.getByAutoId('recommendedACC').should('not.exist');
		});
	});
});
