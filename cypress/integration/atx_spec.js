import MockService from '../support/mockService';

const atxMock = new MockService('ATXScenarios');
const atxOnboardScenario = atxMock.getScenario('GET', '(ATX) IBN-Campus Network Assurance-Onboard');
const atxItems = atxOnboardScenario.response.body.items;
const visibleATXItems = atxItems.slice(0, 3);
const invisibleATXItems = atxItems.slice(3);
const firstATXSessions = atxItems[0].sessions;

const scheduledItems = atxMock.getScenario('GET', '(ATX) IBN-Campus Network Assurance-Onboard-twoScheduled').response.body.items;

const atxFilters = [
	{ filter: 'Recommended', field: 'status', value: 'recommended' },
	{ filter: 'Requested', field: 'status', value: 'requested' },
	{ filter: 'Scheduled', field: 'status', value: 'scheduled' },
	{ filter: 'Completed', field: 'status', value: 'completed' },
	{ filter: 'Bookmarked', field: 'bookmark', value: true },
	{ filter: 'Not bookmarked', field: 'bookmark', value: false },
];

const formatDate = atxItem => {
	const scheduledSession = Cypress._.find(atxItem.sessions,
		session => session.scheduled === true);
	return Cypress.moment(new Date(scheduledSession.sessionStartDate)).format('MMM D, YYYY, h:mm:ss A');
};

const i18n = require('../../src/assets/i18n/en-US.json');

describe('Ask The Expert (ATX)', () => { // PBC-31
	before(() => {
		cy.login();
		cy.loadApp();

		// Disable the setup wizard and quick tour so they don't block other elements
		cy.window().then(win => {
			win.Cypress.hideDNACHeader = true;
			win.Cypress.showQuickTour = false;
		});

		cy.waitForAppLoading();

		// Wait for the ATX panel to finish loading
		cy.waitForAppLoading('atxLoading', 15000);
	});

	it('Renders ATX tile', () => {
		cy.getByAutoId('PanelTitle-_AskTheExpert_').should('have.text', 'Ask The Expert');
		cy.getByAutoId('recommendedATX')
			.should('be.visible')
			.within(() => {
				if (atxItems[0].bookmark) {
					cy.getByAutoId('SBCardRibbon')
						.should('be.visible')
						.and('have.class', 'ribbon__blue');
				} else {
					cy.getByAutoId('SBCardRibbon')
						.should('be.visible')
						.and('have.class', 'ribbon__white');
				}
				cy.getByAutoId('recommendedATX-Image')
					.should('be.visible')
					.and('have.attr', 'src', atxItems[0].imageURL);
				cy.getByAutoId('recommendedATX-Title')
					.should('have.text', atxItems[0].title);
				cy.getByAutoId('recommendedATXScheduleButton').should('exist');
				cy.getByAutoId('recommendedATXWatchButton').should('exist');
			});
		cy.getByAutoId('moreATXList').then($list => {
			// More list should only display up to two items
			visibleATXItems.forEach((item, index) => {
				if (index !== 0) { // Ignore recommended title
					cy.wrap($list).should('contain', item.title);
				}
			});
			invisibleATXItems.forEach(item => {
				cy.wrap($list).should('not.contain', item.title);
			});
		});
	});

	it('Displays a modal with all available sessions', () => {
		cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
		cy.getByAutoId('ViewAllModal-Title').should('contain', i18n._AskTheExpert_);
		cy.getByAutoId('ViewAllModal-Subtitle').should('contain', i18n._AvailableLive_);
		cy.getByAutoId('ATXTopicsAvailable').should(
			'have.text', `${atxItems.length} topics available for IBN > Campus Network Assurance:`
		);

		cy.getByAutoId('ATXCard').should('have.length', atxItems.length);

		atxItems.forEach((atx, index) => {
			cy.getByAutoId('ATXCard').eq(index).within(() => {
				cy.getByAutoId('ATXCardTitle').should('have.text', atx.title);
				cy.getByAutoId('cardRecommendedATXScheduleButton')
					.should('contain', i18n._ViewSessions_);
				cy.getByAutoId('recommendedATXWatchButton')
					.should('contain', i18n._WatchNow_);
				// If the description contains \n, those get converted to <br>, which breaks text
				// matching. Thus, split the string on \n, and verify each section exists
				const splitDescription = atx.description.split('\n');
				splitDescription.forEach(substring => {
					cy.get('.atx__card__body').should('contain', substring);
				});
				switch (atx.status) {
					case 'completed':
						cy.getByAutoId('ATXCardFooter')
							.should('contain', i18n._Completed_);
						break;
					case 'in-progress':
						cy.getByAutoId('ATXCardFooter')
							.should('contain', i18n._InProgress_);
						break;
					case 'requested':
						cy.getByAutoId('ATXCardFooter')
							.should('contain', i18n._Requested_);
						break;
					case 'scheduled':
						cy.getByAutoId('ATXCardFooter-ScheduledIcon').should('be.visible');
						cy.getByAutoId('ATXCardFooter-ScheduledDate').should('have.text', formatDate(atx));
						break;
					default:
						// Default: recommended, has nothing special
				}

				// PBC-237 Check bookmark ribbon
				if (atx.bookmark) {
					cy.getByAutoId('ATXCardRibbon')
						.should('have.class', 'ribbon__blue');
				} else {
					cy.getByAutoId('ATXCardRibbon')
						.should('have.class', 'ribbon__white');
				}
			});
		});
		cy.getByAutoId('SuccessPathCloseModal').click();
	});

	it('ATX Tile Tooltip', () => {
		// PBC-282: We will show the first item in the tile, regardless of status (we rely on API
		// to perform our default sort). Mock data has a 'scheduled' item first
		cy.getByAutoId('recommendedATX')
			.should('be.visible')
			.within(() => {
				const firstItem = atxItems[0];
				const scheduledSession = Cypress._.find(firstItem.sessions,
					session => session.scheduled === true);
				cy.getByAutoId('SBCardRibbon').should('have.class', firstItem.bookmark ? 'ribbon__blue' : 'ribbon__white');
				cy.getByAutoId('recommendedATX-Image').should('have.attr', 'src', firstItem.imageURL);
				cy.getByAutoId('recommendedATX-Title').should('have.text', firstItem.title);
				cy.getByAutoId('recommendedATX-Calendar').should('be.visible');
				cy.getByAutoId('recommendedATX-Date').should('have.text', formatDate(firstItem));
				cy.getByAutoId('recommendedATX-Presenter').should('have.text', `Instructor: ${scheduledSession.presenterName}`);
				cy.getByAutoId('recommendedATXScheduleButton').should('be.visible');
				cy.getByAutoId('recommendedATXWatchButton').should('be.visible');
			});
	});

	describe('PBC-14: (UI) View - Solution Based: ATX Details', () => {
		describe('PBC-140: UI Layout', () => {
			beforeEach(() => {
				// Ensure we're on the default mock data
				atxMock.enable('(ATX) IBN-Campus Network Assurance-Onboard');

				// Refresh the data
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(ATX) IBN-Campus Network Assurance-Onboard');
			});

			afterEach(() => {
				// Switch back to the default mock data
				atxMock.enable('(ATX) IBN-Campus Network Assurance-Onboard');

				// Refresh the data
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(ATX) IBN-Campus Network Assurance-Onboard');
			});

			it('First ATX item should show scheduled session date if scheduled', () => {
				cy.getByAutoId('recommendedATX')
					.should('be.visible')
					.within(() => {
						// When the first item has a scheduled session, should show a calandar and
						// first scheduled session's date and instructor
						cy.get('span').should('have.class', 'icon-calendar');
						const scheduledSession = Cypress._.find(
							firstATXSessions, session => session.scheduled === true
						);
						cy.getByAutoId('recommendedATX-Date').should('have.text', formatDate(atxItems[0]));
						cy.getByAutoId('recommendedATX-Presenter').should('have.text', `Instructor: ${scheduledSession.presenterName}`);
					});
			});
		});
	});

	describe('PBC-101: (UI) View - Solution Racetrack - View Completed ATXs', () => {
		before(() => {
			// Switch to a mock with all completed items
			atxMock.enable('(ATX) IBN-Campus Network Assurance-Onboard-twoCompleted');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ATX) IBN-Campus Network Assurance-Onboard-twoCompleted');
		});

		after(() => {
			// Switch back to the default mock data
			atxMock.enable('(ATX) IBN-Campus Network Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ATX) IBN-Campus Network Assurance-Onboard');
		});

		it('Should show completed icons on Lifecycle page', () => {
			cy.getByAutoId('moreATXList-item').each($moreListItem => {
				cy.wrap($moreListItem).within(() => {
					cy.getByAutoId('moreATXList-Checkmark').should('exist');
				});
			});
		});

		it('Should show completed icons in View All modal card view', () => {
			// Open the View All modal and ensure we're in card view
			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ATXCard').should('be.visible');

			// Verify each completed item's card includes the completed icon
			cy.getByAutoId('ATXCardFooter').each($atxCard => {
				cy.wrap($atxCard).within(() => {
					cy.getByAutoId('ATXCardFooter-CompletedIcon').should('be.visible');
					cy.getByAutoId('ATXCardFooter-CompletedText')
						.should('be.visible')
						.and('have.text', i18n._Completed_);
				});
			});

			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});

		it('Should show completed icons in View All modal table view', () => {
			// Open the View All modal and ensure we're in table view
			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Verify each completed item's card includes the completed icon
			cy.getByAutoId('Table-Status-Completed').each($tableRowStatus => {
				cy.wrap($tableRowStatus).within(() => {
					cy.getByAutoId('Table-Status-Completed-Icon').should('be.visible');
					cy.getByAutoId('Table-Status-Completed-Text')
						.should('be.visible')
						.and('have.text', i18n._Completed_);
				});
			});

			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});
	});

	describe('PBC-102: (UI) View - Solution Racetrack - View Scheduled ATXs', () => {
		before(() => {
			// Switch to a mock with all scheduled items
			atxMock.enable('(ATX) IBN-Campus Network Assurance-Onboard-twoScheduled');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ATX) IBN-Campus Network Assurance-Onboard-twoScheduled');
		});

		after(() => {
			// Switch back to the default mock data
			atxMock.enable('(ATX) IBN-Campus Network Assurance-Onboard');

			// Refresh the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ATX) IBN-Campus Network Assurance-Onboard');
		});

		it('Should show scheduled icons/dates on Lifecycle page', () => {
			cy.getByAutoId('recommendedATX')
				.should('be.visible')
				.within(() => {
					const session = scheduledItems[0].sessions[0];
					cy.getByAutoId('recommendedATX-Date').should('have.text', formatDate(scheduledItems[0]));
					cy.getByAutoId('recommendedATX-Presenter').should('have.text', `Instructor: ${session.presenterName}`);
					cy.getByAutoId('recommendedATX-Calendar').should('exist');
				});
		});

		it('Should show scheduled icons/dates in View All modal card view', () => {
			// Open the View All modal and ensure we're in card view
			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ATXCard').should('be.visible');

			// Verify each completed item's card includes the completed icon
			cy.getByAutoId('ATXCardFooter').each(($atxCard, index) => {
				cy.wrap($atxCard).within(() => {
					cy.getByAutoId('ATXCardFooter-ScheduledDate').should('have.text', formatDate(scheduledItems[index]));
					cy.getByAutoId('ATXCardFooter-ScheduledIcon').should('exist');
				});
			});

			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});

		it('Should show scheduled icons/dates in View All modal table view', () => {
			// Open the View All modal and ensure we're in table view
			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Verify each completed item's card includes the completed icon
			cy.getByAutoId('Table-Status-Scheduled').each(($tableRowStatus, index) => {
				cy.wrap($tableRowStatus).within(() => {
					cy.getByAutoId('scheduledDate').should('have.text', formatDate(scheduledItems[index]));
					cy.getByAutoId('Table-Status-Scheduled-Icon').should('exist');
				});
			});

			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});
	});

	describe('PBC-103: (UI) View - Solution Racetrack - Schedule an ATX', () => {
		it('Should be able to schedule an ATX session from the Lifecycle page', () => {
			cy.getByAutoId('recommendedATXScheduleButton').click();
			cy.getByAutoId('atxScheduleCard')
				.should('be.visible')
				.within(() => {
					// Register button should be disabled until a session is selected
					cy.getByAutoId('AtxScheduleCardRegisterButton').should('have.class', 'disabled');

					// Click the first session, verify the register button is enabled and has correct link
					cy.getByAutoId(`SelectSession-${firstATXSessions[0].sessionId}`).click();
					cy.getByAutoId('AtxScheduleCardRegisterButton')
						.should('not.have.class', 'disabled')
						.parent()
						.should('have.attr', 'href', firstATXSessions[0].registrationURL)
						.and('have.attr', 'target', '_blank');
				});

			// Close the schedule pop-up
			cy.getByAutoId('AtxScheduleCardClose').click();
			cy.getByAutoId('atxScheduleCard').should('not.exist');
		});

		it('Should be able to schedule an ATX session from View All card view', () => {
			// Open the View All modal and switch to card view
			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ATXCard').should('be.visible');

			// Open the schedule pop-up
			cy.getByAutoId('ATXCard').eq(0).within(() => {
				cy.getByAutoId('cardRecommendedATXScheduleButton').click();
				cy.getByAutoId('atxScheduleCard')
					.should('be.visible')
					.within(() => {
						// Register button should be disabled until a session is selected
						cy.getByAutoId('AtxScheduleCardRegisterButton').should('have.class', 'disabled');

						// Click the first session, verify the register button is enabled and has correct link
						cy.getByAutoId(`SelectSession-${firstATXSessions[0].sessionId}`).click();
						cy.getByAutoId('AtxScheduleCardRegisterButton')
							.should('not.have.class', 'disabled')
							.parent()
							.should('have.attr', 'href', firstATXSessions[0].registrationURL)
							.and('have.attr', 'target', '_blank');
					});
			});

			// Close the schedule pop-up
			cy.getByAutoId('AtxScheduleCardClose').click();
			cy.getByAutoId('atxScheduleCard').should('not.exist');

			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});

		it('Should be able to schedule an ATX session from View All table view', () => {
			// Open the View All modal and switch to table view
			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					// Open the schedule pop-up
					cy.get('tr').eq(1).within(() => {
						cy.getByAutoId('ViewSessionButton').click();
					});
				});

			cy.getByAutoId('atxScheduleCard')
				.should('be.visible')
				.within(() => {
					// Register button should be disabled until a session is selected
					cy.getByAutoId('AtxScheduleCardRegisterButton').should('have.class', 'disabled');

					// Click the first session, verify the register button is enabled and has
					// correct link
					cy.getByAutoId(`SelectSession-${firstATXSessions[0].sessionId}`).click();
					cy.getByAutoId('AtxScheduleCardRegisterButton')
						.should('not.have.class', 'disabled')
						.parent()
						.should('have.attr', 'href', firstATXSessions[0].registrationURL)
						.and('have.attr', 'target', '_blank');
				});

			// Close the schedule pop-up
			cy.getByAutoId('AtxScheduleCardClose').click();
			cy.getByAutoId('atxScheduleCard').should('not.exist');

			// Switch back to card view and close the View All modal
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ATXCard').should('be.visible');
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});

		it('Should prevent registering for the same session twice', () => {
			// Open the View Sessions pop-up
			cy.getByAutoId('recommendedATXScheduleButton').click();
			cy.getByAutoId('atxScheduleCard')
				.should('be.visible')
				.within(() => {
					// Select an already registered session, verify "Register" button remains disabled
					const scheduledSession = Cypress._.find(firstATXSessions,
						session => session.scheduled === true);
					cy.getByAutoId(`SelectSession-${scheduledSession.sessionId}`).click();
					cy.getByAutoId('AtxScheduleCardRegisterButton').should('have.class', 'disabled');
				});

			// Close the schedule pop-up
			cy.getByAutoId('AtxScheduleCardClose').click();
			cy.getByAutoId('atxScheduleCard').should('not.exist');
		});
	});

	describe('PBC-377: (UI View) - Lifecycle -  Register for ATX in Next Pitstop', () => {
		after(() => {
			// Reset the view to the currentPitstop
			cy.get('#racecar').click();
		});

		it('Should allow scheduling of an ATX on the current pitstop', () => {
			// Open the sessions modal, select a session, and verify button is enabled
			cy.getByAutoId('recommendedATXScheduleButton').click();
			cy.getByAutoId('atxScheduleCard').should('be.visible');
			cy.getByAutoId(`SelectSession-${firstATXSessions[0].sessionId}`).click();
			cy.getByAutoId('AtxScheduleCardRegisterButton').should('not.have.class', 'disabled');

			// Close the modal
			cy.getByAutoId('AtxScheduleCardClose').click();
			cy.getByAutoId('atxScheduleCard').should('not.exist');
		});

		it('Should allow scheduling of an ATX on the next pitstop', () => {
			// Move the preview to the next pitstop
			cy.getByAutoId('Racetrack-Point-implement').click();
			cy.wait('(ATX) IBN-Campus Network Assurance-Implement', { timeout: 5000 });

			// Open the sessions modal, select a session, and verify button is enabled
			cy.getByAutoId('recommendedATXScheduleButton').click();
			cy.getByAutoId('atxScheduleCard').should('be.visible');
			cy.getByAutoId(`SelectSession-${firstATXSessions[0].sessionId}`).click();
			cy.getByAutoId('AtxScheduleCardRegisterButton').should('not.have.class', 'disabled');

			// Close the modal
			cy.getByAutoId('AtxScheduleCardClose').click();
			cy.getByAutoId('atxScheduleCard').should('not.exist');
		});

		it('Should NOT allow scheduling of an ATX on the after next pitstop', () => {
			// Move the preview to the next pitstop
			cy.getByAutoId('Racetrack-Point-use').click();

			// Open the sessions modal, select a session, and verify button is NOT enabled
			cy.getByAutoId('recommendedATXScheduleButton').click();
			cy.getByAutoId('atxScheduleCard').should('be.visible');
			cy.getByAutoId(`SelectSession-${firstATXSessions[0].sessionId}`).click();
			cy.getByAutoId('AtxScheduleCardRegisterButton').should('have.class', 'disabled');

			// Close the modal
			cy.getByAutoId('AtxScheduleCardClose').click();
			cy.getByAutoId('atxScheduleCard').should('not.exist');
		});
	});

	describe('PBC-452: (UI) View - ATX Table View', () => {
		before(() => {
			// Open the View All modal and switch to table view
			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		after(() => {
			// Switch back to card view and close View All modal
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ATXCard').should('be.visible');
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.be.visible');

			// Refresh the page to force-reset bookmarks
			cy.loadApp();
			cy.waitForAppLoading('atxLoading', 15000);
		});

		it('ATX View All should be able to toggle between table and card views', () => {
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ATXCard').should('be.visible');
			cy.getByAutoId('ViewAllTable').should('not.be.visible');

			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ATXCard').should('not.be.visible');
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('ATX View All table view should have expected columns', () => {
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					cy.get('th').then($columnHeaders => {
						// Should be 4 columns (Bookmark, Name, Status, Action)
						expect($columnHeaders.length).to.eq(4);
					});
					cy.getByAutoId('ViewAllTable-columnHeader-Bookmark').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Name').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Status').should('exist');
				});
		});

		it('ATX View All table view should have all data', () => {
			atxItems.forEach((item, index) => {
				cy.get('tr').eq(index + 1).within(() => {
					cy.getByAutoId('ATX-Title').should('have.text', item.title);
					// Handle bookmark
					if (item.bookmark) {
						cy.getByAutoId('SBListRibbon').should('have.class', 'text-indigo');
					} else {
						cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark-clear');
					}
					// Handle status
					switch (item.status) {
						case 'requested':
							cy.getByAutoId('Table-Status-Requested')
								.should('be.visible')
								.within(() => {
									cy.get('span').should('have.class', 'icon-check-outline');
								});
							break;
						case 'in-progress':
							cy.getByAutoId('Table-Status-InProgress')
								.should('be.visible')
								.within(() => {
									cy.get('span').should('have.class', 'icon-clock');
								});
							break;
						case 'scheduled':
							cy.getByAutoId('Table-Status-Scheduled')
								.should('be.visible')
								.within(() => {
									// Scheduled items should show a calandar, and the scheduled date
									cy.get('span').should('have.class', 'icon-calendar');
									cy.getByAutoId('scheduledDate').should('have.text', formatDate(item));
								});
							break;
						case 'completed':
							cy.getByAutoId('Table-Status-Completed')
								.should('be.visible')
								.within(() => {
									cy.get('span').should('have.class', 'icon-certified');
								});
							break;
						case 'recommended':
							// Recommended items have no status text according to mockups:
							// https://cisco.invisionapp.com/d/main#/console/17190680/374150316/preview
							Cypress.log({
								name: 'LOG',
								message: `IGNORING ATX STATUS TYPE: ${item.status}`,
							});
							break;
						default:
							Cypress.log({
								name: 'LOG',
								message: `UNRECOGNIZED ATX STATUS TYPE: ${item.status} ! TREATING AS COMPLETED...`,
							});
							cy.getByAutoId('Table-Status-Completed').should('be.visible');
					}
				});
			});
		});

		it('ATX View All table should not sort by default', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					atxItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							cy.getByAutoId('ATX-Title').should('have.text', item.title);
						});
					});
				});
		});

		it('ATX View All table should be sortable by Bookmark', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Bookmark').click();
					const sortedItemsAsc = Cypress._.orderBy(atxItems, ['bookmark'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							if (item.bookmark) {
								cy.getByAutoId('SBListRibbon').should('have.class', 'text-indigo');
							} else {
								cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark-clear');
							}
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('ViewAllTable-columnHeader-Bookmark').click();
					const sortedItemsDesc = Cypress._.orderBy(atxItems, ['bookmark'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							if (item.bookmark) {
								cy.getByAutoId('SBListRibbon').should('have.class', 'text-indigo');
							} else {
								cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark-clear');
							}
						});
					});
				});
		});

		it('ATX View All table should be sortable by Name', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
					const sortedItemsAsc = Cypress._.orderBy(atxItems, ['title'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ATX-Title').should('have.text', item.title);
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
					const sortedItemsDesc = Cypress._.orderBy(atxItems, ['title'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ATX-Title').should('have.text', item.title);
						});
					});
				});
		});

		it('ATX View All table should be sortable by Status', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Status').click();
					const sortedItemsAsc = Cypress._.orderBy(atxItems, ['status'], ['asc']);
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
								case 'scheduled':
									cy.getByAutoId('Table-Status-Scheduled').should('be.visible');
									break;
								case 'completed':
									cy.getByAutoId('Table-Status-Completed').should('be.visible');
									break;
								case 'recommended':
									// Recommended items have no status text according to mockups:
									// https://cisco.invisionapp.com/d/main#/console/17190680/374150316/preview
									Cypress.log({
										name: 'LOG',
										message: `IGNORING ATX STATUS TYPE: ${item.status}`,
									});
									break;
								default:
									Cypress.log({
										name: 'LOG',
										message: `UNRECOGNIZED ATX STATUS TYPE: ${item.status} ! TREATING AS COMPLETED...`,
									});
									cy.getByAutoId('Table-Status-Completed').should('be.visible');
							}
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('ViewAllTable-columnHeader-Status').click();
					const sortedItemsDesc = Cypress._.orderBy(atxItems, ['status'], ['desc']);
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
								case 'scheduled':
									cy.getByAutoId('Table-Status-Scheduled').should('be.visible');
									break;
								case 'completed':
									cy.getByAutoId('Table-Status-Completed').should('be.visible');
									break;
								case 'recommended':
									// Recommended items have no status text according to mockups:
									// https://cisco.invisionapp.com/d/main#/console/17190680/374150316/preview
									Cypress.log({
										name: 'LOG',
										message: `IGNORING ATX STATUS TYPE: ${item.status}`,
									});
									break;
								default:
									Cypress.log({
										name: 'LOG',
										message: `UNRECOGNIZED ATX STATUS TYPE: ${item.status} ! TREATING AS COMPLETED...`,
									});
									cy.getByAutoId('Table-Status-Completed').should('be.visible');
							}
						});
					});
				});
		});

		atxFilters.forEach(filterMap => {
			it(`ATX View All should be able to filter by status: ${filterMap.filter}`, () => {
				// Filter by status, verify the count
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get(`a[title="${filterMap.filter}"]`).click();

					const filteredItems = atxItems.filter(
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

		it('ATX View All should be able to filter by status: All titles', () => {
			// Filter by status, verify the count
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="All titles"]').click();

				cy.getByAutoId('ViewAllTable')
					.should('be.visible')
					.within(() => {
						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(atxItems.length);
						});
					});
			});
		});

		it('ATX View All table view should allow scheduling', () => {
			// Verify a View Seesions button is available for all rows, and clicking it opens the
			// atxScheduleCard with all the item's sessions
			atxItems.forEach((item, index) => {
				cy.get('tr').eq(index + 1).within(() => {
					cy.getByAutoId('ViewSessionButton')
						.should('be.visible')
						.click();
				});
				cy.getByAutoId('atxScheduleCard')
					.should('be.visible').within(() => {
						cy.get('tr').then($rows => {
							expect($rows.length).to.eq(item.sessions.length);
						});
						cy.getByAutoId('AtxScheduleCardClose').click();
						cy.getByAutoId('atxScheduleCard').should('not.be.visible');
					});
			});
		});

		it('ATX View All table view should allow Watch Now cross-launch', () => {
			atxItems.forEach((item, index) => {
				cy.get('tr').eq(index + 1).within(() => {
					cy.getByAutoId('WatchnowButton')
						.should('be.visible')
						.parent()
						.should('have.attr', 'href', item.recordingURL)
						.and('have.attr', 'target', '_blank');
				});
			});
		});

		it('ATX View All table view should allow bookmarking/unbookmarking items', () => {
			atxItems.forEach((item, index) => {
				cy.get('tr').eq(index + 1).within(() => {
					if (item.status !== 'completed') {
						if (item.bookmark) {
							cy.getByAutoId('SBListRibbon')
								.should('have.class', 'text-indigo')
								.click();
							cy.wait('(SB) IBN-Bookmark');
							cy.getByAutoId('SBListRibbon')
								.should('have.class', 'icon-bookmark-clear');
						} else {
							cy.getByAutoId('SBListRibbon')
								.should('have.class', 'icon-bookmark-clear')
								.click();
							cy.wait('(SB) IBN-Bookmark');
							cy.getByAutoId('SBListRibbon')
								.should('have.class', 'text-indigo');
						}
					}
				});
			});
		});
	});

	describe('PBC-452: ATX View All table sorting stickiness', () => {
		beforeEach(() => {
			// Open the View All modal and switch to table view
			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		afterEach(() => {
			// Switch back to card view and close View All modal
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ATXCard').should('be.visible');
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.be.visible');

			// Make sure we're on the lifecycle page and the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ATX) IBN-Campus Network Assurance-Onboard');
		});

		it('ATX View All table sort should be sticky across modal close/re-open', () => {
			const sortedItemsAsc = Cypress._.orderBy(atxItems, ['title'], ['asc']);

			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Close and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
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
							cy.getByAutoId('ATX-Title').should('have.text', item.title);
						});
					});
				});
		});

		it('ATX View All table sort should be sticky across table/card view', () => {
			const sortedItemsAsc = Cypress._.orderBy(atxItems, ['title'], ['asc']);

			// Sort the data
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Switch to card view, verify the sort is still in place
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ViewAllModal').within(() => {
				sortedItemsAsc.forEach((item, index) => {
					cy.getByAutoId('ATXCard')
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
							cy.getByAutoId('ATX-Title').should('have.text', item.title);
						});
					});
				});
		});

		it('ATX View All table sort should NOT be sticky across use case changes', () => {
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

			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify still in table view and sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					atxItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ATX-Title').should('have.text', item.title);
						});
					});
				});
		});

		it('ATX View All table sort should NOT be sticky across page navigation', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ATX) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					atxItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ATX-Title').should('have.text', item.title);
						});
					});
				});
		});

		it('ATX View All table sort should NOT be sticky across page reload', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(ATX) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					atxItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ATX-Title').should('have.text', item.title);
						});
					});
				});
		});
	});

	describe('PBC-452: ATX View All table filter stickiness', () => {
		beforeEach(() => {
			// Open the View All modal and switch to table view
			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		afterEach(() => {
			// Switch back to card view and close View All modal
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ATXCard').should('be.visible');
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.be.visible');

			// Make sure we're on the lifecycle page and the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ATX) IBN-Campus Network Assurance-Onboard');
		});

		it('ATX View All table filter should be sticky across modal close/re-open', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Requested"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
			});

			// Close and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter is still in place
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
				const filteredItems = atxItems.filter(item => (item.status === 'requested'));
				cy.get('tr').then($rows => {
					// Note that the first tr is the column headers
					expect($rows.length - 1).to.eq(filteredItems.length);
				});
			});
		});

		it('ATX View All table filter should be sticky across table/card view', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Requested"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
			});

			// Switch to card view, verify the filter is still in place
			cy.getByAutoId('card-view-btn').click();
			const filteredItems = atxItems.filter(item => (item.status === 'requested'));
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
				cy.getByAutoId('ATXCard').should('have.length', filteredItems.length);
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

		it('ATX View All table filter should NOT be sticky across use case changes', () => {
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

			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
			cy.get('tr').then($rows => {
				// Note that the first tr is the column headers
				expect($rows.length - 1).to.eq(atxItems.length);
			});
		});

		it('ATX View All table filter should NOT be sticky across page navigation', () => {
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
			cy.wait('(ATX) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
			cy.get('tr').then($rows => {
				// Note that the first tr is the column headers
				expect($rows.length - 1).to.eq(atxItems.length);
			});
		});

		it('ATX View All table filter should NOT be sticky across page reload', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Requested"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Requested');
			});

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(ATX) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
			cy.get('tr').then($rows => {
				// Note that the first tr is the column headers
				expect($rows.length - 1).to.eq(atxItems.length);
			});
		});
	});

	describe('PBC-452: ATX View All table vs card view stickiness', () => {
		beforeEach(() => {
			// Open the modal and ensure we're in card view
			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ATXCard').should('be.visible');
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
			cy.wait('(ATX) IBN-Campus Network Assurance-Onboard');
		});

		it('ATX View All table vs. card view should be sticky across modal close/re-open', () => {
			// Switch to table view
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Close and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');

			// Verify we're still in table view
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('ATX View All table vs. card view should be sticky across usecase change', () => {
			// Switch to table view
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Close the modal, switch use cases, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();

			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');

			// Verify we're still in table view
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('ATX View All table vs. card view should be sticky across page navigation', () => {
			// Switch to table view
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(ATX) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');

			// Verify we're still in table view
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('ATX View All table vs. card view should be sticky across page reload', () => {
			// Switch to table view
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable').should('be.visible');

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(ATX) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_AskTheExpert_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');

			// Verify we're still in table view
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});
	});
});
