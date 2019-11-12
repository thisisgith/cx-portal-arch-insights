import MockService from '../support/mockService';

const accMock = new MockService('ACCScenarios');
const feedbackMock = new MockService('FeedbackScenarios');
const solution = 'IBN';
const useCase = 'Campus Network Assurance';
const accScenario = accMock.getScenario('GET', `(ACC) ${solution}-${useCase}-Onboard`);
const accItems = accScenario.response.body.items;
const twoRecommendedScenario = accMock.getScenario('GET', `(ACC) ${solution}-${useCase}-Onboard-twoRecommended`);
const twoRecommendedItems = twoRecommendedScenario.response.body.items;
const twoWithPartnerScenario = accMock.getScenario('GET', `(ACC) ${solution}-${useCase}-Onboard-twoWithPartner`);
const twoWithPartnerItems = twoWithPartnerScenario.response.body.items;

const accUserInfoMock = new MockService('ACCUserInfoScenarios');
const accUserInfoScenario = accUserInfoMock.getScenario('GET', '(ACC) ACC-Request User Info');
const accUserInfoResponse = accUserInfoScenario.response.body;

const validACCItems = Cypress._.filter(accItems, acc => acc.description || acc.title);
const visibleACCItems = accItems.slice(0, 3);
const invisibleACCItems = accItems.slice(3);

const possibleAttendeesValues = [1, 2, 3, 4, 5];

const accFilters = [
	{ filter: 'Recommended', field: 'status', value: 'recommended' },
	{ filter: 'Requested', field: 'status', value: 'requested' },
	{ filter: 'Scheduled', field: 'status', value: 'scheduled' },
	{ filter: 'In progress', field: 'status', value: 'in-progress' },
	{ filter: 'Completed', field: 'status', value: 'completed' },
	{ filter: 'Bookmarked', field: 'bookmark', value: true },
	{ filter: 'Not bookmarked', field: 'bookmark', value: false },
];

const partnerInfoMock = new MockService('PartnerInfoScenarios');
const partnerInfoScenario = partnerInfoMock.getScenario('GET', '(Lifecycle) PartnerInfoListUsingGET');
const partnerInfoBody = partnerInfoScenario.response.body;

const i18n = require('../../src/assets/i18n/en-US.json');

// Mapped list of possible statuses to filters
const accStatuses = {
	recommended: i18n._Recommended_,
	requested: i18n._Requested_,
	'in-progress': i18n._InProgress_,
	completed: i18n._Completed_,
};

describe('Accelerator (ACC)', () => { // PBC-32
	before(() => {
		cy.window().then(win => { // Must be done before app loads
			win.sessionStorage.clear(); // reset view preferences to defaults
		});
		cy.login();
		cy.loadApp();

		// Disable the setup wizard and quick tour so they don't block other elements
		cy.window().then(win => { // Must be done after app loads
			win.Cypress.hideDNACHeader = true;
			win.Cypress.showQuickTour = false;
		});

		cy.waitForAppLoading();

		// Wait for the ACC panel to finish loading
		cy.waitForAppLoading('accLoading', 15000);
	});

	it('Renders Accelerator tile', () => {
		cy.getByAutoId('Accelerator Panel').should('exist');
		cy.getByAutoId('PanelTitle-_Accelerator_').should('have.text', i18n._Accelerator_);
		cy.getByAutoId('recommendedACC-Title').should('contain', visibleACCItems[0].title);

		switch (visibleACCItems[0].status) {
			case 'completed':
				cy.getByAutoId('recommendedACC-Completed')
					.should('have.text', i18n._Completed_);
				break;
			case 'in-progress':
				cy.getByAutoId('recommendedACC-In-Progress-Icon').should('exist');
				cy.getByAutoId('recommendedACC-In-Progress')
					.should('have.text', i18n._Requested_);
				break;
			case 'requested':
				cy.getByAutoId('recommendedACC-Requested-Icon').should('exist');
				cy.getByAutoId('recommendedACC-Requested')
					.should('have.text', i18n._Requested_);
				break;
			default:	// Default: recommended
				cy.getByAutoId('Request1on1ACCButton')
					.should('have.text', i18n._Request1on1_);
				cy.getByAutoId('recommendedACC-Flag').should('exist');
		}

		cy.getByAutoId('moreACCList').should('exist');
		// No other data-auto-id's exist at this time
	});

	it('ACC tile has a view all link to display ACCs in card view', () => { // PBC-159
		cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
		cy.get('.modal__header.acc__header').should('contain', i18n._Accelerator_)
			.and('contain', i18n._1on1Coaching_);
		cy.getByAutoId('ViewAllModal-TopicsAvailable').should(
			'have.text', `${validACCItems.length} topics available for ${solution} > ${useCase}:`
		);

		cy.getByAutoId('ACCCard').then($cards => {
			expect($cards.length).to.eq(validACCItems.length);
		});

		validACCItems.forEach((acc, index) => {
			cy.getByAutoId('ACCCard').eq(index).within(() => {
				if (acc.status === 'recommended') {
					cy.getByAutoId('ACCCardHeader')
						.should('exist')
						.and('have.text', i18n._Recommended_);
					cy.getByAutoId('ACCCard-Flag').should('exist');
				} else {
					cy.getByAutoId('ACCCardHeader').should('not.exist');
				}
				cy.getByAutoId('ACCCardTitle').should('have.text', acc.title);
				cy.getByAutoId('ACCCardDescription')
					.should('contain', acc.description)
					.and('have.class', 'desc-line-clamp');
				switch (acc.status) {
					case 'completed':
						cy.getByAutoId('ACCCardFooter')
							.should('contain', i18n._Completed_);
						break;
					case 'in-progress':
						cy.getByAutoId('ACCCardFooter')
							.should('contain', i18n._SessionInProgress_);
						break;
					case 'requested':
						cy.getByAutoId('ACCCardFooter')
							.should('contain', i18n._Requested_);
						break;
					default:	// Default: recommended
						cy.getByAutoId('Request1on1ACCButton')
							.should('contain', i18n._Request1on1_);
				}

				// PBC-237 Check bookmark ribbon
				if (acc.bookmark) {
					cy.getByAutoId('ACCCardRibbon')
						.should('have.class', 'ribbon__blue');
				} else {
					cy.getByAutoId('ACCCardRibbon')
						.should('have.class', 'ribbon__white');
				}
			});
		});
		cy.getByAutoId('ViewAllCloseModal').click({ force: true });
	});

	describe('ACC Card View', () => {
		describe('Bookmark items', () => {
			before(() => {
				// Switch to mock data with no items bookmarked
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

				// Refresh the data
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

				// Open the ACC View All modal, and ensure we're in card view
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('acc-card-view-btn').click();
				cy.getByAutoId('ACCCard').should('be.visible');
			});

			after(() => {
				// Switch back to the default mock
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click({ force: true });
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Refresh the page to force-reset bookmarks
				cy.loadApp();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
			});

			it('ACC View All card view should allow bookmarking items', () => {
				cy.getByAutoId('ACCCard').each($card => {
					cy.wrap($card).within(() => {
						// Check for bookmark API calls
						cy.getByAutoId('ACCCardRibbon')
							.should('have.class', 'ribbon__white')
							.click();
						cy.wait('(Lifecycle) IBN-Bookmark');
						cy.getByAutoId('ACCCardRibbon')
							.should('have.class', 'ribbon__blue');
					});
				});
			});
		});

		describe('Un-bookmark items', () => {
			before(() => {
				// Switch to mock data with no items bookmarked
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoBookmarked');

				// Refresh the data
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoBookmarked');

				// Open the ACC View All modal, and ensure we're in card view
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('acc-card-view-btn').click();
				cy.getByAutoId('ACCCard').should('be.visible');
			});

			after(() => {
				// Switch back to the default mock
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click({ force: true });
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Refresh the page to force-reset bookmarks
				cy.loadApp();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
			});

			it('ACC View All card view should allow un-bookmarking items', () => {
				cy.getByAutoId('ACCCard').each($card => {
					cy.wrap($card).within(() => {
						// Check for bookmark API calls
						cy.getByAutoId('ACCCardRibbon')
							.should('have.class', 'ribbon__blue')
							.click();
						cy.wait('(Lifecycle) IBN-Bookmark');
						cy.getByAutoId('ACCCardRibbon')
							.should('have.class', 'ribbon__white');
					});
				});
			});
		});
	});

	describe('PBC-33: (UI) View - Solution Based: ACC Details', () => {
		afterEach(() => {
			// Make sure we're set back to the default mock data
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('PBC-317: Should only display the ACC section if there are ACC items', () => {
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-Empty');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-Empty');

			// The section should not exist at all
			cy.getByAutoId('Accelerator Panel').should('not.exist');
			cy.getByAutoId('recommendedACC').should('not.exist');
			cy.getByAutoId('recommendedACC-HoverModal').should('not.exist');
			cy.getByAutoId('moreACCList').should('not.exist');
		});

		it('Should only display up to two items in the more list', () => {
			// Verify only up to the first three ACC shown
			// Note, however, the first item will be displayed outside the More list
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

	describe('Filter ACC by status (PBC-96, PBC-99, PBC-300)', () => {
		before(() => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');
		});

		after(() => {
			// Close the View All modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});

		it('View All ACC modal shows all items by default', () => {
			cy.getByAutoId('ACCCard').then(cards => {
				expect(cards.length).to.eq(validACCItems.length);
			});
		});

		Object.keys(accStatuses).forEach(status => {
			it(`View All ACC modal can filter by status: ${accStatuses[status]}`, () => {
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get(`a[title="${accStatuses[status]}"]`).click();

					const filteredItems = validACCItems.filter(item => (item.status === status));
					cy.getByAutoId('ACCCard').then(cards => {
						expect(cards.length).to.eq(filteredItems.length);
					});
				});
			});
		});

		it('View All ACC modal can filter by status: Bookmarked', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get(`a[title="${i18n._Bookmarked_}"]`).click();

				const filteredItems = validACCItems.filter(item => item.bookmark);
				cy.getByAutoId('ACCCard').then(cards => {
					expect(cards.length).to.eq(filteredItems.length);
				});
			});
		});

		it('View All ACC modal can filter by status: Not bookmarked', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get(`a[title="${i18n._NotBookmarked_}"]`).click();

				const filteredItems = validACCItems.filter(item => !item.bookmark);
				cy.getByAutoId('ACCCard').then(cards => {
					expect(cards.length).to.eq(filteredItems.length);
				});
			});
		});

		it('View All ACC modal can filter by status: All Titles', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get(`a[title="${i18n._AllTitles_}"]`).click();

				cy.getByAutoId('ACCCard').then(cards => {
					expect(cards.length).to.eq(validACCItems.length);
				});
			});
		});

		it('View All ACC modal should be searchable', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				// Start typing an archetype in the filter field
				cy.getByAutoId('cui-select').click()
					.get('input')
					.type('Compl');
				cy.get('cui-vscroll-viewport').within(() => {
					// Verify the filters have been filtered to match the input
					cy.get('a').then($filters => {
						$filters.toArray().forEach($filter => {
							cy.wrap($filter).should('have.attr', 'title')
								.and('contain', 'Compl');
						});
					});
				});
			});
		});

		// TODO: Close icon has been removed. Need to confirm if this was intentional.
		it.skip('View All ACC modal should be clearable', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Completed"]').click();

				cy.getByAutoId('ACCCard').then(cards => {
					const filteredItems = validACCItems.filter(item => (item.status === 'completed'));
					expect(cards.length).to.eq(filteredItems.length);
				});

				// Click the clear filter button, should show all items again
				cy.getByAutoId('acc-filter').within(() => {
					cy.get('span[class="icon-close"]').click();
				});

				cy.getByAutoId('ACCCard').then(cards => {
					expect(cards.length).to.eq(validACCItems.length);
				});
			});
		});
	});

	describe('PBC-354: Verify View All filter stickiness', () => {
		beforeEach(() => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');
		});

		afterEach(() => {
			// Close the View All modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			// Make sure we're on the lifecycle page and the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('View All ACC filter should be sticky across modal close/re-open', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Completed"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Completed');
			});

			// Close and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Check that the filter is still in place
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Completed');
				const filteredItems = validACCItems.filter(item => (item.status === 'completed'));
				cy.getByAutoId('ACCCard').then(cards => {
					expect(cards.length).to.eq(filteredItems.length);
				});
			});
		});

		it('View All ACC filter should NOT be sticky across use case changes', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Completed"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Completed');
			});

			// Close the modal, change use cases, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
			cy.wait('(ACC) IBN-Campus Network Segmentation-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', i18n._AllTitles_);
			cy.getByAutoId('ACCCard').then($cards => {
				expect($cards.length).to.eq(validACCItems.length);
			});
		});

		it('View All ACC filter should NOT be sticky across page navigation', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Completed"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Completed');
			});

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', i18n._AllTitles_);
			cy.getByAutoId('ACCCard').then($cards => {
				expect($cards.length).to.eq(validACCItems.length);
			});
		});

		it('View All ACC filter should NOT be sticky across page reload', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Completed"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Completed');
			});

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', i18n._AllTitles_);
			cy.getByAutoId('ACCCard').then($cards => {
				expect($cards.length).to.eq(validACCItems.length);
			});
		});
	});

	describe('More list status indicators (PBC-96, PBC-99, PBC-300)', () => {
		afterEach(() => {
			// Ensure we are reset to the default mock data
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

			// Refresh the data by switching tabs, and wait for load
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('PBC-96: (UI) View - Solution Race Track - View Completed ACC', () => {
			// Switch to data that will show us target status in the More list
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoCompleted');

			// Refresh the data by switching tabs, and wait for load
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoCompleted');

			// Check the completed item has the check mark in the "More" ACC list
			cy.getByAutoId('moreACCList-item').within(() => {
				cy.getByAutoId('moreACCList-Checkmark').should('be.visible');
			});
		});

		it('PBC-99: (UI) View - Solution Racetrack - View Scheduled ACCs', () => {
			// Switch to data that will show us target status in the More list
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoInProgress');

			// Refresh the data by switching tabs, and wait for load
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoInProgress');

			// Check the in-progress item has the progress bar in the "More" ACC list
			cy.getByAutoId('moreACCList-item').within(() => {
				cy.getByAutoId('moreACCList-ProgressBar').should('be.visible');
			});
		});

		it('PBC-300: (UI View) Solution Racetrack - View Registered ACCs', () => {
			// Switch to data that will show us target status in the More list
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoRequested');

			// Refresh the data by switching tabs, and wait for load
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoRequested');

			// Check the registered item has the progress bar in the "More" ACC list
			cy.getByAutoId('moreACCList-item').within(() => {
				cy.getByAutoId('moreACCList-RequestedBar').should('be.visible');
			});
		});
	});

	describe('PBC-166: Mouse hover to show recommended ACC/ATX description', () => {
		// NOTE: Cypress can not trigger elements with :hover css property, so we'll just check
		// that the hover modal and it's elements exist in the DOM. See below for reference:
		// https://docs.cypress.io/api/commands/hover.html#Workarounds
		// https://github.com/cypress-io/cypress/issues/10

		after(() => {
			// Ensure we are set back to mock data with a recommended item
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

			// Refresh the data by switching tabs, and wait for load
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('Accelerator Tile Tooltip', () => {
			// Switch to a mock with the first item recommended
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

			// Refresh the data by switching tabs, and wait for load
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

			// Recommended panel should show title, image (placeholder), and request button
			cy.getByAutoId('recommendedACC').should('exist');
			cy.getByAutoId('recommendedACC-Title').should('exist')
				.and('contain', twoRecommendedItems[0].title);
			cy.getByAutoId('recommendedACC-Image').should('exist')
				.and('have.attr', 'src', twoRecommendedItems[0].url);
			cy.getByAutoId('Request1on1ACCButton')
				.should('exist')
				.first()
				.and('have.text', 'Request a 1-on-1');

			// Recommended hover modal should show title and description
			cy.getByAutoId('recommendedACC-HoverModal').should('exist');
			cy.getByAutoId('recommendedACC-HoverModal-Title').should('exist')
				.and('contain', twoRecommendedItems[0].title)
				.and('have.class', 'title-line-clamp');
			cy.getByAutoId('recommendedACC-HoverModal-Description').should('exist')
				.and('contain', twoRecommendedItems[0].description)
				// PBC-611 Truncate description text
				// Since this handled by the styles, just validate the class exists
				.and('have.class', 'line-clamp');
			// PBC-603 Hover should include bookmark ribbon
			if (twoRecommendedItems[0].bookmark) {
				cy.getByAutoId('recommendedACC-HoverModal-BookmarkRibbon')
					.should('exist')
					.and('have.class', 'ribbon__blue');
			} else {
				cy.getByAutoId('recommendedACC-HoverModal-BookmarkRibbon')
					.should('exist')
					.and('have.class', 'ribbon__white');
			}
		});

		it('PBC-279: When there are no recommended ACCs, use the first requested item', () => {
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-allButRecommended');

			// Refresh the data by switching tabs, and wait for load
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-allButRecommended');

			// Requested hover should have the CSE text, not completed text or request button
			cy.getByAutoId('recommendedACC').should('exist').within(() => {
				cy.getByAutoId('Request1on1ACCButton').should('not.exist');
				cy.getByAutoId('recommendedACC-HoverModal-CompletedMessage').should('not.exist');
			});
		});

		it('PBC-279: When there are no recommended/requested ACCs, use the first in-progress item', () => {
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-completedInProgress');

			// Refresh the data by switching tabs, and wait for load
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-completedInProgress');

			// In-progress hover should have the CSE text, not completed text or request button
			cy.getByAutoId('recommendedACC').should('exist').within(() => {
				cy.getByAutoId('Request1on1ACCButton').should('not.exist');
				cy.getByAutoId('recommendedACC-HoverModal-CompletedMessage').should('not.exist');
			});
		});

		it('PBC-279: When there are no recommended/requested/in-progress ACCs, use the first completed item', () => {
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoCompleted');

			// Refresh the data by switching tabs, and wait for load
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoCompleted');

			// Completed hover should not have CSE text or request button
			cy.getByAutoId('recommendedACC').should('exist').within(() => {
				cy.getByAutoId('Request1on1ACCButton').should('not.exist');
			});
		});
	});

	describe('PBC-220: (UI View) - Lifecycle  - ACC - Request Form', () => {
		before(() => {
			// Switch to a mock dataset with multiple recommended items, so we can open the form
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');
		});

		after(() => {
			// Switch back to default mock data
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('PBC-260: Should be able to open request form from Lifecycle page', () => {
			cy.getByAutoId('Request1on1ACCButton')
				.first()
				.click({ force: true });
			cy.getByAutoId('accRequestModal-Title').should('be.visible');
			cy.getByAutoId('ACCCloseRequestModal').click();
			cy.getByAutoId('accRequestModal').should('not.exist');
		});

		it('PBC-260: Should be able to open request form from View All cards', () => {
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ACCCard')
				.first()
				.within(() => {
					cy.getByAutoId('Request1on1ACCButton').click({ force: true });
				});
			cy.getByAutoId('accRequestModal-Title').should('be.visible');
			cy.getByAutoId('ACCCloseRequestModal').click();
			cy.getByAutoId('accRequestModal').should('not.exist');
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
		});

		it('PBC-260: Should be able to close or cancel request form', () => {
			cy.getByAutoId('Request1on1ACCButton')
				.first()
				.click({ force: true });
			cy.getByAutoId('accRequestModal-Title').should('be.visible');
			cy.getByAutoId('ACCCloseRequestModal').click();
			cy.getByAutoId('accRequestModal').should('not.exist');

			cy.getByAutoId('Request1on1ACCButton')
				.first()
				.click({ force: true });
			cy.getByAutoId('accRequestModal-Title').should('be.visible');
			cy.getByAutoId('accRequestModal-Cancel').click();
			cy.getByAutoId('accRequestModal').should('not.exist');
		});

		describe('Form field validation', () => {
			beforeEach(() => {
				// Start with a clean modal for each test
				cy.getByAutoId('Request1on1ACCButton')
					.first()
					.click({ force: true });
			});

			afterEach(() => {
				cy.getByAutoId('ACCCloseRequestModal').click();
				cy.getByAutoId('accRequestModal').should('not.exist');
			});

			it('PBC-260: Request 1-on-1 form should have all required fields', () => {
				// Check the titles
				cy.getByAutoId('accRequestModal-Title').should('have.text', i18n._Request1on1_);
				cy.getByAutoId('accRequestModal-SubTitle').should('have.text', i18n._FindCiscoExpert_);
				cy.getByAutoId('accRequestModal-ItemTitle').should('have.text', twoRecommendedItems[0].title);

				// Check the pre-filled field headings
				cy.getByAutoId('accRequestModal-CompanyName-Heading').should('have.text', i18n._CompanyName_);
				cy.getByAutoId('accRequestModal-CustomerUserName-Heading').should('have.text', i18n._CustomerUserName_);
				cy.getByAutoId('accRequestModal-JobTitle-Heading').should('have.text', i18n._JobTitle_);
				cy.getByAutoId('accRequestModal-Email-Heading').should('have.text', i18n._Email_);
				cy.getByAutoId('accRequestModal-Phone-Heading').should('have.text', i18n._Phone_);
				cy.getByAutoId('accRequestModal-CiscoContact-Heading').should('have.text', i18n._CiscoContact_);
				cy.getByAutoId('accRequestModal-CCOID-Heading').should('have.text', i18n._CCOID_);
				cy.getByAutoId('accRequestModal-Country-Heading').should('have.text', i18n._Country_);

				// Check the user-entry field headings
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Heading').should('have.text', i18n._NumberOfAttendees_);
				cy.getByAutoId('accRequestModal-TimeZone-Heading').should('have.text', i18n._TimeZone_);
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Heading').should('have.text', i18n._PreferredTimeMeeting_);
				cy.getByAutoId('accRequestModal-LanguagePreference-Heading').should('have.text', i18n._LanguagePreference_);
				cy.getByAutoId('accRequestModal-DNACVersion-Heading').should('have.text', i18n._DNACVersion_);
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Heading').should('have.text', i18n._WhyInterestedAccelerator_);
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Heading').should('have.text', i18n._WhatWouldLikeToSeeOutcome_);
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-Heading').should('have.text', i18n._PreferredEnvironmentAccelerator_);
			});

			it('PBC-260: Request 1-on-1 form should have employee information pre-filled', () => {
				cy.getByAutoId('accRequestModal-CompanyName-Value').should('have.text', accUserInfoResponse.companyName);
				cy.getByAutoId('accRequestModal-CustomerUserName-Value').should('have.text', accUserInfoResponse.userFullName);
				cy.getByAutoId('accRequestModal-JobTitle-Value').should('have.text', accUserInfoResponse.jobTitle);
				cy.getByAutoId('accRequestModal-Email-Value').should('have.text', accUserInfoResponse.userEmail);
				cy.getByAutoId('accRequestModal-Phone-Value').should('have.text', accUserInfoResponse.userPhoneNumber);
				cy.getByAutoId('accRequestModal-CiscoContact-Value').should('have.text', accUserInfoResponse.ciscoContact);
				cy.getByAutoId('accRequestModal-CCOID-Value').should('have.text', accUserInfoResponse.ccoId);
				cy.getByAutoId('accRequestModal-Country-Value').should('have.text', accUserInfoResponse.country);
			});

			it('PBC-260: Selecting number of attendees should configure additional attendee fields', () => {
				possibleAttendeesValues.forEach((option, index) => {
					cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select(option.toString());
					const visibleFields = possibleAttendeesValues.slice(0, index);
					const invisibleFields = possibleAttendeesValues.slice(index,
						possibleAttendeesValues.length - 1);

					if (option === 1) {
						// 1 attendee will not show any additional fields/headers
						cy.getByAutoId('accRequestModal-AdditionalAttendeeName-Heading').should('not.exist');
						cy.getByAutoId('accRequestModal-AdditionalAttendeeEmail-Heading').should('not.exist');
					} else {
						// 2 or more attendees will show fields/headers
						cy.getByAutoId('accRequestModal-AdditionalAttendeeName-Heading').should('exist');
						cy.getByAutoId('accRequestModal-AdditionalAttendeeEmail-Heading').should('exist');
					}

					visibleFields.forEach(visibleOption => {
						cy.getByAutoId(`accRequestModal-AdditionalAttendeeName-Input-${visibleOption - 1}`).should('exist');
						cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${visibleOption - 1}`).should('exist');
					});
					invisibleFields.forEach(invisibleOption => {
						cy.getByAutoId(`accRequestModal-AdditionalAttendeeName-Input-${invisibleOption - 1}`).should('not.exist');
						cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${invisibleOption - 1}`).should('not.exist');
					});
				});
			});

			it('PBC-260: Interested field has max length of 512 characters', () => {
				// Field with between 1-512 chars should be valid
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input')
					.clear()
					.type('junk')
					.should('have.class', 'ng-valid');

				// Field with more than 512 chars should be invalid
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input')
					.clear()
					.type('a'.repeat(513), { timeout: 2500 });	// Typing can take a while...

				// Field should only have ended up with 512 characters
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input')
					.invoke('val')
					.then(text => {
						expect(text.length).to.eq(512);
					});

				// Cleared field should be invalid
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input')
					.clear()
					.should('have.class', 'ng-invalid');
			});

			it('PBC-260: Outcome field has max length of 512 characters', () => {
				// Field with between 1-512 chars should be valid
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input')
					.clear()
					.type('junk')
					.should('have.class', 'ng-valid');

				// Field with more than 512 chars should be invalid
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input')
					.clear()
					.type('a'.repeat(513), { timeout: 2500 });	// Typing can take a while...

				// Field should only have ended up with 512 characters
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input')
					.invoke('val')
					.then(text => {
						expect(text.length).to.eq(512);
					});

				// Cleared field should be invalid
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input')
					.clear()
					.should('have.class', 'ng-invalid');
			});

			it('PBC-260: Email fields should require valid emails', () => {
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('5');

				// Note with 5 attendees, we only show 4 fields ('additional' attendees)
				possibleAttendeesValues.slice(0, possibleAttendeesValues.length - 1).forEach(index => {
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${index - 1}`)
						.clear()
						.type('im-an-invalid-email')
						.should('have.class', 'ng-invalid');
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${index - 1}`)
						.clear()
						.type('valid@cisco.com')
						.should('have.class', 'ng-valid');
				});
			});

			it('PBC-260: Decreasing number of attendees should clear name and email', () => {
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('5');

				// Note with 5 attendees, we only show 4 fields ('additional' attendees)
				possibleAttendeesValues.slice(0, possibleAttendeesValues.length - 1).forEach(index => {
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeName-Input-${index - 1}`)
						.clear()
						.type(`Automation User ${index}`)
						.should('have.class', 'ng-valid');
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${index - 1}`)
						.clear()
						.type(`automation_user_${index}@cisco.com`)
						.should('have.class', 'ng-valid');
				});

				// Decrease number of attendees to 1, verify the addtional name/email fields went away
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('1');
				possibleAttendeesValues.slice(0, possibleAttendeesValues.length - 1).forEach(index => {
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeName-Input-${index - 1}`)
						.should('not.exist');
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${index - 1}`)
						.should('not.exist');
				});

				// Increase back to 5 attendees, verify the fields are blank again
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('5');
				possibleAttendeesValues.slice(0, possibleAttendeesValues.length - 1).forEach(index => {
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeName-Input-${index - 1}`)
						.should('have.text', '');
					cy.getByAutoId(`accRequestModal-AdditionalAttendeeEmail-Input-${index - 1}`)
						.should('have.text', '');
				});
			});

			it('PBC-260: Preferred time options are exclusive', () => {
				// Select morning, afternoon should be unchecked
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning')
					.click({ force: true })
					.parent()
					.find('input')
					.should('be.checked');
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Afternoon')
					.parent()
					.find('input')
					.should('not.be.checked');

				// Swap options to afternoon, should un-check morning
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Afternoon')
					.click({ force: true })
					.parent()
					.find('input')
					.should('be.checked');
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning')
					.parent()
					.find('input')
					.should('not.be.checked');
			});

			it('PBC-260: Environment options are exclusive', () => {
				// Select NonProd, Cisco should be unchecked
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-NonProd')
					.click({ force: true })
					.parent()
					.find('input')
					.should('be.checked');
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-Cisco')
					.parent()
					.find('input')
					.should('not.be.checked');

				// Swap options to Cisco, should un-check NonProd
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-Cisco')
					.click({ force: true })
					.parent()
					.find('input')
					.should('be.checked');
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-NonProd')
					.parent()
					.find('input')
					.should('not.be.checked');
			});

			it('PBC-260: Invalid fields should block form submission', () => {
				// Fill in all required fields
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('1');
				cy.getByAutoId('accRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning').click({ force: true });
				cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.2.X');
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input').type('Automation - Test Interest');
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input').type('Automation - Test Outcome');
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-NonProd').click();

				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				// Clear out each required field, verify the submit button is disabled
				// Note that selects have to be force-cleared, see here for reference:
				// https://stackoverflow.com/questions/56340978/how-do-i-clear-a-multi-select-input-using-cypress
				// Note also that radio buttons can NOT be unchecked, so check thos separately
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select')
					.invoke('val', '')
					.trigger('change');
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('1');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-TimeZone-Select')
					.invoke('val', '')
					.trigger('change');
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-LanguagePreference-Select')
					.invoke('val', '')
					.trigger('change');
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-DNACVersion-Select')
					.invoke('val', '')
					.trigger('change');
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.2.X');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input').clear();
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input').type('Automation - Test Interest');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input').clear();
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input').type('Automation - Test Outcome');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				// Add an additional attendee and check the name/email fields block submission as well
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('2');
				cy.getByAutoId('accRequestModal-AdditionalAttendeeName-Input-0')
					.clear()
					.type('Automation User 1');
				cy.getByAutoId('accRequestModal-AdditionalAttendeeEmail-Input-0')
					.clear()
					.type('automation_user_0@cisco.com');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-AdditionalAttendeeName-Input-0')
					.clear();
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-AdditionalAttendeeName-Input-0')
					.clear()
					.type('Automation User 1');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');

				cy.getByAutoId('accRequestModal-AdditionalAttendeeEmail-Input-0')
					.clear();
				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');
				cy.getByAutoId('accRequestModal-AdditionalAttendeeEmail-Input-0')
					.clear()
					.type('automation_user_0@cisco.com');
				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');
			});

			it('PBC-260: Form can NOT be submitted without picking radio options', () => {
				// Fill in all fields except radio buttons, submit should remain disabled
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('1');
				cy.getByAutoId('accRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
				cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.2.X');
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input').type('Automation - Test Interest');
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input').type('Automation - Test Outcome');

				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');

				// Make selections for the radio options, submit should now be enabled
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning').click({ force: true });
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-NonProd').click({ force: true });

				cy.getByAutoId('accRequestModal-Submit').should('be.enabled');
			});
		});

		describe('Form completion/submission', () => {
			after(() => {
				// Re-enable default app-based mocks
				accUserInfoMock.enable('(ACC) ACC-Request User Info');
				accMock.enable('(ACC) IBN-ACCRequestSubmit1');
			});

			it('PBC-260: Should be able to submit when all fields are filled correctly', () => {
				// Open the request form modal
				cy.getByAutoId('Request1on1ACCButton')
					.first()
					.click({ force: true });

				// Fill in all required fields
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('1');
				cy.getByAutoId('accRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning')
					.click({ force: true });
				cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.2.X');
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input').type('Automation - Test Interest');
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input').type('Automation - Test Outcome');
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-NonProd').click();

				// Click submit, should show the success message (PBC-380)
				cy.getByAutoId('accRequestModal-Submit')
					.should('be.enabled')
					.click();
				cy.getByAutoId('RequestFormSubmitSuccessBanner')
					.should('exist')
					.and('have.text', i18n._RequestSuccess_);

				// Note that there is a ~5 second delay between showing success and closing the modal
				cy.getByAutoId('accRequestModal', { timeout: 6000 }).should('not.exist');
			});

			it('PBC-380: Should show error message when the form fails to submit', () => {
				// Create a new mock to force a 500 error and disable the default mock
				cy.server();
				cy.route({
					method: 'POST',
					url: `/api/customerportal/racetrack/v1/acc/${twoRecommendedItems[0].accId}/request`,
					status: 500,
					response: 'Forced error from QA',
				}).as('failedPostRequestForm');
				cy.route({
					method: 'GET',
					url: /.*\/oauth\/.*/,
					status: 200,
					response: {
						token: 'junk',
						expiration: '3599',
					},
				}).as('oauthMock');
				accMock.disable('(ACC) IBN-ACCRequestSubmit1');

				// Open the request form modal
				cy.getByAutoId('Request1on1ACCButton')
					.first()
					.click({ force: true });
				cy.getByAutoId('accRequestModal-Title').should('be.visible');

				// Fill in all required fields
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('1');
				cy.getByAutoId('accRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning')
					.click({ force: true });
				cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.2.X');
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input').type('Automation - Test Interest');
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input').type('Automation - Test Outcome');
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-NonProd').click();

				// Click submit, wait for the error response, verify we show the error message (PBC-380)
				cy.getByAutoId('accRequestModal-Submit')
					.should('be.enabled')
					.click();
				cy.wait('@failedPostRequestForm');
				cy.getByAutoId('RequestFormSubmitErrorBanner')
					.should('exist')
					.and('have.text', i18n._RequestError_);

				// Close the form
				cy.getByAutoId('ACCCloseRequestModal').click();
			});
		});

		describe('PBC-259: API Integration', () => {
			beforeEach(() => {
				// Setup Cypress mocks and disable app-based mocks so we can verify calls/responses
				cy.server();
				cy.route({
					method: 'GET',
					url: '/api/customerportal/racetrack/v1/acc/request/user-info',
					delay: 750,
					response: {
						ccoId: 'vpriyata',
						ciscoContact: 'John Doe',
						companyName: 'Cisco Systems',
						country: 'USA',
						jobTitle: 'NETWORK SPECIALIST',
						userEmail: 'johndoe@cisco.com',
						userFullName: 'John Doe',
						userPhoneNumber: '1-888-555-5555',
					},
				}).as('getUserInfo');
				cy.route({
					method: 'POST',
					url: `/api/customerportal/racetrack/v1/acc/${twoRecommendedItems[0].accId}/request`,
					status: 200,
					response: '',
				}).as('postRequestForm');

				accUserInfoMock.disable('(ACC) ACC-Request User Info');
				accMock.disable('(ACC) IBN-ACCRequestSubmit1');
			});

			after(() => {
				// Re-enable default app-based mocks
				accUserInfoMock.enable('(ACC) ACC-Request User Info');
				accMock.enable('(ACC) IBN-ACCRequestSubmit1');
			});

			it('Opening the Request 1-on-1 form should call user info API', () => {
				cy.getByAutoId('Request1on1ACCButton')
					.first()
					.click({ force: true });

				// Should show the loading header
				cy.getByAutoId('RequestFormCustomerLoadingBanner')
					.should('exist')
					.and('have.text', i18n._LoadingCustomerInfo_);

				cy.wait('@getUserInfo').its('response.body').then(body => {
					cy.getByAutoId('accRequestModal-CompanyName-Value').should('have.text', body.companyName);
					cy.getByAutoId('accRequestModal-CustomerUserName-Value').should('have.text', body.userFullName);
					cy.getByAutoId('accRequestModal-JobTitle-Value').should('have.text', body.jobTitle);
					cy.getByAutoId('accRequestModal-Email-Value').should('have.text', body.userEmail);
					cy.getByAutoId('accRequestModal-Phone-Value').should('have.text', body.userPhoneNumber);
					cy.getByAutoId('accRequestModal-CiscoContact-Value').should('have.text', body.ciscoContact);
					cy.getByAutoId('accRequestModal-CCOID-Value').should('have.text', body.ccoId);
					cy.getByAutoId('accRequestModal-Country-Value').should('have.text', body.country);
				});

				// Should not show the loading banner after lonading is complete
				cy.getByAutoId('RequestFormCustomerLoadingBanner').should('not.exist');

				// Close the form
				cy.getByAutoId('ACCCloseRequestModal').click();
				cy.getByAutoId('accRequestModal').should('not.exist');
			});

			it('Failed GET user-info calls should show an error message', () => {
				// Create a new route to force a 500 error
				cy.route({
					method: 'GET',
					url: '/api/customerportal/racetrack/v1/acc/request/user-info',
					status: 500,
					response: 'Forced error from QA',
				}).as('failedGetUserInfo');

				cy.getByAutoId('Request1on1ACCButton')
					.first()
					.click({ force: true });
				cy.wait('@failedGetUserInfo');

				// Should show the error header
				cy.getByAutoId('RequestFormCustomerErrorBanner')
					.should('exist')
					.and('have.text', i18n._ErrorCustomerInfo_);

				// Close the form
				cy.getByAutoId('ACCCloseRequestModal').click();
				cy.getByAutoId('accRequestModal').should('not.exist');
			});

			it('Submitting the Request 1-on-1 form should call the POST /acc/{accId}/request API with user input', () => {
				// Open the request form modal
				cy.getByAutoId('Request1on1ACCButton')
					.first()
					.click({ force: true });
				cy.getByAutoId('accRequestModal-Title').should('be.visible');
				cy.wait('@getUserInfo').its('response.body').then(userInfoResponseBody => {
					// Fill in all required fields
					cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('2');
					cy.getByAutoId('accRequestModal-AdditionalAttendeeName-Input-0')
						.clear()
						.type('Automation User 1');
					cy.getByAutoId('accRequestModal-AdditionalAttendeeEmail-Input-0')
						.clear()
						.type('automation1@cisco.com');
					cy.getByAutoId('accRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
					cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning')
						.click({ force: true });
					cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
					cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.2.X');
					cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input').type('Automation - Test Interest');
					cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input').type('Automation - Test Outcome');
					cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-NonProd').click();

					// Click submit, should close the modal
					// Note that there is a ~5 second delay between showing success and closing the modal
					cy.getByAutoId('accRequestModal-Submit').should('be.enabled').click();
					cy.getByAutoId('accRequestModal', { timeout: 6000 }).should('not.exist');

					// Wait for the API call and verify we sent the correct data
					cy.wait('@postRequestForm').its('request').then(request => {
						expect(request.body.accTitle)
							.to.include(twoRecommendedItems[0].title);
						expect(request.body.additionalAttendees.length)
							.to.eq(1);
						expect(request.body.additionalAttendees[0].attendeeName)
							.to.eq('Automation User 1');
						expect(request.body.additionalAttendees[0].attendeeEmail)
							.to.eq('automation1@cisco.com');
						expect(request.body.businessOutcome)
							.to.include('Automation - Test Outcome');
						expect(request.body.ccoId)
							.to.include(userInfoResponseBody.ccoId);
						expect(request.body.ciscoContact)
							.to.include(userInfoResponseBody.ciscoContact);
						expect(request.body.companyName)
							.to.include(userInfoResponseBody.companyName);
						expect(request.body.country)
							.to.include(userInfoResponseBody.country);
						expect(request.body.customerId)
							.to.include('2431199');
						expect(request.body.dnacVersion)
							.to.include('1.2.X');
						expect(request.body.environment)
							.to.include('My non-production environment');
						expect(request.body.jobTitle)
							.to.include(userInfoResponseBody.jobTitle);
						expect(request.body.pitstop)
							.to.include('Onboard');
						expect(request.body.preferredLanguage)
							.to.include('English');
						expect(request.body.preferredSlot)
							.to.include('Morning');
						expect(request.body.reasonForInterest)
							.to.include('Automation - Test Interest');
						expect(request.body.solution)
							.to.include(solution);
						expect(request.body.timezone)
							.to.include('Eastern Time/US');
						expect(request.body.usecase)
							.to.include(useCase);
						expect(request.body.userEmail)
							.to.include(userInfoResponseBody.userEmail);
						expect(request.body.userPhoneNumber)
							.to.include(userInfoResponseBody.userPhoneNumber);
					});
				});
				cy.getByAutoId('accRequestModal').should('not.exist');
			});
		});

		describe('PBC-327: Request 1-on-1 form should have the ACC item\'s title', () => {
			before(() => {
				// Change over to a mock with multiple "recommended" items
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

				// Refresh the data
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

				// Open the ACC View All modal
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('ViewAllModal').should('exist');
			});

			after(() => {
				// Close the ACC View All modal
				cy.getByAutoId('ViewAllCloseModal').click({ force: true });
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Ensure we are using the default mock data
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

				// Refresh the data
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
			});

			it('PBC-327: Request 1-on-1 form should have the ACC item\'s title', () => {
				// For all recommended items, check that the "Request 1-on-1" button opens the modal
				// for with the cooresponding title
				cy.getByAutoId('ACCCard').should('have.length', twoRecommendedItems.length);
				twoRecommendedItems.forEach((acc, index) => {
					if (acc.status === 'recommended') {
						cy.getByAutoId('ACCCard').eq(index).within(() => {
							cy.getByAutoId('Request1on1ACCButton').click({ force: true });
						});
						cy.getByAutoId('accRequestModal').should('exist');
						cy.getByAutoId('accRequestModal-ItemTitle').should('have.text', acc.title);
						// Close the form so it's not in the way of other checks
						cy.getByAutoId('ACCCloseRequestModal').click();
						cy.getByAutoId('accRequestModal').should('not.exist');
					}
				});
			});
		});
	});

	describe('PBC-236: (UI View) - Lifecycle: ACC - View All Table View', () => {
		before(() => {
			// Open the View All modal and switch to table view
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('acc-table-view-btn').click({ force: true });
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		after(() => {
			// Switch back to card view and close View All modal
			cy.getByAutoId('acc-card-view-btn').click();
			cy.getByAutoId('ACCCard').should('be.visible');
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.be.visible');

			// Refresh the page to force-reset bookmarks
			cy.loadApp();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('ACC View All should be able to toggle between table and card views', () => {
			cy.getByAutoId('acc-card-view-btn').click();
			cy.getByAutoId('ACCCard').should('be.visible');
			cy.getByAutoId('ViewAllTable').should('not.be.visible');

			cy.getByAutoId('acc-table-view-btn').click({ force: true });
			cy.getByAutoId('ACCCard').should('not.be.visible');
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('ACC View All table view should have expected columns', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.get('th').then($columnHeaders => {
						// Should be 5 columns (Bookmark, Name, Content Provider, Status, Buttons)
						expect($columnHeaders.length).to.eq(5);
					});
					cy.getByAutoId('ViewAllTable-columnHeader-Bookmark').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Name').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Content Provider').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Status').should('exist');
					// Buttons column has no title
					cy.getByAutoId('ViewAllTable-columnHeader-').should('exist');
				});
		});

		it('ACC View All table view should have all data', () => {
			validACCItems.forEach((item, index) => {
				cy.get('tr').eq(index + 1).within(() => {
					cy.getByAutoId('ACC-Title').should('have.text', item.title);
					// Handle bookmark
					if (item.bookmark) {
						cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark--on');
					} else {
						cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark--off');
					}
					// Handle status
					switch (item.status) {
						case 'requested':
							cy.getByAutoId('Table-Status-Requested').within(() => {
								cy.get('span').should('have.class', 'icon-check-outline');
								cy.get('span').should('have.text', i18n._Requested_);
							});
							break;
						case 'in-progress':
							cy.getByAutoId('Table-Status-InProgress').within(() => {
								cy.get('span').should('have.class', 'icon-clock');
								cy.get('span').should('have.text', i18n._InProgress_);
							});
							break;
						case 'recommended':
							// For recommended, status column is a -, and we have a Request button
							cy.getByAutoId('Request1on1ACCButton').should('be.visible');
							cy.getByAutoId('Table-Status-Default')
								.should('be.visible')
								.and('have.text', '-');
							break;
						case 'completed':
							cy.getByAutoId('Table-Status-Completed').within(() => {
								cy.get('span').should('have.class', 'icon-certified');
								cy.get('span').should('have.text', i18n._Completed_);
							});
							break;
						default:
							Cypress.log({
								name: 'LOG',
								message: `RECOMMENDED OR UNRECOGNIZED ACC STATUS TYPE: ${item.status} ! DEFAULTING TO -`,
							});
							cy.getByAutoId('Table-Status-Default')
								.should('be.visible')
								.and('have.text', '-');
					}
				});
			});
		});

		it('ACC View All table should not sort by default', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					validACCItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							cy.getByAutoId('ACC-Title').should('have.text', item.title);
						});
					});
				});
		});

		it('ACC View All table should be sortable by Bookmark', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Bookmark').click();
					const sortedItemsAsc = Cypress._.orderBy(validACCItems, ['bookmark'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							if (item.bookmark) {
								cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark--on');
							} else {
								cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark--off');
							}
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('ViewAllTable-columnHeader-Bookmark').click();
					const sortedItemsDesc = Cypress._.orderBy(validACCItems, ['bookmark'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							if (item.bookmark) {
								cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark--on');
							} else {
								cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark--off');
							}
						});
					});
				});
		});

		it('ACC View All table should be sortable by Name', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
					const sortedItemsAsc = Cypress._.orderBy(validACCItems, ['title'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ACC-Title').should('have.text', item.title);
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
					const sortedItemsDesc = Cypress._.orderBy(validACCItems, ['title'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ACC-Title').should('have.text', item.title);
						});
					});
				});
		});

		it('ACC View All table should be sortable by Status', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Status').click();
					const sortedItemsAsc = Cypress._.orderBy(validACCItems, ['status'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							switch (item.status) {
								case 'requested':
									cy.getByAutoId('Table-Status-Requested').should('be.visible');
									break;
								case 'in-progress':
									cy.getByAutoId('Table-Status-InProgress').should('be.visible');
									break;
								case 'recommended':
									// For recommended, status column is blank, we have a Request button instead
									cy.getByAutoId('Request1on1ACCButton').should('be.visible');
									break;
								case 'completed':
									cy.getByAutoId('Table-Status-Completed').should('be.visible');
									break;
								default:
									Cypress.log({
										name: 'LOG',
										message: `UNRECOGNIZED ACC STATUS TYPE: ${item.type} ! TREATING AS RECOMMENDED...`,
									});
									cy.getByAutoId('Request1on1ACCButton').should('be.visible');
							}
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('ViewAllTable-columnHeader-Status').click();
					const sortedItemsDesc = Cypress._.orderBy(validACCItems, ['status'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							switch (item.status) {
								case 'requested':
									cy.getByAutoId('Table-Status-Requested').should('be.visible');
									break;
								case 'in-progress':
									cy.getByAutoId('Table-Status-InProgress').should('be.visible');
									break;
								case 'recommended':
									// For recommended, status column is blank, we have a Request button instead
									cy.getByAutoId('Request1on1ACCButton').should('be.visible');
									break;
								case 'completed':
									cy.getByAutoId('Table-Status-Completed').should('be.visible');
									break;
								default:
									Cypress.log({
										name: 'LOG',
										message: `UNRECOGNIZED ACC STATUS TYPE: ${item.type} ! TREATING AS RECOMMENDED...`,
									});
									cy.getByAutoId('Request1on1ACCButton').should('be.visible');
							}
						});
					});
				});
		});

		accFilters.forEach(filterMap => {
			it(`ACC View All table should be able to filter by status: ${filterMap.filter}`, () => {
				// Filter by status, verify the count
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get(`a[title="${filterMap.filter}"]`).click();

					const filteredItems = validACCItems.filter(
						item => (item[filterMap.field] === filterMap.value)
					);
					cy.getByAutoId('ViewAllTable')
						.within(() => {
							cy.get('tr').then(rows => {
								// Note that the first tr is the column headers
								expect(rows.length - 1).to.eq(filteredItems.length);
							});
						});
				});
			});
		});

		it('ACC View All table should be able to filter by status: All titles', () => {
			// Filter by status, verify the count
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="All titles"]').click();

				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(validACCItems.length);
						});
					});
			});
		});

		it('ACC View All table view should allow requesting 1-on-1', () => {
			// Verify a Request 1-on-1 button is available for all recommended items, and clicking
			// it opens the request form
			validACCItems.forEach((item, index) => {
				if (item.status === 'recommended') {
					cy.get('tr').eq(index + 1).within(() => {
						cy.getByAutoId('Request1on1ACCButton')
							.click({ force: true });
					});
					cy.getByAutoId('accRequestModal-Title').should('be.visible');

					// Close the request form
					cy.getByAutoId('ACCCloseRequestModal').click();
					cy.getByAutoId('accRequestModal').should('not.exist');
				}
			});
		});

		describe('Bookmark items', () => {
			before(() => {
				// Switch to mock data with no items bookmarked
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click({ force: true });
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Refresh the data
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

				// Re-open the ACC View All modal, and ensure we're in table view
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('acc-table-view-btn').click({ force: true });
				cy.getByAutoId('ViewAllTable').should('be.visible');
			});

			after(() => {
				// Switch back to the default mock
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click({ force: true });
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Refresh the page to force-reset bookmarks
				cy.loadApp();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

				// Re-open the ACC View All modal, and ensure we're in table view
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('acc-table-view-btn').click({ force: true });
				cy.getByAutoId('ViewAllTable').should('be.visible');
			});

			it('ACC View All table view should allow bookmarking items', () => {
				cy.get('tr').each(($row, index) => {
					if (index !== 0) {
						// Skip the first tr element, since this holds the headers
						cy.wrap($row).within(() => {
							// Check for bookmark API calls
							cy.getByAutoId('SBListRibbon')
								.should('have.class', 'icon-bookmark--off')
								.click();
							cy.wait('(Lifecycle) IBN-Bookmark');
							cy.getByAutoId('SBListRibbon')
								.should('have.class', 'icon-bookmark--on');
						});
					}
				});
			});
		});

		describe('Un-bookmark items', () => {
			before(() => {
				// Switch to mock data with no items bookmarked
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoBookmarked');

				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click({ force: true });
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Refresh the data
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoBookmarked');

				// Re-open the ACC View All modal, and ensure we're in table view
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('acc-table-view-btn').click({ force: true });
				cy.getByAutoId('ViewAllTable').should('be.visible');
			});

			after(() => {
				// Switch back to the default mock
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click({ force: true });
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Refresh the page to force-reset bookmarks
				cy.loadApp();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

				// Re-open the ACC View All modal, and ensure we're in table view
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('acc-table-view-btn').click({ force: true });
				cy.getByAutoId('ViewAllTable').should('be.visible');
			});

			it('ACC View All table view should allow un-bookmarking items', () => {
				cy.get('tr').each(($row, index) => {
					if (index !== 0) {
						// Skip the first tr element, since this holds the headers
						cy.wrap($row).within(() => {
							// Check for bookmark API calls
							cy.getByAutoId('SBListRibbon')
								.should('have.class', 'icon-bookmark--on')
								.click();
							cy.wait('(Lifecycle) IBN-Bookmark');
							cy.getByAutoId('SBListRibbon')
								.should('have.class', 'icon-bookmark--off');
						});
					}
				});
			});
		});

		it('ACC View All table should be able filter and sort together', () => {
			// Filter by status and sort
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="In progress"]').click();

				const filteredItems = validACCItems.filter(
					item => (item.status === 'in-progress')
				);
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						// Verify the filtered count
						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(filteredItems.length);
						});

						// Verify the sort order
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
						const sortedItemsAsc = Cypress._.orderBy(filteredItems, ['title'], ['asc']);
						sortedItemsAsc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ACC-Title').should('have.text', item.title);
							});
						});

						// Reverse the sort and re-verify order
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
						const sortedItemsDesc = Cypress._.orderBy(filteredItems, ['title'], ['desc']);
						sortedItemsDesc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ACC-Title').should('have.text', item.title);
							});
						});
					});
			});
		});
	});

	describe('PBC-236: ACC View All table sorting stickiness', () => {
		beforeEach(() => {
			// Open the View All modal and switch to table view
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('acc-table-view-btn').click({ force: true });
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		afterEach(() => {
			// Switch back to card view and close View All modal
			cy.getByAutoId('acc-card-view-btn').click();
			cy.getByAutoId('ACCCard').should('be.visible');
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.be.visible');

			// Make sure we're on the lifecycle page and the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('ACC View All table sort should be sticky across modal close/re-open', () => {
			const sortedItemsAsc = Cypress._.orderBy(validACCItems, ['title'], ['asc']);

			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Close and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the still in table view and sort is still in place
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ACC-Title').should('have.text', item.title);
						});
					});
				});
		});

		it('ACC View All table sort should be sticky across table/card view', () => {
			const sortedItemsAsc = Cypress._.orderBy(validACCItems, ['title'], ['asc']);

			// Sort the data
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Switch to card view, verify the sort is still in place
			cy.getByAutoId('acc-card-view-btn').click();
			cy.getByAutoId('ViewAllModal').within(() => {
				sortedItemsAsc.forEach((item, index) => {
					cy.getByAutoId('ACCCard')
						.eq(index)
						.should('contain', item.title);
				});
			});

			// Switch back to table view, verify sort is still in place
			cy.getByAutoId('acc-table-view-btn').click({ force: true });
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ACC-Title').should('have.text', item.title);
						});
					});
				});
		});

		it('ACC View All table sort should NOT be sticky across use case changes', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Close the modal, switch use cases, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
			cy.wait('(SP) IBN-Campus Network Segmentation-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify still in table view and sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					validACCItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ACC-Title').should('have.text', item.title);
						});
					});
				});
		});

		it('ACC View All table sort should NOT be sticky across page navigation', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					validACCItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ACC-Title').should('have.text', item.title);
						});
					});
				});
		});

		it('ACC View All table sort should NOT be sticky across page reload', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					validACCItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ACC-Title').should('have.text', item.title);
						});
					});
				});
		});
	});

	describe('PBC-236: ACC View All table filter stickiness', () => {
		beforeEach(() => {
			// Open the View All modal and switch to table view
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('acc-table-view-btn').click({ force: true });
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		afterEach(() => {
			// Switch back to card view and close View All modal
			cy.getByAutoId('acc-card-view-btn').click();
			cy.getByAutoId('ACCCard').should('be.visible');
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.be.visible');

			// Make sure we're on the lifecycle page and the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('ACC View All table filter should be sticky across modal close/re-open', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Requested"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
			});

			// Close and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter is still in place
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
				const filteredItems = validACCItems.filter(item => (item.status === 'requested'));
				cy.get('tr').then($rows => {
					// Note that the first tr is the column headers
					expect($rows.length - 1).to.eq(filteredItems.length);
				});
			});
		});

		it('ACC View All table filter should be sticky across table/card view', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Requested"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
			});

			// Switch to card view, verify the filter is still in place
			cy.getByAutoId('acc-card-view-btn').click();
			const filteredItems = validACCItems.filter(item => (item.status === 'requested'));
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
				cy.getByAutoId('ACCCard').then($cards => {
					expect($cards.length).to.eq(filteredItems.length);
				});
			});

			// Switch back to table view, verify the filter is still in place
			cy.getByAutoId('acc-table-view-btn').click({ force: true });
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.get('tr').then($rows => {
						// Note that the first tr is the column headers
						expect($rows.length - 1).to.eq(filteredItems.length);
					});
				});
		});

		it('ACC View All table filter should NOT be sticky across use case changes', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Requested"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
			});

			// Close the modal, change use cases, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
			cy.wait('(SP) IBN-Campus Network Segmentation-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', i18n._AllTitles_);
			cy.get('tr').then($rows => {
				// Note that the first tr is the column headers
				expect($rows.length - 1).to.eq(validACCItems.length);
			});
		});

		it('ACC View All table filter should NOT be sticky across page navigation', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Requested"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
			});

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', i18n._AllTitles_);
			cy.get('tr').then($rows => {
				// Note that the first tr is the column headers
				expect($rows.length - 1).to.eq(validACCItems.length);
			});
		});

		it('ACC View All table filter should NOT be sticky across page reload', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Requested"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
			});

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', i18n._AllTitles_);
			cy.get('tr').then($rows => {
				// Note that the first tr is the column headers
				expect($rows.length - 1).to.eq(validACCItems.length);
			});
		});
	});

	describe('PBC-236: ACC View All table vs card view stickiness', () => {
		beforeEach(() => {
			// Open the modal and ensure we're in card view
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('acc-card-view-btn').click();
			cy.getByAutoId('ACCCard').should('be.visible');
		});

		afterEach(() => {
			// Switch to back to card view and close the modal
			cy.getByAutoId('acc-card-view-btn').click();
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			// Make sure we're on the lifecycle page and the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('ACC View All table vs. card view should be sticky across modal close/re-open', () => {
			// Switch to table view
			cy.getByAutoId('acc-table-view-btn').click({ force: true });
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Close and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal-Title').should('be.visible');

			// Verify we're still in table view
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('ACC View All table vs. card view should be sticky across usecase change', () => {
			// Switch to table view
			cy.getByAutoId('acc-table-view-btn').click({ force: true });
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Close the modal, switch use cases, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal-Title').should('be.visible');

			// Verify we're still in table view
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('ACC View All table vs. card view should be sticky across page navigation', () => {
			// Switch to table view
			cy.getByAutoId('acc-table-view-btn').click({ force: true });
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal-Title').should('be.visible');

			// Verify we're still in table view
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('ACC View All table vs. card view should be sticky across page reload', () => {
			// Switch to table view
			cy.getByAutoId('acc-table-view-btn').click({ force: true });
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal-Title').should('be.visible');

			// Verify we're still in table view
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});
	});

	describe('PBC-237: (UI) View -  Lifecycle - ACC Status Ribbons', () => {
		before(() => {
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
		});

		after(() => {
			cy.getByAutoId('ViewAllCloseModal').click({ force: true });

			// Reload the page to force-reset any changed bookmarks
			// This is required since the mock bookmark APIs don't actually bookmark the ACC items
			cy.loadApp();
			cy.waitForAppLoading();

			// Wait for the ACC panel to finish loading
			cy.waitForAppLoading('accLoading', 15000);
		});

		it('Should be able to bookmark an ACC item', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				validACCItems.forEach((acc, index) => {
					if (!acc.bookmark) {
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__white')
							.click();
						cy.wait('(Lifecycle) IBN-Bookmark');
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__blue');
					}
				});
			});
		});

		it('Should be able to UN-bookmark an ACC item', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				validACCItems.forEach((acc, index) => {
					if (acc.bookmark) {
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__blue')
							.click();
						cy.wait('(Lifecycle) IBN-Bookmark');
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__white');
					}
				});
			});
		});
	});

	describe('PBC-238: (UI) View - Lifecycle - ACC List & Hover', () => {
		before(() => {
			// Ensure we're set to the default mock data
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		afterEach(() => {
			// Make sure we're set back to the default mock data
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('Should only show the More section if there is more than 1 ACC item', () => {
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-oneRecommended');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-oneRecommended');

			// Should hide the "More" list
			cy.getByAutoId('moreACCList-Header').should('not.exist');
			cy.getByAutoId('moreACCList').should('not.exist');
		});

		it('ACC More list items should have hover modal', () => {
			const accMoreItems = visibleACCItems.slice(1, 3);
			accMoreItems.forEach((acc, index) => {
				cy.getByAutoId('moreACCList-item').eq(index).within(() => {
					cy.getByAutoId('moreACCList-HoverModal').should('exist').within(() => {
						cy.getByAutoId('moreACCList-HoverModal-Title')
							.should('have.text', acc.title)
							.and('have.class', 'title-line-clamp');
						cy.getByAutoId('moreACCList-HoverModal-Description')
							.should('have.text', acc.description)
							.and('have.class', 'line-clamp');
						cy.getByAutoId('moreACCList-HoverModal-BookmarkRibbon').should('exist');

						// Ribbon is blue for bookmarked, white otherwise
						if (acc.bookmark) {
							cy.getByAutoId('moreACCList-HoverModal-BookmarkRibbon').should('have.class', 'ribbon__blue');
							cy.getByAutoId('.star').should('not.exist');
						} else {
							cy.getByAutoId('moreACCList-HoverModal-BookmarkRibbon').should('have.class', 'ribbon__white');
							cy.getByAutoId('.star').should('not.exist');
						}

						// Recommended should have "Request 1-on-1", requested/in-progress/completed have text
						switch (acc.status) {
							case 'completed':
								cy.getByAutoId('moreACCList-HoverModal-CompletedMessage')
									.should('have.text', i18n._Completed_);
								cy.getByAutoId('Request1on1ACCButton')
									.should('not.exist');
								break;
							case 'in-progress':
								cy.getByAutoId('moreACCList-HoverModal-In-Progress')
									.should('contain', i18n._SessionInProgress_);
								cy.getByAutoId('Request1on1ACCButton')
									.should('not.exist');
								break;
							case 'requested':
								// PBC-602 Green CSE message has been removed
								cy.getByAutoId('Request1on1ACCButton')
									.should('not.exist');
								break;
							default:	// Default: recommended
								cy.getByAutoId('Request1on1ACCButton')
									.should('contain', i18n._Request1on1_);
						}
					});
				});
			});
		});
	});

	describe('PBC-601: UAT F8724 - Lifecycle - ACC--Customer should be blocked from scheduling at pitstops more than 1 a...', () => {
		before(() => {
			// Switch to mock data with no scheduled items
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');
		});

		after(() => {
			// Reset the view to the currentPitstop
			cy.get('#racecar').click();

			// Switch back to the default mock data
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('Should allow scheduling of an ACC on the current pitstop', () => {
			// Verify the Request 1-on-1 button is enabled
			cy.getByAutoId('Request1on1ACCButton')
				.first()
				.should('not.have.class', 'disabled')
				.click({ force: true });
			cy.getByAutoId('accRequestModal-Title').should('be.visible');

			// Close the modal
			cy.getByAutoId('ACCCloseRequestModal').click();
			cy.getByAutoId('accRequestModal').should('not.exist');
		});

		it('Should allow scheduling of an ACC on the next pitstop', () => {
			// Move the preview to the next pitstop
			cy.getByAutoId('Racetrack-Point-Implement').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Implement-twoRecommended', { timeout: 5000 });

			// Verify the Request 1-on-1 button is enabled
			cy.getByAutoId('Request1on1ACCButton')
				.first()
				.should('not.have.class', 'disabled')
				.click({ force: true });
			cy.getByAutoId('accRequestModal-Title').should('be.visible');

			// Close the modal
			cy.getByAutoId('ACCCloseRequestModal').click();
			cy.getByAutoId('accRequestModal').should('not.exist');
		});

		it('Should NOT allow scheduling of an ACC on the after next pitstop', () => {
			// Move the preview to the next pitstop
			cy.getByAutoId('Racetrack-Point-Use').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Use-twoRecommended', { timeout: 5000 });

			// NOTE: Cypress can not trigger elements with :hover css property. Since the tooltip
			// doesn't exist in the DOM until we hover, only check that the button is disabled.
			// See below for reference:
			// https://docs.cypress.io/api/commands/hover.html#Workarounds
			// https://github.com/cypress-io/cypress/issues/10
			cy.getByAutoId('Request1on1ACCButton')
				.first()
				.should('have.class', 'disabled');
		});
	});

	describe('PBC-869: ATX and ACC View All states', () => {
		before(() => {
			// Open the View All modal and switch to table view
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('acc-table-view-btn').click();
		});

		after(() => {
			// Switch back to card view and close the View All modal
			cy.getByAutoId('acc-card-view-btn').click();
			cy.getByAutoId('ViewAllCloseModal').click();
		});

		it('ACC View All table view rows should have hover modals', () => {
			validACCItems.forEach((item, index) => {
				cy.get('tr')
					.eq(index + 1)
					.within(() => {
						cy.getByAutoId('viewAllTable-HoverModal').within(() => {
							cy.getByAutoId('viewAllTable-HoverModal-Title')
								.should('have.text', item.title)
								.and('have.class', 'title-line-clamp');
							// If the description contains \n, those get converted to <br>, which breaks text
							// matching. Thus, split the string on \n, and verify each section exists
							const splitDescription = item.description.split('\n');
							splitDescription.forEach(substring => {
								cy.getByAutoId('viewAllTable-HoverModal-Description')
									.should('contain', substring)
									.and('have.class', 'line-clamp');
							});
							// Handle bookmark
							if (item.bookmark) {
								cy.getByAutoId('viewAllTable-HoverModal-BookmarkRibbon')
									.should('have.class', 'ribbon__blue');
							} else {
								cy.getByAutoId('viewAllTable-HoverModal-BookmarkRibbon')
									.should('have.class', 'ribbon__white');
							}
						});
					});
			});
		});
	});

	describe('PBC-1017: UI - User interface needed for ACC details', () => {
		// JIRA name is not terribly descriptive...
		// These tests relate to partner-branding on ACC details (first item and More list)
		afterEach(() => {
			// Switch back to the default mock data
			// (has providerInfo.id and providerInfo.name, but providerInfo.logoURL is empty string)

			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('First ACC item details should show partner name when no logoURL', () => {
			// Verify the logo text is shown, instead of the image
			cy.getByAutoId('recommendedACC').within(() => {
				cy.getByAutoId('recommendedACC-ProviderText')
					.should('exist')
					.and('have.text', validACCItems[0].providerInfo.name);
				cy.getByAutoId('recommendedACC-ProviderLogo')
					.should('not.exist');
			});
		});

		it('First ACC item details should show partner image from logoURL', () => {
			// Switch to mock data with logoURLs
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoWithPartner');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoWithPartner');

			// Verify the logo image is shown, instead of the text
			cy.getByAutoId('recommendedACC').within(() => {
				cy.getByAutoId('recommendedACC-ProviderLogo')
					.should('exist')
					.and('have.attr', 'src', twoWithPartnerItems[0].providerInfo.logoURL);
				cy.getByAutoId('recommendedACC-ProviderText')
					.should('not.exist');
			});
		});

		it('First ACC item details should hide logo and partner name if both are missing', () => {
			// Switch to mock data with NO providerInfo block
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

			// Verify the logo and text are hidden
			cy.getByAutoId('recommendedACC').within(() => {
				cy.getByAutoId('recommendedACC-ProviderLogo')
					.should('not.exist');
				cy.getByAutoId('recommendedACC-ProviderText')
					.should('not.exist');
			});
		});

		it('ACC More list items should show partner name regardless of logoURL', () => {
			visibleACCItems.forEach((acc, index) => {
				if (index !== 0) {
					// Skip the first visible ACC, as this is in the detail panel
					cy.getByAutoId('moreACCList-item')
						.eq(index - 1)
						.within(() => {
							cy.getByAutoId('moreACCList-Provider')
								.should('have.text', `${i18n._By_}${acc.providerInfo.name}`);
						});
				}
			});

			// Switch to mock data with logoURLs
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoWithPartner');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoWithPartner');

			// Verify the more list still uses the name, not the image
			cy.getByAutoId('moreACCList-item')
				.first()
				.within(() => {
					cy.getByAutoId('moreACCList-Provider')
						.should('have.text', `${i18n._By_}${twoWithPartnerItems[1].providerInfo.name}`);
				});
		});

		it('ACC More list items should NOT show partner name if missing', () => {
			// Switch to mock data with NO providerInfo block
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

			// Verify the "By <name>" text is hidden
			cy.getByAutoId('moreACCList-item')
				.first()
				.within(() => {
					cy.getByAutoId('moreACCList-Provider')
						.and('have.text', '');
				});
		});

		it('First ACC item hover should show partner name regardless of logoURL', () => {
			cy.getByAutoId('recommendedACC-HoverModal-Provider')
				.should('have.text', `${i18n._By_}${validACCItems[0].providerInfo.name}`);

			// Switch to mock data with logoURLs
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoWithPartner');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoWithPartner');

			// Verify the first item's hover still uses the name, not the image
			cy.getByAutoId('recommendedACC-HoverModal-Provider')
				.should('have.text', `${i18n._By_}${twoWithPartnerItems[0].providerInfo.name}`);
		});

		it('First ACC item hover should NOT show partner name if missing', () => {
			// Switch to mock data with NO providerInfo block
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

			// Verify the "By <name>" text is hidden
			cy.getByAutoId('recommendedACC-HoverModal-Provider')
				.should('have.text', '');
		});

		it('ACC More list item hovers should show partner name regardless of logoURL', () => {
			visibleACCItems.forEach((acc, index) => {
				if (index !== 0) {
					// Skip the first visible item, as this is in the detail card
					cy.getByAutoId('moreACCList-item')
						.eq(index - 1)
						.within(() => {
							cy.getByAutoId('moreACCList-HoverModal').within(() => {
								cy.getByAutoId('moreACCList-HoverModal-Provider')
									.should('have.text', `${i18n._By_}${acc.providerInfo.name}`);
							});
						});
				}
			});

			// Switch to mock data with logoURLs
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoWithPartner');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoWithPartner');

			// Verify the More list item's hover still uses the name, not the image
			cy.getByAutoId('moreACCList-item')
				.first()
				.within(() => {
					cy.getByAutoId('moreACCList-HoverModal').within(() => {
						cy.getByAutoId('moreACCList-HoverModal-Provider')
							.should('have.text', `${i18n._By_}${twoWithPartnerItems[1].providerInfo.name}`);
					});
				});
		});

		it('ACC More list item hovers should NOT show partner name if missing', () => {
			// Switch to mock data with NO providerInfo block
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

			// Verify the "By <name>" text is hidden
			cy.getByAutoId('moreACCList-item')
				.first()
				.within(() => {
					cy.getByAutoId('moreACCList-HoverModal').within(() => {
						cy.getByAutoId('moreACCList-HoverModal-Provider')
							.should('have.text', '');
					});
				});
		});
	});

	describe('PBC-1018: UI needed to display list of partner-offered ACC', () => {
		// JIRA name is not terribly descriptive...
		// These tests relate to partner-branding on ACC details (first item and More list)
		afterEach(() => {
			// Switch back to the default mock data
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		describe('ACC Card View', () => {
			beforeEach(() => {
				// Open the view all modal, and ensure we're in card view
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('acc-card-view-btn').click();
				cy.getByAutoId('ACCCard').should('exist');
			});

			afterEach(() => {
				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');
			});

			it('ACC Card View should show logo from logoURL', () => {
				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Switch to mock data with logoURLs
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoWithPartner');

				// Refresh the data
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoWithPartner');

				// Re-open the view all modal, and ensure we're in card view
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('acc-card-view-btn').click();
				cy.getByAutoId('ACCCard').should('exist');

				twoWithPartnerItems.forEach((acc, index) => {
					cy.getByAutoId('ACCCard')
						.eq(index)
						.within(() => {
							cy.getByAutoId('ACCCard-ProviderLogo')
								.should('have.attr', 'src', acc.providerInfo.logoURL);
							cy.getByAutoId('ACCCard-ProviderText')
								.should('not.exist');
						});
				});
			});

			it('ACC Card View should show partner name when no logoURL', () => {
				validACCItems.forEach((acc, index) => {
					// Only check for partner data on partner ACCs
					if (acc.providerInfo) {
						cy.getByAutoId('ACCCard')
							.eq(index)
							.within(() => {
								cy.getByAutoId('ACCCard-ProviderText')
									.should('have.text', acc.providerInfo.name);
								cy.getByAutoId('ACCCard-ProviderLogo')
									.should('not.exist');
							});
					}
				});
			});

			it('ACC Card View should hide logo and partner name if both are missing', () => {
				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Switch to mock data with NO providerInfo block
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

				// Refresh the data
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoRecommended');

				// Re-open the view all modal, and ensure we're in card view
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('acc-card-view-btn').click();
				cy.getByAutoId('ACCCard').should('exist');

				// Verify the logo and text are hidden
				cy.getByAutoId('ACCCard').each($card => {
					cy.wrap($card).within(() => {
						cy.getByAutoId('ACCCard-ProviderLogo')
							.should('not.exist');
						cy.getByAutoId('ACCCard-ProviderText')
							.should('not.exist');
					});
				});
			});
		});

		describe('ACC Table View', () => {
			afterEach(() => {
				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');
			});

			it('ACC Table View should show partner name regardless of logoURL', () => {
				// Open the view all modal, and ensure we're in table view
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('acc-table-view-btn').click();
				cy.getByAutoId('ViewAllTable').should('exist');

				validACCItems.forEach((acc, index) => {
					cy.log(`ACC: ${acc.title}`);
					// Partner ACCs should have the partner name
					if (acc.providerInfo) {
						// Skip the first tr, as this is the column headers
						cy.get('tr')
							.eq(index + 1)
							.within(() => {
								cy.getByAutoId('partner-name')
									.should('have.text', acc.providerInfo.name);
							});
					} else {
						// Non-partner ACCs will have "Cisco" as the provider
						cy.get('tr')
							.eq(index + 1)
							.within(() => {
								cy.getByAutoId('partner-name')
									.should('have.text', 'Cisco');
							});
					}
				});

				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Switch to mock data with logoURLs
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoWithPartner');

				// Refresh the data
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoWithPartner');

				// Open the view all modal, and ensure we're in table view
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('acc-table-view-btn').click();
				cy.getByAutoId('ViewAllTable').should('exist');

				twoWithPartnerItems.forEach((acc, index) => {
					// Skip the first tr, as this is the column headers
					cy.get('tr')
						.eq(index + 1)
						.within(() => {
							cy.getByAutoId('partner-name')
								.should('have.text', acc.providerInfo.name);
						});
				});
			});

			// Waiting on PBC-1024: http://swtg-jira-lnx.cisco.com:8080/browse/PBC-1024
			// Lifecycle: New partner branding on ACC and ATX needs to handle missing name
			it.skip('ACC Table View should show dash if provider name is missing or blank', () => {
				// Switch to mock data with blank partner names
				accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoWithBlankPartner');

				// Refresh the data
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoWithBlankPartner');

				// Open the view all modal, and ensure we're in table view
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('acc-table-view-btn').click();
				cy.getByAutoId('ViewAllTable').should('exist');

				cy.get('tr').each($row => {
					cy.wrap($row).within(() => {
						cy.getByAutoId('partner-name')
							.should('have.text', '-');
					});
				});
			});

			it('ACC Table View should be sortable by provider', () => {
				// Open the view all modal, and ensure we're in table view
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('acc-table-view-btn').click();
				cy.getByAutoId('ViewAllTable').should('exist');

				// Click the header to sort in ascending order
				cy.getByAutoId('ViewAllTable-columnHeader-Content Provider').click();

				const sortedAsc = Cypress._.orderBy(validACCItems,
					acc => acc.providerInfo && acc.providerInfo.name, 'asc');
				sortedAsc.forEach((acc, index) => {
					// Skip the first tr, as this is the column headers
					cy.get('tr')
						.eq(index + 1)
						.within(() => {
							cy.getByAutoId('ACC-Title').should('have.text', acc.title);
						});
				});

				// Click the header again to reverse the sort
				cy.getByAutoId('ViewAllTable-columnHeader-Content Provider').click();

				const sortedDesc = Cypress._.orderBy(validACCItems,
					acc => acc.providerInfo && acc.providerInfo.name, 'desc');
				sortedDesc.forEach((acc, index) => {
					// Skip the first tr, as this is the column headers
					cy.get('tr')
						.eq(index + 1)
						.within(() => {
							cy.getByAutoId('ACC-Title').should('have.text', acc.title);
						});
				});
			});
		});
	});

	describe('PBC-1042: UI: Filter ACC by Partner ID', () => {
		before(() => {
			// Disable our default getACC mocks so Cypress can catch the calls instead
			accMock.disable('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		beforeEach(() => {
			// Setup mocks from cypress to allow us to catch all possible ACC API
			// calls and return a known response body
			cy.server();
			cy.route({
				method: 'GET',
				url: /.*api\/customerportal\/racetrack\/v1\/acc.*/,
				status: 200,
				response: {
					pitstop: 'Onboard',
					solution: 'IBN',
					usecase: 'Campus Network Assurance',
					items: twoWithPartnerItems,
				},
			}).as('getACC');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('@getACC');
			cy.wait('(Lifecycle) PartnerInfoListUsingGET');
		});

		after(() => {
			// Reset our mocks to default data
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		describe('Global vs. View All filters', () => {
			it('Global filter by partner should update ACC View All filter', () => {
				// Open the global filter and select the first two items
				cy.getByAutoId('GlobalFilter')
					.within(() => {
						cy.getByAutoId('MultiSelect-SearchInput').click();
						cy.getByAutoId('MultiSelect-ListItem0').click();
						cy.getByAutoId('MultiSelect-ListItem1').click();
						cy.getByAutoId('MultiSelect-SaveButton').click();
					});

				cy.wait('@getACC');

				// Open the View All modal and verify the selected filter matches the global
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();

				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								cy.getByAutoId('MultiSelect-SearchInput').click();
								cy.getByAutoId('MultiSelect-ListItem0')
									.should('have.class', 'ms-dropdown__list__item--selected');
								cy.getByAutoId('MultiSelect-ListItem1')
									.should('have.class', 'ms-dropdown__list__item--selected');

								// Make sure the rest of the items were not selected
								cy.getByAutoId('MultiSelect-SelectAll')
									.should('not.have.class', 'ms-dropdown__list__item--selected');
								for (let i = 2; i < partnerInfoBody.companyList.length; i += 1) {
									cy.getByAutoId(`MultiSelect-ListItem${i}`)
										.should('not.have.class', 'ms-dropdown__list__item--selected');
								}
							});
					});

				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');
			});

			it('Global filter by partner should override ACC View All filter', () => {
				// Open the View All modal and select the first company
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();

				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								cy.getByAutoId('MultiSelect-SearchInput').click();
								cy.getByAutoId('MultiSelect-ListItem0').click();
								cy.getByAutoId('MultiSelect-SaveButton').click();
							});
					});

				cy.wait('@getACC');

				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Open the global filter and select the second company
				cy.getByAutoId('GlobalFilter')
					.within(() => {
						cy.getByAutoId('MultiSelect-SearchInput').click();
						cy.getByAutoId('MultiSelect-ListItem1').click();
						cy.getByAutoId('MultiSelect-SaveButton').click();
					});

				cy.wait('@getACC');

				// Open the View All modal and verify the selected filter has been overridden to
				// match the gobal selection
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();

				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								cy.getByAutoId('MultiSelect-SearchInput').click();
								cy.getByAutoId('MultiSelect-ListItem0')
									.should('not.have.class', 'ms-dropdown__list__item--selected');
								cy.getByAutoId('MultiSelect-ListItem1')
									.should('have.class', 'ms-dropdown__list__item--selected');

								// Make sure the rest of the items were not selected
								cy.getByAutoId('MultiSelect-SelectAll')
									.should('not.have.class', 'ms-dropdown__list__item--selected');
								for (let i = 2; i < partnerInfoBody.companyList.length; i += 1) {
									cy.getByAutoId(`MultiSelect-ListItem${i}`)
										.should('not.have.class', 'ms-dropdown__list__item--selected');
								}
							});
					});

				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');
			});

			it('ACC View All filter should NOT update/override global filter', () => {
				// Open the global filter and select the first two items
				cy.getByAutoId('GlobalFilter')
					.within(() => {
						cy.getByAutoId('MultiSelect-SearchInput').click();
						cy.getByAutoId('MultiSelect-ListItem0').click();
						cy.getByAutoId('MultiSelect-ListItem1').click();
						cy.getByAutoId('MultiSelect-SaveButton').click();
					});

				cy.wait('@getACC');

				// Open the View All modal and select a third company
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();

				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								cy.getByAutoId('MultiSelect-SearchInput').click();
								cy.getByAutoId('MultiSelect-ListItem2').click();
								cy.getByAutoId('MultiSelect-SaveButton').click();
							});
					});

				cy.wait('@getACC');

				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Open the global filter and verify only the first two companies are selected
				cy.getByAutoId('GlobalFilter')
					.within(() => {
						cy.getByAutoId('MultiSelect-SearchInput').click();
						cy.getByAutoId('MultiSelect-ListItem0')
							.should('have.class', 'ms-dropdown__list__item--selected');
						cy.getByAutoId('MultiSelect-ListItem1')
							.should('have.class', 'ms-dropdown__list__item--selected');

						cy.getByAutoId('MultiSelect-SelectAll')
							.should('not.have.class', 'ms-dropdown__list__item--selected');
						for (let i = 2; i < partnerInfoBody.companyList.length; i += 1) {
							cy.getByAutoId(`MultiSelect-ListItem${i}`)
								.should('not.have.class', 'ms-dropdown__list__item--selected');
						}

						// Close the global filter
						cy.getByAutoId('MultiSelect-DropdownToggle').click();
					});
			});
		});

		describe('ACC View All filters', () => {
			beforeEach(() => {
				// Open the View All modal
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			});

			afterEach(() => {
				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');
			});

			it('ACC filter by partner "Save" button should trigger API call', () => {
				// Select a filter, and close the modal
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								// Click the save button without changing selection
								cy.getByAutoId('MultiSelect-SearchInput').click();
								cy.getByAutoId('MultiSelect-SaveButton').click();
							});
					});

				cy.wait('@getACC').its('url').then(url => {
					expect(url).to.eq('https://api-stage.cisco.com/api/customerportal/racetrack/v1/acc'
						+ '?usecase=Campus Network Assurance&'
						+ 'solution=IBN&pitstop=Onboard&'
						+ 'customerId=2431199&'
						+ 'suggestedAction=Get to know Cisco DNA Center');
				});
			});

			it('Collapsing ACC filter without saving should revert to previous selection', () => {
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								// Make a selection, but DON'T click Save
								cy.getByAutoId('MultiSelect-SearchInput').click();
								cy.getByAutoId('MultiSelect-ListItem0').click();

								// Close the dropdown, and re-open it
								cy.getByAutoId('MultiSelect-DropdownToggle').click();
								cy.getByAutoId('MultiSelect-SearchInput').click();

								// Verify the selection was reverted (to none selected)
								cy.getByAutoId('MultiSelect-SelectAll')
									.should('not.have.class', 'ms-dropdown__list__item--selected');
								for (let i = 0; i < partnerInfoBody.companyList.length; i += 1) {
									cy.getByAutoId(`MultiSelect-ListItem${i}`)
										.should('not.have.class', 'ms-dropdown__list__item--selected');
								}
							});
					});
			});

			it('ACC filters should support multi-selection', () => {
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-StatusMultiFilter')
							.within(() => {
								// Select two status filters and Save them
								cy.getByAutoId('MultiSelect-SearchInput').click();
								cy.getByAutoId('MultiSelect-ListItem0').click();
								cy.getByAutoId('MultiSelect-ListItem1').click();
								cy.getByAutoId('MultiSelect-SaveButton').click();
							});
						cy.wait('@getACC');

						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								// Select two partner filters and Save them
								cy.getByAutoId('MultiSelect-SearchInput').click();
								cy.getByAutoId('MultiSelect-ListItem0').click();
								cy.getByAutoId('MultiSelect-ListItem1').click();
								cy.getByAutoId('MultiSelect-SaveButton').click();
							});
						cy.wait('@getACC');

						// Verify the multi-selects display the number of items selected
						cy.getByAutoId('ViewAllModal-StatusMultiFilter')
							.within(() => {
								cy.getByAutoId('MultiSelect-SearchInput')
									.should('have.attr', 'placeholder', `${i18n._Status_} (2)`);
							});
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								cy.getByAutoId('MultiSelect-SearchInput')
									.should('have.attr', 'placeholder', `${i18n._ContentProvider_} (2)`);
							});
					});
			});

			it('ACC partner filter should apply to and be edit-able from both card and table view', () => {
				// Ensure we're in card view
				cy.getByAutoId('acc-card-view-btn').click();
				cy.getByAutoId('ACCCard').should('exist');

				// Select a filter for the partner dropdown
				cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
					.within(() => {
						cy.getByAutoId('MultiSelect-SearchInput').click();
						cy.getByAutoId('MultiSelect-ListItem0').click();
						cy.getByAutoId('MultiSelect-SaveButton').click();
					});
				cy.wait('@getACC');

				// Switch to table view
				cy.getByAutoId('acc-table-view-btn').click();
				cy.getByAutoId('ViewAllTable').should('exist');

				cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
					.within(() => {
						cy.getByAutoId('MultiSelect-SearchInput').click();
						cy.getByAutoId('MultiSelect-ListItem0')
							.should('have.class', 'ms-dropdown__list__item--selected');
						// Select an extra filter
						cy.getByAutoId('MultiSelect-ListItem1').click();
						cy.getByAutoId('MultiSelect-SaveButton').click();
					});
				cy.wait('@getACC');

				// Switch back to card view
				cy.getByAutoId('acc-card-view-btn').click();
				cy.getByAutoId('ACCCard').should('exist');

				cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
					.within(() => {
						cy.getByAutoId('MultiSelect-SearchInput').click();
						cy.getByAutoId('MultiSelect-ListItem0')
							.should('have.class', 'ms-dropdown__list__item--selected');
						cy.getByAutoId('MultiSelect-ListItem1')
							.should('have.class', 'ms-dropdown__list__item--selected');
					});
				cy.wait('@getACC');
			});

			it('ACC filter by partner should show full list of partners from API', () => {
				// Open the partner filter
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								cy.getByAutoId('MultiSelect-SearchInput').click();

								// Verify all the partners in the API response are in the dropdown
								// Note the first item is forced to "Cisco"
								cy.getByAutoId('MultiSelect-ListItem0Text')
									.should('have.text', 'Cisco');
								partnerInfoBody.companyList.forEach((company, index) => {
									cy.getByAutoId(`MultiSelect-ListItem${index + 1}Text`)
										.should('have.text', company.companyName);
								});
							});
					});
			});

			it('ACC filter "All" selection should unselect all other dropdown entries', () => {
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						// Only view within the View all selection of the ATX panel
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter').click();

						// Open Partner dropdown
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter').click();

						// Select other options that are not 'All' and save
						for (let i = 1; i < partnerInfoBody.companyList.length; i += 2) {
							cy.getByAutoId(`MultiSelect-ListItem${i}`).click();
						}
						cy.getByAutoId('MultiSelect-SaveButton').click();

						// Reopen dropdown and select 'All'
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter').click();
						cy.getByAutoId('MultiSelect-SelectAll').click();
						cy.getByAutoId('MultiSelect-SaveButton').click();

						// Loop through items in dropdown and confirm all other selections are not selected
						for (let i = 1; i < partnerInfoBody.companyList.length; i += 2) {
							cy.getByAutoId(`MultiSelect-ListItem${i}`)
								.should('not.have.class', 'ms-dropdown__list__item--selected');
						}
					});
			});

			it('ACC filter entry selection should unselect the "All" entry', () => {
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						// Open the Partner Dropdown
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter').click();

						// Select All and click Save
						cy.getByAutoId('MultiSelect-SelectAll').click();
						cy.getByAutoId('MultiSelect-SaveButton').click();

						// Reopen the dropdown
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter').click();

						// Select another option from the drop down and save
						cy.getByAutoId('MultiSelect-ListItem1').click();
						cy.getByAutoId('MultiSelect-SaveButton').click();

						// Reopen dropdown
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter').click();

						// Confirm the All option is not selected (check that the class isn't there)
						cy.getByAutoId('MultiSelect-SelectAll')
							.should('not.have.class', 'ms-dropdown__list__item--selected');
					});
			});

			it('ACC filter "All" selection should call API with all available options', () => {
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter').click();
						cy.getByAutoId('MultiSelect-SelectAll').click();
						cy.getByAutoId('MultiSelect-SaveButton').click();
						cy.getByAutoId('MultiSelect-DropdownList').should('not.exist');
					});

				// TODO: This is a workaround due to PBC-1044
				// http://swtg-jira-lnx.cisco.com:8080/browse/PBC-1044
				cy.wait('@getACC');
				cy.wait('@getACC');
				// End workaround

				cy.wait('@getACC')
					.its('url')
					.then(url => {
						partnerInfoBody.companyList.forEach(company => {
							expect(url).to.contain(`providerId=${company.companyId}`);
						});
					});
			});

			it('ACC filters "Clear" button should clear filter selection', () => {
				// Select a filter
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter').click();
						cy.getByAutoId('MultiSelect-ListItem1').click();
						cy.getByAutoId('MultiSelect-SaveButton').click();
					});
				cy.wait('@getACC');

				// Re-open the filter dropdown
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter').click();
						cy.getByAutoId('MultiSelect-ListItem1')
							.should('have.class', 'ms-dropdown__list__item--selected');

						// Click the clear button
						cy.getByAutoId('MultiSelect-ClearButton').click();

						// Verify all selections were cleared
						cy.getByAutoId('MultiSelect-SelectAll')
							.should('not.have.class', 'ms-dropdown__list__item--selected');
						for (let i = 0; i < partnerInfoBody.companyList.length; i += 1) {
							cy.getByAutoId(`MultiSelect-ListItem${i}`)
								.should('not.have.class', 'ms-dropdown__list__item--selected');
						}
						cy.getByAutoId('MultiSelect-SaveButton').click();
					});
				cy.wait('@getACC');
			});

			it('ACC filters selecting all items individually should auto-select "All"', () => {
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter').click();
						// Select all the partner filters
						// NOTE: We have to add one to this list, as "Cisco" is added by the UI
						for (let i = 0; i < partnerInfoBody.companyList.length + 1; i += 1) {
							cy.getByAutoId(`MultiSelect-ListItem${i}`).click();
						}

						// Verify the selection has been automatically switched to "All"
						cy.getByAutoId('MultiSelect-SelectAll')
							.should('have.class', 'ms-dropdown__list__item--selected');

						// Verify all other selections were unselected
						for (let i = 0; i < partnerInfoBody.companyList.length + 1; i += 1) {
							cy.getByAutoId(`MultiSelect-ListItem${i}`)
								.should('not.have.class', 'ms-dropdown__list__item--selected');
						}
					});
			});
		});

		describe('ACC View All Partner Filter stickiness', () => {
			beforeEach(() => {
				// Open the View All modal
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();

				// Select a filter, and close the modal
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								cy.getByAutoId('MultiSelect-SearchInput').click();
								cy.getByAutoId('MultiSelect-ListItem0').click();
								cy.getByAutoId('MultiSelect-SaveButton').click();
							});
					});

				cy.wait('@getACC');

				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');
			});

			afterEach(() => {
				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Force a refresh to reset any filters
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('@getACC');
			});

			it('ACC filter by partner should be sticky across View All close/re-open', () => {
				// Re-open the View All modal
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();

				// Verify the filter is still in place
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								cy.getByAutoId('MultiSelect-SearchInput').click();
								cy.getByAutoId('MultiSelect-ListItem0')
									.should('have.class', 'ms-dropdown__list__item--selected');

								// Make sure the rest of the items were not selected
								cy.getByAutoId('MultiSelect-SelectAll')
									.should('not.have.class', 'ms-dropdown__list__item--selected');
								for (let i = 1; i < partnerInfoBody.companyList.length; i += 1) {
									cy.getByAutoId(`MultiSelect-ListItem${i}`)
										.should('not.have.class', 'ms-dropdown__list__item--selected');
								}
							});
					});
			});

			it('ACC filter by partner should NOT be sticky across use case changes', () => {
				// Change use cases and change back
				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
				cy.wait('@getACC');

				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
				cy.wait('@getACC');

				// Re-open the View All and verify the filter has been cleared
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								cy.getByAutoId('MultiSelect-SearchInput').click();

								// Make sure NONE of the items were selected
								cy.getByAutoId('MultiSelect-SelectAll')
									.should('not.have.class', 'ms-dropdown__list__item--selected');
								for (let i = 0; i < partnerInfoBody.companyList.length; i += 1) {
									cy.getByAutoId(`MultiSelect-ListItem${i}`)
										.should('not.have.class', 'ms-dropdown__list__item--selected');
								}
							});
					});
			});

			it('ACC filter by partner should NOT be sticky across page navigation', () => {
				// Change tabs and change back
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('@getACC');

				// Re-open the View All and verify the filter has been cleared
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								cy.getByAutoId('MultiSelect-SearchInput').click();

								// Make sure NONE of the items were selected
								cy.getByAutoId('MultiSelect-SelectAll')
									.should('not.have.class', 'ms-dropdown__list__item--selected');
								for (let i = 0; i < partnerInfoBody.companyList.length; i += 1) {
									cy.getByAutoId(`MultiSelect-ListItem${i}`)
										.should('not.have.class', 'ms-dropdown__list__item--selected');
								}
							});
					});
			});

			it('ACC filter by partner should NOT be sticky across page reload', () => {
				// Reload the page completely
				cy.loadApp();
				cy.waitForAppLoading('accLoading');

				// Re-open the View All and verify the filter has been cleared
				cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
				cy.getByAutoId('ViewAllModal')
					.within(() => {
						cy.getByAutoId('ViewAllModal-PartnerMultiFilter')
							.within(() => {
								cy.getByAutoId('MultiSelect-SearchInput').click();

								// Make sure NONE of the items were selected
								cy.getByAutoId('MultiSelect-SelectAll')
									.should('not.have.class', 'ms-dropdown__list__item--selected');
								for (let i = 0; i < partnerInfoBody.companyList.length; i += 1) {
									cy.getByAutoId(`MultiSelect-ListItem${i}`)
										.should('not.have.class', 'ms-dropdown__list__item--selected');
								}
							});
					});
			});
		});
	});

	describe('US144494: Customer to provide feedback after ACC 1-1 session', () => {
		beforeEach(() => {
			// Force a hard refresh to reset the feedback data
			cy.loadApp();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			// Switch to mock data with completed items
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoCompleted');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoCompleted');

			// Feedback is currently only available on View All cards
			// So open the View All modal and ensure we're in card view
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('acc-card-view-btn').click();
			cy.getByAutoId('ACCCard').should('exist');
		});

		afterEach(() => {
			// Close the View All modal
			cy.getByAutoId('ViewAllCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});

		after(() => {
			// Switch back to the default mock data
			feedbackMock.enable('(Lifecycle) Feedback POST');
			feedbackMock.enable('(Lifecycle) Feedback PUT');
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('ACC Feedback form should have required fields', () => {
			cy.getByAutoId('ACCCard').each($card => {
				cy.wrap($card).within(() => {
					cy.getByAutoId('thumbUpBtn').click();
				});

				cy.getByAutoId('FeedbackPopup')
					.should('exist')
					.within(() => {
						cy.getByAutoId('FeedbackPopup-Title')
							.should('have.text', i18n._FeedbackThanks_);
						cy.getByAutoId('FeedbackPopup-Description')
							.should('have.text', i18n._FeedbackMore_);
						cy.getByAutoId('FeedbackPopup-Comments')
							.should('exist');
						// Character count only shows up if comments were entered
						cy.getByAutoId('FeedbackPopup-Comments-Input')
							.type('Automation Feedback');
						cy.getByAutoId('FeedbackPopup-Comments-CharCount')
							.should('contain', `${'Automation Feedback'.length} / 300`);

						// Check Submit button exists, but don't click it
						cy.getByAutoId('FeedbackPopup-Submit')
							.should('exist');

						// Close the feedback popup without submitting
						cy.getByAutoId('FeedbackPopup-Close-Icon').click();
					});
			});
		});

		it('Comments field has a max length of 300 characters', () => {
			cy.getByAutoId('ACCCard')
				.first()
				.within(() => {
					cy.getByAutoId('thumbUpBtn').click();
				});

			cy.getByAutoId('FeedbackPopup')
				.should('exist')
				.within(() => {
					// Comments field should only allow up to 300 characters
					cy.getByAutoId('FeedbackPopup-Comments-Input')
						.clear()
						.type('a'.repeat(301));

					// Field should only have ended up with 300 characters
					cy.getByAutoId('FeedbackPopup-Comments-Input')
						.invoke('val')
						.then(text => {
							expect(text.length).to.eq(300);
						});

					// Close the feedback popup
					cy.getByAutoId('FeedbackPopup-Close-Icon').click();
				});
		});

		it('Submitting feedback form should call API', () => {
			// Setup a Cypress route to intercept the POST API call
			cy.server();
			cy.route({
				method: 'POST',
				url: '/api/customerportal/racetrack/v1/feedback/cxportal',
				status: 200,
				response: {
					feedbackId: 'feedback-1',
					comment: '',
					context: '',
					thumbs: 'UP',
				},
			}).as('feedbackPost');
			cy.route({
				method: 'PUT',
				url: '/api/customerportal/racetrack/v1/feedback/cxportal/feedback-1',
				status: 200,
				response: 'Forced success from QA',
			}).as('feedbackPut');
			// Disable the default mock so Cypress can catch the request
			feedbackMock.disable('(Lifecycle) Feedback POST');
			feedbackMock.disable('(Lifecycle) Feedback PUT');

			cy.getByAutoId('ACCCard')
				.first()
				.within(() => {
					cy.getByAutoId('thumbUpBtn').click();
				});

			cy.wait('@feedbackPost')
				.its('request.body')
				.then(body => {
					expect(body.comment).to.eq('');
					expect(body.context.assetType).to.eq('ACC');
					expect(body.context.customerId).to.eq('2431199');
					expect(body.context.entityId).to.eq('111111');
					expect(body.context.partnerId).to.eq('partner1');
					expect(body.thumbs).to.eq('UP');
				});

			cy.getByAutoId('FeedbackPopup')
				.should('exist')
				.within(() => {
					// Comments field should only allow up to 300 characters
					cy.getByAutoId('FeedbackPopup-Comments-Input')
						.clear()
						.type('Automation Feedback');

					// Submit the form
					cy.getByAutoId('FeedbackPopup-Submit').click();
				});

			cy.wait('@feedbackPut')
				.its('request.body')
				.then(body => {
					expect(body.comment).to.eq('Automation Feedback');
					expect(body.context.assetType).to.eq('ACC');
					expect(body.context.customerId).to.eq('2431199');
					expect(body.context.entityId).to.eq('111111');
					expect(body.context.partnerId).to.eq('partner1');
					expect(body.thumbs).to.eq('UP');
				});
		});

		it('Submitting feedback form should show thank you message', () => {
			cy.getByAutoId('ACCCard')
				.first()
				.within(() => {
					cy.getByAutoId('thumbUpBtn').click();
				});

			cy.getByAutoId('FeedbackPopup')
				.should('exist')
				.within(() => {
					cy.getByAutoId('FeedbackPopup-Comments-Input')
						.clear()
						.type('Automation Feedback');

					// Submit the form
					cy.getByAutoId('FeedbackPopup-Submit').click();
				});

			// Verify the "Thank you" message is displayed with a "Close" button
			cy.getByAutoId('FeedbackPopup-ThankYou').should('have.text', i18n._ThankYou_);
			cy.getByAutoId('FeedbackPopup-Close').click();
			cy.getByAutoId('FeedbackPopup').should('not.exist');
		});
	});
});
