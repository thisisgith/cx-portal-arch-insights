import MockService from '../support/mockService';

const accMock = new MockService('ACCScenarios');
const solution = 'IBN';
const useCase = 'Campus Network Assurance';
const accScenario = accMock.getScenario('GET', `(ACC) ${solution}-${useCase}-Onboard`);
let accItems = accScenario.response.body.items;
const twoRecommendedScenario = accMock.getScenario('GET', `(ACC) ${solution}-${useCase}-Onboard-twoRecommended`);
const twoRecommendedItems = twoRecommendedScenario.response.body.items;

const accUserInfoMock = new MockService('ACCUserInfoScenarios');
const accUserInfoScenario = accUserInfoMock.getScenario('GET', '(ACC) ACC-Request User Info');
const accUserInfoResponse = accUserInfoScenario.response.body;

// ACC items are being sorted by the UI in the following order by status:
// requested, in-progress, recommended, completed
accItems = Cypress._.union(Cypress._.filter(accItems, { status: 'requested' }),
	Cypress._.filter(accItems, { status: 'in-progress' }),
	Cypress._.filter(accItems, { status: 'recommended' }),
	Cypress._.filter(accItems, { status: 'completed' }));

const validACCItems = Cypress._.filter(accItems, acc => acc.description || acc.title);
const visibleACCItems = accItems.slice(0, 3);
const invisibleACCItems = accItems.slice(3);

// The recommended panel should only show the first recommended ACC item
const firstRecommendedACC = Cypress._.head(Cypress._.filter(accItems, { status: 'recommended' }));

const possibleAttendeesValues = [1, 2, 3, 4, 5];

const accFilters = [
	{ filter: 'Recommended', field: 'status', value: 'recommended' },
	{ filter: 'Requested', field: 'status', value: 'requested' },
	{ filter: 'Scheduled', field: 'status', value: 'scheduled' },
	{ filter: 'In progress', field: 'status', value: 'in-progress' },
	{ filter: 'Completed', field: 'status', value: 'completed' },
	{ filter: 'Bookmarked', field: 'isFavorite', value: true },
	{ filter: 'Not bookmarked', field: 'isFavorite', value: false },
];

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
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();

		// Wait for the ACC panel to finish loading
		cy.waitForAppLoading('accLoading', 15000);

		// Close the setup wizard so it doesn't block other elements
		cy.getByAutoId('setup-wizard-header-close-btn').click();
	});

	it('Renders Accelerator tile', () => {
		cy.getByAutoId('Accelerator Panel').should('exist');
		cy.getByAutoId('PanelTitle-_Accelerator_').should('have.text', i18n._Accelerator_);
		cy.getByAutoId('recommendedACC-Title').should('have.text', visibleACCItems[0].title);

		switch (visibleACCItems[0].status) {
			case 'completed':
				cy.getByAutoId('recommendedACC-Completed')
					.should('have.text', i18n._Completed_);
				break;
			case 'in-progress':
			case 'requested':
				cy.getByAutoId('recommendedACC-CSEMessage')
					.should('have.text', i18n._ACCRequestSubmitted_);
				break;
			default:	// Default: recommended
				cy.getByAutoId('recommendedACCWatchButton')
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
					cy.getByAutoId('ACCCardHeader').should('have.class', 'text-dkgray-4');
				} else {
					cy.getByAutoId('ACCCardHeader').should('have.class', 'text-clear');
				}
				cy.getByAutoId('ACCCardTitle').should('have.text', acc.title);
				cy.getByAutoId('ACCCardDescription').should('contain', acc.description);
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
						cy.getByAutoId('Request1on1Button')
							.should('contain', i18n._Request1on1_);
				}

				// PBC-237 Check bookmark ribbon
				if (acc.isFavorite) {
					cy.getByAutoId('ACCCardRibbon')
						.should('have.class', 'ribbon__blue');
				} else {
					cy.getByAutoId('ACCCardRibbon')
						.should('have.class', 'ribbon__white');
				}
			});
		});
		cy.getByAutoId('SuccessPathCloseModal').click();
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
			cy.getByAutoId('SuccessPathCloseModal').click();
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

				const filteredItems = validACCItems.filter(item => (item.isFavorite === true));
				cy.getByAutoId('ACCCard').then(cards => {
					expect(cards.length).to.eq(filteredItems.length);
				});
			});
		});

		it('View All ACC modal can filter by status: Not bookmarked', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get(`a[title="${i18n._NotBookmarked_}"]`).click();

				const filteredItems = validACCItems.filter(item => (item.isFavorite === false));
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

		it('View All ACC modal should be clearable', () => {
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
			cy.getByAutoId('SuccessPathCloseModal').click();
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
			cy.getByAutoId('SuccessPathCloseModal').click();
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
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
			cy.wait('(ACC) IBN-Campus Network Segmentation-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
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
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
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
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			// Close the setup wizard so it doesn't block other elements
			cy.getByAutoId('setup-wizard-header-close-btn').click();

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
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

		afterEach(() => {
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
			cy.getByAutoId('recommendedACCWatchButton').should('exist')
				.and('have.text', 'Request a 1-on-1');

			// Recommended hover modal should show title and description
			cy.getByAutoId('recommendedACC-HoverModal').should('exist');
			cy.getByAutoId('recommendedACC-HoverModal-Title').should('exist')
				.and('contain', twoRecommendedItems[0].title);
			cy.getByAutoId('recommendedACC-HoverModal-Description').should('exist')
				.and('contain', twoRecommendedItems[0].description);
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

				cy.getByAutoId('recommendedACC-HoverModal-CSEMessage').should('exist');
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

				cy.getByAutoId('recommendedACC-HoverModal-CSEMessage').should('exist');
			});
		});

		it('PBC-279: When there are no recommended/requested/in-progress ACCs, use the first completed item', () => {
			accMock.enable('(ACC) IBN-Campus Network Assurance-Onboard-twoCompleted');

			// Refresh the data by switching tabs, and wait for load
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard-twoCompleted');

			// Completed hover should have the completed text, not CSE text or request button
			cy.getByAutoId('recommendedACC').should('exist').within(() => {
				cy.getByAutoId('Request1on1ACCButton').should('not.exist');
				cy.getByAutoId('recommendedACC-HoverModal-CSEMessage').should('not.exist');

				cy.getByAutoId('recommendedACC-HoverModal-CompletedMessage').should('exist');
				cy.getByAutoId('recommendedACC-Checkmark').should('exist');
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
			cy.getByAutoId('recommendedACCWatchButton').click();
			cy.getByAutoId('accRequestModal').should('be.visible');
			cy.getByAutoId('ACCCloseRequestModal').click();
			cy.getByAutoId('accRequestModal').should('not.exist');
		});

		it('PBC-260: Should be able to open request form from View All cards', () => {
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('Request1on1Button').first().click();
			cy.getByAutoId('accRequestModal').should('be.visible');
			cy.getByAutoId('ACCCloseRequestModal').click();
			cy.getByAutoId('accRequestModal').should('not.exist');
			cy.getByAutoId('SuccessPathCloseModal').click();
		});

		it('PBC-260: Should be able to close or cancel request form', () => {
			cy.getByAutoId('recommendedACCWatchButton').click();
			cy.getByAutoId('accRequestModal').should('be.visible');
			cy.getByAutoId('ACCCloseRequestModal').click();
			cy.getByAutoId('accRequestModal').should('not.exist');

			cy.getByAutoId('recommendedACCWatchButton').click();
			cy.getByAutoId('accRequestModal').should('be.visible');
			cy.getByAutoId('accRequestModal-Cancel').click();
			cy.getByAutoId('accRequestModal').should('not.exist');
		});

		describe('Form field validation', () => {
			beforeEach(() => {
				// Start with a clean modal for each test
				cy.getByAutoId('recommendedACCWatchButton').click();
				cy.getByAutoId('accRequestModal').should('be.visible');
			});

			afterEach(() => {
				cy.getByAutoId('ACCCloseRequestModal').click();
				cy.getByAutoId('accRequestModal').should('not.exist');
			});

			it('PBC-260: Request 1-on-1 form should have all required fields', () => {
				// Check the titles
				cy.getByAutoId('accRequestModal-Title').should('have.text', i18n._Request1on1_);
				cy.getByAutoId('accRequestModal-SubTitle').should('have.text', i18n._FindCiscoExpert_);
				cy.getByAutoId('accRequestModal-ItemTitle').should('have.text', firstRecommendedACC.title);

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
					.click()
					.parent()
					.find('input')
					.should('be.checked');
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Afternoon')
					.parent()
					.find('input')
					.should('not.be.checked');

				// Swap options to afternoon, should un-check morning
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Afternoon')
					.click()
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
					.click()
					.parent()
					.find('input')
					.should('be.checked');
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-Cisco')
					.parent()
					.find('input')
					.should('not.be.checked');

				// Swap options to Cisco, should un-check NonProd
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-Cisco')
					.click()
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
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning').click();
				cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.20');
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
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.20');
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
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.20');
				cy.getByAutoId('accRequestModal-WhyInterestedAccelerator-Input').type('Automation - Test Interest');
				cy.getByAutoId('accRequestModal-WhatWouldLikeToSeeOutcome-Input').type('Automation - Test Outcome');

				cy.getByAutoId('accRequestModal-Submit').should('be.disabled');

				// Make selections for the radio options, submit should now be enabled
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning').click();
				cy.getByAutoId('accRequestModal-PreferredEnvironmentAccelerator-NonProd').click();

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
				cy.getByAutoId('recommendedACCWatchButton').click();
				cy.getByAutoId('accRequestModal').should('be.visible');

				// Fill in all required fields
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('1');
				cy.getByAutoId('accRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning').click();
				cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.20');
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
					url: `/api/customerportal/racetrack/v1/acc/${firstRecommendedACC.accId}/request`,
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
				cy.getByAutoId('recommendedACCWatchButton').click();
				cy.getByAutoId('accRequestModal').should('be.visible');

				// Fill in all required fields
				cy.getByAutoId('accRequestModal-NumberOfAttendees-Select').select('1');
				cy.getByAutoId('accRequestModal-TimeZone-Select').select(i18n['_EasternTime/US_']);
				cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning').click();
				cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
				cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.20');
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
					url: `/api/customerportal/racetrack/v1/acc/${firstRecommendedACC.accId}/request`,
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
				cy.getByAutoId('recommendedACCWatchButton').click();

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

				cy.getByAutoId('recommendedACCWatchButton').click();
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
				cy.getByAutoId('recommendedACCWatchButton').click();
				cy.getByAutoId('accRequestModal').should('be.visible');
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
					cy.getByAutoId('accRequestModal-PreferredTimeMeeting-Morning').click();
					cy.getByAutoId('accRequestModal-LanguagePreference-Select').select(i18n._English_);
					cy.getByAutoId('accRequestModal-DNACVersion-Select').select('1.20');
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
							.to.include(firstRecommendedACC.title);
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
							.to.include('1.20');
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
				cy.getByAutoId('SuccessPathCloseModal').click();
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
							cy.getByAutoId('Request1on1Button').click();
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
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		after(() => {
			// Switch back to card view and close View All modal
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ACCCard').should('be.visible');
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.be.visible');

			// Refresh the page to force-reset bookmarks
			cy.loadApp();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			// Close the setup wizard so it doesn't block other elements
			cy.getByAutoId('setup-wizard-header-close-btn').click();
		});

		it('ACC View All should be able to toggle between table and card views', () => {
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ACCCard').should('be.visible');
			cy.getByAutoId('ViewAllTable').should('not.be.visible');

			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ACCCard').should('not.be.visible');
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('ACC View All table view should have expected columns', () => {
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					cy.get('th').then($columnHeaders => {
						// Should be 4 columns (Bookmark, Name, Status, Buttons)
						expect($columnHeaders.length).to.eq(4);
					});
					cy.getByAutoId('ViewAllTable-columnHeader-Bookmark').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Name').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Status').should('exist');
					// Buttons column has no title
					cy.getByAutoId('ViewAllTable-columnHeader-').should('exist');
				});
		});

		it('ACC View All table view should have all data', () => {
			accItems.forEach((item, index) => {
				cy.get('tr').eq(index + 1).within(() => {
					cy.getByAutoId('ACC-Title').should('have.text', item.title);
					// Handle bookmark
					if (item.isFavorite) {
						cy.getByAutoId('SBListRibbon').should('have.class', 'text-indigo');
					} else {
						cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark-clear');
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
							// For recommended, status column is blank, we have a Request button instead
							cy.getByAutoId('Request1on1ACCButton').should('be.visible');
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
								message: `UNRECOGNIZED ACC STATUS TYPE: ${item.type} ! TREATING AS RECOMMENDED...`,
							});
							cy.getByAutoId('Request1on1ACCButton').should('be.visible');
					}
				});
			});
		});

		it('ACC View All table should not sort by default', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					accItems.forEach((item, index) => {
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
					const sortedItemsAsc = Cypress._.orderBy(accItems, ['isFavorite'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							if (item.isFavorite) {
								cy.getByAutoId('SBListRibbon').should('have.class', 'text-indigo');
							} else {
								cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark-clear');
							}
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('ViewAllTable-columnHeader-Bookmark').click();
					const sortedItemsDesc = Cypress._.orderBy(accItems, ['isFavorite'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							if (item.isFavorite) {
								cy.getByAutoId('SBListRibbon').should('have.class', 'text-indigo');
							} else {
								cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark-clear');
							}
						});
					});
				});
		});

		it('ACC View All table should be sortable by Name', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
					const sortedItemsAsc = Cypress._.orderBy(accItems, ['title'], ['asc']);
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
					const sortedItemsDesc = Cypress._.orderBy(accItems, ['title'], ['desc']);
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
					const sortedItemsAsc = Cypress._.orderBy(accItems, ['status'], ['asc']);
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
					const sortedItemsDesc = Cypress._.orderBy(accItems, ['status'], ['desc']);
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

					const filteredItems = accItems.filter(
						item => (item[filterMap.field] === filterMap.value)
					);
					cy.getByAutoId('ViewAllTable')
						.should('be.visible')
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
					.should('be.visible')
					.within(() => {
						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(accItems.length);
						});
					});
			});
		});

		it('ACC View All table view should allow requesting 1-on-1', () => {
			// Verify a Request 1-on-1 button is available for all recommended items, and clicking
			// it opens the request form
			accItems.forEach((item, index) => {
				if (item.status === 'recommended') {
					cy.get('tr').eq(index + 1).within(() => {
						cy.getByAutoId('Request1on1ACCButton')
							.should('be.visible')
							.click();
					});
					cy.getByAutoId('accRequestModal').should('be.visible');

					// Close the request form
					cy.getByAutoId('ACCCloseRequestModal').click();
					cy.getByAutoId('accRequestModal').should('not.exist');
				}
			});
		});

		it('ACC View All table view should allow bookmarking/unbookmarking items', () => {
			accItems.forEach((item, index) => {
				cy.get('tr').eq(index + 1).within(() => {
					if (item.isFavorite) {
						cy.getByAutoId('SBListRibbon')
							.should('have.class', 'text-indigo')
							.click();
						cy.wait(`(ACC) IBN-Bookmark-${item.accId}`);
						cy.getByAutoId('SBListRibbon')
							.should('have.class', 'icon-bookmark-clear');
					} else {
						cy.getByAutoId('SBListRibbon')
							.should('have.class', 'icon-bookmark-clear')
							.click();
						cy.wait(`(ACC) IBN-Bookmark-${item.accId}`);
						cy.getByAutoId('SBListRibbon')
							.should('have.class', 'text-indigo');
					}
				});
			});
		});

		it('ACC View All table should be able filter and sort together', () => {
			// Filter by status and sort
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="In progress"]').click();

				const filteredItems = accItems.filter(
					item => (item.status === 'in-progress')
				);
				cy.getByAutoId('ViewAllTable')
					.should('be.visible')
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
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		afterEach(() => {
			// Switch back to card view and close View All modal
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ACCCard').should('be.visible');
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.be.visible');

			// Make sure we're on the lifecycle page and the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');
		});

		it('ACC View All table sort should be sticky across modal close/re-open', () => {
			const sortedItemsAsc = Cypress._.orderBy(accItems, ['title'], ['asc']);

			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Close and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the still in table view and sort is still in place
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
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
			const sortedItemsAsc = Cypress._.orderBy(accItems, ['title'], ['asc']);

			// Sort the data
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Switch to card view, verify the sort is still in place
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ViewAllModal').within(() => {
				sortedItemsAsc.forEach((item, index) => {
					cy.getByAutoId('ACCCard')
						.eq(index)
						.should('contain', item.title);
				});
			});

			// Switch back to table view, verify sort is still in place
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
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
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
			cy.wait('(SP) IBN-Campus Network Segmentation-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify still in table view and sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					accItems.forEach((item, index) => {
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
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					accItems.forEach((item, index) => {
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
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			// Close the setup wizard so it doesn't block other elements
			cy.getByAutoId('setup-wizard-header-close-btn').click();

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					accItems.forEach((item, index) => {
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
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		afterEach(() => {
			// Switch back to card view and close View All modal
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ACCCard').should('be.visible');
			cy.getByAutoId('SuccessPathCloseModal').click();
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
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter is still in place
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
				const filteredItems = accItems.filter(item => (item.status === 'requested'));
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
			cy.getByAutoId('card-view-btn').click();
			const filteredItems = accItems.filter(item => (item.status === 'requested'));
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
				cy.getByAutoId('ACCCard').then($cards => {
					expect($cards.length).to.eq(filteredItems.length);
				});
			});

			// Switch back to table view, verify the filter is still in place
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
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
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
			cy.wait('(SP) IBN-Campus Network Segmentation-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
			cy.get('tr').then($rows => {
				// Note that the first tr is the column headers
				expect($rows.length - 1).to.eq(accItems.length);
			});
		});

		it('ACC View All table filter should NOT be sticky across page navigation', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Requested"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
			});

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
			cy.get('tr').then($rows => {
				// Note that the first tr is the column headers
				expect($rows.length - 1).to.eq(accItems.length);
			});
		});

		it('ACC View All table filter should NOT be sticky across page reload', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Requested"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
			});

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			// Close the setup wizard so it doesn't block other elements
			cy.getByAutoId('setup-wizard-header-close-btn').click();

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
			cy.get('tr').then($rows => {
				// Note that the first tr is the column headers
				expect($rows.length - 1).to.eq(accItems.length);
			});
		});
	});

	describe('PBC-236: ACC View All table vs card view stickiness', () => {
		beforeEach(() => {
			// Open the modal and ensure we're in card view
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ACCCard').should('be.visible');
		});

		afterEach(() => {
			// Switch to back to card view and close the modal
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('SuccessPathCloseModal').click();
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
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Close and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');

			// Verify we're still in table view
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('ACC View All table vs. card view should be sticky across usecase change', () => {
			// Switch to table view
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Close the modal, switch use cases, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');

			// Verify we're still in table view
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('ACC View All table vs. card view should be sticky across page navigation', () => {
			// Switch to table view
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');

			// Verify we're still in table view
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('ACC View All table vs. card view should be sticky across page reload', () => {
			// Switch to table view
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(ACC) IBN-Campus Network Assurance-Onboard');

			// Close the setup wizard so it doesn't block other elements
			cy.getByAutoId('setup-wizard-header-close-btn').click();

			// Close the setup wizard so it doesn't block other elements
			// cy.getByAutoId('setup-wizard-header-close-btn').click();

			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');

			// Verify we're still in table view
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});
	});

	describe('PBC-237: (UI) View -  Lifecycle - ACC Status Ribbons', () => {
		before(() => {
			cy.getByAutoId('ShowModalPanel-_Accelerator_').click();
		});

		after(() => {
			cy.getByAutoId('SuccessPathCloseModal').click();

			// Reload the page to force-reset any changed bookmarks
			// This is required since the mock bookmark APIs don't actually bookmark the ACC items
			cy.loadApp();
			cy.waitForAppLoading();

			// Close the setup wizard so it doesn't block other elements
			cy.getByAutoId('setup-wizard-header-close-btn').click();

			// Wait for the ACC panel to finish loading
			cy.waitForAppLoading('accLoading', 15000);
		});

		it('Should be able to bookmark an ACC item', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				validACCItems.forEach((acc, index) => {
					if (!acc.isFavorite) {
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__white')
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
			cy.getByAutoId('ViewAllModal').within(() => {
				validACCItems.forEach((acc, index) => {
					if (acc.isFavorite) {
						cy.getByAutoId('ACCCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__blue')
							.click();
						cy.waitForAppLoading('accLoading', 5000);
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
			cy.getByAutoId('moreACCList-Header');
			cy.getByAutoId('moreACCList').should('not.exist');
		});

		it('ACC More list items should have hover modal', () => {
			const accMoreItems = visibleACCItems.slice(1, 3);
			accMoreItems.forEach((acc, index) => {
				cy.getByAutoId('moreACCList-item').eq(index).within(() => {
					cy.getByAutoId('moreACCList-HoverModal').should('exist').within(() => {
						cy.getByAutoId('moreACCList-HoverModal-Title').should('have.text', acc.title);
						cy.getByAutoId('moreACCList-HoverModal-Description').should('have.text', acc.description);
						cy.getByAutoId('ACCCardRibbon').should('exist');

						// Ribbon is blue for bookmarked, white otherwise
						if (acc.isFavorite) {
							cy.getByAutoId('ACCCardRibbon').should('have.class', 'ribbon__blue');
							cy.getByAutoId('.star').should('not.exist');
						} else {
							cy.getByAutoId('ACCCardRibbon').should('have.class', 'ribbon__white');
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
