import MockService from '../support/mockService';

const accMock = new MockService('ACCScenarios'); // for future changes
const solution = 'IBN';
const useCase = 'Wireless Assurance';
const accScenario = accMock.getScenario('GET', `(ACC) ${solution}-${useCase}-Onboard`);
let accItems = accScenario.response.body.items;

// ACC items are being sorted by the UI in the following order by status:
// recommended, requested, in-progress, completed
// TODO: This sorting is currently incorrect. Should be in the following order, according to PBC-238
// requested, in-progress, recommended, completed
// Pending PBC-279: http://swtg-jira-lnx.cisco.com:8080/browse/PBC-279
accItems = Cypress._.union(Cypress._.filter(accItems, { status: 'recommended' }),
	Cypress._.filter(accItems, { status: 'requested' }),
	Cypress._.filter(accItems, { status: 'in-progress' }),
	Cypress._.filter(accItems, { status: 'completed' }));

const validACCItems = Cypress._.filter(accItems, acc => acc.description || acc.title);
const visibleACCItems = accItems.slice(0, 3);
const invisibleACCItems = accItems.slice(3);

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
		cy.getByAutoId('recommendedACC-Flag').should('exist');
		cy.getByAutoId('recommendedACC-Title').should('have.text', 'Cisco DNA Center Project Planning');
		cy.getByAutoId('recommendedACCWatchButton').should('have.text', i18n._Request1on1_);
		cy.getByAutoId('moreACCList').should('exist');
		// No other data-auto-id's exist at this time
	});

	it('ACC tile has a view all link to display ACCs in card view', () => { // PBC-159
		cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
		cy.get('.modal__header.acc__header').should('contain', i18n._Accelerator_)
			.and('contain', i18n._1on1Coaching_);
		cy.getByAutoId('ACCTopicsAvailable').should(
			'have.text', `${validACCItems.length} topics available for ${solution} > ${useCase}:`
		);

		cy.getByAutoId('ACCCard').then($cards => {
			expect($cards.length).to.eq(validACCItems.length);
		});

		validACCItems.forEach((acc, index) => {
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
							.should('contain', i18n._Completed_);
						break;
					case 'in-progress':
					case 'requested':
						cy.getByAutoId('ACCCardFooter')
							.should('contain', i18n._CSETouch_);
						break;
					default:	// Default: recommended
						cy.getByAutoId('Request1on1Button')
							.should('contain', i18n._Request1on1_);
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

	describe('PBC-33: (UI) View - Solution Based: ACC Details', () => {
		afterEach(() => {
			// Make sure we're set back to the default mock data
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-Empty');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-oneRecommended');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading');
		});

		it.skip('Should only display the ACC section if there are ACC items', () => {
			// TODO: Waiting on PBC-317: http://swtg-jira-lnx.cisco.com:8080/browse/PBC-317
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard-Empty');

			// Refresh the data
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading');

			// The section should not exist at all
			cy.getByAutoId('Accelerator Panel').should('not.exist');
			cy.getByAutoId('recommendedACC').should('not.exist');
			cy.getByAutoId('moreACCList').should('not.exist');
		});

		it('Should only display up to two items in the more list', () => {
			// Verify only up to the first three ACC shown
			// Note, however, the first recommended item will be displayed outside the More list
			// TODO: Will need to be updated to account for cases where the first ACC is not
			// recommended, but this is pending PBC-279: http://swtg-jira-lnx.cisco.com:8080/browse/PBC-279
			const accMoreItems = visibleACCItems.slice(1, 3);
			accMoreItems.forEach(acc => {
				cy.getByAutoId('moreACCList-item')
					.should('contain', acc.title);
			});
			invisibleACCItems.forEach(acc => {
				cy.getByAutoId('moreACCList-item')
					.should('not.contain', acc.title);
			});
		});
	});

	describe('PBC-166: Mouse hover to show recommended ACC/ATX description', () => {
		// NOTE: Cypress can not trigger elements with :hover css property, so we'll just check
		// that the hover modal and it's elements exist in the DOM. See below for reference:
		// https://docs.cypress.io/api/commands/hover.html#Workarounds
		// https://github.com/cypress-io/cypress/issues/10

		afterEach(() => {
			// Ensure we are set back to mock data with a recommended item
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-Empty');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-oneRecommended');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-oneNonRecommended');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-allButRecommended');
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

		it.skip('Should not have hover modal if there are no recommended ACC', () => {
			// TODO: Pending PBC-279: http://swtg-jira-lnx.cisco.com:8080/browse/PBC-279
			// Switch the mock data to one with no recommended items
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard-allButRecommended');

			// Refresh the data by clicking the lifecycle tab, and wait for load
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading', 5000);

			cy.getByAutoId('recommendedACC').should('not.exist');
		});
	});

	describe('PBC-237: (UI) View -  Lifecycle - ACC Status Ribbons', () => {
		before(() => {
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
		});

		after(() => {
			cy.getByAutoId('ACCCloseModal').click();

			// Reload the page to force-reset any changed bookmarks
			// This is required since the mock bookmark APIs don't actually bookmark the ACC items
			cy.loadApp();
			cy.waitForAppLoading();

			// Wait for the ACC panel to finish loading
			cy.waitForAppLoading('accLoading', 15000);
		});

		it('Should be able to bookmark an ACC item', () => {
			cy.getByAutoId('accViewAllModal').within(() => {
				validACCItems.forEach((acc, index) => {
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
				validACCItems.forEach((acc, index) => {
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
				validACCItems.forEach((acc, index) => {
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

	describe('PBC-238: (UI) View - Lifecycle - ACC List & Hover', () => {
		before(() => {
			// Ensure we're set to the default mock data
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-Empty');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-oneRecommended');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-oneNonRecommended');
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-allButRecommended');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading');
		});

		afterEach(() => {
			// Make sure we're set back to the default mock data
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard-oneRecommended');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading');
		});

		it('Should only show the More section if there is more than 1 ACC item', () => {
			accMock.disable('(ACC) IBN-Wireless Assurance-Onboard');
			accMock.enable('(ACC) IBN-Wireless Assurance-Onboard-oneRecommended');

			// Refresh the data
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.waitForAppLoading('accLoading');

			// Should hide the "More" list
			cy.getByAutoId('moreACCList-Header');
			cy.getByAutoId('moreACCList').should('not.exist');
		});

		it('ACC More list items should have hover modal', () => {
			// TODO: Will need to be updated to account for cases where the first ACC is not
			// recommended, but this is pending PBC-279: http://swtg-jira-lnx.cisco.com:8080/browse/PBC-279
			const accMoreItems = visibleACCItems.slice(1, 3);
			accMoreItems.forEach((acc, index) => {
				cy.getByAutoId('moreACCList-item').eq(index).within(() => {
					cy.getByAutoId('moreACCList-HoverModal').should('exist').within(() => {
						cy.getByAutoId('moreACCList-HoverModal-Title').should('have.text', acc.title);
						cy.getByAutoId('moreACCList-HoverModal-Description').should('have.text', acc.description);
						cy.getByAutoId('ACCCardRibbon').should('exist');

						// Ribbon is blue for bookmarked, green w/ star for completed, clear otherwise
						if (acc.isFavorite) {
							cy.getByAutoId('ACCCardRibbon').should('have.class', 'ribbon__blue');
							cy.getByAutoId('.star').should('not.exist');
						} else if (acc.status === 'completed') {
							cy.getByAutoId('ACCCardRibbon').should('have.class', 'ribbon__green');
							cy.getByAutoId('.star').should('exist');
						} else {
							cy.getByAutoId('ACCCardRibbon').should('have.class', 'ribbon__clear');
							cy.getByAutoId('.star').should('not.exist');
						}

						// Recommended should have "Request 1-on-1", requested/in-progress/completed have text
						switch (acc.status) {
							case 'completed':
								cy.getByAutoId('moreACCList-HoverModal-CompletedMessage')
									.should('have.text', i18n._Completed_);
								cy.getByAutoId('Request1on1Button')
									.should('not.exist');
								break;
							case 'in-progress':
							case 'requested':
								cy.getByAutoId('moreACCList-HoverModal-CSEMessage')
									.should('contain', i18n._CSETouch_);
								cy.getByAutoId('Request1on1Button')
									.should('not.exist');
								break;
							default:	// Default: recommended
								cy.getByAutoId('Request1on1Button')
									.should('contain', i18n._Request1on1_);
						}
					});
				});
			});
		});
	});
});
